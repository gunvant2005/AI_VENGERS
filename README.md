<div align="center">

# ⚡ Product Intelligence — Industrial Commerce
### *Enterprise AI-Powered Product Intelligence & Data Normalization Engine*

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vitest](https://img.shields.io/badge/Vitest-5_Suites_Passing-252529?style=for-the-badge&logo=vitest&logoColor=73C21B)](https://vitest.dev/)
[![Security](https://img.shields.io/badge/Security-A%2B_CSP_%7C_XSS_%7C_SQLi-success?style=for-the-badge&logo=shield)](https://github.com/gunvant2005/AI_VENGERS)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<br/>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gunvant2005/AI_VENGERS)
&nbsp;&nbsp;
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/gunvant2005/AI_VENGERS)

</div>

---

## 📖 Overview

**Product Intelligence** is an enterprise-grade AI intelligence platform designed for industrial manufacturers, B2B distributors, and e-commerce catalogs. It ingests fragmented product inputs (SKUs, technical PDFs, spec sheets, supplier copy, and images) and normalizes them into **structured, evidence-linked, commerce-ready records**.

---

## 🌟 Key Platform Features

| Feature Module | Description & Capabilities |
|---|---|
| 📥 **Input Workspace** | Multi-modal ingestion of SKU codes, supplier text copy, technical PDF data sheets, and product images with instant preset loading. |
| ⚡ **6-Stage Pipeline Engine** | Asynchronous execution: `Ingestion` → `Parsing` → `Extraction` → `Enrichment` → `Validation` → `Human Review` → `Export`. |
| 🔍 **Evidence Traceability** | Every extracted attribute links directly to source document citations, page numbers, and exact text snippets. |
| 🛡️ **Validation & Anomaly Engine** | Real-time confidence scoring ($0-100\%$), missing attribute detection, unit standardization, and taxonomy checks. |
| 👥 **Human-in-the-Loop Review** | Inline attribute editing, single-click approvals/rejections, review notes, bulk operations, and multi-step undo (`Ctrl+Z`). |
| 🔐 **Role-Based Access Control** | Granular RBAC permissions for `Admin` (Full Access), `Reviewer` (Edit & Approve), and `Viewer` (Read-only). |
| 💾 **Auto-Save & Crash Recovery** | Continuous `localStorage` snapshotting with 1-click state backup export and restore. |
| 📦 **Multi-Format Handoff** | One-click export and clipboard copy for **Full JSON**, **CSV Flat File**, and **PIM-ready JSON**. |

---

## 🏗️ System Architecture

```mermaid
flowchart LR
    A[Unstructured Inputs] -->|SKU / Text / PDF / Image| B(Ingestion Stage)
    B --> C(Parsing Engine)
    C --> D(AI Attribute Extraction)
    D --> E(Taxonomy & Unit Enrichment)
    E --> F[Confidence & Validation Engine]
    F -->|Low Confidence / Anomaly| G[Human-in-the-Loop Review Queue]
    F -->|Validated Data| H[PIM & Commerce Handoff]
    G -->|Approved / Edited| H
    H --> I[JSON / CSV / PIM Payload]
```

---

## 🔒 Security & Compliance Matrix

- 🛡️ **XSS Sanitization**: Dynamic HTML escaping (`sanitizeInput()`) on all client rendering.
- 🛡️ **SQLi / Injection Guard**: Query pattern filter (`sanitizeSqlInjection()`) stripping malicious command injections.
- 🛡️ **Content Security Policy**: Meta CSP restricting script origins, font sources, and connect endpoints.
- 🛡️ **File Payload Security**: MIME type & extension whitelisting (`.pdf`, `.png`, `.jpg`, `.webp`) with a strict 10MB limit.
- 🛡️ **Rate Limiting**: Request throttling (`pipelineRateLimiter`, max 5 requests / 10 sec window).
- 🛡️ **Authentication & RBAC**: Session permission guards preventing Unauthorized/Viewer role modifications.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18+ 
- **npm** v9+

### Installation & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/gunvant2005/AI_VENGERS.git
cd AI_VENGERS

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run Vitest automated test suite
npm run test

# 5. Build for production
npm run build
```

Open your browser at `http://localhost:5173`.

---

## 🧪 Automated Testing Suite

Configured with **Vitest** ([vite.config.js](vite.config.js)) for high reliability:

```bash
npm run test
```

### 5 Test Coverage Modules:
1. `src/__tests__/pipeline.test.js` — Pipeline engine & fallback SKU generator
2. `src/__tests__/validation.test.js` — Validation rules & anomaly detection engine
3. `src/__tests__/export.test.js` — Full JSON, CSV, and PIM format builders
4. `src/__tests__/security.test.js` — XSS escaping, file upload bounds, and rate limiting
5. `src/__tests__/auth.test.js` — RBAC permissions, role switching, and SQL/password validators

---

## ⌨️ UX Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl` + `Enter` | Submit Input Form / Approve Active Review Item |
| `Ctrl` + `S` | Quick Export Full Product JSON Record |
| `Ctrl` + `Z` | Undo Last Review Queue Action |
| `Esc` | Cancel Inline Attribute Editing |

---

## 📄 Documentation Links

- 📘 [API Specification & Schemas](API_DOCUMENTATION.md)
- 💾 [Disaster Recovery & Backup SOP](BACKUP_RECOVERY.md)
- 📊 [13-Point Quality & Audit Report](C:\Users\dhake\.gemini\antigravity-ide\brain\04982c0f-3423-47a6-a8a3-fb7d3174db0e\audit_report.md)

---

<div align="center">

Made with ❤️ by **Team AI_VENGERS**  
*Licensed under the [MIT License](LICENSE)*

</div>
