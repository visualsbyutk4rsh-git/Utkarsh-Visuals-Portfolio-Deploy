// server/services/backup.js — Local JSON Backup Service
// Provides a reliable local file backup for leads when Supabase is unavailable.

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

/**
 * Ensure the data directory exists.
 */
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore error if directory already exists
  }
}

/**
 * Save a lead to the local JSON backup file.
 * @param {Object} lead - Sanitized lead object
 * @returns {Promise<Object>} { success, error? }
 */
async function saveLead(lead) {
  try {
    await ensureDataDir();

    let leads = [];
    let fileExists = false;
    try {
      await fs.access(LEADS_FILE);
      fileExists = true;
    } catch {
      fileExists = false;
    }

    if (fileExists) {
      const raw = await fs.readFile(LEADS_FILE, 'utf-8');
      try {
        const parsed = JSON.parse(raw);
        leads = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // If file is corrupted, start fresh but keep backup
        const backupPath = LEADS_FILE + '.backup.' + Date.now();
        try {
          await fs.copyFile(LEADS_FILE, backupPath);
          console.warn('[Backup] Corrupted leads.json backed up to:', backupPath);
        } catch (copyErr) {
          console.error('[Backup] Failed to copy corrupted file:', copyErr.message);
        }
        leads = [];
      }
    }

    leads.push({
      ...lead,
      _backupTimestamp: new Date().toISOString(),
    });

    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    console.log('[Backup] Lead saved to local backup (' + leads.length + ' total)');
    return { success: true };
  } catch (err) {
    console.error('[Backup] Failed to save lead:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Read all leads from the local backup.
 * @returns {Promise<Array>}
 */
async function readLeads() {
  try {
    await fs.access(LEADS_FILE);
    const raw = await fs.readFile(LEADS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

module.exports = { saveLead, readLeads };
