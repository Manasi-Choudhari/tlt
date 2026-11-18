import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Destinations } from "@/components/home/Destinations";
import { TripsScroller } from "@/components/home/TripsScroller";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { Gallery } from "@/components/home/Gallery";
import { CTA } from "@/components/home/CTA";
import { Marquee } from "@/components/ui/Marquee";

const words = ["Goa", "Hampi", "Beaches", "Ruins", "Sunsets", "Road trips", "Bonfires", "New friends"];

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="bg-brand -rotate-1 scale-[1.02] py-5 text-white">
        <Marquee speed={35}>
          {words.map((w) => (
            <span key={w} className="flex items-center gap-8 px-4 font-display text-3xl font-semibold uppercase tracking-tight sm:text-5xl">
              {w}
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current sm:h-8 sm:w-8" aria-hidden>
                <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
              </svg>
            </span>
          ))}
        </Marquee>
      </div>
      <Manifesto />
      <Destinations />
      <TripsScroller />
      <ServicesPreview />
      <VideoShowcase />
      <TestimonialsSection />
      <Gallery />
      <CTA />
    </>
  );
}
