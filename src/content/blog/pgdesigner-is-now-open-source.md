---
draft: false
title: "PgDesigner Is Now Open Source (Apache-2.0)"
snippet: "Starting with v0.1.0, PgDesigner is licensed under Apache-2.0 — free for any use, including commercial. All earlier releases are covered too. Here's why, and how we fund development."
image:
  src: "/images/dark.png"
  alt: "PgDesigner visual ERD editor — now open source under Apache-2.0"
thumb:
  src: "/images/blog/thumb-dark.webp"
  alt: "PgDesigner visual ERD editor — now open source under Apache-2.0"
thumbLight:
  src: "/images/blog/thumb-light.webp"
  alt: "PgDesigner visual ERD editor — now open source under Apache-2.0"
publishDate: "2026-11-05 12:00"
category: "Announcements"
author: "vmkteam"
tags: [postgresql, open-source, license, release]
---

Starting with v0.1.0, PgDesigner is open source under the [Apache License 2.0](https://github.com/vmkteam/pgdesigner/blob/master/LICENSE). Use it at work, in CI, for client projects — no license key, no seat count, no registration.

## Why we changed the license

PgDesigner launched under PolyForm Noncommercial: free for personal use, a paid license for commercial use. In practice, that model worked against the people PgDesigner is built for:

- **Companies couldn't adopt it.** A noncommercial license sends a developer tool to legal review, and most teams stop there. Yet most PostgreSQL schemas live at companies.
- **CI was a grey zone.** `pgdesigner lint` and `pgdesigner diff` are meant to run on every pull request. Under a noncommercial license, every company pipeline needed a purchase decision first.
- **It wasn't open source.** Package managers, Linux distributions, and many developers treat source-available licenses as proprietary.
- **There was nothing to enforce anyway.** PgDesigner never had license checks — every build had every feature. The license only added friction.

## What changes

- **Everything is free for any use**, including commercial. No paid edition, no feature gates.
- **All earlier releases are covered too.** If you used a previous version, it's now available under Apache-2.0 — nothing to do on your side.
- **The registration prompt is gone.** No "[unregistered]" in the title bar, no email field in the About dialog.
- **Contributions are welcome.** Pull requests are accepted under Apache-2.0 — sign off your commits with `git commit -s` ([Developer Certificate of Origin](https://developercertificate.org/)). No CLA.
- **Same distribution.** Homebrew, GitHub Releases (macOS builds are signed and notarized), and Docker images on GHCR.

The PgDesigner name and logo are not covered by the license — forks should use a different name.

## How we fund development

Instead of selling licenses, we sell our time:

- **Priority Support — $149/year per company.** Private email, a response within 2 business days, your team's bugs first in the queue, and help migrating models from pgModeler, MicroOLAP, or DbSchema.
- **Enterprise Support — from $990/year.** Response within 1 business day, a private chat channel, an onboarding call, and payment by invoice or PO.
- **Sponsored development.** Need an import format, a lint rule for your conventions, or a roadmap feature sooner? We'll quote it, and it ships in the open-source release.

Community support stays free on [GitHub Issues](https://github.com/vmkteam/pgdesigner/issues) and [Discussions](https://github.com/vmkteam/pgdesigner/discussions).

## Get started

```bash
brew tap vmkteam/tap
brew install pgdesigner
```

- [Download PgDesigner →](/docs/download)
- [Support plans →](/pricing)
- [Source on GitHub →](https://github.com/vmkteam/pgdesigner)
- [Try the demo →](https://demo.pgdesigner.io)

If PgDesigner is useful to you, a star on GitHub helps other PostgreSQL developers find it.
