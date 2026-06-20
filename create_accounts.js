import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const accountsToCreate = [
  {
    email: 'shreeram@dentalcare.com',
    password: 'ShreeRamSecurePass123!',
    firstName: 'Dr. Ram',
    businessName: 'Shree Ram Dental Care',
    phone: '+917544860350'
  },
  {
    email: 'yourdentistpatna@gmail.com',
    password: 'yourdentist',
    firstName: 'Dr. Sharma',
    businessName: 'Your Dentist',
    phone: '+919876543210'
  }
];

async function setupAccount(acc) {
  console.log(`Setting up account: ${acc.businessName} (${acc.email})...`);

  // 1. Delete existing user if exists to avoid conflicts
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError);
    return;
  }

  const existingUser = users.find(u => u.email === acc.email);
  if (existingUser) {
    console.log(`Found existing user with ID ${existingUser.id}. Deleting to recreate...`);
    const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
    if (deleteError) {
      console.error(`Failed to delete user:`, deleteError);
    }
  }

  // 2. Create the user using Auth Admin API
  const { data: authData, error: createError } = await supabase.auth.admin.createUser({
    email: acc.email,
    password: acc.password,
    email_confirm: true,
    user_metadata: {
      first_name: acc.firstName,
      business_name: acc.businessName,
      role: 'dentist'
    }
  });

  if (createError || !authData.user) {
    console.error(`Failed to create user:`, createError);
    return;
  }

  const userId = authData.user.id;
  const orgId = crypto.randomUUID();
  console.log(`User created successfully. UserID: ${userId}, OrgID/ClinicID: ${orgId}`);

  // 3. Update the profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      first_name: acc.firstName,
      business_name: acc.businessName,
      role: 'dentist',
      onboarding_complete: true,
      phone: acc.phone,
      organization_id: orgId
    })
    .eq('id', userId);

  if (profileError) {
    console.error(`Error updating profile:`, profileError);
  } else {
    console.log(`Profile updated.`);
  }

  // 4. Ensure dental_clinics entry exists
  const { data: existingClinic } = await supabase
    .from('dental_clinics')
    .select('*')
    .eq('id', orgId)
    .single();

  if (!existingClinic) {
    const { error: clinicInsertErr } = await supabase
      .from('dental_clinics')
      .insert({
        id: orgId,
        name: acc.businessName,
        owner_id: userId,
        doctor_name: acc.firstName,
        phone: acc.phone,
        email: acc.email
      });

    if (clinicInsertErr) {
      console.error(`Error inserting dental clinic:`, clinicInsertErr);
    } else {
      console.log(`Dental clinic record created.`);
    }
  }

  return {
    email: acc.email,
    password: acc.password,
    clinicName: acc.businessName,
    clinicId: orgId,
    userId: userId
  };
}

async function run() {
  const results = [];
  for (const acc of accountsToCreate) {
    try {
      const res = await setupAccount(acc);
      if (res) results.push(res);
    } catch (err) {
      console.error(`Exception during account creation for ${acc.email}:`, err);
    }
  }

  if (results.length > 0) {
    const credsPath = '/Users/pratyushraj/Desktop/dental-crm/dentist_credentials.json';
    fs.writeFileSync(credsPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`\nCredentials saved locally to ${credsPath}`);

    // Create a plain text version for easier reading
    const textCreds = results.map(r => 
      `Clinic: ${r.clinicName}\nEmail: ${r.email}\nPassword: ${r.password}\nClinic ID: ${r.clinicId}\n`
    ).join('\n----------------------------------------\n');
    fs.writeFileSync('/Users/pratyushraj/Desktop/dental-crm/dentist_credentials.txt', textCreds, 'utf-8');
  }
}

run();
