const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('./supabase');

const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-me';

function extractBearer(req) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return null;
  return token;
}

async function requireUser(req, res, next) {
  const token = extractBearer(req);
  if (!token) return res.status(401).json({ error: 'Missing bearer token' });

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: 'Invalid token' });

  req.user = data.user;

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role,status')
    .eq('user_id', data.user.id)
    .maybeSingle();

  req.profile = profile || null;
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.profile || !roles.includes(req.profile.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

function signAdminToken() {
  return jwt.sign({ role: 'admin', scope: 'dashboard' }, jwtSecret, { expiresIn: '8h' });
}

function requireAdminToken(req, res, next) {
  const token = extractBearer(req);
  if (!token) return res.status(401).json({ error: 'Missing admin token' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.admin = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid admin token' });
  }
}

module.exports = { requireUser, requireRole, signAdminToken, requireAdminToken };
