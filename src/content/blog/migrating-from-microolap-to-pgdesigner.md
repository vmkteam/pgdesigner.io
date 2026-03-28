---
draft: false
title: "Migrating from MicroOLAP Database Designer to PgDesigner"
snippet: "MicroOLAP Database Designer for PostgreSQL hasn't been updated since 2021. Here's how to migrate your .pdd project files to PgDesigner in under 5 minutes."
image:
  src: "/images/erd-dark.png"
  alt: "PgDesigner ERD canvas showing imported database schema"
thumb:
  src: "/images/blog/thumb-erd.webp"
  alt: "PgDesigner ERD canvas showing imported database schema"
thumbLight:
  src: "/images/blog/thumb-erd-light.webp"
  alt: "PgDesigner ERD canvas showing imported database schema"
publishDate: "2026-03-24 16:00"
category: "Tutorials"
author: "vmkteam"
tags: [postgresql, microolap, migration, pdd, tutorial]
---

MicroOLAP Database Designer for PostgreSQL is a long-standing schema design tool. Its last release (v1.16) was in July 2021 — no updates in nearly 5 years. If you're looking for an actively maintained alternative that reads `.pdd` files natively, PgDesigner is a drop-in replacement.

PgDesigner reads `.pdd` files natively. This guide shows you how to migrate in under 5 minutes.

## Step 1: Install PgDesigner

```bash
brew tap vmkteam/tap
brew install pgdesigner
```

Or [download the binary](/docs/download) for your platform.

## Step 2: Convert your .pdd file

```bash
pgdesigner convert myproject.pdd -o myproject.pgd
```

That's it. PgDesigner parses the MicroOLAP XML format and creates a `.pgd` file with all your tables, columns, indexes, foreign keys, primary keys, unique constraints, check constraints, enums, sequences, and comments preserved.

## Step 3: Open in the visual editor

```bash
pgdesigner myproject.pgd
```

Your browser opens with the ERD canvas. All tables, relationships, and constraints are there — exactly as they were in MicroOLAP.

## Step 4: Run lint to check for issues

```bash
pgdesigner lint myproject.pgd
```

PgDesigner runs 75 validation rules against your schema. After years in MicroOLAP, you might find:

- **Missing FK indexes** (W002) — MicroOLAP didn't check for these
- **char(n) columns** (I001) — should probably be `text`
- **serial columns** (I004) — should be `identity`
- **FK with NO ACTION** (W015) — probably meant RESTRICT

Use `pgdesigner lint -fix myproject.pgd` to auto-fix the fixable ones.

## Step 5: Commit to git

```bash
git add myproject.pgd
git commit -m "Migrate from MicroOLAP to PgDesigner"
```

From now on, every schema change produces clean single-line diffs in your pull requests.

## What you gain by migrating

| Feature | MicroOLAP | PgDesigner |
|---------|-----------|------------|
| PostgreSQL version | Up to PG12 (last update 2021) | PG18 |
| Last update | July 2021 | Active |
| Diff/ALTER engine | No | Yes (6 hazard codes) |
| Schema lint | No | 75 rules, 15 autofix |
| Sample data generator | No | Yes (30 heuristics) |
| Git-friendly diffs | Poor | Single-line XML diffs |
| CLI for CI/CD | No | Yes |
| Cross-platform | Windows only | macOS, Linux, Windows |
| Price | From $124.95 | $19 (free non-commercial) |

## What if my .pdd file has issues?

The converter handles most MicroOLAP features. If you encounter a conversion error, please [open a GitHub issue](https://github.com/vmkteam/pgdesigner/issues) with a sanitized version of your `.pdd` file. We actively support MicroOLAP migrations.

## Also importing from other tools?

PgDesigner also imports from:

- **DbSchema** (.dbs) — `pgdesigner convert schema.dbs -o project.pgd`
- **Toad Data Modeler** (.dm2) — `pgdesigner convert schema.dm2 -o project.pgd`
- **Plain SQL / pg_dump** — `pgdesigner convert schema.sql -o project.pgd`
- **Live PostgreSQL** — `pgdesigner convert "postgres://localhost/mydb" -o project.pgd`

- [See all import options →](/features/import)
- [Download PgDesigner →](/docs/download)
