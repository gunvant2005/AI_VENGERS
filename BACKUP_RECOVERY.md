# Backup & Disaster Recovery Standard Operating Procedure (SOP)

This document specifies the disaster recovery, state persistence, and database backup strategy for the **Product Intelligence — Industrial Commerce** platform.

---

## 1. Client-Side Workspace Recovery (Built-in)

The web application includes built-in state persistence ([src/services/storage.js](file:///c:/Users/dhake/OneDrive/Apps/Desktop/UniHack%202/src/services/storage.js)):
- **Automatic State Snapshotting**: Every user action (input updates, pipeline runs, review approvals/rejections) automatically writes a JSON snapshot to browser `localStorage` under `product_intelligence_workspace_v1`.
- **Auto-Crash Recovery**: If the browser tab or browser process crashes, reloading the page automatically restores the last active product record, review queue status, and theme state.
- **Manual State Backup**: Reviewers can export a standalone `.json` state snapshot at any point using the state export handler.

---

## 2. Server & Database Production Backup Plan

When deployed with a production backend and database (PostgreSQL / MongoDB), the following automated backup procedures apply:

### A. PostgreSQL Automated Daily Backups (`pg_dump` + WAL-G)
1. **Full Database Snapshot**: Executed daily at 02:00 UTC via cron job.
   ```bash
   pg_dump -h $DB_HOST -U $DB_USER -F c -b -v -f "/backups/product_db_$(date +%Y%m%d_%H%M%S).dump" product_intelligence_db
   ```
2. **Continuous Archiving (WAL-G to AWS S3 / GCP Storage)**: Write-Ahead Logs (WAL) pushed to encrypted S3 bucket for Point-in-Time Recovery (PITR) up to 30 days.

### B. Recovery Time & Point Objectives (RTO / RPO)
- **Recovery Time Objective (RTO)**: `< 15 minutes` (Automated container failover via Kubernetes / AWS ECS).
- **Recovery Point Objective (RPO)**: `< 1 minute` (Continuous WAL archiving).

### C. Emergency Failover Procedure
1. Trigger DNS failover to standby secondary database replica in secondary region (e.g. `us-east-1` -> `us-west-2`).
2. Run database health check script:
   ```bash
   pg_isready -h $SECONDARY_DB_HOST -p 5432
   ```
3. Re-route API gateway instances to point to promoted primary node.
