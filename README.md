# OpenTAO

[![Live](https://img.shields.io/badge/site-opentao.ai-b8470b)](https://opentao.ai)
[![License](https://img.shields.io/badge/content-CC%20BY--SA%204.0-blue)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Code](https://img.shields.io/badge/code-MIT-green)](#license)
[![Astro](https://img.shields.io/badge/astro-6.3-ff5d01)](https://astro.build)
[![Pages](https://img.shields.io/badge/pages-318+-0c0c10)](https://opentao.ai)

Builder's Gateway to Bittensor — docs / community / build / mine.

Independent, community-built, CC BY-SA 4.0. Not affiliated with the Opentensor Foundation.

## Stack

- **Astro 6** — static site, content-collection-ready
- **Tailwind v4** (CSS `@theme`)
- **MDX** for long-form content
- **Preact** islands for the few interactive bits (⌘K search)
- **Pagefind** — static, build-time search index
- **Cloudflare Pages** — deploy target

## Commands

```sh
bun install            # one-time install

bun run dev            # dev server at localhost:4321
                       # ⚠ search modal opens but index is not built in dev

bun run build          # static build → dist/  +  pagefind index

bun run preview        # serve dist/ locally
bun run preview:full   # build + preview (search works here)
```

## Project layout

```
src/
├── pages/              file-routed pages (.astro / .mdx)
│   ├── index.astro                       landing
│   ├── beginner/                         wiki, subnets directory, 26 concepts, 12 subnet details
│   ├── build/                            hackathon, incubator, idea-bank
│   ├── mine/                             general-setup, playbooks, resources
│   └── community/                        events, chapters, insights, become-a-host, details, contribute
├── layouts/BaseLayout.astro              loads fonts + global.css + Nav + Footer
├── components/
│   ├── Nav.astro                         top global nav with 4 dropdowns + ⌘K
│   ├── Footer.astro
│   ├── SubNav.astro                      per-section tab bar
│   ├── Breadcrumb.astro
│   └── SearchModal.tsx                   Preact island, Pagefind-powered
├── data/                                 hardcoded data fed into [slug].astro routes
│   ├── concepts.ts
│   ├── subnets.ts
│   ├── chapters.ts
│   ├── events.ts
│   └── insights.ts
└── styles/global.css                     design tokens (Tailwind v4 @theme) + .card / .btn / .nav-dropdown etc.

public/
├── opentaoai.jpeg                        logo (favicon + nav)
├── robots.txt
└── _headers                              Cloudflare Pages cache rules

astro.config.mjs                          integrations: mdx, preact, sitemap; i18n EN/中
wrangler.toml                             Cloudflare Pages config
```

## Adding content

Most content currently lives inline in `.astro` files or in `src/data/*.ts`.

To add a new entry:
- **Chapter** → append to `src/data/chapters.ts`; route auto-generates at `/community/chapters/{slug}`
- **Event** → append to `src/data/events.ts`; route at `/community/events/{slug}`
- **Insight** → append to `src/data/insights.ts`; route at `/community/insights/{slug}`
- **Concept** → append to `src/data/concepts.ts`; route at `/beginner/concepts/{slug}`
- **Subnet** → append to `src/data/subnets.ts`; route at `/beginner/subnets/{slug}`

For content-heavy pages (long-form articles, hero subnets), add a standalone `.astro` file at the same slug and mark the data entry as `rich: true` so the dynamic route skips it.

## Deploy

### Cloudflare Pages (recommended)

Option A — **Git integration** (push to deploy):

1. `git init && git add . && git commit -m "init"`
2. Push to GitHub: `https://github.com/opentao-ai/opentao`
3. In Cloudflare dashboard → Pages → Connect to Git → pick repo
4. Build settings:
   - Build command: `bun run build`
   - Build output directory: `dist`
   - Environment: `NODE_VERSION=22`
5. Every push to main auto-deploys.

Option B — **Direct upload** via wrangler:

```sh
bun run build
bunx wrangler pages deploy dist --project-name=opentao
```

### Search

Pagefind generates the search index into `dist/pagefind/` during `bun run build`. It ships ~1MB of indexed content for 73 pages / ~3000 words. The ⌘K modal lazy-loads `/pagefind/pagefind.js` on first open.

## v1 known gaps

- No backend for forms — submit opens `mailto:cameron@moonshotcommons.com` as a v1 stopgap. Wire to GitHub PR / Formspree / Cloudflare Worker before scaling.
- No `/zh/` content yet — i18n routing config is in place, no translated pages exist.
- Live chain stats (landing) are hardcoded — wire to a Cloudflare Worker cron pulling from Taostats or chain RPC.
- Luma "Register" buttons on event pages are `#` — drop in real Luma URLs per event in `src/data/events.ts`.
- `/mine/playbooks/{slug}` detail pages don't exist — playbooks listing links them but they 404. Stub or remove anchors.

## License

CC BY-SA 4.0 for all content. Code MIT.
