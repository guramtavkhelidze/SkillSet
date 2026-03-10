const crypto = require('crypto');

function hash(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const PIXEL_ID = '1345600840707171';
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

  if (!ACCESS_TOKEN) {
    return res.status(500).json({ error: 'META_ACCESS_TOKEN not configured' });
  }

  const { event_name, event_time, event_id, event_source_url, user_data } = req.body;

  const userData = {
    client_ip_address: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
    client_user_agent: req.headers['user-agent'] || undefined,
  };

  if (user_data?.em) userData.em = hash(user_data.em);
  if (user_data?.ph) userData.ph = hash(user_data.ph.replace(/\D/g, ''));
  if (user_data?.fbp) userData.fbp = user_data.fbp;
  if (user_data?.fbc) userData.fbc = user_data.fbc;

  const payload = {
    data: [{
      event_name: event_name || 'Lead',
      event_time: event_time || Math.floor(Date.now() / 1000),
      event_id: event_id,
      event_source_url: event_source_url,
      action_source: 'website',
      user_data: userData,
    }],
    access_token: ACCESS_TOKEN,
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    const result = await response.json();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
