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
