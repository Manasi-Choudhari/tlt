import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { TripsExplorer } from "@/components/trips/TripsExplorer";
import { CTA } from "@/components/home/CTA";
import { FAQ } from "@/components/ui/FAQ";
import { faqs } from "@/data/content";
import { media } from "@/data/media";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Trips — Goa & Hampi Group Tours",
  description:
    "Browse TLT Community's curated Goa and Hampi group trips: day-wise itineraries, prices, inclusions and upcoming departures from Bengaluru.",
  alternates: { canonical: "/trips" },
};

export default function TripsPage() {
  return (
    <>
      <PageHero
        image={media.goa.vagator}
        eyebrow="Fixed departures · Custom trips"
        crumbs={[{ label: "Trips" }]}
        title={
          <>
            Find your next <span className="accent text-sun-300">escape.</span>
          </>
        }
        description="Handpicked Goa and Hampi experiences with stays, travel, activities and a trip captain — all sorted. Choose your vibe."
      />
      <Suspense fallback={<div className="h-[60vh] bg-cream-50" />}>
        <TripsExplorer />
      </Suspense>
      <section className="bg-cream-100 py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Good to know" title="Booking questions" description="Everything you need to know before you pack your bags." />
          </div>
          <div className="lg:col-span-7">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
