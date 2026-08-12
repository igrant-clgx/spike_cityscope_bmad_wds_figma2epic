import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve, isAbsolute } from "node:path";

/**
 * Inward-dependency boundary arch test (Epic 1/2/3 action item, landed here
 * FIRST per Story 4.1). Retires the manual grep that has guarded layer purity
 * across four adapters on borrowed time — the STORY HEADLINE deliverable.
 *
 * Scans every non-test TS source file (`.ts`/`.tsx`/`.mts`/`.cts`) under
 * `src/server/domain/**` and `src/server/adapters/**` and asserts NONE contain a
 * real inward-violating IMPORT of `next`, `react`(/`react-dom`), `@mui/*`, or
 * `zod`; and that a domain file never imports an adapter, nor an adapter a
 * DIFFERENT adapter (importing within its own adapter folder is fine).
 *
 * A JSDoc/comment mention is ALLOWED and so is an import-like STRING literal:
 * comments AND string/template literals are stripped/tokenized before scanning,
 * so only genuine `import`/`export ... from`/`require`/dynamic-`import()`
 * statements count. The scan + classify logic is factored into pure helpers so
 * the self-check can assert them directly against synthetic sources.
 */

const here = dirname(fileURLToPath(import.meta.url)); // .../src/server
const SERVER_ROOT = here;
const DOMAIN_DIR = join(here, "domain");
const ADAPTERS_DIR = join(here, "adapters");

const SRC_EXT = /\.(ts|tsx|mts|cts)$/;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue; // never follow symlinks (loop guard)
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (SRC_EXT.test(entry.name) && !/\.test\./.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const SENTINEL = "\u0000";

/**
 * Tokenize a source into a "skeleton" where every string/template literal is
 * replaced by a `\0<idx>\0` sentinel and line/block comments by a space. Returns
 * the skeleton plus the ordered raw string values. Because a whole string token
 * collapses to ONE sentinel, import-like text INSIDE a string can never look
 * like a statement, and comments never survive at all.
 */
function tokenize(source: string): { skeleton: string; strings: string[] } {
  const strings: string[] = [];
  let out = "";
  let i = 0;
  const n = source.length;
  while (i < n) {
    const c = source[i];
    const c2 = i + 1 < n ? source[i + 1] : "";
    if (c === "/" && c2 === "/") {
      i += 2;
      while (i < n && source[i] !== "\n") i += 1;
      out += " ";
      continue;
    }
    if (c === "/" && c2 === "*") {
      i += 2;
      while (i < n && !(source[i] === "*" && source[i + 1] === "/")) i += 1;
      i += 2;
      out += " ";
      continue;
    }
    if (c === "'" || c === '"' || c === "`") {
      const quote = c;
      i += 1;
      let val = "";
      while (i < n) {
        const ch = source[i];
        if (ch === "\\") {
          val += ch + (i + 1 < n ? source[i + 1] : "");
          i += 2;
          continue;
        }
        if (ch === quote) {
          i += 1;
          break;
        }
        val += ch;
        i += 1;
      }
      out += `${SENTINEL}${strings.length}${SENTINEL}`;
      strings.push(val);
      continue;
    }
    out += c;
    i += 1;
  }
  return { skeleton: out, strings };
}

/**
 * Extract every module specifier referenced by a real import/export-from,
 * bare-import, `require(...)`, or dynamic `import(...)` — including MULTILINE
 * forms. Comments and string literals cannot produce a hit.
 */
export function extractSpecifiers(source: string): string[] {
  const { skeleton, strings } = tokenize(source);
  const specs: string[] = [];
  const push = (idxStr: string) => {
    const idx = Number(idxStr);
    if (Number.isInteger(idx) && idx >= 0 && idx < strings.length) {
      specs.push(strings[idx]);
    }
  };
  const S = `${SENTINEL}(\\d+)${SENTINEL}`;
  const patterns = [
    new RegExp(`\\bimport\\b[\\s\\S]*?\\bfrom\\s*${S}`, "g"), // import ... from '...'
    new RegExp(`\\bexport\\b[\\s\\S]*?\\bfrom\\s*${S}`, "g"), // export ... from '...'
    new RegExp(`\\bimport\\s*${S}`, "g"), // bare import '...'
    new RegExp(`\\bimport\\s*\\(\\s*${S}`, "g"), // dynamic import('...')
    new RegExp(`\\brequire\\s*\\(\\s*${S}`, "g"), // require('...')
  ];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(skeleton)) !== null) {
      push(m[1]);
    }
  }
  return [...new Set(specs)];
}

export interface Violation {
  file: string;
  spec: string;
  reason: string;
}

/** A bare (non-relative, non-internal-alias) module specifier. */
function isBareModule(spec: string): boolean {
  return !(
    spec.startsWith(".") ||
    spec.startsWith("@server/") ||
    spec.startsWith("@shared/") ||
    spec.startsWith("@/")
  );
}

