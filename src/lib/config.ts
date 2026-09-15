// Frontend configuration. Everything here must be PUBLIC — it is inlined into
// the static client bundle by Next.js at build time, so this file is the ONLY
// safe place for values the browser can see. NEVER put an API key or other
// secret here.
//
// The public worker this site calls to generate results. It is a public
// endpoint (not a secret), set from the NEXT_PUBLIC_WORKER_URL env var so it is
// baked in when the site is built:
//
//   - Locally:  put a line like NEXT_PUBLIC_WORKER_URL=https://your-worker.your-name.workers.dev
//               in .env.local (see .env.example), then run `npm run build`.
//   - On GitHub Pages: set a repository *variable* named WORKER_URL (Settings
//               → Secrets and variables → Actions → Variables — it is NOT a
//               secret) to the Worker URL. The deploy workflow inlines it into
//               the build automatically. The Worker URL stays out of the repo
//               but is a public value, so storing it as a plain repo variable
//               is safe.
//
// When empty, the generator cannot reach a backend and shows a clear setup
// message instead of failing silently.
export const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL?.trim() || "";
