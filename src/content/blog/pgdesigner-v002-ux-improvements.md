---
draft: false
title: "PgDesigner v0.0.2 — DSN Introspection, Keyboard Shortcuts, and Project Settings"
snippet: "v0.0.2 brings DSN introspection to connect and import from live PostgreSQL, canvas hotkeys, full keyboard shortcuts, project settings, auto-save DDL, and 10 bug fixes."
image:
  src: "/images/dark.png"
  alt: "PgDesigner v0.0.2 with new DSN introspection and keyboard shortcuts"
thumb:
  src: "/images/blog/thumb-dark.webp"
  alt: "PgDesigner v0.0.2 with new DSN introspection and keyboard shortcuts"
thumbLight:
  src: "/images/blog/thumb-light.webp"
  alt: "PgDesigner v0.0.2 with new DSN introspection and keyboard shortcuts"
publishDate: "2026-03-28 12:00"
category: "Announcements"
author: "vmkteam"
tags: [postgresql, schema-design, release, ux]
---

PgDesigner v0.0.2 is out. This release focuses on UX: faster workflows, less mouse clicking, and direct PostgreSQL connectivity.

## DSN Introspection

Connect to a live PostgreSQL instance, preview schemas and tables, and selectively import what you need. No more exporting SQL dumps and converting — point PgDesigner at your database and pick the tables you want.

<div class="not-prose -mx-4 sm:mx-0 mt-6 mb-8">
  <div class="rounded-xl overflow-hidden border border-border-default shadow-xl img-zoom">
    <picture class="hidden dark:block">
      <source srcset="/images/blog/v002-dsn-dark.webp" type="image/webp" />
      <img src="/images/blog/v002-dsn-dark.png" alt="PgDesigner DSN Introspection dialog connecting to PostgreSQL and showing schemas in dark theme" loading="eager" width="1280" height="1006" class="w-full" />
    </picture>
    <picture class="block dark:hidden">
      <source srcset="/images/blog/v002-dsn-light.webp" type="image/webp" />
      <img src="/images/blog/v002-dsn-light.png" alt="PgDesigner DSN Introspection dialog connecting to PostgreSQL and showing schemas in light theme" loading="eager" width="1280" height="1006" class="w-full" />
    </picture>
  </div>
</div>

This works alongside existing import from `.pdd`, `.dbs`, `.dm2`, and plain SQL.

## Canvas Hotkeys

Three new hotkeys on the ERD canvas:

- **T** — create table
- **F** — create foreign key
- **M** — create many-to-many relationship

Combined with click-to-create-FK from v0.0.1, you can now build an entire schema without touching a menu.

## Keyboard Shortcuts

Full keyboard shortcut support:

- **Ctrl+N** — new project
- **Ctrl+O** — open file
- **Ctrl+S** — save
- **Ctrl+Shift+S** — save as
- **Ctrl+W** — close project
- **?** — keyboard reference

## Project Settings

Per-project configuration: PostgreSQL version target, naming conventions, FK defaults, and lint config. Settings are stored inside the `.pgd` file, so they travel with the project and are shared across the team via git.

## Auto-save DDL

Enable auto-save to generate a `.sql` file alongside your `.pgd` on every save. Your DDL stays in sync with your schema without an extra step.

## Save SQL

Export DDL, diff patches, and test data as `.sql` files directly from the UI.

## More improvements

- **Update checker** — status bar badge when a new version is available
- **Column index indicator** — Ix column in grid, index links in column properties
- **Recent files** — welcome screen shows your 2 most recent projects
- Flat SVG toolbar icons replacing emoji
- FK referenced column is now a dropdown
- VueUse adoption and Vue 3.5 best practices

## Bug fixes

10 fixes including: multi-schema FK lint false positive (E009), multi-schema layout position corruption (W014), duplicate table creation, node position jumps after FK creation, fitView over-zooming on small schemas, and several keyboard shortcut conflicts.

**Full changelog**: [v0.0.1...v0.0.2](https://github.com/vmkteam/pgdesigner/compare/v0.0.1...v0.0.2)

---

- [Download v0.0.2 →](/docs/download)
- [View all features →](/features)
- [GitHub →](https://github.com/vmkteam/pgdesigner)
