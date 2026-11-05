const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Statement of Account - October 2026</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  @page {
    size: A4 portrait;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #f1f5f9;
    color: #0f172a;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page {
    width: 210mm;
    height: 297mm;
    padding: 10mm 13mm;
    background: #ffffff;
    margin: 0 auto;
    page-break-after: always;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 9px;
    border-bottom: 2px solid #e2e8f0;
  }

  .header-left h1 {
    font-size: 19px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.5px;
    text-transform: uppercase;
  }

  .header-left p {
    font-size: 9.5px;
    color: #64748b;
    margin-top: 2px;
    font-weight: 500;
  }

  .header-right {
    text-align: right;
  }

  .badge-status {
    display: inline-block;
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .header-date {
    font-size: 9px;
    color: #64748b;
    margin-top: 3px;
  }

  /* KPI Cards */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    margin: 9px 0;
  }

  .kpi-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    padding: 7px 9px;
  }

  .kpi-card.highlight {
    background: #f0fdf4;
    border-color: #86efac;
  }

  .kpi-title {
    font-size: 8px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .kpi-card.highlight .kpi-title {
    color: #15803d;
  }

  .kpi-value {
    font-size: 15px;
    font-weight: 900;
    color: #0f172a;
    margin-top: 2px;
    font-family: 'JetBrains Mono', monospace;
  }

  .kpi-card.highlight .kpi-value {
    color: #15803d;
  }

  .kpi-subtitle {
    font-size: 8px;
    color: #94a3b8;
    margin-top: 1px;
  }

  /* Section Title */
  .section-title {
    font-size: 10px;
    font-weight: 800;
    color: #1e293b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .section-title span.bar {
    width: 3px;
    height: 10px;
    background: #0284c7;
    border-radius: 2px;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.8px;
    margin-bottom: 7px;
  }

  th {
    background: #f1f5f9;
    color: #475569;
    font-weight: 700;
    text-align: left;
    padding: 4px 6px;
    border: 1px solid #e2e8f0;
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  td {
    padding: 2.0px 5px;
    border: 1px solid #e2e8f0;
    color: #1e293b;
  }

  tr:nth-child(even) td {
    background: #fafafa;
  }

  td.num, th.num {
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
  }

  tr.total-row td {
    font-weight: 800;
    background: #f8fafc;
    border-top: 2px solid #cbd5e1;
    font-size: 9px;
  }

  /* Two Column Layout */
  .grid-2 {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 10px;
    margin-bottom: 6px;
  }

  /* Summary Box */
  .settlement-card {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    border-radius: 8px;
    padding: 10px 14px;
    margin-top: 2px;
  }

  .settlement-card h3 {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #38bdf8;
    margin-bottom: 6px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(255,255,255,0.15);
  }

  .settlement-row {
    display: flex;
    justify-content: space-between;
    font-size: 9.5px;
    padding: 2.2px 0;
    color: #cbd5e1;
  }

  .settlement-row.highlight-net {
    font-size: 12.5px;
    font-weight: 900;
    color: #4ade80;
    padding-top: 6px;
    margin-top: 4px;
    border-top: 1px dashed rgba(255,255,255,0.25);
  }

  .settlement-row.highlight-net span.amount {
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
  }

  .note-audit {
    font-size: 8px;
    color: #94a3b8;
    margin-top: 4px;
    line-height: 1.35;
    font-style: italic;
  }

  /* Code tag */
  code {
    background: #f1f5f9;
    padding: 1px 3px;
    border-radius: 3px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    color: #0f172a;
    border: 1px solid #e2e8f0;
  }

  /* Footer */
  .footer {
    padding-top: 6px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8px;
    color: #94a3b8;
  }
</style>
</head>
<body>

  <!-- PAGE 1: EXECUTIVE STATEMENT & CASH FLOW SETTLEMENT -->
  <div class="page">
    <div>
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <h1>Statement of Account</h1>
          <p>Comprehensive Billing & Settlement Reconciliation • 07 Oct 2026 – 05 Nov 2026</p>
        </div>
        <div class="header-right">
          <div class="badge-status" style="background: #f0fdf4; color: #15803d; border-color: #86efac;">Account Settled • Paid in Full</div>
          <div class="header-date">Updated: 05 Nov 2026</div>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-title">Total Billed Work</div>
          <div class="kpi-value">₹61,250</div>
          <div class="kpi-subtitle">103 N + 79 S + 13 OZ (195 units)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Total Inflows Received</div>
          <div class="kpi-value">₹57,280</div>
          <div class="kpi-subtitle">14 tranches (14 Oct – 05 Nov)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Combined Deductions & Outflows</div>
          <div class="kpi-value">−₹28,250</div>
          <div class="kpi-subtitle">Expenses: ₹16.25k • Sent Back: ₹12k</div>
        </div>
        <div class="kpi-card highlight">
          <div class="kpi-title">Net Account Balance</div>
          <div class="kpi-value" style="color: #15803d;">₹0 Due</div>
          <div class="kpi-subtitle">Fully Paid (+₹280 Advance Credit)</div>
        </div>
      </div>

      <!-- Rates & Production Overview -->
      <div class="section-title">
        <span class="bar"></span> 1. Work Delivered & Billable Volume (07 Oct – 04 Nov)
      </div>
      <table>
        <thead>
          <tr>
            <th>Item Category</th>
            <th>Billing Description</th>
            <th class="num">Units Delivered</th>
            <th class="num">Unit Price</th>
            <th class="num">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Item N</strong></td>
            <td>Category N Work (07 Oct – 04 Nov)</td>
            <td class="num">103</td>
            <td class="num">₹250</td>
            <td class="num"><strong>₹25,750</strong></td>
          </tr>
          <tr>
            <td><strong>Item S</strong></td>
            <td>Category S Work (07 Oct – 04 Nov)</td>
            <td class="num">79</td>
            <td class="num">₹400</td>
            <td class="num"><strong>₹31,600</strong></td>
          </tr>
          <tr>
            <td><strong>Item OZ</strong></td>
            <td>Category OZ Work (11 Oct – 15 Oct)</td>
            <td class="num">13</td>
            <td class="num">₹300</td>
            <td class="num"><strong>₹3,900</strong></td>
          </tr>
          <tr class="total-row">
            <td colspan="2"><strong>CUMULATIVE GROSS BILLABLE PRODUCTION</strong></td>
            <td class="num"><strong>195 Units</strong></td>
            <td class="num">—</td>
            <td class="num" style="color: #0f172a;"><strong>₹61,250</strong></td>
          </tr>
        </tbody>
      </table>

      <!-- Two Column: Payments Received vs Outflows & Deductions -->
      <div class="grid-2">
        <!-- Payments Received -->
        <div>
          <div class="section-title">
            <span class="bar" style="background: #16a34a;"></span> 2. Inflow Payments Received (All Tranches)
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment Breakdown / Channel</th>
                <th class="num">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>14 Oct</td>
                <td>₹1,000 + ₹800 + ₹1,000 + ₹800 + ₹5,000</td>
                <td class="num">₹8,600</td>
              </tr>
              <tr>
                <td>16 Oct</td>
                <td>Tranche 1 (₹2,000 + ₹1,600 + ₹1,400 + ₹1,000)</td>
                <td class="num">₹6,000</td>
              </tr>
              <tr>
                <td>16 Oct</td>
                <td>UPI received (3:32 PM)</td>
                <td class="num">₹780</td>
              </tr>
              <tr>
                <td>16 Oct</td>
                <td>UPI received (6:46 PM) </td>
                <td class="num">₹1,400</td>
              </tr>
              <tr>
                <td>17 Oct</td>
                <td>₹1,000 + ₹1,400 + ₹1,000 + ₹1,400 + ₹1,400</td>
                <td class="num">₹6,200</td>
              </tr>
              <tr>
                <td>19 Oct</td>
                <td>UPI received (7:47 PM)</td>
                <td class="num">₹1,400</td>
              </tr>
              <tr>
                <td>21 Oct</td>
                <td>Direct payment</td>
                <td class="num">₹1,000</td>
              </tr>
              <tr>
                <td>22 Oct</td>
                <td>Direct payment</td>
                <td class="num">₹800</td>
              </tr>
              <tr>
                <td>23 Oct</td>
                <td>Direct payment</td>
                <td class="num">₹900</td>
              </tr>
              <tr>
                <td>26 Oct</td>
                <td>Direct payment</td>
                <td class="num">₹12,500</td>
              </tr>
              <tr>
                <td>29 Oct</td>
                <td>Direct payment</td>
                <td class="num">₹1,000</td>
              </tr>
              <tr>
                <td>02 Nov</td>
                <td>Direct payment received</td>
                <td class="num">₹5,000</td>
              </tr>
              <tr>
                <td>03 Nov</td>
                <td>Direct payment received</td>
                <td class="num">₹4,200</td>
              </tr>
              <tr>
                <td>05 Nov</td>
                <td>₹3,000 + ₹1,300 + ₹1,000 + ₹800 + ₹1,400</td>
                <td class="num">₹7,500</td>
              </tr>
              <tr class="total-row">
                <td colspan="2"><strong>Total Inflows Received (14 items)</strong></td>
                <td class="num" style="color: #16a34a;"><strong>₹57,280</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Combined Outflows & Expense Deductions -->
        <div>
          <div class="section-title">
            <span class="bar" style="background: #dc2626;"></span> 3. Combined Outflows & Expense Deductions
          </div>
          <table>
            <thead>
              <tr>
                <th>Category / Item</th>
                <th>Particulars / Description</th>
                <th class="num">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Premise Rent</strong></td>
                <td>Monthly space/operational rent</td>
                <td class="num" style="color: #dc2626;">− ₹9,000</td>
              </tr>
              <tr>
                <td><strong>Electricity Bill</strong></td>
                <td>Operational utility adjustment</td>
                <td class="num" style="color: #dc2626;">− ₹3,000</td>
              </tr>
              <tr>
                <td><strong>OZ Material Used</strong></td>
                <td>Consumable cost (₹1,700 + ₹1,700 + ₹850)</td>
                <td class="num" style="color: #dc2626;">− ₹4,250</td>
              </tr>
              <tr>
                <td><strong>Sent Back (16 Oct)</strong></td>
                <td>Funds transferred / refunded by you</td>
                <td class="num" style="color: #ea580c;">− ₹7,000</td>
              </tr>
              <tr>
                <td><strong>Sent Back (17 Oct)</strong></td>
                <td>Funds transferred / refunded by you</td>
                <td class="num" style="color: #ea580c;">− ₹5,000</td>
              </tr>
              <tr class="total-row">
                <td colspan="2"><strong>Total Combined Outflows & Expenses</strong></td>
                <td class="num" style="color: #dc2626;"><strong>− ₹28,250</strong></td>
              </tr>
            </tbody>
          </table>

          <!-- Net Inflow Pill -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 9px; margin-top: 5px;">
            <div style="font-size: 8px; color: #64748b; font-weight: 700; text-transform: uppercase;">Net Cash Retained in Hand:</div>
            <div style="font-size: 13px; font-weight: 900; color: #0f172a; font-family: 'JetBrains Mono', monospace; margin-top: 1px;">
              ₹57,280 − ₹12,000 = <span style="color: #0284c7;">₹45,280</span>
            </div>
            <div style="font-size: 7.5px; color: #94a3b8; margin-top: 1px;">Gross receipts (₹57,280) less money sent back (₹12,000)</div>
          </div>
        </div>
      </div>

      <!-- Final Settlement Summary Card -->
      <div class="settlement-card">
        <h3>Final Settlement Ledger (Outstanding Due to You)</h3>
        <div class="settlement-row">
          <span>Gross Work Delivered (103 N @ ₹250 + 79 S @ ₹400 + 13 OZ @ ₹300)</span>
          <span style="font-family: 'JetBrains Mono', monospace;">+ ₹61,250</span>
        </div>
        <div class="settlement-row">
          <span>Less: Operational Expense Deductions (Rent ₹9k + Elec ₹3k + OZ ₹4.25k)</span>
          <span style="font-family: 'JetBrains Mono', monospace; color: #fca5a5;">− ₹16,250</span>
        </div>
        <div class="settlement-row">
          <span>Add: Money Sent Back / Outflow Reimbursement (16 & 17 Oct)</span>
          <span style="font-family: 'JetBrains Mono', monospace; color: #86efac;">+ ₹12,000</span>
        </div>
        <div class="settlement-row" style="font-weight: 700; color: #93c5fd; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2px;">
          <span>Net Total Credit Due to You (Work ₹61,250 − Expenses ₹16,250 + Sent Back ₹12,000)</span>
          <span style="font-family: 'JetBrains Mono', monospace;">₹57,000</span>
        </div>
        <div class="settlement-row">
          <span>Total Payments Received from Client (14 tranches through 05 Nov)</span>
          <span style="font-family: 'JetBrains Mono', monospace;">− ₹57,280</span>
        </div>
        <div class="settlement-row">
          <span>Combined Total Deductions & Outflows (Expenses ₹16,250 + Sent Back ₹12,000)</span>
          <span style="font-family: 'JetBrains Mono', monospace; color: #cbd5e1;">(− ₹28,250)</span>
        </div>
        <div class="settlement-row highlight-net">
          <span>ACCOUNT SETTLEMENT STATUS (PAID IN FULL)</span>
          <span class="amount" style="color: #4ade80;">₹0 Due (+₹280 Advance Credit)</span>
        </div>
        <div class="note-audit" style="color: #94a3b8; font-style: normal;">Statement fully reconciled across all work delivered (103 N, 79 S, 13 OZ), combined operational deductions and money sent back (−₹28,250 combined outflows), and total receipts (₹57,280). Account cleared with ₹280 advance credit.</div>
      </div>
    </div>

    <!-- Page 1 Footer -->
    <div class="footer">
      <div>Statement of Account • Confidential & Private Reconciliation</div>
      <div>Page 1 of 2</div>
    </div>
  </div>

  <!-- PAGE 2: ITEMIZED EVERY DAY ORDERS OF N, S, AND OZ -->
  <div class="page">
    <div>
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <h1>Every Day Orders Log (07 Oct – 04 Nov)</h1>
          <p>Detailed Daily Quantities, Individual Item Costs & Running Bill Total</p>
        </div>
        <div class="header-right">
          <div class="header-date">Rates: N = ₹250 • S = ₹400 • OZ = ₹300</div>
        </div>
      </div>

      <!-- Complete Daily Orders Table -->
      <div style="margin-top: 7px;">
        <table style="font-size: 7.4px; margin-bottom: 2px;">
          <thead>
            <tr>
              <th style="width: 10%;">Date</th>
              <th style="width: 27%;">Raw Recorded Entries</th>
              <th class="num" style="width: 14%;">N (Qty & ₹)</th>
              <th class="num" style="width: 14%;">S (Qty & ₹)</th>
              <th class="num" style="width: 13%;">OZ (Qty & ₹)</th>
              <th class="num" style="width: 11%;">Day Total</th>
              <th class="num" style="width: 11%;">Running Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>07 Oct</strong></td>
              <td><code>4n</code></td>
              <td class="num">4 (₹1,000)</td>
              <td class="num">—</td>
              <td class="num">—</td>
              <td class="num">₹1,000</td>
              <td class="num">₹1,000</td>
            </tr>
            <tr>
              <td><strong>08 Oct</strong></td>
              <td><code>1s 1n</code></td>
              <td class="num">1 (₹250)</td>
              <td class="num">1 (₹400)</td>
              <td class="num">—</td>
              <td class="num">₹650</td>
              <td class="num">₹1,650</td>
            </tr>
            <tr>
              <td><strong>09 Oct</strong></td>
              <td><code>1s</code></td>
              <td class="num">—</td>
              <td class="num">1 (₹400)</td>
              <td class="num">—</td>
              <td class="num">₹400</td>
              <td class="num">₹2,050</td>
            </tr>
            <tr>
              <td><strong>10 Oct</strong></td>
              <td><code>2n</code></td>
              <td class="num">2 (₹500)</td>
              <td class="num">—</td>
              <td class="num">—</td>
              <td class="num">₹500</td>
              <td class="num">₹2,550</td>
            </tr>
            <tr>
              <td><strong>11 Oct</strong></td>
              <td><code>1n 1n 1s 1s 5 oz</code></td>
              <td class="num">2 (₹500)</td>
              <td class="num">2 (₹800)</td>
              <td class="num">5 (₹1,500)</td>
              <td class="num">₹2,800</td>
              <td class="num">₹5,350</td>
            </tr>
            <tr>
              <td><strong>12 Oct</strong></td>
              <td><code>1oz 1n</code></td>
              <td class="num">1 (₹250)</td>
              <td class="num">—</td>
              <td class="num">1 (₹300)</td>
              <td class="num">₹550</td>
              <td class="num">₹5,900</td>
            </tr>
            <tr>
              <td><strong>13 Oct</strong></td>
              <td><code>1s 1s 1n 1n</code></td>
              <td class="num">2 (₹500)</td>
              <td class="num">2 (₹800)</td>
              <td class="num">—</td>
              <td class="num">₹1,300</td>
              <td class="num">₹7,200</td>
            </tr>
            <tr>
              <td><strong>14 Oct</strong></td>
              <td><code>3n 2s 3s 3oZ</code></td>
              <td class="num">3 (₹750)</td>
              <td class="num">5 (₹2,000)</td>
              <td class="num">3 (₹900)</td>
              <td class="num">₹3,650</td>
              <td class="num">₹10,850</td>
            </tr>
            <tr>
              <td><strong>15 Oct</strong></td>
              <td><code>2n 2s 4 oz 2s 1n 1n</code></td>
              <td class="num">4 (₹1,000)</td>
              <td class="num">4 (₹1,600)</td>
              <td class="num">4 (₹1,200)</td>
              <td class="num">₹3,800</td>
              <td class="num">₹14,650</td>
            </tr>
            <tr>
              <td><strong>16 Oct</strong></td>
              <td><code>6n 3s 1s 1n</code></td>
              <td class="num">7 (₹1,750)</td>
              <td class="num">4 (₹1,600)</td>
              <td class="num">—</td>
              <td class="num">₹3,350</td>
              <td class="num">₹18,000</td>
            </tr>
            <tr>
              <td><strong>17 Oct</strong></td>
              <td><code>5n 4s</code></td>
              <td class="num">5 (₹1,250)</td>
              <td class="num">4 (₹1,600)</td>
              <td class="num">—</td>
              <td class="num">₹2,850</td>
              <td class="num">₹20,850</td>
            </tr>
            <tr>
              <td><strong>18 Oct</strong></td>
              <td><code>1s 2s 1s 1n 1s 2n</code></td>
              <td class="num">3 (₹750)</td>
              <td class="num">5 (₹2,000)</td>
              <td class="num">—</td>
              <td class="num">₹2,750</td>
              <td class="num">₹23,600</td>
            </tr>
            <tr>
              <td><strong>19 Oct</strong></td>
              <td><code>6s 3n</code></td>
              <td class="num">3 (₹750)</td>
              <td class="num">6 (₹2,400)</td>
              <td class="num">—</td>
              <td class="num">₹3,150</td>
              <td class="num">₹26,750</td>
            </tr>
            <tr>
              <td><strong>20 Oct</strong></td>
              <td><code>3s 2n</code></td>
              <td class="num">2 (₹500)</td>
              <td class="num">3 (₹1,200)</td>
              <td class="num">—</td>
              <td class="num">₹1,700</td>
              <td class="num">₹28,450</td>
            </tr>
            <tr>
              <td><strong>21 Oct</strong></td>
              <td><code>5s 3n</code></td>
              <td class="num">3 (₹750)</td>
              <td class="num">5 (₹2,000)</td>
              <td class="num">—</td>
              <td class="num">₹2,750</td>
              <td class="num">₹31,200</td>
            </tr>
            <tr>
              <td><strong>22 Oct</strong></td>
              <td><code>5s 3n</code></td>
              <td class="num">3 (₹750)</td>
              <td class="num">5 (₹2,000)</td>
              <td class="num">—</td>
              <td class="num">₹2,750</td>
              <td class="num">₹33,950</td>
            </tr>
            <tr>
              <td><strong>23 Oct</strong></td>
              <td><code>2n</code></td>
              <td class="num">2 (₹500)</td>
              <td class="num">—</td>
              <td class="num">—</td>
              <td class="num">₹500</td>
              <td class="num">₹34,450</td>
            </tr>
            <tr>
              <td><strong>24 Oct</strong></td>
              <td><code>4s 2n</code></td>
              <td class="num">2 (₹500)</td>
              <td class="num">4 (₹1,600)</td>
              <td class="num">—</td>
              <td class="num">₹2,100</td>
              <td class="num">₹36,550</td>
            </tr>
            <tr>
              <td><strong>25 Oct</strong></td>
              <td><code>4n 2s 2n</code></td>
              <td class="num">6 (₹1,500)</td>
              <td class="num">2 (₹800)</td>
              <td class="num">—</td>
              <td class="num">₹2,300</td>
              <td class="num">₹38,850</td>
            </tr>
            <tr>
              <td><strong>26 Oct</strong></td>
              <td><code>5n 4s</code></td>
              <td class="num">5 (₹1,250)</td>
              <td class="num">4 (₹1,600)</td>
              <td class="num">—</td>
              <td class="num">₹2,850</td>
              <td class="num">₹41,700</td>
            </tr>
            <tr>
              <td><strong>27 Oct</strong></td>
              <td><code>2n 3s</code></td>
              <td class="num">2 (₹500)</td>
              <td class="num">3 (₹1,200)</td>
              <td class="num">—</td>
              <td class="num">₹1,700</td>
              <td class="num">₹43,400</td>
            </tr>
            <tr>
              <td><strong>28 Oct</strong></td>
              <td><code>3n 2s</code></td>
              <td class="num">3 (₹750)</td>
              <td class="num">2 (₹800)</td>
              <td class="num">—</td>
              <td class="num">₹1,550</td>
              <td class="num">₹44,950</td>
            </tr>
            <tr>
              <td><strong>29 Oct</strong></td>
              <td><code>3n 2s</code></td>
              <td class="num">3 (₹750)</td>
              <td class="num">2 (₹800)</td>
              <td class="num">—</td>
              <td class="num">₹1,550</td>
              <td class="num">₹46,500</td>
            </tr>
            <tr>
              <td><strong>30 Oct</strong></td>
              <td><code>3s 2n 4n 1s 1n</code></td>
              <td class="num">7 (₹1,750)</td>
              <td class="num">4 (₹1,600)</td>
              <td class="num">—</td>
              <td class="num">₹3,350</td>
              <td class="num">₹49,850</td>
            </tr>
            <tr>
              <td><strong>31 Oct</strong></td>
              <td><code>1n 1n 1n 1s 1n 1n 1n</code></td>
              <td class="num">6 (₹1,500)</td>
              <td class="num">1 (₹400)</td>
              <td class="num">—</td>
              <td class="num">₹1,900</td>
              <td class="num">₹51,750</td>
            </tr>
            <tr>
              <td><strong>01 Nov</strong></td>
              <td><code>8n 2s</code></td>
              <td class="num">8 (₹2,000)</td>
              <td class="num">2 (₹800)</td>
              <td class="num">—</td>
              <td class="num">₹2,800</td>
              <td class="num">₹54,550</td>
            </tr>
            <tr>
              <td><strong>02 Nov</strong></td>
              <td><code>2n</code></td>
              <td class="num">2 (₹500)</td>
              <td class="num">—</td>
              <td class="num">—</td>
              <td class="num">₹500</td>
              <td class="num">₹55,050</td>
            </tr>
            <tr>
              <td><strong>03 Nov</strong></td>
              <td><code>4s 5n</code></td>
              <td class="num">5 (₹1,250)</td>
              <td class="num">4 (₹1,600)</td>
              <td class="num">—</td>
              <td class="num">₹2,850</td>
              <td class="num">₹57,900</td>
            </tr>
            <tr>
              <td><strong>04 Nov</strong></td>
              <td><code>2n 1s 1s 1n 1n 1n 1s 1n 1s 1n</code></td>
              <td class="num">7 (₹1,750)</td>
              <td class="num">4 (₹1,600)</td>
              <td class="num">—</td>
              <td class="num">₹3,350</td>
              <td class="num"><strong>₹61,250</strong></td>
            </tr>
            <tr class="total-row">
              <td colspan="2"><strong>MONTHLY CUMULATIVE TOTALS (29 DAYS)</strong></td>
              <td class="num" style="color: #0284c7;"><strong>103 (₹25,750)</strong></td>
              <td class="num" style="color: #0284c7;"><strong>79 (₹31,600)</strong></td>
              <td class="num" style="color: #0284c7;"><strong>13 (₹3,900)</strong></td>
              <td class="num">—</td>
              <td class="num" style="color: #0284c7; font-size: 10.5px;"><strong>₹61,250</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Cash Flow Summary Box -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 7px; padding: 7px 11px; margin-top: 5px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px;">
          <div style="font-size: 9.5px; font-weight: 800; color: #1e293b; text-transform: uppercase;">Comprehensive Cash Flow & Settlement Audit (07 Oct – 05 Nov)</div>
          <div style="font-size: 9px; font-weight: 800; color: #15803d; font-family: 'JetBrains Mono', monospace;">STATUS: FULLY SETTLED (PAID IN FULL)</div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 8.2px; color: #475569; line-height: 1.45;">
          <div>
            • <strong>Gross Work Production:</strong> 103 N (₹25,750) + 79 S (₹31,600) + 13 OZ (₹3,900) = <strong>₹61,250</strong> (195 units)<br>
            • <strong>Combined Outflows & Expenses:</strong> Rent (−₹9k) + Elec (−₹3k) + OZ (−₹4.25k) + Sent Back (−₹12k) = <strong>−₹28,250</strong><br>
            • <strong>Total Payments Received (14 tranches):</strong> ₹49,780 + ₹7,500 (05 Nov) = <strong>₹57,280</strong>
          </div>
          <div>
            • <strong>Net Total Claim Due to You:</strong> Gross Work (₹61,250) − Expenses (₹16,250) + Sent Back (₹12,000) = <strong>₹57,000</strong><br>
            • <strong>Effective Net Cash Retained:</strong> Total Receipts (₹57,280) − Sent Back (₹12,000) = <strong>₹45,280</strong><br>
            • <strong>Final Net Balance Status:</strong> ₹57,000 (Net Due) − ₹57,280 (Payments Received) = <strong style="color: #15803d;">₹0 Due (+₹280 Advance Credit)</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Page 2 Footer -->
    <div class="footer">
      <div>Statement of Account • Detailed Daily Orders & Cash Flow Ledger</div>
      <div>Page 2 of 2</div>
    </div>
  </div>

</body>
</html>
`;

async function generatePDF() {
  const desktopPdfPath = '/Users/pratyushraj/Desktop/Statement_of_Account_Oct2026.pdf';
  const repoPdfPath = path.join(__dirname, '../public/docs/Statement_of_Account_Oct2026.pdf');
  const distPdfPath = path.join(__dirname, '../dist/docs/Statement_of_Account_Oct2026.pdf');

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Generate PDF
  await page.pdf({
    path: desktopPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
  });

  // Also copy to repo paths
  fs.copyFileSync(desktopPdfPath, repoPdfPath);
  if (fs.existsSync(path.dirname(distPdfPath))) {
    fs.copyFileSync(desktopPdfPath, distPdfPath);
  }

  await browser.close();
  console.log('Updated PDF generated successfully at:');
  console.log('  1.', desktopPdfPath);
  console.log('  2.', repoPdfPath);
  console.log('  3.', distPdfPath);
}

generatePDF().catch(err => {
  console.error('PDF Generation Failed:', err);
  process.exit(1);
});
