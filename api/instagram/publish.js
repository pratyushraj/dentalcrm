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
    const { image, caption, instagramAccountId, accessToken, patientId, clinicId, simulate } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Missing image parameter' });
    }

    // 1. Upload base64 image to Supabase Storage in 'creator-assets' bucket
    console.log('Uploading B&A image to Supabase Storage...');
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const uniqueFileName = `instagram-posts/post_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('creator-assets')
      .upload(uniqueFileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload image to storage', details: uploadError.message });
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('creator-assets')
      .getPublicUrl(uniqueFileName);

    console.log('Uploaded successfully. Public URL:', publicUrl);

    const activeAccId = instagramAccountId || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    const activeToken = accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;

    const shouldSimulate = simulate || !activeAccId || !activeToken || activeAccId === 'mock_id' || activeToken === 'mock_token';

    let mediaId = null;

    if (shouldSimulate) {
      console.log('Running in SIMULATION mode...');
      // Simulate API latency
      await new Promise(r => setTimeout(r, 1500));
      mediaId = `sim_ig_${Date.now()}`;
    } else {
      console.log(`Publishing to Instagram Business Account: ${activeAccId}...`);
      
      // Step A: Create container
      const containerUrl = `https://graph.facebook.com/v19.0/${activeAccId}/media`;
      const containerRes = await fetch(containerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          image_url: publicUrl,
          caption: caption || ''
        })
      });

      const containerData = await containerRes.json();
      if (!containerRes.ok || !containerData.id) {
        console.error('Meta Graph API media container creation failed:', containerData);
        return res.status(containerRes.status || 400).json({
          error: 'Meta Container creation failed',
          details: containerData
        });
      }

      const creationId = containerData.id;
      console.log(`Media container created successfully. ID: ${creationId}`);

      // Step B: Publish media
      const publishUrl = `https://graph.facebook.com/v19.0/${activeAccId}/media_publish`;
      const publishRes = await fetch(publishUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          creation_id: creationId
        })
      });

      const publishData = await publishRes.json();
      if (!publishRes.ok || !publishData.id) {
        console.error('Meta Graph API media publication failed:', publishData);
        return res.status(publishRes.status || 400).json({
          error: 'Meta Media publish failed',
          details: publishData
        });
      }

      mediaId = publishData.id;
      console.log(`Published successfully to Instagram. Media ID: ${mediaId}`);
    }

    // 2. Audit Log to reactivation_audit_logs if patientId/clinicId available
    if (patientId && clinicId && clinicId !== 'default') {
      console.log(`Creating audit log for Instagram post. Patient: ${patientId}`);
      await supabase
        .from('reactivation_audit_logs')
        .insert({
          organization_id: clinicId,
          action: 'instagram_post',
          patient_id: patientId,
          details: {
            caption: caption,
            imageUrl: publicUrl,
            instagramMediaId: mediaId,
            status: 'published',
            direction: 'outbound',
            type: 'social',
            simulated: shouldSimulate
          }
        });
    }

    return res.status(200).json({
      success: true,
      mediaId,
      imageUrl: publicUrl,
      simulated: shouldSimulate
    });

  } catch (err) {
    console.error('Instagram publish handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
