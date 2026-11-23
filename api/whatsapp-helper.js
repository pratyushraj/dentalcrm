import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Global CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Determine action from query, url, or path
  const url = req.url || '';
  let action = req.query?.action;
  if (!action) {
    if (url.includes('upload')) action = 'upload';
    else if (url.includes('view-image')) action = 'view-image';
    else if (url.includes('send-message')) action = 'send-message';
  }

  // 1. VIEW IMAGE (GET)
  if (action === 'view-image') {
    const file = req.query?.file;
    if (!file) return res.status(400).send('Missing file parameter');

    try {
      const { data, error } = await supabase.storage.from('creator-assets').download(file);
      if (error) return res.status(404).send('File not found');

      const buffer = Buffer.from(await data.arrayBuffer());
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return res.status(200).send(buffer);
    } catch (err) {
      console.error('view-image crash:', err);
      return res.status(500).send('Internal server error');
    }
  }

  // 2. UPLOAD (POST)
  if (action === 'upload') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end();
    }

    try {
      let body = req.body;
      if (body && typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }
      const { image, pdf, customerId, fileName, wabaPhoneId, wabaToken } = body || {};

      // PDF upload
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

      // Image upload
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

  // 3. SEND MESSAGE (POST - Default)
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  try {
    let body = req.body;
    if (body && typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const { wabaPhoneId, wabaToken, payload } = body || {};
    if (!wabaPhoneId || !wabaToken || !payload) {
      return res.status(400).json({ error: 'Missing wabaPhoneId, wabaToken, or payload' });
    }

    const metaRes = await fetch(`https://graph.facebook.com/v21.0/${wabaPhoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wabaToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const metaData = await metaRes.json();
    if (!metaRes.ok) {
      console.error('Meta API Error:', JSON.stringify(metaData));
      return res.status(200).json({ ok: false, error: metaData });
    }

    return res.status(200).json({ ok: true, ...metaData });
  } catch (err) {
    console.error('send-message crash:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
