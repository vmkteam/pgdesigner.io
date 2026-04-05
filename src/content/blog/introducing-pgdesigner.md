---
draft: false
title: "Introducing PgDesigner — A Modern Visual PostgreSQL Schema Designer"
snippet: "PgDesigner is a visual PostgreSQL schema designer with production-ready DDL generation, safe ALTER migrations with hazard detection, 66 lint rules, and a git-friendly format. Free for non-commercial use."
image:
  src: "/images/dark.png"
  alt: "PgDesigner visual ERD editor showing database schema"
thumb:
  src: "/images/blog/thumb-erd.webp"
  alt: "PgDesigner visual ERD editor showing database schema"
thumbLight:
  src: "/images/blog/thumb-erd-light.webp"
  alt: "PgDesigner visual ERD editor showing database schema"
publishDate: "2026-03-24 12:00"
category: "Announcements"
author: "vmkteam"
tags: [postgresql, schema-design, erd, release]
---

Today we're releasing PgDesigner — a visual PostgreSQL schema designer built for teams that treat their database schema as seriously as their application code.

![PgDesigner ERD canvas showing the AdventureWorks database with 68 tables and foreign key relationships](/images/erd-dark.png)

## Why we built PgDesigner

Every PostgreSQL team faces the same challenges:

- **No single source of truth** — the schema lives in migrations, developer heads, or an outdated wiki diagram
- **Migrations are scary** — writing ALTER statements by hand means risking data loss, table rewrites, or exclusive locks in production
- **Existing tools are either generic or outdated** — DrawDB supports 4 databases but none deeply. pgModeler is powerful but 19 years old with poor git integration

PgDesigner addresses all three: a visual ERD editor that generates production-ready SQL, compares schemas with hazard detection, and validates with 66 lint rules.

## What makes PgDesigner different

We're the only tool that combines all four:

1. **PG-specialized** — built exclusively for PostgreSQL 18. 70+ data types, partitions, temporal constraints, virtual generated columns, IDENTITY — all first-class
2. **Git-friendly format** — .pgd XML produces single-line diffs when you add a column. Split-model for 50+ table schemas
3. **Diff/ALTER engine** — two models in, safe migration out. 6 hazard codes warn about data loss, table rewrites, and exclusive locks
4. **Modern visual UI** — browser-based ERD canvas with auto-layout, minimap, and dark/light theme

No other tool has all four. pgModeler has 3/4 (no hazard detection, poor git diffs). DrawDB has 1/4 (visual only). Atlas has 2/4 (no visual editor, multi-database abstraction).

## Key features at a glance

**Visual ERD Canvas** — drag tables, zoom, auto-arrange. Tested on 120+ tables. Click to edit columns, constraints, indexes. Create FK by clicking two tables.

**DDL Generation** — 15-phase topological sort. FK always after tables. Materialized views sorted by inter-dependencies. 99.7% round-trip fidelity on 630+ tables across 6 real databases.

**Diff & ALTER Engine** — compare old.pgd vs new.pgd → safe ALTER SQL. Hazard detection: DELETES_DATA, TABLE_REWRITE, TABLE_RECREATE, BACKFILL_REQUIRED, DETACH_PARTITION, REATTACH_PARTITION. Compatible cast detection (varchar widening, integer → bigint).

**66 Lint Rules** — 32 errors (structural integrity), 21 warnings (best practices), 13 info (antipatterns). 15 rules with one-click autofix. Missing FK index? Click fix. char(n) column? Auto-convert to text.

**Sample Data Generator** — FK-aware topological sort, 30 name heuristics (email → realistic email, price → 29.99), seeded reproducibility. Circular FK handling via deferred UPDATE.

**Import from anywhere** — MicroOLAP .pdd, DbSchema .dbs, Toad .dm2, plain SQL, live PostgreSQL via pg_catalog introspection.

**CLI for CI/CD** — `pgdesigner lint`, `diff`, `generate`, `testdata`, `convert`. Single binary, zero dependencies. Exit code 1 on lint errors — block merges with broken schemas.

## Pricing

Free for non-commercial use — forever. All features, no time limit, no feature gates.

Commercial licenses start at $19 one-time for individuals. That's less than a lunch with your team, and less than half what pgModeler charges.

## What's next

Here's what's planned next:

- **Views and functions diff** — currently tables, columns, indexes, FK, PK, constraints, enums, and partitions are diffed. Views and functions are next
- **More sample data heuristics** — expanding beyond 30 name patterns
- **Demo mode** — try PgDesigner in the browser without downloading

We'd love your feedback. Try it, break it, tell us what's missing.

- [Download PgDesigner →](/docs/download)
- [View all features →](/features)
- [See pricing →](/pricing)
- [GitHub →](https://github.com/vmkteam/pgdesigner)
