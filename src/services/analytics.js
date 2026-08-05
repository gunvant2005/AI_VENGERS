/**
 * Analytics & User Tracking Service
 * Integrates Google Analytics 4 (GA4) and maintains a structured event log for user behavior tracking.
 */

let eventLog = [];

export function initAnalytics(measurementId = 'G-DEMO123456') {
  if (typeof window === 'undefined') return;

  // Global window.gtag definition
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, { send_page_view: true });
}

export function trackEvent(category, action, label = null, value = null) {
  const payload = {
    timestamp: new Date().toISOString(),
    category,
    action,
    label,
    value,
  };

  eventLog.unshift(payload);
  if (eventLog.length > 100) eventLog.pop();

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

export function trackPageView(pageName) {
  trackEvent('Navigation', 'page_view', pageName);
}

export function getEventLog() {
  return [...eventLog];
}
