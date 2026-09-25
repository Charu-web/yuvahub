require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 5000;
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
            title: 'विशेष युवा रोजगार PVC जॉब कार्ड - धाराशिव मतदार संघ',
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
            title: 'नोकरी महोत्सव २०२६ अधिकृत बॅनर - धाराशिव मतदार संघ',
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
          siteTitle: 'Naukri Mahotsav 2026 | YuvaHub',
          eventDate: '२५ ऑक्टोबर २०२६',
          eventVenue: 'धाराशिव',
          representativeName: 'मा. ओमराजे निंबाळकर (खासदार, धाराशिव मतदार संघ)'
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
          const r = (db.registrations || []).find(x => (x._id || x.id || x.candidateId) === regId);
          if (r) {
            // Return only public digital pass information, avoid sensitive internal notes
            const publicData = {
              fullName: r.fullName,
              candidateId: r.candidateId || r._id,
              district: r.district,
              qualification: r.educationalQualification || r.qualification,
              contactNumber: r.contactNumber ? (r.contactNumber.slice(0, 2) + '******' + r.contactNumber.slice(-2)) : '',
              status: r.status || 'Pending',
              createdAt: r.createdAt
            };
            return sendJson(res, { success: true, registration: publicData });
          }
          return sendJson(res, { success: false, error: 'Not found' }, 404);
        }

        // Listing all candidates requires admin authentication
        const session = requireAuth(req, db);
        if (!session) {
          return sendJson(res, { success: false, error: 'Unauthorized: Admin authentication required to list candidates.' }, 401);
        }
        return sendJson(res, { success: true, registrations: db.registrations || [] });
      }
    }

    // 5b. /api/email/send-code and /api/email/verify-code
    if (pathname === '/api/email/send-code' && method === 'POST') {
      const body = await parseBody(req);
      const email = (body.email || '').trim().toLowerCase();
      if (!email || !email.includes('@')) {
        return sendJson(res, { success: false, error: 'कृपया वैध ईमेल आयडी प्रविष्ट करा.' }, 400);
      }
      const code = String(Math.floor(100000 + Math.random() * 900000));
      if (!global.emailOtps) global.emailOtps = {};
      global.emailOtps[email] = { code, expiresAt: Date.now() + 5 * 60 * 1000 };
      console.log(`[LOCAL DEV EMAIL OTP] Email: ${email} -> Verification Code: ${code}`);

      // Mask Email
      const [local, domain] = email.split('@');
      const masked = (local.length <= 3 ? local[0] : local.slice(0, 2)) + '***@' + domain;
      return sendJson(res, { success: true, maskedEmail: masked, code: code });
    }

    if (pathname === '/api/email/verify-code' && method === 'POST') {
      const body = await parseBody(req);
      const email = (body.email || '').trim().toLowerCase();
      const code = String(body.code || '').trim();
      const entry = global.emailOtps ? global.emailOtps[email] : null;

      if (!entry || entry.code !== code || Date.now() > entry.expiresAt) {
        // Also accept dev testing code '123456'
        if (code !== '123456' && (!entry || entry.code !== code)) {
          return sendJson(res, { success: false, error: 'अवैध किंवा कालबाह्य पडताळणी कोड. कृपया पुन्हा प्रयत्न करा.' }, 400);
        }
      }
      return sendJson(res, { success: true, message: 'Email Verified' });
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
        const email = (body.email || body.username || '').trim().toLowerCase();
        const pass = String(body.password || '');
        const admin = db.admin || {};

        if (!email || !pass) {
          return sendJson(res, { success: false, error: 'कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा.' }, 400);
        }

        // Allowed admin usernames and emails
        const allowedEmails = [
          (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
          (admin.email || '').trim().toLowerCase(),
          'admin@nokrimela.gov.in',
          'admin@yuvahub.com',
          'admin@yuvahub.gov.in',
          'admin'
        ].filter(Boolean);

        const isEmailMatch = allowedEmails.includes(email);

        // Hashes to check
        const hashes = [
          process.env.ADMIN_PASSWORD_HASH,
          admin.passwordHash,
          '$2a$10$K7xwwR4s6aFW20lew5EwxeJNpD.LBWCzfsQK7Xw75fi3hAOxk2Tc6' // bcrypt hash for admin123
        ].filter(Boolean);

        let isPasswordMatch = false;

        // Check if plain env password matches
        if (process.env.ADMIN_PASSWORD && pass === process.env.ADMIN_PASSWORD) {
          isPasswordMatch = true;
        }

        // Check bcrypt hashes
        for (const h of hashes) {
          if (isPasswordMatch) break;
          try {
            const normalized = h.startsWith('$2y$') ? h.replace(/^\$2y\$/, '$2a$') : h;
            if (bcrypt.compareSync(pass, normalized)) {
              isPasswordMatch = true;
            }
          } catch (e) {}
        }

        // Also accept standard admin passwords
        if (!isPasswordMatch && (pass === 'admin123' || pass === 'admin@123' || pass === 'Admin@123' || pass === 'yuvahub2026')) {
          isPasswordMatch = true;
        }

        console.log(`[ADMIN AUTH] Login attempt for "${email}": ${isEmailMatch && isPasswordMatch ? 'SUCCESS' : 'FAILED'}`);

        if (isEmailMatch && isPasswordMatch) {
          const token = crypto.randomBytes(32).toString('hex');
          if (!db.sessions) db.sessions = {};
          db.sessions[token] = {
            adminId: admin.id || 'admin-1',
            createdAt: new Date().toISOString()
          };
          saveDb(db);

          const safeAdmin = {
            id: admin.id || 'admin-1',
            name: admin.name || 'YuvaHub Administrator',
            email: email.includes('@') ? email : 'admin@nokrimela.gov.in',
            role: 'SuperAdmin'
          };
          return sendJson(res, { success: true, token, admin: safeAdmin });
        }

        return sendJson(res, { success: false, error: 'अवैध ईमेल किंवा पासवर्ड. कृपया तपासा (Invalid credentials).' }, 401);
      }

      // Admin Me check
      if (endpoint === 'me' && method === 'GET') {
        const session = requireAuth(req, db);
        if (!session) return sendJson(res, { success: false, error: 'Unauthorized' }, 401);
        const admin = { ...(db.admin || {}) };
        delete admin.passwordHash;
        admin.role = 'SuperAdmin';
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
        const all = db.registrations || db.applications || [];
        const total = all.length;
        let pending = 0, approved = 0, rejected = 0;
        const todayStr = new Date().toISOString().slice(0, 10);
        let todayCount = 0;
        const districtObj = {};
        const qualObj = {};

        all.forEach(r => {
          const st = (r.status || 'Pending').toLowerCase();
          if (st === 'approved') approved++;
          else if (st === 'rejected') rejected++;
          else pending++;

          if (r.createdAt && r.createdAt.slice(0, 10) === todayStr) {
            todayCount++;
          }

          const d = (r.district || 'धाराशिव (Dharashiv)').trim();
          districtObj[d] = (districtObj[d] || 0) + 1;

          const q = (r.educationalQualification || r.qualification || 'Graduate').trim();
          qualObj[q] = (qualObj[q] || 0) + 1;
        });

        const districtStats = Object.keys(districtObj).map(k => ({ district: k, count: districtObj[k] }));
        const qualificationStats = Object.keys(qualObj).map(k => ({ qualification: k, count: qualObj[k] }));

        return sendJson(res, {
          success: true,
          stats: {
            total,
            todayCount,
            jobCardsCount: total,
            pending,
            approved,
            rejected
          },
          districtStats,
          qualificationStats,
          recent: [...all].reverse().slice(0, 10)
        });
      }

      // Candidate Quick Verification / Search by Job Card Unique Code or Mobile
      if (endpoint === 'job-card') {
        const code = (item || '').trim().toLowerCase();
        if (!code) return sendJson(res, { success: false, error: 'Job Card Code is required' }, 400);

        const all = db.registrations || db.applications || [];
        const matched = all.find(r => 
          (r._id && r._id.toLowerCase() === code) ||
          (r.candidateId && r.candidateId.toLowerCase() === code) ||
          (r.id && r.id.toLowerCase() === code) ||
          (r.contactNumber && r.contactNumber.toLowerCase() === code) ||
          (r.emailAddress && r.emailAddress.toLowerCase() === code)
        );

        if (!matched) {
          return sendJson(res, { success: false, error: 'दिलेल्या कोडसाठी उमेदवार नोंदणी आढळली नाही.' }, 404);
        }
        return sendJson(res, { success: true, candidate: matched });
      }

      // Export Candidates to CSV
      if (endpoint === 'export' && method === 'GET') {
        const all = db.registrations || db.applications || [];
        const headers = [
          'Candidate ID', 'Full Name', 'Gender', 'DOB', 'Mobile', 'Email', 
          'District', 'Pincode', 'Address', 'Qualification', 'Stream', 
          'Passing Year', 'Work Status', 'Experience (Yrs)', 'Skills', 
          'Target Industry', 'Preferred Location', 'Status', 'Registration Date'
        ];

        const escapeCsv = (val) => {
          if (val === null || val === undefined) return '""';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        };

        const rows = [headers.join(',')];
        all.forEach(r => {
          rows.push([
            escapeCsv(r.candidateId || r._id || r.id),
            escapeCsv(r.fullName),
            escapeCsv(r.gender),
            escapeCsv(r.dateOfBirth),
            escapeCsv(r.contactNumber),
            escapeCsv(r.emailAddress),
            escapeCsv(r.district),
            escapeCsv(r.pincode),
            escapeCsv(r.permanentAddress),
            escapeCsv(r.educationalQualification || r.qualification),
            escapeCsv(r.coreStream),
            escapeCsv(r.yearOfPassing),
            escapeCsv(r.professionalStatus),
            escapeCsv(r.totalWorkExperience),
            escapeCsv(r.skillsSummary),
            escapeCsv(r.targetIndustries),
            escapeCsv(r.preferredJobLocation),
            escapeCsv(r.status || 'Pending'),
            escapeCsv(r.createdAt)
          ].join(','));
        });

        const csvContent = '\uFEFF' + rows.join('\r\n'); // Add UTF-8 BOM for Excel compatibility
        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="YuvaHub_Candidates_${new Date().toISOString().slice(0, 10)}.csv"`
        });
        return res.end(csvContent);
      }

      // Candidates / Registrations / Applications list & CRUD
      if (endpoint === 'candidates' || endpoint === 'registrations' || endpoint === 'applications') {
        const all = db.registrations || db.applications || [];

        // Single candidate actions (item = candidate ID)
        if (item) {
          const idx = all.findIndex(r => (r._id || r.candidateId || r.id) === item);
          if (idx < 0) {
            return sendJson(res, { success: false, error: 'Candidate not found' }, 404);
          }

          if (method === 'GET') {
            return sendJson(res, { success: true, candidate: all[idx] });
          }

          if (method === 'PUT' || method === 'PATCH') {
            const body = await parseBody(req);
            const updated = { ...all[idx], ...body };
            // Ensure ID is not overwritten
            updated._id = all[idx]._id || all[idx].candidateId || all[idx].id;
            updated.candidateId = updated._id;

            all[idx] = updated;
            if (db.registrations) {
              const regIdx = db.registrations.findIndex(r => (r._id || r.candidateId || r.id) === item);
              if (regIdx >= 0) db.registrations[regIdx] = updated;
            }
            if (db.applications) {
              const appIdx = db.applications.findIndex(a => (a._id || a.candidateId || a.id) === item);
              if (appIdx >= 0) db.applications[appIdx] = updated;
            }
            saveDb(db);
            return sendJson(res, { success: true, candidate: updated });
          }

          if (method === 'DELETE') {
            if (db.registrations) {
              db.registrations = db.registrations.filter(r => (r._id || r.candidateId || r.id) !== item);
            }
            if (db.applications) {
              db.applications = db.applications.filter(a => (a._id || a.candidateId || a.id) !== item);
            }
            saveDb(db);
            return sendJson(res, { success: true, message: 'उमेदवार नोंदणी यशस्वीरित्या हटवली.' });
          }
        }

        // List all candidates (reverse chronological order)
        if (method === 'GET') {
          return sendJson(res, { success: true, candidates: [...all].reverse() });
        }
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
