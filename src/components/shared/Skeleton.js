export function SkeletonRows(count = 6) {
  return Array.from({ length: count }, () => `
    <div class="skeleton-row" aria-hidden="true">
      <div class="skeleton"></div>
      <div class="skeleton"></div>
      <div class="skeleton"></div>
      <div class="skeleton"></div>
    </div>
  `).join('');
}

export function SkeletonBlock() {
  return `<div class="skeleton skeleton-block" aria-hidden="true"></div>`;
}
