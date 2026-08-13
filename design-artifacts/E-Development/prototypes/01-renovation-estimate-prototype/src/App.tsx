import { useEffect, useLayoutEffect, useState } from "react";
import { AddressSearchHero } from "./components/address-search/AddressSearchHero";
import {
  EstimateResultPage,
  EstimateResultRecovery,
} from "./components/estimate-result/EstimateResultPage";
import { PageChrome } from "./components/page-chrome/PageChrome";
import { RenovationDetailsPage } from "./components/renovation-details/RenovationDetailsPage";
import { navigate } from "./routing/navigation";
import { applyRouteMetadata } from "./routing/metadata";
import { usePrototypeFlow } from "./state/PrototypeFlowContext";
import {
  DETAILS_ROUTE,
  RESULT_ROUTE,
  SEARCH_ROUTE,
  getDetailsGuard,
  getResultGuard,
} from "./routing/guards";

function usePathname(): string {
  const [pathname, setPathname] = useState(window.location.pathname);

  useLayoutEffect(() => {
    const handleNavigation = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handleNavigation);
    return () => window.removeEventListener("popstate", handleNavigation);
  }, []);

  return pathname;
}

function SearchPlaceholder() {
  return (
    <PageChrome>
      <AddressSearchHero />
    </PageChrome>
  );
}

function UnknownRouteRedirect() {
  useEffect(() => {
    navigate(SEARCH_ROUTE, { replace: true });
  }, []);

  return <main aria-busy="true">Returning to Address Search.</main>;
}

function DetailsPlaceholder() {
  const { state } = usePrototypeFlow();
  const guard = getDetailsGuard(state);

  useEffect(() => {
    if (!guard.allowed) {
      navigate(guard.redirect, { replace: true });
    }
  }, [guard.allowed, guard.allowed ? undefined : guard.redirect]);

  if (!guard.allowed) {
    return <main aria-busy="true">Returning to Address Search.</main>;
  }

  return <RenovationDetailsPage />;
}

function ResultPlaceholder() {
  const { state } = usePrototypeFlow();
  const guard = getResultGuard(state);

  if (!guard.allowed) {
    return <EstimateResultRecovery recoveryRoute={guard.recoveryRoute} />;
  }

  return <EstimateResultPage />;
}

export function App() {
  const pathname = usePathname();

  useEffect(() => {
    applyRouteMetadata(pathname);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  if (pathname === DETAILS_ROUTE) {
    return <DetailsPlaceholder />;
  }

  if (pathname === RESULT_ROUTE) {
    return <ResultPlaceholder />;
  }

  if (pathname !== SEARCH_ROUTE) {
    return <UnknownRouteRedirect />;
  }

  return <SearchPlaceholder />;
}
