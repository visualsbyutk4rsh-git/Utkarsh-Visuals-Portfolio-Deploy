// server/middleware/security.js — Security Middleware Stack
// Configures helmet, CORS, and CSP for production hardening.

const helmet = require('helmet');
const cors = require('cors');
const config = require('../config');

/**
 * Returns an array of security middleware to apply to the Express app.
 */
function createSecurityMiddleware() {
  const middlewares = [];

  // 1. Helmet — sets security headers (XSS protection, frame options, etc.)
  middlewares.push(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'https://www.googletagmanager.com',
            'https://www.google-analytics.com',
            'https://www.clarity.ms',
            'https://cdn.jsdelivr.net',
            'https://browser.sentry-cdn.com',
            'https://www.youtube.com',
            'https://s.ytimg.com',
          ],
          'script-src-attr': ["'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'", 'https://api.fontshare.com', 'https://fonts.googleapis.com'],
          'img-src': ["'self'", 'data:', 'https:', 'blob:'],
          'media-src': ["'self'", 'blob:', 'https://*.youtube.com', 'https://*.youtube-nocookie.com', 'https://youtube.com'],
          'frame-src': ["'self'", 'https://*.youtube.com', 'https://*.youtube-nocookie.com', 'https://youtube.com', 'https://*.vimeo.com', 'https://player.vimeo.com'],
          'connect-src': [
            "'self'",
            'https://www.google-analytics.com',
            'https://www.clarity.ms',
            'https://*.sentry.io',
            config.supabase.url || 'https://placeholder.supabase.co',
          ].filter(Boolean),
          'font-src': ["'self'", 'https://cdn.fontshare.com', 'https://fonts.gstatic.com'],
          'object-src': ["'none'"],
          'base-uri': ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow YouTube embeds
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    })
  );

  // 2. CORS — restrict API access to same origin
  const allowedOrigins = [
    `http://localhost:${config.port}`,
    'https://utkarshvisuals.base44.app',
    'https://utkarshvisuals.vercel.app',
  ];

  middlewares.push(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, Postman, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      credentials: false,
    })
  );

  // 3. Custom security headers not covered by Helmet
  middlewares.push((req, res, next) => {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    next();
  });

  return middlewares;
}

module.exports = { createSecurityMiddleware };
