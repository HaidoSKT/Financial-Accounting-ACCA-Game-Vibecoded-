/**
 * FIFO vs LIFO Master Game - Educational Data, Scenarios & Reference Matrix
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
    { level: 4, minXp: 1000, title: 'Inventory Controller', badgeIcon: '🔍', perk: 'Unlocked LIFO Reserve Calculator & Audit' },
    { level: 5, minXp: 1800, title: 'Senior Cost Accountant', badgeIcon: '⚖️', perk: 'Unlocked Custom Company Sandbox Builder' },
    { level: 6, minXp: 2800, title: 'Supply Chain Finance Manager', badgeIcon: '🚢', perk: 'Unlocked LIFO Liquidation Detective' },
    { level: 7, minXp: 4000, title: 'Director of Financial Reporting', badgeIcon: '🏛️', perk: 'Unlocked IFRS vs US GAAP Boardroom Cases' },
    { level: 8, minXp: 5500, title: 'Chief Financial Officer (CFO)', badgeIcon: '👑', perk: 'Master of Global Inventory Valuation' }
  ];

  // 2. Badges & Achievements
  const BADGES = [
    { id: 'first_dispatch', name: 'First Dispatch', icon: '📦', desc: 'Successfully fulfilled and costed your first customer order' },
    { id: 'fifo_virtuoso', name: 'FIFO Virtuoso', icon: '🔵', desc: 'Proved FIFO Periodic and Perpetual yield identical COGS' },
    { id: 'lifo_tactician', name: 'LIFO Perpetual Tactician', icon: '🔴', desc: 'Correctly depleted real-time date-stamped LIFO layers' },
    { id: 'periodic_master', name: 'Periodic Period-End Master', icon: '⚖️', desc: 'Valued period-end ending inventory under both FIFO & LIFO' },
    { id: 'reconciler', name: 'The Great Reconciler', icon: '⚡', desc: 'Analyzed a full 4-way comparative inventory matrix' },
    { id: 'streak_5', name: 'Steady Stockmaster', icon: '🔥', desc: 'Achieved a 5x flawless dispatch or calculation streak' },
    { id: 'streak_10', name: 'Flawless Auditor', icon: '🌟', desc: 'Achieved a 10x perfect combo streak' },
    { id: 'lifo_reserve_pro', name: 'LIFO Reserve Detective', icon: '🕵️', desc: 'Accurately calculated LIFO Reserve and tax shielding' },
    { id: 'liquidation_hero', name: 'Liquidation Survivor', icon: '🛡️', desc: 'Mastered the financial threat of LIFO liquidation' },
    { id: 'ifrs_scholar', name: 'IAS 2 vs GAAP Scholar', icon: '📜', desc: 'Conquered international accounting standards differences' },
    { id: 'tycoon_builder', name: 'Inventory Tycoon', icon: '🏭', desc: 'Created, saved and analyzed a custom company scenario' },
    { id: 'cfo_throne', name: 'CFO Ascension', icon: '👑', desc: 'Attained Level 8 Chief Financial Officer rank' }
  ];

  // 3. Curated Business Case Scenarios (For 4-Way Simulator & Ledger Challenges)
  const SCENARIOS = [
    {
      id: 'apex_inflation',
      name: 'Apex Semiconductor Corp',
      subtitle: 'Surging Microchip Prices (Inflationary Cycle)',
      description: 'Demand for AI microchips is accelerating costs throughout March. Experience why FIFO inflates profits while LIFO shields cash from taxation.',
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
      description: 'Lumber prices drop sharply over the quarter. Observe the reversal where FIFO produces higher COGS and lower ending inventory than LIFO.',
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
      description: 'Raw materials experience sudden supply swings. Perfect for illustrating why Perpetual LIFO diverges substantially from Periodic LIFO.',
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
      id: 'steel_liquidation',
      name: 'Titan Heavy Foundry',
      subtitle: 'LIFO Liquidation Crisis Case',
      description: 'A global logistics strike halts incoming steel shipments. The company is forced to liquidate old, cheap base layers established years ago, causing an unexpected tax shock!',
      taxRate: 0.30,
      operatingExpenses: 500,
      currency: '$',
      transactions: [
        { id: '2026-06-01', type: 'BEGINNING', units: 150, unitCost: 40, notes: 'Ancient base stock layer (Year 2020 cost)' },
        { id: '2026-06-05', type: 'PURCHASE', units: 50, unitCost: 90, notes: 'Small high-cost spot purchase' },
        { id: '2026-06-12', type: 'SALE', units: 120, unitPrice: 130, notes: 'Major bridge project dispatch' },
        { id: '2026-06-20', type: 'SALE', units: 60, unitPrice: 135, notes: 'Liquidation into base layer!' }
      ]
    }
  ];

  // 4. Warehouse Dispatcher Practice Order Bank
  // Interactive mini-missions where user picks pallets to fulfill specific orders under a specific method
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
      title: 'Mission 2: Real-time LIFO Priority',
      mandateMethod: 'LIFO_PERPETUAL',
      mandateLabel: 'LIFO Perpetual System',
      customer: 'Skyline Aerospace',
      orderUnits: 40,
      salesPricePerUnit: 32,
      warehouseLayers: [
        { batchId: 'B-10', date: 'Nov 02', units: 30, unitCost: 14 },
        { batchId: 'B-11', date: 'Nov 09', units: 25, unitCost: 19 },
        { batchId: 'B-12', date: 'Nov 17', units: 20, unitCost: 22 }
      ],
      correctSelection: [
        { batchId: 'B-12', units: 20, unitCost: 22 }, // 20 * 22 = 440
        { batchId: 'B-11', units: 20, unitCost: 19 }  // 20 * 19 = 380
      ],
      correctCogs: 820,
      hint: 'In LIFO Perpetual, take from the MOST RECENT batch on hand (Nov 17, 20 units), then go backwards to Nov 09 (take 20 units).'
    },
    {
      id: 'dispatch_3',
      title: 'Mission 3: Dual Batch Depletion under FIFO',
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
      title: 'Mission 4: Stack Pull under LIFO',
      mandateMethod: 'LIFO_PERPETUAL',
      mandateLabel: 'LIFO Perpetual System',
      customer: 'Pacific Logistics Hub',
      orderUnits: 30,
      salesPricePerUnit: 60,
      warehouseLayers: [
        { batchId: 'PAL-A', date: 'Jan 05', units: 40, unitCost: 35 },
        { batchId: 'PAL-B', date: 'Jan 15', units: 25, unitCost: 42 },
        { batchId: 'PAL-C', date: 'Jan 22', units: 10, unitCost: 48 }
      ],
      correctSelection: [
        { batchId: 'PAL-C', units: 10, unitCost: 48 }, // 10 * 48 = 480
        { batchId: 'PAL-B', units: 20, unitCost: 42 }  // 20 * 42 = 840
      ],
      correctCogs: 1320,
      hint: 'LIFO takes newest PAL-C first (10 units @ $48), then 20 units from PAL-B (@ $42). Total COGS = $480 + $840 = $1,320.'
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
      narrative: 'Same data: COGAS = 200 units at total cost of $3,660. Total units sold = 130 units.',
      targetMethod: 'LIFO_PERIODIC',
      questionText: 'Under LIFO Periodic, what is the Cost of Goods Sold (COGS) for the quarter?',
      options: [
        '$2,200',
        '$2,580',
        '$2,460',
        '$2,760'
      ],
      correctIndex: 1,
      explanation: 'Under LIFO Periodic, ending inventory (70 units) comes from the OLDEST costs: 60 units @ $15 (Beginning) = $900 + 10 units @ $18 (Jan 15) = $180. Ending Inventory = $1,080. Therefore COGS = Total COGAS ($3,660) - Ending Inventory ($1,080) = $2,580.'
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
      scenarioTitle: 'LIFO Perpetual Timing Analysis',
      narrative: 'Jan 1: 50 units @ $10. Jan 10: Sold 30 units. Jan 15: Purchased 40 units @ $16. Jan 20: Sold 35 units.',
      targetMethod: 'LIFO_PERPETUAL',
      questionText: 'Under LIFO Perpetual, what is the COGS recorded specifically for the sale on Jan 20?',
      options: [
        '$560',
        '$450',
        '$350',
        '$510'
      ],
      correctIndex: 0,
      explanation: 'On Jan 20, the inventory on hand consists of 20 units @ $10 (remaining from Jan 1) and 40 units @ $16 (from Jan 15). LIFO Perpetual takes the most recent acquisition first: 35 units @ $16 = $560.'
    },
    {
      id: 'q5',
      scenarioTitle: 'LIFO Reserve & Tax Shielding',
      narrative: 'A US corporation reports FIFO Ending Inventory of $850,000 and LIFO Ending Inventory of $620,000. Corporate income tax rate is 25%.',
      targetMethod: 'LIFO_RESERVE',
      questionText: 'What is the LIFO Reserve, and how much cumulative income tax has the corporation shielded by using LIFO?',
      options: [
        'LIFO Reserve: $230,000 | Tax Shielded: $57,500',
        'LIFO Reserve: $230,000 | Tax Shielded: $230,000',
        'LIFO Reserve: $140,000 | Tax Shielded: $35,000',
        'LIFO Reserve: $850,000 | Tax Shielded: $212,500'
      ],
      correctIndex: 0,
      explanation: 'LIFO Reserve = FIFO Inventory ($850,000) - LIFO Inventory ($620,000) = $230,000. By carrying higher historical COGS of $230,000 under LIFO, taxable income was reduced by $230,000. Tax saved = $230,000 * 25% = $57,500.'
    },
    {
      id: 'q6',
      scenarioTitle: 'IFRS vs US GAAP Regulatory Mandates',
      narrative: 'A multinational entity prepares financial statements in compliance with IFRS (International Financial Reporting Standards).',
      targetMethod: 'IFRS_STANDARDS',
      questionText: 'Under IAS 2 (Inventories), which cost flow assumption is STRICTLY PROHIBITED?',
      options: [
        'Weighted Average Cost (AVCO)',
        'First-In, First-Out (FIFO)',
        'Last-In, First-Out (LIFO)',
        'Specific Identification'
      ],
      correctIndex: 2,
      explanation: 'Under IAS 2, LIFO is prohibited because it does not reflect realistic physical flow of goods and understates inventory values on the Statement of Financial Position with stale, outdated historical costs. US GAAP permits LIFO under ASC 330.'
    },
    {
      id: 'q7',
      scenarioTitle: 'LIFO Liquidation Mechanics',
      narrative: 'Due to a supplier strike, a company cannot restock inventory and sells 5,000 units that dip into a 15-year-old base layer purchased at $8/unit. Current replacement cost is $45/unit.',
      targetMethod: 'LIFO_LIQUIDATION',
      questionText: 'What is the financial statement effect of this LIFO liquidation?',
      options: [
        'COGS will be unusually high, leading to an operating loss and tax refund.',
        'COGS will be artificially low, causing a phantom profit surge and higher tax liability.',
        'Ending inventory value will increase to current fair market value.',
        'The LIFO Reserve will increase significantly.'
      ],
      correctIndex: 1,
      explanation: 'LIFO liquidation matches stale, low historical costs ($8) against high current sales prices. This drastically lowers COGS, artificially inflates gross profit and taxable income ("phantom profits"), resulting in a sudden, punitive tax cash outflow.'
    },
    {
      id: 'q8',
      scenarioTitle: 'Deflationary Environment Reversal',
      narrative: 'A retailer operates in a deflationary tech electronics market where component acquisition costs fall by 10% every month.',
      targetMethod: 'DEFLATION_STRATEGY',
      questionText: 'Under persistent DEFLATION, which inventory valuation method produces the HIGHEST Net Income?',
      options: [
        'LIFO (both Periodic and Perpetual)',
        'FIFO Periodic only',
        'FIFO Perpetual only',
        'Both FIFO and LIFO produce identical results under deflation'
      ],
      correctIndex: 0,
      explanation: 'Under falling costs (deflation), the latest purchases are CHEAPER than opening stock. LIFO assigns the latest cheap costs to COGS, resulting in LOWER COGS and therefore HIGHER Gross Profit and HIGHER Net Income than FIFO.'
    }
  ];

  // 6. Comprehensive Educational Cheat Sheet & Reference
  const REFERENCE_GUIDE = {
    overview: 'Inventory valuation is the accounting process of assigning monetary value to unsold inventory and Cost of Goods Sold (COGS). The two principal cost flow assumptions are FIFO and LIFO, operated under either a Periodic or Perpetual system.',
    coreFormula: 'Cost of Goods Available for Sale (COGAS) = Beginning Inventory + Net Purchases during the period.\nEnding Inventory + Cost of Goods Sold = COGAS.',
    comparisonMatrix: [
      {
        attribute: 'Cost Flow Logic',
        fifoPeriodic: 'Latest purchases form ending inventory; earliest form COGS.',
        fifoPerpetual: 'Earliest layers on hand at time of sale are depleted continuously.',
        lifoPeriodic: 'Earliest purchases form ending inventory; latest period purchases form COGS.',
        lifoPerpetual: 'Most recent layers on hand at exact moment of sale are depleted.'
      },
      {
        attribute: 'Result Equivalence',
        fifoPeriodic: 'Identical to FIFO Perpetual.',
        fifoPerpetual: 'Identical to FIFO Periodic.',
        lifoPeriodic: 'Usually differs from LIFO Perpetual if purchases occur after sales.',
        lifoPerpetual: 'Usually differs from LIFO Periodic due to point-in-time constraints.'
      },
      {
        attribute: 'Inflation: Ending Inventory',
        fifoPeriodic: 'Highest (current replacement prices)',
        fifoPerpetual: 'Highest (identical to Periodic)',
        lifoPeriodic: 'Lowest (stale old prices)',
        lifoPerpetual: 'Intermediate/Low'
      },
      {
        attribute: 'Inflation: COGS',
        fifoPeriodic: 'Lowest (older cheaper costs)',
        fifoPerpetual: 'Lowest (identical to Periodic)',
        lifoPeriodic: 'Highest (most recent expensive costs)',
        lifoPerpetual: 'High (most recent available at sale)'
      },
      {
        attribute: 'Inflation: Net Income & Tax',
        fifoPeriodic: 'Highest Net Income, Highest Tax',
        fifoPerpetual: 'Highest Net Income, Highest Tax',
        lifoPeriodic: 'Lowest Net Income, Lowest Tax (Tax Shield)',
        lifoPerpetual: 'Lower Net Income, Lower Tax'
      },
      {
        attribute: 'IFRS Compliance (IAS 2)',
        fifoPeriodic: 'PERMITTED',
        fifoPerpetual: 'PERMITTED',
        lifoPeriodic: 'PROHIBITED',
        lifoPerpetual: 'PROHIBITED'
      },
      {
        attribute: 'US GAAP Compliance (ASC 330)',
        fifoPeriodic: 'PERMITTED',
        fifoPerpetual: 'PERMITTED',
        lifoPeriodic: 'PERMITTED (subject to conformity rule)',
        lifoPerpetual: 'PERMITTED (subject to conformity rule)'
      }
    ],
    lifoConformityRule: 'Under US Internal Revenue Code (IRC § 472), if a company uses LIFO for its tax returns to reduce taxable income, it MUST also use LIFO for its financial statements to shareholders and creditors. This prevents companies from showing low profits to the IRS and high profits to investors.',
    lifoReserveDefinition: 'The LIFO Reserve is the contra-asset allowance representing the cumulative difference between inventory valued under FIFO and inventory valued under LIFO: LIFO Reserve = FIFO Ending Inventory - LIFO Ending Inventory.',
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
