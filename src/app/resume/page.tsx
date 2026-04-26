import SubpageLayout from "@/components/layout/SubpageLayout";
import { Download } from "lucide-react";

export const metadata = {
  title: "Resume | Batuhan Yeltekin",
};

export default function Resume() {
  return (
    <SubpageLayout currentPath="resume">
      <div className="animate-in fade-in duration-500 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Resume</h1>
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] text-black font-semibold rounded hover:bg-[var(--color-accent)]/90 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>

        <div className="flex-grow min-h-[70vh] border border-white/10 rounded-lg overflow-hidden bg-white/5">
          <object
            data="/resume.pdf"
            type="application/pdf"
            className="w-full h-full min-h-[70vh]"
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[70vh] p-8 text-center text-gray-400">
              <p className="mb-4">It appears your browser does not support embedded PDFs.</p>
              <a
                href="/resume.pdf"
                download
                className="text-[var(--color-accent)] hover:underline"
              >
                Click here to download the PDF instead.
              </a>
            </div>
          </object>
        </div>
      </div>
    </SubpageLayout>
  );
}
