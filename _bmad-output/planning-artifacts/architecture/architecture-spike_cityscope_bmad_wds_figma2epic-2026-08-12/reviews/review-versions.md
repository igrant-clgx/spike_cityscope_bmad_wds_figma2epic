# Architecture Reviewer Gate — Technology Version Reality Check

**Reviewed file:** `_bmad-output/planning-artifacts/architecture/architecture-spike_cityscope_bmad_wds_figma2epic-2026-08-12/ARCHITECTURE-SPINE.md`  
**Review date:** 2026-08-12  
**Lens:** Verify Stack table and implied architecture choices were live-checked rather than asserted from model/training data.

## Verdict

**PASS-WITH-FINDINGS** — The named pinned npm packages all exist, the pinned versions are current `latest` dist-tags on the live npm registry, and the major peer ranges are mutually compatible for Next.js 16 + React 19 + MUI 9. The architecture should still tighten a few reproducibility/runtime details: TypeScript is unpinned, `react-dom` and Emotion packages are implied but not separately pinned, and the Node runtime floor required by Next.js 16 is not stated.

## Evidence sources checked

- Live npm registry package metadata via `https://registry.npmjs.org/<package>` on 2026-08-12.
- Next.js 16.3.0 documentation pages:
  - `https://nextjs.org/docs/app/getting-started/route-handlers`
  - `https://nextjs.org/docs/app/guides/backend-for-frontend`
  - `https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config`
- MUI Grid documentation: `https://mui.com/material-ui/react-grid/`
- MUI 9.3.1 package tarball contents from npm for Grid export sanity check.

## Stack table checks

| Technology in Stack table | Architecture version | Live npm result | Peer / compatibility check | Status |
| --- | ---: | --- | --- | --- |
| TypeScript | `current (strict)` | `typescript` package exists; `latest` dist-tag returned `7.0.2`; package engines `node >=16.20.0`. | No direct React/Next peer relationship in the checked package metadata. However, the architecture does not pin an actual TypeScript version. | **Finding** |
| Next.js (App Router) | `16.3.0` | `next` exists; `16.3.0` exists and is `latest`. | Peer deps include `react` and `react-dom`: `^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0`; engines require `node >=20.9.0`. React 19.2.8 satisfies. | **Pass** |
| React | `19.2.8` | `react` exists; `19.2.8` exists and is `latest`. | Satisfies Next.js 16 and MUI 9 peer ranges. | **Pass** |
| @mui/material (+ @emotion) | `9.3.1` | `@mui/material` exists; `9.3.1` exists and is `latest`. | Peer deps allow `react` / `react-dom` `^17 || ^18 || ^19`; Emotion peers: `@emotion/react ^11.5.0`, `@emotion/styled ^11.3.0` optional. Current Emotion latest versions checked: `@emotion/react 11.14.0`, `@emotion/styled 11.14.1`, both satisfy. | **Pass with caveat** |
| @tanstack/react-query | `5.101.4` | Package exists; `5.101.4` exists and is `latest`. | Peer deps: `react ^18 || ^19`; React 19.2.8 satisfies. | **Pass** |
| react-hook-form | `7.85.0` | Package exists; `7.85.0` exists and is `latest`. | Peer deps: `react ^16.8.0 || ^17 || ^18 || ^19`; React 19.2.8 satisfies. Engines require `node >=18.0.0`, covered by Next's `>=20.9.0`. | **Pass** |
| zod | `4.4.3` | Package exists; `4.4.3` exists and is `latest`. | No relevant peer deps. | **Pass** |

## Compatibility conclusions

### Next.js 16 + React 19

Confirmed compatible from live npm metadata: `next@16.3.0` declares peer ranges for both `react` and `react-dom` that include `^19.0.0`. The pinned `react@19.2.8` satisfies this. The Stack table should add/pin `react-dom` because Next and MUI both require it as a peer, even though it is implicit in a React/Next app.

