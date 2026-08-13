import { useEffect, useRef } from "react";

export function useNativeClick<T extends HTMLElement>(
  handler: () => void,
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    element.addEventListener("click", handler);
    return () => element.removeEventListener("click", handler);
  });

  return elementRef;
}
