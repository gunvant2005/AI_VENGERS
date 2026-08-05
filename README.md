# Product Intelligence — Industrial Commerce

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Security Headers](https://img.shields.io/badge/Security-CSP%20%7C%20XSS%20Safe-success?style=flat-square)](#security--compliance)
[![Testing](https://img.shields.io/badge/Tests-Vitest%20Configured-green?style=flat-square)](#automated-testing)
[![SEO](https://img.shields.io/badge/SEO-OpenGraph%20%7C%20JSON--LD-blue?style=flat-square)](#seo--metadata)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square)](LICENSE)

An enterprise-grade, AI-powered product intelligence workspace for industrial manufacturers and B2B distributor commerce. Converts unstructured, fragmented product inputs (SKUs, technical PDFs, spec sheets, supplier text) into structured, evidence-linked, commerce-ready records.

---

## 🌟 Key Features & Capabilities

- **Input Workspace**: Ingests SKU codes, supplier text, technical PDFs, and CAD/product images.
- **Simulated AI Pipeline**: 6-stage pipeline (Ingestion → Parsing → Extraction → Enrichment → Validation → Human Review → Export).
- **Evidence Traceability**: Every extracted attribute is linked to source documents, page numbers, and exact text snippets.
- **Validation Engine**: Real-time detection of missing attributes, unit mismatches, low confidence scores, and taxonomy discrepancies.
- **Human-in-the-Loop Review**: Granular approval, inline editing, rejection, notes, bulk actions, and multi-step undo (`Ctrl+Z`).
- **Role-Based Access Control (RBAC)**: Supports Admin, Reviewer, and Viewer permission roles.
- **Auto-Save & Snapshot Recovery**: Automatically saves state to local storage to prevent data loss across session restarts.
- **Multi-Format Export**: Full JSON, CSV spreadsheet format, and PIM-ready JSON payload.

---

## 🔒 Security & Compliance

- **XSS Prevention**: Strict HTML escaping (`escapeHtml()`) applied to all dynamic content rendering.
- **Content Security Policy (CSP)**: Hardened meta headers restrict script execution, font sources, and connect origins.
- **File Upload Security**: Enforces file type verification (MIME + Extension) and maximum 10MB file payload limits.
- **Rate Limiting**: Includes pipeline request throttling (max 5 requests / 10 sec) to prevent abuse.
- **RBAC Enforcement**: Prevents read-only Viewer roles from executing pipeline modifications.

---

## 🚀 Quick Start & Development

```bash
# Install dependencies
npm install

# Run Vite dev server
npm run dev

# Run automated Vitest suite
npm run test

# Build for production
npm run build

# Preview production build locally
npm run preview
```

Open your browser at `http://localhost:5173`.

---

## 🧪 Automated Testing

Unit test suites are configured via **Vitest** ([vite.config.js](file:///c:/Users/dhake/OneDrive/Apps/Desktop/UniHack%202/vite.config.js)):

```bash
npm run test
```

### Test Coverage:
- `src/__tests__/pipeline.test.js` — Pipeline engine & fallback SKU generator
- `src/__tests__/validation.test.js` — Validation rules & anomaly detection
- `src/__tests__/export.test.js` — JSON, CSV, and PIM format builders
- `src/__tests__/security.test.js` — Input sanitization, file limits, and rate limiting

---

## 🌐 SEO & Social Optimization

- **Meta Tags**: Full Open Graph (`og:*`) and Twitter Card metadata.
- **Structured Data**: Embedded JSON-LD `SoftwareApplication` schema in `index.html`.
- **Sitemap & Robots**: Standard [public/sitemap.xml](file:///c:/Users/dhake/OneDrive/Apps/Desktop/UniHack%202/public/sitemap.xml) and [public/robots.txt](file:///c:/Users/dhake/OneDrive/Apps/Desktop/UniHack%202/public/robots.txt).

---

## 💾 Backup & Disaster Recovery

Refer to [BACKUP_RECOVERY.md](file:///c:/Users/dhake/OneDrive/Apps/Desktop/UniHack%202/BACKUP_RECOVERY.md) for full server-side PostgreSQL recovery procedures, RTO/RPO metrics, and WAL archiving policies.

---

## ⌨️ UX Keyboard Shortcuts

- `Ctrl + Enter`: Submit input form / Approve highlighted review item
- `Ctrl + S`: Quick Export Full Product JSON
- `Ctrl + Z`: Undo last review action
- `Esc`: Cancel inline editing

---

## 📖 API Documentation

Refer to [API_DOCUMENTATION.md](file:///c:/Users/dhake/OneDrive/Apps/Desktop/UniHack%202/API_DOCUMENTATION.md) for data schemas and endpoint contracts.
