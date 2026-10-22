/**
 * ACCA Financial Accounting Master (FFA / FA F3) - Curriculum & Scenario Data
 * Fully aligned with ACCA Syllabus & IASB Conceptual Framework / IFRS Standards.
 * Derived from official lecture series and Notion master study notes.
 */

const DEAD_CLIC_TRANSACTIONS = [
  {
    id: 'dc_1',
    scenario: 'Purchased inventory on credit from trade supplier Alpha Ltd for £2,400.',
    drAccount: 'Purchases (Cost of Sales)',
    drCategory: 'DEAD - Expense',
    crAccount: 'Trade Payables',
    crCategory: 'CLIC - Liability',
    explanation: 'Purchases increases costs of the business (DEAD Expense -> Debit). Trade Payables increases obligations to creditors (CLIC Liability -> Credit).',
    trap: 'Do not debit Inventory during the period under periodic inventory systems; use Purchases account!'
  },
  {
    id: 'dc_2',
    scenario: 'Sole proprietor withdrew £500 worth of inventory from the store for personal family consumption (Cost = £500, Selling Price = £750).',
    drAccount: 'Drawings',
    drCategory: 'DEAD - Drawings',
    crAccount: 'Purchases',
    crCategory: 'DEAD - Expense (Reduction)',
    explanation: 'Drawings reduce owner’s equity (DEAD Drawings -> Debit). Purchases must be credited at COST (£500), NOT sales price (£750).',
    trap: 'CR Sales at selling price is an ACCA exam trap! An entity cannot make a legal profit selling goods to its own owner.'
  },
  {
    id: 'dc_3',
    scenario: 'Paid annual property insurance premium of £1,200 via direct bank transfer.',
    drAccount: 'Insurance Expense',
    drCategory: 'DEAD - Expense',
    crAccount: 'Bank Account',
    crCategory: 'DEAD - Asset (Reduction)',
    explanation: 'Insurance is an operating overhead (DEAD Expense -> Debit). Bank is a business asset being reduced (DEAD Asset -> Credit).',
    trap: 'Remember the business entity perspective: to the business, cash in bank is an ASSET (Debit increases, Credit decreases).'
  },
  {
    id: 'dc_4',
    scenario: 'Sublet spare warehouse space and received 6 months’ rent in advance £3,000 cash.',
    drAccount: 'Cash / Bank',
    drCategory: 'DEAD - Asset',
    crAccount: 'Rental Income / Deferred Income',
    crCategory: 'CLIC - Income / Liability',
    explanation: 'Cash increases business resources (DEAD Asset -> Debit). Rental income/advance represents income/obligation (CLIC Income -> Credit).',
    trap: 'Any portion received relating to future accounting periods is deferred income (Current Liability).'
  },
  {
    id: 'dc_5',
    scenario: 'Customer Delta Ltd settles their outstanding invoice of £1,800 by electronic bank transfer.',
    drAccount: 'Bank Account',
    drCategory: 'DEAD - Asset',
    crAccount: 'Trade Receivables',
    crCategory: 'DEAD - Asset (Reduction)',
    explanation: 'Bank increases (DEAD Asset -> Debit). Trade Receivables asset is extinguished (DEAD Asset -> Credit).',
    trap: 'Do NOT credit Sales Revenue upon receiving payment! Revenue was recognized when the credit sale was originally billed.'
  },
  {
    id: 'dc_6',
    scenario: 'Sole proprietor introduces £10,000 of personal savings into the business bank account.',
    drAccount: 'Bank Account',
    drCategory: 'DEAD - Asset',
    crAccount: 'Capital Account',
    crCategory: 'CLIC - Capital',
    explanation: 'Business bank asset increases (DEAD Asset -> Debit). Proprietor equity increases (CLIC Capital -> Credit).',
    trap: 'The Business Entity Concept mandates treating the owner as separate from the business enterprise.'
  },
  {
    id: 'dc_7',
    scenario: 'Confirmed that customer Beta Corp has entered liquidation; irrecoverable debt of £650 is written off.',
    drAccount: 'Irrecoverable Debts Expense',
    drCategory: 'DEAD - Expense',
    crAccount: 'Trade Receivables',
    crCategory: 'DEAD - Asset (Reduction)',
    explanation: 'Irrecoverable debts written off to Statement of Profit or Loss (DEAD Expense -> Debit). Customer receivable removed from ledger (DEAD Asset -> Credit).',
    trap: 'Under IFRS 9 / ACCA standard terms, use "Irrecoverable Debts", not outdated term "Bad Debts".'
  },
  {
    id: 'dc_8',
    scenario: 'Purchased a delivery van for £18,000 on credit from Motors Direct Ltd.',
    drAccount: 'Motor Vehicles (Non-Current Asset)',
    drCategory: 'DEAD - Asset',
    crAccount: 'Other Payables / Loan Creditor',
    crCategory: 'CLIC - Liability',
    explanation: 'Capital expenditure on PPE increases Non-Current Assets (DEAD Asset -> Debit). Liability to seller increases (CLIC Liability -> Credit).',
    trap: 'Do NOT debit Motor Expenses! Debiting an expense for capital expenditure is an Error of Principle.'
  },
  {
    id: 'dc_9',
    scenario: 'Paid diesel and routine engine servicing for the delivery van £240 with company debit card.',
    drAccount: 'Motor Running Expenses',
    drCategory: 'DEAD - Expense',
    crAccount: 'Bank Account',
    crCategory: 'DEAD - Asset (Reduction)',
    explanation: 'Revenue expenditure maintaining asset earning capacity is an expense (DEAD Expense -> Debit). Bank decreases (DEAD Asset -> Credit).',
    trap: 'Adding routine servicing to the Non-Current Asset cost violates IAS 16 and overstates non-current assets.'
  },
  {
    id: 'dc_10',
    scenario: 'Obtained a 5-year commercial bank loan of £40,000 deposited into company current account.',
    drAccount: 'Bank Account',
    drCategory: 'DEAD - Asset',
    crAccount: 'Bank Loan (Non-Current Liability)',
    crCategory: 'CLIC - Liability',
    explanation: 'Cash asset increases (DEAD Asset -> Debit). Long-term liability increases (CLIC Liability -> Credit).',
    trap: 'A 5-year loan is a Non-Current Liability on the Statement of Financial Position, not equity or revenue.'
  },
  {
    id: 'dc_11',
    scenario: 'Settled outstanding credit balance of £1,500 owed to supplier Zeta via online bank transfer.',
    drAccount: 'Trade Payables',
    drCategory: 'CLIC - Liability (Reduction)',
    crAccount: 'Bank Account',
    crCategory: 'DEAD - Asset (Reduction)',
    explanation: 'Liability to supplier decreases (CLIC Liability -> Debit). Cash asset decreases (DEAD Asset -> Credit).',
    trap: 'Do not debit Purchases! Purchases was already debited when the goods were received.'
  },
  {
    id: 'dc_12',
    scenario: 'Sold goods on credit to customer Omega Co for £3,500.',
    drAccount: 'Trade Receivables',
    drCategory: 'DEAD - Asset',
    crAccount: 'Sales Revenue',
    crCategory: 'CLIC - Income',
    explanation: 'Claim on customer increases (DEAD Asset -> Debit). Revenue earned in SPL (CLIC Income -> Credit).',
    trap: 'Accruals basis requires revenue recognition when goods are delivered, irrespective of when cash is collected.'
  },
  {
    id: 'dc_13',
    scenario: 'Paid carriage outwards of £180 in cash to courier for delivering goods to a customer.',
    drAccount: 'Carriage Outwards (Distribution Cost)',
    drCategory: 'DEAD - Expense',
    crAccount: 'Cash in Hand',
    crCategory: 'DEAD - Asset (Reduction)',
    explanation: 'Carriage outwards is a selling/distribution expense in SPL (DEAD Expense -> Debit). Cash decreases (DEAD Asset -> Credit).',
    trap: 'Carriage inwards is added to Cost of Sales; Carriage outwards is a Distribution Cost below Gross Profit!'
  },
  {
    id: 'dc_14',
    scenario: 'Paid carriage inwards of £220 by cheque for bringing purchased goods into the warehouse.',
    drAccount: 'Carriage Inwards (Cost of Sales)',
    drCategory: 'DEAD - Expense',
    crAccount: 'Bank Account',
    crCategory: 'DEAD - Asset (Reduction)',
    explanation: 'Carriage inwards is part of the cost of bringing inventory to its present location (IAS 2) -> Cost of Sales (DEAD Expense -> Debit). Bank decreases (DEAD Asset -> Credit).',
    trap: 'IAS 2 requires all delivery costs to warehouse to be included in inventory and cost of sales.'
  },
  {
    id: 'dc_15',
    scenario: 'Year-end adjustment: Record accrued electricity expense of £420 for power consumed but not yet invoiced.',
    drAccount: 'Electricity Expense',
    drCategory: 'DEAD - Expense',
    crAccount: 'Accruals (Current Liability)',
    crCategory: 'CLIC - Liability',
    explanation: 'Expense matched to current period SPL (DEAD Expense -> Debit). Accrual recognized on SOFP (CLIC Liability -> Credit).',
    trap: 'Accruals are Current Liabilities on the Statement of Financial Position under the matching convention.'
  }
];

