import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query client factory + SSR-safe accessor (AD-5), the standard Next
 * App Router pattern. On the server a fresh client is made per request (no
 * cross-request state bleed); in the browser a module-level singleton is reused
 * so cache survives client navigations.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always a brand-new client per request.
    return makeQueryClient();
  }
  // Browser: reuse one client across the app lifetime.
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
