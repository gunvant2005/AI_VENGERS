# API Specification & Data Schemas

Document version: `1.0.0`  
Protocol: `REST / JSON`  
Base URL: `https://api.product-intelligence.industrial/v1`

---

## Data Schemas

### 1. `ProductRecord`
```json
{
  "sku": "HEX-M12-50",
  "title": "Hex Bolt M12×50 — 316 Stainless Steel",
  "category": "Fasteners > Bolts > Hex Head Bolts",
  "confidenceScore": 0.94,
  "attributes": {
    "material": {
      "label": "Material",
      "value": "316 Stainless Steel",
      "confidence": 0.95,
      "status": "extracted",
      "evidence": {
        "source": "PDF Catalog",
        "page": 4,
        "snippet": "Material: Grade 316 Stainless Steel (A4-70)"
      }
    }
  },
  "validationIssues": [],
  "createdAt": "2026-08-05T12:00:00Z"
}
```

---

## API Endpoints

### 1. Execute Pipeline (`POST /pipeline/run`)
Triggers ingestion, parsing, extraction, enrichment, and validation on uploaded inputs.

#### Request Body
```json
{
  "sku": "HEX-M12-50",
  "description": "Optional supplier text catalog copy...",
  "notes": "Context for validation..."
}
```

#### Response (`200 OK`)
Returns the complete `ProductRecord` object.

---

### 2. Export Structured Data (`POST /export`)
Formats product intelligence into PIM, CSV, or Full JSON formats.

#### Parameters
- `format`: `json` | `csv` | `pim`

---

### 3. Health & Readiness (`GET /healthz`)
- **Response**: `200 OK` `{ "status": "healthy", "version": "1.0.0" }`
