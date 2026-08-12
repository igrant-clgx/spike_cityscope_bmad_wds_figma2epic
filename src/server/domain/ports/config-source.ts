/**
 * ConfigSource port (AD-2, AD-8). Serves versioned form configuration as data
 * (never hardcoded in client or handler code) — renovation items now, with
 * Step 3 questions added in a later story (OI-1/OI-2).
 *
 * Interface only at scaffold time — the concrete adapter (JSON/file → CMS)
 * is wired in a later story. No external I/O here.
 */
export interface ConfigSource {
  getRenovationItems(): Promise<ConfigBundle>;
}

export interface ConfigBundle {
  configVersion: string;
  itemIds: readonly string[];
}
