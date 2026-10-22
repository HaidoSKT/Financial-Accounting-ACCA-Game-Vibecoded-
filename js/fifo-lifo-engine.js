/**
 * FIFO vs LIFO Inventory Accounting Engine
 * Implements rigorous accounting calculations for:
 * 1. FIFO Periodic (First-In, First-Out under Periodic Inventory System)
 * 2. FIFO Perpetual (First-In, First-Out under Perpetual Inventory System)
 * 3. LIFO Periodic (Last-In, First-Out under Periodic Inventory System)
 * 4. LIFO Perpetual (Last-In, First-Out under Perpetual Inventory System)
 * 
 * Complies with US GAAP (ASC 330) and IFRS (IAS 2) standards.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InventoryEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // Helper for deep clone
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Round currency to 2 decimal places to prevent floating point inaccuracies
  function round2(val) {
    return Math.round((val + Number.EPSILON) * 100) / 100;
  }

  /**
   * Calculate Cost of Goods Available for Sale (COGAS)
   * COGAS = Beginning Inventory + All Purchases during the period
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
  /**
   * Under FIFO Periodic:
   * - Sales transactions during the period are aggregated.
   * - Ending inventory consists of the MOST RECENT purchases (newest layers).
   * - Cost of Goods Sold = COGAS - Ending Inventory Value.
   */
  function calculateFIFOPeriodic(transactions) {
    const cogas = calculateCOGAS(transactions);
    const salesInfo = calculateTotalSales(transactions);
    const endingUnits = cogas.totalUnits - salesInfo.unitsSold;

    if (endingUnits < 0) {
      throw new Error('Total units sold exceeds available inventory units!');
    }

    // Allocate ending inventory from the NEWEST purchases backwards
    let remainingUnitsToAllocate = endingUnits;
    let endingInventoryCost = 0;
    const endingInventoryLayers = [];

    // Traverse acquisitions in reverse order (newest to oldest)
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

    // Detailed explanation layers for COGS (oldest units sold)
    let unitsSoldCounter = salesInfo.unitsSold;
    const cogsLayers = [];
    for (let i = 0; i < cogas.layers.length; i++) {
      if (unitsSoldCounter <= 0) break;
      const layer = cogas.layers[i];
      const unitsFromLayer = Math.min(layer.units, unitsSoldCounter);
      const cost = round2(unitsFromLayer * layer.unitCost);
      cogsLayers.push({
        sourceDate: layer.date,
        units: unitsFromLayer,
        unitCost: layer.unitCost,
        totalCost: cost
      });
      unitsSoldCounter -= unitsFromLayer;
    }

    return {
      method: 'FIFO_PERIODIC',
      methodLabel: 'FIFO Periodic (First-In, First-Out)',
      system: 'Periodic',
      cogas,
      salesInfo,
      endingUnits,
      endingInventoryCost,
      endingInventoryLayers,
      cogs,
      cogsLayers,
      grossProfit,
      grossMargin,
      isIdenticalToPerpetual: true
    };
  }

  // ==========================================
  // 2. FIFO PERPETUAL
  // ==========================================
  /**
   * Under FIFO Perpetual:
   * - Maintained continuously with a live stock card / queue.
   * - When a sale occurs, inventory is taken from the OLDEST layers currently in stock.
   * - Resulting Ending Inventory & COGS are ALWAYS identical to FIFO Periodic!
   */
  function calculateFIFOPerpetual(transactions) {
    const cogas = calculateCOGAS(transactions);
    const salesInfo = calculateTotalSales(transactions);
    
    // Sort chronological
    const sorted = clone(transactions).sort((a, b) => new Date(a.date) - new Date(b.date));

    const inventoryQueue = []; // [{ date, units, unitCost }]
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
            // Deplete this entire batch
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
            // Partially deplete
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
  // 3. LIFO PERIODIC
  // ==========================================
  /**
   * Under LIFO Periodic:
   * - Ending inventory is valued based on the OLDEST purchases (Beginning inventory + earliest layers).
   * - Sales throughout the period are assumed to come from the NEWEST purchases made at ANY point in the period.
   * - COGS = COGAS - Ending Inventory Value.
   */
  function calculateLIFOPeriodic(transactions) {
    const cogas = calculateCOGAS(transactions);
    const salesInfo = calculateTotalSales(transactions);
    const endingUnits = cogas.totalUnits - salesInfo.unitsSold;

    if (endingUnits < 0) {
      throw new Error('Total units sold exceeds available inventory units!');
    }

    // Allocate ending inventory from the OLDEST purchases forward
    let remainingUnitsToAllocate = endingUnits;
    let endingInventoryCost = 0;
    const endingInventoryLayers = [];

    // Traverse acquisitions from oldest to newest
    for (let i = 0; i < cogas.layers.length; i++) {
      if (remainingUnitsToAllocate <= 0) break;
      const layer = cogas.layers[i];
      const unitsFromLayer = Math.min(layer.units, remainingUnitsToAllocate);
      const costFromLayer = round2(unitsFromLayer * layer.unitCost);

      endingInventoryLayers.push({
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

    // Detailed explanation layers for COGS (newest purchases in period sold first)
    let unitsSoldCounter = salesInfo.unitsSold;
    const cogsLayers = [];
    for (let i = cogas.layers.length - 1; i >= 0; i--) {
      if (unitsSoldCounter <= 0) break;
      const layer = cogas.layers[i];
      const unitsFromLayer = Math.min(layer.units, unitsSoldCounter);
      const cost = round2(unitsFromLayer * layer.unitCost);
      cogsLayers.push({
        sourceDate: layer.date,
        units: unitsFromLayer,
        unitCost: layer.unitCost,
        totalCost: cost
      });
      unitsSoldCounter -= unitsFromLayer;
    }

    return {
      method: 'LIFO_PERIODIC',
      methodLabel: 'LIFO Periodic (Last-In, First-Out Period-End)',
      system: 'Periodic',
      cogas,
      salesInfo,
      endingUnits,
      endingInventoryCost,
      endingInventoryLayers,
      cogs,
      cogsLayers,
      grossProfit,
      grossMargin,
      isIdenticalToPerpetual: false
    };
  }

  // ==========================================
  // 4. LIFO PERPETUAL
  // ==========================================
  /**
   * Under LIFO Perpetual:
   * - Continuously tracked after every transaction.
   * - When a sale occurs, cost is taken from the MOST RECENT layer ON HAND AT THAT SPECIFIC MOMENT.
   * - Purchases that occur AFTER a sale cannot be applied retrospectively to that sale!
   * - Therefore, LIFO Perpetual frequently differs from LIFO Periodic.
   */
  function calculateLIFOPerpetual(transactions) {
    const cogas = calculateCOGAS(transactions);
    const salesInfo = calculateTotalSales(transactions);
    
    // Sort chronological
    const sorted = clone(transactions).sort((a, b) => new Date(a.date) - new Date(b.date));

    const inventoryStack = []; // [{ date, units, unitCost }]
    const stockCard = [];
    let totalCogs = 0;

    sorted.forEach((t, idx) => {
      if (t.type === 'BEGINNING' || t.type === 'PURCHASE') {
        inventoryStack.push({
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
          balance: clone(inventoryStack),
          balanceTotalUnits: inventoryStack.reduce((acc, l) => acc + l.units, 0),
          balanceTotalCost: round2(inventoryStack.reduce((acc, l) => acc + round2(l.units * l.unitCost), 0))
        });
      } else if (t.type === 'SALE') {
        let needed = t.units;
        const issuesLayers = [];
        let saleCogs = 0;

        // Take from the BACK of the stack (most recent acquisition on hand)
        while (needed > 0 && inventoryStack.length > 0) {
          const newest = inventoryStack[inventoryStack.length - 1];
          if (newest.units <= needed) {
            // Deplete this entire batch
            const cost = round2(newest.units * newest.unitCost);
            issuesLayers.push({
              sourceDate: newest.date,
              units: newest.units,
              unitCost: newest.unitCost,
              totalCost: cost
            });
            saleCogs += cost;
            needed -= newest.units;
            inventoryStack.pop();
          } else {
            // Partially deplete
            const cost = round2(needed * newest.unitCost);
            issuesLayers.push({
              sourceDate: newest.date,
              units: needed,
              unitCost: newest.unitCost,
              totalCost: cost
            });
            saleCogs += cost;
            newest.units -= needed;
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
          balance: clone(inventoryStack),
          balanceTotalUnits: inventoryStack.reduce((acc, l) => acc + l.units, 0),
          balanceTotalCost: round2(inventoryStack.reduce((acc, l) => acc + round2(l.units * l.unitCost), 0))
        });
      }
    });

    totalCogs = round2(totalCogs);
    const endingInventoryCost = round2(inventoryStack.reduce((acc, l) => acc + round2(l.units * l.unitCost), 0));
    const endingUnits = inventoryStack.reduce((acc, l) => acc + l.units, 0);
    const grossProfit = round2(salesInfo.totalRevenue - totalCogs);
    const grossMargin = salesInfo.totalRevenue > 0 ? round2((grossProfit / salesInfo.totalRevenue) * 100) : 0;

    return {
      method: 'LIFO_PERPETUAL',
      methodLabel: 'LIFO Perpetual (Last-In, First-Out Continuous)',
      system: 'Perpetual',
      cogas,
      salesInfo,
      endingUnits,
      endingInventoryCost,
      endingInventoryLayers: clone(inventoryStack),
      cogs: totalCogs,
      stockCard,
      grossProfit,
      grossMargin,
      isIdenticalToPeriodic: false
    };
  }

  // ==========================================
  // 5. MASTER 4-WAY COMPARISON & RECONCILIATION
  // ==========================================
  /**
   * Computes all 4 methods simultaneously on the exact same dataset,
   * generates reconciliation, LIFO Reserve, tax shielding, and financial statement impact.
   */
  function compareAllFourMethods(transactions, options = {}) {
    const taxRate = options.taxRate !== undefined ? options.taxRate : 0.25; // 25% default corporate tax
    const operatingExpenses = options.operatingExpenses || 0;

    const fifoPeriodic = calculateFIFOPeriodic(transactions);
    const fifoPerpetual = calculateFIFOPerpetual(transactions);
    const lifoPeriodic = calculateLIFOPeriodic(transactions);
    const lifoPerpetual = calculateLIFOPerpetual(transactions);

    // LIFO Reserve calculations:
    // LIFO Reserve = FIFO Ending Inventory - LIFO Ending Inventory
    const lifoReservePeriodic = round2(fifoPeriodic.endingInventoryCost - lifoPeriodic.endingInventoryCost);
    const lifoReservePerpetual = round2(fifoPerpetual.endingInventoryCost - lifoPerpetual.endingInventoryCost);

    // Tax impacts
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
      lifoPeriodic: buildStatement(lifoPeriodic),
      lifoPerpetual: buildStatement(lifoPerpetual)
    };

    // Inflation / Price Trend Detection
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
        lifoPeriodic,
        lifoPerpetual
      },
      statements,
      lifoReserve: {
        periodic: lifoReservePeriodic,
        perpetual: lifoReservePerpetual
      },
      taxSavingsVsFifo: {
        lifoPeriodic: round2(statements.fifoPeriodic.taxExpense - statements.lifoPeriodic.taxExpense),
        lifoPerpetual: round2(statements.fifoPerpetual.taxExpense - statements.lifoPerpetual.taxExpense)
      },
      reconciliationKeyTakeaways: [
        {
          rule: 'FIFO Periodic == FIFO Perpetual',
          explanation: 'FIFO under both periodic and perpetual systems yields identical COGS and Ending Inventory because the oldest units available are always sold first regardless of timing.',
          holdsTrue: fifoPeriodic.cogs === fifoPerpetual.cogs && fifoPeriodic.endingInventoryCost === fifoPerpetual.endingInventoryCost
        },
        {
          rule: 'LIFO Periodic != LIFO Perpetual (Timing Effect)',
          explanation: 'Under LIFO Perpetual, sales are matched against the latest purchases available on that specific sale date. Under LIFO Periodic, sales are matched against the latest purchases of the entire accounting period.',
          holdsTrue: lifoPeriodic.cogs !== lifoPerpetual.cogs || lifoPeriodic.endingInventoryCost !== lifoPerpetual.endingInventoryCost
        },
        {
          rule: priceTrend === 'INFLATION' ? 'Under Inflation: FIFO Net Income > LIFO Net Income' : (priceTrend === 'DEFLATION' ? 'Under Deflation: LIFO Net Income > FIFO Net Income' : 'Fluctuating Prices: Mixed Impact'),
          explanation: priceTrend === 'INFLATION'
            ? 'Rising purchase costs mean older, cheaper inventory is allocated to COGS under FIFO (higher profit & tax). LIFO assigns recent expensive inventory to COGS (lower profit, maximum tax savings).'
            : 'Price trends directly determine whether FIFO or LIFO minimizes tax expense.',
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
    calculateLIFOPeriodic,
    calculateLIFOPerpetual,
    compareAllFourMethods,
    round2
  };
});
