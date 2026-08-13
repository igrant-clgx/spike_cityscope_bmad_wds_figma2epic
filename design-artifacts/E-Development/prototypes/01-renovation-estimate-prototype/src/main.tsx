import React from "react";
import ReactDOM from "react-dom/client";
import "@ensemble/lib/styles";
import "@ensemble/lib/components/btn";
import "@ensemble/lib/components/footer";
import { App } from "./App";
import { PrototypeFlowProvider } from "./state/PrototypeFlowContext";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Application root element was not found.");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <PrototypeFlowProvider>
      <App />
    </PrototypeFlowProvider>
  </React.StrictMode>,
);
