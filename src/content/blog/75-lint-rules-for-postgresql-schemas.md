---
draft: false
title: "75 Lint Rules for PostgreSQL Schemas — What We Check and Why"
snippet: "PgDesigner validates your schema with 75 rules across 3 severity levels. Here's the reasoning behind the most impactful rules: missing FK indexes, type mismatches, serial vs identity, and more."
image:
  src: "/images/lint-dark.png"
  alt: "PgDesigner lint results showing schema validation issues"
thumb:
  src: "/images/blog/thumb-lint.webp"
  alt: "PgDesigner lint results showing schema validation issues"
thumbLight:
  src: "/images/blog/thumb-lint-light.webp"
  alt: "PgDesigner lint results showing schema validation issues"
publishDate: "2026-03-28 14:00"
category: "Engineering"
author: "vmkteam"
tags: [postgresql, lint, schema-design, best-practices]
---

Most PostgreSQL schemas accumulate design debt silently. A missing index on a foreign key doesn't break anything — until a JOIN takes 40 seconds in production. A `char(n)` column works fine — until you discover it pads every value with spaces and breaks equality comparisons with `text`.

PgDesigner ships 75 lint rules to catch these issues at design time. Here's the reasoning behind the most impactful ones.

<div class="not-prose -mx-4 sm:mx-0 mt-6 mb-10">
  <div class="rounded-xl overflow-hidden border border-border-default shadow-2xl img-zoom">
    <picture class="hidden dark:block">
      <source srcset="/images/lint-dark.webp" type="image/webp" />
      <img src="/images/lint-dark.png" alt="PgDesigner Check Diagram showing lint results with warnings and info rules on Northwind database in dark theme" loading="eager" width="1280" height="800" class="w-full" />
    </picture>
    <picture class="block dark:hidden">
      <source srcset="/images/lint-light.webp" type="image/webp" />
      <img src="/images/lint-light.png" alt="PgDesigner Check Diagram showing lint results with warnings and info rules on Northwind database in light theme" loading="eager" width="1280" height="800" class="w-full" />
    </picture>
  </div>
</div>

## Three severity levels

**Errors (32 rules)** — structural problems that make your schema invalid. FK pointing to a non-existent table, duplicate column names, unknown data types. These block DDL generation — you can't ship a broken schema.

**Warnings (21 rules)** — valid SQL that's almost certainly wrong. FK type mismatches, missing indexes, circular dependencies, reserved words as identifiers. Your schema will run, but you'll pay for it later.

**Info (13 rules)** — antipatterns and style suggestions. `serial` vs `identity`, `json` vs `jsonb`, `timestamp` vs `timestamptz`. Not bugs, but modernizing these saves headaches.

## The rules that matter most

### W002: FK columns have no matching index

This is the single most common performance issue in PostgreSQL schemas. Every foreign key implies a JOIN. Without an index on the FK columns, PostgreSQL needs to scan the child table on every `DELETE` from the parent — to check if any rows still reference the deleted parent. On large tables, this means a sequential scan ([PostgreSQL docs: Foreign Keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)).

```sql
-- Table: orders
-- FK: orders.customer_id -> customers.id
-- Missing: CREATE INDEX ON orders (customer_id)
```

PgDesigner flags this as W002 and offers one-click autofix: it creates a btree index on the FK columns. In the AdventureWorks sample database (68 tables, 69 FKs), 12 missing FK indexes were caught on first lint.

### W001: FK column type mismatch

PostgreSQL requires FK columns to have compatible types. A mismatch between `bigint` and `integer` causes `CREATE TABLE` to fail with "Key columns are of incompatible types." But subtler mismatches slip through — `varchar(50)` referencing `varchar(100)`, or `numeric(10,2)` vs `numeric(12,2)`. These create implicit casts on every JOIN, defeating index usage.

PgDesigner checks that FK source and target column types match exactly — catching mismatches before you run any SQL.

### E031: Multiple identity columns

