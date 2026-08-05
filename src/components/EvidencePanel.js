import { FIELD_LABELS } from '../data/products.js';
import { Badge, statusLabel, escapeHtml } from './shared/Badge.js';
import { EmptyState } from './shared/EmptyState.js';

function confidenceClass(c) {
  if (c < 0.7) return 'is-low';
  if (c < 0.85) return 'is-med';
  return '';
}

export function EvidencePanel(state) {
  const key = state.selectedField;
  const field = key && state.productRecord ? state.productRecord[key] : null;

  let content;
  if (!state.productRecord) {
    content = EmptyState({
      title: 'Evidence viewer',
      text: 'Run the pipeline to generate evidence-linked attribute traces.',
      compact: true,
      icon: '⧉',
    });
  } else if (!field) {
    content = EmptyState({
      title: 'Select an attribute',
      text: 'Choose a field from the product table to view source document, page reference, and extracted snippet.',
      compact: true,
      icon: '↗',
    });
  } else {
    const ev = field.evidence || {};
    content = `
      <div class="evidence-block">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
          <strong style="font-size:var(--text-sm)">${escapeHtml(FIELD_LABELS[key] || key)}</strong>
          ${Badge({ label: statusLabel(field.status), variant: field.status })}
        </div>
        <dl class="evidence-meta">
          <div>
            <dt>Source document</dt>
            <dd class="field-value--mono">${escapeHtml(ev.source || '—')}</dd>
          </div>
          <div>
            <dt>Page / section</dt>
            <dd>Page ${escapeHtml(String(ev.page ?? '—'))}${
              ev.section ? `, ${escapeHtml(ev.section)}` : ''
            }</dd>
          </div>
          <div>
            <dt>Confidence score</dt>
            <dd>
              <div class="confidence-cell" style="max-width:180px">
                <div class="confidence-bar" aria-hidden="true">
                  <div class="confidence-bar__fill ${confidenceClass(field.confidence)}" style="width:${Math.round(field.confidence * 100)}%"></div>
                </div>
                <span class="confidence-pct">${Math.round(field.confidence * 100)}%</span>
              </div>
            </dd>
          </div>
        </dl>
        <div>
          <div style="font-size:var(--text-xs);font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-muted);margin-bottom:6px">
            Extracted snippet
          </div>
          <blockquote class="evidence-snippet">${escapeHtml(ev.snippet || 'No snippet available.')}</blockquote>
        </div>
      </div>
    `;
  }

  return `
    <div class="side-panel__section">
      <div class="panel-title">
        <span>Evidence &amp; traceability</span>
      </div>
      ${content}
    </div>
  `;
}

