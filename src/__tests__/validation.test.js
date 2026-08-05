import { describe, it, expect } from 'vitest';
import { runValidationRules } from '../data/validationRules.js';

describe('Validation Engine', () => {
  it('should detect missing required fields in product attributes', () => {
    const incompleteRecord = {
      sku: 'TEST-SKU',
      attributes: {
        material: { value: 'Steel', confidence: 0.9 },
        // missing standard attributes
      },
    };

    const issues = runValidationRules(incompleteRecord);
    expect(issues.some((i) => i.type === 'missing_field')).toBe(true);
  });

  it('should flag low confidence attributes', () => {
    const lowConfRecord = {
      sku: 'TEST-SKU',
      attributes: {
        material: { value: 'Steel', confidence: 0.4 },
      },
    };

    const issues = runValidationRules(lowConfRecord);
    expect(issues.some((i) => i.type === 'low_confidence')).toBe(true);
  });
});