The SQL standard allows only one `IDENTITY` column per table. PostgreSQL relaxes this restriction — you *can* create multiple identity columns, but `INSERT` only supports a single `OVERRIDING` clause, making it impractical to use more than one. Multiple identity columns almost always indicate a design error. PgDesigner flags this so you catch it at design time ([PostgreSQL docs: Identity Columns](https://www.postgresql.org/docs/current/ddl-identity-columns.html)).

### I001: Prefer text over char(n)

`char(n)` in PostgreSQL [pads values with spaces](https://www.postgresql.org/docs/current/datatype-character.html) to the declared length. This means:
- `char(100)` storing "hello" actually stores "hello" + 95 spaces — wasting storage
- Trailing spaces cause subtle bugs: comparisons between `char(n)` values ignore padding, but mixing `char(n)` with `text` in application code leads to unexpected mismatches
- `char(n)` is actually the *slowest* of the three string types due to padding overhead. `varchar(n)` and `text` are identical in performance

The autofix converts `char(n)` to `text` (or `varchar(n)` if you prefer a length constraint).

### I004: Prefer identity over serial

`serial` is a legacy pattern that creates an implicit sequence with `OWNED BY`. Problems:

- `serial` columns [aren't part of the SQL standard](https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-SERIAL) — they're a PostgreSQL-specific shorthand
- The column is `NOT NULL DEFAULT nextval(...)` — not the same as `GENERATED ALWAYS AS IDENTITY`
- `CREATE TABLE ... (LIKE ... INCLUDING ALL)` copies the `nextval()` default but shares the *same sequence* between both tables — a subtle and dangerous gotcha
- Historical `pg_dump` edge cases with sequence ownership, mostly fixed in modern versions

`IDENTITY` ([SQL:2003](https://www.postgresql.org/docs/current/ddl-identity-columns.html)) is cleaner: the sequence is bound to the column, `LIKE INCLUDING IDENTITY` creates an independent sequence, and `GENERATED ALWAYS` restricts manual inserts (bypassable with `OVERRIDING SYSTEM VALUE` when needed).

### I005: Prefer timestamptz over timestamp

`timestamp without time zone` stores a wall-clock time with no timezone information. This seems simpler until:

- Your application servers are in different timezones
- Daylight saving time changes shift stored times by an hour
- You try to compare timestamps from two systems

[`timestamptz` stores everything as UTC internally](https://www.postgresql.org/docs/current/datatype-datetime.html) and converts on display based on the session timezone. It's always the right choice unless you're explicitly modeling timezone-agnostic data (like "every Monday at 9am regardless of location").

### W020: Reserved word as identifier

Using `user`, `order`, `group`, `table`, or `select` as a table or column name works — if you always quote it. The moment someone writes `SELECT * FROM user` without quotes, the query fails. PgDesigner checks identifiers against the [PostgreSQL key words list](https://www.postgresql.org/docs/current/sql-keywords-appendix.html) covering hundreds of reserved and non-reserved words.

## 15 rules with autofix

Not every rule needs manual intervention. PgDesigner can automatically fix:

| Rule | Fix |
|------|-----|
| W002 | Create btree index on FK columns |
| W004 | Add identity integer PK column |
| W005 | Drop duplicate index |
| W010 | Remove default from identity column |
| W011 | Remove default from generated column |
| W012 | Set PK column to NOT NULL |
| W015 | Change FK NO ACTION to RESTRICT |
| W017 | Drop overlapping prefix index |
| W018 | Drop duplicate FK |
| I001 | Convert char(n) to text |
| I003 | Convert money to numeric |
| I004 | Convert serial to identity |
| I005 | Convert timestamp to timestamptz |
| I006 | Convert timetz to time |
| I009 | Convert json to jsonb |

In the UI, click the fix button next to any issue. In the CLI:

```
pgdesigner lint -fix schema.pgd
```

## Lint in CI/CD

Add schema validation to your pipeline:

```
pgdesigner lint schema.pgd
```

Exit code 1 if any errors are found. Use flags to customize:

```
pgdesigner lint -s error schema.pgd      # errors only
pgdesigner lint -s warning schema.pgd    # errors + warnings
pgdesigner lint -f json schema.pgd       # machine-readable output
```

JSON output includes rule code, severity, table, column, and message — easy to parse with `jq` or feed into your monitoring.

## How we picked these 75 rules

Every rule comes from real-world experience across 6 production databases (630+ tables total). We didn't invent problems to solve — we catalogued the issues we found when importing real schemas from MicroOLAP, DbSchema, and live PostgreSQL instances.

The rule set will grow. If you have a rule suggestion, [open an issue on GitHub](https://github.com/vmkteam/pgdesigner/issues).

---

- [Full lint rules reference →](/docs/lint-rules)
- [Schema linter features →](/features/lint)
- [Download PgDesigner →](/docs/download)

## References

- [PostgreSQL Docs: Character Types](https://www.postgresql.org/docs/current/datatype-character.html) — char(n) padding, performance comparison
- [PostgreSQL Docs: Numeric Types (serial)](https://www.postgresql.org/docs/current/datatype-numeric.html#DATATYPE-SERIAL) — serial as notational convenience
- [PostgreSQL Docs: Identity Columns](https://www.postgresql.org/docs/current/ddl-identity-columns.html) — GENERATED ALWAYS/BY DEFAULT, multiple identity columns
- [PostgreSQL Docs: Constraints (Foreign Keys)](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK) — FK index recommendation
- [PostgreSQL Docs: Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html) — timestamptz UTC storage
- [PostgreSQL Docs: CREATE TABLE (LIKE clause)](https://www.postgresql.org/docs/current/sql-createtable.html) — sequence sharing with INCLUDING ALL
- [PostgreSQL Docs: SQL Key Words](https://www.postgresql.org/docs/current/sql-keywords-appendix.html) — reserved/non-reserved word list
- [PostgreSQL Wiki: Don't Do This](https://wiki.postgresql.org/wiki/Don't_Do_This) — community best practices
