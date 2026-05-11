import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { dashboardAuth } from '../middleware/dashboardAuth.js';
import { listDriversFull, getDriver } from '../repositories/driversRepo.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PREVIEW_HTML = join(__dirname, '../../dashboard-preview.html');

const router = Router();
router.use(dashboardAuth);

// ── Serve the static preview dashboard ───────────────────────────────────────

router.get('/', (req, res) => {
  res.type('text/html').send(readFileSync(PREVIEW_HTML, 'utf8'));
});

// ── Live driver list with QR buttons ─────────────────────────────────────────

router.get('/drivers', async (req, res) => {
  let drivers = [];
  try {
    drivers = await listDriversFull();
  } catch (err) {
    logger.error({ err }, 'Failed to list drivers for dashboard');
  }

  const rows = drivers.map(d => {
    const cardUrl = `${env.PUBLIC_BASE_URL}/d/${d.id}`;
    const ini = initials(d.name);
    const avail = d.is_available
      ? `<span class="chip chip-avail">Available</span>`
      : `<span class="chip chip-trip">On Trip</span>`;
    return `
    <tr>
      <td><div class="avatar-sm">${escHtml(ini)}</div></td>
      <td class="td-name">${escHtml(d.name)}</td>
      <td>${escHtml(d.zone)}</td>
      <td>${escHtml(d.phone)}</td>
      <td>${d.payment_url ? `<a href="${escHtml(d.payment_url)}" target="_blank" rel="noopener" class="pay-link">Link ↗</a>` : '<span class="dim">—</span>'}</td>
      <td>${avail}</td>
      <td class="td-actions">
        <a class="btn-qr" href="/dashboard/drivers/${escHtml(d.id)}/print-qr" target="_blank">🖨 Print QR</a>
        <a class="btn-qr btn-card" href="/d/${escHtml(d.id)}" target="_blank">👤 Card</a>
      </td>
    </tr>`;
  }).join('');

  const noDrivers = drivers.length === 0
    ? `<tr><td colspan="7" class="empty">No drivers found. Add drivers in Supabase.</td></tr>`
    : '';

  res.type('text/html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Driver QR Codes — City Bucket List</title>
  <style>
    ${sharedCss()}
    .actions-bar { display:flex; gap:10px; align-items:center; margin-bottom:20px; flex-wrap:wrap; }
    .btn-primary {
      display:inline-flex; align-items:center; gap:6px;
      background:rgba(34,211,238,.12); border:1px solid rgba(34,211,238,.3);
      color:#22d3ee; padding:8px 16px; border-radius:8px;
      font-size:13px; font-weight:700; text-decoration:none;
    }
    .btn-primary:hover { opacity:.8; }
    .avatar-sm {
      width:32px; height:32px; border-radius:50%;
      background:rgba(34,211,238,.15); color:#22d3ee;
      display:flex; align-items:center; justify-content:center;
      font-size:11px; font-weight:800;
    }
    .td-actions { display:flex; gap:8px; }
    .btn-qr {
      font-size:12px; font-weight:600; padding:5px 10px; border-radius:6px;
      text-decoration:none; white-space:nowrap;
      background:rgba(34,211,238,.1); border:1px solid rgba(34,211,238,.2); color:#22d3ee;
    }
    .btn-card { background:rgba(192,132,252,.1); border-color:rgba(192,132,252,.2); color:#c084fc; }
    .btn-qr:hover { opacity:.8; }
    .pay-link { color:#10b981; font-size:13px; text-decoration:none; }
    .pay-link:hover { text-decoration:underline; }
    .empty { color:#475569; text-align:center; padding:40px 0; }
    .dim { color:#475569; }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="logo"><div class="logo-icon">🗺</div> City Bucket List</div>
    <span class="topbar-sub">Driver QR Codes</span>
    <div class="topbar-spacer"></div>
    <a class="btn-primary" href="/dashboard">← Dashboard</a>
  </header>
  <main class="dash">
    <div class="panel">
      <div class="ptitle">
        All Drivers
        <span class="pbadge">${drivers.length} total</span>
      </div>
      <div class="actions-bar">
        <a class="btn-primary" href="/dashboard/drivers/print-qr" target="_blank">🖨 Print All QR Cards</a>
      </div>
      <div class="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th></th><th>Name</th><th>Zone</th><th>Phone</th>
              <th>Payment Link</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>${rows}${noDrivers}</tbody>
        </table>
      </div>
    </div>
  </main>
</body>
</html>`);
});

// ── Print all driver QR cards ─────────────────────────────────────────────────

router.get('/drivers/print-qr', async (req, res) => {
  let drivers = [];
  try {
    drivers = await listDriversFull();
  } catch (err) {
    logger.error({ err }, 'Failed to list drivers for print-qr');
  }

  const cards = await Promise.all(drivers.map(d => buildPrintCard(d)));

  res.type('text/html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Driver QR Cards — City Bucket List</title>
  <style>
    ${printCss()}
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:24px; padding:24px; }
    @media print {
      .no-print { display:none; }
      .grid { grid-template-columns:repeat(3,1fr); gap:16px; padding:0; }
      body { background:#fff; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="padding:16px 24px;background:#111827;border-bottom:1px solid #1e2d44;display:flex;gap:12px;align-items:center;">
    <span style="color:#e2e8f0;font-family:system-ui,sans-serif;font-size:14px;">
      ${drivers.length} driver card${drivers.length !== 1 ? 's' : ''} ready to print
    </span>
    <button onclick="window.print()" style="background:#22d3ee;color:#080e1a;border:none;padding:8px 16px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px;">
      🖨 Print
    </button>
    <a href="/dashboard/drivers" style="color:#94a3b8;font-size:13px;font-family:system-ui,sans-serif;">← Back</a>
  </div>
  <div class="grid">${cards.join('')}</div>
</body>
</html>`);
});

// ── Print single driver QR card ───────────────────────────────────────────────

router.get('/drivers/:id/print-qr', async (req, res) => {
  const { id } = req.params;

  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).send('Invalid ID');

  let driver;
  try {
    driver = await getDriver(id);
  } catch (err) {
    logger.warn({ id, err: err.message }, 'Driver not found for print-qr');
    return res.status(404).send('Driver not found');
  }

  const card = await buildPrintCard(driver);

  res.type('text/html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escHtml(driver.name)} QR Card</title>
  <style>
    ${printCss()}
    body { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f1f5f9; }
    @media print {
      body { background:#fff; }
      .no-print { display:none; }
    }
  </style>
</head>
<body>
  <div>
    <div class="no-print" style="text-align:center;margin-bottom:16px;font-family:system-ui,sans-serif;">
      <button onclick="window.print()" style="background:#22d3ee;color:#080e1a;border:none;padding:8px 20px;border-radius:6px;font-weight:700;cursor:pointer;">
        🖨 Print
      </button>
      <a href="/dashboard/drivers" style="margin-left:12px;color:#64748b;font-size:13px;">← Back</a>
    </div>
    ${card}
  </div>
</body>
</html>`);
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function buildPrintCard(driver) {
  const cardUrl = `${env.PUBLIC_BASE_URL}/d/${driver.id}`;
  const qrSvg = await QRCode.toString(cardUrl, {
    type: 'svg',
    width: 160,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
  });

  const ini = initials(driver.name);
  const zone = (driver.zone || 'unknown').replace(/^\w/, c => c.toUpperCase());
  const firstName = (driver.name || '').split(' ')[0];
  const payLine = driver.payment_url
    ? `<div class="pay-url">${escHtml(driver.payment_url)}</div>`
    : '';

  return `
  <div class="card">
    <div class="card-logo">City Bucket List</div>
    <div class="card-avatar">${escHtml(ini)}</div>
    <div class="card-name">${escHtml(driver.name)}</div>
    <div class="card-zone">${zone} Zone · Verified Driver</div>
    <div class="card-qr">${qrSvg}</div>
    <div class="card-hint">Scan to book a ride or pay ${escHtml(firstName)}</div>
    ${payLine}
  </div>`;
}

function initials(name) {
  return (name || '?').split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sharedCss() {
  return `
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    :root {
      --bg:#080e1a; --surface:#111827; --surface2:#1a2336;
      --border:#1e2d44; --teal:#22d3ee; --teal-dim:#0891b2;
      --green:#10b981; --amber:#f59e0b; --text:#e2e8f0; --muted:#94a3b8; --dim:#475569;
    }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif; background:var(--bg); color:var(--text); font-size:14px; }
    .topbar { display:flex; align-items:center; gap:14px; padding:0 24px; height:56px; background:var(--surface); border-bottom:1px solid var(--border); }
    .logo { display:flex; align-items:center; gap:9px; font-weight:700; font-size:15px; color:var(--teal); }
    .logo-icon { width:30px; height:30px; background:linear-gradient(135deg,var(--teal-dim),var(--teal)); border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:16px; }
    .topbar-sub { font-size:12px; color:var(--muted); padding-left:14px; border-left:1px solid #253245; }
    .topbar-spacer { flex:1; }
    .dash { padding:20px 24px 40px; max-width:1100px; margin:0 auto; }
    .panel { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:20px; }
    .ptitle { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--muted); margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; }
    .pbadge { font-size:11px; font-weight:500; background:var(--surface2); color:var(--dim); padding:2px 9px; border-radius:12px; text-transform:none; letter-spacing:0; }
    .tbl-wrap { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; }
    th { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--dim); text-align:left; padding:8px 14px; border-bottom:1px solid var(--border); }
    td { padding:10px 14px; border-bottom:1px solid var(--border); font-size:13px; vertical-align:middle; }
    tr:last-child td { border-bottom:none; }
    tbody tr:hover td { background:var(--surface2); }
    .td-name { font-weight:700; }
    .chip { font-size:11px; font-weight:700; padding:3px 9px; border-radius:12px; white-space:nowrap; }
    .chip-avail { color:#10b981; background:rgba(16,185,129,.12); border:1px solid rgba(16,185,129,.25); }
    .chip-trip  { color:#f59e0b; background:rgba(245,158,11,.12);  border:1px solid rgba(245,158,11,.25); }
  `;
}

function printCss() {
  return `
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif; }
    .card {
      background:#fff; color:#0f172a;
      border:2px solid #e2e8f0; border-radius:16px;
      padding:20px 16px; text-align:center;
      break-inside:avoid; page-break-inside:avoid;
    }
    .card-logo { font-size:10px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:#0891b2; margin-bottom:12px; }
    .card-avatar {
      width:52px; height:52px; border-radius:50%;
      background:linear-gradient(135deg,#0891b2,#22d3ee);
      display:flex; align-items:center; justify-content:center;
      font-size:18px; font-weight:800; color:#fff;
      margin:0 auto 10px;
    }
    .card-name { font-size:17px; font-weight:800; margin-bottom:3px; }
    .card-zone { font-size:11px; color:#64748b; margin-bottom:12px; }
    .card-qr { margin:0 auto 10px; display:inline-block; }
    .card-qr svg { width:160px; height:160px; display:block; }
    .card-hint { font-size:10px; color:#94a3b8; margin-bottom:6px; }
    .pay-url { font-size:9px; color:#64748b; word-break:break-all; margin-top:4px; }
  `;
}

export default router;
