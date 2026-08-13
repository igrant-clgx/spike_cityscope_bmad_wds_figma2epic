// Static dataset for renovation cost estimates (AD-3: no live API calls,
// NFR3). Keyed by the "what to renovate" option (see mockRenovationOptions.ts).
export interface CostRange {
  low: number;
  high: number;
}

// Kitchen range matches the Figma reference exactly ($32,700 - $40,000);
// remaining ranges are plausible static placeholders (no live pricing data).
export const mockEstimates: Record<string, CostRange> = {
  Kitchen: { low: 32700, high: 40000 },
  Bathroom: { low: 18500, high: 24000 },
  Ensuite: { low: 14000, high: 19500 },
  Toilet: { low: 6500, high: 9500 },
  'Paint Interior': { low: 4500, high: 8000 },
  'Built in Wardrobe': { low: 3500, high: 6500 },
  'Redo the floor': { low: 8500, high: 15000 },
  'Convert to Bathroom': { low: 20000, high: 28000 },
};

const defaultRange: CostRange = { low: 10000, high: 20000 };

/**
 * Returns the static cost-range estimate for the first "what to renovate"
 * selection. Falls back to a sensible default range if the selection is
 * empty/missing or doesn't match a known key (e.g. direct navigation to
 * /estimate without completing the Questionnaire).
 */
export function getEstimateForRenovation(whatToRenovate: string[]): CostRange {
  const key = whatToRenovate?.[0];
  if (!key) {
    return defaultRange;
  }
  return mockEstimates[key] ?? defaultRange;
}
