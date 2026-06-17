import { supabase } from '@/lib/supabase';

export interface WhatsAppLogEntry {
  id: string;
  recipientName: string;
  recipientPhone: string;
  templateName: string;
  body: string;
  status: 'sent' | 'delivered' | 'read' | 'replied' | 'failed';
  timestamp: string;
  type: 'campaign' | 'utility' | 'authentication' | 'service';
  direction: 'outbound' | 'inbound';
  wamid: string;
  variables?: string[];
  isMock?: boolean;
}

const getStorageKey = (clinicId: string) => `dental_waba_logs_${clinicId || 'default'}`;

export const getWhatsAppLogs = async (clinicId: string): Promise<WhatsAppLogEntry[]> => {
  if (typeof window === 'undefined') return [];

  // Fallback if no valid clinic ID is loaded yet
  if (!clinicId || clinicId === 'default') {
    const key = getStorageKey(clinicId);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing WhatsApp logs:', e);
      }
    }
    const mockLogs = generateMockLogs();
    localStorage.setItem(key, JSON.stringify(mockLogs));
    return mockLogs;
  }

  // Fetch actual logs from the database table (reactivation_audit_logs)
  try {
    const { data, error } = await supabase
      .from('reactivation_audit_logs')
      .select('*')
      .eq('organization_id', clinicId)
      .eq('action', 'waba_message')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching logs from database:', error.message);
    } else if (data && data.length > 0) {
      return data.map((row: any) => {
        const details = row.details || {};
        return {
          id: row.id,
          recipientName: details.recipientName || 'Patient',
          recipientPhone: details.recipientPhone || '',
          templateName: details.templateName || '',
          body: details.body || '',
          status: details.status || 'sent',
          timestamp: row.created_at,
          type: details.type || 'service',
          direction: details.direction || 'outbound',
          wamid: details.wamid || '',
          variables: details.variables || [],
          isMock: false
        };
      });
    }
  } catch (err) {
    console.error('DB fetch exception, falling back to local storage:', err);
  }

  // Fallback to localStorage if database is empty/inaccessible
  const key = getStorageKey(clinicId);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing local storage WABA logs:', e);
    }
  }

  const mockLogs = generateMockLogs();
  localStorage.setItem(key, JSON.stringify(mockLogs));
  return mockLogs;
};

export const logWhatsAppMessage = async (
  clinicId: string,
  entry: Omit<WhatsAppLogEntry, 'id' | 'wamid' | 'timestamp'>
): Promise<WhatsAppLogEntry | undefined> => {
  if (typeof window === 'undefined') return;

  const wamid = `wamid.HBgMOTE${Math.floor(100000000000 + Math.random() * 900000000000)}FQIAERgSR${Math.random().toString(36).substring(2, 15).toUpperCase()}==`;
  const timestampIso = new Date().toISOString();

  // Create standard local log object
  const newEntry: WhatsAppLogEntry = {
    ...entry,
    id: Math.random().toString(36).substring(2, 9),
    wamid,
    timestamp: timestampIso,
    isMock: false,
  };

  // 1. Save locally to localStorage fallback
  const key = getStorageKey(clinicId);
  try {
    const currentStored = localStorage.getItem(key);
    const currentLogs = currentStored ? JSON.parse(currentStored) : [];
    localStorage.setItem(key, JSON.stringify([newEntry, ...currentLogs]));
  } catch (e) {
    console.error('Error writing WABA log to localStorage:', e);
  }

  // 2. Save globally to Supabase Database (if valid clinicId is active)
  if (clinicId && clinicId !== 'default') {
    try {
      const cleanPhoneKey = entry.recipientPhone.replace(/\D/g, '').slice(-10);
      const { data, error } = await supabase
        .from('reactivation_audit_logs')
        .insert({
          organization_id: clinicId,
          action: 'waba_message',
          patient_id: cleanPhoneKey,
          created_at: timestampIso,
          details: {
            recipientName: entry.recipientName,
            recipientPhone: entry.recipientPhone,
            templateName: entry.templateName,
            body: entry.body,
            status: entry.status,
            type: entry.type,
            direction: entry.direction,
            wamid: wamid,
            variables: entry.variables || []
          }
        })
        .select('*')
        .single();

      if (error) {
        console.error('Database log insert failed:', error.message);
      } else if (data) {
        // Return db entry containing standard UUID id
        return {
          id: data.id,
          recipientName: entry.recipientName,
          recipientPhone: entry.recipientPhone,
          templateName: entry.templateName,
          body: entry.body,
          status: entry.status,
          timestamp: data.created_at,
          type: entry.type,
          direction: entry.direction,
          wamid: wamid,
          variables: entry.variables || [],
          isMock: false
        };
      }
    } catch (err) {
      console.error('Supabase write exception:', err);
    }
  }

  return newEntry;
};

