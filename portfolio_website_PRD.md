# PRD: Personal Portfolio Website with CLI-Style Interface

| Field | Value |
|---|---|
| Document type | Product Requirements Document |
| Audience | Coding agent (e.g., Claude Code, Cursor) building the site end-to-end |
| Status | Draft v1.0 — ready for implementation |
| Owner | Site owner |
| Last updated | 2026-04-25 |

---

## 1. Overview

This PRD specifies a personal portfolio website that combines a memorable, interactive landing experience with conventional sub-pages for substantive content. The signature element is a **CLI-style (terminal/command-line inspired) landing page** where keyboard-savvy visitors can navigate the site using arrow keys and Enter, while still allowing mouse/touch users to click through normally.

The site must function as a credible professional portfolio: bio, work experience, resume download, projects (with GitHub links), and a blog. It should feel polished, fast, and distinctive — not a generic developer-portfolio template.

### 1.1 Goals

- Present the owner's professional identity, work history, and projects clearly to recruiters, hiring managers, and collaborators.
- Deliver a memorable first impression via a CLI-style interactive landing page that doubles as the primary navigation.
- Enable the owner to publish blog posts easily without redeploying the site for every post (or with a one-command deploy at minimum).
- Be performant (Lighthouse Performance ≥ 90), accessible (WCAG 2.1 AA on all non-CLI pages, see §6), and SEO-friendly.
- Be cheap or free to host, and easy for the owner to maintain solo.

### 1.2 Non-goals

- No e-commerce, payments, or paid memberships.
- No multi-author CMS, comments, or user accounts for visitors.
- No analytics dashboards beyond basic privacy-respecting page-view counts.
- No native mobile apps.

---

## 2. Target Users & Use Cases

| User | Primary goal | Entry point |
|---|---|---|
| Recruiter / hiring manager | Quickly verify experience, skim resume, see projects | Direct link, LinkedIn, Google search |
| Engineer peer / collaborator | Read blog posts, browse code on GitHub, gauge depth | HN, X/Twitter, blog post share |
| Curious visitor | Explore the CLI gimmick, learn who the owner is | Word of mouth, portfolio aggregator |
| Owner (you) | Publish a new blog post; update resume | Admin / git push |

---

## 3. Information Architecture

The site is a small set of routes. The landing page (`/`) presents the CLI interface; selecting an option routes to a dedicated page, each of which has standard, conventional UI (the CLI aesthetic only governs the landing page and a thin top-bar echo on sub-pages — see §5.2).

| Route | Purpose | CLI label |
|---|---|---|
| `/` | Landing — CLI interface and primary nav | — (the menu itself) |
| `/about` | Bio, photo, short narrative, contact links | `about` |
| `/experience` | Work experience timeline | `experience` |
| `/resume` | Embedded resume + PDF download link | `resume` |
| `/projects` | Projects grid with GitHub links | `projects` |
| `/blog` | Blog index (chronological list) | `blog` |
| `/blog/[slug]` | Individual blog post | (via blog index) |
| `/contact` (optional) | Contact info, mailto, social links — may be folded into `/about` | `contact` |
| `/404` | Custom 404 styled as CLI "command not found" | — |

---

## 4. Functional Requirements

### 4.1 Landing page — CLI interface

The landing page is the showpiece. It mimics a terminal but is a **custom UI built in HTML/CSS/JS — not a real shell**.

#### 4.1.1 Visual layout

- Full-viewport dark background (configurable; default near-black, e.g., `#0B0F14` or `#0E0E10`).
- Monospace font (JetBrains Mono, Fira Code, or IBM Plex Mono) at ~16–18px.
- A header block at top showing an ASCII art name/logo OR a faux shell prompt like `visitor@<owner-handle>:~$ whoami`.
- Below the prompt: a few lines of "boot" or intro text (typewriter-animated on first load only — see §4.1.4).
- A menu of options rendered like a `select` prompt, e.g.:

