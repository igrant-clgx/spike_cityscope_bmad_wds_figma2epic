import { useState } from "react";
import { advancedSearchNotice } from "../../prototype/fixture";

export function AdvancedSearchNotice() {
  const [isNoticeVisible, setIsNoticeVisible] = useState(false);

  return (
    <div className="address-search-hero__recovery">
      <p id="address-search-hero-address-recovery-prompt">
        Address not showing?
      </p>
      <button
        id="address-search-hero-advanced-search-link"
        className="address-search-hero__advanced-search"
        type="button"
        aria-describedby={
          isNoticeVisible ? "address-search-advanced-search-notice" : undefined
        }
        onClick={() => setIsNoticeVisible(true)}
      >
        Use Advanced Search
      </button>
      {isNoticeVisible ? (
        <p
          id="address-search-advanced-search-notice"
          className="address-search-hero__advanced-search-notice"
          role="status"
        >
          {advancedSearchNotice}
        </p>
      ) : null}
    </div>
  );
}
