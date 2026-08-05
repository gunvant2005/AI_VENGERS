/**
 * Validation rule definitions used to document checks.
 * Actual issues are authored per product in products.js;
 * this module provides helpers to filter and summarize.
 */

export const VALIDATION_CHECKS = [
  {
    id: 'missing_required',
    label: 'Missing required fields',
    description: 'Flags empty values for commerce-critical attributes.',
  },
  {
    id: 'unit_consistency',
    label: 'Unit consistency',
    description: 'Detects mixed measurement units within a single attribute.',
  },
  {
    id: 'duplicate_conflict',
    label: 'Duplicate or conflicting values',
    description: 'Surfaces synonymous or competing material/spec strings.',
  },
  {
    id: 'category_mismatch',
    label: 'Category mismatches',
    description: 'Checks taxonomy alignment between category and product family.',
  },
  {
    id: 'low_confidence',
    label: 'Low-confidence attributes',
    description: 'Queues attributes below the confidence review threshold.',
  },
];

export const CONFIDENCE_REVIEW_THRESHOLD = 0.7;

export function summarizeIssues(issues = []) {
  const counts = { error: 0, warning: 0, info: 0 };
  for (const issue of issues) {
    if (counts[issue.severity] !== undefined) counts[issue.severity] += 1;
  }
  return counts;
}

export function issuesForField(issues = [], fieldKey) {
  return issues.filter((i) => i.field === fieldKey);
}
