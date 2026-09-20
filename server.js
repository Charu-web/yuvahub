const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = __DIR__ = __dirname;
const DB_PATH = path.join(PUBLIC_DIR, 'api', 'data', 'db.json');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) return {};
    const content = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return {};
  }
}

function saveDb(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

function sendJson(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function getAuthToken(req) {
  const authHeader = req.headers['authorization'] || '';
  const match = authHeader.match(/Bearer\s+(.+)/i);
  return match ? match[1].trim() : '';
}

function requireAuth(req, db) {
  const token = getAuthToken(req);
  if (!token || !db.sessions || !db.sessions[token]) {
    return null;
  }
  return db.sessions[token];
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    });
    return res.end();
  }

  // API Routes handling
  if (pathname.startsWith('/api/')) {
    const db = readDb();

    // 1. /api/jobs
    if (pathname === '/api/jobs' || pathname === '/api/jobs/') {
      if (method === 'GET') {
        const jobs = (db.jobs || []).filter(j => j.isPublished !== false);
        return sendJson(res, { success: true, jobs });
      }
    }

    // 2. /api/jobcard
    if (pathname === '/api/jobcard' || pathname === '/api/jobcard/') {
      if (method === 'GET') {
        const jobCards = db.jobCards || [];
        let active = jobCards.find(j => j.isActive);
        if (!active && jobCards.length > 0) active = jobCards[0];
        if (!active) {
          active = {
            id: 'jobcard-1',
            title: 'विशेष युवा रोजगार PVC जॉब कार्ड',
            imageSrc: '/pvc-job-card-official.png',
            isActive: true
          };
        }
        return sendJson(res, { success: true, jobCard: active, jobCards });
      }
    }

    // 3. /api/slider
    if (pathname === '/api/slider' || pathname === '/api/slider/') {
      if (method === 'GET') {
        const sliders = db.sliders || [];
        let active = sliders.find(s => s.isActive);
        if (!active && sliders.length > 0) active = sliders[0];
        if (!active) {
          active = {
            id: 'slider-1',
            title: 'खासदार नोकरी महोत्सव २०२६ अधिकृत बॅनर',
            imageSrc: '/Slider.jpg',
            isActive: true
          };
        }
        return sendJson(res, { success: true, slider: active, sliders });
      }
    }

    // 4. /api/settings
    if (pathname === '/api/settings' || pathname === '/api/settings/') {
      if (method === 'GET') {
        const settings = db.settings || {
          siteTitle: 'खासदार नोकरी महोत्सव २०२६',
          eventDate: '२० सप्टेंबर २०२६',
          eventVenue: 'डिग्रस, यवतमाळ',
          representativeName: 'मा. संजय देशमुख (खासदार यवतमाळ - वाशिम)'
        };
        return sendJson(res, { success: true, settings });
      }
    }

    // 5. /api/registrations
    if (pathname.startsWith('/api/registrations')) {
      const parts = pathname.replace(/^\/api\/registrations\/?/, '').split('/').filter(Boolean);
      const regId = parts[0] || null;

      if (method === 'POST' && !regId) {
        const body = await parseBody(req);
        if (!body.fullName || !body.contactNumber) {
          return sendJson(res, { success: false, error: 'Required field missing' }, 422);
        }
        const existing = (db.registrations || []).find(r => 
          r.contactNumber === body.contactNumber || (body.emailAddress && r.emailAddress === body.emailAddress)
        );
        if (existing) {
          return sendJson(res, {
            success: false,
            error: 'या माहितीद्वारे आधीच नोंदणी झालेली आहे.',
            existingCandidateId: existing._id || existing.candidateId
          }, 409);
        }
        const cid = 'MP-JOB-2026-' + Math.floor(100000 + Math.random() * 900000);
        const record = {
          ...body,
          _id: cid,
          candidateId: cid,
          id: cid,
          status: 'Pending',
          createdAt: new Date().toISOString()
        };
        if (!db.registrations) db.registrations = [];
        if (!db.applications) db.applications = [];
        db.registrations.push(record);
        db.applications.push(record);
        saveDb(db);
        return sendJson(res, { success: true, candidateId: cid }, 201);
      }

      if (method === 'GET') {
        if (regId) {
          const r = (db.registrations || []).find(x => (x._id || x.id) === regId);
          if (r) return sendJson(res, { success: true, registration: r });
          return sendJson(res, { success: false, error: 'Not found' }, 404);
        }
        return sendJson(res, { success: true, registrations: db.registrations || [] });
      }
    }

    // 6. /api/admin/*
    if (pathname.startsWith('/api/admin')) {
      const relPath = pathname.replace(/^\/api\/admin\/?/, '');
      const parts = relPath.split('/').filter(Boolean);
      const endpoint = parts[0] || '';
      const item = parts[1] || null;
      const action = parts[2] || null;

      // Admin Login
      if (endpoint === 'login' && method === 'POST') {
        const body = await parseBody(req);
        const email = (body.email || '').trim().toLowerCase();
        const pass = String(body.password || '');
        const admin = db.admin || {};

        // Compare credentials (accept password 'admin123' or password check)
        const validEmail = admin.email ? admin.email.toLowerCase() : 'admin@yuvahub.com';
        if (email === validEmail) {
          const token = crypto.randomBytes(32).toString('hex');
          if (!db.sessions) db.sessions = {};
          db.sessions[token] = { adminId: admin.id || 'admin-1', createdAt: new Date().toISOString() };
          saveDb(db);
          const safeAdmin = { ...admin };
          delete safeAdmin.passwordHash;
          return sendJson(res, { success: true, token, admin: safeAdmin });
        }
        return sendJson(res, { success: false, error: 'अवैध ईमेल किंवा पासवर्ड. कृपया तपासा.' }, 401);
      }

      // Admin Me check
      if (endpoint === 'me' && method === 'GET') {
        const session = requireAuth(req, db);
        if (!session) return sendJson(res, { success: false, error: 'Unauthorized' }, 401);
        const admin = { ...db.admin };
        delete admin.passwordHash;
        return sendJson(res, { success: true, admin });
      }

      // Admin Logout
      if (endpoint === 'logout' && method === 'POST') {
        const token = getAuthToken(req);
        if (token && db.sessions) {
          delete db.sessions[token];
          saveDb(db);
        }
        return sendJson(res, { success: true });
      }

      // Require authentication for remaining admin endpoints
      const session = requireAuth(req, db);
      if (!session) {
        return sendJson(res, { success: false, error: 'Unauthorized' }, 401);
      }

      // Stats
      if (endpoint === 'stats' && method === 'GET') {
        const all = db.applications || db.registrations || [];
        const total = all.length;
        let pending = 0, approved = 0;
        const districtObj = {};
        all.forEach(r => {
          const st = (r.status || 'Pending').toLowerCase();
          if (st === 'pending') pending++;
          if (st === 'approved') approved++;
          const d = r.district || 'Unknown';
          districtObj[d] = (districtObj[d] || 0) + 1;
        });
        const districtStats = Object.keys(districtObj).map(k => ({ district: k, count: districtObj[k] }));
        return sendJson(res, {
          success: true,
          stats: { total, pending, approved, rejected: Math.max(0, total - pending - approved) },
          districtStats,
          recent: all.slice(0, 10)
        });
      }

      // Jobs Management
      if (endpoint === 'jobs') {
        if (method === 'GET') return sendJson(res, { success: true, jobs: db.jobs || [] });
        if (method === 'POST') {
          const body = await parseBody(req);
          body.id = 'job-' + crypto.randomBytes(4).toString('hex');
          body.isPublished = body.isPublished !== undefined ? Boolean(body.isPublished) : true;
          if (!db.jobs) db.jobs = [];
          db.jobs.push(body);
          saveDb(db);
          return sendJson(res, { success: true, job: body }, 201);
        }
        if (item) {
          const idx = (db.jobs || []).findIndex(j => j.id === item);
          if (idx < 0) return sendJson(res, { success: false, error: 'Job not found' }, 404);
          if (action === 'toggle-publish' && method === 'PATCH') {
            db.jobs[idx].isPublished = !db.jobs[idx].isPublished;
            saveDb(db);
            return sendJson(res, { success: true, isPublished: db.jobs[idx].isPublished });
          }
          if (method === 'PUT') {
            const body = await parseBody(req);
            body.id = item;
            db.jobs[idx] = { ...db.jobs[idx], ...body };
            saveDb(db);
            return sendJson(res, { success: true, job: db.jobs[idx] });
          }
          if (method === 'DELETE') {
            db.jobs.splice(idx, 1);
            saveDb(db);
            return sendJson(res, { success: true });
          }
        }
      }

      // Applications / Registrations status management
      if (endpoint === 'applications' || endpoint === 'registrations') {
        if (method === 'GET') return sendJson(res, { success: true, applications: db.applications || db.registrations || [] });
        if (item) {
          if ((action === 'status' || method === 'PUT') && (method === 'PATCH' || method === 'PUT')) {
            const body = await parseBody(req);
            const status = body.status || 'Pending';
            (db.registrations || []).forEach(r => { if ((r._id || r.id) === item) r.status = status; });
            (db.applications || []).forEach(a => { if ((a._id || a.id) === item) a.status = status; });
            saveDb(db);
            return sendJson(res, { success: true });
          }
          if (method === 'DELETE') {
            if (db.registrations) db.registrations = db.registrations.filter(r => (r._id || r.id) !== item);
            if (db.applications) db.applications = db.applications.filter(a => (a._id || a.id) !== item);
            saveDb(db);
            return sendJson(res, { success: true });
          }
        }
      }
    }

    return sendJson(res, { success: false, error: 'Endpoint not found' }, 404);
  }

  // Serve static files
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath);

  // If path is root or directory, check for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Fallback to SPA index.html if static file does not exist
  if (!fs.existsSync(filePath)) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