const T_ACCOUNT_CHALLENGES = [
  {
    id: 'ta_1',
    accountName: 'Bank Account (General Ledger)',
    accountType: 'Asset (SOFP)',
    isNominal: false,
    debits: [
      { desc: 'Balance b/d (Opening)', amount: 14200 },
      { desc: 'Cash Sales banked', amount: 8400 },
      { desc: 'Trade Receivables receipts', amount: 16500 },
      { desc: 'Capital introduced by owner', amount: 5000 }
    ],
    credits: [
      { desc: 'Payments to Trade Payables', amount: 18200 },
      { desc: 'Rent & Rates payment', amount: 3600 },
      { desc: 'Wages and Salaries', amount: 7400 },
      { desc: 'Owner Cash Drawings', amount: 2000 }
    ],
    correctBalanceType: 'debit',
    correctBalanceAmount: 12900,
    closingDestination: 'Statement of Financial Position (Current Asset)',
    explanation: 'Total Debits (£44,100) exceed Total Credits (£31,200). Balance c/d of £12,900 is entered on Credit side to balance. Balance b/d is brought down on the Debit side (£12,900) as an Asset in the SOFP.'
  },
  {
    id: 'ta_2',
    accountName: 'Electricity & Gas Expense Account',
    accountType: 'Expense (Nominal / SPL)',
    isNominal: true,
    debits: [
      { desc: 'Bank: Q1 Electricity bill', amount: 1250 },
      { desc: 'Bank: Q2 Electricity bill', amount: 980 },
      { desc: 'Bank: Q3 Electricity bill', amount: 1100 },
      { desc: 'Accrual c/fwd (Q4 estimated)', amount: 870 }
    ],
    credits: [
      { desc: 'Sublet electricity recharge', amount: 200 }
    ],
    correctBalanceType: 'debit',
    correctBalanceAmount: 4000,
    closingDestination: 'Statement of Profit or Loss ("to SPL")',
    explanation: 'Nominal accounts (income and expense) are CLOSED OFF to the Statement of Profit or Loss at year-end. Total debits £4,200 minus recharge £200 = £4,000 transferred "to SPL". Nominal accounts DO NOT have a Balance b/d carried into the next financial year!'
  },
  {
    id: 'ta_3',
    accountName: 'Trade Payables Control Account',
    accountType: 'Liability (SOFP)',
    isNominal: false,
    debits: [
      { desc: 'Bank: Cheques paid to suppliers', amount: 34500 },
      { desc: 'Purchases returns to suppliers', amount: 1200 },
      { desc: 'Discounts received', amount: 800 }
    ],
    credits: [
      { desc: 'Balance b/d (Opening balance)', amount: 12000 },
      { desc: 'Purchases Day Book (Credit purchases)', amount: 38000 }
    ],
    correctBalanceType: 'credit',
    correctBalanceAmount: 13500,
    closingDestination: 'Statement of Financial Position (Current Liability)',
    explanation: 'Total Credits (£50,000) exceed Total Debits (£36,500). Balance c/d of £13,500 is entered on Debit side. Balance b/d of £13,500 is brought down on the Credit side as a Current Liability on the SOFP.'
  },
  {
    id: 'ta_4',
    accountName: 'Sales Revenue Account',
    accountType: 'Income (Nominal / SPL)',
    isNominal: true,
    debits: [
      { desc: 'Sales returns from customers', amount: 2500 }
    ],
    credits: [
      { desc: 'Sales Day Book (Credit sales)', amount: 145000 },
      { desc: 'Cash Book (Direct cash sales)', amount: 32500 }
    ],
    correctBalanceType: 'credit',
    correctBalanceAmount: 175000,
    closingDestination: 'Statement of Profit or Loss ("to SPL")',
    explanation: 'Total Credits (£177,500) minus returns (£2,500) = £175,000 net revenue. Transferred "to Statement of Profit or Loss" to determine Gross Profit. As a nominal account, it is closed to zero at year-end.'
  }
];

