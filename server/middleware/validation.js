// server/middleware/validation.js — Input Validation & Sanitization
// Uses express-validator to validate and sanitize lead form inputs.

const { body, validationResult } = require('express-validator');
const config = require('../config');

/**
 * Strips HTML tags and dangerous patterns from a string.
 */
function stripHtml(str) {
  if (!str) return '';
  return str
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Validation chain for the leads API endpoint.
 */
const validateLead = [
  body('name')
    .trim()
    .customSanitizer(stripHtml)
    .isLength({ min: config.validation.minNameLength, max: config.validation.maxNameLength })
    .withMessage(`Name must be ${config.validation.minNameLength}-${config.validation.maxNameLength} characters.`),

  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email address is required.'),

  body('budget')
    .optional()
    .trim()
    .customSanitizer(stripHtml)
    .customSanitizer((value) => {
      return config.validation.allowedBudgets.includes(value)
        ? value
        : 'Contact Form Quote Request';
    }),

  body('description')
    .optional()
    .trim()
    .customSanitizer(stripHtml)
    .isLength({ max: config.validation.maxDescriptionLength })
    .withMessage(`Description must be under ${config.validation.maxDescriptionLength} characters.`),

  body('source')
    .optional()
    .trim()
    .customSanitizer(stripHtml)
    .isLength({ max: 200 }),

  body('page')
    .optional()
    .trim()
    .customSanitizer(stripHtml)
    .isLength({ max: 500 }),

  // Honeypot field — must be empty for legitimate submissions
  body('_hp')
    .optional(),
];

/**
 * Middleware to check validation results and return errors.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map((e) => e.msg),
    });
  }
  next();
}

module.exports = { validateLead, handleValidationErrors, stripHtml };
