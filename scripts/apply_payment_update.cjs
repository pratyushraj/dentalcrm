const fs = require('fs');
let code = fs.readFileSync('scripts/generate_statement_pdf.cjs', 'utf8');

// Update KPI Inflow card
code = code.replace(
`<div class="kpi-title">Total Inflows Received</div>\n          <div class="kpi-value">₹40,580</div>\n          <div class="kpi-subtitle">11 payments (14–29 Oct)</div>`,
`<div class="kpi-title">Total Inflows Received</div>\n          <div class="kpi-value">₹45,580</div>\n          <div class="kpi-subtitle">12 payments (14 Oct – 02 Nov)</div>`
);

// Update KPI Net Balance card
code = code.replace(
`<div class="kpi-title">Net Balance Owed to You</div>\n          <div class="kpi-value">₹18,720</div>`,
`<div class="kpi-title">Net Balance Owed to You</div>\n          <div class="kpi-value">₹13,720</div>`
);

// Update Inflows Table 2
const oldRow29 = `              <tr>
                <td>29 Oct</td>
                <td>Direct payment</td>
                <td class="num">₹1,000</td>
              </tr>
              <tr class="total-row">
                <td colspan="2"><strong>Total Inflows Received (11 items)</strong></td>
                <td class="num" style="color: #16a34a;"><strong>₹40,580</strong></td>
              </tr>`;

const newRowsInflow = `              <tr>
                <td>29 Oct</td>
                <td>Direct payment</td>
                <td class="num">₹1,000</td>
              </tr>
              <tr>
                <td>02 Nov</td>
                <td>Direct payment received</td>
                <td class="num">₹5,000</td>
              </tr>
              <tr class="total-row">
                <td colspan="2"><strong>Total Inflows Received (12 items)</strong></td>
                <td class="num" style="color: #16a34a;"><strong>₹45,580</strong></td>
              </tr>`;

code = code.replace(oldRow29, newRowsInflow);

// Update Net Inflow Pill
code = code.replace(
`₹40,580 − ₹12,000 = <span style="color: #0284c7;">₹28,580</span>`,
`₹45,580 − ₹12,000 = <span style="color: #0284c7;">₹33,580</span>`
);

// Update Settlement Card
code = code.replace(
`<span>Gross Payments Received from Client (11 transactions)</span>\n          <span style="font-family: 'JetBrains Mono', monospace;">− ₹40,580</span>`,
`<span>Gross Payments Received from Client (12 transactions)</span>\n          <span style="font-family: 'JetBrains Mono', monospace;">− ₹45,580</span>`
);

code = code.replace(
`<span>Effective Net Cash Received in Hand (₹40,580 − ₹12,000)</span>\n          <span style="font-family: 'JetBrains Mono', monospace;">(₹28,580)</span>`,
`<span>Effective Net Cash Received in Hand (₹45,580 − ₹12,000)</span>\n          <span style="font-family: 'JetBrains Mono', monospace;">(₹33,580)</span>`
);

code = code.replace(
`<span>NET REMAINING BALANCE OWED TO YOU</span>\n          <span class="amount">₹18,720</span>`,
`<span>NET REMAINING BALANCE OWED TO YOU</span>\n          <span class="amount">₹13,720</span>`
);

code = code.replace('through 01 Nov 2026', 'through 02 Nov 2026');

// Update Page 2 Cash Flow Summary Box
code = code.replace('Comprehensive Cash Flow & Settlement Audit (07 Oct – 01 Nov)', 'Comprehensive Cash Flow & Settlement Audit (07 Oct – 02 Nov)');
code = code.replace('FINAL NET DUE: ₹18,720', 'FINAL NET DUE: ₹13,720');
code = code.replace(
`• <strong>Total Payments Received (11 items):</strong> ₹8,600 + ₹6,000 + ₹780 + ₹1,400 + ₹6,200 + ₹1,400 + ₹1,000 + ₹800 + ₹900 + ₹12,500 + ₹1,000 = <strong>₹40,580</strong>`,
`• <strong>Total Payments Received (12 items):</strong> ₹8,600 + ₹6,000 + ₹780 + ₹1,400 + ₹6,200 + ₹1,400 + ₹1,000 + ₹800 + ₹900 + ₹12,500 + ₹1,000 + ₹5,000 = <strong>₹45,580</strong>`
);
code = code.replace(
`• <strong>Effective Net Cash Retained:</strong> ₹40,580 − ₹12,000 = <strong>₹28,580</strong><br>\n            • <strong>Final Net Balance Owed to You:</strong> ₹47,300 (Net Work) − ₹28,580 (Net Cash) = <strong>₹18,720</strong>`,
`• <strong>Effective Net Cash Retained:</strong> ₹45,580 − ₹12,000 = <strong>₹33,580</strong><br>\n            • <strong>Final Net Balance Owed to You:</strong> ₹47,300 (Net Work) − ₹33,580 (Net Cash) = <strong>₹13,720</strong>`
);

fs.writeFileSync('scripts/generate_statement_pdf.cjs', code);
console.log('Successfully updated scripts/generate_statement_pdf.cjs with ₹5,000 payment!');
