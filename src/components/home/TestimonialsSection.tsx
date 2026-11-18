import { testimonials } from "@/data/content";
import { Marquee } from "@/components/ui/Marquee";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { Button } from "@/components/ui/Button";

export function TestimonialsSection() {
  const half = Math.ceil(testimonials.length / 2);
  return (
    <section className="relative overflow-hidden bg-ink-950 py-28 text-white sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[60%] -translate-x-1/2 rounded-full bg-flame-500/20 blur-[150px]" />
      <div className="container-x relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          dark
          eyebrow="Traveller stories"
          title={
            <>
              Don&apos;t take our word. <span className="accent text-gradient">Take theirs.</span>
            </>
          }
        />
        <Button href="/testimonials" variant="outline-light">
          Read all stories
        </Button>
      </div>

      <div className="relative mt-16 space-y-6 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <Marquee speed={60}>
          {testimonials.slice(0, half).map((t, i) => (
            <div key={t.name} className="w-[340px] shrink-0 px-3 sm:w-[420px]">
              <TestimonialCard t={t} index={i} dark className="h-full" />
            </div>
          ))}
        </Marquee>
        <Marquee speed={70} reverse>
          {testimonials.slice(half).map((t, i) => (
            <div key={t.name} className="w-[340px] shrink-0 px-3 sm:w-[420px]">
              <TestimonialCard t={t} index={i + 2} dark className="h-full" />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
