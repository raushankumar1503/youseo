# YouTube SEO Generator (YouSEO)

A small, free, ad-free tool that turns a video topic into the metadata you
paste into YouTube Studio: **one best title**, **three alternative titles**, a
**description**, and **tags**.

Built with Next.js (App Router), TypeScript, and Tailwind CSS. The site is
exported as **fully static HTML and deployed to GitHub Pages** — there is no
server route, no database, and no authentication. Text generation happens in a
**Cloudflare Worker** that calls the **Gemini API Free Tier**, so the whole
project stays at $0.

```
Browser (static GitHub Pages site)
        │  POST  { "topic": "..." }   ← to a public Worker URL
        ▼
Cloudflare Worker  (workers/)   ← your Gemini API key lives ONLY here, as a
        │                        secret binding. It never reaches the browser.
        ▼
Gemini API (Google AI Studio Free Tier)
```

## Why this architecture

GitHub Pages hosts only static files — it has no server, so a Next.js route
handler cannot run there (which is exactly why the old `POST /api/generate`
route was removed). Instead:

- The **frontend** is pure static JS/CSS. On submit it `POST`s the topic to a
  small Cloudflare Worker.
- The **Worker** holds your Gemini API key as a **secret binding** (never
  committed, never in the client bundle), calls the Gemini API, validates the
  result, and returns the finished metadata.
- The key never appears in the browser bundle, so visitors can't extract it.

This keeps the public site "serverless-friendly": the frontend is free to host
on GitHub Pages, and the only cost is the Worker's execution on Cloudflare's
free plan plus free-tier Gemini usage.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

The generator reads one public value, inlined at build time:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_WORKER_URL` | The Worker URL the frontend calls to generate. Leave empty to see a clear "not configured" message instead of a doomed request. |

The site URL and identity constants live in `src/lib/site.ts` (hardcoded, not
from env). The **public contact email** is configured in `SITE.email` there too:
set it to your real address (e.g. `you@yourdomain.com`) to show the Contact form
and mailto link. If you leave it `""`, the Contact page shows a friendly
"getting it ready" notice instead of a dead email form. Do not ship a placeholder
like `x@example.com`. There is no `POST /api/generate` route anymore.

## Setup: Cloudflare Worker + Gemini (one-time, run by you)

The Worker lives in `workers/`. To create the backend:

1. **Create a Gemini API key (Free Tier).**
   1. Go to the [Google AI Studio API key page](https://aistudio.google.com/apikey).
   2. Click **Create API key** and copy it. Free keys need no payment method.
   3. Optionally verify which model is actually free today at the
      [Gemini models docs](https://ai.google.dev/gemini-api/docs/models) — the
      Worker defaults to `gemini-2.5-flash`, but your current free-tier model
      name is the only thing that decides what your key can call. Check the
      Free Tier column before relying on it.
   4. If you want a different model, set `GEMINI_MODEL` in
      `workers/wrangler.toml` (it's a `vars` binding).

2. **Deploy the Worker** (from `workers/`):
   ```bash
   cd workers
   npx wrangler login
   npx wrangler secret put GEMINI_API_KEY      # paste the key from step 1
   npx wrangler deploy
   ```
   Note the Worker URL wrangler prints (e.g.
   `https://youseo-generator.<your-subdomain>.workers.dev`). The API key is a
   **secret** binding — it's stored by Cloudflare, not in your repo.

3. **Point the site at the Worker.**
   - **Local**: put the URL in `.env.local` as `NEXT_PUBLIC_WORKER_URL=...`
     and rebuild.
   - **GitHub Pages**: set one repository **variable** under
     **Settings → Secrets and variables → Actions → Variables** (a plain
     variable, not a secret — the Worker URL is public):
     - `WORKER_URL` = the Worker URL.
     The deploy workflow inlines it into the build automatically.
     The Worker only accepts requests whose `Origin` matches the GitHub Pages
     origin hardcoded in `workers/src/index.js` (`ALLOWED_ORIGINS`), so other
     sites can't use your free quota. If you ever change the Pages origin or
     add one, update that list and redeploy the Worker.

Because `NEXT_PUBLIC_WORKER_URL` is baked into the static bundle at build time,
**any change to the Worker URL requires a rebuild + redeploy** of the site. The
frontend and the Worker URL always move together.

## Commands

```bash
npm run dev        # start the dev server
npm run build      # production static export (writes out/)
npm run start      # serve the production build locally
npm run lint       # lint
npm run typecheck  # TypeScript type check (tsc --noEmit)
npm test           # provider + worker-parser unit tests
```

## Routes

- `/` — the generator
- `/about` — what this tool is
- `/how-it-works`
- `/guides` — index, plus 8 guide articles under `/guides/<slug>`
- `/contact`
- `/privacy-policy`, `/terms`, `/disclaimer`
- `/sitemap.xml`, `/robots.txt` — generated at build time
- `/404` — GitHub Pages serves this as its custom 404

## Deployment

GitHub Pages deploy is handled by `.github/workflows/deploy.yml` (build →
static export → upload → deploy), triggered on push to `main`. See the
**Setup** section above for the two repository variables the build needs.

Before the first public deploy, confirm at the
[Gemini models page](https://ai.google.dev/gemini-api/docs/models) which model
your free tier actually includes, and keep `GEMINI_MODEL` in
`workers/wrangler.toml` pointing at a free one.
