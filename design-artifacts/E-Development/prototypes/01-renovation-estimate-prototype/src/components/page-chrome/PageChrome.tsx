import type { ReactNode } from "react";
import { BrandHeader } from "./BrandHeader";
import { DisclaimerFooter } from "./DisclaimerFooter";
import "./page-chrome.css";

interface PageChromeProps {
  children: ReactNode;
  objectIdPrefix?: string;
}

export function PageChrome({
  children,
  objectIdPrefix = "address-search",
}: PageChromeProps) {
  return (
    <div className="page-chrome">
      <BrandHeader objectIdPrefix={objectIdPrefix} />
      {children}
      <DisclaimerFooter objectIdPrefix={objectIdPrefix} />
    </div>
  );
}
