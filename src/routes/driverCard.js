import { Router } from 'express';
import { getDriver } from '../repositories/driversRepo.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/:driverId', async (req, res) => {
  const { driverId } = req.params;

  if (!/^[0-9a-f-]{36}$/i.test(driverId)) {
    return res.status(400).send('Invalid driver ID');
  }

  let driver;
  try {
    driver = await getDriver(driverId);
  } catch (err) {
    logger.warn({ driverId, err: err.message }, 'Driver card lookup failed');
    return res.status(404).send(notFoundHtml());
  }

  if (!driver) return res.status(404).send(notFoundHtml());

  res.type('text/html').send(driverCardHtml(driver));
});

function initials(name) {
  return (name || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

function driverCardHtml(driver) {
  const ini = initials(driver.name);
  const zone = (driver.zone || 'unknown').replace(/^\w/, c => c.toUpperCase());
  const payBtn = driver.payment_url
    ? `<a class="btn btn-pay" href="${escHtml(driver.payment_url)}" target="_blank" rel="noopener">
         💳 Pay ${escHtml(driver.name.split(' ')[0])}
       </a>`
    : `<p class="no-pay">Payment link not set up yet.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(driver.name)} — City Bucket List Driver</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #080e1a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: #111827;
      border: 1px solid #1e2d44;
      border-radius: 16px;
      padding: 36px 28px 32px;
      max-width: 340px;
      width: 100%;
      text-align: center;
    }
    .logo {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: .04em;
      color: #22d3ee;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    .avatar {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0891b2, #22d3ee);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 800;
      margin: 0 auto 16px;
      color: #080e1a;
    }
    .name { font-size: 24px; font-weight: 800; letter-spacing: -.02em; margin-bottom: 6px; }
    .zone { font-size: 13px; color: #94a3b8; margin-bottom: 28px; }
    .verified {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #10b981;
      background: rgba(16,185,129,.1);
      border: 1px solid rgba(16,185,129,.25);
      padding: 5px 12px;
      border-radius: 20px;
      margin-bottom: 28px;
    }
    .divider { border: none; border-top: 1px solid #1e2d44; margin: 0 0 24px; }
    .section-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      color: #475569;
      margin-bottom: 12px;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 14px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      margin-bottom: 12px;
      transition: opacity .15s;
    }
    .btn:last-child { margin-bottom: 0; }
    .btn:hover { opacity: .85; }
    .btn-call {
      background: rgba(34,211,238,.12);
      border: 1px solid rgba(34,211,238,.3);
      color: #22d3ee;
    }
    .btn-pay {
      background: rgba(16,185,129,.12);
      border: 1px solid rgba(16,185,129,.3);
      color: #10b981;
    }
    .no-pay { font-size: 13px; color: #475569; }
    .footer { font-size: 11px; color: #334155; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">City Bucket List</div>
    <div class="avatar">${ini}</div>
    <div class="name">${escHtml(driver.name)}</div>
    <div class="zone">${zone} Zone</div>
    <div class="verified">✓ Verified Driver</div>
    <hr class="divider">
    <div class="section-label">Book a Ride</div>
    <a class="btn btn-call" href="tel:${escHtml(env.TWILIO_PHONE_NUMBER)}">📞 Call to Book a Ride</a>
    <hr class="divider" style="margin-top:24px">
    <div class="section-label">Payment</div>
    ${payBtn}
    <div class="footer">City Bucket List · Ride Service</div>
  </div>
</body>
</html>`;
}

function notFoundHtml() {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Not Found</title>
  <style>body{font-family:system-ui,sans-serif;background:#080e1a;color:#94a3b8;display:flex;align-items:center;justify-content:center;min-height:100vh;}</style>
  </head><body><p>Driver not found.</p></body></html>`;
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default router;
