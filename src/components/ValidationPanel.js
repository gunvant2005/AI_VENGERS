import { FIELD_LABELS } from '../data/products.js';
import { summarizeIssues } from '../data/validationRules.js';
import { Badge, escapeHtml, cssClass } from './shared/Badge.js';
import { EmptyState } from './shared/EmptyState.js';

export function ValidationPanel(state) {
  const issues = state.validationIssues || [];
  const counts = summarizeIssues(issues);

  let content;
  if (!state.productRecord) {
    content = EmptyState({
      title: 'Validation idle',
      text: 'Attribute validation results will appear after the validation pipeline step.',
      compact: true,
      icon: '☑',
    });
  } else if (!issues.length) {
    content = `
      <div class="phase-banner phase-banner--success" role="status">
        <strong>All checks passed.</strong> No open validation issues.
      </div>
    `;
  } else {
    content = `
      <div class="issue-list" role="list" aria-live="polite">
        ${issues
          .map(
            (issue) => `
          <button
            type="button"
            class="issue-item issue-item--${cssClass(issue.severity)}"
            data-action="select-field"
            data-field="${escapeHtml(issue.field)}"
            role="listitem"
          >
            <div class="issue-item__top">
              <span class="issue-item__field">${escapeHtml(FIELD_LABELS[issue.field] || issue.field)}</span>
              ${Badge({
                label: issue.severity,
                variant: issue.severity === 'info' ? 'running' : issue.severity,
              })}
            </div>
            <div class="issue-item__msg">${escapeHtml(issue.message)}</div>
            <div class="issue-item__fix">Suggested fix: ${escapeHtml(issue.suggestion)}</div>
          </button>
        `
          )
          .join('')}
      </div>
    `;
  }

  return `
    <div class="side-panel__section">
      <div class="panel-title">
        <span>Validation</span>
        ${
          issues.length
            ? `<span class="badge badge--neutral" aria-live="polite">${counts.error}E · ${counts.warning}W · ${counts.info}I</span>`
            : ''
        }
      </div>
      ${content}
    </div>
  `;
}