const TRIAL_BALANCE_ERRORS = [
  {
    id: 'err_1',
    title: 'Motor Repairs Capitalized as Asset',
    scenario: 'Routine engine repairs of £750 on a delivery van were debited to the Motor Vehicles at Cost account instead of Motor Repairs Expense.',
    affectsTrialBalance: false,
    errorClass: 'Error of Principle',
    suspenseImpact: 'No Suspense Account created (Trial Balance totals still equal).',
    journalCorrection: {
      dr: 'Motor Repairs Expense £750',
      cr: 'Motor Vehicles at Cost £750'
    },
    syllabusNote: 'Error of Principle: A transaction is recorded in the wrong class of account (Revenue expenditure debited to a Non-Current Asset), breaking fundamental accounting principles.'
  },
  {
    id: 'err_2',
    title: 'Sales Day Book Transposition into General Ledger',
    scenario: 'The Sales Day Book monthly total of £14,200 was posted to the Sales Account in the General Ledger as £12,400.',
    affectsTrialBalance: true,
    errorClass: 'Transposition / Single-Sided Error',
    suspenseImpact: 'Suspense Account created with Debit balance of £1,800 (£14,200 - £12,400). Note that £1,800 is divisible by 9, a classic hallmark of transposition!',
    journalCorrection: {
      dr: 'Suspense Account £1,800',
      cr: 'Sales Account £1,800'
    },
    syllabusNote: 'Errors affecting the Trial Balance break double entry equality, requiring a Suspense Account to hold the difference until corrected.'
  },
  {
    id: 'err_3',
    title: 'Cash Receipt from Customer Credited to Wrong Debtor',
    scenario: 'A cash receipt of £420 from customer J. Smith was correctly entered in the Cash Book, but credited to the ledger account of customer J. Smythe.',
    affectsTrialBalance: false,
    errorClass: 'Error of Commission',
    suspenseImpact: 'No Suspense Account created (Trial Balance totals still equal).',
    journalCorrection: {
      dr: 'Trade Receivables (J. Smythe) £420',
      cr: 'Trade Receivables (J. Smith) £420'
    },
    syllabusNote: 'Error of Commission: An entry is posted to the wrong person or subsidiary account within the SAME correct class of account (Asset/Receivable).'
  },
  {
    id: 'err_4',
    title: 'Completely Omitted Purchase Invoice',
    scenario: 'An invoice for stationery of £180 paid out of petty cash was completely omitted from all accounting records.',
    affectsTrialBalance: false,
    errorClass: 'Error of Omission',
    suspenseImpact: 'No Suspense Account created (Both debit and credit legs were missing).',
    journalCorrection: {
      dr: 'Stationery Expense £180',
      cr: 'Petty Cash £180'
    },
    syllabusNote: 'Error of Omission: The entire transaction is left out of the financial records. The Trial Balance will balance, completely masking the omission.'
  },
  {
    id: 'err_5',
    title: 'Bank Overdraft Extracted on Wrong Side of Trial Balance',
    scenario: 'A bank overdraft of £3,200 was extracted onto the DEBIT column of the Trial Balance instead of the CREDIT column.',
    affectsTrialBalance: true,
    errorClass: 'Extraction / Posting Error',
    suspenseImpact: 'Trial balance Debits exceed Credits by £6,400 (double the error). Suspense Account holds £6,400 Credit balance.',
    journalCorrection: {
      dr: 'Suspense Account £6,400',
      cr: 'Bank Overdraft (Trial balance position correction) £6,400'
    },
    syllabusNote: 'Listing a credit balance on the debit side creates an imbalance of twice the amount. Always check if the TB imbalance divided by 2 equals an account balance!'
  },
  {
    id: 'err_6',
    title: 'Two Independent Equal Errors in Rent and Sales',
    scenario: 'Rent expense was overcast by £250, and independently Sales revenue was also overcast by £250.',
    affectsTrialBalance: false,
    errorClass: 'Compensating Error',
    suspenseImpact: 'No Suspense Account created (The debit overstatement matches the credit overstatement).',
    journalCorrection: {
      dr: 'Sales Account £250',
      cr: 'Rent Expense £250'
    },
    syllabusNote: 'Compensating Error: Two distinct, unrelated errors coincidentally cancel each other out in the Trial Balance.'
  }
];

