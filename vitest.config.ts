import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

/**
 * Vitest config: maps the TS path aliases (`@/*`, `@shared/*`, `@server/*`)
 * so tests resolve them the same way `tsc`/Next do. NODE environment only —
 * no jsdom. No new dependencies added (vitest is already a devDependency).
 */
export default defineConfig({
  resolve: {
    alias: {
      '@/': fileURLToPath(new URL('./src/', import.meta.url)),
      '@shared/': fileURLToPath(new URL('./src/shared/', import.meta.url)),
      '@server/': fileURLToPath(new URL('./src/server/', import.meta.url)),
    },
  },
});