```
Choose a section: (use ↑ ↓ arrow keys, press Enter)

  ❯ about
    experience
    resume
    projects
    blog
    contact
```

- A subtle blinking block cursor (CSS animation) on the prompt line.
- Optional faint scanline / CRT effect — must be toggleable and OFF by default if it harms readability.

#### 4.1.2 Keyboard interaction (desktop)

- **Up Arrow / `k`** → move selection up (wraps from top to bottom).
- **Down Arrow / `j`** → move selection down (wraps from bottom to top).
- **Enter / Return** → navigate to the selected route.
- **Tab** → also moves selection down (for keyboard users who don't know vim bindings).
- **Number keys 1–6** → jump to and select the Nth option.
- **Typing letters** → fuzzy-match against option labels; if a unique prefix matches, highlight it; Enter confirms. Esc clears the buffer.
- **`?` or `h`** → show a small help overlay listing keybindings.
- All key handlers must be attached to the document but ignored when focus is in an input field.

#### 4.1.3 Mouse and touch interaction

- Each menu option is also a clickable link (anchor tag underneath). Hovering it moves the `❯` pointer to that line.
- On touch devices, the CLI gimmick gracefully degrades: see §5.3 for mobile fallback.

#### 4.1.4 Boot animation

- On first load (per session, gated by `sessionStorage`), play a short typewriter sequence of intro lines (≤ 1.5 seconds total).
- Subsequent visits in the same session render the final state immediately — no re-animation.
- A visible "skip" hint ("press any key to skip") is shown during the animation; pressing any key jumps to the final state.
- Users with `prefers-reduced-motion: reduce` skip the animation entirely.

#### 4.1.5 Easter-egg commands (optional, low priority)

A hidden command input can be revealed by pressing `:` or `/`, accepting commands like:

- `help` — list available commands
- `whoami` — print bio one-liner
- `ls` — print routes
- `cat resume.pdf` — open resume
- `clear` — reset screen
- `sudo hire-me` — fun easter egg, opens contact

> This is a stretch goal. Ship the arrow-key menu first; commands can be added in a later iteration.

### 4.2 Sub-pages

#### 4.2.1 `/about` — Bio

- Headshot or avatar (optional; owner-supplied).
- Short bio: 2–4 paragraphs covering who you are, what you do, and what you care about.
- Quick-facts list: location, current role, areas of interest.
- Contact links: email (mailto), GitHub, LinkedIn, X/Twitter, any others — as small icon buttons.

#### 4.2.2 `/experience` — Work experience

- Reverse-chronological timeline of roles.
- Each entry: company, role, dates, location, 2–5 bullet points of impact, optional company logo.
- Driven by a structured data file (see §7.2) — no hardcoded JSX per role.
- Optionally collapsible/expandable per role to keep the page scannable.

#### 4.2.3 `/resume` — Resume

- Embed a PDF viewer (browser-native `<iframe>` or `<embed>` is fine) showing the resume inline.
- Prominent "Download PDF" button linking to the same file.
- The PDF lives in the repo at `/public/resume.pdf` (or equivalent) so updating it is a single commit.
- Last-updated date displayed on the page, derived from the file's git-modified time or a frontmatter field.

#### 4.2.4 `/projects` — Projects

- Responsive grid of project cards (desktop: 2–3 columns; mobile: 1).
- Each card: project name, 1–2 sentence description, tech tags, GitHub link, optional live-demo link, optional thumbnail.
- Driven by a structured data file (see §7.2).
- Optional: a single "All my repos" link to `https://github.com/<owner>` near the top.
- Optional: featured/pinned projects rendered larger at the top of the grid.

#### 4.2.5 `/blog` — Blog

See §4.3 for the full blog spec. `/blog` renders an index of posts (title, date, ~1-line excerpt, tags), reverse-chronological. `/blog/[slug]` renders an individual post.

#### 4.2.6 Sub-page chrome

- Each sub-page has a small persistent header echoing the CLI motif: e.g., a faux prompt line `~/about $` that doubles as a "back to /" link.
- Sub-page typography is conventional and readable (sans-serif body, monospace for accents only). **Do NOT keep the full CLI aesthetic on content pages — readability beats theme.**
- A footer on every sub-page with: copyright, "built with [stack]" credit, and links to GitHub/email.

### 4.3 Blog

#### 4.3.1 Recommendation: Markdown + Git, no backend

The recommended approach is to author blog posts as Markdown (or MDX) files committed to the repo, rendered statically at build time. This is the simplest, cheapest, fastest, and most reliable option for a single-author personal blog.

| Option | Pros | Cons |
|---|---|---|
| **Markdown in repo (recommended)** | No backend, no DB, free to host, version-controlled, fast, works offline, deploys via git push | Must commit a file to publish; mild friction for posting on mobile |
| Headless CMS (e.g., Contentlayer + Sanity/Notion) | Web UI for writing; can post from anywhere | Adds external dependency, build complexity, some cost |
| Custom backend (Node + Postgres) | Maximum flexibility | Highest cost, most maintenance — not justified for solo blog |

> **Default decision:** ship with Markdown-in-repo. If the owner later wants a web editor, they can layer a CMS on top without breaking existing posts.

#### 4.3.2 Post structure

Each post is a Markdown file in `/content/blog/` with frontmatter:

```markdown
---
title: "Why I rewrote my portfolio in CLI"
date: 2026-04-25
excerpt: "A short hook for the index page."
tags: ["meta", "frontend"]
draft: false
---

# Heading

Body content in Markdown...
```

#### 4.3.3 Rendering requirements

- Syntax-highlighted code blocks (Shiki, Prism, or rehype-pretty-code).
- Auto-generated heading anchor links.
- Reading-time estimate at the top of each post.
- Optional table of contents for long posts.
- Posts with `draft: true` are excluded from the index in production.
- RSS feed at `/rss.xml` generated at build time.

### 4.4 Cross-cutting features

- **Light/dark mode toggle** (dark default to match CLI aesthetic). Stored in `localStorage`. Respects `prefers-color-scheme` on first visit.
- **SEO**: per-page `<title>` and `<meta description>`, OpenGraph and Twitter card tags, `sitemap.xml`, `robots.txt`.
- **Favicon** and a simple OG image.
- **Privacy-respecting analytics** (Plausible, Umami, or Cloudflare Web Analytics). No Google Analytics, no cookie banner needed.
- **404 page** styled as `bash: command not found: <path>` with a link back to `/`.

---

## 5. Design Requirements

### 5.1 Aesthetic direction

- Overall vibe: **confident, technical, minimal**. Think "thoughtfully designed terminal" not "edgy hacker."
- **Color palette**: a near-black background, off-white primary text, and ONE accent color (suggested: a green like `#4ADE80`, an amber like `#FBBF24`, or a cyan like `#22D3EE`). Pick one and use it consistently.
- **Typography**: monospace for the CLI and code; a clean sans-serif (Inter, Geist, or system-ui) for sub-page body text.
- **Spacing**: generous, calm. Resist the urge to pack things in.
- **Motion**: subtle. Cursor blink, hover transitions, reduced-motion respected. No parallax, no auto-playing video.

### 5.2 Sub-page design

- Sub-pages share the dark background and accent color but use sans-serif body text and conventional layout.
- A small monospace prompt-like header (e.g., `~/projects $ ls`) sits at the top of each sub-page as a stylistic callback to the landing page. Clicking it returns to `/`.
- Long-form content (blog posts, `/about`) caps body width at ~70ch for readability.

### 5.3 Mobile / touch behavior

On viewports `< 768px` or devices without a physical keyboard, the CLI gimmick degrades:

- The boot animation still plays (briefly).
- The menu options render as **large, tappable buttons** stacked vertically — keeping the monospace styling and `❯` pointer on hover/focus, but no arrow-key navigation hint.
- A small "press ? for help (desktop)" hint is hidden on mobile.
- All sub-pages are fully responsive down to 360px wide.

### 5.4 Accessibility

- Color contrast meets WCAG 2.1 AA on all text (4.5:1 for body, 3:1 for large).
- The CLI menu is implemented with **semantic HTML**: a `<nav>` containing a list of `<a>` links. Arrow-key navigation is JS sugar layered on top — the page is fully usable with JS disabled and via screen readers.
- Selected menu item has a visible focus ring (not just the `❯` glyph) and `aria-current` set appropriately.
- All interactive elements are reachable via Tab.
- Images have meaningful `alt` text. Decorative images use `alt=""`.
- `prefers-reduced-motion` disables boot typewriter, cursor blink, and any non-essential animation.

---

## 6. Recommended Technology Stack

The agent should use this stack unless there's a strong reason to deviate. The stack is chosen for: free hosting, fast builds, great DX, and good defaults for static sites with markdown blogs.

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router)** or **Astro** | Both render markdown statically, support React components, are well-documented |
| Language | TypeScript | Catches errors at build time |
| Styling | Tailwind CSS | Fast iteration, consistent design tokens, small output |
| Markdown | MDX via `@next/mdx` or Astro's built-in MDX | Lets you embed components inside posts if needed |
| Syntax highlighting | Shiki (via `rehype-pretty-code`) | Server-rendered, no client JS, themeable |
| Hosting | Vercel, Netlify, or Cloudflare Pages (free tier) | Git push to deploy, free SSL, global CDN |
| Analytics | Plausible / Umami / Cloudflare Web Analytics | Privacy-respecting, no cookie banner needed |
| Domain | Owner-supplied custom domain | Configured via the host's dashboard |

