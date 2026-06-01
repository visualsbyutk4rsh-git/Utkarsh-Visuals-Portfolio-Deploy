// server/index.js — Express Application Entry Point
// Production-grade static server + API for Utkarsh Visuals portfolio.

const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const config = require('./config');

// ═══════════════════════════════════════════
// 1. SENTRY INITIALIZATION (must be first)
// ═══════════════════════════════════════════
if (config.sentry.isConfigured) {
  const Sentry = require('@sentry/node');
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.nodeEnv,
    tracesSampleRate: config.isProd ? 0.2 : 1.0,
  });
  global.__sentry_hub = true;
  console.log('[Sentry] Initialized');
}

// ═══════════════════════════════════════════
// 2. EXPRESS APP SETUP
// ═══════════════════════════════════════════
const app = express();

// Trust proxy for correct IP behind Vercel/Nginx
app.set('trust proxy', 1);

// ═══════════════════════════════════════════
// 3. GLOBAL MIDDLEWARE
// ═══════════════════════════════════════════

// Request logging
if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    skip: (req) => req.url.match(/\.(js|css|png|jpg|jpeg|webp|svg|mp4|webm|woff|woff2|ico)$/),
  }));
}

// Compression (gzip/brotli)
app.use(compression({
  level: 6,
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
}));

// Security middleware (Helmet, CORS, CSP)
const { createSecurityMiddleware } = require('./middleware/security');
createSecurityMiddleware().forEach((mw) => app.use(mw));

// General rate limiter
const { generalRateLimiter } = require('./middleware/rateLimiter');
app.use(generalRateLimiter);

// JSON body parser (with size limit)
app.use(express.json({ limit: config.validation.maxRequestBodySize }));

// ═══════════════════════════════════════════
// 4. API ROUTES
// ═══════════════════════════════════════════

// Block access to sensitive files before static serving
app.use((req, res, next) => {
  const blocked = /\.(ps1|env|git)|leads\.(json|csv)$/i;
  if (blocked.test(req.path)) {
    return res.status(404).send('Not Found');
  }
  next();
});

// Lead capture API
const leadsRouter = require('./routes/leads');
app.use('/api/leads', leadsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    supabase: config.supabase.isConfigured ? 'connected' : 'not configured',
    email: config.email.isConfigured ? 'connected' : 'not configured',
    sentry: config.sentry.isConfigured ? 'connected' : 'not configured',
  });
});

// Public client-side configuration endpoint
app.get('/api/config', (req, res) => {
  res.json({
    ga4Id: config.analytics.ga4Id,
    clarityId: config.analytics.clarityId,
    sentryDsn: config.sentry.dsn || null,
  });
});

// ═══════════════════════════════════════════
// 5. STATIC FILE SERVING
// ═══════════════════════════════════════════
const publicDir = path.join(__dirname, '..', 'public');
const videosDir = path.join(__dirname, '..', 'public', 'videos');
app.use('/videos', express.static(videosDir, {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// Cache control for static assets
app.use(
  express.static(publicDir, {
    maxAge: '1h',                    // Default: 1 hour
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Immutable cache for hashed bundle files
      if (/index-[A-Za-z0-9]+\.(js|css)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      // No cache for HTML (always fresh)
      else if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
      // Long cache for fonts
      else if (/\.(woff2?|ttf|otf)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      // Medium cache for media
      else if (/\.(mp4|webm|png|jpg|jpeg|webp|svg|gif)$/.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    },
  })
);

// SPA fallback — serve index.html for all unmatched routes
app.get(/.*/, (req, res) => {
  // Don't serve HTML for API routes or file extensions
  if (req.path.startsWith('/api/') || req.path.match(/\.\w+$/)) {
    return res.status(404).send('Not Found');
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// ═══════════════════════════════════════════
// 6. ERROR HANDLING
// ═══════════════════════════════════════════

// Sentry error handler (must be after routes)
if (config.sentry.isConfigured) {
  const Sentry = require('@sentry/node');
  Sentry.setupExpressErrorHandler(app);
}

// Global error handler
app.use((err, req, res, _next) => {
  console.error('[Server] Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: config.isProd
      ? 'An internal error occurred.'
      : err.message,
  });
});

// ═══════════════════════════════════════════
// 7. START SERVER
// ═══════════════════════════════════════════
const { execSync } = require('child_process');

function killPortOwner(port) {
  try {
    console.log(`[Server] Port ${port} in use. Locating owner...`);
    let stdout = '';
    if (process.platform === 'win32') {
      try {
        stdout = execSync(`netstat -ano | findstr :${port}`).toString();
      } catch (e) {
        // netstat returns error exit code if no match is found
        return false;
      }
      const lines = stdout.split('\n');
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          const localAddr = parts[1];
          const state = parts[3];
          const pid = parts[4];
          // Check that it's actually the specified port and is listening
          if (localAddr.endsWith(`:${port}`) && state === 'LISTENING' && pid && pid !== '0') {
            pids.add(pid);
          }
        }
      }
      for (const pid of pids) {
        if (parseInt(pid) === process.pid) continue;
        console.log(`[Server] Terminating background process PID ${pid} using port ${port}...`);
        try {
          execSync(`taskkill /F /PID ${pid}`);
        } catch (err) {
          console.error(`[Server] Failed to taskkill PID ${pid}:`, err.message);
        }
      }
      return pids.size > 0;
    } else {
      try {
        stdout = execSync(`lsof -t -i:${port}`).toString().trim();
      } catch (e) {
        return false;
      }
      const pids = stdout.split('\n').filter(Boolean);
      for (const pid of pids) {
        if (parseInt(pid) === process.pid) continue;
        console.log(`[Server] Terminating background process PID ${pid} using port ${port}...`);
        try {
          execSync(`kill -9 ${pid}`);
        } catch (err) {
          console.error(`[Server] Failed to kill PID ${pid}:`, err.message);
        }
      }
      return pids.length > 0;
    }
  } catch (err) {
    console.error(`[Server] Port recovery scan failed:`, err.message);
    return false;
  }
}

const server = app.listen(config.port, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Utkarsh Visuals — Production Server (Node.js)');
  console.log(`  Preview:    http://localhost:${config.port}/`);
  console.log(`  Environment: ${config.nodeEnv}`);
  console.log(`  Supabase:   ${config.supabase.isConfigured ? 'Connected' : 'Not configured'}`);
  console.log(`  Resend:     ${config.email.isConfigured ? 'Connected' : 'Not configured'}`);
  console.log(`  Sentry:     ${config.sentry.isConfigured ? 'Connected' : 'Not configured'}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[Server] Port ${config.port} is occupied.`);
    const freed = killPortOwner(config.port);
    if (freed) {
      console.log('[Server] Port recovered. Retrying to bind in 1.5 seconds...');
    } else {
      console.log('[Server] No external owner resolved or port already freed. Retrying bind in 1.5 seconds...');
    }
    setTimeout(() => {
      server.listen(config.port);
    }, 1500);
  } else {
    console.error('[Server] Critical Server Error:', err);
  }
});

module.exports = app;
