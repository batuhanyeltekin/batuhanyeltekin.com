"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin, FaTwitter as Twitter } from "react-icons/fa";
import CommandLine from "../CLI/CommandLine";

interface SubpageLayoutProps {
  children: React.ReactNode;
  currentPath: string;
}

const NAV_LINKS = [
  { label: "about", href: "/about" },
  { label: "experience", href: "/experience" },
  { label: "resume", href: "/resume" },
  { label: "projects", href: "/projects" },
  { label: "blog", href: "/blog" },
];

export default function SubpageLayout({ children, currentPath }: SubpageLayoutProps) {
  const handleContainerClick = (e: React.MouseEvent) => {
    // Prevent focus if clicking a link or button
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;
    document.getElementById("cli-input")?.focus();
  };

  return (
    <div 
      className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col font-sans"
      onClick={handleContainerClick}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[var(--color-background)]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-3xl mx-auto w-full px-6 py-4 flex flex-col gap-3 font-mono text-sm sm:text-base">
          <CommandLine isHome={false} currentPath={currentPath} />
          
          <nav className="flex items-center gap-4 text-xs sm:text-sm text-[var(--color-muted)] overflow-x-auto pb-1 scrollbar-hide">
            {NAV_LINKS.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`hover:text-[var(--color-accent)] transition-colors whitespace-nowrap ${currentPath === link.label ? "text-[var(--color-accent)] font-bold" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12 py-8">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[var(--color-muted)]">
          <p>© {new Date().getFullYear()} Batuhan Yeltekin. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://github.com/batuhanyeltekin" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition-colors">
              <Github size={18} />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://linkedin.com/in/batuhanyeltekin" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition-colors">
              <Linkedin size={18} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="mailto:hello@batuhanyeltekin.com" className="hover:text-[var(--color-accent)] transition-colors">
              <Mail size={18} />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
