"use client";

import Image from "next/image";

const IMAGES = [
  "/carousel/IMG_2699.png",
  "/carousel/IMG_2946 2.png",
  "/carousel/IMG_3113.png",
  "/carousel/IMG_4286.png",
  "/carousel/IMG_5062.png",
  "/carousel/IMG_5548.png",
  "/carousel/IMG_7938.png",
];

export default function AboutCarousel() {
  const scrollingImages = [...IMAGES, ...IMAGES];

  return (
    <section
      aria-label="Photo carousel"
      className="relative mb-8 w-full max-w-2xl overflow-hidden rounded-md border border-white/10 bg-white/5 py-3 shadow-2xl shadow-black/30"
    >
      <div className="about-carousel-track flex w-max gap-3">
        {scrollingImages.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative h-[18rem] w-[13.5rem] shrink-0 overflow-hidden rounded border border-white/10 bg-black/30 sm:h-[24rem] sm:w-[18rem]"
            aria-hidden={index >= IMAGES.length}
          >
            <Image
              src={src}
              alt={index < IMAGES.length ? `Carousel image ${index + 1}` : ""}
              fill
              sizes="(max-width: 768px) 14rem, 18rem"
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--color-background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--color-background)] to-transparent" />
    </section>
  );
}
