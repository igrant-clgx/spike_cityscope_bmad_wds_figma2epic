export const DISCLAIMER_COPY =
  "Disclaimer: The Renovation Calculator Report is available to customers who provide their contact details for Demo Channel to contact them about products and services. Renovation Calculator Report are prepared by Cotality. The statements, information and opinions contained in those reports are those of Cotality only, and Demo Channel AU does not endorse or accept any liability for them.";

interface DisclaimerFooterProps {
  objectIdPrefix?: string;
}

export function DisclaimerFooter({
  objectIdPrefix = "address-search",
}: DisclaimerFooterProps) {
  return (
    <en-footer
      id={`${objectIdPrefix}-footer-disclaimer`}
      label="Renovation calculator disclaimer"
    >
      <p
        id={`${objectIdPrefix}-footer-disclaimer-copy`}
        className="page-chrome__disclaimer"
      >
        {DISCLAIMER_COPY}
      </p>
    </en-footer>
  );
}
