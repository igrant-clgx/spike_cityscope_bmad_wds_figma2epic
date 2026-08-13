import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from "react";
import {
  initialPrototypeFlowState,
  prototypeFlowReducer,
  type PrototypeFlowAction,
  type PrototypeFlowState,
} from "./prototypeFlow";

interface PrototypeFlowContextValue {
  state: PrototypeFlowState;
  dispatch: Dispatch<PrototypeFlowAction>;
}

const PrototypeFlowContext = createContext<PrototypeFlowContextValue | null>(null);

interface PrototypeFlowProviderProps {
  initialState?: PrototypeFlowState;
}

export function PrototypeFlowProvider({
  children,
  initialState = initialPrototypeFlowState,
}: PropsWithChildren<PrototypeFlowProviderProps>) {
  const [state, dispatch] = useReducer(
    prototypeFlowReducer,
    initialState,
  );
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <PrototypeFlowContext.Provider value={value}>
      {children}
    </PrototypeFlowContext.Provider>
  );
}

export function usePrototypeFlow(): PrototypeFlowContextValue {
  const context = useContext(PrototypeFlowContext);

  if (!context) {
    throw new Error("usePrototypeFlow must be used within PrototypeFlowProvider.");
  }

  return context;
}