const STATEMENT_BUILDER_DATA = {
  company: 'Highland Trading Enterprise',
  period: 'For the Year Ended 31 December 20X6',
  trialBalance: [
    { account: 'Sales Revenue', type: 'SPL_REVENUE', amount: 210000, column: 'credit' },
    { account: 'Opening Inventory (1 Jan 20X6)', type: 'SPL_COS', amount: 18500, column: 'debit' },
    { account: 'Purchases of Goods', type: 'SPL_COS', amount: 112000, column: 'debit' },
    { account: 'Carriage Inwards', type: 'SPL_COS', amount: 2500, column: 'debit' },
    { account: 'Carriage Outwards', type: 'SPL_DISTRIB', amount: 3400, column: 'debit' },
    { account: 'Wages & Salaries (Admin & Office)', type: 'SPL_ADMIN', amount: 24000, column: 'debit' },
    { account: 'Rent, Rates & Insurance', type: 'SPL_ADMIN', amount: 14600, column: 'debit' },
    { account: 'Sales Commission & Advertising', type: 'SPL_DISTRIB', amount: 6800, column: 'debit' },
    { account: 'Bank Loan Interest (Finance Costs)', type: 'SPL_FINANCE', amount: 2000, column: 'debit' },
    { account: 'Property, Plant & Equipment (Cost)', type: 'SOFP_NCA', amount: 140000, column: 'debit' },
    { account: 'Accumulated Depreciation (PPE)', type: 'SOFP_NCA_CONTRA', amount: 35000, column: 'credit' },
    { account: 'Trade Receivables', type: 'SOFP_CA', amount: 32000, column: 'debit' },
    { account: 'Allowance for Receivables', type: 'SOFP_CA_CONTRA', amount: 1600, column: 'credit' },
    { account: 'Cash at Bank', type: 'SOFP_CA', amount: 9600, column: 'debit' },
    { account: 'Trade Payables', type: 'SOFP_CL', amount: 21500, column: 'credit' },
    { account: 'Accruals (Office utilities)', type: 'SOFP_CL', amount: 1500, column: 'credit' },
    { account: '10% Long-Term Bank Loan', type: 'SOFP_NCL', amount: 20000, column: 'credit' },
    { account: 'Capital (Opening at 1 Jan 20X6)', type: 'SOFP_EQUITY', amount: 89000, column: 'credit' },
    { account: 'Drawings by Sole Trader', type: 'SOFP_EQUITY_DRAWINGS', amount: 15000, column: 'debit' }
  ],
  adjustments: {
    closingInventory: 21000 // Counted at warehouse on 31 Dec 20X6
  },
  solution: {
    // Cost of sales = Opening Inventory (18,500) + Purchases (112,000) + Carriage In (2,500) - Closing Inventory (21,000)
    costOfSales: 112000,
    grossProfit: 98000, // 210,000 - 112,000
    distributionCosts: 10200, // 3,400 + 6,800
    adminExpenses: 38600, // 24,000 + 14,600
    operatingProfit: 49200, // 98,000 - 10,200 - 38,600
    financeCosts: 2000,
    profitForTheYear: 47200, // 49,200 - 2,000
    // Capital bridge: Opening (89,000) + Profit (47,200) - Drawings (15,000)
    closingCapital: 121200,
    // Non-current assets = 140,000 - 35,000
    carryingAmountPPE: 105000,
    // Current assets = Closing Inventory (21,000) + Net Receivables (32,000 - 1,600 = 30,400) + Bank (9,600)
    totalCurrentAssets: 61000,
    totalAssets: 166000, // 105,000 + 61,000
    nonCurrentLiabilities: 20000,
    currentLiabilities: 23000, // Trade Payables (21,500) + Accruals (1,500)
    totalEquityAndLiabilities: 166000 // 121,200 (Capital) + 20,000 (NCL) + 23,000 (CL)
  }
};

const INVENTORY_AND_DEPRECIATION_TASKS = [
  {
    id: 'inv_1',
    type: 'IAS2_VALUATION',
    title: 'IAS 2: Lower of Cost and Net Realisable Value (NRV)',
    scenario: 'An entity holds three product lines in inventory at year-end. Calculate the inventory valuation to be recognized in the Statement of Financial Position per IAS 2.',
    items: [
      { product: 'Product Alpha', cost: 12000, expectedSellingPrice: 15000, completionCosts: 500, sellingExpenses: 800 },
      { product: 'Product Beta (Slightly Damaged)', cost: 8500, expectedSellingPrice: 9000, completionCosts: 1200, sellingExpenses: 600 },
      { product: 'Product Gamma', cost: 16000, expectedSellingPrice: 20000, completionCosts: 1000, sellingExpenses: 1500 }
    ],
    // Alpha: Cost = 12000, NRV = 15000 - 1300 = 13700. Lower = 12000
    // Beta: Cost = 8500, NRV = 9000 - 1800 = 7200. Lower = 7200 (Write-down £1,300!)
    // Gamma: Cost = 16000, NRV = 20000 - 2500 = 17500. Lower = 16000
    // Total Inventory = 12,000 + 7,200 + 16,000 = 35,200
    correctTotal: 35200,
    writeDownAmount: 1300,
    rule: 'IAS 2 requires valuation at the LOWER of cost and net realisable value on an item-by-item basis. Aggregating all items to offset damaged goods against profitable goods is strictly forbidden!'
  },
  {
    id: 'dep_1',
    type: 'IAS16_DEPRECIATION',
    title: 'IAS 16: Straight-Line vs Reducing Balance Depreciation',
    scenario: 'Machinery was purchased on 1 January 20X1 for £50,000 with an estimated residual value of £5,000 and useful life of 5 years. A delivery truck was bought on the same day for £30,000, depreciated at 20% reducing balance.',
    task: 'Calculate the total depreciation charge for Year 2 and the carrying amount of both assets at 31 December 20X2.',
    // Machinery Straight Line: (50000 - 5000) / 5 = £9,000 per year.
    // Year 1 Dep = 9000, Carrying Amount Yr 1 = 41000.
    // Year 2 Dep = 9000, Carrying Amount Yr 2 = 32000.
    // Truck Reducing Balance:
    // Year 1 Dep = 20% * 30000 = £6,000. Carrying Amount Yr 1 = £24,000.
    // Year 2 Dep = 20% * 24000 = £4,800. Carrying Amount Yr 2 = £19,200.
    // Total Year 2 Dep = 9,000 + 4,800 = £13,800.
    // Combined Carrying Amount = 32,000 + 19,200 = £51,200.
    machineryYr2Dep: 9000,
    truckYr2Dep: 4800,
    totalYr2Dep: 13800,
    combinedCarryingAmount: 51200,
    rule: 'Under reducing balance, the depreciation percentage is applied to the CARRYING AMOUNT (Cost - Accumulated Depreciation), ignoring residual value in the formula.'
  }
];

