/**
 * FIFO vs AVCO Master - Main UI Controller & Game Loop
 */

(function () {
  'use strict';

  // State instances
  const Storage = new window.InventoryStorage();
  const Audio = window.InventoryAudio;
  const Engine = window.InventoryEngine;
  const Data = window.FIFO_LIFO_DATA;

  // App UI State
  const AppState = {
    currentTab: 'simulator',
    
    // Mode 1: Simulator State
    sim: {
      scenarioIndex: 0,
      currentStep: 0,
      autoPlayTimer: null,
      methodFilter: 'ALL',
      activeLedgerTab: 'FIFO_PERPETUAL'
    },

    // Mode 2: Dispatcher State
    disp: {
      missionIndex: 0,
      allocations: {}, // { batchId: units }
      isSubmitted: false
    },

    // Mode 3: Exam Arena State
    exam: {
      questionIndex: 0,
      isAnswered: false
    },

    // Mode 4: CFO Strategy State
    cfo: {
      currentScenarioId: 'apex_inflation'
    },

    // Mode 5: Sandbox State
    sandbox: {
      transactions: [],
      lastResults: null
    }
  };

  // ============================================================
  // DOM UTILITIES & HELPERS
  // ============================================================
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  function formatMoney(amount, currency = '$') {
    if (isNaN(amount) || amount === null || amount === undefined) return `${currency}0.00`;
    return `${currency}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // ============================================================
  // HUD & PROFILE CONTROLLER
  // ============================================================
  function updateHUD() {
    const p = Storage.data.profile;
    $('hud-player-name').textContent = p.name || 'Candidate';
    $('hud-level').textContent = `Lvl ${p.level}`;
    $('hud-xp').textContent = `${p.xp} XP`;
    $('hud-coins').textContent = p.coins;
    $('hud-streak').textContent = `${p.currentStreak}x`;

    // Title lookup
    const rank = Data.RANKS.find(r => r.level === p.level) || Data.RANKS[0];
    $('hud-player-title').textContent = rank.title;

    // XP Bar Percentage
    const nextRank = Data.RANKS.find(r => r.level === p.level + 1);
    if (nextRank) {
      const prevXp = rank.minXp;
      const targetXp = nextRank.minXp;
      const range = targetXp - prevXp;
      const currentProgress = Math.max(0, p.xp - prevXp);
      const pct = Math.min(100, Math.round((currentProgress / range) * 100));
      $('hud-xp-bar').style.width = `${pct}%`;
    } else {
      $('hud-xp-bar').style.width = '100%';
    }

    // Sound button label
    $('btn-sound-toggle').textContent = Audio.enabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
  }

  function setupStorageListener() {
    Storage.onStatusChange(status => {
      const badge = $('storage-status-badge');
      const modalBanner = $('modal-storage-status-text');
      if (status.backendAvailable) {
        badge.className = 'badge-tag server-status';
        badge.innerHTML = '<span style="font-size:0.7rem;">●</span> Server Synced (data/inventory_store.json)';
        if (modalBanner) {
          modalBanner.textContent = 'REST API Server active at http://localhost:3000. Data automatically synchronized to data/inventory_store.json.';
        }
      } else {
        badge.className = 'badge-tag server-status offline';
        badge.innerHTML = '<span style="font-size:0.7rem;">●</span> LocalStorage (Offline Mode)';
        if (modalBanner) {
          modalBanner.textContent = 'Operating in standalone browser LocalStorage mode. Start node server.js to enable server persistence.';
        }
      }
    });
  }

  // ============================================================
  // TAB NAVIGATION CONTROLLER
  // ============================================================
  function setupNavigation() {
    $$('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Audio.playClick();
        const tab = btn.dataset.tab;
        switchTab(tab);
      });
    });
  }

  function switchTab(tab) {
    AppState.currentTab = tab;
    $$('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    $$('.mode-section').forEach(sec => {
      sec.classList.remove('active');
    });
    const targetSection = $(`section-${tab}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Refresh active tab views
    if (tab === 'simulator') renderSimulator();
    if (tab === 'dispatcher') renderDispatcherMission();
    if (tab === 'ledger') renderExamQuestion();
    if (tab === 'cfo') renderCfoStrategy();
    if (tab === 'sandbox') renderSandbox();
  }

  // ============================================================
  // MODE 1: 4-WAY COMPARISON & INTERACTIVE SIMULATOR
  // ============================================================
  function initSimulator() {
    const sel = $('sim-scenario-select');
    sel.innerHTML = '';
    Data.SCENARIOS.forEach((sc, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${sc.name} (${sc.subtitle})`;
      sel.appendChild(opt);
    });

    sel.addEventListener('change', e => {
      Audio.playClick();
      AppState.sim.scenarioIndex = parseInt(e.target.value, 10);
      AppState.sim.currentStep = 0;
      if (AppState.sim.autoPlayTimer) clearInterval(AppState.sim.autoPlayTimer);
      renderSimulator();
    });

    $('sim-step-prev').addEventListener('click', () => {
      Audio.playClick();
      if (AppState.sim.currentStep > 0) {
        AppState.sim.currentStep--;
        renderSimulatorStep();
      }
    });

    $('sim-step-next').addEventListener('click', () => {
      const sc = Data.SCENARIOS[AppState.sim.scenarioIndex];
      if (AppState.sim.currentStep < sc.transactions.length - 1) {
        Audio.playClick();
        AppState.sim.currentStep++;
        renderSimulatorStep();
      }
    });

    $('sim-step-auto').addEventListener('click', () => {
      Audio.playClick();
      const sc = Data.SCENARIOS[AppState.sim.scenarioIndex];
      if (AppState.sim.autoPlayTimer) {
        clearInterval(AppState.sim.autoPlayTimer);
        AppState.sim.autoPlayTimer = null;
        $('sim-step-auto').textContent = '▶ Auto';
      } else {
        $('sim-step-auto').textContent = '⏸ Pause';
        AppState.sim.autoPlayTimer = setInterval(() => {
          if (AppState.sim.currentStep < sc.transactions.length - 1) {
            AppState.sim.currentStep++;
            renderSimulatorStep();
          } else {
            clearInterval(AppState.sim.autoPlayTimer);
            AppState.sim.autoPlayTimer = null;
            $('sim-step-auto').textContent = '▶ Auto';
          }
        }, 1500);
      }
    });

    // Method filter pills
    $$('.sim-method-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        Audio.playClick();
        $$('.sim-method-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        AppState.sim.methodFilter = btn.dataset.method;
        filterMethodCards();
      });
    });

    // Stock card accordion toggle
    $('sim-btn-toggle-stockcard').addEventListener('click', () => {
      Audio.playClick();
      const cont = $('sim-stockcard-container');
      const isVisible = cont.style.display === 'block';
      cont.style.display = isVisible ? 'none' : 'block';
      $('sim-stockcard-icon').textContent = isVisible ? '▼' : '▲';
      if (!isVisible) {
        renderSimulatorStockCard();
      }
    });

    // Stock card ledger tab toggle
    $$('.sim-ledger-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        Audio.playClick();
        $$('.sim-ledger-tab').forEach(b => b.classList.remove('active', 'btn-primary'));
        btn.classList.add('active', 'btn-primary');
        AppState.sim.activeLedgerTab = btn.dataset.ledger;
        renderSimulatorStockCard();
      });
    });
  }

  function filterMethodCards() {
    const filter = AppState.sim.methodFilter;
    const cards = $$('#sim-comparison-cards .method-column-card');
    cards.forEach((card, idx) => {
      if (filter === 'ALL') {
        card.style.display = 'flex';
      } else if (filter === 'FIFO' && (idx === 0 || idx === 1)) {
        card.style.display = 'flex';
      } else if (filter === 'AVCO' && (idx === 2 || idx === 3)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function renderSimulator() {
    const sc = Data.SCENARIOS[AppState.sim.scenarioIndex];
    $('sim-scenario-title').textContent = `${sc.name} — ${sc.subtitle}`;
    $('sim-scenario-desc').textContent = sc.description;

    // Run engine on full transactions for end figures & takeaways
    const fullComparison = Engine.compareAllFourMethods(sc.transactions, { taxRate: sc.taxRate });
    $('sim-scenario-trend').textContent = fullComparison.priceTrend;
    $('sim-scenario-trend').className = fullComparison.priceTrend === 'INFLATION' ? 'badge-tag' : 'badge-tag accent-switch';

    // Populate Key Takeaways
    const takeList = $('sim-takeaways-list');
    takeList.innerHTML = '';
    fullComparison.reconciliationKeyTakeaways.forEach(tk => {
      const item = document.createElement('div');
      item.style.padding = '0.6rem 0.8rem';
      item.style.background = 'var(--bg-card)';
      item.style.border = '1px solid var(--border)';
      item.style.borderRadius = '6px';
      item.innerHTML = `<strong style="color:var(--fifo-cyan);">✓ ${tk.rule}:</strong> <span style="color:var(--text-main);">${tk.explanation}</span>`;
      takeList.appendChild(item);
    });

    renderSimulatorStep();
  }

  function renderSimulatorStep() {
    const sc = Data.SCENARIOS[AppState.sim.scenarioIndex];
    const stepIdx = AppState.sim.currentStep;
    const totalSteps = sc.transactions.length;

    $('sim-step-counter').textContent = `Step ${stepIdx + 1} of ${totalSteps}`;
    $('sim-step-prev').disabled = stepIdx === 0;
    $('sim-step-next').disabled = stepIdx === totalSteps - 1;

    // Sub-slice of transactions up to current step
    const currentSlice = sc.transactions.slice(0, stepIdx + 1);
    const activeTx = sc.transactions[stepIdx];

    // Update active transaction callout
    $('sim-tx-date').textContent = activeTx.date;
    $('sim-tx-badge').textContent = activeTx.type;
    $('sim-tx-badge').className = activeTx.type === 'SALE' ? 'badge-tag badge-sale' : 'badge-tag badge-purchase';
    
    if (activeTx.type === 'SALE') {
      $('sim-tx-text').textContent = `Customer Sale: Shipped ${activeTx.units} units @ ${formatMoney(activeTx.unitPrice)} each. (${activeTx.notes || ''})`;
    } else {
      $('sim-tx-text').textContent = `Stock Received: ${activeTx.units} units @ ${formatMoney(activeTx.unitCost)} each. (${activeTx.notes || ''})`;
    }

    // Run engine on current slice
    const stepResults = Engine.compareAllFourMethods(currentSlice, { taxRate: sc.taxRate });

    // Update Scorecard Values
    const cur = sc.currency || '$';
    const r = stepResults.results;

    $('val-fifo-per-ending-units').textContent = `${stepResults.endingUnits} Units`;
    $('val-fifo-per-ending-cost').textContent = formatMoney(r.fifoPeriodic.endingInventoryCost, cur);
    $('val-fifo-per-cogs').textContent = formatMoney(r.fifoPeriodic.cogs, cur);
    $('val-fifo-per-profit').textContent = formatMoney(r.fifoPeriodic.grossProfit, cur);

    $('val-fifo-perp-ending-units').textContent = `${stepResults.endingUnits} Units`;
    $('val-fifo-perp-ending-cost').textContent = formatMoney(r.fifoPerpetual.endingInventoryCost, cur);
    $('val-fifo-perp-cogs').textContent = formatMoney(r.fifoPerpetual.cogs, cur);
    $('val-fifo-perp-profit').textContent = formatMoney(r.fifoPerpetual.grossProfit, cur);

    if ($('val-avco-per-ending-units')) {
      $('val-avco-per-ending-units').textContent = `${stepResults.endingUnits} Units`;
      $('val-avco-per-ending-cost').textContent = formatMoney(r.avcoPeriodic.endingInventoryCost, cur);
      $('val-avco-per-cogs').textContent = formatMoney(r.avcoPeriodic.cogs, cur);
      $('val-avco-per-profit').textContent = formatMoney(r.avcoPeriodic.grossProfit, cur);
    }

    if ($('val-avco-perp-ending-units')) {
      $('val-avco-perp-ending-units').textContent = `${stepResults.endingUnits} Units`;
      $('val-avco-perp-ending-cost').textContent = formatMoney(r.avcoPerpetual.endingInventoryCost, cur);
      $('val-avco-perp-cogs').textContent = formatMoney(r.avcoPerpetual.cogs, cur);
      $('val-avco-perp-profit').textContent = formatMoney(r.avcoPerpetual.grossProfit, cur);
    }

    // Render Warehouse Pallets at this step (based on FIFO Perpetual layers)
    renderWarehousePallets(r.fifoPerpetual.endingInventoryLayers, cur);

    // If stock card is currently open, refresh it
    if ($('sim-stockcard-container').style.display === 'block') {
      renderSimulatorStockCard();
    }

    // Award badge if user explored full simulation
    if (stepIdx === totalSteps - 1) {
      Storage.unlockBadge('reconciler');
      Storage.save();
    }
  }

  function renderWarehousePallets(layers, cur) {
    const cont = $('sim-pallets-container');
    cont.innerHTML = '';
    let totalUnits = 0;
    let totalCost = 0;

    if (!layers || layers.length === 0) {
      cont.innerHTML = `<div style="color:var(--text-dim); font-size:0.85rem; padding:0.5rem;">Warehouse shelf is currently empty (all stock dispatched).</div>`;
      $('sim-shelf-summary').textContent = `0 Units | ${formatMoney(0, cur)}`;
      return;
    }

    layers.forEach((layer, i) => {
      totalUnits += layer.units;
      const batchCost = layer.units * layer.unitCost;
      totalCost += batchCost;

      const pallet = document.createElement('div');
      pallet.className = 'pallet-box';
      pallet.innerHTML = `
        <div class="pallet-tag">
          <span>Batch #${i + 1}</span>
          <span>${layer.date || 'In Stock'}</span>
        </div>
        <div class="pallet-units">${layer.units} <span style="font-size:0.75rem; color:var(--text-muted);">Units</span></div>
        <div class="pallet-cost-unit">${formatMoney(layer.unitCost, cur)} / unit</div>
        <div class="pallet-cost-total">Total: ${formatMoney(batchCost, cur)}</div>
      `;
      cont.appendChild(pallet);
    });

    $('sim-shelf-summary').textContent = `${totalUnits} Units | ${formatMoney(totalCost, cur)}`;
  }

  function renderSimulatorStockCard() {
    const sc = Data.SCENARIOS[AppState.sim.scenarioIndex];
    let result;
    if (AppState.sim.activeLedgerTab === 'FIFO_PERPETUAL') {
      result = Engine.calculateFIFOPerpetual(sc.transactions);
    } else {
      result = Engine.calculateAVCOPerpetual(sc.transactions);
    }
    const cur = sc.currency || '$';

    let html = `
      <table class="stock-ledger-table">
        <thead>
          <tr>
            <th rowspan="2">Date</th>
            <th rowspan="2">Transaction</th>
            <th colspan="3" class="col-receipts" style="text-align:center;">Purchases (Receipts)</th>
            <th colspan="3" class="col-issues" style="text-align:center;">Cost of Sales (Issues)</th>
            <th colspan="3" class="col-balance" style="text-align:center;">Inventory Balance</th>
          </tr>
          <tr>
            <th class="col-receipts">Qty</th><th class="col-receipts">Rate</th><th class="col-receipts">Total</th>
            <th class="col-issues">Qty</th><th class="col-issues">Rate</th><th class="col-issues">Total</th>
            <th class="col-balance">Layers on Hand</th><th class="col-balance">Qty</th><th class="col-balance">Total</th>
          </tr>
        </thead>
        <tbody>
    `;

    result.stockCard.forEach(row => {
      const isReceipt = !!row.receipts;
      const isSale = !!row.issues;

      const layersDesc = row.balance.map(l => `${l.units}@${formatMoney(l.unitCost, cur)}`).join(' + ') || 'Nil';

      html += `
        <tr>
          <td style="font-family:var(--font-mono); font-weight:700;">${row.date}</td>
          <td><span class="badge-tag ${isSale ? 'badge-sale' : 'badge-purchase'}">${row.type}</span></td>
          
          <!-- Receipts -->
          <td>${isReceipt ? row.receipts.units : '-'}</td>
          <td>${isReceipt ? formatMoney(row.receipts.unitCost, cur) : '-'}</td>
          <td style="font-weight:700;">${isReceipt ? formatMoney(row.receipts.totalCost, cur) : '-'}</td>
          
          <!-- Issues -->
          <td style="color:#fb7185;">${isSale ? row.issues.units : '-'}</td>
          <td style="font-size:0.75rem;">${isSale ? row.issues.layers.map(l => `${l.units}@${formatMoney(l.unitCost, cur)}`).join(', ') : '-'}</td>
          <td style="font-weight:700; color:#fb7185;">${isSale ? formatMoney(row.issues.totalCogs, cur) : '-'}</td>
          
          <!-- Balance -->
          <td style="font-size:0.75rem; color:#34d399;">${layersDesc}</td>
          <td style="font-weight:700;">${row.balanceTotalUnits}</td>
          <td style="font-weight:800; color:#38bdf8;">${formatMoney(row.balanceTotalCost, cur)}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    $('sim-stockcard-table-wrapper').innerHTML = html;
  }

  // ============================================================
  // MODE 2: WAREHOUSE DISPATCHER ARENA
  // ============================================================
  function initDispatcher() {
    $('disp-btn-reset').addEventListener('click', () => {
      Audio.playClick();
      AppState.disp.allocations = {};
      renderDispatcherMission();
    });

    $('disp-btn-submit').addEventListener('click', handleDispatcherSubmit);

    $('disp-btn-next').addEventListener('click', () => {
      Audio.playClick();
      AppState.disp.missionIndex = (AppState.disp.missionIndex + 1) % Data.DISPATCH_MISSIONS.length;
      AppState.disp.allocations = {};
      AppState.disp.isSubmitted = false;
      renderDispatcherMission();
    });
  }

  function renderDispatcherMission() {
    const mission = Data.DISPATCH_MISSIONS[AppState.disp.missionIndex];
    $('disp-mission-counter').textContent = `Mission ${AppState.disp.missionIndex + 1} of ${Data.DISPATCH_MISSIONS.length}`;
    $('disp-mission-title').textContent = mission.title;
    $('disp-mandate-badge').textContent = mission.mandateLabel;
    $('disp-mandate-badge').className = mission.mandateMethod.startsWith('FIFO') ? 'badge-tag badge-fifo-perpetual' : 'badge-tag badge-avco-perpetual';

    $('disp-client-name').textContent = mission.customer;
    $('disp-required-units').textContent = `${mission.orderUnits} Units`;
    $('disp-selling-price').textContent = formatMoney(mission.salesPricePerUnit);
    $('disp-gross-revenue').textContent = formatMoney(mission.orderUnits * mission.salesPricePerUnit);

    $('disp-target-units').textContent = mission.orderUnits;
    $('disp-feedback-box').style.display = 'none';
    $('disp-btn-submit').disabled = false;

    // Render interactive picking pallets
    const container = $('disp-picker-pallets');
    container.innerHTML = '';

    mission.warehouseLayers.forEach(layer => {
      const allocated = AppState.disp.allocations[layer.batchId] || 0;
      const remainingInLayer = layer.units - allocated;

      const pallet = document.createElement('div');
      pallet.className = `pallet-box ${allocated > 0 ? 'selected' : ''}`;
      pallet.innerHTML = `
        <div class="pallet-tag">
          <span>${layer.batchId}</span>
          <span>${layer.date}</span>
        </div>
        <div class="pallet-units">${layer.units} <span style="font-size:0.75rem; color:var(--text-muted);">avail</span></div>
        <div class="pallet-cost-unit">${formatMoney(layer.unitCost)} / unit</div>
        <div style="margin-top:0.75rem; display:flex; align-items:center; gap:0.4rem;">
          <label style="font-size:0.75rem; color:var(--text-muted);">Pick:</label>
          <input type="number" class="form-input disp-qty-input" data-batch="${layer.batchId}" 
                 min="0" max="${layer.units}" value="${allocated}" 
                 style="padding:0.25rem 0.4rem; font-size:0.85rem; width:70px; text-align:center;">
        </div>
      `;

      // Pallet click toggles full pick
      const input = pallet.querySelector('input');
      input.addEventListener('change', e => {
        const val = Math.max(0, Math.min(layer.units, parseInt(e.target.value, 10) || 0));
        AppState.disp.allocations[layer.batchId] = val;
        Audio.playClick();
        updateDispatcherTally();
      });

      container.appendChild(pallet);
    });

    updateDispatcherTally();
  }

  function updateDispatcherTally() {
    const mission = Data.DISPATCH_MISSIONS[AppState.disp.missionIndex];
    let loadedUnits = 0;
    let accumulatedCogs = 0;

    mission.warehouseLayers.forEach(layer => {
      const picked = AppState.disp.allocations[layer.batchId] || 0;
      loadedUnits += picked;
      accumulatedCogs += picked * layer.unitCost;
    });

    $('disp-loaded-units').textContent = loadedUnits;
    $('disp-calc-cogs').textContent = formatMoney(accumulatedCogs).replace('$', '');

    // Color code loading tally
    if (loadedUnits === mission.orderUnits) {
      $('disp-loaded-units').style.color = '#10b981';
    } else if (loadedUnits > mission.orderUnits) {
      $('disp-loaded-units').style.color = '#ef4444';
    } else {
      $('disp-loaded-units').style.color = '#fbbf24';
    }
  }

  function handleDispatcherSubmit() {
    const mission = Data.DISPATCH_MISSIONS[AppState.disp.missionIndex];
    let loadedUnits = 0;
    let accumulatedCogs = 0;

    mission.warehouseLayers.forEach(layer => {
      const picked = AppState.disp.allocations[layer.batchId] || 0;
      loadedUnits += picked;
      accumulatedCogs += picked * layer.unitCost;
    });

    const box = $('disp-feedback-box');
    const header = $('disp-feedback-header');
    const text = $('disp-feedback-text');
    box.style.display = 'block';

    // Check unit quantity
    if (loadedUnits !== mission.orderUnits) {
      Audio.playWrong();
      box.style.background = 'rgba(239, 68, 68, 0.15)';
      box.style.border = '1px solid #ef4444';
      header.textContent = '❌ Dispatch Quantity Mismatch';
      header.style.color = 'var(--danger)';
      text.textContent = `The order requires exactly ${mission.orderUnits} units, but you have loaded ${loadedUnits} units. Adjust your batch picks before shipping.`;
      Storage.awardProgress(0, 0, false, 'DISPATCHER', `Failed order quantity: ${loadedUnits}/${mission.orderUnits}`);
      updateHUD();
      return;
    }

    // Check layer selection & method obedience
    let isCorrectMethod = true;
    let expectedPicks = {};
    mission.correctSelection.forEach(cs => {
      expectedPicks[cs.batchId] = cs.units;
    });

    for (let layer of mission.warehouseLayers) {
      const expected = expectedPicks[layer.batchId] || 0;
      const actual = AppState.disp.allocations[layer.batchId] || 0;
      if (expected !== actual) {
        isCorrectMethod = false;
        break;
      }
    }

    if (isCorrectMethod && Math.abs(accumulatedCogs - mission.correctCogs) < 0.01) {
      Audio.playSuccess();
      Audio.playCashRegister();
      box.style.background = 'rgba(16, 185, 129, 0.15)';
      box.style.border = '1px solid #10b981';
      header.textContent = '🎉 Order Successfully Dispatched & Audited!';
      header.style.color = 'var(--success)';
      text.innerHTML = `
        <strong>Excellent Execution!</strong> You followed <strong>${mission.mandateLabel}</strong> with precision.<br>
        Cost of Goods Sold (COGS) recorded: <strong>${formatMoney(accumulatedCogs)}</strong>.<br>
        Gross Profit generated: <strong>${formatMoney((mission.orderUnits * mission.salesPricePerUnit) - accumulatedCogs)}</strong>.
      `;

      const progress = Storage.awardProgress(100, 30, true, 'DISPATCHER', `Fulfilled ${mission.title} under ${mission.mandateLabel}`);
      Storage.unlockBadge('first_dispatch');
      if (mission.mandateMethod.startsWith('FIFO')) Storage.unlockBadge('fifo_virtuoso');
      if (mission.mandateMethod.startsWith('AVCO')) Storage.unlockBadge('avco_tactician');
      if (progress.streak >= 5) Storage.unlockBadge('streak_5');
      if (progress.streak >= 10) Storage.unlockBadge('streak_10');
      if (progress.leveledUp) Audio.playFanfare();

      $('disp-btn-submit').disabled = true;
      updateHUD();
    } else {
      Audio.playWrong();
      box.style.background = 'rgba(239, 68, 68, 0.15)';
      box.style.border = '1px solid #ef4444';
      header.textContent = '⚠️ Accounting Allocation Violation';
      header.style.color = 'var(--danger)';
      text.innerHTML = `
        You loaded ${loadedUnits} units, but not from the correct layers required by <strong>${mission.mandateLabel}</strong>.<br>
        <strong>Hint:</strong> ${mission.hint}<br>
        Expected COGS: <strong>${formatMoney(mission.correctCogs)}</strong> | Your COGS: <strong>${formatMoney(accumulatedCogs)}</strong>.
      `;
      Storage.awardProgress(0, 0, false, 'DISPATCHER', `Incorrect layers under ${mission.mandateLabel}`);
      updateHUD();
    }
  }

  // ============================================================
  // MODE 3: STOCK CARD & EXAM CALCULATION ARENA
  // ============================================================
  function initExam() {
    $('exam-btn-next').addEventListener('click', () => {
      Audio.playClick();
      AppState.exam.questionIndex = (AppState.exam.questionIndex + 1) % Data.EXAM_QUESTIONS.length;
      AppState.exam.isAnswered = false;
      renderExamQuestion();
    });
  }

  function renderExamQuestion() {
    const q = Data.EXAM_QUESTIONS[AppState.exam.questionIndex];
    $('exam-counter').textContent = `Question ${AppState.exam.questionIndex + 1} of ${Data.EXAM_QUESTIONS.length}`;
    $('exam-scenario-title').textContent = q.scenarioTitle;
    $('exam-method-tag').textContent = q.targetMethod.replace('_', ' ');
    $('exam-narrative').textContent = q.narrative;
    $('exam-question-text').textContent = q.questionText;

    $('exam-feedback-box').style.display = 'none';

    const grid = $('exam-choices-grid');
    grid.innerHTML = '';

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.justifyContent = 'flex-start';
      btn.style.textAlign = 'left';
      btn.style.padding = '0.85rem 1.25rem';
      btn.innerHTML = `<span style="font-weight:700; color:#38bdf8; min-width:24px;">${String.fromCharCode(65 + idx)}.</span> ${optText}`;

      btn.addEventListener('click', () => {
        if (AppState.exam.isAnswered) return;
        handleExamAnswer(idx, btn);
      });

      grid.appendChild(btn);
    });
  }

  function handleExamAnswer(chosenIdx, clickedBtn) {
    AppState.exam.isAnswered = true;
    const q = Data.EXAM_QUESTIONS[AppState.exam.questionIndex];
    const isCorrect = chosenIdx === q.correctIndex;

    const allButtons = $$('#exam-choices-grid button');
    allButtons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correctIndex) {
        b.style.borderColor = '#10b981';
        b.style.background = 'rgba(16, 185, 129, 0.2)';
      }
    });

    const box = $('exam-feedback-box');
    const status = $('exam-feedback-status');
    const exp = $('exam-feedback-explanation');
    box.style.display = 'block';

    if (isCorrect) {
      Audio.playSuccess();
      clickedBtn.style.borderColor = '#10b981';
      box.style.background = 'rgba(16, 185, 129, 0.15)';
      box.style.border = '1px solid #10b981';
      status.textContent = '🎯 Correct Solution!';
      status.style.color = 'var(--success)';
      exp.innerHTML = `<strong>Comprehensive Accounting Breakdown:</strong><br>${q.explanation}`;

      const progress = Storage.awardProgress(120, 40, true, 'EXAM_ARENA', `Answered Question ${AppState.exam.questionIndex + 1}`);
      Storage.unlockBadge('periodic_master');
      if (q.targetMethod.includes('AVCO') || q.targetMethod.includes('SMOOTHING')) Storage.unlockBadge('avco_master');
      if (q.targetMethod.includes('IFRS')) Storage.unlockBadge('ifrs_scholar');
      if (progress.streak >= 5) Storage.unlockBadge('streak_5');
      if (progress.streak >= 10) Storage.unlockBadge('streak_10');
      if (progress.leveledUp) Audio.playFanfare();

      updateHUD();
    } else {
      Audio.playWrong();
      clickedBtn.style.borderColor = '#ef4444';
      clickedBtn.style.background = 'rgba(239, 68, 68, 0.2)';
      box.style.background = 'rgba(239, 68, 68, 0.15)';
      box.style.border = '1px solid #ef4444';
      status.textContent = '❌ Incorrect Calculation';
      status.style.color = 'var(--danger)';
      exp.innerHTML = `<strong>Correct Option was (${String.fromCharCode(65 + q.correctIndex)}):</strong><br>${q.explanation}`;

      Storage.awardProgress(0, 0, false, 'EXAM_ARENA', `Wrong answer on Question ${AppState.exam.questionIndex + 1}`);
      updateHUD();
    }
  }

  // ============================================================
  // MODE 4: CFO STRATEGY & FINANCIAL IMPACT DETECTIVE
  // ============================================================
  function initCfoStrategy() {
    $$('.cfo-dataset-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        Audio.playClick();
        $$('.cfo-dataset-toggle').forEach(b => b.classList.remove('active', 'btn-primary'));
        btn.classList.add('active', 'btn-primary');
        AppState.cfo.currentScenarioId = btn.dataset.dataset;
        renderCfoStrategy();
      });
    });

    renderCfoChallengeOptions();
  }

  function renderCfoStrategy() {
    const sc = Data.SCENARIOS.find(s => s.id === AppState.cfo.currentScenarioId) || Data.SCENARIOS[0];
    const comp = Engine.compareAllFourMethods(sc.transactions, { taxRate: sc.taxRate, operatingExpenses: sc.operatingExpenses });
    const cur = sc.currency || '$';

    const stFifo = comp.statements.fifoPeriodic;
    const stAvco = comp.statements.avcoPeriodic;

    // Statement of Profit or Loss Body
    const splBody = $('cfo-spl-tbody');
    splBody.innerHTML = `
      <tr>
        <td style="padding:0.4rem 0;">Sales Revenue</td>
        <td style="text-align:right;">${formatMoney(stFifo.revenue, cur)}</td>
        <td style="text-align:right;">${formatMoney(stAvco.revenue, cur)}</td>
        <td style="text-align:right; color:var(--text-dim);">$0.00</td>
      </tr>
      <tr>
        <td style="padding:0.4rem 0;">Less: Cost of Goods Sold</td>
        <td style="text-align:right; color:#fb7185;">(${formatMoney(stFifo.cogs, cur)})</td>
        <td style="text-align:right; color:#fb7185;">(${formatMoney(stAvco.cogs, cur)})</td>
        <td style="text-align:right; color:#fb7185;">${formatMoney(stAvco.cogs - stFifo.cogs, cur)}</td>
      </tr>
      <tr style="font-weight:700; border-top:1px solid var(--border);">
        <td style="padding:0.4rem 0;">Gross Profit</td>
        <td style="text-align:right; color:#38bdf8;">${formatMoney(stFifo.grossProfit, cur)}</td>
        <td style="text-align:right; color:#34d399;">${formatMoney(stAvco.grossProfit, cur)}</td>
        <td style="text-align:right;">${formatMoney(stAvco.grossProfit - stFifo.grossProfit, cur)}</td>
      </tr>
      <tr>
        <td style="padding:0.4rem 0;">Operating Expenses</td>
        <td style="text-align:right;">(${formatMoney(stFifo.operatingExpenses, cur)})</td>
        <td style="text-align:right;">(${formatMoney(stAvco.operatingExpenses, cur)})</td>
        <td style="text-align:right; color:var(--text-dim);">$0.00</td>
      </tr>
      <tr>
        <td style="padding:0.4rem 0;">Income Tax Expense (${stFifo.effectiveTaxRate}%)</td>
        <td style="text-align:right; color:#f59e0b;">(${formatMoney(stFifo.taxExpense, cur)})</td>
        <td style="text-align:right; color:#f59e0b;">(${formatMoney(stAvco.taxExpense, cur)})</td>
        <td style="text-align:right; color:#10b981; font-weight:700;">${formatMoney(stFifo.taxExpense - stAvco.taxExpense, cur)} Variance</td>
      </tr>
      <tr style="font-weight:800; border-top:2px solid var(--border); border-bottom:3px double #38bdf8;">
        <td style="padding:0.5rem 0;">Net Income (Profit for Year)</td>
        <td style="text-align:right; color:#38bdf8;">${formatMoney(stFifo.netIncome, cur)}</td>
        <td style="text-align:right; color:#34d399;">${formatMoney(stAvco.netIncome, cur)}</td>
        <td style="text-align:right;">${formatMoney(stAvco.netIncome - stFifo.netIncome, cur)}</td>
      </tr>
    `;

    // Statement of Financial Position Body
    const sofpBody = $('cfo-sofp-tbody');
    const spread = Math.abs(stFifo.endingInventory - stAvco.endingInventory);
    sofpBody.innerHTML = `
      <tr>
        <td style="padding:0.4rem 0;">Current Asset: Ending Inventory</td>
        <td style="text-align:right; color:#38bdf8; font-weight:700;">${formatMoney(stFifo.endingInventory, cur)}</td>
        <td style="text-align:right; color:#34d399; font-weight:700;">${formatMoney(stAvco.endingInventory, cur)}</td>
        <td style="text-align:right; color:#fbbf24;">${formatMoney(spread, cur)} (Inventory Spread)</td>
      </tr>
      <tr>
        <td style="padding:0.4rem 0;">Cumulative Gross Margin Spread</td>
        <td style="text-align:right;">Baseline</td>
        <td style="text-align:right; color:#34d399; font-weight:700;">${formatMoney(stAvco.grossProfit - stFifo.grossProfit, cur)}</td>
        <td style="text-align:right; color:#38bdf8;">Price Smoothing Effect</td>
      </tr>
    `;

    // AVCO Smoothing Footnote Display
    const footnoteVal = $('cfo-avco-smoothing-val') || $('cfo-lifo-reserve-val');
    if (footnoteVal) footnoteVal.textContent = `${formatMoney(spread, cur)} Spread`;
    if ($('cfo-tax-shield-desc')) {
      $('cfo-tax-shield-desc').textContent = `In this ${comp.priceTrend.toLowerCase()} cycle, AVCO delivers a smoothed inventory valuation of ${formatMoney(stAvco.endingInventory, cur)} vs FIFO's ${formatMoney(stFifo.endingInventory, cur)}, both fully permitted by IAS 2!`;
    }
  }

  function renderCfoChallengeOptions() {
    const optsCont = $('cfo-challenge-options');
    optsCont.innerHTML = '';

    const choices = [
      { text: 'Under IAS 2, AVCO smooths out purchase price swings by calculating a blended average cost per unit, avoiding FIFO profit spikes during inflation while remaining 100% compliant with IFRS.', correct: true },
      { text: 'AVCO increases both reported Net Income and tax liabilities substantially above FIFO during inflation.', correct: false },
      { text: 'AVCO is prohibited under IAS 2 because IFRS mandates the specific identification method for all interchangeable goods.', correct: false },
      { text: 'AVCO Periodic and AVCO Perpetual always yield identical financial statements regardless of purchase dates.', correct: false }
    ];

    choices.forEach((ch, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.justifyContent = 'flex-start';
      btn.style.textAlign = 'left';
      btn.innerHTML = `<span style="color:#38bdf8; font-weight:700;">${idx + 1}.</span> ${ch.text}`;

      btn.addEventListener('click', () => {
        const feedback = $('cfo-challenge-feedback');
        feedback.style.display = 'block';
        if (ch.correct) {
          Audio.playSuccess();
          feedback.style.background = 'rgba(16, 185, 129, 0.15)';
          feedback.style.border = '1px solid #10b981';
          feedback.style.color = 'var(--success)';
          feedback.innerHTML = `<strong>Board Decision Approved!</strong> Exactly right. Under IAS 2 (Inventories), AVCO provides a stable, smoothed measure of gross margins and inventory valuation, preventing distorted earnings swings.`;
          Storage.awardProgress(150, 50, true, 'CFO_STRATEGY', 'Boardroom AVCO Decision Solved');
          Storage.unlockBadge('avco_master');
          Storage.unlockBadge('avco_reserve_pro');
          updateHUD();
        } else {
          Audio.playWrong();
          feedback.style.background = 'rgba(239, 68, 68, 0.15)';
          feedback.style.border = '1px solid #ef4444';
          feedback.style.color = 'var(--danger)';
          feedback.innerHTML = `<strong>Board Rejection:</strong> Review IAS 2 requirements. AVCO and FIFO are the only two permitted methods for interchangeable inventories under IFRS; AVCO smooths gross margins relative to FIFO.`;
          Storage.awardProgress(0, 0, false, 'CFO_STRATEGY', 'Incorrect Boardroom Decision');
          updateHUD();
        }
      });

      optsCont.appendChild(btn);
    });
  }

  // ============================================================
  // MODE 5: CUSTOM SANDBOX & TYCOON
  // ============================================================
  function initSandbox() {
    $('sb-input-type').addEventListener('change', e => {
      const isSale = e.target.value === 'SALE';
      $('sb-group-cost').style.display = isSale ? 'none' : 'block';
      $('sb-group-price').style.display = isSale ? 'block' : 'none';
    });

    $('sb-btn-add-tx').addEventListener('click', handleAddSandboxTx);
    $('sb-btn-sample').addEventListener('click', loadSandboxSampleData);
    $('sb-btn-clear-tx').addEventListener('click', () => {
      Audio.playClick();
      AppState.sandbox.transactions = [];
      renderSandboxTable();
      $('sb-results-panel').style.display = 'none';
    });

    $('sb-btn-calculate').addEventListener('click', handleSandboxCalculate);
    $('sb-btn-save-company').addEventListener('click', handleSaveSandboxCompany);
  }

  function handleAddSandboxTx() {
    const date = $('sb-input-date').value || '2026-04-01';
    const type = $('sb-input-type').value;
    const units = parseInt($('sb-input-units').value, 10);
    const unitCost = parseFloat($('sb-input-cost').value);
    const unitPrice = parseFloat($('sb-input-price').value);

    if (isNaN(units) || units <= 0) {
      alert('Please enter a valid positive unit quantity.');
      return;
    }

    const tx = {
      id: 'cust_' + Date.now(),
      date,
      type,
      units
    };

    if (type === 'SALE') {
      tx.unitPrice = isNaN(unitPrice) ? 0 : unitPrice;
    } else {
      tx.unitCost = isNaN(unitCost) ? 0 : unitCost;
    }

    Audio.playClick();
    AppState.sandbox.transactions.push(tx);
    AppState.sandbox.transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    renderSandboxTable();
  }

  function loadSandboxSampleData() {
    Audio.playClick();
    AppState.sandbox.transactions = [
      { id: 'sb_1', date: '2026-04-01', type: 'BEGINNING', units: 50, unitCost: 10 },
      { id: 'sb_2', date: '2026-04-05', type: 'PURCHASE', units: 80, unitCost: 12 },
      { id: 'sb_3', date: '2026-04-12', type: 'SALE', units: 60, unitPrice: 20 },
      { id: 'sb_4', date: '2026-04-18', type: 'PURCHASE', units: 70, unitCost: 15 },
      { id: 'sb_5', date: '2026-04-25', type: 'SALE', units: 90, unitPrice: 22 }
    ];
    renderSandboxTable();
  }

  function renderSandboxTable() {
    const tbody = $('sb-tx-tbody');
    tbody.innerHTML = '';

    if (AppState.sandbox.transactions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-dim); padding:1rem;">No transactions in schedule. Add one above or click 'Load Sample Data'.</td></tr>`;
      return;
    }

    AppState.sandbox.transactions.forEach((tx, idx) => {
      const tr = document.createElement('tr');
      const isSale = tx.type === 'SALE';
      const rate = isSale ? tx.unitPrice : tx.unitCost;
      const total = tx.units * rate;

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td style="font-family:var(--font-mono);">${tx.date}</td>
        <td><span class="badge-tag ${isSale ? 'badge-sale' : 'badge-purchase'}">${tx.type}</span></td>
        <td style="font-weight:700;">${tx.units}</td>
        <td>${formatMoney(rate)}</td>
        <td style="font-weight:700;">${formatMoney(total)}</td>
        <td><button class="btn btn-danger" style="padding:0.2rem 0.5rem; font-size:0.75rem;" data-del="${idx}">Delete</button></td>
      `;

      tr.querySelector('button[data-del]').addEventListener('click', e => {
        const delIdx = parseInt(e.target.dataset.del, 10);
        AppState.sandbox.transactions.splice(delIdx, 1);
        Audio.playClick();
        renderSandboxTable();
      });

      tbody.appendChild(tr);
    });
  }

  function handleSandboxCalculate() {
    if (AppState.sandbox.transactions.length === 0) {
      alert('Add transactions before calculating valuation matrix.');
      return;
    }

    try {
      const res = Engine.compareAllFourMethods(AppState.sandbox.transactions);
      AppState.sandbox.lastResults = res;
      Audio.playSuccess();

      $('sb-results-panel').style.display = 'block';
      const grid = $('sb-comparison-grid');
      grid.innerHTML = `
        <div class="method-column-card highlight-fifo">
          <span class="badge-tag badge-fifo-periodic">FIFO Periodic</span>
          <div class="stat-row"><span class="stat-label">Ending Inv:</span><span class="stat-val ending-inv">${formatMoney(res.results.fifoPeriodic.endingInventoryCost)}</span></div>
          <div class="stat-row"><span class="stat-label">COGS:</span><span class="stat-val cogs">${formatMoney(res.results.fifoPeriodic.cogs)}</span></div>
          <div class="stat-row"><span class="stat-label">Gross Profit:</span><span class="stat-val profit">${formatMoney(res.results.fifoPeriodic.grossProfit)}</span></div>
        </div>

        <div class="method-column-card highlight-fifo">
          <span class="badge-tag badge-fifo-perpetual">FIFO Perpetual</span>
          <div class="stat-row"><span class="stat-label">Ending Inv:</span><span class="stat-val ending-inv">${formatMoney(res.results.fifoPerpetual.endingInventoryCost)}</span></div>
          <div class="stat-row"><span class="stat-label">COGS:</span><span class="stat-val cogs">${formatMoney(res.results.fifoPerpetual.cogs)}</span></div>
          <div class="stat-row"><span class="stat-label">Gross Profit:</span><span class="stat-val profit">${formatMoney(res.results.fifoPerpetual.grossProfit)}</span></div>
        </div>


        <div class="method-column-card highlight-avco">
          <span class="badge-tag badge-avco-periodic">AVCO Periodic</span>
          <div class="stat-row"><span class="stat-label">Ending Inv:</span><span class="stat-val ending-inv">${formatMoney(res.results.avcoPeriodic ? res.results.avcoPeriodic.endingInventoryCost : 0)}</span></div>
          <div class="stat-row"><span class="stat-label">COGS:</span><span class="stat-val cogs">${formatMoney(res.results.avcoPeriodic ? res.results.avcoPeriodic.cogs : 0)}</span></div>
          <div class="stat-row"><span class="stat-label">Gross Profit:</span><span class="stat-val profit">${formatMoney(res.results.avcoPeriodic ? res.results.avcoPeriodic.grossProfit : 0)}</span></div>
        </div>

        <div class="method-column-card highlight-avco">
          <span class="badge-tag badge-avco-perpetual">AVCO Perpetual</span>
          <div class="stat-row"><span class="stat-label">Ending Inv:</span><span class="stat-val ending-inv">${formatMoney(res.results.avcoPerpetual ? res.results.avcoPerpetual.endingInventoryCost : 0)}</span></div>
          <div class="stat-row"><span class="stat-label">COGS:</span><span class="stat-val cogs">${formatMoney(res.results.avcoPerpetual ? res.results.avcoPerpetual.cogs : 0)}</span></div>
          <div class="stat-row"><span class="stat-label">Gross Profit:</span><span class="stat-val profit">${formatMoney(res.results.avcoPerpetual ? res.results.avcoPerpetual.grossProfit : 0)}</span></div>
        </div>
      `;

      Storage.awardProgress(100, 25, true, 'SANDBOX', 'Calculated Custom Sandbox 4-Way Matrix');
      updateHUD();
    } catch (err) {
      Audio.playWrong();
      alert('Error calculating matrix: ' + err.message);
    }
  }

  function handleSaveSandboxCompany() {
    if (AppState.sandbox.transactions.length === 0) {
      alert('Cannot save an empty company schedule.');
      return;
    }
    const name = prompt('Enter a name for this custom inventory company scenario:', 'Custom Supply Logistics Corp');
    if (!name) return;

    Audio.playSuccess();
    const company = {
      id: 'comp_' + Date.now(),
      name,
      transactions: AppState.sandbox.transactions
    };

    Storage.saveCustomCompany(company);
    renderSavedCompaniesList();
    alert(`Company scenario "${name}" successfully saved to persistent database!`);
  }

  function renderSavedCompaniesList() {
    const cont = $('sb-saved-companies-list');
    cont.innerHTML = '';
    const list = Storage.data.customCompanies || [];

    if (list.length === 0) {
      cont.innerHTML = `<div style="font-size:0.85rem; color:var(--text-dim);">No saved companies in database. Configure a schedule and click 'Save to Database'.</div>`;
      return;
    }

    list.forEach(c => {
      const card = document.createElement('div');
      card.style.background = 'var(--bg-card)';
      card.style.border = '1px solid var(--border)';
      card.style.borderRadius = '8px';
      card.style.padding = '0.75rem 1rem';
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      card.innerHTML = `
        <div>
          <strong style="color:var(--text-main);">${c.name}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${c.transactions.length} Transactions | Created: ${new Date(c.createdAt || Date.now()).toLocaleDateString()}</div>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary" style="padding:0.3rem 0.6rem; font-size:0.75rem;" data-load="${c.id}">Load</button>
          <button class="btn btn-danger" style="padding:0.3rem 0.6rem; font-size:0.75rem;" data-del="${c.id}">Delete</button>
        </div>
      `;

      card.querySelector('button[data-load]').addEventListener('click', () => {
        Audio.playClick();
        AppState.sandbox.transactions = JSON.parse(JSON.stringify(c.transactions));
        renderSandboxTable();
        handleSandboxCalculate();
      });

      card.querySelector('button[data-del]').addEventListener('click', () => {
        if (confirm(`Delete saved company "${c.name}"?`)) {
          Audio.playClick();
          Storage.deleteCustomCompany(c.id);
          renderSavedCompaniesList();
        }
      });

      cont.appendChild(card);
    });
  }

  function renderSandbox() {
    renderSandboxTable();
    renderSavedCompaniesList();
  }

  // ============================================================
  // MODALS & DATA PORTABILITY (EXPORT / IMPORT / RESET)
  // ============================================================
  function initModals() {
    // Reference Guide Modal
    $('btn-reference').addEventListener('click', () => {
      Audio.playClick();
      $('modal-reference').classList.add('active');
    });
    $('modal-close-ref').addEventListener('click', () => {
      Audio.playClick();
      $('modal-reference').classList.remove('active');
    });

    // History Modal
    $('btn-history').addEventListener('click', () => {
      Audio.playClick();
      renderHistoryModal();
      $('modal-history').classList.add('active');
    });
    $('modal-close-history').addEventListener('click', () => {
      Audio.playClick();
      $('modal-history').classList.remove('active');
    });

    // Profile & Save Data Modal
    $('btn-profile').addEventListener('click', () => {
      Audio.playClick();
      renderProfileModal();
      $('modal-profile').classList.add('active');
    });
    $('modal-close-profile').addEventListener('click', () => {
      Audio.playClick();
      $('modal-profile').classList.remove('active');
    });

    // Profile Save Meta
    $('prof-btn-save-meta').addEventListener('click', () => {
      Audio.playSuccess();
      Storage.data.profile.name = $('prof-name').value.trim() || 'Candidate';
      Storage.data.profile.companyName = $('prof-company').value.trim() || 'Apex Supply Chain Corp';
      Storage.save();
      updateHUD();
      alert('Controller credentials updated successfully!');
    });

    // JSON Export
    $('prof-btn-export').addEventListener('click', () => {
      Audio.playSuccess();
      Storage.exportBackupJSON();
    });

    // JSON Import
    $('prof-file-import').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const res = Storage.importBackupJSON(ev.target.result);
        if (res.success) {
          Audio.playSuccess();
          updateHUD();
          renderProfileModal();
          alert('Save data restored successfully from JSON backup!');
        } else {
          Audio.playWrong();
          alert('Failed to import save data: ' + res.error);
        }
      };
      reader.readAsText(file);
    });

    // Reset Data
    $('prof-btn-reset').addEventListener('click', () => {
      if (confirm('Are you sure you want to completely reset all game progress, XP, badges, and company simulations?')) {
        Audio.playClick();
        Storage.resetAllData();
        updateHUD();
        renderProfileModal();
        alert('All game progress has been reset to defaults.');
      }
    });

    // Close on overlay backdrop click
    $$('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });
  }

  function renderHistoryModal() {
    const tbody = $('history-log-tbody');
    tbody.innerHTML = '';
    const logs = Storage.data.history || [];

    if (logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-dim); padding:1rem;">No audit logs recorded yet. Complete transactions or questions to build your audit trail.</td></tr>`;
      return;
    }

    logs.forEach(l => {
      const tr = document.createElement('tr');
      const timeStr = new Date(l.timestamp).toLocaleTimeString();
      tr.innerHTML = `
        <td style="font-family:var(--font-mono);">${timeStr}</td>
        <td><span class="badge-tag">${l.mode}</span></td>
        <td>${l.action}</td>
        <td>${l.isSuccess ? '<span style="color:#10b981; font-weight:700;">✓ Pass</span>' : '<span style="color:#ef4444; font-weight:700;">✗ Fail</span>'}</td>
        <td style="font-family:var(--font-mono); font-weight:700; color:#38bdf8;">+${l.xpEarned || 0} XP</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderProfileModal() {
    const p = Storage.data.profile;
    $('prof-name').value = p.name;
    $('prof-company').value = p.companyName;

    const badgesGrid = $('modal-badges-grid');
    badgesGrid.innerHTML = '';

    Data.BADGES.forEach(b => {
      const isUnlocked = Storage.hasBadge(b.id);
      const item = document.createElement('div');
      item.className = `badge-item ${isUnlocked ? 'unlocked' : 'locked'}`;
      item.innerHTML = `
        <div class="badge-item-icon">${b.icon}</div>
        <div>
          <div class="badge-item-name">${b.name}</div>
          <div class="badge-item-desc">${b.desc}</div>
        </div>
      `;
      badgesGrid.appendChild(item);
    });
  }

  // Theme toggle functionality
  function initTheme() {
    const currentTheme = localStorage.getItem('acca_theme') || 'light';
    applyTheme(currentTheme, false);

    window.addEventListener('storage', (e) => {
      if (e.key === 'acca_theme') {
        applyTheme(e.newValue || 'light', false);
      }
    });
  }

  function applyTheme(theme, notify = true) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = theme;
    const btn = $('btn-theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
      btn.title = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`;
    }
    if (notify) {
      showToast(`Switched to ${theme === 'dark' ? 'Dark' : 'Light'} theme`, 'info');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('acca_theme', next);
    applyTheme(next, true);
    if (Audio && Audio.play) Audio.play('click');
  }

  const themeBtn = $('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
  initTheme();

  // Sound toggle button
  $('btn-sound-toggle').addEventListener('click', () => {
    Audio.toggle();
    Storage.data.profile.soundEnabled = Audio.enabled;
    Storage.save();
    updateHUD();
  });

  // ============================================================
  // APP BOOTSTRAP
  // ============================================================
  function init() {
    setupStorageListener();
    setupNavigation();
    initSimulator();
    initDispatcher();
    initExam();
    initCfoStrategy();
    initSandbox();
    initModals();

    // Sound preference restore
    if (Storage.data.profile.soundEnabled === false) {
      Audio.enabled = false;
    }

    updateHUD();
    renderSimulator();
  }

  window.addEventListener('DOMContentLoaded', init);

})();
