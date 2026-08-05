import { describe, it, expect } from 'vitest';
import { sanitizeInput, validateInputLength, validateFileUpload } from '../services/security.js';

describe('Security & Validation Utilities', () => {
  it('should sanitize HTML strings to prevent XSS injection', () => {
    const malicious = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(malicious);
    expect(sanitized).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });

  it('should enforce input length limits', () => {
    const longString = 'a'.repeat(10001);
    expect(validateInputLength('short', 100)).toBe(true);
    expect(validateInputLength(longString, 10000)).toBe(false);
  });

  it('should validate file extension and size for upload security', () => {
    const validPdf = { name: 'tech_sheet.pdf', size: 1024 * 1024, type: 'application/pdf' };
    const invalidFile = { name: 'malicious.exe', size: 1024, type: 'application/x-msdownload' };
    const oversizedFile = { name: 'large.pdf', size: 20 * 1024 * 1024, type: 'application/pdf' };

    expect(validateFileUpload(validPdf, 'pdf').valid).toBe(true);
    expect(validateFileUpload(invalidFile, 'pdf').valid).toBe(false);
    expect(validateFileUpload(oversizedFile, 'pdf').valid).toBe(false);
  });
});
