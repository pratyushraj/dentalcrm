import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const clinicId = 'fd9f532d-10c2-4429-8b1b-e2694314f373';
  
  // 1. Fetch Kumar patient
  const { data: patients, error: findError } = await supabase
    .from('dental_patients')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('name', 'Kumar');

  if (findError || !patients || patients.length === 0) {
    console.error("Could not find patient Kumar:", findError);
    return;
  }
  
  const patient = patients[0];
  console.log("Found patient:", patient.name, "(ID:", patient.id, ")");

  // 2. Read and encode photos to Base64
  const artifactsDir = '/Users/pratyushraj/.gemini/antigravity/brain/a49124f2-2183-40c4-aad6-5130cf2ec658';
  const dpPath = path.join(artifactsDir, 'diastema_makeover_1781763316265.png');
  const beforeImgPath = path.join(artifactsDir, 'media__1781763000877.jpg');
  const afterImgPath = path.join(artifactsDir, 'media__1781763017854.jpg');

  let dpBase64 = null;
  let beforeBase64 = null;
  let afterBase64 = null;

  try {
    if (fs.existsSync(dpPath)) {
      dpBase64 = `data:image/png;base64,${fs.readFileSync(dpPath, 'base64')}`;
    }
    if (fs.existsSync(beforeImgPath)) {
      beforeBase64 = `data:image/jpeg;base64,${fs.readFileSync(beforeImgPath, 'base64')}`;
    }
    if (fs.existsSync(afterImgPath)) {
      afterBase64 = `data:image/jpeg;base64,${fs.readFileSync(afterImgPath, 'base64')}`;
    }
  } catch (e) {
    console.error("Failed to read image files:", e);
  }

  // 3. Define Prescription and Estimates (Billing)
  const prescriptionText = `• Tab. Amoxicillin 500mg - 1 cap thrice daily for 5 days\n• Tab. Paracetamol 650mg - 1 tab SOS for pain`;
  const billingEstimates = [
    {
      id: `est_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      items: [
        { tooth: 11, procedure: "Dental Consultation & Diagnostics", cost: 500, isCosmetic: false },
        { tooth: 12, procedure: "Direct Composite Veneer/Restoration", cost: 3500, isCosmetic: true }
      ],
      discount: 10,
      tax: 0,
      grandTotal: 3600,
      status: 'Approved'
    }
  ];

  // 4. Update the database patient record
  const updateData = {
    profile_photo: dpBase64,
    before_photo: beforeBase64,
    after_photo: afterBase64,
    prescription: prescriptionText,
    estimates: billingEstimates
  };

  const { data: updatedPatient, error: updateError } = await supabase
    .from('dental_patients')
    .update(updateData)
    .eq('id', patient.id)
    .select()
    .single();

  if (updateError) {
    console.error("Error updating patient details:", updateError);
    return;
  }
  console.log("Updated patient record successfully!");

  // 5. Generate and send PDF confirmation via WhatsApp API
  const { data: clinic } = await supabase
    .from('dental_clinics')
    .select('*')
    .eq('id', clinicId)
    .single();

  if (!clinic || !clinic.whatsapp_phone_number_id || !clinic.whatsapp_access_token) {
    console.warn("WhatsApp credentials not present on clinic config.");
    return;
  }

  const wabaPhoneId = clinic.whatsapp_phone_number_id;
  const wabaToken = clinic.whatsapp_access_token;
  const cleanPhone = patient.phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  let doctorName = 'Doctor';
  if (clinic.owner_id) {
    const { data: ownerProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', clinic.owner_id)
      .single();
    if (ownerProfile) {
      doctorName = `${ownerProfile.first_name || ''} ${ownerProfile.last_name || ''}`.trim() || 'Doctor';
    }
  }

    console.log("Generating jsPDF document inside Node...");
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
    const W = doc.internal.pageSize.getWidth();
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // Primary Premium Palette
    const PRIMARY_TEAL = [13, 148, 136]; // Modern premium teal
    const TEXT_DARK = [15, 23, 42]; // Slate-900
    const TEXT_MUTED = [100, 116, 139]; // Slate-500
    const ACCENT_GOLD = [217, 119, 6]; // Amber-600
    const BG_LIGHT = [248, 250, 252]; // Slate-50
    const BORDER_LIGHT = [226, 232, 240]; // Slate-200

    // Top Brand Accent Bars
    doc.setFillColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.rect(0, 0, W, 14, 'F');
    doc.setFillColor(ACCENT_GOLD[0], ACCENT_GOLD[1], ACCENT_GOLD[2]);
    doc.rect(0, 14, W, 1.5, 'F');

    // Header Title
    doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(clinic.name || 'Shree Ram Dental Clinic', 20, 32);

    // Doctor & Details
    doc.setFontSize(11);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`Dr. ${doctorName}`, 20, 39);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(clinic.timings_note || 'B.D.S., M.D.S. | Dental Specialist & Implantologist', 20, 44);

    // Contact details on the right
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Ph: ${clinic.phone || '+91 75448 60350'}`, W - 20, 32, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.setFontSize(9);
    doc.text(clinic.email || 'care@shreeramdental.in', W - 20, 38, { align: 'right' });
    if (clinic.address) {
      const addrLines = doc.splitTextToSize(clinic.address, 65);
      doc.text(addrLines, W - 20, 43, { align: 'right' });
    }

    // Divider Line
    doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 54, W - 20, 54);

    // Patient Information Card (Styled box)
    doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
    doc.rect(20, 59, W - 40, 24, 'F');
    doc.rect(20, 59, W - 40, 24, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('PATIENT INFO', 25, 65);
    doc.text('CONSULTATION DETAILS', 125, 65);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(patient.name, 25, 71);
    doc.text(today, 125, 71);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`Mobile: ${patient.phone}`, 25, 77);
    doc.text('Status: Confirmed Visit', 125, 77);

    // Rx prescription block
    doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('Rx', 20, 102);

    doc.setDrawColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.setLineWidth(0.8);
    doc.line(34, 100, W - 20, 100);

    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PRESCRIBED MEDICATIONS & DOSAGE INSTRUCTIONS', 20, 110);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    
    const rxLinesFormatted = prescriptionText.split('\n');
    let currentY = 118;
    rxLinesFormatted.forEach((line) => {
      doc.text(line, 22, currentY);
      currentY += 6.5;
    });

    currentY += 6;

    // Treatment bill details
    doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
    doc.setLineWidth(0.5);
    doc.line(20, currentY, W - 20, currentY);
    currentY += 8;

    doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Treatment Invoice Summary', 20, currentY);
    currentY += 6;

    // Table Header
    doc.setFillColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.rect(20, currentY, W - 40, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('PROCEDURE / DESCRIPTION', 25, currentY + 5.5);
    doc.text('TOOTH', 115, currentY + 5.5);
    doc.text('AMOUNT (INR)', 155, currentY + 5.5);

    currentY += 8;
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);

    billingEstimates[0].items.forEach((item, index) => {
      if (index % 2 === 1) {
        doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
        doc.rect(20, currentY, W - 40, 8, 'F');
      }
      doc.text(item.procedure, 25, currentY + 5.5);
      doc.text(item.tooth ? `Tooth ${item.tooth}` : '-', 115, currentY + 5.5);
      doc.text(`Rs. ${item.cost.toLocaleString('en-IN')}`, 155, currentY + 5.5);
      currentY += 8;
    });

    doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
    doc.line(20, currentY, W - 20, currentY);
    currentY += 6;

    // Summary Totals
    const subtotal = billingEstimates[0].items.reduce((sum, item) => sum + item.cost, 0);
    const discAmount = (subtotal * billingEstimates[0].discount) / 100;
    const finalAmount = subtotal - discAmount;

    doc.setFontSize(9);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`Subtotal:`, 125, currentY);
    doc.text(`Rs. ${subtotal.toLocaleString('en-IN')}`, 190, currentY, { align: 'right' });

    currentY += 5;
    doc.text(`Concession (${billingEstimates[0].discount}%):`, 125, currentY);
    doc.text(`- Rs. ${discAmount.toLocaleString('en-IN')}`, 190, currentY, { align: 'right' });

    currentY += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(PRIMARY_TEAL[0], PRIMARY_TEAL[1], PRIMARY_TEAL[2]);
    doc.text(`Final Paid Amount:`, 125, currentY);
    doc.text(`Rs. ${finalAmount.toLocaleString('en-IN')}`, 190, currentY, { align: 'right' });

    // Footer signature & details
    const footerY = 268;
    doc.setDrawColor(BORDER_LIGHT[0], BORDER_LIGHT[1], BORDER_LIGHT[2]);
    doc.setLineWidth(0.5);
    doc.line(20, footerY - 15, W - 20, footerY - 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('This is a digitally generated patient consultation summary & billing receipt.', 20, footerY - 5);
    doc.text(`${clinic.name || 'Shree Ram Dental Clinic'} · Thank you for letting us care for your smile.`, 20, footerY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text("Doctor's Signature", 145, footerY - 5);
    doc.line(145, footerY - 1, 190, footerY - 1);

    const pdfBuffer = doc.output('arraybuffer');
    const uniqueFileName = `prescriptions/Rx_Estimate_${patient.id}_${Date.now()}.pdf`;

    console.log("Uploading PDF to Supabase storage...");
    const { error: uploadError } = await supabase.storage
      .from('creator-assets')
      .upload(uniqueFileName, Buffer.from(pdfBuffer), {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('creator-assets')
      .getPublicUrl(uniqueFileName);

    console.log("PDF uploaded. Public URL:", publicUrl);

    // Send payload sharing PDF
    const payload = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'template',
      template: {
        name: 'prescription_pdf_share',
        language: { code: 'en' },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'document',
                document: {
                  link: publicUrl,
                  filename: `Rx_Estimate_Kumar.pdf`
                }
              }
            ]
          },
          {
            type: 'body',
            parameters: [
              { type: 'text', text: 'Kumar' }
            ]
          }
        ]
      }
    };

    console.log("Dispatching to WhatsApp Graph API...");
    const apiRes = await fetch(`https://graph.facebook.com/v17.0/${wabaPhoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wabaToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const apiData = await apiRes.json();
    console.log("WhatsApp Graph API PDF response:", apiData);
  } catch (pdfErr) {
    console.error("Failed to generate/upload/send PDF:", pdfErr);
  }
}

run();
