# YouTube SEO Generator

A small, production-ready tool that turns a video topic into 10 YouTube title
ideas, one description, and a set of tags.

Built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

## Environment variables

The server-side generation endpoint needs an AI provider API key. Copy
`.env.example` to `.env.local` and set your key:

```bash
AI_API_KEY=your_key_here
```

Optional overrides:

- `AI_MODEL` – model name (default `gpt-4o-mini`)
- `AI_BASE_URL` – override the API base URL for alternative providers

The key is only read server-side and is never exposed to the client. The
provider logic lives in `src/lib/provider.ts` and can be swapped out without
touching the API route.

## Commands

```bash
npm run dev        # start the dev server
npm run build      # production build
npm run start      # run the production build
npm run lint       # lint
npm run typecheck  # TypeScript type checking
```

## Routes

- `/` – the generator
- `/about` – what the tool does
- `/privacy`, `/terms` – legal pages
- `POST /api/generate` – the generation endpoint