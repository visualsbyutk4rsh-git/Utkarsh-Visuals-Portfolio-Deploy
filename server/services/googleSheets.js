// server/services/googleSheets.js — Google Sheets Service
// Sends lead data directly to the Google Apps Script Web App.
// Engineered with retry safety, structured logging, and redirect handling.

const config = require('../config');

/**
 * Send lead details to Google Sheets Web App.
 * @param {Object} lead - Sanitized lead object
 * @returns {Promise<Object>} { success, error? }
 */
async function insertLead(lead) {
  const url = config.googleSheets.url;
  if (!url) {
    console.warn('[Google Sheets] Not configured — skipping sheet entry');
    return { success: false, error: 'Google Sheets URL is not configured.' };
  }

  const payload = {
    name: lead.name,
    email: lead.email,
    budget: lead.budget || 'Contact Form Quote Request',
    description: lead.description,
    source: lead.source || 'Direct',
    page: lead.page || 'Home',
    date: lead.date || new Date().toLocaleDateString(),
    time: lead.time || new Date().toLocaleTimeString(),
    ip: lead.ip || 'Unknown',
  };

  const maxRetries = 3;
  let delay = 200; // Initial delay in ms

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Google Sheets] Submitting lead attempt ${attempt}/${maxRetries} to URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        redirect: 'follow', // Crucial for Apps Script redirects
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        // Apps Script sometimes returns plain text or success message
        console.warn('[Google Sheets] Response is not valid JSON, raw text received:', text);
        if (text.toLowerCase().includes('success') || text.toLowerCase().includes('ok')) {
          data = { success: true };
        } else {
          data = { success: false, error: 'Invalid JSON response from Google Script' };
        }
      }

      // Check success key (some apps scripts return success: true or status: "success" or result: "success")
      const isSuccess = data.success === true || 
                        data.status === 'success' || 
                        data.result === 'success' || 
                        data.success === 'true';

      if (isSuccess) {
        console.log('[Google Sheets] Lead successfully logged to sheet!');
        return { success: true };
      } else {
        throw new Error(data.error || data.message || 'Apps Script returned failure status');
      }

    } catch (err) {
      console.error(`[Google Sheets] Attempt ${attempt} failed:`, err.message);
      
      if (attempt === maxRetries) {
        return { success: false, error: err.message };
      }
      
      // Exponential backoff delay
      console.log(`[Google Sheets] Waiting ${delay}ms before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2.5; // Exponential scale factor
    }
  }
}

module.exports = { insertLead };
