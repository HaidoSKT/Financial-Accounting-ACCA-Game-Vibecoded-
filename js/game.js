/**
 * ACCA Financial Accounting Master - Game Engine & Interactivity
 * Connects curriculum data, storage persistence, and procedural audio.
 */

class GameEngine {
  constructor() {
    this.currentMode = 'deadClic';
    this.deadClicIndex = 0;
    this.tAccountIndex = 0;
    this.detectiveIndex = 0;
    this.blitzIndex = 0;

    // State for DEAD CLIC mode
    this.selectedDebit = null;
    this.selectedCredit = null;

    // Statement builder slots state
    this.builderState = {};

    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupModals();
    this.updateHUD();
    this.loadDeadClicQuestion();
    this.loadTAccountChallenge();
    this.loadDetectiveScenario();
    this.loadStatementArchitect();
    this.loadInventoryChallenge();
    this.loadBlitzQuestion();
  }

  setupNavigation() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.dataset.tab;
        this.switchMode(mode);
      });
    });

    // Sound toggle
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const enabled = window.soundEngine.toggle();
        soundBtn.innerHTML = enabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      });
    }

    // Modal open buttons
    const btnProfile = document.getElementById('btn-profile');
    if (btnProfile) {
      btnProfile.addEventListener('click', () => {
        this.renderProfileModal();
        const dlg = document.getElementById('dlg-profile');
        if (dlg) dlg.showModal();
      });
    }

    const btnHistory = document.getElementById('btn-history');
    if (btnHistory) {
      btnHistory.addEventListener('click', () => {
        this.renderHistoryModal();
        const dlg = document.getElementById('dlg-history');
        if (dlg) dlg.showModal();
      });
    }

    const btnReference = document.getElementById('btn-reference');
    if (btnReference) {
      btnReference.addEventListener('click', () => {
        const dlg = document.getElementById('dlg-reference');
        if (dlg) dlg.showModal();
      });
    }
  }

  setupModals() {
    // Setup light dismiss fallback per modern-web-guidance
    document.querySelectorAll('dialog.app-modal').forEach(dialog => {
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        dialog.addEventListener('click', (event) => {
          if (event.target !== dialog) return;
          const rect = dialog.getBoundingClientRect();
          const isDialogContent = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
          );
          if (isDialogContent) return;
          dialog.close();
        });
      }
    });
  }

  switchMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.nav-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === mode);
    });
    document.querySelectorAll('.mode-section').forEach(s => {
      s.classList.toggle('active', s.id === `section-${mode}`);
    });
    if (window.soundEngine) window.soundEngine.play('click');
  }

  updateHUD() {
    const profile = window.storageManager.getProfile();
    document.getElementById('hud-player-name').textContent = profile.name;
    document.getElementById('hud-player-title').textContent = profile.title;
    document.getElementById('hud-level').textContent = `Lvl ${profile.level}`;
    document.getElementById('hud-coins').textContent = profile.coins;
    document.getElementById('hud-xp').textContent = `${profile.xp} XP`;
    document.getElementById('hud-streak').textContent = `${profile.currentStreak}x`;

    const nextXp = profile.xpToNextLevel || 250;
    const prevRankXp = profile.level > 1 ? 200 : 0;
    const range = nextXp - prevRankXp;
    const progress = Math.min(100, Math.max(0, ((profile.xp - prevRankXp) / (range || 1)) * 100));
    document.getElementById('hud-xp-bar').style.width = `${progress}%`;
  }

  /* -------------------------------------------------------------
     MODE 1: DEAD CLIC SPEED ARENA
  ------------------------------------------------------------- */
  loadDeadClicQuestion() {
    const questions = window.ACCA_DATA.DEAD_CLIC_TRANSACTIONS;
    const q = questions[this.deadClicIndex % questions.length];

    this.selectedDebit = null;
    this.selectedCredit = null;

    document.getElementById('dc-counter').textContent = `Scenario ${this.deadClicIndex + 1} of ${questions.length}`;
    document.getElementById('dc-scenario-text').textContent = q.scenario;

    const feedback = document.getElementById('dc-feedback');
    feedback.className = 'feedback-box';
    feedback.innerHTML = '';

    const btnSubmit = document.getElementById('dc-btn-submit');
    btnSubmit.disabled = false;
    btnSubmit.style.display = 'inline-block';
    document.getElementById('dc-btn-next').style.display = 'none';

    // Generate account choices (correct ones + plausible distractors)
    const debitChoices = this.generateAccountChoices(q.drAccount, 'debit');
    const creditChoices = this.generateAccountChoices(q.crAccount, 'credit');

    this.renderChoiceList('dc-debit-choices', debitChoices, 'debit');
    this.renderChoiceList('dc-credit-choices', creditChoices, 'credit');
  }

  generateAccountChoices(correctAccount, type) {
    const distractors = [
      'Purchases (Cost of Sales)',
      'Sales Revenue',
      'Bank Account',
      'Trade Payables',
      'Trade Receivables',
      'Drawings',
      'Capital Account',
      'Motor Vehicles (NCA)',
      'Motor Running Expenses',
      'Insurance Expense',
      'Accruals (Liability)',
      'Irrecoverable Debts Expense'
    ];

    const set = new Set([correctAccount]);
    while (set.size < 4) {
      const rand = distractors[Math.floor(Math.random() * distractors.length)];
      set.add(rand);
    }
    const arr = Array.from(set);
    // Shuffle
    return arr.sort(() => Math.random() - 0.5);
  }

  renderChoiceList(containerId, choices, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span>${choice}</span><span style="opacity:0.5; font-size:0.75rem;">${type.toUpperCase()}</span>`;
      btn.addEventListener('click', () => {
        container.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (type === 'debit') {
          this.selectedDebit = choice;
        } else {
          this.selectedCredit = choice;
        }
        if (window.soundEngine) window.soundEngine.play('click');
      });
      container.appendChild(btn);
    });
  }

  submitDeadClic() {
    if (!this.selectedDebit || !this.selectedCredit) {
      window.showToast('Please select both a DEBIT and a CREDIT account!', 'error');
      return;
    }

    const q = window.ACCA_DATA.DEAD_CLIC_TRANSACTIONS[this.deadClicIndex % window.ACCA_DATA.DEAD_CLIC_TRANSACTIONS.length];
    const isDrCorrect = this.selectedDebit === q.drAccount;
    const isCrCorrect = this.selectedCredit === q.crAccount;
    const isFullCorrect = isDrCorrect && isCrCorrect;

    const feedback = document.getElementById('dc-feedback');
    feedback.className = `feedback-box show ${isFullCorrect ? 'correct' : 'wrong'}`;

    if (isFullCorrect) {
      const streak = window.storageManager.getProfile().currentStreak + 1;
      const xpEarned = 25 + (streak * 5);
      window.storageManager.recordAnswer(true, 'deadClic');
      window.storageManager.addXp(xpEarned);

      if (window.soundEngine) {
        window.soundEngine.play('combo', streak);
      }

      feedback.innerHTML = `
        <strong>✓ Flawless ACCA Double Entry!</strong> (+${xpEarned} XP)
        <p style="margin-top:0.4rem;"><strong>Debit:</strong> ${q.drAccount} [${q.drCategory}]<br>
        <strong>Credit:</strong> ${q.crAccount} [${q.crCategory}]</p>
        <p style="margin-top:0.4rem; font-size:0.85rem; opacity:0.9;">${q.explanation}</p>
        ${q.trap ? `<div class="trap-warning">⚠️ <strong>ACCA Trap Alert:</strong> ${q.trap}</div>` : ''}
      `;
    } else {
      window.storageManager.recordAnswer(false, 'deadClic');
      if (window.soundEngine) window.soundEngine.play('wrong');

      feedback.innerHTML = `
        <strong>✗ Incorrect Double Entry Leg!</strong>
        <p style="margin-top:0.4rem;"><strong>Correct Debit:</strong> ${q.drAccount} (${q.drCategory})<br>
        <strong>Correct Credit:</strong> ${q.crAccount} (${q.crCategory})</p>
        <p style="margin-top:0.4rem; font-size:0.85rem; opacity:0.9;">${q.explanation}</p>
        ${q.trap ? `<div class="trap-warning">⚠️ <strong>Exam Trap:</strong> ${q.trap}</div>` : ''}
      `;
    }

    // Highlight choices
    document.querySelectorAll('#dc-debit-choices .choice-btn').forEach(btn => {
      if (btn.textContent.includes(q.drAccount)) btn.classList.add('correct');
      else if (btn.classList.contains('selected')) btn.classList.add('incorrect');
    });
    document.querySelectorAll('#dc-credit-choices .choice-btn').forEach(btn => {
      if (btn.textContent.includes(q.crAccount)) btn.classList.add('correct');
      else if (btn.classList.contains('selected')) btn.classList.add('incorrect');
    });

    document.getElementById('dc-btn-submit').style.display = 'none';
    document.getElementById('dc-btn-next').style.display = 'inline-block';
    this.updateHUD();
  }

  nextDeadClic() {
    this.deadClicIndex++;
    this.loadDeadClicQuestion();
  }

  /* -------------------------------------------------------------
     MODE 2: T-ACCOUNT BALANCING & CLOSING OFF MASTER
  ------------------------------------------------------------- */
  loadTAccountChallenge() {
    const list = window.ACCA_DATA.T_ACCOUNT_CHALLENGES;
    const ch = list[this.tAccountIndex % list.length];

    document.getElementById('ta-counter').textContent = `Account ${this.tAccountIndex + 1} of ${list.length}`;
    document.getElementById('ta-account-name').textContent = ch.accountName;
    document.getElementById('ta-account-badge').textContent = ch.accountType;

    const debitsContainer = document.getElementById('ta-debits-list');
    debitsContainer.innerHTML = '';
    let debitSum = 0;
    ch.debits.forEach(d => {
      debitSum += d.amount;
      const row = document.createElement('div');
      row.className = 't-entry-row';
      row.innerHTML = `<span>${d.desc}</span><span>£${d.amount.toLocaleString()}</span>`;
      debitsContainer.appendChild(row);
    });

    const creditsContainer = document.getElementById('ta-credits-list');
    creditsContainer.innerHTML = '';
    let creditSum = 0;
    ch.credits.forEach(c => {
      creditSum += c.amount;
      const row = document.createElement('div');
      row.className = 't-entry-row';
      row.innerHTML = `<span>${c.desc}</span><span>£${c.amount.toLocaleString()}</span>`;
      creditsContainer.appendChild(row);
    });

    // Reset inputs
    document.getElementById('ta-input-total').value = '';
    document.getElementById('ta-input-balance').value = '';
    document.getElementById('ta-select-type').selectedIndex = 0;
    document.getElementById('ta-select-dest').selectedIndex = 0;

    const feedback = document.getElementById('ta-feedback');
    feedback.className = 'feedback-box';
    feedback.innerHTML = '';

    document.getElementById('ta-btn-check').style.display = 'inline-block';
    document.getElementById('ta-btn-next').style.display = 'none';
  }

  submitTAccount() {
    const ch = window.ACCA_DATA.T_ACCOUNT_CHALLENGES[this.tAccountIndex % window.ACCA_DATA.T_ACCOUNT_CHALLENGES.length];

    const inputTotal = parseInt(document.getElementById('ta-input-total').value.replace(/,/g, ''), 10);
    const inputBalance = parseInt(document.getElementById('ta-input-balance').value.replace(/,/g, ''), 10);
    const selectedType = document.getElementById('ta-select-type').value;
    const selectedDest = document.getElementById('ta-select-dest').value;

    const totalDebits = ch.debits.reduce((a, b) => a + b.amount, 0);
    const totalCredits = ch.credits.reduce((a, b) => a + b.amount, 0);
    const actualTotal = Math.max(totalDebits, totalCredits);

    const isTotalCorrect = inputTotal === actualTotal;
    const isBalanceCorrect = inputBalance === ch.correctBalanceAmount;
    const isTypeCorrect = selectedType === ch.correctBalanceType;
    const isDestCorrect = selectedDest === (ch.isNominal ? 'spl' : 'sofp');

    const feedback = document.getElementById('ta-feedback');
    const isAllCorrect = isTotalCorrect && isBalanceCorrect && isTypeCorrect && isDestCorrect;

    feedback.className = `feedback-box show ${isAllCorrect ? 'correct' : 'wrong'}`;

    if (isAllCorrect) {
      window.storageManager.recordAnswer(true, 'tAccount');
      window.storageManager.addXp(40);
      if (window.soundEngine) {
        window.soundEngine.play('stamp');
        setTimeout(() => window.soundEngine.play('correct'), 100);
      }

      feedback.innerHTML = `
        <strong>✓ Perfect Ledger Balancing! (+40 XP)</strong>
        <p style="margin-top:0.4rem;">${ch.explanation}</p>
      `;
    } else {
      window.storageManager.recordAnswer(false, 'tAccount');
      if (window.soundEngine) window.soundEngine.play('wrong');

      feedback.innerHTML = `
        <strong>✗ Balancing Error Detected!</strong>
        <ul style="margin-top:0.4rem; padding-left:1.2rem; font-size:0.85rem;">
          <li>Total Line: Expected £${actualTotal.toLocaleString()} ${isTotalCorrect ? '✓' : `(You entered £${(inputTotal || 0).toLocaleString()})`}</li>
          <li>Balancing Amount: Expected £${ch.correctBalanceAmount.toLocaleString()} ${isBalanceCorrect ? '✓' : '✗'}</li>
          <li>Balance Type: Expected ${ch.correctBalanceType.toUpperCase()} balance ${isTypeCorrect ? '✓' : '✗'}</li>
          <li>Closing Fate: ${ch.isNominal ? 'Statement of Profit or Loss (Nominal - closed to zero!)' : 'Statement of Financial Position (Balance b/d carried forward)'} ${isDestCorrect ? '✓' : '✗'}</li>
        </ul>
        <p style="margin-top:0.4rem; font-size:0.85rem; opacity:0.9;">${ch.explanation}</p>
      `;
    }

    document.getElementById('ta-btn-check').style.display = 'none';
    document.getElementById('ta-btn-next').style.display = 'inline-block';
    this.updateHUD();
  }

  nextTAccount() {
    this.tAccountIndex++;
    this.loadTAccountChallenge();
  }

  /* -------------------------------------------------------------
     MODE 3: THE TRIAL BALANCE & SUSPENSE DETECTIVE
  ------------------------------------------------------------- */
  loadDetectiveScenario() {
    const scenarios = window.ACCA_DATA.TRIAL_BALANCE_ERRORS;
    const sc = scenarios[this.detectiveIndex % scenarios.length];

    document.getElementById('det-counter').textContent = `Mystery ${this.detectiveIndex + 1} of ${scenarios.length}`;
    document.getElementById('det-title').textContent = sc.title;
    document.getElementById('det-scenario-text').textContent = sc.scenario;

    document.getElementById('det-select-affects').selectedIndex = 0;
    document.getElementById('det-select-error-type').selectedIndex = 0;

    const feedback = document.getElementById('det-feedback');
    feedback.className = 'feedback-box';
    feedback.innerHTML = '';

    document.getElementById('det-btn-solve').style.display = 'inline-block';
    document.getElementById('det-btn-next').style.display = 'none';
  }

  submitDetective() {
    const sc = window.ACCA_DATA.TRIAL_BALANCE_ERRORS[this.detectiveIndex % window.ACCA_DATA.TRIAL_BALANCE_ERRORS.length];

    const affectsVal = document.getElementById('det-select-affects').value;
    const errorTypeVal = document.getElementById('det-select-error-type').value;

    const userAffects = affectsVal === 'yes';
    const isAffectsCorrect = userAffects === sc.affectsTrialBalance;
    const isTypeCorrect = errorTypeVal === sc.errorClass;

    const feedback = document.getElementById('det-feedback');
    const isCorrect = isAffectsCorrect && isTypeCorrect;

    feedback.className = `feedback-box show ${isCorrect ? 'correct' : 'wrong'}`;

    if (isCorrect) {
      window.storageManager.recordAnswer(true, 'detective');
      window.storageManager.addXp(35);
      if (window.soundEngine) window.soundEngine.play('correct');

      feedback.innerHTML = `
        <strong>✓ Case Solved, Detective! (+35 XP)</strong>
        <p style="margin-top:0.4rem;"><strong>Classification:</strong> ${sc.errorClass}</p>
        <p><strong>Impact on Trial Balance:</strong> ${sc.affectsTrialBalance ? 'Trial Balance Out of Balance' : 'Trial Balance Balances'}</p>
        <p><strong>Suspense Account:</strong> ${sc.suspenseImpact}</p>
        <div style="background:rgba(0,0,0,0.25); padding:0.6rem; border-radius:6px; margin-top:0.5rem; font-family:var(--font-mono); font-size:0.85rem;">
          <strong>Correcting General Journal Entry:</strong><br>
          DR: ${sc.journalCorrection.dr}<br>
          CR: ${sc.journalCorrection.cr}
        </div>
        <p style="margin-top:0.4rem; font-size:0.825rem; opacity:0.9;">${sc.syllabusNote}</p>
      `;
    } else {
      window.storageManager.recordAnswer(false, 'detective');
      if (window.soundEngine) window.soundEngine.play('wrong');

      feedback.innerHTML = `
        <strong>✗ Diagnostic Error!</strong>
        <p style="margin-top:0.4rem;"><strong>Actual Classification:</strong> ${sc.errorClass}</p>
        <p><strong>Actual TB Effect:</strong> ${sc.affectsTrialBalance ? 'Affects TB (Requires Suspense Account)' : 'Does NOT affect TB (TB still balances)'}</p>
        <div style="background:rgba(0,0,0,0.25); padding:0.6rem; border-radius:6px; margin-top:0.5rem; font-family:var(--font-mono); font-size:0.85rem;">
          <strong>Correcting Journal Entry:</strong><br>
          DR: ${sc.journalCorrection.dr}<br>
          CR: ${sc.journalCorrection.cr}
        </div>
        <p style="margin-top:0.4rem; font-size:0.825rem; opacity:0.9;">${sc.syllabusNote}</p>
      `;
    }

    document.getElementById('det-btn-solve').style.display = 'none';
    document.getElementById('det-btn-next').style.display = 'inline-block';
    this.updateHUD();
  }

  nextDetective() {
    this.detectiveIndex++;
    this.loadDetectiveScenario();
  }

  /* -------------------------------------------------------------
     MODE 4: FINANCIAL STATEMENT ARCHITECT
  ------------------------------------------------------------- */
  loadStatementArchitect() {
    const data = window.ACCA_DATA.STATEMENT_BUILDER_DATA;
    document.getElementById('fs-company-header').textContent = `${data.company} - ${data.period}`;

    // Render palette items
    const palette = document.getElementById('tb-palette-container');
    palette.innerHTML = '';
    data.trialBalance.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'tb-palette-item';
      el.id = `palette-item-${idx}`;
      el.innerHTML = `
        <span><strong>${item.account}</strong></span>
        <span style="font-family:var(--font-mono); color:${item.column === 'debit' ? 'var(--debit-color)' : 'var(--credit-color)'}">
          £${item.amount.toLocaleString()} ${item.column === 'debit' ? 'DR' : 'CR'}
        </span>
      `;
      palette.appendChild(el);
    });

    // Populate calculations
    this.renderStatementCalculations();
  }

  renderStatementCalculations() {
    const sol = window.ACCA_DATA.STATEMENT_BUILDER_DATA.solution;
    
    // Auto populate helper inputs with verification
    document.getElementById('fs-input-cos').addEventListener('input', () => this.verifyStatementForm());
    document.getElementById('fs-input-gp').addEventListener('input', () => this.verifyStatementForm());
    document.getElementById('fs-input-np').addEventListener('input', () => this.verifyStatementForm());
    document.getElementById('fs-input-cap').addEventListener('input', () => this.verifyStatementForm());
    document.getElementById('fs-input-ta').addEventListener('input', () => this.verifyStatementForm());
    document.getElementById('fs-input-tel').addEventListener('input', () => this.verifyStatementForm());
  }

  autoFillStatementDemo() {
    const sol = window.ACCA_DATA.STATEMENT_BUILDER_DATA.solution;
    document.getElementById('fs-input-cos').value = sol.costOfSales;
    document.getElementById('fs-input-gp').value = sol.grossProfit;
    document.getElementById('fs-input-np').value = sol.profitForTheYear;
    document.getElementById('fs-input-cap').value = sol.closingCapital;
    document.getElementById('fs-input-ta').value = sol.totalAssets;
    document.getElementById('fs-input-tel').value = sol.totalEquityAndLiabilities;
    this.verifyStatementForm();
  }

  verifyStatementForm() {
    const sol = window.ACCA_DATA.STATEMENT_BUILDER_DATA.solution;

    const vCos = parseInt(document.getElementById('fs-input-cos').value, 10);
    const vGp = parseInt(document.getElementById('fs-input-gp').value, 10);
    const vNp = parseInt(document.getElementById('fs-input-np').value, 10);
    const vCap = parseInt(document.getElementById('fs-input-cap').value, 10);
    const vTa = parseInt(document.getElementById('fs-input-ta').value, 10);
    const vTel = parseInt(document.getElementById('fs-input-tel').value, 10);

    const matchCos = vCos === sol.costOfSales;
    const matchGp = vGp === sol.grossProfit;
    const matchNp = vNp === sol.profitForTheYear;
    const matchCap = vCap === sol.closingCapital;
    const matchTa = vTa === sol.totalAssets;
    const matchTel = vTel === sol.totalEquityAndLiabilities;

    const feedback = document.getElementById('fs-feedback');
    const allMatch = matchCos && matchGp && matchNp && matchCap && matchTa && matchTel && (vTa === vTel);

    if (allMatch) {
      feedback.className = 'feedback-box show correct';
      feedback.innerHTML = `
        <strong>🎉 BALANCE SHEET BALANCED! PERFECT ACCA FINANCIAL STATEMENTS!</strong>
        <p style="margin-top:0.4rem;">
          Total Assets (£${sol.totalAssets.toLocaleString()}) = Total Equity & Liabilities (£${sol.totalEquityAndLiabilities.toLocaleString()}).<br>
          Cost of Sales: £${sol.costOfSales.toLocaleString()} | Gross Profit: £${sol.grossProfit.toLocaleString()} | Profit for Year: £${sol.profitForTheYear.toLocaleString()} | Closing Capital: £${sol.closingCapital.toLocaleString()}.
        </p>
      `;
      window.storageManager.recordAnswer(true, 'statements');
      window.storageManager.addXp(60);
      if (window.soundEngine) window.soundEngine.play('levelUp');
      this.updateHUD();
    } else {
      feedback.className = 'feedback-box show wrong';
      feedback.innerHTML = `
        <strong>Statement Imbalance / Working in Progress</strong>
        <p style="margin-top:0.3rem; font-size:0.85rem;">
          Check your workings: Cost of Sales = Opening Inventory + Purchases + Carriage Inwards - Closing Inventory (£21,000).<br>
          Closing Capital = Opening Capital (£89,000) + Net Profit - Drawings (£15,000).
        </p>
      `;
    }
  }

  /* -------------------------------------------------------------
     MODE 5: IAS 2 INVENTORY & ASSET TYCOON
  ------------------------------------------------------------- */
  loadInventoryChallenge() {
    const tasks = window.ACCA_DATA.INVENTORY_AND_DEPRECIATION_TASKS;
    const task = tasks[0]; // IAS 2 Lower of Cost & NRV

    const container = document.getElementById('inv-table-body');
    container.innerHTML = '';
    task.items.forEach((item, idx) => {
      const nrv = item.expectedSellingPrice - item.completionCosts - item.sellingExpenses;
      const lower = Math.min(item.cost, nrv);
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid var(--border)';
      row.innerHTML = `
        <td style="padding:0.6rem 0.5rem;">${item.product}</td>
        <td style="padding:0.6rem 0.5rem; text-align:right; font-family:var(--font-mono);">£${item.cost.toLocaleString()}</td>
        <td style="padding:0.6rem 0.5rem; text-align:right; font-family:var(--font-mono);">£${item.expectedSellingPrice.toLocaleString()}</td>
        <td style="padding:0.6rem 0.5rem; text-align:right; font-family:var(--font-mono); color:#fbbf24;">£${nrv.toLocaleString()}</td>
        <td style="padding:0.6rem 0.5rem; text-align:right;">
          <input type="number" id="inv-item-${idx}" class="hud-pill" style="width:110px; font-family:var(--font-mono); text-align:right;" placeholder="Lower...">
        </td>
      `;
      container.appendChild(row);
    });

    const feedback = document.getElementById('inv-feedback');
    feedback.className = 'feedback-box';
    feedback.innerHTML = '';
  }

  submitInventory() {
    const task = window.ACCA_DATA.INVENTORY_AND_DEPRECIATION_TASKS[0];
    let allItemsCorrect = true;
    let userSum = 0;

    task.items.forEach((item, idx) => {
      const input = document.getElementById(`inv-item-${idx}`);
      const val = parseInt(input.value, 10);
      const nrv = item.expectedSellingPrice - item.completionCosts - item.sellingExpenses;
      const actualLower = Math.min(item.cost, nrv);

      if (val === actualLower) {
        input.style.borderColor = 'var(--success)';
        userSum += val;
      } else {
        input.style.borderColor = 'var(--error)';
        allItemsCorrect = false;
      }
    });

    const feedback = document.getElementById('inv-feedback');
    feedback.className = `feedback-box show ${allItemsCorrect ? 'correct' : 'wrong'}`;

    if (allItemsCorrect) {
      window.storageManager.recordAnswer(true, 'inventory');
      window.storageManager.addXp(45);
      if (window.soundEngine) window.soundEngine.play('correct');

      feedback.innerHTML = `
        <strong>✓ IAS 2 Valuation Mastered! (+45 XP)</strong>
        <p style="margin-top:0.4rem;">Total Inventory carrying amount recognized in SOFP = £${task.correctTotal.toLocaleString()}.</p>
        <p style="font-size:0.85rem; opacity:0.9;">Write-down of £${task.writeDownAmount.toLocaleString()} is charged to Cost of Sales in the Statement of Profit or Loss per IAS 2.</p>
        <p style="margin-top:0.4rem; font-size:0.825rem; color:#fcd34d;">⚠️ <strong>ACCA Rule:</strong> Lower of cost and NRV must be applied line by line, never en bloc!</p>
      `;
    } else {
      window.storageManager.recordAnswer(false, 'inventory');
      if (window.soundEngine) window.soundEngine.play('wrong');

      feedback.innerHTML = `
        <strong>✗ Inventory Valuation Error!</strong>
        <p style="margin-top:0.4rem;">Ensure you calculate NRV as: Expected Selling Price minus estimated costs to completion minus estimated selling expenses.</p>
        <p style="font-size:0.85rem;">Then select the LOWER figure between Cost and NRV for each individual product.</p>
      `;
    }
    this.updateHUD();
  }

  /* -------------------------------------------------------------
     MODE 6: ACCA FFA EXAM TRAP BLITZ
  ------------------------------------------------------------- */
  loadBlitzQuestion() {
    const list = window.ACCA_DATA.EXAM_TRAP_BLITZ_QUESTIONS;
    const q = list[this.blitzIndex % list.length];

    document.getElementById('blitz-counter').textContent = `Question ${this.blitzIndex + 1} of ${list.length}`;
    document.getElementById('blitz-tag').textContent = q.syllabusTag;
    document.getElementById('blitz-question-text').textContent = q.question;

    const optionsContainer = document.getElementById('blitz-options');
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span>${opt}</span><span style="opacity:0.4; font-size:0.75rem;">[${String.fromCharCode(65 + idx)}]</span>`;
      btn.addEventListener('click', () => this.handleBlitzChoice(idx, btn));
      optionsContainer.appendChild(btn);
    });

    const feedback = document.getElementById('blitz-feedback');
    feedback.className = 'feedback-box';
    feedback.innerHTML = '';

    document.getElementById('blitz-btn-next').style.display = 'none';
  }

  handleBlitzChoice(selectedIndex, btnElement) {
    const q = window.ACCA_DATA.EXAM_TRAP_BLITZ_QUESTIONS[this.blitzIndex % window.ACCA_DATA.EXAM_TRAP_BLITZ_QUESTIONS.length];
    const isCorrect = selectedIndex === q.correctIndex;

    const feedback = document.getElementById('blitz-feedback');
    feedback.className = `feedback-box show ${isCorrect ? 'correct' : 'wrong'}`;

    document.querySelectorAll('#blitz-options .choice-btn').forEach((b, idx) => {
      b.disabled = true;
      if (idx === q.correctIndex) {
        b.classList.add('correct');
      } else if (idx === selectedIndex) {
        b.classList.add('incorrect');
      }
    });

    if (isCorrect) {
      window.storageManager.recordAnswer(true, 'blitz');
      window.storageManager.addXp(30);
      if (window.soundEngine) window.soundEngine.play('correct');

      feedback.innerHTML = `
        <strong>✓ Correct ACCA Examination Response! (+30 XP)</strong>
        <div class="trap-warning" style="margin-top:0.4rem;">
          🛡️ <strong>Trap Breakdown:</strong> ${q.trapAlert}
        </div>
      `;
    } else {
      window.storageManager.recordAnswer(false, 'blitz');
      if (window.soundEngine) window.soundEngine.play('wrong');

      feedback.innerHTML = `
        <strong>✗ Caught in the Exam Trap!</strong>
        <div class="trap-warning" style="margin-top:0.4rem;">
          ⚠️ <strong>Trap Alert:</strong> ${q.trapAlert}
        </div>
      `;
    }

    document.getElementById('blitz-btn-next').style.display = 'inline-block';
    this.updateHUD();
  }

  nextBlitz() {
    this.blitzIndex++;
    this.loadBlitzQuestion();
  }

  /* -------------------------------------------------------------
     PROFILE & STORAGE MODAL MANAGEMENT
  ------------------------------------------------------------- */
  renderProfileModal() {
    const profile = window.storageManager.getProfile();
    const badges = window.storageManager.getAllBadges();

    document.getElementById('prof-input-name').value = profile.name;
    document.getElementById('prof-rank-title').textContent = profile.title;
    document.getElementById('prof-xp-display').textContent = `${profile.xp} XP (Level ${profile.level})`;
    document.getElementById('prof-coins-display').textContent = `${profile.coins} Marks`;
    document.getElementById('prof-accuracy-display').textContent = 
      profile.totalCorrect + profile.totalWrong > 0
        ? `${Math.round((profile.totalCorrect / (profile.totalCorrect + profile.totalWrong)) * 100)}%`
        : '0%';

    const badgeGrid = document.getElementById('prof-badges-grid');
    badgeGrid.innerHTML = '';
    badges.forEach(b => {
      const card = document.createElement('div');
      card.className = `badge-card ${b.unlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      `;
      badgeGrid.appendChild(card);
    });
  }

  saveProfileName() {
    const newName = document.getElementById('prof-input-name').value.trim();
    if (newName) {
      window.storageManager.updateProfile({ name: newName });
      this.updateHUD();
      window.showToast('Profile updated!', 'success');
    }
  }

  renderHistoryModal() {
    const profile = window.storageManager.getProfile();
    const tbody = document.getElementById('history-table-body');
    tbody.innerHTML = '';

    if (!profile.history || profile.history.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--text-dim);">No game sessions recorded yet. Play a match to log audit trail!</td></tr>';
      return;
    }

    profile.history.forEach(h => {
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid var(--border)';
      const dateStr = new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
      row.innerHTML = `
        <td style="padding:0.6rem 0.5rem; font-size:0.8rem; color:var(--text-muted);">${dateStr}</td>
        <td style="padding:0.6rem 0.5rem; font-weight:600;">${h.modeName || h.modeId}</td>
        <td style="padding:0.6rem 0.5rem; font-family:var(--font-mono); color:#38bdf8;">${h.score || 0}</td>
        <td style="padding:0.6rem 0.5rem; font-family:var(--font-mono); color:#34d399;">${h.accuracy || 100}%</td>
        <td style="padding:0.6rem 0.5rem; font-family:var(--font-mono); color:#fbbf24;">+${h.xpEarned || 20} XP</td>
      `;
      tbody.appendChild(row);
    });
  }

  exportData() {
    const jsonStr = window.storageManager.exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acca_financial_accounting_save_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.showToast('Save data exported to JSON file!', 'success');
  }

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = window.storageManager.importDataJson(e.target.result);
      if (res.success) {
        this.updateHUD();
        this.renderProfileModal();
        window.showToast('Save data successfully restored!', 'success');
      } else {
        window.showToast(`Import error: ${res.error}`, 'error');
      }
    };
    reader.readAsText(file);
  }

  confirmReset() {
    if (confirm('Are you sure you want to reset all game data, XP, and badges? This cannot be undone.')) {
      window.storageManager.resetData();
      this.updateHUD();
      this.renderProfileModal();
      window.showToast('Game data reset to default.', 'success');
    }
  }
}

// Global Toast System
window.showToast = function(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'}</span> <span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => container.removeChild(toast), 300);
  }, 3500);
};

// Initialize Game Engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new GameEngine();
});
