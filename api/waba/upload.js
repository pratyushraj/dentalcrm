import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client with Service Role Key for backend administration
const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { image, customerId } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Missing image parameter' });
    }

    console.log('Uploading B&A photo to Supabase storage via backend admin...');
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const uniqueFileName = `estimates/ba_photo_${customerId || Date.now()}_${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('creator-assets')
      .upload(uniqueFileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase admin upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload image', details: uploadError.message });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('creator-assets')
      .getPublicUrl(uniqueFileName);

    console.log('Admin upload successful. Public URL:', publicUrl);
    return res.status(200).json({ publicUrl });
  } catch (err) {
    console.error('Admin upload handler crash:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
