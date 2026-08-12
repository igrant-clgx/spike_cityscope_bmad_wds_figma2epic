import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// Single shared flow-state context (AD-1). All pages (Address Entry,
// Questionnaire, Estimate Report) read/write this shared state instead of
// holding renovation-flow answers in local component state.
export interface EstimateFlowState {
  address: string;
  renovationType: string;
  whatToRenovate: string[];
  sizeSqm: number | null;
  qualityTier: string;
}

const initialState: EstimateFlowState = {
  address: '',
  renovationType: '',
  whatToRenovate: [],
  sizeSqm: null,
  qualityTier: '',
};

interface EstimateFlowContextValue extends EstimateFlowState {
  setAddress: (value: string) => void;
  setRenovationType: (value: string) => void;
  setWhatToRenovate: (value: string[]) => void;
  setSizeSqm: (value: number | null) => void;
  setQualityTier: (value: string) => void;
  /**
   * Clears all flow state back to initial values. Not consumed until Story
   * 3.2 ("New Estimate" action), but built here so that shared file doesn't
   * need to change later.
   */
  resetFlow: () => void;
}

const EstimateFlowContext = createContext<EstimateFlowContextValue | undefined>(undefined);

export function EstimateFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EstimateFlowState>(initialState);

  const value = useMemo<EstimateFlowContextValue>(
    () => ({
      ...state,
      setAddress: (address) => setState((prev) => ({ ...prev, address })),
      setRenovationType: (renovationType) => setState((prev) => ({ ...prev, renovationType })),
      setWhatToRenovate: (whatToRenovate) => setState((prev) => ({ ...prev, whatToRenovate })),
      setSizeSqm: (sizeSqm) => setState((prev) => ({ ...prev, sizeSqm })),
      setQualityTier: (qualityTier) => setState((prev) => ({ ...prev, qualityTier })),
      resetFlow: () => setState(initialState),
    }),
    [state],
  );

  return <EstimateFlowContext.Provider value={value}>{children}</EstimateFlowContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- intentional: hook co-located with its provider
export function useEstimateFlow(): EstimateFlowContextValue {
  const context = useContext(EstimateFlowContext);
  if (!context) {
    throw new Error('useEstimateFlow must be used within an EstimateFlowProvider');
  }
  return context;
}
