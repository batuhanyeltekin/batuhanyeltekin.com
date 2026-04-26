"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CommandLineProps {
  isHome?: boolean;
  currentPath?: string;
  onEmptyEnter?: () => void;
}

export default function CommandLine({ isHome = false, currentPath = "", onEmptyEnter }: CommandLineProps) {
  const router = useRouter();
  const [buffer, setBuffer] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    let isCancelled = false;
    const FULL_TEXT = "You can write some CLI commands here. Type 'help' for more.";

    const animatePlaceholder = async () => {
      // Small delay before starting
      await new Promise((r) => setTimeout(r, 1000));
      if (isCancelled) return;

      // Type out
      for (let i = 1; i <= FULL_TEXT.length; i++) {
        if (isCancelled) return;
        setPlaceholder(FULL_TEXT.slice(0, i));
        await new Promise((r) => setTimeout(r, 40));
      }

      // Wait 5 seconds
      await new Promise((r) => setTimeout(r, 5000));
      if (isCancelled) return;

      // Delete back
      for (let i = FULL_TEXT.length - 1; i >= 0; i--) {
        if (isCancelled) return;
        setPlaceholder(FULL_TEXT.slice(0, i));
        await new Promise((r) => setTimeout(r, 20));
      }
    };

    animatePlaceholder();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // We only capture basic typing
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Backspace") {
        setBuffer((prev) => prev.slice(0, -1));
        setOutput(null); // clear output on type
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (buffer.trim() === "") {
          if (onEmptyEnter) onEmptyEnter();
          return;
        }
        
        handleCommand(buffer.trim().toLowerCase());
      } else if (e.key.length === 1) {
        if (e.key === " ") {
          e.preventDefault();
        }
        setBuffer((prev) => prev + e.key);
        setOutput(null); // clear output on type
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [buffer, currentPath, router, onEmptyEnter]);

  const handleCommand = (cmd: string) => {
    const args = cmd.split(" ");
    const baseCmd = args[0];

    if (baseCmd === "pwd") {
      showOutput(isHome ? "~/" : `~/${currentPath}`);
    } else if (baseCmd === "cd") {
      const target = args[1];
      if (!target || target === "~" || target === ".." || target === "/") {
        router.push("/");
      } else if (["about", "experience", "projects", "resume", "blog"].includes(target)) {
        router.push(`/${target}`);
      } else {
        showOutput(`cd: no such file or directory: ${target}`);
      }
    } else if (baseCmd === "ls") {
      showOutput("about experience projects resume blog");
    } else if (baseCmd === "whoami") {
      showOutput("hopefully not frank");
    } else if (baseCmd === "clear") {
      setBuffer("");
      setOutput(null);
    } else if (baseCmd === "refresh") {
      window.location.reload();
    } else if (baseCmd === "back") {
      router.back();
    } else if (baseCmd === "frank") {
      showOutput("get out of here frank");
    } else if (baseCmd === "help") {
      showOutput("cd [dir], ls, pwd, clear, refresh, back, whoami");
    } else {
      showOutput("invalid");
    }
  };

  const showOutput = (text: string) => {
    setOutput(text);
    setBuffer("");
    
    // Clear output after 2 seconds
    setTimeout(() => {
      setOutput((prev) => (prev === text ? null : prev));
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuffer(e.target.value);
    setOutput(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buffer.trim() === "") {
        if (onEmptyEnter) onEmptyEnter();
        return;
      }
      handleCommand(buffer.trim().toLowerCase());
    }
  };

  const hiddenInput = (
    <input
      id="cli-input"
      type="text"
      value={buffer}
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      className="opacity-0 absolute w-px h-px overflow-hidden -z-10"
      autoCapitalize="none"
      autoComplete="off"
      spellCheck="false"
      autoCorrect="off"
    />
  );

  if (isHome) {
    return (
      <div className="mt-12 flex flex-col gap-2">
        {hiddenInput}
        <div className="flex flex-wrap items-center gap-2 text-[var(--color-muted)]">
          <span className="text-[var(--color-accent)] shrink-0">visitor@batuhanyeltekin:</span>
          <span className="text-blue-400 shrink-0">~</span>
          <span className="text-white whitespace-pre-wrap break-words">
            $ {buffer ? buffer : <span className="text-[var(--color-muted)] italic opacity-50">{placeholder}</span>}
          </span>
          {!output && <span className="inline-block w-2.5 h-5 bg-[var(--color-foreground)] animate-pulse align-middle shrink-0" />}
        </div>
        {output && <div className="text-gray-300 ml-4">{output}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {hiddenInput}
      <div className="hover:text-[var(--color-accent)] transition-colors group flex flex-wrap items-center gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-[var(--color-accent)]">~/</span>
          <span className="text-gray-300 group-hover:text-white transition-colors">{currentPath}</span>
        </Link>
        <span className="text-[var(--color-muted)] group-hover:text-white shrink-0">$</span>
        <span className="text-white whitespace-pre-wrap break-words">
          {buffer ? buffer : <span className="text-[var(--color-muted)] italic opacity-50">{placeholder}</span>}
        </span>
        {!output && (
          <span className="inline-block w-2 h-4 bg-[var(--color-foreground)] animate-pulse align-middle opacity-100 transition-opacity shrink-0" />
        )}
      </div>
      {output && <div className="text-gray-300 ml-6 text-sm mt-1">{output}</div>}
    </div>
  );
}
