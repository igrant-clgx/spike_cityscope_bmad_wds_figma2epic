import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * Convention test: no ad-hoc hex colour literals may live outside `src/theme/**`.
 *
 * All brand hex values belong in `src/theme/tokens.ts`; every other module must
 * read colours from the theme. This scans the whole `src` tree (recursively),
 * excludes `src/theme`, and fails loudly listing any offenders.
 */

const SRC_ROOT = join(process.cwd(), 'src');
const APP_ROOT = join(process.cwd(), 'app');
const EXCLUDED_DIR = join(SRC_ROOT, 'theme');
const SCAN_ROOTS = [SRC_ROOT, APP_ROOT];
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
const CODE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs)$/;

function collectFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (full === EXCLUDED_DIR || full.startsWith(EXCLUDED_DIR + sep)) continue;
    if (statSync(full).isDirectory()) {
      out.push(...collectFiles(full));
    } else if (CODE_EXT.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe('no ad-hoc hex outside src/theme', () => {
  it('finds no hex colour literals in src/** and app/** (excluding src/theme/**)', () => {
    const offenders: string[] = [];
    for (const root of SCAN_ROOTS) {
      for (const file of collectFiles(root)) {
        const lines = readFileSync(file, 'utf8').split('\n');
        lines.forEach((line, i) => {
          if (HEX_RE.test(line)) {
            offenders.push(`${relative(process.cwd(), file)}:${i + 1}: ${line.trim()}`);
          }
        });
      }
    }
    expect(offenders, `Ad-hoc hex literals found:\n${offenders.join('\n')}`).toEqual([]);
  });
});
