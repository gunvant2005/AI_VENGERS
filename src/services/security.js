/**
 * Security & Input Validation Service
 * Provides sanitization, rate-limiting, file security checks, and payload bounds.
 */

/** Sanitize dynamic string against XSS attacks */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/** Validate input size constraints to prevent memory payload buffer overflow */
export function validateInputLength(input, maxLen = 10000) {
  if (!input) return true;
  return String(input).length <= maxLen;
}

/** Allowed MIME types and max size validation for file uploads */
const ALLOWED_FILE_TYPES = {
  pdf: ['application/pdf', '.pdf'],
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', '.jpeg', '.jpg', '.png', '.webp'],
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit

export function validateFileUpload(file, expectedType = 'pdf') {
  if (!file) return { valid: true };

  // Size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds 10MB limit (uploaded: ${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  // File extension & type check
  const allowed = ALLOWED_FILE_TYPES[expectedType] || [];
  const fileNameLower = (file.name || '').toLowerCase();
  const fileTypeLower = (file.type || '').toLowerCase();

  const extensionMatch = allowed.some((ext) => fileNameLower.endsWith(ext));
  const typeMatch = allowed.some((mime) => fileTypeLower.includes(mime.replace('.', '')));

  if (!extensionMatch && !typeMatch) {
    return {
      valid: false,
      error: `Invalid file format for ${file.name}. Allowed types for ${expectedType}: ${allowed.join(', ')}.`,
    };
  }

  return { valid: true };
}

/** Rate limiter to prevent rapid submission spam */
class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 10000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.timestamps = [];
  }

  canExecute() {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((ts) => now - ts < this.windowMs);
    if (this.timestamps.length >= this.maxAttempts) {
      return false;
    }
    this.timestamps.push(now);
    return true;
  }

  reset() {
    this.timestamps = [];
  }
}

export const pipelineRateLimiter = new RateLimiter(5, 10000);