const EXAM_TRAP_BLITZ_QUESTIONS = [
  {
    id: 'trap_q1',
    syllabusTag: 'Part A: Context & Framework',
    question: 'Who carries the ultimate legal responsibility for the preparation of financial statements and the implementation of internal controls?',
    options: [
      'The Board of Directors of the company',
      'The external independent statutory auditors',
      'The Chief Internal Auditor',
      'The shareholders at the Annual General Meeting'
    ],
    correctIndex: 0,
    trapAlert: 'Candidates often choose external auditors! Auditors only express an opinion (reasonable assurance) on whether accounts show a true and fair view. Directors retain 100% legal responsibility.'
  },
  {
    id: 'trap_q2',
    syllabusTag: 'Part A: Users of Accounts',
    question: 'Which of the following is NOT a legitimate user of the financial statements of a sole trader business?',
    options: [
      'Institutional Shareholders',
      'HM Revenue & Customs (Tax Authority)',
      'Trade suppliers extending credit',
      'Commercial bank lenders'
    ],
    correctIndex: 0,
    trapAlert: 'A sole trader has NO share capital and NO shareholders! Sole traders are unincorporated private individuals.'
  },
  {
    id: 'trap_q3',
    syllabusTag: 'Part B: Qualitative Characteristics',
    question: 'Under the IASB Conceptual Framework, which two are designated as the FUNDAMENTAL qualitative characteristics?',
    options: [
      'Relevance and Faithful Representation',
      'Comparability and Verifiability',
      'Prudence and Consistency',
      'Timeliness and Understandability'
    ],
    correctIndex: 0,
    trapAlert: 'Comparability, Verifiability, Timeliness, and Understandability are ENHANCING characteristics. Only Relevance and Faithful Representation are Fundamental.'
  },
  {
    id: 'trap_q4',
    syllabusTag: 'Part B: Accounting Conventions',
    question: 'Under modern IFRS standards, which statement accurately reflects the accounting concept of "Prudence"?',
    options: [
      'Exercising caution in the face of uncertainty so assets/income are not overstated and liabilities/expenses are not understated',
      'Deliberately understating assets and overstating liabilities to maintain hidden reserves',
      'Writing down inventory to zero whenever prices fluctuate',
      'Recognizing anticipated profits only when cash is deposited in the bank'
    ],
    correctIndex: 0,
    trapAlert: 'Prudence does NOT allow the deliberate creation of hidden reserves or intentional bias. That would violate Faithful Representation (Neutrality).'
  },
  {
    id: 'trap_q5',
    syllabusTag: 'Part C: The Accounting Equation',
    question: 'At 1 Jan 20X5, Net Assets were £60,000. During 20X5, the owner introduced £12,000 capital, withdrew £18,000 for personal use, and earned a net profit of £25,000. What are Closing Net Assets at 31 Dec 20X5?',
    options: [
      '£79,000',
      '£115,000',
      '£67,000',
      '£55,000'
    ],
    correctIndex: 0,
    trapAlert: 'Extended Business Equation: Closing Net Assets = Opening (60k) + Capital Introduced (12k) + Profit (25k) - Drawings (18k) = £79,000. Do not add drawings!'
  },
  {
    id: 'trap_q6',
    syllabusTag: 'Part D: Inventory (IAS 2)',
    question: 'During a period of continuous price inflation, which inventory valuation method produces the HIGHEST reported gross profit and the HIGHEST closing inventory valuation?',
    options: [
      'FIFO (First-In, First-Out)',
      'AVCO (Weighted Average Cost)',
      'LIFO (Last-In, First-Out)',
      'Standard Costing'
    ],
    correctIndex: 0,
    trapAlert: 'In inflation, FIFO issues older (cheaper) costs to Cost of Sales, leaving recent (expensive) purchases in Closing Inventory. This maximizes reported profit. (Also note: LIFO is banned under IAS 2!).'
  },
  {
    id: 'trap_q7',
    syllabusTag: 'Part E: Trial Balance',
    question: 'Which of the following errors will cause the Trial Balance to be OUT OF BALANCE (requiring a Suspense Account)?',
    options: [
      'A sales invoice of £500 was entered on the credit of Sales and debit of Cash as £50',
      'A motor expenses bill of £300 was debited to Motor Vehicles at Cost',
      'A cash purchase of £150 was completely omitted from the books',
      'A cheque paid to supplier of £400 was debited to Trade Payables but omitted from the Bank Account'
    ],
    correctIndex: 3,
    trapAlert: 'Option 4 is a single-sided entry, which breaks double entry equality and causes the Trial Balance to fail to balance. Options 1, 2, and 3 have equal debits and credits.'
  },
  {
    id: 'trap_q8',
    syllabusTag: 'Part F: Financial Statements',
    question: 'What is the correct year-end treatment of nominal accounts (Income and Expenses)?',
    options: [
      'Their balances are closed off to the Statement of Profit or Loss and do not carry a balance b/d into the next year',
      'Their balances are carried forward as Balance b/d on the Statement of Financial Position',
      'They are credited directly to the Bank Account',
      'They are retained in suspense until audited'
    ],
    correctIndex: 0,
    trapAlert: 'Nominal accounts measure performance over an intervening period (flow). They are closed "to SPL" and reset to zero. Only SOFP real accounts carry a balance b/d.'
  }
];

