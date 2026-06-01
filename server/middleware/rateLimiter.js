// server/middleware/rateLimiter.js — Rate Limiting
// Prevents API abuse by throttling requests per IP.

const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * Rate limiter for the leads API endpoint.
 * Allows config.rateLimit.maxRequests per config.rateLimit.windowMs per IP.
 */
const leadsRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please wait a few minutes before trying again.',
  },
});

/**
 * General rate limiter for all routes (much more lenient).
 */
const generalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,                 // 200 requests per minute
  standardHeaders: false,
  legacyHeaders: false,
});

module.exports = { leadsRateLimiter, generalRateLimiter };
