import env from '../config/env.js';

// HTTP Basic Auth guard for /dashboard routes.
// If DASHBOARD_PASSWORD is not set, access is unrestricted (dev-friendly).
// Set DASHBOARD_USER + DASHBOARD_PASSWORD in production.
export function dashboardAuth(req, res, next) {
  if (!env.DASHBOARD_PASSWORD) return next();

  const authHeader = req.headers.authorization ?? '';
  if (!authHeader.startsWith('Basic ')) return challenge(res);

  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
  const colon = decoded.indexOf(':');
  const user = decoded.slice(0, colon);
  const pass = decoded.slice(colon + 1);

  if (user === env.DASHBOARD_USER && pass === env.DASHBOARD_PASSWORD) return next();
  return challenge(res);
}

function challenge(res) {
  res.set('WWW-Authenticate', 'Basic realm="City Bucket List Dashboard"');
  res.status(401).send('Unauthorized');
}