> Either Next.js or Astro is acceptable. Astro is slightly simpler for content-heavy sites and ships less JS by default; Next.js has broader ecosystem support. **The agent should pick one and stay consistent.**

---

## 7. Data Model

### 7.1 Directory layout

```
/
├── content/
│   ├── blog/                # one .mdx file per post
│   ├── experience.json      # work history
│   └── projects.json        # projects
├── public/
│   ├── resume.pdf
│   ├── og-image.png
│   └── favicon.ico
├── src/
│   ├── app/  (or pages/, or src/pages/ for Astro)
│   ├── components/
│   │   ├── CLI/             # landing-page CLI components
│   │   └── ...
│   ├── lib/                 # data loaders, utilities
│   └── styles/
└── ...
```

### 7.2 Schemas

**`experience.json`**

```json
[
  {
    "company": "Acme Corp",
    "role": "Senior Engineer",
    "start": "2023-01",
    "end": "present",
    "location": "Remote",
    "logo": "/logos/acme.svg",
    "highlights": [
      "Led the rewrite of X, reducing P95 latency by 40%.",
      "Mentored 3 engineers."
    ]
  }
]
```

**`projects.json`**

```json
[
  {
    "name": "project-name",
    "description": "One- or two-sentence description.",
    "tags": ["TypeScript", "Postgres"],
    "github": "https://github.com/<owner>/<repo>",
    "demo": "https://demo.example.com",
    "thumbnail": "/projects/thumb.png",
    "featured": true
  }
]
```

