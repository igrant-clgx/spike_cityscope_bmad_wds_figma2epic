import { DETAILS_ROUTE, RESULT_ROUTE, SEARCH_ROUTE } from "./guards";

interface RouteMetadata {
  description: string;
  robots: "index, follow" | "noindex, nofollow";
}

const routeMetadata: Record<string, RouteMetadata> = {
  [SEARCH_ROUTE]: {
    description:
      "Find a property and create an indicative renovation cost estimate.",
    robots: "index, follow",
  },
  [DETAILS_ROUTE]: {
    description: "Describe a renovation for the selected property.",
    robots: "noindex, nofollow",
  },
  [RESULT_ROUTE]: {
    description: "Review an indicative renovation cost estimate.",
    robots: "noindex, nofollow",
  },
};

export function getRouteMetadata(pathname: string): RouteMetadata {
  return (
    routeMetadata[pathname] ?? {
      description: "Visual prototype of a renovation estimate journey.",
      robots: "noindex, nofollow",
    }
  );
}

export function applyRouteMetadata(pathname: string): void {
  const metadata = getRouteMetadata(pathname);
  const description = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]',
  );
  let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');

  if (!robots) {
    robots = document.createElement("meta");
    robots.name = "robots";
    document.head.append(robots);
  }

  document.title = "Renovation Calculator Report";
  description?.setAttribute("content", metadata.description);
  robots.content = metadata.robots;
}
