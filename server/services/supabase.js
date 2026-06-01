// server/services/supabase.js — Supabase Database Service
// Handles all database operations. Gracefully degrades if Supabase is not configured.

const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

let supabase = null;

/**
 * Initialize Supabase client (lazy, only when configured).
 */
function getClient() {
  if (supabase) return supabase;
  if (!config.supabase.isConfigured) return null;

  supabase = createClient(config.supabase.url, config.supabase.anonKey, {
    auth: { persistSession: false },
  });

  return supabase;
}

/**
 * Insert a new lead into the leads table.
 * @param {Object} lead - Sanitized lead data
 * @returns {Object} { success, data?, error? }
 */
async function insertLead(lead) {
  const client = getClient();
  if (!client) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await client
      .from('leads')
      .insert({
        name: lead.name,
        email: lead.email,
        budget: lead.budget || 'Not specified',
        description: lead.description || '',
        source: lead.source || 'Modal Lead Form',
        page: lead.page || '',
        ip: lead.ip || null,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Insert error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('[Supabase] Lead inserted:', data.id);
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase] Unexpected error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Log an analytics event to the analytics_events table.
 * @param {Object} event - { event_type, event_data, page, ip, user_agent }
 * @returns {Object} { success, error? }
 */
async function logAnalyticsEvent(event) {
  const client = getClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  try {
    const { error } = await client
      .from('analytics_events')
      .insert({
        event_type: event.event_type,
        event_data: event.event_data || {},
        page: event.page || '',
        ip: event.ip || null,
        user_agent: event.user_agent || '',
      });

    if (error) {
      console.error('[Supabase] Analytics error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('[Supabase] Analytics unexpected error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Get a site setting by key.
 * @param {string} key
 * @returns {Object|null}
 */
async function getSetting(key) {
  const client = getClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) return null;
    return data?.value || null;
  } catch {
    return null;
  }
}

module.exports = {
  getClient,
  insertLead,
  logAnalyticsEvent,
  getSetting,
};
