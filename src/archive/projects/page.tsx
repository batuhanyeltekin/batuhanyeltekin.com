import fs from "fs/promises";
import path from "path";
import SubpageLayout from "@/components/layout/SubpageLayout";
import { ExternalLink } from "lucide-react";
import { FaGithub as Github } from "react-icons/fa";

export const metadata = {
  title: "Projects | Batuhan Yeltekin",
};

interface Project {
  name: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
}

export default async function Projects() {
  const filePath = path.join(process.cwd(), "content", "projects.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const projects: Project[] = JSON.parse(fileContents);
  
  // Sort featured projects first
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured === b.featured) return 0;
    return a.featured ? -1 : 1;
  });

  return (
    <SubpageLayout currentPath="projects">
      <div className="animate-in fade-in duration-500">
        <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-4">
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <a 
            href="https://github.com/batuhanyeltekin" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors text-gray-400"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">View all on GitHub</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedProjects.map((project, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:-translate-y-1 p-6 ${
                project.featured ? "md:col-span-2 shadow-[0_0_15px_rgba(74,222,128,0.05)]" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-[var(--color-accent)] transition-colors">
                  {project.name}
                </h3>
                <div className="flex gap-3 text-gray-400">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition-colors">
                      <Github className="w-5 h-5" />
                      <span className="sr-only">GitHub Repo</span>
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition-colors">
                      <ExternalLink className="w-5 h-5" />
                      <span className="sr-only">Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-6 flex-grow leading-relaxed">
                {project.description}
              </p>
              
              <ul className="flex flex-wrap gap-2 mt-auto font-mono text-xs">
                {project.tags.map((tag, tagIdx) => (
                  <li key={tagIdx} className="text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2 py-1 rounded">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SubpageLayout>
  );
}
