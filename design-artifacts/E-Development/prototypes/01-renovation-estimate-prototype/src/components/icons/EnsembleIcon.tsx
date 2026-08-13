import { useEffect, useRef } from "react";

interface EnsembleIconProps {
  createIcon: (settings?: { fill?: string; size?: number }) => SVGElement;
  className: string;
  id?: string;
  size?: number;
}

export function EnsembleIcon({
  createIcon,
  className,
  id,
  size = 24,
}: EnsembleIconProps) {
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const icon = createIcon({ fill: "currentColor", size });
    iconRef.current?.append(icon);
    return () => icon.remove();
  }, [createIcon, size]);

  return (
    <span
      ref={iconRef}
      id={id}
      className={className}
      aria-hidden="true"
    />
  );
}
