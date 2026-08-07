import './styles/tokens.css';
import './styles/reset.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/states.css';

import {
  getState,
  subscribe,
  setState,
  updateInput,
  setActiveStage,
  selectField,
  applyReviewAction,
  setEditingField,
  pushToast,
  resetPipelineUi,
  toggleTheme,
  setOutputFilter,
  undoLastReviewAction,
  bulkApprovePending,
  bulkRejectPending,
} from './state/appState.js';
import { runPipeline } from './services/pipeline.js';
import {
  exportJson,
  exportCsv,
  exportPim,
  buildFullJson,
  buildCsv,
  buildPimJson,
} from './services/export.js';

import { Header } from './components/Header.js';
import { StageRail } from './components/StageRail.js';
import { InputWorkspace } from './components/InputWorkspace.js';
import { PipelineView } from './components/PipelineView.js';
import { ProductOutput } from './components/ProductOutput.js';
import { EvidencePanel } from './components/EvidencePanel.js';
import { ValidationPanel } from './components/ValidationPanel.js';
import { ReviewWorkspace } from './components/ReviewWorkspace.js';
import { ExportSection } from './components/ExportSection.js';
import { renderToasts } from './components/shared/Toast.js';
import { setRole, checkPermission } from './services/auth.js';
import { validateFileUpload, pipelineRateLimiter } from './services/security.js';
import { trackEvent, initAnalytics } from './services/analytics.js';
import { loadStateSnapshot } from './services/storage.js';

const app = document.getElementById('app');

/** Preserve focus / scroll across re-renders where possible */
let pendingFocusSelector = null;
let reviewNotesDraft = {};
let activeInputSnapshot = null;

function applyThemeAttribute(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
  document.body.style.background = 'var(--surface-page)';
  document.body.style.color = 'var(--text-primary)';
}

function snapshotActiveInput() {
  const el = document.activeElement;
  if (!el || !app.contains(el)) {
    activeInputSnapshot = null;
    return;
  }
  if (el.matches('input, textarea')) {
    activeInputSnapshot = {
      id: el.id,
      name: el.name,
      dataEdit: el.getAttribute('data-edit-input'),
      dataNotes: el.getAttribute('data-review-notes'),
      dataFilter: el.id === 'output-filter' ? 'output-filter' : null,
      selectionStart: el.selectionStart,
      selectionEnd: el.selectionEnd,
    };
  } else {
    activeInputSnapshot = null;
  }
}

function restoreActiveInput() {
  if (!activeInputSnapshot) return;
  const { id, dataEdit, dataNotes, dataFilter, selectionStart, selectionEnd } = activeInputSnapshot;
  let el = null;
  if (id) el = document.getElementById(id);
  if (!el && dataEdit) el = document.querySelector(`[data-edit-input="${dataEdit}"]`);
  if (!el && dataNotes) el = document.querySelector(`[data-review-notes="${dataNotes}"]`);
  if (!el && dataFilter) el = document.getElementById('output-filter');
  if (el && typeof el.focus === 'function') {
    el.focus();
    if (typeof el.setSelectionRange === 'function' && selectionStart != null) {
      try {
        el.setSelectionRange(selectionStart, selectionEnd);
      } catch {
        /* non-text inputs */
      }
    }
  }
  activeInputSnapshot = null;
}

function captureTransientFormState() {
  const notes = {};
  document.querySelectorAll('[data-review-notes]').forEach((el) => {
    notes[el.getAttribute('data-review-notes')] = el.value;
  });
  reviewNotesDraft = { ...reviewNotesDraft, ...notes };

  const sku = document.getElementById('input-sku');
  const desc = document.getElementById('input-description');
  const notesEl = document.getElementById('input-notes');
  if (sku || desc || notesEl) {
    const current = getState().input;
    updateInput({
      sku: sku ? sku.value : current.sku,
      description: desc ? desc.value : current.description,
      notes: notesEl ? notesEl.value : current.notes,
    });
  }

  const filterEl = document.getElementById('output-filter');
  if (filterEl) {
    setState({ outputFilter: filterEl.value });
  }
}

function flushReviewNotesToState() {
  const s = getState();
  if (!s.reviewQueue.length) return;
  document.querySelectorAll('[data-review-notes]').forEach((el) => {
    const field = el.getAttribute('data-review-notes');
    reviewNotesDraft[field] = el.value;
  });
  Object.entries(reviewNotesDraft).forEach(([field, notes]) => {
    if (s.reviewQueue.some((q) => q.field === field)) {
      applyReviewAction(field, 'notes', { notes });
    }
  });
}

