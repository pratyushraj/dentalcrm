import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') { res.setHeader('Allow', ['POST']); return res.status(405).end(); }

  try {
    const { image, pdf, customerId, fileName, wabaPhoneId, wabaToken } = req.body;

    // ── PDF upload ─────────────────────────────────────────────────────────
    if (pdf) {
      const base64Data = pdf.replace(/^data:application\/pdf;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const uniqueFileName = `prescriptions/${fileName || `Rx_${customerId || Date.now()}_${Date.now()}.pdf`}`;

      const { error: uploadError } = await supabase.storage
        .from('creator-assets')
        .upload(uniqueFileName, buffer, { contentType: 'application/pdf', upsert: true });

      if (uploadError) return res.status(500).json({ error: 'Failed to upload PDF', details: uploadError.message });

      const { data: { publicUrl } } = supabase.storage.from('creator-assets').getPublicUrl(uniqueFileName);
      return res.status(200).json({ publicUrl });
    }

    // ── Image upload ───────────────────────────────────────────────────────
    if (!image) return res.status(400).json({ error: 'Missing image or pdf parameter' });

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const uniqueFileName = `estimates/ba_photo_${customerId || Date.now()}_${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('creator-assets')
      .upload(uniqueFileName, buffer, { contentType: 'image/jpeg', upsert: true });

    let publicUrl = null;
    if (!uploadError) {
      const { data } = supabase.storage.from('creator-assets').getPublicUrl(uniqueFileName);
      publicUrl = data.publicUrl;
    }

    let mediaId = null;
    if (wabaPhoneId && wabaToken) {
      try {
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        const form = new FormData();
        form.append('messaging_product', 'whatsapp');
        form.append('type', 'image/jpeg');
        form.append('file', blob, 'smile_gallery.jpg');

        const metaRes = await fetch(`https://graph.facebook.com/v21.0/${wabaPhoneId}/media`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${wabaToken}` },
          body: form
        });
        const metaData = await metaRes.json();
        if (metaRes.ok && metaData.id) mediaId = metaData.id;
      } catch (metaErr) {
        console.error('Meta media upload error:', metaErr.message);
      }
    }

    return res.status(200).json({ publicUrl, mediaId, filePath: uniqueFileName });
  } catch (err) {
    console.error('Upload handler crash:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
