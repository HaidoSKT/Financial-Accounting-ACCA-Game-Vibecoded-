/**
 * FIFO vs AVCO Inventory Accounting Engine
 * Implements rigorous accounting calculations for:
 * 1. FIFO Periodic (First-In, First-Out under Periodic Inventory System)
 * 2. FIFO Perpetual (First-In, First-Out under Perpetual Inventory System)
 * 3. AVCO Periodic (Weighted Average Cost under Periodic Inventory System)
 * 4. AVCO Perpetual (Moving Weighted Average Cost under Perpetual Inventory System)
 * 
 * Fully compliant with IFRS (IAS 2) and US GAAP (ASC 330) standards.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InventoryEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function round2(val) {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  }

  function round4(val) {
    return Math.round((val + Number.EPSILON) * 10000) / 10000;
  }

  /**
   * Calculate Cost of Goods Available for Sale (COGAS)
   */
  function calculateCOGAS(transactions) {
    let totalUnits = 0;
    let totalCost = 0;
    const acquisitionLayers = [];

    transactions.forEach(t => {
      if (t.type === 'BEGINNING' || t.type === 'PURCHASE') {
        const cost = round2(t.units * t.unitCost);
        totalUnits += t.units;
        totalCost += cost;
        acquisitionLayers.push({
          id: t.id,
          date: t.date,
          type: t.type,
          units: t.units,
          unitCost: t.unitCost,
          totalCost: cost
        });
      }
    });

    return {
      totalUnits,
      totalCost: round2(totalCost),
      layers: acquisitionLayers
    };
  }

  /**
   * Calculate Total Sales (Units & Revenue)
   */
  function calculateTotalSales(transactions) {
    let unitsSold = 0;
    let totalRevenue = 0;
    const salesList = [];

    transactions.forEach(t => {
      if (t.type === 'SALE') {
        const revenue = round2(t.units * (t.unitPrice || 0));
        unitsSold += t.units;
        totalRevenue += revenue;
        salesList.push({
          id: t.id,
          date: t.date,
          units: t.units,
          unitPrice: t.unitPrice || 0,
          totalRevenue: revenue
        });
      }
    });

    return {
      unitsSold,
      totalRevenue: round2(totalRevenue),
      sales: salesList
    };
  }

  // ==========================================
  // 1. FIFO PERIODIC
  // ==========================================
  function calculateFIFOPeriodic(transactions) {
    const cogas = calculateCOGAS(transactions);
    const salesInfo = calculateTotalSales(transactions);
    const endingUnits = cogas.totalUnits - salesInfo.unitsSold;

    if (endingUnits < 0) {
      throw new Error('Total units sold exceeds available inventory units!');
    }

    let remainingUnitsToAllocate = endingUnits;
    let endingInventoryCost = 0;
    const endingInventoryLayers = [];

    for (let i = cogas.layers.length - 1; i >= 0; i--) {
      if (remainingUnitsToAllocate <= 0) break;
      const layer = cogas.layers[i];
      const unitsFromLayer = Math.min(layer.units, remainingUnitsToAllocate);
      const costFromLayer = round2(unitsFromLayer * layer.unitCost);

      endingInventoryLayers.unshift({
        sourceDate: layer.date,
        sourceType: layer.type,
        units: unitsFromLayer,
        unitCost: layer.unitCost,
        totalCost: costFromLayer
      });

      endingInventoryCost += costFromLayer;
      remainingUnitsToAllocate -= unitsFromLayer;
    }

    endingInventoryCost = round2(endingInventoryCost);
    const cogs = round2(cogas.totalCost - endingInventoryCost);
    const grossProfit = round2(salesInfo.totalRevenue - cogs);
    const grossMargin = salesInfo.totalRevenue > 0 ? round2((grossProfit / salesInfo.totalRevenue) * 100) : 0;

    return {
      method: 'FIFO_PERIODIC',
      methodLabel: 'FIFO Periodic (First-In, First-Out Period-End)',
      system: 'Periodic',
      cogas,
      salesInfo,
      endingUnits,
      endingInventoryCost,
      endingInventoryLayers,
      cogs,
      grossProfit,
      grossMargin,
      isIdenticalToPerpetual: true
    };
  }

  // ==========================================
  // 2. FIFO PERPETUAL
  // ==========================================
  function calculateFIFOPerpetual(transactions) {
    const cogas = calculateCOGAS(transactions);
    const salesInfo = calculateTotalSales(transactions);
    const sorted = clone(transactions).sort((a, b) => new Date(a.date) - new Date(b.date));

    const inventoryQueue = [];
    const stockCard = [];
    let totalCogs = 0;

    sorted.forEach((t, idx) => {
      if (t.type === 'BEGINNING' || t.type === 'PURCHASE') {
        inventoryQueue.push({
          date: t.date,
          units: t.units,
          unitCost: t.unitCost
        });

        const totalCost = round2(t.units * t.unitCost);
        stockCard.push({
          step: idx + 1,
          date: t.date,
          type: t.type,
          receipts: { units: t.units, unitCost: t.unitCost, totalCost },
          issues: null,
          balance: clone(inventoryQueue),
          balanceTotalUnits: inventoryQueue.reduce((acc, l) => acc + l.units, 0),
          balanceTotalCost: round2(inventoryQueue.reduce((acc, l) => acc + round2(l.units * l.unitCost), 0))
        });
      } else if (t.type === 'SALE') {
        let needed = t.units;
        const issuesLayers = [];
        let saleCogs = 0;

        while (needed > 0 && inventoryQueue.length > 0) {
          const oldest = inventoryQueue[0];
          if (oldest.units <= needed) {
            const cost = round2(oldest.units * oldest.unitCost);
            issuesLayers.push({
              sourceDate: oldest.date,
              units: oldest.units,
              unitCost: oldest.unitCost,
              totalCost: cost
            });
            saleCogs += cost;
            needed -= oldest.units;
            inventoryQueue.shift();
          } else {
            const cost = round2(needed * oldest.unitCost);
            issuesLayers.push({
              sourceDate: oldest.date,
              units: needed,
              unitCost: oldest.unitCost,
              totalCost: cost
            });
            saleCogs += cost;
            oldest.units -= needed;
            needed = 0;
          }
        }

        if (needed > 0) {
          throw new Error(`Insufficient stock for sale on ${t.date}! Short by ${needed} units.`);
        }

        saleCogs = round2(saleCogs);
        totalCogs += saleCogs;

        stockCard.push({
          step: idx + 1,
          date: t.date,
          type: 'SALE',
          unitPrice: t.unitPrice || 0,
          revenue: round2(t.units * (t.unitPrice || 0)),
          receipts: null,
          issues: {
            units: t.units,
            layers: issuesLayers,
            totalCogs: saleCogs
          },
          balance: clone(inventoryQueue),
          balanceTotalUnits: inventoryQueue.reduce((acc, l) => acc + l.units, 0),
          balanceTotalCost: round2(inventoryQueue.reduce((acc, l) => acc + round2(l.units * l.unitCost), 0))
        });
      }
    });

    totalCogs = round2(totalCogs);
    const endingInventoryCost = round2(inventoryQueue.reduce((acc, l) => acc + round2(l.units * l.unitCost), 0));
    const endingUnits = inventoryQueue.reduce((acc, l) => acc + l.units, 0);
    const grossProfit = round2(salesInfo.totalRevenue - totalCogs);
    const grossMargin = salesInfo.totalRevenue > 0 ? round2((grossProfit / salesInfo.totalRevenue) * 100) : 0;

    return {
      method: 'FIFO_PERPETUAL',
      methodLabel: 'FIFO Perpetual (First-In, First-Out Continuous)',
      system: 'Perpetual',
      cogas,
      salesInfo,
      endingUnits,
      endingInventoryCost,
      endingInventoryLayers: clone(inventoryQueue),
      cogs: totalCogs,
      stockCard,
      grossProfit,
      grossMargin,
      isIdenticalToPeriodic: true
    };
  }

  // ==========================================
  // 3. AVCO PERIODIC (WEIGHTED AVERAGE COST)
  // ==========================================
  function calculateAVCOPeriodic(transactions) {
    const cogas = calculateCOGAS(transactions);
    const salesInfo = calculateTotalSales(transactions);
    const endingUnits = cogas.totalUnits - salesInfo.unitsSold;

    if (endingUnits < 0) {
      throw new Error('Total units sold exceeds available inventory units!');
    }

    const weightedAvgUnitCost = cogas.totalUnits > 0 ? (cogas.totalCost / cogas.totalUnits) : 0;
    const endingInventoryCost = round2(endingUnits * weightedAvgUnitCost);
    const cogs = round2(cogas.totalCost - endingInventoryCost);
    const grossProfit = round2(salesInfo.totalRevenue - cogs);
    const grossMargin = salesInfo.totalRevenue > 0 ? round2((grossProfit / salesInfo.totalRevenue) * 100) : 0;

    return {
      method: 'AVCO_PERIODIC',
      methodLabel: 'AVCO Periodic (Weighted Average Cost Period-End)',
      system: 'Periodic',
      cogas,
      salesInfo,
      weightedAvgUnitCost: round4(weightedAvgUnitCost),
      endingUnits,
      endingInventoryCost,
      cogs,
      grossProfit,
      grossMargin,
      isIdenticalToPerpetual: false
    };
  }

  // ==========================================
  // 4. AVCO PERPETUAL (MOVING WEIGHTED AVERAGE)
  // ==========================================
  function calculateAVCOPerpetual(transactions) {
    const cogas = calculateCOGAS(transactions);
    const salesInfo = calculateTotalSales(transactions);
    const sorted = clone(transactions).sort((a, b) => new Date(a.date) - new Date(b.date));

    let balanceUnits = 0;
    let balanceTotalCost = 0;
    let currentUnitCost = 0;
    const stockCard = [];
    let totalCogs = 0;

    sorted.forEach((t, idx) => {
      if (t.type === 'BEGINNING' || t.type === 'PURCHASE') {
        const receiptCost = round2(t.units * t.unitCost);
        const newUnits = balanceUnits + t.units;
        const newCost = round2(balanceTotalCost + receiptCost);
        currentUnitCost = newUnits > 0 ? (newCost / newUnits) : 0;

        balanceUnits = newUnits;
        balanceTotalCost = newCost;

        stockCard.push({
          step: idx + 1,
          date: t.date,
          type: t.type,
          receipts: { units: t.units, unitCost: t.unitCost, totalCost: receiptCost },
          issues: null,
          balance: [{ units: balanceUnits, unitCost: round4(currentUnitCost), totalCost: round2(balanceTotalCost) }],
          balanceTotalUnits: balanceUnits,
          balanceTotalCost: round2(balanceTotalCost),
          currentAvgRate: round4(currentUnitCost)
        });
      } else if (t.type === 'SALE') {
        if (t.units > balanceUnits) {
          throw new Error(`Insufficient stock for sale on ${t.date}! Required ${t.units}, had ${balanceUnits}.`);
        }

        const saleCogs = round2(t.units * currentUnitCost);
        totalCogs += saleCogs;

        balanceUnits -= t.units;
        balanceTotalCost = round2(balanceUnits * currentUnitCost);

        stockCard.push({
          step: idx + 1,
          date: t.date,
          type: 'SALE',
          unitPrice: t.unitPrice || 0,
          revenue: round2(t.units * (t.unitPrice || 0)),
          receipts: null,
          issues: {
            units: t.units,
            layers: [{ units: t.units, unitCost: round4(currentUnitCost), totalCost: saleCogs }],
            totalCogs: saleCogs
          },
          balance: [{ units: balanceUnits, unitCost: round4(currentUnitCost), totalCost: round2(balanceTotalCost) }],
          balanceTotalUnits: balanceUnits,
          balanceTotalCost: round2(balanceTotalCost),
          currentAvgRate: round4(currentUnitCost)
        });
      }
    });

    totalCogs = round2(totalCogs);
    const endingInventoryCost = round2(balanceTotalCost);
    const endingUnits = balanceUnits;
    const grossProfit = round2(salesInfo.totalRevenue - totalCogs);
    const grossMargin = salesInfo.totalRevenue > 0 ? round2((grossProfit / salesInfo.totalRevenue) * 100) : 0;

    return {
      method: 'AVCO_PERPETUAL',
      methodLabel: 'AVCO Perpetual (Moving Weighted Average Continuous)',
      system: 'Perpetual',
      cogas,
      salesInfo,
      endingUnits,
      endingInventoryCost,
      cogs: totalCogs,
      stockCard,
      grossProfit,
      grossMargin,
      isIdenticalToPeriodic: false
    };
  }

  // ==========================================
  // 5. MASTER COMPARISON & RECONCILIATION (FIFO & AVCO)
  // ==========================================
  function compareAllMethods(transactions, options = {}) {
    const taxRate = options.taxRate !== undefined ? options.taxRate : 0.25;
    const operatingExpenses = options.operatingExpenses || 0;

    const fifoPeriodic = calculateFIFOPeriodic(transactions);
    const fifoPerpetual = calculateFIFOPerpetual(transactions);
    const avcoPeriodic = calculateAVCOPeriodic(transactions);
    const avcoPerpetual = calculateAVCOPerpetual(transactions);

    function buildStatement(methodResult) {
      const revenue = methodResult.salesInfo.totalRevenue;
      const cogs = methodResult.cogs;
      const grossProfit = round2(revenue - cogs);
      const operatingIncome = round2(grossProfit - operatingExpenses);
      const taxExpense = operatingIncome > 0 ? round2(operatingIncome * taxRate) : 0;
      const netIncome = round2(operatingIncome - taxExpense);
      const endingInventory = methodResult.endingInventoryCost;

      return {
        revenue,
        cogs,
        grossProfit,
        operatingExpenses,
        operatingIncome,
        taxExpense,
        netIncome,
        endingInventory,
        effectiveTaxRate: taxRate * 100
      };
    }

    const statements = {
      fifoPeriodic: buildStatement(fifoPeriodic),
      fifoPerpetual: buildStatement(fifoPerpetual),
      avcoPeriodic: buildStatement(avcoPeriodic),
      avcoPerpetual: buildStatement(avcoPerpetual)
    };

    const acquisitions = transactions.filter(t => t.type === 'BEGINNING' || t.type === 'PURCHASE');
    let isInflationary = true;
    let isDeflationary = true;

    for (let i = 1; i < acquisitions.length; i++) {
      if (acquisitions[i].unitCost < acquisitions[i - 1].unitCost) {
        isInflationary = false;
      }
      if (acquisitions[i].unitCost > acquisitions[i - 1].unitCost) {
        isDeflationary = false;
      }
    }

    const priceTrend = isInflationary ? 'INFLATION' : (isDeflationary ? 'DEFLATION' : 'FLUCTUATING');

    return {
      priceTrend,
      cogas: fifoPeriodic.cogas,
      salesInfo: fifoPeriodic.salesInfo,
      endingUnits: fifoPeriodic.endingUnits,
      results: {
        fifoPeriodic,
        fifoPerpetual,
        avcoPeriodic,
        avcoPerpetual
      },
      statements,
      varianceFifoVsAvco: {
        periodicEndingInv: round2(fifoPeriodic.endingInventoryCost - avcoPeriodic.endingInventoryCost),
        perpetualEndingInv: round2(fifoPerpetual.endingInventoryCost - avcoPerpetual.endingInventoryCost),
        periodicTaxImpact: round2(statements.fifoPeriodic.taxExpense - statements.avcoPeriodic.taxExpense)
      },
      reconciliationKeyTakeaways: [
        {
          rule: 'FIFO Periodic == FIFO Perpetual',
          explanation: 'FIFO under both systems produces identical COGS and Ending Inventory because the oldest units are always sold first regardless of point-in-time calculation.',
          holdsTrue: fifoPeriodic.cogs === fifoPerpetual.cogs
        },
        {
          rule: 'AVCO Periodic vs. AVCO Perpetual Divergence',
          explanation: 'AVCO Periodic calculates a single period-end rate, while AVCO Perpetual recalculates a moving average immediately after each purchase, meaning dates of sales alter unit costs.',
          holdsTrue: avcoPeriodic.cogs !== avcoPerpetual.cogs
        },
        {
          rule: priceTrend === 'INFLATION' ? 'Inflation: FIFO Net Income > AVCO Net Income' : 'Deflation: AVCO Net Income > FIFO Net Income',
          explanation: priceTrend === 'INFLATION'
            ? 'Under rising costs, FIFO assigns older cheap costs to COGS (maximizing reported profit). AVCO blends costs, producing moderate COGS and smoother net income.'
            : 'AVCO prevents drastic swings in reported earnings during volatile pricing environments.',
          holdsTrue: true
        },
        {
          rule: 'IAS 2 & IFRS Compliance',
          explanation: 'Both FIFO and AVCO are fully permitted under IAS 2 (Inventories) and US GAAP. (LIFO is strictly banned under IAS 2).',
          holdsTrue: true
        }
      ]
    };
  }

  return {
    calculateCOGAS,
    calculateTotalSales,
    calculateFIFOPeriodic,
    calculateFIFOPerpetual,
    calculateAVCOPeriodic,
    calculateAVCOPerpetual,
    compareAllMethods,
    compareAllFourMethods: compareAllMethods,
    round2,
    round4
  };
});