### MUI 9 + React 19 + Emotion

Confirmed compatible from live npm metadata: `@mui/material@9.3.1` declares `react` and `react-dom` peer ranges including `^19.0.0`, and Emotion peer ranges compatible with current `@emotion/react@11.14.0` and `@emotion/styled@11.14.1`. Because the Stack row says `(+ @emotion)` without versions, the implementation should pin the actual Emotion packages rather than relying on an implied dependency.

### MUI Grid API at this major

Sanity-checked against current MUI Grid docs and the `@mui/material@9.3.1` tarball. The package contains `package/Grid/*` and does not contain `Grid2`, `Unstable_Grid2`, or `GridLegacy` exports. Current docs describe the Grid API using `container`, `spacing`, and `size` / responsive `size={{ xs, sm, ... }}` props. Implementation should avoid older GridLegacy/Grid2 naming and older breakpoint-item props such as `xs={6}` if code is generated from older examples.

### Next.js App Router Route Handlers as BFF

Confirmed by Next.js 16.3.0 docs: Route Handlers are supported in the `app` directory via `route.ts`/`route.js`; supported methods include `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`. Next.js docs explicitly describe a Backend-for-Frontend pattern using Route Handlers, with the caveat that Route Handlers are public HTTP endpoints and are not a full backend replacement. The architecture's BFF choice is valid, but security must rely on server-side validation, CORS/origin controls, consent checks, and secret isolation, not merely on the browser using same-origin fetch.

### Vercel / Node-compatible deployment

The deployment statement is directionally valid: Next.js Route Segment Config docs list default runtime as `nodejs`, and `next@16.3.0` requires `node >=20.9.0`. The architecture should explicitly record that Node floor in the deployment/runtime decision so a generic “Node-compatible host” cannot be interpreted as an older Node LTS/container image.

## Findings

### F-1 — Medium — TypeScript is not pinned despite the Stack table being otherwise version-pinned

The Stack table says `TypeScript | current (strict)` rather than a concrete npm version. Live npm confirms the package exists and current `latest` is `7.0.2`, but `current` is mutable and not reproducible. If this is a committed architecture stack, pin a concrete TypeScript major/minor/patch in the architecture or defer the exact version explicitly to `package.json`/lockfile ownership.

### F-2 — Medium — Next.js 16 runtime floor is unstated

Live npm metadata for `next@16.3.0` requires `node >=20.9.0`. The architecture says “Node-compatible host (e.g. Vercel or a Node container)” but does not state the minimum Node version. Add the Node runtime floor to prevent incompatible container/base-image choices.

### F-3 — Low — Required React DOM peer is implicit, not pinned

Both `next@16.3.0` and `@mui/material@9.3.1` declare `react-dom` as a peer compatible with React 19. The Stack table pins `react` but omits `react-dom`. Add `react-dom 19.2.8` or otherwise state it is pinned alongside React.

### F-4 — Low — Emotion packages are implied by the MUI row but not version-pinned

`@mui/material@9.3.1` has optional Emotion peers `@emotion/react ^11.5.0` and `@emotion/styled ^11.3.0`. Current npm `latest` versions (`11.14.0` and `11.14.1`) satisfy those ranges. If the default Emotion styled engine is intended, pin both packages explicitly; if not, document the alternate styled engine choice.

### F-5 — Low — MUI Grid usage must follow the MUI 9 Grid API

MUI 9.3.1 package contents expose `Grid` and not `Grid2`, `Unstable_Grid2`, or `GridLegacy`. Current docs show `size={...}` / responsive `size={{ xs, sm }}` rather than older GridLegacy item breakpoint props. Add a note to coding standards or generated component guidance to avoid stale Grid examples.

## Overall gate result

No evidence that the pinned stack versions were hallucinated: every pinned version in the Stack table exists and is current on npm as of this review. The remaining issues are documentation/reproducibility hardening rather than blockers to the architecture decision.
