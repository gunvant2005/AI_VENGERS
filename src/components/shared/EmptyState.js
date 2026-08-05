import { escapeHtml } from './Badge.js';

export function EmptyState({ title, text, compact = false, icon = '◇' }) {
  return `
    <div class="empty-state ${compact ? 'empty-state--compact' : ''}" role="status">
      <div class="empty-state__icon" aria-hidden="true">${escapeHtml(icon)}</div>
      <div class="empty-state__title">${escapeHtml(title)}</div>
      <p class="empty-state__text">${escapeHtml(text)}</p>
    </div>
  `;
}
