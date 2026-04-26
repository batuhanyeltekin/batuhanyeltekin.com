import React from 'react';
import { HAMMER_ASCII } from './hammerAscii';

export default function UnderConstruction({ pageName }: { pageName: string }) {
  // We trim leading newlines if any
  const cleanHammer = HAMMER_ASCII.replace(/^\n+|\n+$/g, '');

  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-20 text-center animate-in fade-in duration-500 w-full">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-accent)] capitalize tracking-wide">
        {pageName}
      </h1>
      <pre 
        className="text-[var(--color-accent)] mb-8 text-left"
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: "min(8px, 1vw)",
          lineHeight: "1em",
          letterSpacing: "0px",
        }}
      >
        {cleanHammer}
      </pre>
      <p className="text-[var(--color-muted)] font-mono text-sm sm:text-base">under construction -- check back soon!</p>
    </div>
  );
}
