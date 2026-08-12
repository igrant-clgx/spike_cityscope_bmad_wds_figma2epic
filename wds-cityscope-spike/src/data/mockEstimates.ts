// Stub static dataset for renovation cost estimates (AD-3: no live API calls).
// Populated by Story 3.1 (View Cost Estimate & Supporting Info).
export interface MockEstimate {
  id: string;
  totalCost: number;
}

export const mockEstimates: MockEstimate[] = [];
