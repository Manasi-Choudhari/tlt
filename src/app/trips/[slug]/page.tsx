import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Backpack, CheckCircle2, Clock, Gauge, MapPin, Star, Sun, Users, XCircle } from "lucide-react";
import { getTrip, trips, formatPrice } from "@/data/trips";
import { site } from "@/data/site";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQ } from "@/components/ui/FAQ";
import { Itinerary } from "@/components/trips/Itinerary";
import { BookingCard } from "@/components/trips/BookingCard";
import { TripGallery } from "@/components/trips/TripGallery";
import { TripCard } from "@/components/trips/TripCard";
import { ContactForm } from "@/components/forms/ContactForm";

export const ensureStatic = "navigation";

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/trips/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) return {};
  return {
    title: `${trip.title} — ${trip.nights}N/${trip.days}D from ${formatPrice(trip.price)}`,
    description: `${trip.tagline} ${trip.summary}`.slice(0, 160),
    alternates: { canonical: `/trips/${trip.slug}` },
    openGraph: { images: [{ url: trip.image }], title: trip.title, description: trip.tagline },
  };
}

export default function TripPage({ params }: PageProps<"/trips/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[88svh] bg-ink-950" />}>
      <TripContent params={params} />
    </Suspense>
  );
}

async function TripContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) notFound();

  const related = trips.filter((t) => t.slug !== trip.slug).slice(0, 3);

  const facts = [
    { icon: Clock, label: "Duration", value: `${trip.nights}N / ${trip.days}D` },
    { icon: Users, label: "Group size", value: trip.groupSize },
    { icon: Gauge, label: "Difficulty", value: trip.difficulty },
    { icon: Sun, label: "Best time", value: trip.bestTime },
    { icon: Star, label: "Rating", value: `${trip.rating} (${trip.reviews} reviews)` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.title,
    description: trip.summary,
    image: `${site.url}${trip.image}`,
    touristType: trip.vibe,
    itinerary: {
      "@type": "ItemList",
      itemListElement: trip.itinerary.map((d) => ({ "@type": "ListItem", position: d.day, name: d.title, description: d.description })),
    },
    offers: {
      "@type": "Offer",
      price: trip.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${site.url}/trips/${trip.slug}`,
    },
    provider: { "@type": "TravelAgency", name: site.name, url: site.url },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        image={trip.image}
        eyebrow={trip.region}
        crumbs={[{ href: "/trips", label: "Trips" }, { label: trip.title }]}
        title={trip.title}
        description={trip.tagline}
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {trip.vibe.map((v) => (
            <span key={v} className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              {v}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="relative z-10 -mt-10">
        <div className="container-x">
          <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] bg-ink-900/10 shadow-[0_30px_80px_-40px_rgba(26,18,11,0.45)] md:grid-cols-5">
            {facts.map((f) => (
              <div key={f.label} className="bg-white p-5 sm:p-6">
                <f.icon className="h-5 w-5 text-flame-500" />
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink-500">{f.label}</p>
                <p className="mt-1 font-display font-semibold text-ink-900">{f.value}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-50 py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="space-y-24 lg:col-span-7 xl:col-span-8">
            <div>
              <SectionHeading eyebrow="Overview" title="The experience" />
              <Reveal>
                <p className="mt-6 text-lg leading-relaxed text-ink-700/90">{trip.summary}</p>
                <p className="mt-4 flex items-start gap-2 text-ink-700/80">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-flame-500" />
                  <span>
                    <strong className="text-ink-900">Pickup:</strong> {trip.pickup}
                  </span>
                </p>
              </Reveal>
              <Reveal stagger={0.06} className="mt-10 grid gap-3 sm:grid-cols-2">
                {trip.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-3 rounded-2xl bg-white p-5">
                    <span className="bg-brand mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white">
                      <Star className="h-3.5 w-3.5 fill-white" />
                    </span>
                    <span className="text-ink-700">{h}</span>
                  </div>
                ))}
              </Reveal>
            </div>

            <div>
              <SectionHeading eyebrow="Day by day" title="Itinerary" />
              <div className="mt-10">
                <Itinerary days={trip.itinerary} />
              </div>
            </div>

            <div>
              <SectionHeading eyebrow="Gallery" title="Sneak peek" />
              <div className="mt-10">
                <TripGallery images={trip.gallery} title={trip.title} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Reveal className="rounded-[1.75rem] bg-white p-7 sm:p-8">
                <h3 className="font-display text-2xl font-semibold text-ink-900">What&apos;s included</h3>
                <ul className="mt-5 space-y-3">
                  {trip.inclusions.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-ink-700">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /> {i}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1} className="rounded-[1.75rem] bg-white p-7 sm:p-8">
                <h3 className="font-display text-2xl font-semibold text-ink-900">Not included</h3>
                <ul className="mt-5 space-y-3">
                  {trip.exclusions.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-ink-700">
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" /> {i}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal className="rounded-[1.75rem] bg-ink-900 p-7 text-white sm:p-10">
              <div className="flex items-center gap-3">
                <Backpack className="h-6 w-6 text-sun-300" />
                <h3 className="font-display text-2xl font-semibold">Things to carry</h3>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {trip.thingsToCarry.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-white/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flame-500" /> {i}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div>
              <SectionHeading eyebrow="FAQs" title="Trip questions" />
              <div className="mt-8">
                <FAQ items={trip.faqs} />
              </div>
            </div>

            <div id="enquire" className="scroll-mt-28 rounded-[2rem] bg-cream-100 p-7 sm:p-10">
              <SectionHeading eyebrow="Enquire" title="Request a callback" description="Share your details and a trip designer will call you within a few hours." />
              <div className="mt-8">
                <ContactForm type="enquiry" defaultTrip={trip.title} />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-28">
              <BookingCard trip={trip} />
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-cream-100 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Keep exploring" title="You might also love" />
          <Reveal stagger={0.1} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <TripCard key={t.slug} trip={t} className="h-full" />
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
