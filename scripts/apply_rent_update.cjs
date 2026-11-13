const fs = require('fs');
let code = fs.readFileSync('scripts/generate_statement_pdf.cjs', 'utf8');

// Update KPI Deductions card
code = code.replace(
`<div class="kpi-title">Total Expense Deductions</div>\n          <div class="kpi-value">−₹7,250</div>\n          <div class="kpi-subtitle">Elec: ₹3,000 • OZ Used: ₹4,250</div>`,
`<div class="kpi-title">Total Expense Deductions</div>\n          <div class="kpi-value">−₹16,250</div>\n          <div class="kpi-subtitle">Rent: ₹9k • Elec: ₹3k • OZ: ₹4.25k</div>`
);

// Update KPI Net Balance card
code = code.replace(
`<div class="kpi-title">Net Balance Owed to You</div>\n          <div class="kpi-value">₹13,720</div>`,
`<div class="kpi-title">Net Balance Owed to You</div>\n          <div class="kpi-value">₹4,720</div>`
);

// Update Table 4 Deductions
const oldTable4 = `            <tbody>
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
              <tr class="total-row">
                <td colspan="2"><strong>Total Operational Deductions</strong></td>
                <td class="num" style="color: #dc2626;"><strong>− ₹7,250</strong></td>
              </tr>
            </tbody>`;

const newTable4 = `            <tbody>
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
              <tr class="total-row">
                <td colspan="2"><strong>Total Operational Deductions</strong></td>
                <td class="num" style="color: #dc2626;"><strong>− ₹16,250</strong></td>
              </tr>
            </tbody>`;

code = code.replace(oldTable4, newTable4);

// Update Settlement Card
const oldSettlementDeduct = `        <div class="settlement-row">
          <span>Less: Operational Electricity Bill Deduction</span>
          <span style="font-family: 'JetBrains Mono', monospace; color: #fca5a5;">− ₹3,000</span>
        </div>
        <div class="settlement-row">
          <span>Less: OZ Material Consumed (₹1,700 + ₹1,700 + ₹850)</span>
          <span style="font-family: 'JetBrains Mono', monospace; color: #fca5a5;">− ₹4,250</span>
        </div>
        <div class="settlement-row" style="font-weight: 700; color: #93c5fd; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2px;">
          <span>Net Adjusted Billable Work Value (Gross ₹54,550 − Deductions ₹7,250)</span>
          <span style="font-family: 'JetBrains Mono', monospace;">₹47,300</span>
        </div>`;

const newSettlementDeduct = `        <div class="settlement-row">
          <span>Less: Monthly Premise Rent</span>
          <span style="font-family: 'JetBrains Mono', monospace; color: #fca5a5;">− ₹9,000</span>
        </div>
        <div class="settlement-row">
          <span>Less: Operational Electricity Bill Deduction</span>
          <span style="font-family: 'JetBrains Mono', monospace; color: #fca5a5;">− ₹3,000</span>
        </div>
        <div class="settlement-row">
          <span>Less: OZ Material Consumed (₹1,700 + ₹1,700 + ₹850)</span>
          <span style="font-family: 'JetBrains Mono', monospace; color: #fca5a5;">− ₹4,250</span>
        </div>
        <div class="settlement-row" style="font-weight: 700; color: #93c5fd; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2px;">
          <span>Net Adjusted Billable Work Value (Gross ₹54,550 − Deductions ₹16,250)</span>
          <span style="font-family: 'JetBrains Mono', monospace;">₹38,300</span>
        </div>`;

code = code.replace(oldSettlementDeduct, newSettlementDeduct);

code = code.replace(
`<span>NET REMAINING BALANCE OWED TO YOU</span>\n          <span class="amount">₹13,720</span>`,
`<span>NET REMAINING BALANCE OWED TO YOU</span>\n          <span class="amount">₹4,720</span>`
);

// Update Page 2 Cash Flow Summary Box
code = code.replace('FINAL NET DUE: ₹13,720', 'FINAL NET DUE: ₹4,720');
code = code.replace(
`• <strong>Operational Deductions:</strong> Electricity (−₹3,000) + OZ Used (−₹4,250) = <strong>−₹7,250</strong> &nbsp;|&nbsp; <strong>Net Work: ₹47,300</strong>`,
`• <strong>Operational Deductions:</strong> Rent (−₹9,000) + Electricity (−₹3,000) + OZ Used (−₹4,250) = <strong>−₹16,250</strong> &nbsp;|&nbsp; <strong>Net Work: ₹38,300</strong>`
);
code = code.replace(
`• <strong>Final Net Balance Owed to You:</strong> ₹47,300 (Net Work) − ₹33,580 (Net Cash) = <strong>₹13,720</strong>`,
`• <strong>Final Net Balance Owed to You:</strong> ₹38,300 (Net Work) − ₹33,580 (Net Cash) = <strong>₹4,720</strong>`
);

fs.writeFileSync('scripts/generate_statement_pdf.cjs', code);
console.log('Successfully updated scripts/generate_statement_pdf.cjs with ₹9,000 rent deduction!');
