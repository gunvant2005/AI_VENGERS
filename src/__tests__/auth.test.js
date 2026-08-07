import { describe, it, expect } from 'vitest';
import { checkPermission, setRole, ROLES } from '../services/auth.js';
import { sanitizeSqlInjection, validatePasswordStrength } from '../services/security.js';

describe('Auth RBAC & Password Security Utilities', () => {
  it('should grant full permissions to ADMIN role', () => {
    setRole(ROLES.ADMIN);
    expect(checkPermission('canRunPipeline')).toBe(true);
    expect(checkPermission('canReview')).toBe(true);
    expect(checkPermission('canResetState')).toBe(true);
  });

  it('should restrict state reset permission for REVIEWER role', () => {
    setRole(ROLES.REVIEWER);
    expect(checkPermission('canRunPipeline')).toBe(true);
    expect(checkPermission('canReview')).toBe(true);
    expect(checkPermission('canResetState')).toBe(false);
  });

  it('should restrict pipeline execution for VIEWER role', () => {
    setRole(ROLES.VIEWER);
    expect(checkPermission('canRunPipeline')).toBe(false);
    expect(checkPermission('canReview')).toBe(false);
    expect(checkPermission('canExport')).toBe(true);
  });

  it('should strip SQL injection keywords from malicious inputs', () => {
    const malicious = "SELECT * FROM users WHERE '1'='1'; DROP TABLE products;";
    const cleaned = sanitizeSqlInjection(malicious);
    expect(cleaned).not.toContain('SELECT');
    expect(cleaned).not.toContain('DROP');
    expect(cleaned).not.toContain("'");
  });

  it('should validate password complexity requirement', () => {
    expect(validatePasswordStrength('weak').valid).toBe(false);
    expect(validatePasswordStrength('StrongP@ss123').valid).toBe(true);
  });
});
