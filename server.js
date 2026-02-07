require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { supabaseAdmin } = require('./services/supabase');
const { requireUser, requireRole, signAdminToken, requireAdminToken } = require('./services/auth');
const { cloudinary } = require('./services/cloudinary');

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 40 * 1024 * 1024 } });

const corsOrigins = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: corsOrigins.length ? corsOrigins : true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/apps', express.static(path.join(__dirname, 'apps')));

app.get('/', (_req, res) => res.redirect('/apps/storefront'));

function requestCode() {
  return `HUB-REQ-${Math.floor(1000 + Math.random() * 9000)}`;
}

async function ensureSeedData() {
  const { count } = await supabaseAdmin.from('influencers').select('*', { count: 'exact', head: true });
  if (count && count > 0) return;

  const demos = [
    ['maya-bites', 'Maya Bites', 'Food', 'Kingston', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'],
    ['fitjay', 'Fit Jay', 'Fitness', 'Los Angeles', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'],
    ['beautybyk', 'BeautyByK', 'Beauty', 'New York', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'],
    ['techwithrio', 'Tech with Rio', 'Tech', 'Toronto', 'https://images.pexels.com/photos/12433030/pexels-photo-12433030.jpeg?auto=compress&cs=tinysrgb&w=400'],
    ['traveltoni', 'Travel Toni', 'Travel', 'London', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'],
    ['glowwithni', 'Glow with Ni', 'Beauty', 'Miami', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'],
    ['bytebella', 'ByteBella', 'Tech', 'San Francisco', 'https://images.pexels.com/photos/7481981/pexels-photo-7481981.jpeg?auto=compress&cs=tinysrgb&w=400']
  ];

  const rows = demos.map(([handle, display_name, niche, location], idx) => ({
    user_id: null,
    handle,
    display_name,
    bio: `${display_name} creates premium ${niche.toLowerCase()} content with measurable campaign outcomes.`,
    niche,
    location,
    platforms: { instagram: `@${handle}`, tiktok: `@${handle}` },
    followers_count: 25000 + idx * 4200,
    engagement_rate: (2.4 + idx * 0.17).toFixed(2),
    avg_views: 12000 + idx * 1300,
    rate_min: 250 + idx * 40,
    rate_max: 900 + idx * 90,
    pricing_notes: 'Packages available for UGC, short-form video, and monthly retainers.',
    content_types: ['Reels', 'UGC', 'Story'],
    audience_regions: ['Caribbean', 'North America'],
    verified: idx % 3 === 0,
    profile_image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    cover_video_url: null,
    portfolio_media: [{ type: 'image', url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg' }],
    plan_tier: idx % 4 === 0 ? 'pro' : 'starter'
  }));

  await supabaseAdmin.from('influencers').insert(rows);
}

app.get('/api/public/influencers', async (req, res) => {
  try {
    const { query, niche, platform, minFollowers, maxRate, sort } = req.query;
    let q = supabaseAdmin.from('influencers').select('*').order('created_at', { ascending: false });

    if (query) q = q.or(`display_name.ilike.%${query}%,bio.ilike.%${query}%,handle.ilike.%${query}%`);
    if (niche) q = q.eq('niche', niche);
    if (minFollowers) q = q.gte('followers_count', Number(minFollowers));
    if (maxRate) q = q.lte('rate_max', Number(maxRate));
    if (platform) q = q.not(`platforms->>${platform}`, 'is', null);

    if (sort === 'followers_desc') q = q.order('followers_count', { ascending: false });
    if (sort === 'rate_asc') q = q.order('rate_min', { ascending: true });
    if (sort === 'engagement_desc') q = q.order('engagement_rate', { ascending: false });

    const { data, error } = await q.limit(60);
    if (error) throw error;
    res.json({ influencers: data || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/public/influencers/:handle', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('influencers').select('*').eq('handle', req.params.handle).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  return res.json({ influencer: data });
});

app.post('/api/brand/shortlist', requireUser, requireRole('brand'), async (req, res) => {
  const { influencerUserId, action = 'add' } = req.body;
  if (!influencerUserId) return res.status(400).json({ error: 'influencerUserId required' });

  if (action === 'remove') {
    const { error } = await supabaseAdmin.from('shortlists').delete().eq('brand_user_id', req.user.id).eq('influencer_user_id', influencerUserId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  const { error } = await supabaseAdmin.from('shortlists').upsert({ brand_user_id: req.user.id, influencer_user_id: influencerUserId }, { onConflict: 'brand_user_id,influencer_user_id' });
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

app.get('/api/brand/shortlist', requireUser, requireRole('brand'), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('shortlists')
    .select('id,created_at,influencer_user_id,influencers(*)')
    .eq('brand_user_id', req.user.id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ shortlist: data || [] });
});

app.post('/api/brand/requests', requireUser, requireRole('brand'), async (req, res) => {
  const { influencerUserIds = [], campaignName, message, budget, deliverables, deadline, channel } = req.body;
  if (!Array.isArray(influencerUserIds) || !influencerUserIds.length) {
    return res.status(400).json({ error: 'influencerUserIds required' });
  }

  const rows = influencerUserIds.map((influencerUserId) => ({
    request_id: requestCode(),
    brand_user_id: req.user.id,
    influencer_user_id: influencerUserId,
    campaign_name: campaignName,
    message,
    budget,
    deliverables,
    deadline,
    channel
  }));

  const { data, error } = await supabaseAdmin.from('requests').insert(rows).select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ created: data });
});

app.get('/api/brand/requests', requireUser, requireRole('brand'), async (req, res) => {
  const { data, error } = await supabaseAdmin.from('requests').select('*').eq('brand_user_id', req.user.id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ requests: data || [] });
});

app.get('/api/influencer/me', requireUser, requireRole('influencer'), async (req, res) => {
  const { data, error } = await supabaseAdmin.from('influencers').select('*').eq('user_id', req.user.id).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ profile: data });
});

app.post('/api/influencer/profile', requireUser, requireRole('influencer'), async (req, res) => {
  const payload = { ...req.body, user_id: req.user.id, updated_at: new Date().toISOString() };
  const { data, error } = await supabaseAdmin.from('influencers').upsert(payload, { onConflict: 'user_id' }).select('*').single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ profile: data });
});

app.post('/api/media/upload', requireUser, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file is required' });

  const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
  const folderTemplate = process.env.CLOUDINARY_FOLDER || 'influencerhub/{userId}';
  const folder = folderTemplate.replace('{userId}', req.user.id);

  try {
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder, resource_type: resourceType }, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
      stream.end(req.file.buffer);
    });

    res.json({ secure_url: uploaded.secure_url, public_id: uploaded.public_id, resource_type: uploaded.resource_type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/influencer/requests', requireUser, requireRole('influencer'), async (req, res) => {
  const { data, error } = await supabaseAdmin.from('requests').select('*').eq('influencer_user_id', req.user.id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ requests: data || [] });
});

app.post('/api/influencer/requests/:id/status', requireUser, requireRole('influencer'), async (req, res) => {
  const { status } = req.body;
  const { data, error } = await supabaseAdmin
    .from('requests')
    .update({ status })
    .eq('id', req.params.id)
    .eq('influencer_user_id', req.user.id)
    .select('*')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ request: data });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return res.json({ token: signAdminToken() });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/admin/summary', requireAdminToken, async (_req, res) => {
  const [influencers, brands, requests, todayRequests] = await Promise.all([
    supabaseAdmin.from('influencers').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('brands').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('requests').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('requests').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().slice(0, 10))
  ]);

  const { data: nicheData } = await supabaseAdmin.from('influencers').select('niche');
  const nicheCount = (nicheData || []).reduce((acc, row) => {
    acc[row.niche] = (acc[row.niche] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totals: {
      influencers: influencers.count || 0,
      brands: brands.count || 0,
      requests: requests.count || 0,
      requestsToday: todayRequests.count || 0
    },
    topNiches: Object.entries(nicheCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
  });
});

app.get('/api/admin/influencers', requireAdminToken, async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('influencers').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ influencers: data || [] });
});

app.get('/api/admin/brands', requireAdminToken, async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('brands').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ brands: data || [] });
});

app.get('/api/admin/requests', requireAdminToken, async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('requests').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ requests: data || [] });
});

app.patch('/api/admin/influencers/:id/status', requireAdminToken, async (req, res) => {
  const { status = 'disabled' } = req.body;
  const { data, error } = await supabaseAdmin.from('influencers').update({ status }).eq('id', req.params.id).select('*').single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ influencer: data });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = Number(process.env.PORT || 8080);
app.listen(port, async () => {
  console.log(`InfluencerHub listening on :${port}`);
  try {
    await ensureSeedData();
    console.log('Seed check complete');
  } catch (error) {
    console.warn('Seed skipped:', error.message);
  }
});