---

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Lighthouse Performance ≥ 90 on landing and blog post pages (mobile and desktop). LCP < 2.5s on 4G. |
| Accessibility | Lighthouse Accessibility ≥ 95. Site usable via keyboard alone and via screen reader. |
| SEO | Lighthouse SEO ≥ 95. Sitemap and RSS present. |
| Bundle size | Initial JS payload on the landing page < 100 KB gzipped. |
| Build time | Full build < 60s on default CI runner. |
| Browser support | Latest 2 versions of Chrome, Safari, Firefox, Edge. Graceful degradation in older browsers (no broken layout). |
| Hosting cost | $0/month for compute and bandwidth at expected traffic (< 100k visits/mo). Domain cost only. |

---

## 9. Acceptance Criteria

The site is considered complete when ALL of the following are true.

### 9.1 Landing page

1. Visiting `/` shows the CLI interface with a boot animation that completes in ≤ 1.5s on a fresh load.
2. Up/Down arrow keys move the selection indicator and wrap at the edges.
3. Enter on a selected option navigates to the corresponding route.
4. Number keys 1–6 select the corresponding option.
5. Clicking any option navigates to the corresponding route.
6. On mobile, the menu renders as tappable buttons and is fully usable.
7. With JS disabled, all menu options remain clickable links that route correctly.
8. With `prefers-reduced-motion` set, no animations play.

