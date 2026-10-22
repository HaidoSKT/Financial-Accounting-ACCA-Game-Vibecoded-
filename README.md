# 📊 Financial Accounting Master Suite & Simulator
### *Interactive Games for Double-Entry, Financial Statements, and Inventory Valuation (FIFO vs LIFO)*

![ACCA Standard](https://img.shields.io/badge/ACCA%20Syllabus-FFA%20%2F%20FA%20(F3)-blue?style=for-the-badge)
![Inventory Standards](https://img.shields.io/badge/Standards-IFRS%20(IAS%202)%20%26%20US%20GAAP%20(ASC%20330)-emerald?style=for-the-badge)
![Storage](https://img.shields.io/badge/Storage-Dual%20Persistence%20(LocalStorage%20%2B%20REST)-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)

A comprehensive suite of interactive, gamified single-page applications designed to master core financial accounting disciplines with persistent data storage and real-time ledger verification.

---

## 🎮 Suite Games Overview

| Game | Entrypoint | Key Accounting Concepts |
| :--- | :--- | :--- |
| **Game 1: ACCA FA Master** | [`index.html`](index.html) | DEAD CLIC debit/credit duality, T-Account balancing, Trial Balance & Suspense Account errors, Statement Architect (SPL & SOFP), Exam Trap Blitz. |
| **Game 2: FIFO vs LIFO Master** | [`fifo-lifo.html`](fifo-lifo.html) | FIFO Periodic, FIFO Perpetual, LIFO Periodic, LIFO Perpetual, Warehouse Stock Cards, LIFO Reserve, Tax Shielding, LIFO Liquidation, IAS 2 vs ASC 330. |

---

## 📦 Game 2: FIFO vs LIFO Master Deep Dive

An interactive accounting laboratory focused on **Inventory Valuation and Cost Flow Assumptions**, comparing the four principal permutations:

### 1. The 4 Core Valuation Systems
1. **FIFO Periodic (First-In, First-Out Period-End):**
   * Sales are aggregated at period-end.
   * Ending inventory is allocated from the **most recent acquisitions backwards**.
   * $\text{COGS} = \text{Cost of Goods Available for Sale (COGAS)} - \text{Ending Inventory Value}$.
2. **FIFO Perpetual (First-In, First-Out Continuous):**
   * Tracked continuously after each transaction using a FIFO inventory queue.
   * Earliest acquisitions on hand are issued first at the moment of each sale.
   * **Fundamental Accounting Theorem:** FIFO Periodic and FIFO Perpetual **always yield identical** COGS and Ending Inventory balances!
3. **LIFO Periodic (Last-In, First-Out Period-End):**
   * Aggregated at period-end.
   * Ending inventory is valued using the **earliest purchases / base layers forwards**.
   * COGS is charged with the most recent purchases made anywhere in the period.
4. **LIFO Perpetual (Last-In, First-Out Point-in-Time Stack):**
   * Evaluated continuously at the date and time of each individual sale.
   * Issues are charged against the **most recent purchase currently on the warehouse shelf**.
   * Purchases made after a sale cannot retroactively apply to that sale.
   * Consequently, LIFO Perpetual and Periodic diverge whenever sales intervene between purchases.

---

### 🌟 Game Modes in FIFO vs LIFO Master

#### 1. 🏢 4-Way Inventory Engine & Simulator
* **Live Stepper & Timeline:** Step forward and backward through realistic business months (e.g. *Apex Semiconductor*, *Nordic Timber*, *Lumina Batteries*, *Titan Steel Liquidation*).
* **Warehouse Shelf Visualizer:** Visual color-coded pallets showing batch dates, quantities, and unit purchase costs.
* **4-Way Scorecard:** Side-by-side live updates of Ending Units, Ending Inventory Dollar Value, COGS, and Gross Profit across all 4 methods.
* **Full Stock Card Ledger:** Detailed audit table with Receipts, Issues, and Balance on hand for both FIFO Perpetual and LIFO Perpetual.

#### 2. 📦 Warehouse Dispatcher Arena
* Urgent customer orders arrive at the loading dock.
* The system mandates an accounting standard (e.g. *LIFO Perpetual* or *FIFO Perpetual*).
* The player interactively selects pallets, allocates units, and computes the Cost of Goods Sold.
* Streak multipliers, sound synthesis, and instant feedback.

#### 3. 📊 Stock Card & Exam Arena
* Multi-transaction accounting questions testing period-end allocation, COGS formulas, LIFO Reserve calculations, and tax shielding.
* In-game scratchpad with step-by-step mathematical explanations.

#### 4. 🕵️ CFO Strategy & Financial Impact Detective
* Compares how FIFO vs LIFO flow into the **Statement of Profit or Loss (SPL)** and **Statement of Financial Position (SOFP)**.
* Explores economic conditions:
  * **Inflation (Rising Prices):** FIFO inflates net income and taxes; LIFO maximizes cash flow via the **Tax Shield**.
  * **Deflation (Falling Prices):** Reversal where LIFO produces lower COGS and higher net income.
  * **LIFO Reserve Footnote:** $\text{LIFO Reserve} = \text{FIFO Ending Inventory} - \text{LIFO Ending Inventory}$.
  * **LIFO Liquidation Crisis:** Depleting older base layers creates artificial profit spikes and sudden tax liabilities.
  * **International Regulations:** Why IFRS (IAS 2) bans LIFO, and the US GAAP (IRC § 472) **LIFO Conformity Rule**.

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
