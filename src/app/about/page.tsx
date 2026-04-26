import SubpageLayout from "@/components/layout/SubpageLayout";
import AboutCarousel from "@/components/AboutCarousel";
import AboutTypewriter from "@/components/AboutTypewriter";

const PRONUNCIATION = '[baˈtuhan jelˈtecin] -- "BAH-too-hahn YEL-teh-kin" (corrected by 潘越, 我的爱）';

const BIO_PARAGRAPHS = [
  "Hi, I'm Batuhan — a rising senior at Columbia studying CS with an Econ minor, originally from Baku, Azerbaijan. My interests sit at the intersection of AI, ML, NLP, and linguistics, with an entrepreneurial streak that pulls me toward building things rather than just studying them.",
  "Outside of class, I'm usually hiking, in the gym, or traveling somewhere new to try the food. I'm an unapologetic transit geek and aviation enthusiast — I trainspot, plan trips around interesting metro systems, and will happily detour to an airport just to watch planes. I shoot photography along the way.",
  "Finally, I <3 潘越。",
  "If any of this resonates, reach out — I'd love to hear from you.",
];

export default function AboutPage() {
  return (
    <SubpageLayout currentPath="about">
      <div className="flex flex-col items-center justify-center py-10 sm:py-20 text-center animate-in fade-in duration-500 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-accent)] capitalize tracking-wide">
          <AboutTypewriter />
        </h1>

        <AboutCarousel />

        <p className="text-[var(--color-muted)] font-mono text-sm sm:text-base">
          {PRONUNCIATION}
        </p>

        <div className="mt-10 max-w-2xl space-y-5 text-left text-sm leading-7 text-gray-300 sm:text-base">
          {BIO_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </SubpageLayout>
  );
}
