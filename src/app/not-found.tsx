import Link from "next/link";
import SubpageLayout from "@/components/layout/SubpageLayout";

export default function NotFound() {
  return (
    <SubpageLayout currentPath="404">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center font-mono">
        <div className="text-[var(--color-accent)] mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">bash: command not found: <span className="text-red-400">404</span></h1>
        <p className="text-[var(--color-muted)] mb-8">The route you are looking for does not exist.</p>
        
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-white hover:text-[var(--color-accent)] transition-colors"
        >
          <span className="text-[var(--color-accent)]">~/</span>
          <span>cd /</span>
          <span className="inline-block w-2 h-4 bg-[var(--color-foreground)] animate-pulse align-middle opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </SubpageLayout>
  );
}
