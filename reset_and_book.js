import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
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
  
  console.log("Deleting existing appointments and patients for clinic ID:", clinicId);
  
  // 1. Delete all appointments
  const { error: apptDelErr } = await supabase
    .from('dental_appointments')
    .delete()
    .eq('clinic_id', clinicId);
  if (apptDelErr) console.error("Error deleting appointments:", apptDelErr);
  else console.log("Deleted all appointments.");

  // 2. Delete all patients
  const { error: patientDelErr } = await supabase
    .from('dental_patients')
    .delete()
    .eq('clinic_id', clinicId);
  if (patientDelErr) console.error("Error deleting patients:", patientDelErr);
  else console.log("Deleted all patients.");

  // 3. Get Clinic details
  const { data: clinic, error: clinicErr } = await supabase
    .from('dental_clinics')
    .select('*')
    .eq('id', clinicId)
    .single();
  if (clinicErr) {
    console.error("Error fetching clinic details:", clinicErr);
    return;
  }
  console.log("Fetched clinic info:", clinic.name);

  // 4. Generate today's date formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  
  // 5. Insert new patient Kumar
  const newPatientRow = {
    clinic_id: clinicId,
    name: 'Kumar',
    phone: '7292984244',
    service: 'Dental Consultation',
    last_visit: todayStr, // Setting this to today to match savedCustomer.lastVisit in react component
    status: 'Active',
    prescription: '',
    notes: 'Booked automatically via API script'
  };

  const { data: patientData, error: patientInsertErr } = await supabase
    .from('dental_patients')
    .insert(newPatientRow)
    .select()
    .single();

  if (patientInsertErr) {
    console.error("Error inserting patient:", patientInsertErr);
    return;
  }
  
  const savedPatient = patientData;
  console.log("Patient created successfully:", savedPatient);

  // 6. Insert corresponding appointment
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

  const apptRow = {
    clinic_id: clinicId,
    patient_id: savedPatient.id,
    patient_name: savedPatient.name,
    patient_phone: savedPatient.phone,
    appointment_date: todayStr,
    appointment_time: '05:00 PM', // Today 5 PM
    doctor_name: doctorName,
    treatment_name: 'Dental Consultation',
    status: 'Confirmed'
  };

  const { data: apptData, error: apptInsertErr } = await supabase
    .from('dental_appointments')
    .insert(apptRow)
    .select()
    .single();

  if (apptInsertErr) {
    console.error("Error creating appointment:", apptInsertErr);
    return;
  }
  console.log("Appointment created successfully:", apptData);

  // 7. Check if WhatsApp configurations are present to trigger outbound dispatch
  const whatsappPhoneNumberId = clinic.whatsapp_phone_number_id;
  const whatsappAccessToken = clinic.whatsapp_access_token;
  
  if (whatsappPhoneNumberId && whatsappAccessToken) {
    console.log("Sending WhatsApp notification message...");
    const cleanPhone = savedPatient.phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const formattedDateString = new Date(todayStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // Payload for booking template
    const payload = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'template',
      template: {
        name: 'appointment_booking_confirmation',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: savedPatient.name },
              { type: 'text', text: formattedDateString },
              { type: 'text', text: '05:00 PM' },
              { type: 'text', text: doctorName },
              { type: 'text', text: clinic.phone || '+91 75448 60350' }
            ]
          }
        ]
      }
    };

    try {
      const response = await fetch(`https://graph.facebook.com/v17.0/${whatsappPhoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();
      console.log("WhatsApp Graph API response:", resData);
    } catch (fetchErr) {
      console.error("Error delivering WhatsApp Graph message:", fetchErr);
    }
  } else {
    console.log("WhatsApp configs not present on clinic profile - skipping API post.");
  }
}

run();
