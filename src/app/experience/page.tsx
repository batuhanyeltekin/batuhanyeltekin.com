import SubpageLayout from "@/components/layout/SubpageLayout";
import DelayedCaption from "@/components/DelayedCaption";
import PageCaption from "@/components/PageCaption";
import PaintedImage from "@/components/PaintedImage";

export default function ExperiencePage() {
  return (
    <SubpageLayout currentPath="experience">
      <section
        aria-labelledby="education-heading"
        className="flex flex-col items-center py-8 text-center sm:py-14"
      >
        <PageCaption id="education-heading" text="experience" className="mb-3" />
        <p
          className="mt-2 mb-8 text-xl uppercase leading-none tracking-[0.055em] text-[var(--color-foreground)] sm:text-2xl"
          style={{
            fontFamily:
              '"Trajan Pro 3", "Trajan Pro", var(--font-cinzel), "Times New Roman", serif',
          }}
        >
          Education
        </p>

        <figure className="w-full">
          <div className="education-paint-frame mx-auto w-full max-w-3xl overflow-hidden">
            <PaintedImage
              src="/low_library_outline.png"
              alt="Paint outline of Low Library at Columbia University"
              width={1448}
              height={1086}
            />
          </div>

          <DelayedCaption className="mx-auto mt-8 w-full max-w-2xl border-y border-white/10 py-5 text-left">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="font-mono text-base font-semibold text-[var(--color-foreground)] sm:text-lg">
                  Columbia University
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
                  Bachelor of Arts in Computer Science, Minor in Economics
                </p>
              </div>

              <dl className="grid shrink-0 grid-cols-[auto_1fr] gap-x-3 gap-y-2 font-mono text-xs sm:text-sm">
                <dt className="text-[var(--color-muted)]">GPA</dt>
                <dd className="text-[var(--color-accent)]">3.6</dd>
                <dt className="text-[var(--color-muted)]">Expected</dt>
                <dd className="text-[var(--color-accent)]">May 2027</dd>
              </dl>
            </div>
          </DelayedCaption>
        </figure>
      </section>
    </SubpageLayout>
  );
}
