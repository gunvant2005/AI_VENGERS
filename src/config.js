/**
 * Environment Configuration Manager
 * Handles environment variables safely with fallback defaults for production deployment.
 */

export const config = {
  appName: import.meta.env?.VITE_APP_TITLE || 'Product Intelligence | Industrial Commerce',
  apiBaseUrl: import.meta.env?.VITE_API_BASE_URL || 'https://api.product-intelligence.industrial/v1',
  environment: import.meta.env?.VITE_APP_ENV || 'production',
  enableAnalytics: import.meta.env?.VITE_ENABLE_ANALYTICS !== 'false',
  gaMeasurementId: import.meta.env?.VITE_GA_ID || 'G-DEMO123456',
  maxFileUploadSizeMb: 10,
  rateLimitWindowMs: 10000,
  maxPipelineRequestsPerWindow: 5,
};
