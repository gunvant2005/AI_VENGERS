import { EmptyState } from './shared/EmptyState.js';
import { Badge, escapeHtml } from './shared/Badge.js';

const copyIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

export function ExportSection(state) {
  const enabled = state.exportEnabled && state.productRecord;
  const pending = state.reviewQueue.filter((q) => q.status === 'pending').length;

  return `
    <section class="card" aria-labelledby="export-heading">
      <div class="card__header">
        <div>
          <h3 id="export-heading">Export commerce-ready output</h3>
          <p style="margin-top:4px;color:var(--text-muted);font-size:var(--text-sm)">
            Download structured product intelligence for PIM, ERP, or e-commerce ingestion.
          </p>
        </div>
        ${
          enabled
            ? Badge({ label: 'Ready', variant: 'complete' })
            : Badge({ label: 'Locked', variant: 'idle' })
        }
      </div>
      <div class="card__body">
        ${
          !enabled
            ? EmptyState({
                title: 'Export not available yet',
                text: 'Complete the intelligence pipeline to unlock JSON, CSV, and PIM-ready downloads.',
                compact: true,
                icon: '⇩',
              })
            : `
          ${
            pending > 0
              ? `<div class="phase-banner phase-banner--review" role="status">
                  <strong>${pending} field${pending === 1 ? '' : 's'} still pending review.</strong>
                  You can export now; unresolved items remain flagged in the payload metadata.
                </div>`
              : `<div class="phase-banner phase-banner--success" role="status">
                  <strong>Record ready for handoff.</strong> Validation and review metadata included.
                </div>`
          }
          <div class="export-grid">
            <div class="export-card">
              <h3>Full JSON</h3>
              <p>Complete product record with evidence traces, validation summary, and review metadata.</p>
              <div class="btn-group">
                <button type="button" class="btn btn--primary btn--sm" data-action="export-json">Download</button>
                <button type="button" class="btn btn--ghost btn--sm" data-action="copy-export" data-format="json" title="Copy JSON to clipboard">${copyIcon} Copy</button>
              </div>
            </div>
            <div class="export-card">
              <h3>CSV flat file</h3>
              <p>Tabular field / value / confidence / status / source columns for spreadsheet review.</p>
              <div class="btn-group">
                <button type="button" class="btn btn--secondary btn--sm" data-action="export-csv">Download</button>
                <button type="button" class="btn btn--ghost btn--sm" data-action="copy-export" data-format="csv" title="Copy CSV to clipboard">${copyIcon} Copy</button>
              </div>
            </div>
            <div class="export-card">
              <h3>PIM-ready JSON</h3>
              <p>Normalized attribute schema with compliance arrays and media tags for PIM ingestion.</p>
              <div class="btn-group">
                <button type="button" class="btn btn--secondary btn--sm" data-action="export-pim">Download</button>
                <button type="button" class="btn btn--ghost btn--sm" data-action="copy-export" data-format="pim" title="Copy PIM JSON to clipboard">${copyIcon} Copy</button>
              </div>
            </div>
          </div>
        `
        }
      </div>
    </section>
  `;
}
