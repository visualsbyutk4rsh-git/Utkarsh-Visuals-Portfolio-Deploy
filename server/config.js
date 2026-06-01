// server/config.js — Centralized Configuration
// All environment variables are read here and exported as a single object.
// Every module imports from config.js instead of reading process.env directly.

require('dotenv').config();

const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 8083,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
    get isConfigured() {
      return !!(this.url && this.anonKey);
    },
  },

  // Resend Email
  email: {
    apiKey: process.env.RESEND_API_KEY || '',
    adminEmail: process.env.ADMIN_EMAIL || 'visualsbyutk4rsh@gmail.com',
    fromEmail: process.env.FROM_EMAIL || 'noreply@utkarshvisuals.com',
    get isConfigured() {
      return !!this.apiKey;
    },
  },

  // Sentry
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    get isConfigured() {
      return !!this.dsn;
    },
  },

  // Analytics (passed to frontend)
  analytics: {
    ga4Id: process.env.GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX',
    clarityId: process.env.CLARITY_PROJECT_ID || 'xxxxxxxxxx',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,            // per window per IP
  },

  // Google Sheets
  googleSheets: {
    url: process.env.GOOGLE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbx47PIPiH3kQFUMb07RD3yEe-uQu0IGz0RrdwzimgGMxtrr5BaVOemrol7Bs40rzGIE/exec',
    get isConfigured() {
      return !!this.url;
    },
  },

  // Validation Limits
  validation: {
    maxNameLength: 100,
    minNameLength: 2,
    maxDescriptionLength: 2000,
    maxRequestBodySize: '10kb',
    allowedBudgets: ['1k-3k', '3k-5k', '5k+', 'Contact Form Quote Request'],
  },
};

module.exports = config;