### 9.2 Sub-pages

1. `/about` renders the bio, photo (if provided), and contact links.
2. `/experience` renders all entries from `experience.json` in reverse-chronological order.
3. `/resume` embeds the PDF and provides a working download link.
4. `/projects` renders all entries from `projects.json` with working GitHub links.
5. `/blog` lists all non-draft posts in reverse-chronological order with title, date, excerpt, and tags.
6. `/blog/[slug]` renders a post with syntax-highlighted code blocks and reading-time estimate.
7. `/rss.xml` is valid RSS 2.0 and lists all non-draft posts.
8. `/404` displays the custom CLI-styled 404 page.

### 9.3 Quality gates

1. Lighthouse scores meet the thresholds in §8 on the **deployed** site (not just localhost).
2. All routes are crawlable (in `sitemap.xml`) and indexable.
3. A new blog post can be published by adding a single `.mdx` file and pushing to `main`; no other changes required.
4. Updating `resume.pdf` and pushing to `main` updates the `/resume` page.
5. No console errors or warnings on any page in production.

---

## 10. Suggested Implementation Plan

The agent should work in vertical slices, deploying after each phase so the owner can review.

### Phase 1 — Scaffold and deploy

- Initialize the chosen framework with TypeScript and Tailwind.
- Set up the repo, deploy a "Hello world" to the host, configure the custom domain (or a placeholder).
- Set up linting, formatting, and a minimal CI check.

### Phase 2 — Static sub-pages

- Build `/about`, `/experience`, `/resume`, `/projects` with placeholder content.
- Wire up `experience.json` and `projects.json` data loaders.
- Add the small monospace prompt header and footer to each sub-page.

### Phase 3 — Blog

- Set up MDX rendering with syntax highlighting.
- Build `/blog` index and `/blog/[slug]` dynamic route.
- Add RSS feed and sitemap generation.
- Author one seed post to validate the pipeline.

### Phase 4 — CLI landing page

- Build the static markup: prompt, intro lines, menu list as semantic anchors. **Verify it works with JS disabled.**
- Layer on keyboard navigation (arrow keys, Enter, number keys, Tab).
- Add the typewriter boot animation, gated by `sessionStorage` and `prefers-reduced-motion`.
- Add the cursor blink and hover/focus styling.
- Add the help overlay (`?` / `h`).
- Test on mobile and ensure the fallback UX is good.

### Phase 5 — Polish

- Add SEO metadata, OG image, favicon.
- Add analytics.
- Add the CLI-styled 404 page.
- Run Lighthouse, fix anything below threshold.
- Optional: easter-egg command input (§4.1.5).

---

## 11. Open Questions for the Owner

The agent should proceed with reasonable defaults but flag these for confirmation:

1. **Accent color**: green, amber, cyan, or other?
2. **Domain name**: provided yet, or use a host-supplied subdomain initially?
3. **Photo on `/about`**: yes or no?
4. **Contact**: include `/contact` as a separate page, or fold into `/about`?
5. **Easter-egg commands**: ship in v1 or defer to v2?
6. **Light mode**: required, or dark-only is acceptable?

---

## 12. Out of Scope (Future Iterations)

- Web-based blog editor / CMS integration.
- Newsletter signup and email delivery.
- Comments on blog posts (consider Giscus if desired later — uses GitHub Discussions, no DB needed).
- Search across blog posts.
- Internationalization.
- A real in-browser shell with persistent filesystem (vs. the current faux CLI menu).
