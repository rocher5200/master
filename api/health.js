export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false });
  try {
    const response = await fetch('https://kmjdujjdtrlnggyjokbb.supabase.co/functions/v1/tripbuy-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'sb_publishable_YikgBFZAz0Lyewzq5CT2Eg_f48UoKXR'
      },
      body: JSON.stringify({ action: 'public_settings' })
    });
    const data = await response.json();
    if (!response.ok || !data?.ok) {
      return res.status(502).json({ ok: false, upstream: response.status });
    }
    return res.status(200).json({
      ok: true,
      api: 'tripbuy-api',
      trip: data.settings?.trip_name || null,
      registration_open: !!data.settings?.registration_open
    });
  } catch (_) {
    return res.status(502).json({ ok: false, upstream: 'unreachable' });
  }
}
