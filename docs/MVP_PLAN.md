# MVP Implementation Plan

## Goal

A static personal publishing platform deployed to Vercel. Markdown articles rendered as HTML. No database, no CMS, no authentication.

## Folder Structure

```
hugomoen-platform/
├── content/
│   └── posts/                  # Markdown articles with YAML frontmatter
│       └── velkommen.md        # Sample post
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: header, footer, metadata
│   │   ├── page.tsx            # Home page
│   │   ├── blog/
│   │   │   ├── page.tsx        # Blog list: all published posts sorted by date
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Article page: single post rendered from Markdown
│   │   └── om/
│   │       └── page.tsx        # About page
│   └── lib/
│       └── posts.ts            # Read, parse, and query Markdown files
├── public/                     # Static assets (favicon, images)
├── docs/                       # Project documentation
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── .env.example
```

### Decisions

- `src/` prefix keeps application code separated from content and config.
- `content/posts/` lives outside `src/` because content is not application code.
- `src/lib/posts.ts` is a single module. No abstraction layers, no content SDK.
- `/om` instead of `/about` because the platform is in Norwegian.
- No `components/` directory until there are shared components worth extracting.

## Dependencies

### Production

| Package      | Purpose                           |
|--------------|-----------------------------------|
| next         | Framework. Static export.         |
| react        | Required by Next.js.              |
| react-dom    | Required by Next.js.              |
| gray-matter  | Parse YAML frontmatter.           |
| remark       | Parse Markdown to AST.            |
| remark-html  | Render Markdown AST to HTML.      |

### Development

| Package                  | Purpose                    |
|--------------------------|----------------------------|
| typescript               | Type checking.             |
| @types/react             | React type definitions.    |
| @types/node              | Node.js type definitions.  |
| tailwindcss              | Utility-first CSS.         |
| @tailwindcss/typography  | Prose styling for articles.|
| postcss                  | Required by Tailwind.      |
| eslint                   | Linting.                   |
| eslint-config-next       | Next.js ESLint rules.      |

### What is excluded

- No database driver. No database.
- No headless CMS client. Content is local files.
- No state management library. No client-side state.
- No testing framework in MVP. Added when there is logic worth testing.
- No analytics. Can be added later without code changes (Vercel Analytics is a config toggle).

## Implementation Phases

### Phase 1: Scaffold

Set up the project foundation.

- Initialize Next.js with TypeScript, Tailwind, App Router, `src/` directory.
- Configure `next.config.ts` with `output: 'export'` for static generation.
- Configure Tailwind with `@tailwindcss/typography`.
- Clean up generated boilerplate.
- Verify `npm run build` produces static output.

### Phase 2: Content layer

Build the mechanism for reading Markdown files.

- Create `src/lib/posts.ts` with functions:
  - `getAllPosts()` — returns all published posts sorted by date descending.
  - `getPostBySlug(slug)` — returns a single post with parsed HTML content.
- Create a sample post in `content/posts/velkommen.md`.
- Implement draft filtering: exclude `draft: true` posts when `NODE_ENV` is `production`.

### Phase 3: Layout and home page

- Build root layout with site title, navigation (Hjem, Blogg, Om), and footer.
- Build home page with a brief introduction and a link to the blog.
- Apply Tailwind typography for readable text.

### Phase 4: Blog list

- Build `/blog` page using `getAllPosts()`.
- Render each post as a list item: title (linked), date, description.
- Sorted by date, newest first.

### Phase 5: Article page

- Build `/blog/[slug]` using `getPostBySlug()`.
- Use `generateStaticParams()` to pre-render all post pages at build time.
- Render article title, date, and HTML content.
- Apply prose styling via Tailwind typography.

### Phase 6: About page

- Build `/om` as a static page.
- Content is hardcoded in the component for now. Markdown sourcing can come later if needed.

### Phase 7: Deploy

- Connect repository to Vercel.
- Verify static export builds and deploys successfully.
- Verify all pages render correctly in production.

## Risks and Tradeoffs

### Next.js for a static blog

**Tradeoff.** Next.js is heavier than purpose-built static generators like Astro. The MVP uses none of its server-side features. The justification is forward-looking: Phase 2 (search) and Future (AI search, knowledge graph) may need server capabilities. If those features never materialize, the platform carries unnecessary framework weight.

**Mitigation.** `output: 'export'` constrains the MVP to static generation only. This keeps the deployed output simple and makes migration to another tool possible if Next.js proves to be overkill.

### No testing in MVP

**Risk.** The content layer (`posts.ts`) is the most critical piece and has no tests. A bug in frontmatter parsing or slug derivation would silently break the site.

**Mitigation.** The content layer is a single file with two functions. Manual verification during development is sufficient for the MVP scope. Tests should be added when the content layer gains complexity (tags, search indexing, multiple content types).

### Markdown rendering via remark-html

**Tradeoff.** `remark-html` produces raw HTML rendered via `dangerouslySetInnerHTML`. This is safe when the only content author is the site owner, but becomes a security concern if content sources expand.

**Mitigation.** Acceptable for a single-author personal blog. If content sources change, switch to `remark-rehype` with a sanitization step.

### No incremental adoption path for dynamic features

**Tradeoff.** `output: 'export'` means the entire site is static. Adding a single dynamic feature (API route, server component with runtime data) requires removing the export config and switching to standard Vercel deployment.

**Mitigation.** This is a configuration change, not a rewrite. The application code does not need to change.

### Tailwind typography for article styling

**Tradeoff.** `@tailwindcss/typography` provides good defaults but limited control over article-specific styling. Custom prose styles require overriding Tailwind's generated classes.

**Mitigation.** The plugin covers the MVP needs. Custom article styling is a future concern that can be addressed by extending the typography config.

### No content validation

**Risk.** Nothing prevents a malformed frontmatter file from breaking the build. A missing `title` or `date` field would cause a runtime error during static generation.

**Mitigation.** For a single author writing a handful of articles, this is low risk. Build failures surface the problem immediately. Formal validation (e.g., Zod schema) is worth adding when the content volume grows.
