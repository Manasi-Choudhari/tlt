import type { Metadata } from "next";
import { testimonials } from "@/data/content";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { RatingSummary } from "@/components/testimonials/RatingSummary";
import { FeedbackForm } from "@/components/forms/FeedbackForm";
import { Gallery } from "@/components/home/Gallery";

export const metadata: Metadata = {
  title: "Traveller Stories & Reviews",
  description: "Real reviews from TLT Community travellers on our Goa and Hampi group trips. Share your own feedback too!",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Stories & feedback"
        crumbs={[{ label: "Stories" }]}
        title={
          <>
            2,500+ legends. <span className="accent text-ink-900">One feeling.</span>
          </>
        }
        description="Real words from real travellers. Read their stories — then come write your own."
        size="md"
      />

      <section className="bg-cream-50 py-20 sm:py-28">
        <div className="container-x">
          <div className="-mt-32 relative z-10 sm:-mt-40">
            <RatingSummary />
          </div>

          <div className="mt-24">
            <SectionHeading eyebrow="Reviews" title="Straight from the road" />
          </div>
          <Reveal stagger={0.08} className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </Reveal>
        </div>
      </section>

      <section id="feedback" className="relative overflow-hidden bg-ink-950 py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full bg-flame-500/25 blur-[150px]" />
        <div className="container-x relative grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              dark
              eyebrow="Travelled with us?"
              title={
                <>
                  Tell us your <span className="accent text-gradient">story.</span>
                </>
              }
              description="Your feedback shapes every future trip. The best stories get featured here and on our socials — with a little surprise for your next booking. 🧡"
            />
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-10">
            <FeedbackForm />
          </div>
        </div>
      </section>

      <Gallery />
    </>
  );
}