const PPE_CHAPTER8_DATA = {
  capitalVsRevenue: [
    {
      id: 'cvr_1',
      description: 'Carriage inwards delivery costs for transporting a new CNC cutting machine to the factory.',
      category: 'CAPITAL',
      categoryLabel: 'Capital Expenditure (PPE - SOFP)',
      explanation: 'Under IAS 16, directly attributable costs of bringing the asset to its working condition for intended use must be capitalized as part of PPE cost.'
    },
    {
      id: 'cvr_2',
      description: 'Special reinforced concrete foundation and electrical wiring installed specifically for the CNC machine.',
      category: 'CAPITAL',
      categoryLabel: 'Capital Expenditure (PPE - SOFP)',
      explanation: 'Site preparation, foundations, and direct electrical installation are essential to operate the asset and are capitalized per IAS 16.'
    },
    {
      id: 'cvr_3',
      description: 'Professional fees paid to consulting engineers to test-run and calibrate the CNC machine before commencing commercial production.',
      category: 'CAPITAL',
      categoryLabel: 'Capital Expenditure (PPE - SOFP)',
      explanation: 'Costs of testing whether the asset is functioning properly (net of any sample sales proceeds) are capital expenditure.'
    },
    {
      id: 'cvr_4',
      description: 'Legal conveyancing fees and stamp duty paid when purchasing a freehold warehouse property.',
      category: 'CAPITAL',
      categoryLabel: 'Capital Expenditure (PPE - SOFP)',
      explanation: 'Professional legal fees and transaction taxes incurred directly to acquire title are capital expenditure added to property cost.'
    },
    {
      id: 'cvr_5',
      description: 'Initial estimated present value of site restoration and machine dismantling costs required by environmental law at the end of its 10-year life.',
      category: 'CAPITAL',
      categoryLabel: 'Capital Expenditure (PPE - SOFP)',
      explanation: 'IAS 16 mandates capitalizing the initial estimate of dismantling, removing, and restoring the site as part of the asset cost, with a corresponding provision liability.'
    },
    {
      id: 'cvr_6',
      description: 'Costs of an intensive 3-day training course for machine operators to learn the new CNC software.',
      category: 'REVENUE',
      categoryLabel: 'Revenue Expenditure (SPL Expense)',
      explanation: 'IAS 16 explicitly excludes staff training from PPE cost! Staff are not controlled assets of the entity; training is expensed immediately to SPL.'
    },
    {
      id: 'cvr_7',
      description: 'Routine annual maintenance, lubrication, and replacement of minor worn belts on the factory machines.',
      category: 'REVENUE',
      categoryLabel: 'Revenue Expenditure (SPL Expense)',
      explanation: 'Day-to-day servicing and maintenance merely maintain the asset’s existing standard of performance and must be expensed as incurred.'
    },
    {
      id: 'cvr_8',
      description: 'Annual commercial fire, theft, and flood insurance policy covering the factory premises and machinery.',
      category: 'REVENUE',
      categoryLabel: 'Revenue Expenditure (SPL Expense)',
      explanation: 'Operational insurance is a recurring administration/factory overhead, not an acquisition cost of bringing the asset into working condition.'
    },
    {
      id: 'cvr_9',
      description: 'Repainting the exterior walls of the administration offices and decorating customer meeting rooms.',
      category: 'REVENUE',
      categoryLabel: 'Revenue Expenditure (SPL Expense)',
      explanation: 'Cosmetic decorating and repainting are routine property maintenance expenses charged to the Statement of Profit or Loss.'
    },
    {
      id: 'cvr_10',
      description: 'Repair costs incurred when a forklift truck accidentally dropped and damaged the machine during unloading.',
      category: 'REVENUE',
      categoryLabel: 'Revenue Expenditure (SPL Expense)',
      explanation: 'Accidental damage repairs and abnormal waste are NOT necessary costs of bringing the asset to working condition. They must be expensed as an operating loss.'
    }
  ],
  depreciationScenarios: [
    {
      id: 'dep_sl',
      name: 'Straight-Line Method (IAS 16)',
      assetName: 'Industrial Printing Press',
      cost: 60000,
      residualValue: 6000,
      usefulLifeYears: 5,
      formula: '(Cost − Residual Value) / Useful Life',
      annualDepreciation: 10800, // (60000 - 6000) / 5
      year1CarryingAmount: 49200,
      year2Depreciation: 10800,
      year2CarryingAmount: 38400,
      rule: 'Straight-line allocates an equal depreciation charge each full financial year throughout the asset useful life.'
    },
    {
      id: 'dep_rb',
      name: 'Reducing Balance Method (IAS 16)',
      assetName: 'Executive Fleet Vehicles',
      cost: 40000,
      depreciationRatePct: 25,
      formula: 'Carrying Amount × Depreciation %',
      year1Depreciation: 10000, // 25% of 40,000
      year1CarryingAmount: 30000,
      year2Depreciation: 7500,  // 25% of 30,000
      year2CarryingAmount: 22500,
      rule: 'Under reducing balance, the percentage is applied to the CARRYING AMOUNT (Cost − Accumulated Depreciation). Residual value is ignored in the annual calculation.'
    },
    {
      id: 'dep_prorata',
      name: 'Part-Year Pro-Rata Depreciation',
      assetName: 'Warehouse Forklift',
      cost: 24000,
      usefulLifeYears: 4,
      residualValue: 0,
      acquisitionDate: '1 October 20X5',
      yearEnd: '31 December 20X5',
      monthsOwnedInYear1: 3,
      year1Depreciation: 1500, // (24000 / 4) * (3 / 12)
      year1CarryingAmount: 22500,
      rule: 'Under pro-rata policy, depreciation is charged only for the portion of the year the asset was owned and available for use (3 months / 12 months).'
    }
  ],
  revaluationScenarios: [
    {
      id: 'reval_1',
      title: 'Freehold Land & Headquarters Revaluation',
      originalCost: 200000,
      accumulatedDepreciationBeforeReval: 40000,
      carryingAmountBeforeReval: 160000,
      newFairValuation: 260000,
      revaluationSurplus: 100000, // 260,000 - 160,000
      originalLifeYears: 50,
      yearsElapsed: 10,
      remainingLifeYears: 40,
      revisedAnnualDepreciation: 6500, // 260,000 / 40
      historicalAnnualDepreciation: 4000, // 200,000 / 50
      annualExcessDepreciationTransfer: 2500, // 6,500 - 4,000
      journalEntries: [
        'Step 1: Dr Accumulated Depreciation £40,000, Cr PPE Asset Valuation £40,000 (Eliminate accumulated depreciation)',
        'Step 2: Dr PPE Asset Valuation £100,000, Cr Revaluation Surplus (Equity / OCI) £100,000 (Record surplus)',
        'Step 3: Annual Depreciation: Dr Depreciation Expense (SPL) £6,500, Cr Accumulated Depreciation £6,500',
        'Step 4: Optional Reserves Transfer: Dr Revaluation Surplus £2,500, Cr Retained Earnings £2,500'
      ],
      rule: 'Upward revaluation is recognized in Other Comprehensive Income (OCI) and accumulated in the Revaluation Surplus reserve in equity. An annual transfer of excess depreciation to Retained Earnings is permitted.'
    }
  ],
  disposalScenarios: [
    {
      id: 'disp_1',
      title: 'Disposal of Delivery Van with Cash Proceeds',
      originalCost: 25000,
      accumulatedDepreciation: 18000,
      carryingAmountAtDisposal: 7000, // 25,000 - 18,000
      cashSaleProceeds: 8500,
      resultType: 'PROFIT',
      gainLossAmount: 1500, // 8,500 - 7,000 = Profit £1,500
      tAccountSteps: [
        '1. Dr Asset Disposal Account £25,000 | Cr Motor Vehicles at Cost £25,000 (Remove original cost)',
        '2. Dr Accumulated Depreciation £18,000 | Cr Asset Disposal Account £18,000 (Remove accumulated depn)',
        '3. Dr Bank Account £8,500 | Cr Asset Disposal Account £8,500 (Record cash proceeds received)',
        '4. Balancing plug: Dr Asset Disposal Account £1,500 | Cr Statement of Profit or Loss (Profit on Disposal) £1,500'
      ],
      rule: 'If disposal proceeds exceed carrying amount, a PROFIT on disposal is credited to SPL. If proceeds are less than carrying amount, a LOSS on disposal is debited to SPL.'
    },
    {
      id: 'disp_2',
      title: 'Disposal of Equipment via Part-Exchange Trade-In',
      originalCost: 32000,
      accumulatedDepreciation: 22000,
      carryingAmountAtDisposal: 10000, // 32,000 - 22,000
      partExchangeAllowance: 7500, // Agreed trade-in value against new machine
      cashPaidForNewMachine: 37500,
      newMachineCost: 45000, // 37,500 cash + 7,500 trade-in
      resultType: 'LOSS',
      gainLossAmount: 2500, // 10,000 carrying amount - 7,500 allowance = Loss £2,500
      tAccountSteps: [
        '1. Dr Asset Disposal Account £32,000 | Cr Equipment at Cost £32,000',
        '2. Dr Accumulated Depreciation £22,000 | Cr Asset Disposal Account £22,000',
        '3. Dr New Equipment at Cost £7,500 | Cr Asset Disposal Account £7,500 (Trade-in allowance)',
        '4. Balancing plug: Dr Statement of Profit or Loss (Loss on Disposal) £2,500 | Cr Asset Disposal Account £2,500'
      ],
      rule: 'Part-exchange trade-in allowance represents the disposal proceeds of the old asset and is credited to the Disposal Account. New asset is capitalized at full invoice cost (Trade-in + Cash).'
    }
  ]
};