export const updateWhatsAppLogStatus = async (
  clinicId: string,
  wamid: string,
  status: WhatsAppLogEntry['status']
) => {
  if (typeof window === 'undefined') return;

  // 1. Update fallback localStorage logs
  const key = getStorageKey(clinicId);
  try {
    const currentStored = localStorage.getItem(key);
    if (currentStored) {
      const currentLogs = JSON.parse(currentStored) as WhatsAppLogEntry[];
      const updatedLogs = currentLogs.map(log => 
        log.wamid === wamid ? { ...log, status } : log
      );
      localStorage.setItem(key, JSON.stringify(updatedLogs));
    }
  } catch (e) {
    console.error('Local status update failed:', e);
  }

  // 2. Update actual record in Database (if valid clinicId is active)
  if (clinicId && clinicId !== 'default') {
    try {
      // Fetch the log row matching wamid in details
      const { data, error } = await supabase
        .from('reactivation_audit_logs')
        .select('*')
        .eq('organization_id', clinicId)
        .eq('action', 'waba_message')
        .contains('details', { wamid });

      if (error) {
        console.error('Error finding log for status update:', error.message);
      } else if (data && data.length > 0) {
        const row = data[0];
        const updatedDetails = {
          ...(row.details || {}),
          status
        };

        const { error: updateErr } = await supabase
          .from('reactivation_audit_logs')
          .update({ details: updatedDetails })
          .eq('id', row.id);

        if (updateErr) {
          console.error('DB status update error:', updateErr.message);
        }
      }
    } catch (err) {
      console.error('Database update exception:', err);
    }
  }
};

function generateMockLogs(): WhatsAppLogEntry[] {
  const templates = [
    { name: 'appointment_booking_confirmation', type: 'utility' as const },
    { name: 'reactivation_cleaning_offer', type: 'campaign' as const },
    { name: 'follow_up_discount', type: 'campaign' as const },
    { name: 'prescription_pdf_share', type: 'utility' as const },
    { name: 'google_review_request', type: 'campaign' as const },
  ];

  const names = ['Amit Patel', 'Priya Sharma', 'Rajesh Kumar', 'Sneha Reddy', 'Vikram Singh', 'Ananya Sen', 'Karan Johar', 'Neha Gupta'];
  const phones = ['+91 98765 43210', '+91 87654 32109', '+91 76543 21098', '+91 95432 10987', '+91 91234 56789', '+91 98123 45670', '+91 88990 11223', '+91 99001 12233'];
  const statuses: WhatsAppLogEntry['status'][] = ['read', 'replied', 'delivered', 'sent', 'read', 'delivered', 'failed', 'replied'];
  
  const logs: WhatsAppLogEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 24; i++) {
    const timeOffsetHours = i * 2.5 + Math.random() * 2;
    const logTime = new Date(now.getTime() - timeOffsetHours * 60 * 60 * 1000);
    const nameIndex = i % names.length;
    const tempIndex = i % templates.length;
    
    let body = '';
    const name = names[nameIndex];
    const template = templates[tempIndex];

    if (template.name === 'appointment_booking_confirmation') {
      body = `Hello ${name}, this is a confirmation for your appointment on ${logTime.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} at 11:30 AM with Dr. Sharma. Contact +91 75448 60350 for queries.`;
    } else if (template.name === 'reactivation_cleaning_offer') {
      body = `Hi ${name}! 👋 We miss you at Shree Ram Dental Clinic! It's been a while since your last visit. Book a Teeth Cleaning at 20% off this month! Reply BOOK to confirm.`;
    } else if (template.name === 'follow_up_discount') {
      body = `Hi ${name}, did you see our dental checkup offer? 😊 We still have slots available this week. Reply YES to book priority scheduling!`;
    } else if (template.name === 'prescription_pdf_share') {
      body = `Dear ${name}, here is your digitally signed digital prescription PDF from Shree Ram Dental Clinic. Open using standard viewer. Reach out for any questions.`;
    } else {
      body = `Hi ${name}, thank you for visiting us. We hope you had a painless experience! Please share your feedback on Google: https://g.page/r/shreeram-dental/review`;
    }

    logs.push({
      id: `mock-${i}`,
      recipientName: name,
      recipientPhone: phones[nameIndex],
      templateName: template.name,
      body,
      status: statuses[i % statuses.length],
      timestamp: logTime.toISOString(),
      type: template.type,
      direction: 'outbound',
      wamid: `wamid.HBgMOTE${100000000000 + i}FQIAERgSRMOCK${i}==`,
      isMock: true,
    });
  }

  return logs;
}