function phaseBanner(state) {
  if (state.phase === 'processing') {
    return `<div class="phase-banner phase-banner--processing" role="status"><strong>Pipeline running.</strong> Extracting and validating product intelligence…</div>`;
  }
  if (state.phase === 'review') {
    const pending = state.reviewQueue.filter((q) => q.status === 'pending').length;
    return `<div class="phase-banner phase-banner--review" role="status"><strong>Human review required.</strong> ${pending} attribute${pending === 1 ? '' : 's'} below confidence threshold.</div>`;
  }
  if (state.phase === 'complete') {
    return `<div class="phase-banner phase-banner--success" role="status"><strong>Intelligence complete.</strong> Structured record ready for export.</div>`;
  }
  if (state.phase === 'error') {
    return `<div class="phase-banner phase-banner--error" role="alert"><strong>Pipeline error.</strong> Reset the workspace and try again.</div>`;
  }
  return '';
}

function renderMain(state) {
  const stage = state.activeStage;

  if (stage === 'input') {
    return `
      ${phaseBanner(state)}
      <div class="workspace-stack">
        ${InputWorkspace(state)}
        ${PipelineView(state)}
        ${state.productRecord ? ProductOutput(state) : ''}
      </div>
    `;
  }

  if (stage === 'process') {
    return `
      ${phaseBanner(state)}
      <div class="workspace-stack">
        ${PipelineView(state)}
        ${ProductOutput(state)}
      </div>
    `;
  }

  if (stage === 'review') {
    return `
      ${phaseBanner(state)}
      <div class="workspace-stack">
        ${ReviewWorkspace(state)}
        ${ProductOutput(state)}
      </div>
    `;
  }

  if (stage === 'export') {
    return `
      ${phaseBanner(state)}
      <div class="workspace-stack">
        ${ExportSection(state)}
        ${ProductOutput(state)}
      </div>
    `;
  }

  return InputWorkspace(state);
}

function render(state) {
  applyThemeAttribute(state.theme);
  snapshotActiveInput();
  app.innerHTML = `
    <div class="app-shell">
      ${Header(state)}
      <div class="app-body">
        ${StageRail(state)}
        <main id="main-workspace" class="main-workspace" tabindex="-1">
          ${renderMain(state)}
        </main>
        <aside class="side-panel" aria-label="Validation and evidence">
          ${ValidationPanel(state)}
          ${EvidencePanel(state)}
        </aside>
      </div>
    </div>
  `;

  renderToasts(state.toasts);
  restoreTransientUi(state);
  restoreActiveInput();
}

function restoreTransientUi(state) {
  Object.entries(reviewNotesDraft).forEach(([field, value]) => {
    const el = document.querySelector(`[data-review-notes="${field}"]`);
    if (el && state.reviewQueue.some((q) => q.field === field)) {
      el.value = value;
    }
  });

  if (pendingFocusSelector) {
    const el = document.querySelector(pendingFocusSelector);
    if (el) {
      el.focus();
      if (typeof el.select === 'function' && el.tagName === 'INPUT') el.select();
    }
    pendingFocusSelector = null;
  }
}

function syncInputFromDom() {
  const sku = document.getElementById('input-sku');
  const desc = document.getElementById('input-description');
  const notesEl = document.getElementById('input-notes');
  if (!sku && !desc && !notesEl) return;
  updateInput({
    sku: sku?.value ?? getState().input.sku,
    description: desc?.value ?? getState().input.description,
    notes: notesEl?.value ?? getState().input.notes,
  });
}

