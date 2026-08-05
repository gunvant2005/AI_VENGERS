export function Badge({ label, variant = 'neutral', showDot = false }) {
  const safe = cssClass(variant || 'neutral');
  return `
    <span class="badge badge--${safe}">
      ${showDot ? '<span class="badge__dot" aria-hidden="true"></span>' : ''}
      ${escapeHtml(label)}
    </span>
  `;
}

export function statusLabel(status) {
  const map = {
    idle: 'Idle',
    running: 'Running',
    complete: 'Complete',
    needs_review: 'Needs review',
    error: 'Error',
    extracted: 'Extracted',
    inferred: 'Inferred',
    validated: 'Validated',
    reviewed: 'Reviewed',
    rejected: 'Rejected',
  };
  return map[status] || status;
}

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function cssClass(str) {
  return String(str || '').replace(/[^a-zA-Z0-9_-]/g, '_');
}