const ACCRUALS_PREPAYMENTS_DATA = [
  {
    id: 'acc_1',
    title: 'Property Rent Expense Account',
    accountName: 'Rent Expense',
    nature: 'EXPENSE',
    openingPrepayment: 600,   // Paid in prior year for current year (Debit b/d)
    openingAccrual: 0,
    cashPaidDuringYear: 7800,  // Bank payments debited to Rent (Dr Rent, Cr Bank)
    closingPrepayment: 900,   // Paid this year relating to next year (Credit c/d, balance b/d as Asset)
    closingAccrual: 0,
    // Workings: Opening Prepayment (600) + Cash Paid (7800) - Closing Prepayment (900) = £7,500
    splCharge: 7500,
    sofpBalance: 900,
    sofpCategory: 'Current Asset (Prepayments)',
    explanation: 'Opening prepayment of £600 brought forward is added as it relates to this year. Closing prepayment of £900 is deducted and carried forward as a Current Asset into next year. SPL charge = £600 + £7,800 − £900 = £7,500.'
  },
  {
    id: 'acc_2',
    title: 'Electricity & Utilities Expense Account',
    accountName: 'Electricity Expense',
    nature: 'EXPENSE',
    openingPrepayment: 0,
    openingAccrual: 450,       // Consumed prior year, paid this year (Credit b/d)
    cashPaidDuringYear: 3600,  // Paid during year
    closingPrepayment: 0,
    closingAccrual: 620,       // Estimated electricity consumed in Q4, unbilled (Debit to Rent, Credit c/d to Accruals)
    // Workings: Cash Paid (3600) - Opening Accrual (450) + Closing Accrual (620) = £3,770
    splCharge: 3770,
    sofpBalance: 620,
    sofpCategory: 'Current Liability (Accruals)',
    explanation: 'Opening accrual of £450 relates to last year and is deducted. Closing accrual of £620 was consumed this year and is added to SPL and recognized as a Current Liability on SOFP. SPL charge = £3,600 − £450 + £620 = £3,770.'
  },
  {
    id: 'acc_3',
    title: 'Sublet Warehouse Rental Income Account',
    accountName: 'Rental Income',
    nature: 'INCOME',
    openingAccruedIncome: 800,   // Earned last year, collected this year (Debit b/d)
    openingDeferredIncome: 0,
    cashReceivedDuringYear: 9600, // Received in bank (Dr Bank, Cr Rental Income)
    closingAccruedIncome: 0,
    closingDeferredIncome: 1200,  // Tenant paid 2 months in advance (Credit c/d, Liability)
    // Workings: Cash Received (9600) - Opening Accrued (800) - Closing Deferred (1200) = £7,600
    splCharge: 7600,
    sofpBalance: 1200,
    sofpCategory: 'Current Liability (Deferred Income)',
    explanation: 'Tenant paid £1,200 in advance for the next financial year. This is deferred income (Current Liability). SPL rental income recognized = £9,600 − £800 − £1,200 = £7,600.'
  }
];

