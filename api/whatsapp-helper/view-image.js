import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://sqqocqujxlgoxbcnfbfb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  const { file } = req.query;
  if (!file) return res.status(400).send('Missing file parameter');

  try {
    const { data, error } = await supabase.storage.from('creator-assets').download(file);
    if (error) return res.status(404).send('File not found');

    const buffer = Buffer.from(await data.arrayBuffer());
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    return res.status(200).send(buffer);
  } catch (err) {
    return res.status(500).send('Internal server error');
  }
}
