import SubpageLayout from "@/components/layout/SubpageLayout";
import { Mail, MapPin, Briefcase, Code } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";

export const metadata = {
  title: "About | Batuhan Yeltekin",
};

export default function About() {
  return (
    <SubpageLayout currentPath="about">
      <div className="space-y-10 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-white">About Me</h1>
          <div className="prose prose-invert text-gray-300 space-y-4 max-w-none">
            <p>
              Hi, I'm Batuhan. I'm a software engineer passionate about building reliable, 
              scalable, and high-performance applications. With a strong background in both 
              frontend and backend systems, I enjoy bridging the gap between design and engineering.
            </p>
            <p>
              My journey in software development started with a curiosity for how things work on the web. 
              Over the years, I've honed my skills in modern JavaScript ecosystems, distributed systems, 
              and cloud infrastructure. I believe in clean code, comprehensive testing, and 
              continuous learning.
            </p>
            <p>
              When I'm not coding, you can usually find me reading about new technologies, 
              contributing to open-source projects, or exploring the outdoors.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Quick Facts</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-3">
              <MapPin className="text-[var(--color-accent)] w-5 h-5" />
              <span>San Francisco, CA</span>
            </li>
            <li className="flex items-center gap-3">
              <Briefcase className="text-[var(--color-accent)] w-5 h-5" />
              <span>Software Engineer at Tech Innovators Inc.</span>
            </li>
            <li className="flex items-center gap-3">
              <Code className="text-[var(--color-accent)] w-5 h-5" />
              <span>Full-stack Development, Distributed Systems, Web UI</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-white">Connect</h2>
          <p className="text-gray-300 mb-4">
            Feel free to reach out for collaborations, opportunities, or just to say hi!
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="mailto:hello@batuhanyeltekin.com" 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              hello@batuhanyeltekin.com
            </a>
            <a 
              href="https://github.com/batuhanyeltekin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a 
              href="https://linkedin.com/in/batuhanyeltekin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors text-sm"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </SubpageLayout>
  );
}
