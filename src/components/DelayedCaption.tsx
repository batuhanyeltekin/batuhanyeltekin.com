"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

interface DelayedCaptionProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export default function DelayedCaption({
  children,
  className,
  delayMs = 3050,
}: DelayedCaptionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setVisible(true);
    }, delayMs);

    return () => window.clearTimeout(timeout);
  }, [delayMs]);

  return (
    <figcaption
      aria-hidden={!visible}
      className={clsx(
        "transition duration-500 ease-out",
        visible ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0",
        className,
      )}
    >
      {children}
    </figcaption>
  );
}
