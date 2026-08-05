import { escapeHtml, cssClass } from './Badge.js';

export function renderToasts(toasts = []) {
  const root = document.getElementById('toast-root');
  if (!root) return;
  root.innerHTML = toasts
    .map(
      (t) => `
      <div class="toast toast--${cssClass(t.type || 'success')}" role="status" data-toast-id="${escapeHtml(t.id)}">${escapeHtml(t.message)}</div>
    `
    )
    .join('');
}

export function Toast() {
  return '';
}
