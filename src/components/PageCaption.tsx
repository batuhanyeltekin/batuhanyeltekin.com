import type { CSSProperties } from "react";
import clsx from "clsx";

interface PageCaptionProps {
  text: string;
  id?: string;
  className?: string;
}

export default function PageCaption({ text, id, className }: PageCaptionProps) {
  const wordStyle = {
    "--page-caption-width": `${text.length + 0.6}ch`,
    animation: "page-caption-write 0.65s steps(12, end) 0.12s forwards",
  } as CSSProperties;

  return (
    <h1
      id={id}
      className={clsx(
        "inline-flex items-center font-mono text-2xl font-bold tracking-wide text-[var(--color-accent)] sm:text-3xl",
        className,
      )}
    >
      <span className="page-caption-word" style={wordStyle}>
        {text}
      </span>
      <span
        className="ml-1 inline-block h-[1em] w-2 translate-y-[0.08em] bg-[var(--color-accent)] animate-pulse"
        aria-hidden="true"
      />
    </h1>
  );
}
