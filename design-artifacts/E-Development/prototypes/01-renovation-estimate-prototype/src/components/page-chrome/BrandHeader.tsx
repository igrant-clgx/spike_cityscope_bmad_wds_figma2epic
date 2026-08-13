import { useState } from "react";
import demoChannelLogo from "../../assets/brands/demo-channel-placeholder.png";

interface BrandHeaderProps {
  objectIdPrefix?: string;
}

function DemoChannelBrand({ objectIdPrefix }: Required<BrandHeaderProps>) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return (
      <span
        id={`${objectIdPrefix}-header-brand-image`}
        className="page-chrome__brand-fallback"
        role="img"
        aria-label="Demo Channel"
      >
        Demo Channel
      </span>
    );
  }

  return (
    <img
      id={`${objectIdPrefix}-header-brand-image`}
      className="page-chrome__service-logo"
      src={demoChannelLogo}
      alt="Demo Channel"
      width="126"
      height="33"
      loading="eager"
      onError={() => setImageFailed(true)}
    />
  );
}

export function BrandHeader({
  objectIdPrefix = "address-search",
}: BrandHeaderProps) {
  return (
    <header
      id={`${objectIdPrefix}-header`}
      className="page-chrome__header"
    >
      <DemoChannelBrand objectIdPrefix={objectIdPrefix} />
      <span
        id={`${objectIdPrefix}-header-partner-brand-image`}
        className="page-chrome__partner-fallback"
        role="img"
        aria-label="Cotality"
      >
        Cotality
      </span>
    </header>
  );
}