const IRRECOVERABLE_DEBTS_DATA = [
  {
    id: 'debts_case_1',
    title: 'Year-End Receivables Audit & Allowance Adjustment',
    narrative: 'At 31 December 20X6, total Trade Receivables per the sales ledger ledger stand at £64,000. Before closing the books, the following adjustments are required:\n1. A credit customer who owed £4,000 has been declared bankrupt; this debt is confirmed irrecoverable and must be written off.\n2. Management policy is to maintain an allowance for receivables equal to 5% of remaining trade receivables.\n3. The balance brought forward on the Allowance for Receivables from last year was £2,500.',
    grossReceivables: 64000,
    irrecoverableDebtWriteOff: 4000,
    adjustedReceivables: 60000, // 64,000 - 4,000
    allowancePercentage: 5,
    requiredClosingAllowance: 3000, // 5% of 60,000
    openingAllowance: 2500,
    allowanceAdjustmentType: 'INCREASE',
    allowanceAdjustmentAmount: 500, // 3,000 - 2,500 = £500 increase (Expense)
    totalSplCharge: 4500, // 4,000 written off + 500 increase = £4,500
    sofpNetReceivables: 57000, // 60,000 - 3,000 = £57,000
    journalEntries: [
      '1. Write-off: Dr Irrecoverable Debts Expense £4,000 | Cr Trade Receivables £4,000',
      '2. Allowance Increase: Dr Irrecoverable Debts Expense £500 | Cr Allowance for Receivables £500',
      '3. Year-end Transfer: Dr Statement of Profit or Loss £4,500 | Cr Irrecoverable Debts Expense £4,500'
    ],
    rule: 'Crucial ACCA Rule: The allowance for receivables percentage must ALWAYS be calculated on the balance of receivables AFTER deducting any current-year write-offs!'
  },
  {
    id: 'debts_case_2',
    title: 'Allowance Reduction & Bad Debt Recovery',
    narrative: 'At 31 December 20X7, Trade Receivables stand at £80,000 with no new debts to write off.\n1. A customer whose £1,200 debt was written off 2 years ago unexpectedly paid their balance in full by cheque.\n2. The opening balance on the Allowance for Receivables was £4,800.\n3. Management revises the required allowance down to 4% of receivables.',
    grossReceivables: 80000,
    irrecoverableDebtWriteOff: 0,
    adjustedReceivables: 80000,
    allowancePercentage: 4,
    requiredClosingAllowance: 3200, // 4% of 80,000
    openingAllowance: 4800,
    allowanceAdjustmentType: 'DECREASE',
    allowanceAdjustmentAmount: 1600, // 4,800 - 3,200 = £1,600 decrease (Credit/Income)
    debtRecoveredAmount: 1200,
    netSplImpact: 2800, // £1,600 (allowance decrease) + £1,200 (recovery) = £2,800 total CREDIT (Income)
    sofpNetReceivables: 76800, // 80,000 - 3,200 = £76,800
    journalEntries: [
      '1. Debt Recovery: Dr Bank Account £1,200 | Cr Irrecoverable Debts Recovered (SPL Credit) £1,200',
      '2. Allowance Decrease: Dr Allowance for Receivables £1,600 | Cr Irrecoverable Debts Expense / SPL £1,600',
      '3. SOFP: Trade Receivables £80,000 minus Allowance £3,200 = Net Receivables £76,800'
    ],
    rule: 'A decrease in the allowance for receivables is credited to the Statement of Profit or Loss, increasing operating profit. Debts recovered are also recognized as income.'
  }
];

window.ACCA_DATA = {
  DEAD_CLIC_TRANSACTIONS,
  T_ACCOUNT_CHALLENGES,
  TRIAL_BALANCE_ERRORS,
  STATEMENT_BUILDER_DATA,
  INVENTORY_AND_DEPRECIATION_TASKS,
  EXAM_TRAP_BLITZ_QUESTIONS,
  PPE_CHAPTER8_DATA,
  ACCRUALS_PREPAYMENTS_DATA,
  IRRECOVERABLE_DEBTS_DATA
};
