---
draft: false
title: "How PgDesigner Generates Safe ALTER Migrations with Hazard Detection"
snippet: "A deep dive into PgDesigner's diff engine: two-phase algorithm, 6 hazard codes, compatible cast detection, and smart rename recognition. Learn how it prevents dangerous migrations."
image:
  src: "/images/diff-dark.png"
  alt: "PgDesigner diff dialog showing ALTER SQL with hazard warnings"
thumb:
  src: "/images/blog/thumb-diff.webp"
  alt: "PgDesigner diff dialog showing ALTER SQL with hazard warnings"
thumbLight:
  src: "/images/blog/thumb-diff-light.webp"
  alt: "PgDesigner diff dialog showing ALTER SQL with hazard warnings"
publishDate: "2026-03-24 14:00"
category: "Engineering"
author: "vmkteam"
tags: [postgresql, migrations, alter, diff, hazard-detection]
---

Every DBA has a horror story about an ALTER statement that locked a table for 20 minutes, or a DROP COLUMN that deleted production data. PgDesigner's diff engine is designed to prevent these incidents.

![PgDesigner diff dialog showing unsaved changes with DROP, ADD, ALTER badges and hazard warnings](/images/diff-dark.png)

## The problem with manual ALTER scripts

When you change your schema, you need a migration script. Most teams write these by hand:

```sql
ALTER TABLE users ADD COLUMN phone varchar(20);
ALTER TABLE users ALTER COLUMN address TYPE text;
CREATE INDEX idx_users_phone ON users (phone);
```

This works until it doesn't. What if `ALTER COLUMN address TYPE text` triggers a full table rewrite because the cast is incompatible? What if the `CREATE INDEX` blocks all writes because you forgot `CONCURRENTLY`? What if you drop a column that still has data?

PgDesigner solves this by computing the diff automatically and warning you about every hazard.

## How the diff engine works

Give it two `.pgd` models — old and new. The engine computes every structural change and emits safe ALTER statements in the correct dependency order.

### Two-phase algorithm

**Phase 1 — DROP** (reverse dependency order):
FK → CHECK → UNIQUE → PK → indexes → columns → tables

Nothing breaks because dependents are removed first.

**Phase 2 — CREATE/ALTER** (forward dependency order):
enums → tables → columns → PK → indexes → FK → CHECK → UNIQUE → partitions

References always exist before they're needed.

**Phase 3 — Enums**:
`ALTER TYPE ... ADD VALUE` for new enum labels. PostgreSQL doesn't support removing labels, so dropped labels are silently skipped.

## Six hazard codes

Every generated ALTER is analyzed for operational risk. The engine emits a hazard comment directly before the SQL statement:

### DELETES_DATA (dangerous)
Triggered by: DROP TABLE, DROP COLUMN.

```sql
-- [dangerous] DELETES_DATA: drops table artist and all its data
DROP TABLE "artist";
```

Permanent data loss. Requires explicit confirmation.

### TABLE_RECREATE (dangerous)
Triggered by: adding, removing, or changing PARTITION BY strategy on an existing table.

This effectively requires rebuilding the entire table — not just an ALTER.

### TABLE_REWRITE (warning)
Triggered by: ALTER COLUMN TYPE with incompatible cast.

```sql
-- [warning] TABLE_REWRITE: changing employee.birth_date from timestamp to timestamptz may rewrite table
ALTER TABLE "employee" ALTER COLUMN "birth_date" TYPE timestamptz;
```

PostgreSQL may rewrite every row on disk. On a 10M-row table, this means an exclusive lock for minutes.

### BACKFILL_REQUIRED (warning)
Triggered by: ADD COLUMN NOT NULL without DEFAULT or IDENTITY.

Existing rows have no value for the new column — the INSERT will fail.

### DETACH_PARTITION (warning)
Triggered by: removing a partition from the partition list.

### REATTACH_PARTITION (warning)
Triggered by: partition bounds changed — DETACH then re-ATTACH with new bounds.

## Smart features

### Compatible cast detection

Not all type changes are dangerous. PgDesigner recognizes safe widenings:

- `varchar(50)` → `varchar(255)` — safe, no rewrite
- `integer` → `bigint` — safe, no rewrite
- `smallint` → `integer` — safe, no rewrite

These don't trigger TABLE_REWRITE.

### Semantic rename detection

Renamed an index or foreign key? PgDesigner compares the structural definition — table, columns, method — not just the name. If the structure is identical, it skips the drop+add cycle.

### What gets diffed

Tables (including comment and PARTITION BY), columns (type, nullable, default, identity with sequence options, comment, compression, storage), indexes, FK, PK, UNIQUE, CHECK constraints, enum values, and partitions.

Views and functions diff is planned for Phase 2.

## CLI usage

```
pgdesigner diff old.pgd new.pgd
pgdesigner diff -f json old.pgd new.pgd
```

The diff command outputs ALTER SQL to stdout. Use `-f json` for machine-readable output in CI pipelines. Exit code 1 if changes are found — useful for drift detection.

## UI usage

Press **Ctrl+D** in the visual editor to see a live diff of your unsaved changes. Every change shows:
- The ALTER SQL statement
- Hazard badge (color-coded: red = dangerous, yellow = warning)
- Affected object path (schema.table.column)

You see the risk before you commit.

- [Learn more about the diff engine →](/features/diff)
- [Download PgDesigner →](/docs/download)
