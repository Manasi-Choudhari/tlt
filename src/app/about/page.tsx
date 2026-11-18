import type { Metadata } from "next";
import { HeartHandshake, Leaf, ShieldCheck, Wallet } from "lucide-react";
import { values } from "@/data/content";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Acronym } from "@/components/about/Acronym";
import { RouteMap } from "@/components/about/RouteMap";
import { CTA } from "@/components/home/CTA";

export const metadata: Metadata = {
  title: "About — The Legend Travellers Community",
  description:
    "Meet TLT Community — The Legend Travellers Community. We craft group trips and custom itineraries built around people, safety and unforgettable experiences.",
  alternates: { canonical: "/about" },
};

const valueIcons = [HeartHandshake, ShieldCheck, Leaf, Wallet];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={media.hampi.virupaksha}
        eyebrow="About TLT"
        crumbs={[{ label: "About" }]}
        title={
          <>
            We travel for the <span className="accent text-sun-300">stories.</span>
          </>
        }
        description="TLT Community — The Legend Travellers Community — is a tribe of explorers turning trips into therapy, one sunset at a time."
      />

      <section className="bg-cream-50 py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Our story"
              title={
                <>
                  Born from a <span className="accent text-flame-600">road trip</span> that changed everything.
                </>
              }
            />
            <Reveal className="mt-8 space-y-5 text-lg leading-relaxed text-ink-700/85">
              <p>
                It started with a group of friends, a borrowed car and a half-planned weekend in Hampi. Somewhere between
                the sunrise on Matanga Hill and a midnight conversation on a Goa beach, we realised travel isn&apos;t an escape
                — it&apos;s therapy.
              </p>
              <p>
                Today, TLT is a community of thousands of travellers who believe the same thing. We design every trip around
                three words: <strong className="text-ink-900">Trip. Travel. Therapy.</strong>
              </p>
            </Reveal>
          </div>
          <div className="relative lg:col-span-6">
            <div className="grid grid-cols-5 gap-4">
              <ParallaxImage src={media.goa.palms} alt="Palm-lined beach in Goa" className="col-span-3 aspect-[3/4] rounded-[2rem]" sizes="(min-width: 1024px) 30vw, 60vw" />
              <div className="col-span-2 mt-20 space-y-4">
                <ParallaxImage src={media.hampi.chariot} alt="Stone Chariot, Hampi" className="aspect-[3/4] rounded-[1.5rem]" sizes="20vw" />
                <ParallaxImage src={media.goa.shack} alt="Beach shack in Anjuna" className="aspect-square rounded-[1.5rem]" sizes="20vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Acronym />

      <section className="bg-cream-100 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="What we stand for" title="Our values" />
          <Reveal stagger={0.1} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <div key={v.title} className="group rounded-[2rem] bg-white p-8 transition-[translate,scale,rotate] duration-500 hover:-translate-y-2">
                  <span className="bg-brand flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-[translate,scale,rotate] duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-8 font-display text-2xl font-semibold text-ink-900">{v.title}</h3>
                  <p className="mt-3 text-ink-700/80">{v.text}</p>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-950 py-24 text-white sm:py-32">
        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-flame-500/25 blur-[140px]" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              dark
              eyebrow="Where we go"
              title={
                <>
                  Our routes, <span className="accent text-gradient">mapped.</span>
                </>
              }
              description="Every trip starts in Bengaluru with an overnight ride, and ends with a group chat that never goes quiet. Hampi's ancient boulders to Goa's golden coast — and more destinations coming soon."
            />
            <div className="mt-12 grid grid-cols-2 gap-8">
              {site.stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-5xl font-semibold">
                    <Counter value={s.value} suffix={s.suffix} decimals={"decimals" in s ? s.decimals : 0} />
                  </p>
                  <p className="mt-1 text-sm uppercase tracking-[0.15em] text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <RouteMap />
        </div>
      </section>

      <CTA />
    </>
  );
}
