import { Document, Paragraph, TextRun, Packer, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';

export interface ClinicKycData {
  clinicName?: string;
  doctorName?: string;
  city?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
}

/**
 * Generates and downloads a custom Word (.docx) Board Resolution
 * dynamically auto-filled with the clinic's / company's details.
 */
export async function downloadAutoFilledBoardResolutionDocx({
  clinicName,
  doctorName,
  city,
  accountNumber,
  ifscCode,
  bankName
}: ClinicKycData) {
  const companyTitle = (clinicName || '[COMPANY NAME]').toUpperCase();
  const directorTitle = doctorName ? (doctorName.toLowerCase().startsWith('dr') ? doctorName : `Dr. ${doctorName}`) : '[Director / Authorized Officer Name]';
  const cityTitle = (city || '[City]').toUpperCase();
  const accTitle = accountNumber || '[Current Account Number]';
  const ifscTitle = ifscCode || '[IFSC Code]';
  const bankTitle = bankName || '[Bank Name]';
  const todayFormatted = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch in dxa
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Letterhead instruction
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "[TO BE PRINTED ON COMPANY / IVF CENTER OFFICIAL LETTERHEAD]",
                bold: true,
                size: 19,
                color: "64748B",
              }),
            ],
          }),

          // Resolution Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF ",
                bold: true,
                size: 21,
                color: "0B2450",
              }),
              new TextRun({
                text: `${companyTitle} PRIVATE LIMITED / LLP\n`,
                bold: true,
                underline: {},
                size: 21,
                color: "0867E8",
              }),
              new TextRun({
                text: `HELD ON ${todayFormatted} AT THE REGISTERED OFFICE AT ${cityTitle}`,
                bold: true,
                size: 19,
                color: "475569",
              }),
            ],
          }),

          // Resolution Clause 1: Consent to onboard with Pine Labs & Clinaza
          new Paragraph({
            spacing: { after: 200, line: 280 },
            children: [
              new TextRun({
                text: '"RESOLVED THAT ',
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: `the consent and approval of the Board of Directors of the Company be and is hereby accorded to enter into a merchant services arrangement with Pine Labs Private Limited ("Plural by Pine Labs") and its healthcare platform partner Clinaza Technologies Private Limited ("Clinaza") for availing online payment gateway facilities, point-of-care patient checkout, multi-bank credit/debit card EMI infrastructure, and T+1 direct settlement processing for healthcare treatments and patient services.`,
                size: 20,
              }),
            ],
          }),

          // Resolution Clause 2: Authorized Signatory
          new Paragraph({
            spacing: { after: 200, line: 280 },
            children: [
              new TextRun({
                text: 'RESOLVED FURTHER THAT ',
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: `${directorTitle}, Director, be and is hereby authorized on behalf of the Company to negotiate, sign, execute, and deliver:\n  (a) The Plural Merchant Application Form (MAF);\n  (b) The Beneficial Ownership (BO) and Politically Exposed Persons (PEP) declarations;\n  (c) The Merchant Master Services Agreement (MSA) and Platform Agreements;\n  (d) All necessary declarations, KYC schedules, compliance undertakings, and deeds required by Pine Labs / Plural and Clinaza from time to time.`,
                size: 20,
              }),
            ],
          }),

          // Resolution Clause 3: Settlement Bank Account
          new Paragraph({
            spacing: { after: 200, line: 280 },
            children: [
              new TextRun({
                text: 'RESOLVED FURTHER THAT ',
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: `the Company\'s Current Bank Account maintained with ${bankTitle}, bearing Current Account Number: ${accTitle}, IFSC: ${ifscTitle}, be and is hereby designated as the official registered settlement bank account for receiving all merchant payouts, settlements, and credits processed via the Pine Labs / Plural gateway.`,
                size: 20,
              }),
            ],
          }),

          // Resolution Clause 4: Certified True Copy Delivery
          new Paragraph({
            spacing: { after: 300, line: 280 },
            children: [
              new TextRun({
                text: 'RESOLVED FURTHER THAT ',
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: `a certified true copy of this resolution under the hands of any Director or Company Secretary of the Company be furnished to Pine Labs Private Limited and Clinaza Technologies, and they be requested to act upon and honor the same."`,
                size: 20,
              }),
            ],
          }),

          // Signatory Intro
          new Paragraph({
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `CERTIFIED TRUE COPY\nFor ${companyTitle} PRIVATE LIMITED / LLP`,
                bold: true,
                size: 20,
                color: "0B2450",
              }),
            ],
          }),

          // Signatory Table (2 Columns)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `_______________________________\nName: ${directorTitle}\nDesignation: Director / Managing Director\nDIN: [DIN Number]\nDate: ${new Date().toLocaleDateString('en-IN')}\nPlace: ${city || '[City]'}`,
                            size: 19,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `_______________________________\nName: [Director 2 / CS Name]\nDesignation: Director / Company Secretary\nDIN: [DIN Number]\nDate: ${new Date().toLocaleDateString('en-IN')}\nPlace: ${city || '[City]'}\n[Company Round Seal / Stamp]`,
                            size: 19,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = (clinicName || 'Company').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Board_Resolution_${cleanName}_PineLabs_Plural.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a custom Word (.docx) GST Exemption Self-Declaration
 * dynamically auto-filled with the clinic's / doctor's details.
 */
