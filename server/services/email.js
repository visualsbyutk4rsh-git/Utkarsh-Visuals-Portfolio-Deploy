// server/services/email.js — Resend Email Service
// Handles sending admin notifications and client auto-replies.
// Gracefully degrades if Resend is not configured.

const { Resend } = require('resend');
const path = require('path');
const fs = require('fs');
const config = require('../config');

let resend = null;

/**
 * Initialize Resend client (lazy).
 */
function getClient() {
  if (resend) return resend;
  if (!config.email.isConfigured) return null;

  resend = new Resend(config.email.apiKey);
  return resend;
}

/**
 * Load and populate an HTML email template.
 * @param {string} templateName - Filename in server/templates/
 * @param {Object} variables - Key-value pairs to replace {{KEY}} placeholders
 * @returns {Promise<string>} Populated HTML string
 */
async function loadTemplate(templateName, variables = {}) {
  const templatePath = path.join(__dirname, '..', 'templates', templateName);
  let html = await fs.promises.readFile(templatePath, 'utf-8');

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(placeholder, value || '');
  }

  return html;
}

/**
 * Send the admin notification email when a new lead is captured.
 * @param {Object} lead - Sanitized lead object
 * @returns {Object} { success, error? }
 */
async function sendAdminNotification(lead) {
  const client = getClient();
  if (!client) {
    console.log('[Email] Resend not configured — skipping admin notification');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const html = await loadTemplate('admin-notification.html', {
      NAME: lead.name,
      EMAIL: lead.email,
      BUDGET: lead.budget || 'Not specified',
      SOURCE: lead.source || 'Direct',
      MESSAGE: lead.description || 'No description provided.',
      DATE: `${lead.date || new Date().toISOString().slice(0, 10)} ${lead.time || new Date().toTimeString().slice(0, 8)}`,
    });

    const { data, error } = await client.emails.send({
      from: `Utkarsh Visuals <${config.email.fromEmail}>`,
      to: [config.email.adminEmail],
      subject: `New Lead: ${lead.name}`,
      html,
    });

    if (error) {
      console.error('[Email] Admin notification failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('[Email] Admin notification sent:', data.id);
    return { success: true, id: data.id };
  } catch (err) {
    console.error('[Email] Admin notification error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send an auto-reply email to the lead/client.
 * @param {Object} lead - Sanitized lead object
 * @returns {Object} { success, error? }
 */
async function sendAutoReply(lead) {
  const client = getClient();
  if (!client) {
    console.log('[Email] Resend not configured — skipping auto-reply');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const html = await loadTemplate('auto-reply.html', {
      NAME: lead.name,
    });

    const { data, error } = await client.emails.send({
      from: `Utkarsh Visuals <${config.email.fromEmail}>`,
      to: [lead.email],
      subject: 'Thanks for your inquiry — Utkarsh Visuals',
      html,
    });

    if (error) {
      console.error('[Email] Auto-reply failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('[Email] Auto-reply sent to:', lead.email);
    return { success: true, id: data.id };
  } catch (err) {
    console.error('[Email] Auto-reply error:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendAdminNotification,
  sendAutoReply,
};
