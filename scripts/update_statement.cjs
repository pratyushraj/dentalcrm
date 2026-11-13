const fs = require('fs');
let code = fs.readFileSync('scripts/generate_statement_pdf.cjs', 'utf8');

// Update KPI cards
code = code.replace(/₹49,850/g, '₹54,550');
code = code.replace('75 N + 68 S + 13 OZ (156 units)', '89 N + 71 S + 13 OZ (173 units)');
code = code.replace(/₹14,020/g, '₹18,720');

// Update Work delivered section title
code = code.replace('(07 Oct – 30 Oct)', '(07 Oct – 01 Nov)');

// Update Work delivered table
code = code.replace('Category N Work (Base 62 + Added 13: 28–30 Oct)', 'Category N Work (Base 62 + Added 27: 28 Oct – 01 Nov)');
code = code.replace('<td class="num">75</td>\n            <td class="num">₹250</td>\n            <td class="num"><strong>₹18,750</strong></td>', '<td class="num">89</td>\n            <td class="num">₹250</td>\n            <td class="num"><strong>₹22,250</strong></td>');

code = code.replace('Category S Work (Base 60 + Added 8: 28–30 Oct)', 'Category S Work (Base 60 + Added 11: 28 Oct – 01 Nov)');
code = code.replace('<td class="num">68</td>\n            <td class="num">₹400</td>\n            <td class="num"><strong>₹27,200</strong></td>', '<td class="num">71</td>\n            <td class="num">₹400</td>\n            <td class="num"><strong>₹28,400</strong></td>');

code = code.replace('<strong>156 Units</strong>', '<strong>173 Units</strong>');

// Update Settlement Card
code = code.replace('(75 N @ ₹250 + 68 S @ ₹400 + 13 OZ @ ₹300)', '(89 N @ ₹250 + 71 S @ ₹400 + 13 OZ @ ₹300)');
code = code.replace('(Gross ₹54,550 − Deductions ₹7,250)', '(Gross ₹54,550 − Deductions ₹7,250)');
code = code.replace('>₹42,600<', '>₹47,300<');
code = code.replace('(75 N, 68 S, 13 OZ)', '(89 N, 71 S, 13 OZ)');
code = code.replace('through 30 Oct 2026', 'through 01 Nov 2026');

// Page 2 header
code = code.replace('<h1>Every Day Orders Log (07 Oct – 30 Oct)</h1>', '<h1>Every Day Orders Log (07 Oct – 01 Nov)</h1>');

// Page 2 rows: add 31 Oct and 01 Nov before total row
const row30 = `            <tr>
              <td><strong>30 Oct</strong></td>
              <td><code>3s 2n 4n 1s 1n</code></td>
              <td class="num">7 (₹1,750)</td>
              <td class="num">4 (₹1,600)</td>
              <td class="num">—</td>
              <td class="num">₹3,350</td>
              <td class="num"><strong>₹54,550</strong></td>
            </tr>`;

const newRows = `            <tr>
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
              <td class="num"><strong>₹54,550</strong></td>
            </tr>`;

code = code.replace(row30, newRows);

// Update totals row on page 2
code = code.replace('(24 DAYS)', '(26 DAYS)');
code = code.replace('75 (₹18,750)', '89 (₹22,250)');
code = code.replace('68 (₹27,200)', '71 (₹28,400)');

// Update cash flow summary box on page 2
code = code.replace('Comprehensive Cash Flow & Settlement Audit (07–30 Oct)', 'Comprehensive Cash Flow & Settlement Audit (07 Oct – 01 Nov)');
code = code.replace('75 N (₹18,750) + 68 S (₹27,200) + 13 OZ (₹3,900) = <strong>₹54,550</strong> (156 units)', '89 N (₹22,250) + 71 S (₹28,400) + 13 OZ (₹3,900) = <strong>₹54,550</strong> (173 units)');
code = code.replace('Net Work: ₹42,600', 'Net Work: ₹47,300');
code = code.replace('₹42,600 (Net Work) − ₹28,580 (Net Cash) = <strong>₹18,720</strong>', '₹47,300 (Net Work) − ₹28,580 (Net Cash) = <strong>₹18,720</strong>');

// Compact table styling on page 2 to ensure strictly 2 pages
code = code.replace('<table style="font-size: 8.5px;">', '<table style="font-size: 7.8px; margin-bottom: 3px;">');
code = code.replace('padding: 3.5px 6px;', 'padding: 2.3px 5px;');

fs.writeFileSync('scripts/generate_statement_pdf.cjs', code);
console.log('Successfully updated scripts/generate_statement_pdf.cjs');