/** Forbidden vendor/framework for BOTH domain and adapters, or null. */
function forbiddenVendor(spec: string): string | null {
  if (!isBareModule(spec)) return null;
  if (/^next(\/|$)/.test(spec)) return "imports `next`";
  if (/^react(-dom)?(\/|$)/.test(spec)) return "imports `react`";
  if (/^@mui\//.test(spec)) return "imports `@mui/*`";
  if (/^zod(\/|$)/.test(spec)) return "imports `zod`";
  return null;
}

/** Resolve an internal specifier to an absolute path, or null if external. */
function resolveInternal(file: string, spec: string): string | null {
  if (spec.startsWith("@server/")) {
    return resolve(SERVER_ROOT, spec.slice("@server/".length));
  }
  if (spec.startsWith(".")) {
    return resolve(dirname(file), spec);
  }
  return null;
}

function isUnder(root: string, target: string): boolean {
  const rel = relative(root, target);
  return rel !== "" && !rel.startsWith("..") && !isAbsolute(rel);
}

/** The absolute path of the adapter subdir owning `file` (or null). */
function ownAdapterSubdir(file: string): string | null {
  if (!isUnder(ADAPTERS_DIR, file)) return null;
  const first = relative(ADAPTERS_DIR, file).split(/[\\/]/)[0];
  return first ? join(ADAPTERS_DIR, first) : null;
}

/** Classify every specifier in one file's source into layer-boundary violations. */
export function analyzeSource(file: string, source: string): Violation[] {
  const violations: Violation[] = [];
  const inDomain = isUnder(DOMAIN_DIR, file);
  const inAdapters = isUnder(ADAPTERS_DIR, file);
  const ownSubdir = ownAdapterSubdir(file);

  for (const spec of extractSpecifiers(source)) {
    const vendor = forbiddenVendor(spec);
    if (vendor !== null) {
      violations.push({ file, spec, reason: vendor });
      continue;
    }

    const target = resolveInternal(file, spec);
    if (target === null) continue;

    if (inDomain && isUnder(ADAPTERS_DIR, target)) {
      violations.push({ file, spec, reason: "domain imports an adapter" });
      continue;
    }

    if (inAdapters && isUnder(ADAPTERS_DIR, target) && ownSubdir !== null) {
      if (!isUnder(ownSubdir, target)) {
        violations.push({ file, spec, reason: "adapter imports a sibling adapter" });
      }
    }
  }
  return violations;
}

function scanTree(dir: string): Violation[] {
  return walk(dir).flatMap((file) => analyzeSource(file, readFileSync(file, "utf8")));
}

function format(violations: Violation[]): string {
  return violations.map((v) => `${v.file}: ${v.reason} ("${v.spec}")`).join("\n");
}

describe("server layer boundaries", () => {
  it("no domain file imports next/react/@mui/zod or an adapter", () => {
    const violations = scanTree(DOMAIN_DIR);
    expect(violations, format(violations)).toEqual([]);
  });

  it("no adapter file imports next/react/@mui/zod or a DIFFERENT adapter", () => {
    const violations = scanTree(ADAPTERS_DIR);
    expect(violations, format(violations)).toEqual([]);
  });

  it("self-check: the matcher/classifier catches real violations and ignores decoys", () => {
    const domainFile = join(DOMAIN_DIR, "synthetic.ts");
    const estimateAdapterFile = join(ADAPTERS_DIR, "estimate", "synthetic.ts");

    // (i) MULTILINE static import of a forbidden vendor subpath.
    const multiline = [
      "import {",
      "  NextResponse,",
      "} from 'next/server';",
    ].join("\n");
    expect(analyzeSource(domainFile, multiline).map((v) => v.spec)).toEqual(["next/server"]);

    // (ii) RELATIVE cross-adapter import from an adapter in a DIFFERENT folder.
    const crossAdapter = "import x from '../address/foo';";
    const crossViolations = analyzeSource(estimateAdapterFile, crossAdapter);
    expect(crossViolations).toHaveLength(1);
    expect(crossViolations[0].reason).toBe("adapter imports a sibling adapter");

    // (iii) DYNAMIC import of a forbidden vendor.
    const dynamic = "const m = import('@mui/material');";
    expect(analyzeSource(domainFile, dynamic).map((v) => v.reason)).toEqual([
      "imports `@mui/*`",
    ]);

    // Decoy A: a JSDoc mention must NOT be flagged.
    const jsdoc = "/** import { Box } from '@mui/material' -- allowed prose */\nexport const y = 1;";
    expect(analyzeSource(domainFile, jsdoc)).toEqual([]);
    expect(extractSpecifiers(jsdoc)).toEqual([]);

    // Decoy B: an import-like STRING literal must NOT be flagged.
    const stringLiteral = "const s = \"import x from 'react'\";";
    expect(analyzeSource(domainFile, stringLiteral)).toEqual([]);
    expect(extractSpecifiers(stringLiteral)).toEqual([]);

    // Decoy C: an adapter importing WITHIN its own folder is allowed.
    const ownFolder = "import { helper } from './helper';\nimport y from '../estimate/other';";
    expect(analyzeSource(estimateAdapterFile, ownFolder)).toEqual([]);
  });
});
