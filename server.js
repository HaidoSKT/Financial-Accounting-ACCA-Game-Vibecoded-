/**
 * Financial Accounting Master Suite - Local Persistence Server
 * Built with Node.js standard libraries (zero npm dependencies required).
 * Provides HTTP static file serving and REST persistence API for:
 * 1. ACCA Financial Accounting Master (FFA / FA)
 * 2. FIFO vs AVCO Master: Perpetual & Periodic Inventory Simulator (IAS 2 Compliant)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'game_store.json');
const INVENTORY_DB_FILE = path.join(DATA_DIR, 'inventory_store.json');

// Ensure data directory and initial databases exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({
    schema: 'acca_game_server_db_v1',
    created: new Date().toISOString(),
    profile: null,
    history: []
  }, null, 2));
}

if (!fs.existsSync(INVENTORY_DB_FILE)) {
  fs.writeFileSync(INVENTORY_DB_FILE, JSON.stringify({
    schema: 'fifo_lifo_master_server_db_v1',
    created: new Date().toISOString(),
    profile: null,
    stats: {},
    badges: [],
    history: [],
    customCompanies: []
  }, null, 2));
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // CORS Headers for flexible development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // REST API Endpoints
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', serverTime: new Date().toISOString() }));
    return;
  }

  // --- ACCA Game API ---
  if (pathname === '/api/load' && req.method === 'GET') {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(parsed.profile || {}));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (pathname === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const incoming = JSON.parse(body);
        const existingRaw = fs.readFileSync(DB_FILE, 'utf8');
        const existing = JSON.parse(existingRaw);

        existing.profile = incoming;
        existing.lastUpdated = new Date().toISOString();
        if (incoming.history && incoming.history.length > 0) {
          existing.history = incoming.history;
        }

        fs.writeFileSync(DB_FILE, JSON.stringify(existing, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, savedAt: existing.lastUpdated }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload: ' + e.message }));
      }
    });
    return;
  }

  // --- FIFO & LIFO Master API ---
  if (pathname === '/api/inventory/load' && req.method === 'GET') {
    try {
      const data = fs.readFileSync(INVENTORY_DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(parsed || {}));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (pathname === '/api/inventory/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const incoming = JSON.parse(body);
        const existingRaw = fs.readFileSync(INVENTORY_DB_FILE, 'utf8');
        const existing = JSON.parse(existingRaw);

        existing.profile = incoming.profile || existing.profile;
        existing.stats = incoming.stats || existing.stats;
        existing.badges = incoming.badges || existing.badges;
        existing.history = incoming.history || existing.history;
        existing.customCompanies = incoming.customCompanies || existing.customCompanies;
        existing.lastUpdated = new Date().toISOString();

        fs.writeFileSync(INVENTORY_DB_FILE, JSON.stringify(existing, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, savedAt: existing.lastUpdated }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload: ' + e.message }));
      }
    });
    return;
  }

  // Static File Serving with friendly aliases
  let targetFile = pathname;
  if (pathname === '/') {
    targetFile = 'index.html';
  } else if (pathname === '/fifo-avco' || pathname === '/fifo-lifo' || pathname === '/inventory' || pathname === '/avco-fifo' || pathname === '/lifo-fifo') {
    targetFile = 'fifo-lifo.html';
  }

  let filePath = path.join(__dirname, targetFile);
  
  // Security check: ensure filePath is within __dirname
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` Financial Accounting Master Suite Server running at:`);
  console.log(` http://localhost:${PORT}`);
  console.log(` -> Game 1 (ACCA FA Master): http://localhost:${PORT}/`);
  console.log(` -> Game 2 (FIFO vs LIFO):   http://localhost:${PORT}/fifo-lifo.html`);
  console.log(` Database files:`);
  console.log(` - ACCA Store:      ${DB_FILE}`);
  console.log(` - Inventory Store: ${INVENTORY_DB_FILE}`);
  console.log(`======================================================\n`);
});
