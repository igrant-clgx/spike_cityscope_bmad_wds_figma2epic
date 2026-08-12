- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-greenfield-scaffold.md`
  summary: No automated enforcement of the inward dependency rule (domain must not import framework/UI/adapter/vendor code).
  evidence: The rule is documented in README and satisfied by the current code (verified by grep), but nothing prevents a future dev from importing `next`/`react`/an adapter into `src/server/domain/**`. Add an ESLint `no-restricted-imports`/`import/no-restricted-paths` boundary rule or an architecture test.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-greenfield-scaffold.md`
  summary: `src/lib/api-client.ts` `apiFetch` has no error handling — throws raw errors on network failure, non-JSON/empty bodies, or non-envelope responses, and ignores HTTP status.
  evidence: Two reviewers independently flagged this. The spec deliberately scopes api-client error/pending/retry handling to Story 1.4 (Shared feedback primitives); the helper is currently unused by any user path. Story 1.4 must add: try/catch around fetch, `safeParse` for the envelope, response.ok/status handling, and typed errors carrying requestId for correlation.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-greenfield-scaffold.md`
  summary: tsconfig enables `strict` but omits `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
  evidence: For a money/domain foundation using `readonly string[]` index access and many optional envelope/port fields, these two flags add meaningful safety. Consider enabling `noUncheckedIndexedAccess` (low-risk) in a later hardening pass; `exactOptionalPropertyTypes` may require code adjustments.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-design-system-theme.md`
  summary: The no-ad-hoc-hex convention test only catches hex literals (not `rgb()`/`hsl()`/CSS named colours) and has no fs-error/symlink handling.
  evidence: Edge Case Hunter flagged that a dev could bypass token enforcement with non-hex colour formats, and that an unreadable file/symlink would crash the walk rather than report. The AC is hex-specific and the spike repo has no symlinks; acceptable for now. If brand-layer enforcement becomes CI-critical, broaden the regex to all colour formats and wrap fs reads in try/catch.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-design-system-theme.md`
  summary: `header-bg` (#2C2C2C) and `disabled` (#CCCCCC) palette tokens live only in `src/theme/tokens.ts`, not mapped into MUI palette slots.
  evidence: Blind Hunter noted these two brand colours aren't exposed on the MUI theme. MUI has no natural slot for a header background, and the charcoal header is built in Story 1.3; disabled-control states arrive with the form controls (Epics 2–5). Consumers read them from `tokens.ts` today. Wire into the theme (custom palette augmentation or component overrides) when the header and disabled states are implemented.
