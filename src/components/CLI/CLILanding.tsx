"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CommandLine from "./CommandLine";
import { PORTRAIT_ASCII } from "./asciiPortrait";

const MENU_ITEMS = [
  { label: "about", href: "/about" },
  { label: "experience", href: "/experience" },
  { label: "resume", href: "/resume" },
  { label: "projects", href: "/projects" },
  { label: "blog", href: "/blog" },
];

const INTRO_LINES = [
  "Initializing system...",
  "Loading portfolio data...",
  "Welcome to Batuhan Yeltekin's terminal.",
];

let hasBootedThisSession = false;

export default function CLILanding() {
  const router = useRouter();
  const [booting, setBooting] = useState(true);
  const [asciiAnimating, setAsciiAnimating] = useState(true);
  const [asciiRender, setAsciiRender] = useState("");
  const [introText, setIntroText] = useState("");
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // Matrix ASCII effect logic
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion || hasBootedThisSession) {
      setAsciiAnimating(false);
      setBooting(false);
      setAsciiRender(PORTRAIT_ASCII);
      return;
    }

    if (!asciiAnimating) return;

    const cleanAscii = PORTRAIT_ASCII.replace(/^\n+|\n+$/g, '');
    const lines = cleanAscii.split('\n');
    const height = lines.length;
    const width = Math.max(...lines.map(l => l.length));
    
    // Start drops at random heights above 0
    const drops = Array.from({ length: width }, () => Math.floor(Math.random() * -30));

    const interval = setInterval(() => {
      let allDone = true;
      let newAscii = '\n'; // Preserve leading newline format
      
      for (let r = 0; r < height; r++) {
        let rowStr = '';
        const row = lines[r] || '';
        for (let c = 0; c < width; c++) {
          const dropY = drops[c];
          if (dropY < r) {
            rowStr += ' ';
            allDone = false;
          } else if (dropY - r < 5) {
            // Random ASCII printable character
            rowStr += String.fromCharCode(33 + Math.floor(Math.random() * 94));
            allDone = false;
          } else {
            rowStr += row[c] || ' ';
          }
        }
        newAscii += rowStr + '\n';
      }

      setAsciiRender(newAscii);

      // Move drops
      for (let c = 0; c < width; c++) {
        if (drops[c] < height + 5) {
          drops[c] += Math.random() > 0.5 ? 2 : 1;
        }
      }

      if (allDone) {
        clearInterval(interval);
        setTimeout(() => setAsciiAnimating(false), 200);
      }
    }, 20); // 50fps

    return () => clearInterval(interval);
  }, [asciiAnimating]);

  // Typewriter effect logic
  useEffect(() => {
    if (asciiAnimating) return;
    if (!booting) return;

    if (currentLineIdx >= INTRO_LINES.length) {
      setTimeout(() => {
        setBooting(false);
        hasBootedThisSession = true;
      }, 300);
      return;
    }

    const fullLine = INTRO_LINES[currentLineIdx] + "\n";
    let charIdx = 0;
    
    const interval = setInterval(() => {
      const charToAdd = fullLine.charAt(charIdx);
      setIntroText((prev) => prev + charToAdd);
      charIdx++;
      if (charIdx >= fullLine.length) {
        clearInterval(interval);
        setTimeout(() => setCurrentLineIdx((prev) => prev + 1), 150); // wait before next line
      }
    }, 15); // Fast typing

    return () => clearInterval(interval);
  }, [currentLineIdx, asciiAnimating, booting]);

  // Global keydown listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (booting || asciiAnimating) {
        // Skip boot on any key
        setAsciiAnimating(false);
        setBooting(false);
        setAsciiRender(PORTRAIT_ASCII);
        hasBootedThisSession = true;
        return;
      }

      // Ignore if focus is in an input (not likely here, but safe)
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      const key = e.key;
      
      if (key.toLowerCase() === "h" && e.ctrlKey) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }
      
      if (key === "Escape") {
        setShowHelp(false);
        return;
      }

      if (key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : MENU_ITEMS.length - 1));
      } else if (key === "ArrowDown" || key === "Tab") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < MENU_ITEMS.length - 1 ? prev + 1 : 0));
      } else if (key === "Enter") {
        // We only navigate if there's no command being typed
        // Since CommandLine handles typing, we'll let it handle Enter if there's text.
        // But how do we know if CommandLine has text?
        // We can just rely on Arrow keys for menu navigation, and Enter will always execute command OR navigate.
        // To avoid conflicts, we can just leave Enter here, but wait, CommandLine also listens to Enter.
        // Actually, let's just let Enter navigate if there is no text. But CLILanding doesn't know about CommandLine's text.
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [booting, asciiAnimating, selectedIndex, router]);

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;
    document.getElementById("cli-input")?.focus();
  };

  return (
    <div 
      className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-mono p-4 sm:p-8 flex flex-col justify-center items-center"
      onClick={handleContainerClick}
    >
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[var(--color-muted)]">
            <span className="text-[var(--color-accent)]">visitor@batuhanyeltekin:</span>
            <span className="text-blue-400">~</span>
            <span>$ whoami</span>
          </div>
          
          {booting || asciiAnimating ? (
            <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              <span 
                className="inline-block bg-clip-text text-transparent bg-center bg-no-repeat whitespace-pre font-mono"
                style={{ 
                  backgroundImage: "url('/san_fran_portrait.png')",
                  backgroundSize: "100% 100%",
                  fontSize: "min(5px, 0.8vw)",
                  lineHeight: "min(5px, 0.8vw)",
                  letterSpacing: "0px",
                }}
              >
                {asciiRender}
              </span>
              <br />
              <br />
              {introText}
              {booting && !asciiAnimating && <span className="inline-block w-2 h-4 bg-[var(--color-foreground)] animate-pulse ml-1 align-middle" />}
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base text-[var(--color-muted)]">
              <span 
                className="inline-block bg-clip-text text-transparent bg-center bg-no-repeat whitespace-pre font-mono"
                style={{ 
                  backgroundImage: "url('/san_fran_portrait.png')",
                  backgroundSize: "100% 100%",
                  fontSize: "min(5px, 0.8vw)",
                  lineHeight: "min(5px, 0.8vw)",
                  letterSpacing: "0px",
                }}
              >
                {PORTRAIT_ASCII}
              </span>
              <br />
              <br />
              {INTRO_LINES.join("\n")}
            </div>
          )}
        </div>

        {!booting && (
          <div className="mt-8 animate-in fade-in duration-300">
            <p className="mb-4 text-[var(--color-muted)] hidden sm:block">Choose a section: (use ↑ ↓ arrow keys, press Enter)</p>
            <p className="mb-4 text-[var(--color-muted)] sm:hidden">Select a section:</p>
            
            <nav className="flex flex-col gap-1 sm:gap-2">
              {MENU_ITEMS.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-4 py-2 sm:py-1 px-4 sm:px-0 text-lg sm:text-base rounded-md sm:rounded-none transition-colors outline-none
                    ${selectedIndex === idx ? "text-[var(--color-accent)] bg-white/5 sm:bg-transparent" : "text-[var(--color-foreground)]"}
                    hover:text-[var(--color-accent)]`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onFocus={() => setSelectedIndex(idx)}
                  aria-current={selectedIndex === idx ? "page" : undefined}
                >
                  <span className={`hidden sm:inline-block w-4 ${selectedIndex === idx ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    ❯
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            
            <CommandLine isHome={true} onEmptyEnter={() => router.push(MENU_ITEMS[selectedIndex].href)} />
            
            <div className="mt-8 flex justify-between items-center text-xs text-[var(--color-muted)] opacity-50">
              <span className="hidden sm:inline">press 'Ctrl + h' for help</span>
              <button 
                className="sm:hidden px-3 py-1 border border-white/20 rounded-md hover:bg-white/10 transition-colors"
                onClick={(e) => { e.stopPropagation(); setShowHelp(true); }}
              >
                [?] Help
              </button>
            </div>
          </div>
        )}

        {showHelp && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1a1b26] border border-gray-700 rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4 text-[var(--color-accent)]">Keybindings</h3>
              <ul className="space-y-2 text-sm mb-6">
                <li><kbd className="bg-gray-800 px-2 py-1 rounded">↑</kbd> / <kbd className="bg-gray-800 px-2 py-1 rounded">k</kbd> - Move up</li>
                <li><kbd className="bg-gray-800 px-2 py-1 rounded">↓</kbd> / <kbd className="bg-gray-800 px-2 py-1 rounded">j</kbd> - Move down</li>
                <li><kbd className="bg-gray-800 px-2 py-1 rounded">Enter</kbd> - Select</li>
                <li><kbd className="bg-gray-800 px-2 py-1 rounded">1-5</kbd> - Quick jump</li>
                <li><kbd className="bg-gray-800 px-2 py-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-800 px-2 py-1 rounded">h</kbd> - Toggle help</li>
                <li><kbd className="bg-gray-800 px-2 py-1 rounded">Esc</kbd> - Close help</li>
              </ul>

              <h3 className="text-lg font-bold mb-4 text-[var(--color-accent)]">Commands</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><code className="text-white">cd [dir]</code> - Navigate pages</li>
                <li><code className="text-white">ls</code> - List all pages</li>
                <li><code className="text-white">pwd</code> - Print current path</li>
                <li><code className="text-white">clear</code> - Clear terminal</li>
                <li><code className="text-white">refresh</code> - Reload page</li>
                <li><code className="text-white">back</code> - Go back to previous page</li>
              </ul>
              <button 
                onClick={() => setShowHelp(false)}
                className="mt-6 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded text-center transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