export async function downloadAutoFilledGstExemptionDocx({
  clinicName,
  doctorName,
  city
}: ClinicKycData) {
  const cName = clinicName || '[Clinic Name]';
  const dName = doctorName ? (doctorName.toLowerCase().startsWith('dr') ? doctorName : `Dr. ${doctorName}`) : '[Doctor Name]';
  const cCity = city || '[Clinic City]';

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "[TO BE PRINTED ON CLINIC OFFICIAL LETTERHEAD]",
                bold: true,
                size: 19,
                color: "64748B",
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "TO WHOMSOEVER IT MAY CONCERN\n\n",
                bold: true,
                size: 22,
                color: "0B2450",
              }),
              new TextRun({
                text: "Subject: Self-Declaration for Statutory Exemption from Goods and Services Tax (GST)\n\n",
                bold: true,
                size: 21,
              }),
              new TextRun({
                text: `We, ${cName}, situated at ${cCity}, represented by ${dName}, hereby solemnly declare, certify, and confirm that:\n\n`,
                size: 20,
              }),
              new TextRun({
                text: `1. We are a registered healthcare "Clinical Establishment" engaged in providing bona fide medical healthcare and dental clinical services.\n\n` +
                      `2. In accordance with the statutory provisions of Notification No. 12/2017-Central Tax (Rate) dated 28th June, 2017 (Entry No. 74) issued by the Ministry of Finance, Department of Revenue, Government of India, healthcare services provided by a clinical establishment, an authorized medical practitioner, or paramedics are EXEMPT from Goods and Services Tax (NIL rate of GST).\n\n` +
                      `3. Since the entire turnover of our practice is derived from exempt healthcare treatments, we are not required to obtain GST registration under Section 23 of the Central Goods and Services Tax (CGST) Act, 2017, and consequently carry no GSTIN.\n\n` +
                      `4. This self-declaration is issued to Pine Labs Private Limited ("Plural") and Clinaza Technologies for the sole purpose of merchant onboarding, Payment Gateway MID issuance, and bank account settlement whitelisting.\n\n`,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 400 },
            children: [
              new TextRun({
                text: `Sincerely,\nFor ${cName}\n\n\n\n__________________________________\nAuthorized Signatory: ${dName}\nDesignation: Clinic Director / Proprietor\nDate: ${new Date().toLocaleDateString('en-IN')}\nPlace: ${cCity}\n[Clinic Stamp & Doctor Seal]`,
                size: 20,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = (clinicName || 'Clinic').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `GST_Exemption_Declaration_${cleanName}.docx`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Opens a print-ready formatted window auto-filled with clinic details,
 * allowing instant 1-click printing on clinic letterhead or "Save as PDF".
 */
export function printAutoFilledBoardResolution({
  clinicName,
  doctorName,
  city,
  accountNumber,
  ifscCode,
  bankName
}: ClinicKycData) {
  const companyTitle = (clinicName || '[COMPANY NAME]').toUpperCase();
  const directorTitle = doctorName ? (doctorName.toLowerCase().startsWith('dr') ? doctorName : `Dr. ${doctorName}`) : '[Authorized Director Name]';
  const cityTitle = (city || '[City]').toUpperCase();
  const accTitle = accountNumber || '[Current Account Number]';
  const ifscTitle = ifscCode || '[IFSC Code]';
  const bankTitle = bankName || '[Bank Name]';
  const todayFormatted = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Board Resolution - ${companyTitle}</title>
      <style>
        @page { size: A4; margin: 25mm 20mm 20mm 20mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.5; font-size: 13px; margin: 0; padding: 20px; }
        .header-note { text-align: center; font-size: 11px; font-weight: 700; color: #64748b; border-bottom: 2px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 20px; text-transform: uppercase; }
        .doc-title { text-align: center; font-size: 13.5px; font-weight: 800; color: #0b2450; text-transform: uppercase; margin-bottom: 6px; line-height: 1.4; }
        .company-name { color: #0867e8; text-decoration: underline; }
        .meeting-details { text-align: center; font-size: 11.5px; font-weight: 600; color: #475569; margin-bottom: 24px; }
        .res-block { margin-bottom: 16px; font-size: 12.5px; line-height: 1.6; text-align: justify; }
        .res-lead { font-weight: 800; color: #0b2450; }
        .sig-section { margin-top: 36px; }
        .sig-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .sig-table td { width: 50%; vertical-align: top; font-size: 12px; line-height: 1.5; }
        .sig-line { display: inline-block; width: 180px; border-bottom: 1.5px solid #0f172a; margin-bottom: 8px; }
        @media print { .header-note { display: none; } }
      </style>
    </head>
    <body>
      <div class="header-note">[ Place Official Company Letterhead in Printer Before Printing ]</div>
      <div class="doc-title">
        CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE MEETING OF THE BOARD OF DIRECTORS OF <span class="company-name">${companyTitle} PRIVATE LIMITED / LLP</span>
      </div>
      <div class="meeting-details">
        HELD ON ${todayFormatted} AT THE REGISTERED OFFICE AT ${cityTitle}
      </div>
      <div class="res-block">
        <span class="res-lead">"RESOLVED THAT</span> the consent and approval of the Board of Directors of the Company be and is hereby accorded to enter into a merchant services arrangement with Pine Labs Private Limited ("Plural by Pine Labs") and its healthcare platform partner Clinaza Technologies Private Limited ("Clinaza") for availing online payment gateway facilities, point-of-care patient checkout, multi-bank credit/debit card EMI infrastructure, and T+1 direct settlement processing for healthcare treatments and patient services.
      </div>
      <div class="res-block">
        <span class="res-lead">RESOLVED FURTHER THAT</span> <strong>${directorTitle}</strong>, Director, be and is hereby authorized on behalf of the Company to negotiate, sign, execute, and deliver:
        <ol style="margin-top:6px; margin-left:20px;">
          <li>The Plural Merchant Application Form (MAF);</li>
          <li>The Beneficial Ownership (BO) and Politically Exposed Persons (PEP) declarations;</li>
          <li>The Merchant Master Services Agreement (MSA) and Platform Agreements;</li>
          <li>All requisite KYC schedules, compliance undertakings, and declarations required by Pine Labs / Plural and Clinaza from time to time.</li>
        </ol>
      </div>
      <div class="res-block">
        <span class="res-lead">RESOLVED FURTHER THAT</span> the Company's Current Bank Account maintained with <strong>${bankTitle}</strong>, bearing Current Account Number: <strong>${accTitle}</strong>, IFSC: <strong>${ifscTitle}</strong>, be and is hereby designated as the official registered settlement bank account for receiving all merchant payouts, settlements, and credits processed via the Pine Labs / Plural gateway.
      </div>
      <div class="res-block">
        <span class="res-lead">RESOLVED FURTHER THAT</span> a certified true copy of this resolution under the hands of any Director or Company Secretary of the Company be furnished to Pine Labs Private Limited and Clinaza Technologies, and they be requested to act upon and honor the same."
      </div>
      <div class="sig-section">
        <div style="font-weight: 800; font-size: 12px; color: #0b2450; margin-bottom: 20px;">
          CERTIFIED TRUE COPY<br>For ${companyTitle} PRIVATE LIMITED / LLP
        </div>
        <table class="sig-table">
          <tr>
            <td>
              <div class="sig-line"></div><br>
              <strong>Name:</strong> ${directorTitle}<br>
              <strong>Designation:</strong> Director / Managing Director<br>
              <strong>DIN:</strong> [DIN Number]<br>
              <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}<br>
              <strong>Place:</strong> ${city || '[City]'}
            </td>
            <td>
              <div class="sig-line"></div><br>
              <strong>Name:</strong> [Director 2 / CS Name]<br>
              <strong>Designation:</strong> Director / Company Secretary<br>
              <strong>DIN:</strong> [DIN Number]<br>
              <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}<br>
              <strong>Place:</strong> ${city || '[City]'}<br>
              <em>[Company Round Seal / Stamp]</em>
            </td>
          </tr>
        </table>
      </div>
      <script>
        window.onload = function() { setTimeout(function(){ window.print(); }, 200); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Opens a print-ready formatted window auto-filled with clinic details,
 * allowing instant 1-click printing of GST Exemption on clinic letterhead.
 */
export function printAutoFilledGstExemption({
  clinicName,
  doctorName,
  city
}: ClinicKycData) {
  const cName = clinicName || '[Clinic Name]';
  const dName = doctorName ? (doctorName.toLowerCase().startsWith('dr') ? doctorName : `Dr. ${doctorName}`) : '[Doctor Name]';
  const cCity = city || '[Clinic City]';
  const todayFormatted = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>GST Exemption Self-Declaration - ${cName}</title>
      <style>
        @page { size: A4; margin: 25mm 20mm 20mm 20mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6; font-size: 13.5px; margin: 0; padding: 20px; }
        .header-note { text-align: center; font-size: 11px; font-weight: 700; color: #64748b; border-bottom: 2px dashed #cbd5e1; padding-bottom: 8px; margin-bottom: 25px; text-transform: uppercase; }
        .lead-title { font-weight: 800; font-size: 14px; color: #0b2450; margin-bottom: 12px; }
        .subject-box { font-weight: 700; font-size: 13.5px; color: #0f172a; margin-bottom: 18px; border-left: 3px solid #0867e8; padding-left: 10px; }
        .p-block { margin-bottom: 14px; text-align: justify; }
        .sig-block { margin-top: 40px; }
        .sig-line { display: inline-block; width: 200px; border-bottom: 1.5px solid #0f172a; margin-bottom: 8px; }
        @media print { .header-note { display: none; } }
      </style>
    </head>
    <body>
      <div class="header-note">[ Place Official Clinic Letterhead in Printer Before Printing ]</div>
      <div class="lead-title">TO WHOMSOEVER IT MAY CONCERN</div>
      <div class="subject-box">Subject: Self-Declaration for Statutory Exemption from Goods and Services Tax (GST)</div>
      <div class="p-block">
        We, <strong>${cName}</strong>, situated at ${cCity}, represented by <strong>${dName}</strong>, hereby solemnly declare, certify, and confirm that:
      </div>
      <div class="p-block">
        1. We are a registered healthcare "Clinical Establishment" engaged in providing bona fide medical healthcare and clinical services.
      </div>
      <div class="p-block">
        2. In accordance with the statutory provisions of <strong>Notification No. 12/2017-Central Tax (Rate) dated 28th June, 2017 (Entry No. 74)</strong> issued by the Ministry of Finance, Department of Revenue, Government of India, healthcare services provided by a clinical establishment, an authorized medical practitioner, or paramedics are <strong>EXEMPT from Goods and Services Tax (NIL rate of GST)</strong>.
      </div>
      <div class="p-block">
        3. In view of the above statutory exemption, the entire turnover of our practice is exempt from GST, and we are not required to obtain GST registration under Section 23 of the CGST Act, 2017, and carry no GSTIN.
      </div>
      <div class="p-block">
        4. This self-declaration is issued to Pine Labs Private Limited ("Plural") and Clinaza Technologies for the purpose of payment gateway merchant underwriting and bank account settlement whitelisting.
      </div>
      <div class="sig-block">
        <p>Sincerely,</p>
        <p><strong>For ${cName}</strong></p>
        <br><br>
        <div class="sig-line"></div><br>
        <strong>Authorized Signatory:</strong> ${dName}<br>
        <strong>Designation:</strong> Medical Director / Proprietor<br>
        <strong>Date:</strong> ${todayFormatted}<br>
        <strong>Place:</strong> ${cCity}<br>
        <em>[Clinic Round Seal & Doctor Stamp]</em>
      </div>
      <script>
        window.onload = function() { setTimeout(function(){ window.print(); }, 200); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
