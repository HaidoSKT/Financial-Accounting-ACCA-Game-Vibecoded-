# 📊 Financial Accounting Master Suite & Simulator
### *Interactive Games for Double-Entry, Financial Statements, PPE, Accruals, Debts, and Inventory Valuation (FIFO vs AVCO)*

![ACCA Standard](https://img.shields.io/badge/ACCA%20Syllabus-FFA%20%2F%20FA%20(F3)-blue?style=for-the-badge)
![Inventory Standards](https://img.shields.io/badge/Standards-IFRS%20(IAS%202)%20%26%20US%20GAAP%20(ASC%20330)-emerald?style=for-the-badge)
![Storage](https://img.shields.io/badge/Storage-Dual%20Persistence%20(LocalStorage%20%2B%20REST)-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)

A comprehensive suite of interactive, gamified single-page applications designed to master core financial accounting disciplines with persistent data storage and real-time ledger verification.

---

## 🎮 Suite Games Overview

| Game | Entrypoint | Key Accounting Concepts |
| :--- | :--- | :--- |
| **Game 1: ACCA FA Master** | [`index.html`](index.html) | DEAD CLIC debit/credit duality, T-Account balancing, Trial Balance errors, Statement Architect (SPL & SOFP), Exam Trap Blitz, **Chapter 8 PPE (IAS 16), Depreciation & Disposals**, **Accruals & Prepayments**, and **Irrecoverable Debts & Allowances**. |
| **Game 2: FIFO vs AVCO Master** | [`fifo-lifo.html`](fifo-lifo.html) | **FIFO Periodic & Perpetual**, **AVCO Periodic (Weighted Average) & AVCO Perpetual (Moving Average)**, Real-Time Stock Cards, Price Smoothing, Gross Profit Impact, IAS 2 Compliance & LIFO Prohibition. |

---

## 🏛️ Game 1: ACCA FA Master - Expanded Curriculum Modes

In addition to double-entry, trial balance, and financial statement architecture, the suite includes:

### 1. 🏛️ Chapter 8: Property, Plant & Equipment (IAS 16) & Depreciation
* **Capital vs Revenue Expenditure Sorter:** Classify transactions (site preparation, carriage inwards on machinery, installation, dismantle restoration provisions, engineer test runs vs routine servicing, operator training, repainting, and transit damage repairs).
* **Depreciation Workings:**
  * **Straight-Line:** $\frac{\text{Cost} - \text{Residual Value}}{\text{Useful Life}}$.
  * **Reducing Balance:** $\text{Carrying Amount} \times \text{Depreciation Rate \%}$.
  * **Part-Year Pro-Rata:** Pro-rating charges for asset additions acquired mid-year.
* **IAS 16 Revaluation Model & Reserves Transfer:**
  * Revalue assets to fair value and recognize **Revaluation Surplus** in Other Comprehensive Income (OCI).
  * Compute revised annual depreciation over remaining life.
  * Execute the annual reserves transfer: $\text{Dr Revaluation Surplus}, \text{Cr Retained Earnings}$.
* **Asset Disposal Account Balancer:**
  * 4-step interactive disposal ledger: transfer asset cost, eliminate accumulated depreciation, recognize cash/trade-in proceeds, and compute **Profit or Loss on Disposal**.

### 2. ⏳ Accruals & Prepayments Balancer
* **The Matching Convention:** Master year-end adjustments for accrued expenses, prepaid expenses, accrued income, and deferred income.
* **T-Account Ledger Balancer:** Calculate the balancing figure transferred **to Statement of Profit or Loss**:
  $$\text{SPL Charge} = \text{Cash Paid} + \text{Opening Prepayment} - \text{Closing Prepayment} - \text{Opening Accrual} + \text{Closing Accrual}$$
* Classify closing balances as **Current Assets** (Prepayments) or **Current Liabilities** (Accruals) on the Statement of Financial Position.

### 3. 🛡️ Irrecoverable Debts & Allowances (Receivables - IFRS 9)
* **Step 1: Write-Off Bad Debts:** Remove confirmed bankrupt debtors directly from Trade Receivables ($\text{Dr Irrecoverable Debts Expense}, \text{Cr Trade Receivables}$).
* **Step 2: Allowance for Receivables:** Apply allowance % exclusively to the *adjusted* receivables balance.
* **Step 3: Allowance Adjustments:** Recognize an **Increase** as an SPL expense or a **Decrease** as an SPL credit (income).
* **Step 4: Bad Debt Recoveries:** Account for cash received from debts previously written off.
* **Statement Presentation:** Net Trade Receivables on the Statement of Financial Position ($\text{Gross Receivables} - \text{Allowance}$).

---

## 📦 Game 2: Inventory Valuation Master (FIFO vs AVCO - IAS 2 Compliant)

An interactive accounting laboratory focused on **Inventory Valuation and Cost Flow Assumptions**, comparing all principal permutations permitted by IAS 2:

### 1. The 4 Permitted Valuation Systems
1. **FIFO Periodic (First-In, First-Out Period-End):** Ending inventory allocated from newest acquisitions backwards.
2. **FIFO Perpetual (First-In, First-Out Continuous):** Continuous queue depleting oldest acquisitions on hand. Always equals FIFO Periodic!
3. **AVCO Periodic (Weighted Average Cost):** Single average rate computed at period-end:
   $$\text{WAC Rate} = \frac{\text{Total Cost of Goods Available for Sale (COGAS)}}{\text{Total Available Units}}$$
4. **AVCO Perpetual (Moving Weighted Average Cost):** Moving average unit cost recalculated continuously *after every purchase receipt*:
   $$\text{New Unit Cost} = \frac{\text{Previous Balance Cost} + \text{Receipt Cost}}{\text{Previous Balance Units} + \text{Receipt Units}}$$

> [!NOTE]
> Under IAS 2 (Inventories), paragraph 25, only FIFO and Weighted Average Cost (AVCO) formulas are permitted for interchangeable inventory. LIFO is strictly prohibited.

---

### 🌟 Game Modes in FIFO vs AVCO Master

#### 1. 🏢 4-Way Inventory Engine & Simulator
* **Live Stepper & Timeline:** Step forward and backward through realistic business cycles (*Apex Semiconductor*, *Nordic Timber*, *Lumina Batteries*, *Titan Heavy Industries*).
* **Warehouse Shelf Visualizer:** Visual color-coded pallets showing batch dates, quantities, and unit purchase costs.
* **4-Way Scorecard:** Side-by-side live updates of Ending Units, Ending Inventory Dollar Value, COGS, and Gross Profit across all 4 permitted systems.
* **Full Stock Card Ledger:** Detailed audit table with Receipts, Issues, and Balance on hand for both FIFO Perpetual and AVCO Perpetual moving average.

#### 2. 📦 Warehouse Dispatcher Arena
* Urgent customer orders arrive at the loading dock.
* The system mandates an accounting standard (*FIFO Perpetual*).
* The player interactively selects pallets, allocates units, and computes the Cost of Goods Sold.
* Streak multipliers, sound synthesis, and instant feedback.

#### 3. 📊 Stock Card & Exam Arena
* Multi-transaction accounting questions testing period-end allocation, COGS formulas, AVCO moving average calculations, and IAS 2 compliance.
* In-game scratchpad with step-by-step mathematical explanations.

#### 4. 🕵️ CFO Strategy & Price Smoothing Detective
* Compares how FIFO vs AVCO flow into the **Statement of Profit or Loss (SPL)** and **Statement of Financial Position (SOFP)**.
* Explores economic conditions:
  * **Inflation (Rising Prices):** FIFO maximizes reported profits and inventory carrying amounts; AVCO dampens volatility via price smoothing.
  * **Deflation (Falling Prices):** Reversal where AVCO produces lower COGS and higher net income than FIFO.
  * **AVCO Smoothing Spread:** Footnote tracking the valuation divergence between FIFO and AVCO.
  * **International Regulations:** Why IAS 2 prohibits LIFO and permits only FIFO and AVCO.

#### 5. 🛠️ Custom Sandbox & Inventory Tycoon
* Configure your own custom inventory schedule (dates, purchases, sales, units, costs, and selling prices).
* Run the 4-way valuation engine on your custom numbers.
* Save company simulations to the persistent database.

---

## 💾 Data Storing & Persistence Architecture

Both games implement a **Dual-Layer Persistence Engine**:

### 1. Client-Side Persistence (`LocalStorage`)
* Primary keys:
  * ACCA Game: `acca_arena_data_v1`
  * FIFO/LIFO Game: `fifo_lifo_master_storage_v1`
* Persists candidate profile, rank progression, marks, combo streaks, badges, custom company slots, and complete audit trail logs.
* **JSON Export & Import:** Download complete backup files (`.json`) with one click, or import them on any machine.
* Works 100% offline or on static web hosts like **GitHub Pages**.

### 2. Server-Side REST API (Zero-Dependency Node.js Server)
* Zero npm dependencies required (built with native Node.js `http`, `fs`, `path`).
* Data files in [`data/`](data/):
  * `data/game_store.json` (ACCA Game state)
  * `data/inventory_store.json` (FIFO/LIFO Master state)
* Endpoints:
  * `GET /api/health` — Server health check
  * `GET /api/load` & `POST /api/save` — ACCA game persistence
  * `GET /api/inventory/load` & `POST /api/inventory/save` — FIFO/LIFO game persistence
  * Route aliases: `/` $\to$ ACCA Game; `/fifo-lifo` or `/inventory` $\to$ FIFO/LIFO Game.

---

## 🚀 Getting Started

### Option A: Standalone Browser Launch (Zero Installation)
Simply open [`fifo-lifo.html`](fifo-lifo.html) or [`index.html`](index.html) in any modern web browser (Chrome, Edge, Firefox, Safari). All procedural Web Audio, interactive modules, and local persistence work immediately out of the box!

### Option B: Local Node.js Persistence Server
```bash
# Start the local HTTP & REST persistence server
node server.js
```

Open your browser at:
* **FIFO vs LIFO Master:** `http://localhost:3000/fifo-lifo.html`
* **ACCA FA Master:** `http://localhost:3000/`

---

## 🌐 Deploying to GitHub Pages

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Financial Accounting Suite with FIFO/LIFO game and persistent data storing"
   git push origin main
   ```
2. Enable GitHub Pages in your repository under **Settings** > **Pages** (Source: `main` branch, `/root`).
3. Your game is live worldwide!
