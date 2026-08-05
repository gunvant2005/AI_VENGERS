/**
 * Storage, Auto-Save & Recovery Service
 * Provides automatic local storage snapshot persistence, recovery, and manual backup export/import.
 */

const STORAGE_KEY = 'product_intelligence_workspace_v1';

export function saveStateSnapshot(state) {
  try {
    const snapshot = {
      version: 1,
      savedAt: new Date().toISOString(),
      data: {
        input: state.input,
        activeStage: state.activeStage,
        phase: state.phase,
        productRecord: state.productRecord,
        reviewQueue: state.reviewQueue,
        history: state.history,
        theme: state.theme,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch (err) {
    return false;
  }
}

export function loadStateSnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.data) {
      return parsed;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export function clearStateSnapshot() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    return false;
  }
}

export function exportBackupFile(state) {
  const backup = {
    app: 'Product Intelligence Industrial Commerce',
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    state: state,
  };
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `product-intelligence-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
