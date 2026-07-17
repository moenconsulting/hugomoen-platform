# Content Model

## Content Types

The MVP has one content type: **post**.

A post is a Markdown file stored in `content/posts/`.

Future content types (pages, notes, etc.) are out of scope until there is a demonstrated need.

## Article Metadata

Each post has YAML frontmatter with the following fields.

| Field       | Type    | Required | Description                              |
|-------------|---------|----------|------------------------------------------|
| title       | string  | yes      | Article title. Used in headings and SEO. |
| date        | string  | yes      | Publication date. Format: YYYY-MM-DD.    |
| description | string  | yes      | Short summary. Used in blog list and meta tags. |
| draft       | boolean | no       | Defaults to false. See draft strategy below. |

Tags are excluded from the MVP. They are defined in the Phase 2 backlog and should not be added to frontmatter until that work begins.

### Example

```yaml
---
title: "Hvordan jeg bygde en publiseringsplattform"
date: "2026-07-17"
description: "En refleksjon over valg, prinsipper og prosess."
---
```

### Example with draft

```yaml
---
title: "Uferdige tanker om arkitektur"
date: "2026-07-20"
description: "Noen tidlige ideer som ikke er klare for publisering."
draft: true
---
```

## Slug Strategy

The slug is derived from the filename. No explicit slug field in frontmatter.

A file named `content/posts/min-foerste-artikkel.md` produces the URL `/blog/min-foerste-artikkel`.

Rules:

- Use lowercase.
- Use hyphens to separate words.
- Use only a-z, 0-9, and hyphens.
- No dates in filenames. The date lives in frontmatter.

This keeps the system simple: one file, one slug, no ambiguity.

## Draft Strategy

A post with `draft: true` is excluded from the blog list and from static generation in production builds.

In local development, drafts are visible so the author can preview them.

The `draft` field is optional. When omitted, the post is considered published.
