import fs from "fs/promises";
import path from "path";
import SubpageLayout from "@/components/layout/SubpageLayout";

export const metadata = {
  title: "Experience | Batuhan Yeltekin",
};

interface ExperienceItem {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  logo?: string;
  highlights: string[];
}

export default async function Experience() {
  const filePath = path.join(process.cwd(), "content", "experience.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const experience: ExperienceItem[] = JSON.parse(fileContents);

  return (
    <SubpageLayout currentPath="experience">
      <div className="animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold mb-10 text-white">Experience</h1>
        
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {experience.map((job, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[var(--color-background)] text-[var(--color-accent)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-[var(--color-accent)]/20 z-10">
                <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-white">{job.role}</h3>
                  <span className="text-sm font-mono text-[var(--color-accent)]">
                    {job.start} — {job.end}
                  </span>
                </div>
                <div className="text-gray-400 mb-4 font-medium">
                  {job.company} <span className="mx-2 opacity-50">•</span> {job.location}
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  {job.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex gap-2">
                      <span className="text-[var(--color-accent)] mt-1">▹</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SubpageLayout>
  );
}
