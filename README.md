# Spike — Cityscope Renovation Cost Calculator

Greenfield walking skeleton (Story 1.1): a Next.js 16 App Router + TypeScript
(strict) application with a Ports & Adapters source tree, one shared Zod
response-envelope contract, and a single trivial BFF health route.

## Requirements

- Node.js ≥ 20 (developed on Node 26).
- npm.

> This project pins the public npm registry via a project-level `.npmrc`
> (`registry=https://registry.npmjs.org/`) because the machine's global npmrc
> points at an unusable Artifactory base URL. Keep `.npmrc` in the repo.

## Run

```bash
npm install       # install deps from the public registry
npm run dev       # start the dev server at http://localhost:3000
```

Then check the health endpoint:

```bash
curl -s localhost:3000/api/v1/health
# {"ok":true,"data":{"status":"ok"},"requestId":"<non-empty>"}
```

## Scripts

| Script              | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Next.js dev server                       |
| `npm run build`     | Production build                         |
| `npm run start`     | Serve the production build               |
| `npm run lint`      | ESLint (Next.js config)                  |
| `npm run typecheck` | `tsc --noEmit` (strict)                  |
| `npm test`          | Vitest (unit tests, non-watch)           |

## Source tree & dependency rule

Architecture is **Ports & Adapters (Hexagonal)** with a domain core behind a
Next.js BFF. **The dependency direction points inward** and no edge may run
right-to-left:

```
client (app/, src/*) → BFF route handlers (app/api/**) → application use-cases → domain + ports
```

```
app/
  layout.tsx, page.tsx          # root layout + placeholder walking-skeleton home
  api/v1/health/route.ts        # BFF health route → success envelope
src/
  lib/api-client.ts             # the only client→BFF caller (envelope parsing; retry added in Story 1.4)
  shared/schemas/               # Zod contracts imported by client AND server (envelope)
  server/
    application/                # use-cases (e.g. health)
    domain/                     # pure domain — money.ts (AudCents), NO framework/vendor imports
    domain/ports/               # port interfaces: EstimateEngine, AddressProvider, ConfigSource, LeadSink, AnalyticsSink
```

**Inward dependency rule:** files under `src/server/domain/**` (including
`domain/ports/**`) must import **no** React, Next.js, MUI, adapter, or vendor
code. The domain stays pure so later stories can swap adapters without touching
it.

**Money convention:** all monetary values are **integer AUD cents** in the
domain and across every API payload (see `src/server/domain/money.ts`).
Formatting to an AUD string happens only at the view edge.

**Response envelope:** every BFF response uses one envelope —
success `{ ok: true, data, requestId }`, error
`{ ok: false, error: { code, message, fieldErrors? }, requestId }` — defined
once in `src/shared/schemas/envelope.ts`.
