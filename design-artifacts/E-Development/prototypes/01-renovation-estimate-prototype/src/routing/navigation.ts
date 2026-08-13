interface NavigationOptions {
  replace?: boolean;
}

export function navigate(
  pathname: string,
  { replace = false }: NavigationOptions = {},
): void {
  if (window.location.pathname === pathname) {
    return;
  }

  if (replace) {
    window.history.replaceState({}, "", pathname);
  } else {
    window.history.pushState({}, "", pathname);
  }
  window.dispatchEvent(new PopStateEvent("popstate"));
}
