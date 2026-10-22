/**
 * FIFO vs AVCO Master Game - Educational Data, Scenarios & Reference Matrix
 * Compliant with ACCA FA / FFA & IFRS (IAS 2 Inventories)
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FIFO_LIFO_DATA = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // 1. Ranks / Career Progression
  const RANKS = [
    { level: 1, minXp: 0, title: 'Junior Stock Clerk', badgeIcon: '📋', perk: 'Unlocked Basic Warehouse Dispatch' },
    { level: 2, minXp: 200, title: 'Warehouse Inventory Specialist', badgeIcon: '📦', perk: 'Unlocked 4-Way Comparison Simulator' },
    { level: 3, minXp: 500, title: 'Cost Accounting Analyst', badgeIcon: '📊', perk: 'Unlocked Periodic vs Perpetual Ledger Arena' },
    { level: 4, minXp: 1000, title: 'Inventory Controller', badgeIcon: '🔍', perk: 'Unlocked AVCO Moving Average Calculator & Audit' },
    { level: 5, minXp: 1800, title: 'Senior Cost Accountant', badgeIcon: '⚖️', perk: 'Unlocked Custom Company Sandbox Builder' },
    { level: 6, minXp: 2800, title: 'Supply Chain Finance Manager', badgeIcon: '🚢', perk: 'Unlocked Price Fluctuation & Smoothing Analytics' },
    { level: 7, minXp: 4000, title: 'Director of Financial Reporting', badgeIcon: '🏛️', perk: 'Unlocked IFRS IAS 2 Boardroom Decision Cases' },
    { level: 8, minXp: 5500, title: 'Chief Financial Officer (CFO)', badgeIcon: '👑', perk: 'Master of Global Inventory Valuation' }
  ];

  // 2. Badges & Achievements
  const BADGES = [
    { id: 'first_dispatch', name: 'First Dispatch', icon: '📦', desc: 'Successfully fulfilled and costed your first customer order' },
    { id: 'fifo_virtuoso', name: 'FIFO Virtuoso', icon: '🔵', desc: 'Proved FIFO Periodic and Perpetual yield identical COGS' },
    { id: 'avco_tactician', name: 'AVCO Moving Average Tactician', icon: '🟢', desc: 'Correctly tracked real-time recalculated moving average cost per unit' },
    { id: 'periodic_master', name: 'Periodic Period-End Master', icon: '⚖️', desc: 'Valued period-end ending inventory under both FIFO & AVCO' },
    { id: 'reconciler', name: 'The Great Reconciler', icon: '⚡', desc: 'Analyzed a full 4-way comparative inventory matrix' },
    { id: 'streak_5', name: 'Steady Stockmaster', icon: '🔥', desc: 'Achieved a 5x flawless dispatch or calculation streak' },
    { id: 'streak_10', name: 'Flawless Auditor', icon: '🌟', desc: 'Achieved a 10x perfect combo streak' },
    { id: 'avco_reserve_pro', name: 'AVCO Spread Analyst', icon: '📊', desc: 'Accurately calculated FIFO vs AVCO inventory difference and profit impact' },
    { id: 'ifrs_scholar', name: 'IAS 2 Scholar', icon: '📜', desc: 'Mastered standard-compliant inventory valuation under IAS 2' },
    { id: 'avco_master', name: 'AVCO Moving Average Virtuoso', icon: '🟢', desc: 'Mastered Periodic Weighted Average & Perpetual Moving AVCO per IAS 2' },
    { id: 'tycoon_builder', name: 'Inventory Tycoon', icon: '🏭', desc: 'Created, saved and analyzed a custom company scenario' },
    { id: 'cfo_throne', name: 'CFO Ascension', icon: '👑', desc: 'Attained Level 8 Chief Financial Officer rank' }
  ];

  // 3. Curated Business Case Scenarios (For 4-Way Simulator & Ledger Challenges)
  const SCENARIOS = [
    {
      id: 'apex_inflation',
      name: 'Apex Semiconductor Corp',
      subtitle: 'Surging Microchip Prices (Inflationary Cycle)',
      description: 'Demand for AI microchips is accelerating costs throughout March. Compare how FIFO reflects recent replacement prices on the SOFP while AVCO smooths gross profit margins.',
      taxRate: 0.25,
      operatingExpenses: 150,
      currency: '$',
      transactions: [
        { id: 't1', date: '2026-03-01', type: 'BEGINNING', units: 100, unitCost: 10, notes: 'Opening Inventory on hand' },
        { id: 't2', date: '2026-03-05', type: 'PURCHASE', units: 150, unitCost: 12, notes: 'Batch Alpha from Taiwan Foundry' },
        { id: 't3', date: '2026-03-10', type: 'SALE', units: 180, unitPrice: 22, notes: 'Shipment to Supercomputer Client' },
        { id: 't4', date: '2026-03-16', type: 'PURCHASE', units: 120, unitCost: 15, notes: 'Emergency silicon restock' },
        { id: 't5', date: '2026-03-22', type: 'SALE', units: 140, unitPrice: 25, notes: 'Contract fulfillment to Cloud Data Center' },
        { id: 't6', date: '2026-03-28', type: 'PURCHASE', units: 80, unitCost: 18, notes: 'End-of-month acquisition' }
      ]
    },
    {
      id: 'nordic_timber',
      name: 'Nordic Timber & Pulp Ltd',
      subtitle: 'Falling Commodity Cycle (Deflationary Environment)',
      description: 'Lumber prices drop sharply over the quarter. Observe the reversal where AVCO produces lower COGS and higher ending inventory than FIFO.',
      taxRate: 0.25,
      operatingExpenses: 200,
      currency: '€',
      transactions: [
        { id: '2026-04-01', type: 'BEGINNING', units: 80, unitCost: 50, notes: 'Opening lumber stockpiles' },
        { id: '2026-04-08', type: 'PURCHASE', units: 100, unitCost: 45, notes: 'Spring cut logs received' },
        { id: '2026-04-14', type: 'SALE', units: 90, unitPrice: 70, notes: 'Export to European builders' },
        { id: '2026-04-19', type: 'PURCHASE', units: 120, unitCost: 40, notes: 'Market price drop purchase' },
        { id: '2026-04-24', type: 'SALE', units: 130, unitPrice: 65, notes: 'Wholesale furniture manufacturing order' },
        { id: '2026-04-29', type: 'PURCHASE', units: 70, unitCost: 35, notes: 'Final discounted timber delivery' }
      ]
    },
    {
      id: 'lumina_fluctuating',
      name: 'Lumina EV Battery Works',
      subtitle: 'Volatile Lithium & Cobalt Markets',
      description: 'Raw materials experience sudden supply swings. Perfect for illustrating how AVCO Perpetual recalculates moving averages after every single purchase receipt.',
      taxRate: 0.28,
      operatingExpenses: 400,
      currency: '$',
      transactions: [
        { id: '2026-05-01', type: 'BEGINNING', units: 50, unitCost: 100, notes: 'Opening battery cell reserve' },
        { id: '2026-05-06', type: 'PURCHASE', units: 70, unitCost: 120, notes: 'Cobalt spike delivery' },
        { id: '2026-05-11', type: 'SALE', units: 80, unitPrice: 180, notes: 'Shipment to Automaker Alpha' },
        { id: '2026-05-17', type: 'PURCHASE', units: 90, unitCost: 95, notes: 'New mining supplier discount' },
        { id: '2026-05-23', type: 'SALE', units: 85, unitPrice: 175, notes: 'Delivery to Fleet EV Builder' },
        { id: '2026-05-28', type: 'PURCHASE', units: 60, unitCost: 110, notes: 'Month-end replenishment' }
      ]
    },
    {
      id: 'titan_turnover',
      name: 'Titan Heavy Industries Ltd',
      subtitle: 'Rapid Inventory Turnover & Moving Average',
      description: 'Heavy equipment components with staggered deliveries and large production batch issues. Demonstrates the contrast between AVCO Periodic and AVCO Perpetual moving average.',
      taxRate: 0.25,
      operatingExpenses: 350,
      currency: '$',
      transactions: [
        { id: '2026-06-01', type: 'BEGINNING', units: 100, unitCost: 40, notes: 'Opening components reserve' },
        { id: '2026-06-05', type: 'PURCHASE', units: 100, unitCost: 60, notes: 'Staggered foundry delivery' },
        { id: '2026-06-12', type: 'SALE', units: 120, unitPrice: 110, notes: 'Major turbine production run' },
        { id: '2026-06-18', type: 'PURCHASE', units: 80, unitCost: 80, notes: 'Mid-month replenishment' },
        { id: '2026-06-25', type: 'SALE', units: 90, unitPrice: 120, notes: 'Generator assembly dispatch' }
      ]
    }
  ];

  // 4. Warehouse Dispatcher Practice Order Bank
  // Interactive mini-missions where user picks pallets to fulfill specific orders under FIFO Perpetual
  const DISPATCH_MISSIONS = [
    {
      id: 'dispatch_1',
      title: 'Mission 1: Fast FIFO Outbound',
      mandateMethod: 'FIFO_PERPETUAL',
      mandateLabel: 'FIFO Perpetual System',
      customer: 'Metro Electronics',
      orderUnits: 35,
      salesPricePerUnit: 25,
      warehouseLayers: [
        { batchId: 'B-01', date: 'Oct 01', units: 20, unitCost: 12 },
        { batchId: 'B-02', date: 'Oct 05', units: 25, unitCost: 15 },
        { batchId: 'B-03', date: 'Oct 12', units: 30, unitCost: 18 }
      ],
      correctSelection: [
        { batchId: 'B-01', units: 20, unitCost: 12 }, // 20 * 12 = 240
        { batchId: 'B-02', units: 15, unitCost: 15 }  // 15 * 15 = 225
      ],
      correctCogs: 465,
      hint: 'In FIFO, always consume the OLDEST batches first. Take all 20 units from Batch B-01, then the remaining 15 units from Batch B-02.'
    },
    {
      id: 'dispatch_2',
      title: 'Mission 2: Dual-tier FIFO Dispatch',
      mandateMethod: 'FIFO_PERPETUAL',
      mandateLabel: 'FIFO Perpetual System',
      customer: 'Skyline Aerospace',
      orderUnits: 40,
      salesPricePerUnit: 32,
      warehouseLayers: [
        { batchId: 'B-10', date: 'Nov 02', units: 30, unitCost: 14 },
        { batchId: 'B-11', date: 'Nov 09', units: 25, unitCost: 19 },
        { batchId: 'B-12', date: 'Nov 17', units: 20, unitCost: 22 }
      ],
      correctSelection: [
        { batchId: 'B-10', units: 30, unitCost: 14 }, // 30 * 14 = 420
        { batchId: 'B-11', units: 10, unitCost: 19 }  // 10 * 19 = 190
      ],
      correctCogs: 610,
      hint: 'In FIFO Perpetual, take from the OLDEST batch on hand first (all 30 units from Nov 02 @ $14), then take the remaining 10 units from Nov 09 @ $19. Total COGS = $420 + $190 = $610.'
    },
    {
      id: 'dispatch_3',
      title: 'Mission 3: Multi-layer FIFO Fulfillment',
      mandateMethod: 'FIFO_PERPETUAL',
      mandateLabel: 'FIFO Perpetual System',
      customer: 'Summit Hospital Supplies',
      orderUnits: 50,
      salesPricePerUnit: 40,
      warehouseLayers: [
        { batchId: 'MED-1', date: 'Dec 01', units: 15, unitCost: 20 },
        { batchId: 'MED-2', date: 'Dec 07', units: 20, unitCost: 24 },
        { batchId: 'MED-3', date: 'Dec 14', units: 35, unitCost: 28 }
      ],
      correctSelection: [
        { batchId: 'MED-1', units: 15, unitCost: 20 }, // 15 * 20 = 300
        { batchId: 'MED-2', units: 20, unitCost: 24 }, // 20 * 24 = 480
        { batchId: 'MED-3', units: 15, unitCost: 28 }  // 15 * 28 = 420
      ],
      correctCogs: 1200,
      hint: 'Deplete MED-1 completely (15 units), then MED-2 completely (20 units), and take the remaining 15 units from MED-3.'
    },
    {
      id: 'dispatch_4',
      title: 'Mission 4: Large Batch Fulfillment under FIFO',
      mandateMethod: 'FIFO_PERPETUAL',
      mandateLabel: 'FIFO Perpetual System',
      customer: 'Pacific Logistics Hub',
      orderUnits: 30,
      salesPricePerUnit: 60,
      warehouseLayers: [
        { batchId: 'PAL-A', date: 'Jan 05', units: 40, unitCost: 35 },
        { batchId: 'PAL-B', date: 'Jan 15', units: 25, unitCost: 42 },
        { batchId: 'PAL-C', date: 'Jan 22', units: 10, unitCost: 48 }
      ],
      correctSelection: [
        { batchId: 'PAL-A', units: 30, unitCost: 35 } // 30 * 35 = 1050
      ],
      correctCogs: 1050,
      hint: 'Under FIFO, allocate 30 units from the oldest available batch PAL-A (Jan 05, unit cost $35). Total COGS = 30 * $35 = $1,050.'
    },
    {
      id: 'dispatch_5',
      title: 'Mission 5: Single Batch Precision',
      mandateMethod: 'FIFO_PERPETUAL',
      mandateLabel: 'FIFO Perpetual System',
      customer: 'Nordic Retail Group',
      orderUnits: 18,
      salesPricePerUnit: 50,
      warehouseLayers: [
        { batchId: 'NRG-1', date: 'Feb 03', units: 25, unitCost: 30 },
        { batchId: 'NRG-2', date: 'Feb 10', units: 30, unitCost: 34 }
      ],
      correctSelection: [
        { batchId: 'NRG-1', units: 18, unitCost: 30 } // 18 * 30 = 540
      ],
      correctCogs: 540,
      hint: 'The oldest batch NRG-1 has 25 units available, which is more than enough for the 18 units needed. 18 * $30 = $540.'
    }
  ];

  // 5. Exam & Calculation Ledger Questions Bank (Mode 3)
  const EXAM_QUESTIONS = [
    {
      id: 'q1',
      scenarioTitle: 'Vanguard Trading Co. (Quarter 1)',
      narrative: 'Beginning inventory: 60 units @ $15 ($900). Purchases: Jan 15 (80 units @ $18 = $1,440); Feb 20 (60 units @ $22 = $1,320). Total units sold during Q1 = 130 units.',
      targetMethod: 'FIFO_PERIODIC',
      questionText: 'Under FIFO Periodic, what is the dollar value of the Ending Inventory on March 31?',
      options: [
        '$1,540',
        '$1,460',
        '$1,320',
        '$1,050'
      ],
      correctIndex: 1,
      explanation: 'Total units available = 60 + 80 + 60 = 200 units. Ending units = 200 - 130 = 70 units. Under FIFO, ending inventory comes from the LATEST purchases: 60 units @ $22 (Feb 20) = $1,320 + 10 units @ $18 (Jan 15) = $180. Ending Inventory = $1,320 + $180 = $1,460.'
    },
    {
      id: 'q2',
      scenarioTitle: 'Vanguard Trading Co. (Quarter 1)',
      narrative: 'Same data: Total Cost of Goods Available for Sale (COGAS) = 200 units at total cost of $3,660. Total units sold = 130 units.',
      targetMethod: 'AVCO_PERIODIC',
      questionText: 'Under AVCO Periodic (Weighted Average Cost), what is the Cost of Goods Sold (COGS) for the quarter?',
      options: [
        '$2,379',
        '$2,460',
        '$2,200',
        '$2,580'
      ],
      correctIndex: 0,
      explanation: 'Total COGAS = $3,660 across 200 units. Weighted Average Cost per unit = $3,660 / 200 = $18.30. COGS = 130 units sold * $18.30 = $2,379. (Ending inventory = 70 units * $18.30 = $1,281).'
    },
    {
      id: 'q3',
      scenarioTitle: 'FIFO Identity Theorem',
      narrative: 'A company tracks inventory during an inflationary period with multiple sales occurring between purchase dates.',
      targetMethod: 'FIFO_COMPARISON',
      questionText: 'Which statement accurately describes the relationship between FIFO Periodic and FIFO Perpetual?',
      options: [
        'FIFO Perpetual produces higher COGS because sales happen earlier.',
        'FIFO Periodic and FIFO Perpetual ALWAYS produce identical Ending Inventory and COGS.',
        'FIFO Periodic produces higher ending inventory due to period-end averaging.',
        'FIFO Perpetual produces higher net income under deflation only.'
      ],
      correctIndex: 1,
      explanation: 'In FIFO, the earliest available costs are always transferred to COGS first. Because earlier costs flow out first whether checked continuously or in aggregate at period end, FIFO Periodic and Perpetual are always mathematically identical.'
    },
    {
      id: 'q4',
      scenarioTitle: 'AVCO Perpetual Moving Average Step-by-Step',
      narrative: 'Jan 1: 50 units @ $10 ($500). Jan 10: Sold 30 units. Jan 15: Purchased 40 units @ $16 ($640). Jan 20: Sold 35 units.',
      targetMethod: 'AVCO_PERPETUAL',
      questionText: 'Under AVCO Perpetual (Moving Weighted Average), what is the COGS recorded for the sale on Jan 20?',
      options: [
        '$490',
        '$560',
        '$350',
        '$420'
      ],
      correctIndex: 0,
      explanation: 'After the Jan 10 sale, 20 units remain @ $10 ($200). On Jan 15, adding 40 units @ $16 ($640) gives 60 units with total cost $840 ($200 + $640). Moving average rate = $840 / 60 = $14.00/unit. The Jan 20 sale of 35 units is costed at $14.00 = 35 * $14 = $490!'
    },
    {
      id: 'q5',
      scenarioTitle: 'IAS 2 Permitted Valuation Methods',
      narrative: 'An ACCA student is preparing financial statements in compliance with IFRS (International Financial Reporting Standards).',
      targetMethod: 'IFRS_STANDARDS',
      questionText: 'Under IAS 2 (Inventories), which cost flow assumptions are explicitly permitted for interchangeable inventory items?',
      options: [
        'FIFO (First-In, First-Out) and Weighted Average Cost (AVCO) only',
        'FIFO and LIFO only',
        'LIFO and Base Stock method only',
        'Standard costing with periodic LIFO reconciliation'
      ],
      correctIndex: 0,
      explanation: 'Under IAS 2 paragraph 25, the cost of inventories that are ordinarily interchangeable shall be assigned by using either the FIFO (First-In, First-Out) formula or the Weighted Average Cost (AVCO) formula. LIFO is strictly prohibited.'
    },
    {
      id: 'q6',
      scenarioTitle: 'IAS 2 Prohibited Cost Formula',
      narrative: 'A multinational entity prepares financial statements in compliance with IFRS.',
      targetMethod: 'IFRS_STANDARDS',
      questionText: 'Under IAS 2 (Inventories), which cost flow assumption is STRICTLY PROHIBITED?',
      options: [
        'Weighted Average Cost (AVCO)',
        'First-In, First-Out (FIFO)',
        'Last-In, First-Out (LIFO)',
        'Specific Identification'
      ],
      correctIndex: 2,
      explanation: 'Under IAS 2, LIFO is prohibited because it does not reflect realistic physical flow of goods and leaves outdated historical costs on the Statement of Financial Position, understating inventory carrying values. US GAAP permits LIFO under ASC 330.'
    },
    {
      id: 'q7',
      scenarioTitle: 'AVCO Price Smoothing Effect in Inflation',
      narrative: 'Throughout the accounting year, raw material acquisition costs rose by 25%. The CFO evaluates FIFO versus AVCO.',
      targetMethod: 'AVCO_SMOOTHING',
      questionText: 'During persistent inflation, how do AVCO gross profit and ending inventory compare to FIFO?',
      options: [
        'AVCO reports lower gross profit and lower ending inventory than FIFO, smoothing earnings fluctuations.',
        'AVCO reports higher gross profit and higher ending inventory than FIFO.',
        'AVCO reports identical gross profit to FIFO but higher ending inventory.',
        'AVCO produces negative gross margin because of average rates.'
      ],
      correctIndex: 0,
      explanation: 'In an inflationary cycle, FIFO assigns older, cheaper costs to COGS (maximizing gross profit) and recent expensive costs to ending inventory (maximizing assets). AVCO blends old and new costs, producing moderate/smoothed COGS, lower gross profit, and lower ending inventory than FIFO.'
    },
    {
      id: 'q8',
      scenarioTitle: 'Deflationary Environment Reversal',
      narrative: 'A technology distributor operates in a deflationary electronics market where replacement costs fall each month.',
      targetMethod: 'DEFLATION_STRATEGY',
      questionText: 'Under persistent DEFLATION, which permitted method under IAS 2 produces the LOWER Cost of Goods Sold (and thus HIGHER Gross Profit)?',
      options: [
        'AVCO produces lower COGS (and higher gross profit) than FIFO because FIFO sends older, higher costs to COGS first.',
        'FIFO produces lower COGS than AVCO because older stock is always cheaper.',
        'Both FIFO and AVCO produce identical gross profit under falling prices.',
        'IAS 2 requires write-downs that eliminate all differences between FIFO and AVCO.'
      ],
      correctIndex: 0,
      explanation: 'Under falling costs (deflation), older stock is MORE expensive than new stock. FIFO sends that older, expensive stock directly to COGS, increasing COGS and decreasing profit. AVCO averages down the cost with cheaper purchases, resulting in lower COGS and higher gross profit than FIFO!'
    },
    {
      id: 'q9',
      scenarioTitle: 'AVCO Periodic Weighted Average Calculation',
      narrative: 'Beginning inventory: 100 units @ $10 ($1,000). Purchases: 200 units @ $16 ($3,200). 180 units were sold during the month.',
      targetMethod: 'AVCO_PERIODIC',
      questionText: 'Under AVCO Periodic (Weighted Average Cost), what is the Cost of Goods Sold (COGS) for the month?',
      options: [
        '$2,520',
        '$2,880',
        '$2,160',
        '$2,400'
      ],
      correctIndex: 0,
      explanation: 'Total COGAS = $1,000 + $3,200 = $4,200. Total units available = 100 + 200 = 300 units. Weighted Average Cost per unit = $4,200 / 300 = $14.00. COGS = 180 units sold * $14.00 = $2,520. (Ending inventory = 120 units * $14.00 = $1,680).'
    },
    {
      id: 'q10',
      scenarioTitle: 'AVCO Perpetual Moving Average Dynamics',
      narrative: 'Opening stock: 40 units @ $10 ($400). Day 4: Bought 60 units @ $15 ($900). Day 8: Sold 50 units. Day 12: Bought 50 units @ $20 ($1,000).',
      targetMethod: 'AVCO_PERPETUAL',
      questionText: 'Under AVCO Perpetual, what was the unit cost applied to the Day 8 sale, and what is the new average unit cost after the Day 12 purchase?',
      options: [
        'Day 8 Sale: $13.00/unit | Day 12 New Rate: $16.50/unit',
        'Day 8 Sale: $12.50/unit | Day 12 New Rate: $15.00/unit',
        'Day 8 Sale: $15.00/unit | Day 12 New Rate: $20.00/unit',
        'Day 8 Sale: $10.00/unit | Day 12 New Rate: $14.50/unit'
      ],
      correctIndex: 0,
      explanation: 'Before Day 8 sale: Balance = 40 + 60 = 100 units, total cost $400 + $900 = $1,300. Moving average rate = $1,300 / 100 = $13.00/unit. Day 8 sale is costed at $13.00 (50 * $13 = $650). Remaining balance on Day 8 = 50 units @ $13.00 ($650). On Day 12, adding 50 units @ $20 ($1,000) gives 100 units at total cost $650 + $1,000 = $1,650. New moving average rate = $1,650 / 100 = $16.50/unit!'
    }
  ];

  // 6. Comprehensive Educational Reference Matrix
  const REFERENCE_GUIDE = {
    overview: 'Inventory valuation is the accounting process of assigning monetary value to unsold inventory and Cost of Goods Sold (COGS). Under IAS 2 (Inventories), the two permitted cost flow assumptions for interchangeable goods are FIFO and AVCO (Weighted Average Cost), operated under either a Periodic or Perpetual system.',
    coreFormula: 'Cost of Goods Available for Sale (COGAS) = Beginning Inventory + Net Purchases during the period.\nEnding Inventory + Cost of Goods Sold = COGAS.',
    avcoFormulas: {
      periodic: 'AVCO Periodic Rate = Total Cost of Opening Stock + Total Purchases Cost / Total Available Units (Calculated at period-end)',
      perpetual: 'AVCO Perpetual (Moving Average) Rate = (Existing Balance Cost + Receipt Cost) / (Existing Balance Units + Receipt Units) (Recalculated on every purchase receipt)'
    },
    comparisonMatrix: [
      {
        attribute: 'Cost Flow Logic',
        fifoPeriodic: 'Latest purchases form ending inventory; earliest form COGS.',
        fifoPerpetual: 'Earliest layers on hand at time of sale are depleted continuously.',
        avcoPeriodic: 'Single weighted average rate across all goods available in the period.',
        avcoPerpetual: 'Moving weighted average unit rate recalculated after each receipt.'
      },
      {
        attribute: 'Result Equivalence',
        fifoPeriodic: 'Identical to FIFO Perpetual.',
        fifoPerpetual: 'Identical to FIFO Periodic.',
        avcoPeriodic: 'Usually differs from AVCO Perpetual because timing of receipts matters.',
        avcoPerpetual: 'Differs from AVCO Periodic as rates change before each sale.'
      },
      {
        attribute: 'Inflation: Ending Inventory',
        fifoPeriodic: 'Highest (valued at most recent prices)',
        fifoPerpetual: 'Highest (identical to Periodic)',
        avcoPeriodic: 'Moderate (weighted average of all prices)',
        avcoPerpetual: 'Moderate (moving average of purchases)'
      },
      {
        attribute: 'Inflation: COGS',
        fifoPeriodic: 'Lowest (earliest cheaper costs)',
        fifoPerpetual: 'Lowest (identical to Periodic)',
        avcoPeriodic: 'Moderate (weighted average)',
        avcoPerpetual: 'Moderate (moving average at sale time)'
      },
      {
        attribute: 'Inflation: Net Income',
        fifoPeriodic: 'Highest Gross Profit & Net Income',
        fifoPerpetual: 'Highest Gross Profit & Net Income',
        avcoPeriodic: 'Moderate / Smoothed Net Income',
        avcoPerpetual: 'Moderate / Smoothed Net Income'
      },
      {
        attribute: 'IFRS Compliance (IAS 2)',
        fifoPeriodic: 'PERMITTED (IAS 2.25)',
        fifoPerpetual: 'PERMITTED (IAS 2.25)',
        avcoPeriodic: 'PERMITTED (IAS 2.25)',
        avcoPerpetual: 'PERMITTED (IAS 2.25)'
      },
      {
        attribute: 'US GAAP Compliance (ASC 330)',
        fifoPeriodic: 'PERMITTED',
        fifoPerpetual: 'PERMITTED',
        avcoPeriodic: 'PERMITTED',
        avcoPerpetual: 'PERMITTED'
      }
    ],
    journalEntries: {
      perpetual: [
        'On Purchase: Dr Inventory, Cr Accounts Payable / Cash',
        'On Sale (Revenue): Dr Cash / Accounts Receivable, Cr Sales Revenue',
        'On Sale (Cost): Dr Cost of Goods Sold, Cr Inventory (recorded immediately at time of sale)'
      ],
      periodic: [
        'On Purchase: Dr Purchases, Cr Accounts Payable / Cash',
        'On Sale: Dr Cash / Accounts Receivable, Cr Sales Revenue (No entry made to Inventory or COGS at point of sale)',
        'At Year-End Physical Count: Dr Closing Inventory (SOFP), Dr Cost of Goods Sold (SPL), Cr Opening Inventory, Cr Purchases'
      ]
    }
  };

  return {
    RANKS,
    BADGES,
    SCENARIOS,
    DISPATCH_MISSIONS,
    EXAM_QUESTIONS,
    REFERENCE_GUIDE
  };
});
