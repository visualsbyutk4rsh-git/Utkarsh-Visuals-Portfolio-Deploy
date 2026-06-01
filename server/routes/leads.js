// server/routes/leads.js — Lead Capture API Route
// POST /api/leads — validates, sanitizes, stores, and notifies.

const express = require('express');
const router = express.Router();

const { leadsRateLimiter } = require('../middleware/rateLimiter');
const { validateLead, handleValidationErrors } = require('../middleware/validation');
const supabaseService = require('../services/supabase');
const emailService = require('../services/email');
const backupService = require('../services/backup');
const googleSheetsService = require('../services/googleSheets');

/**
 * POST /api/leads
 * Full lead capture pipeline:
 * 1. Rate limit check
 * 2. Input validation & sanitization
 * 3. Honeypot detection
 * 4. Save to Google Sheets (MANDATORY & AWAITED first)
 * 5. Save to Supabase (primary) and local JSON backup (fallback)
 * 6. Send admin notification email (ONLY after Sheets success)
 * 7. Send auto-reply to lead
 */
router.post(
  '/',
  leadsRateLimiter,
  validateLead,
  handleValidationErrors,
  async (req, res) => {
    try {
      // Honeypot check — bots fill hidden fields
      if (req.body._hp) {
        console.log('[Leads] Honeypot triggered from:', req.ip);
        // Return success to fool the bot
        return res.json({ success: true, message: 'Lead captured successfully' });
      }

      const clientIP =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.connection.remoteAddress ||
        req.ip;

      const now = new Date();
      const lead = {
        name: req.body.name,
        email: req.body.email,
        budget: req.body.budget || 'Not specified',
        description: req.body.description || '',
        source: req.body.source || 'Modal Lead Form',
        page: req.body.page || '',
        ip: clientIP,
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 8),
      };

      console.log(`[Leads] New lead submission: ${lead.name} <${lead.email}> [${clientIP}]`);

      // 1. Google Sheets Entry (MANDATORY & AWAITED)
      const sheetsResult = await googleSheetsService.insertLead(lead);
      if (!sheetsResult.success) {
        console.error('[Leads] Google Sheets sync failed:', sheetsResult.error);
        return res.status(500).json({
          success: false,
          error: 'Submission failed: Google Sheets storage was unavailable. Please try again.',
        });
      }

      // 2. Database & Backup Sync (AWAITED for durability)
      const [supabaseResult, backupResult] = await Promise.allSettled([
        supabaseService.insertLead(lead),
        backupService.saveLead(lead),
      ]);

      // Log storage results
      if (supabaseResult.status === 'fulfilled' && supabaseResult.value.success) {
        console.log('[Leads] Supabase sync: OK');
      } else {
        console.warn('[Leads] Supabase sync: Failed —', supabaseResult.reason || supabaseResult.value?.error);
      }

      if (backupResult.status === 'fulfilled' && backupResult.value.success) {
        console.log('[Leads] Local backup sync: OK');
      }

      // 3. Email Pipeline (AWAITED for strict sequence order)
      try {
        await emailService.sendAdminNotification(lead);
        await emailService.sendAutoReply(lead);
      } catch (emailErr) {
        console.error('[Leads] Resend email dispatch failed:', emailErr.message);
        // We do not fail the request if emails fail, as data is already securely saved in Sheets/DB.
      }

      // --- Success Response ---
      return res.json({
        success: true,
        message: 'Lead captured successfully',
      });
    } catch (err) {
      console.error('[Leads] Unexpected error:', err);

      // Report to Sentry if available
      if (global.__sentry_hub) {
        const Sentry = require('@sentry/node');
        Sentry.captureException(err);
      }

      return res.status(500).json({
        success: false,
        error: 'An internal error occurred. Please try again later.',
      });
    }
  }
);

module.exports = router;