function getNotesForField(field) {
  const el = document.querySelector(`[data-review-notes="${field}"]`);
  return el ? el.value : reviewNotesDraft[field] || '';
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(String(text ?? ''));
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement('textarea');
    ta.value = String(text ?? '');
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

function bindGlobalEvents() {
  document.addEventListener('click', async (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.getAttribute('data-action');
    const field = target.getAttribute('data-field');

    if (action === 'set-stage') {
      captureTransientFormState();
      setActiveStage(target.getAttribute('data-stage'));
      return;
    }

    if (action === 'demo-sku') {
      updateInput({ sku: target.getAttribute('data-sku') });
      return;
    }

    if (action === 'auto-run-demo') {
      updateInput({
        sku: 'HEX-M12-50',
        description: 'M12 x 50mm Stainless Steel 316 Hex Head Bolt, DIN 933 ISO 4017 fully threaded high corrosion resistance.',
        notes: 'Auto-run demo pipeline with sample fastener catalog data.',
      });
      pushToast('Starting Auto-Run Demo pipeline…', 'info');
      await runPipeline();
      if (getState().phase === 'processing' || getState().productRecord) {
        setActiveStage('process');
      }
      return;
    }

    if (action === 'reset-app') {
      reviewNotesDraft = {};
      resetPipelineUi();
      pushToast('Workspace reset', 'success');
      return;
    }

    if (action === 'toggle-theme') {
      toggleTheme();
      return;
    }

    if (action === 'select-field') {
      selectField(field);
      return;
    }

    if (action === 'copy-field') {
      e.preventDefault();
      e.stopPropagation();
      const value = getState().productRecord?.[field]?.value ?? '';
      const ok = await copyToClipboard(value);
      if (ok && target.isConnected) {
        target.classList.add('is-copied');
        const orig = target.innerHTML;
        target.textContent = '✓';
        setTimeout(() => {
          if (target.isConnected) {
            target.classList.remove('is-copied');
            target.innerHTML = orig;
          }
        }, 1200);
      }
      pushToast(ok ? 'Value copied to clipboard' : 'Copy failed', ok ? 'success' : 'error');
      return;
    }

    if (action === 'copy-export') {
      const format = target.getAttribute('data-format');
      let payload = '';
      if (format === 'json') payload = JSON.stringify(buildFullJson(), null, 2);
      else if (format === 'csv') payload = buildCsv();
      else if (format === 'pim') payload = JSON.stringify(buildPimJson(), null, 2);
      const ok = await copyToClipboard(payload);
      pushToast(
        ok ? `${format.toUpperCase()} copied to clipboard` : 'Copy failed',
        ok ? 'success' : 'error'
      );
      return;
    }

    if (action === 'undo-review') {
      captureTransientFormState();
      const ok = undoLastReviewAction();
      pushToast(ok ? 'Last action undone' : 'Nothing to undo', ok ? 'success' : 'warning');
      return;
    }

    if (action === 'bulk-approve') {
      captureTransientFormState();
      const n = bulkApprovePending();
      pushToast(
        n > 0 ? `Approved ${n} field${n === 1 ? '' : 's'}` : 'No pending fields',
        n > 0 ? 'success' : 'warning'
      );
      return;
    }

    if (action === 'bulk-reject') {
      captureTransientFormState();
      const n = bulkRejectPending();
      pushToast(
        n > 0 ? `Rejected ${n} field${n === 1 ? '' : 's'}` : 'No pending fields',
        n > 0 ? 'warning' : 'warning'
      );
      return;
    }

    if (action === 'approve-field') {
      captureTransientFormState();
      applyReviewAction(field, 'approve', { notes: getNotesForField(field) });
      pushToast(`${field} approved`, 'success');
      return;
    }

    if (action === 'reject-field') {
      captureTransientFormState();
      applyReviewAction(field, 'reject', { notes: getNotesForField(field) });
      pushToast(`${field} rejected`, 'warning');
      return;
    }

    if (action === 'edit-field') {
      captureTransientFormState();
      pendingFocusSelector = `#edit-${field}`;
      setEditingField(field);
      return;
    }

    if (action === 'cancel-edit') {
      setEditingField(null);
      return;
    }

    if (action === 'save-edit') {
      const input = document.querySelector(`[data-edit-input="${field}"]`);
      const value = input ? input.value.trim() : '';
      captureTransientFormState();
      applyReviewAction(field, 'edit', { value, notes: getNotesForField(field) });
      pushToast(`${field} updated`, 'success');
      return;
    }

    if (action === 'export-json') {
      flushReviewNotesToState();
      exportJson();
      pushToast('JSON export downloaded', 'success');
      return;
    }

    if (action === 'export-csv') {
      flushReviewNotesToState();
      exportCsv();
      pushToast('CSV export downloaded', 'success');
      return;
    }

    if (action === 'export-pim') {
      flushReviewNotesToState();
      exportPim();
      pushToast('PIM-ready JSON downloaded', 'success');
      return;
    }

    if (action === 'run-pipeline') {
      e.preventDefault();
      syncInputFromDom();
      await runPipeline();
      return;
    }
  });

  document.addEventListener('submit', async (e) => {
    if (e.target.id === 'input-form') {
      e.preventDefault();
      syncInputFromDom();
      await runPipeline();
      if (getState().phase === 'processing' || getState().productRecord) {
        setActiveStage('process');
      }
    }
  });

  document.addEventListener('input', (e) => {
    if (
      e.target.id === 'input-sku' ||
      e.target.id === 'input-description' ||
      e.target.id === 'input-notes'
    ) {
      updateInput({
        sku: document.getElementById('input-sku')?.value ?? getState().input.sku,
        description: document.getElementById('input-description')?.value ?? getState().input.description,
        notes: document.getElementById('input-notes')?.value ?? getState().input.notes,
      });
      return;
    }

    if (e.target.id === 'output-filter') {
      setOutputFilter(e.target.value);
      return;
    }

    if (e.target.matches('[data-review-notes]')) {
      const field = e.target.getAttribute('data-review-notes');
      reviewNotesDraft[field] = e.target.value;
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'select-preset-sku') {
      const sku = e.target.value;
      if (sku) {
        updateInput({ sku });
        pushToast(`Loaded product template: ${sku}`, 'success');
        trackEvent('Input', 'select_preset_sku', sku);
      }
      return;
    }

    if (e.target.id === 'role-select') {
      const newRole = e.target.value;
      setRole(newRole);
      pushToast(`Role changed to: ${newRole.toUpperCase()}`, 'info');
      trackEvent('Auth', 'change_role', newRole);
      render(getState());
      return;
    }

    if (e.target.id === 'skip-animation') {
      setState({ skipAnimation: e.target.checked });
      return;
    }

    if (e.target.id === 'input-pdf') {
      const file = e.target.files?.[0] || null;
      if (file) {
        const check = validateFileUpload(file, 'pdf');
        if (!check.valid) {
          pushToast(check.error, 'error');
          e.target.value = '';
          return;
        }
      }
      updateInput({ pdf: file ? { name: file.name, size: file.size, type: file.type } : null });
      trackEvent('Input', 'upload_file', 'pdf');
      return;
    }

    if (e.target.id === 'input-image') {
      const file = e.target.files?.[0] || null;
      if (file) {
        const check = validateFileUpload(file, 'image');
        if (!check.valid) {
          pushToast(check.error, 'error');
          e.target.value = '';
          return;
        }
      }
      const prev = getState().input.imagePreviewUrl;
      if (prev) URL.revokeObjectURL(prev);
      updateInput({
        image: file ? { name: file.name, size: file.size, type: file.type } : null,
        imagePreviewUrl: file ? URL.createObjectURL(file) : null,
      });
      trackEvent('Input', 'upload_file', 'image');
      return;
    }
  });

  document.addEventListener('keydown', (e) => {
    const row = e.target.closest('tr[data-action="select-field"]');
    if (row && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      selectField(row.getAttribute('data-field'));
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const form = document.getElementById('input-form');
      if (form && document.activeElement && form.contains(document.activeElement)) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.click();
        return;
      }

      const notes = e.target.closest('[data-review-notes]');
      if (notes) {
        e.preventDefault();
        const field = notes.getAttribute('data-review-notes');
        const item = getState().reviewQueue.find((q) => q.field === field);
        if (item && item.status === 'pending') {
          if (!checkPermission('canReview')) {
            pushToast('Viewer role cannot approve review items', 'error');
            return;
          }
          applyReviewAction(field, 'approve', { notes: notes.value });
          pushToast(`${field} approved`, 'success');
          trackEvent('Review', 'approve_field', field);
        }
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      const s = getState();
      if (s.productRecord) {
        exportJson();
        pushToast('Exported full product JSON record (Ctrl+S)', 'success');
        trackEvent('Export', 'shortcut_export', 'json');
      }
    }

    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
      const inEditableText =
        e.target.matches('textarea, input[type="text"], input[type="search"]') && !e.target.readOnly;
      if (!inEditableText) {
        e.preventDefault();
        const ok = undoLastReviewAction();
        if (ok) pushToast('Last action undone', 'success');
      }
    }
  });

  document.addEventListener('dragover', (e) => {
    const zone = e.target.closest('.upload-zone');
    if (!zone) return;
    e.preventDefault();
    zone.classList.add('is-dragover');
  });

  document.addEventListener('dragleave', (e) => {
    const zone = e.target.closest('.upload-zone');
    if (!zone) return;
    zone.classList.remove('is-dragover');
  });

  document.addEventListener('drop', (e) => {
    const zone = e.target.closest('.upload-zone');
    if (!zone) return;
    e.preventDefault();
    zone.classList.remove('is-dragover');
    const input = zone.querySelector('input[type="file"]');
    if (!input || !e.dataTransfer?.files?.length) return;
    const file = e.dataTransfer.files[0];
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

subscribe((state) => {
  render(state);
});

bindGlobalEvents();
initAnalytics();
applyThemeAttribute(getState().theme);

// Restore workspace snapshot if available
const snapshot = loadStateSnapshot();
if (snapshot && snapshot.data && snapshot.data.productRecord) {
  setState({
    input: snapshot.data.input || getState().input,
    activeStage: snapshot.data.activeStage || 'input',
    phase: snapshot.data.phase || 'empty',
    productRecord: snapshot.data.productRecord,
    reviewQueue: snapshot.data.reviewQueue || [],
    theme: snapshot.data.theme || getState().theme,
    exportEnabled: true,
  });
  pushToast('Restored state from local backup snapshot', 'info');
}

render(getState());
