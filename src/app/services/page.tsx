import type { Metadata } from "next";
import { Check } from "lucide-react";
import { services, faqs } from "@/data/content";
import { media } from "@/data/media";
import { whatsappLink } from "@/data/site";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Button } from "@/components/ui/Button";
import { FAQ } from "@/components/ui/FAQ";
import { Process } from "@/components/services/Process";
import { CTA } from "@/components/home/CTA";

export const metadata: Metadata = {
  title: "Services — Group Trips, Custom Itineraries & Corporate Offsites",
  description:
    "Group trips, custom itineraries, weekend getaways, corporate offsites, college trips, stays, transport and adventure add-ons by TLT Community.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        crumbs={[{ label: "Services" }]}
        title={
          <>
            Everything you need to <span className="accent text-ink-900">just go.</span>
          </>
        }
        description="Whether it's a solo escape, a gang of 40 or a company offsite — we plan, book and host trips that feel like therapy."
        size="md"
      />

      <section className="bg-cream-50 py-24 sm:py-32">
        <div className="container-x">
          <Reveal stagger={0.08} className="grid gap-6 md:grid-cols-2">
            {services.map((s, i) => (
              <article
                key={s.title}
                className="group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_-40px_rgba(26,18,11,0.4)] transition-[translate,scale,rotate] duration-500 hover:-translate-y-1 sm:p-10"
              >
                <div className="bg-brand absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-10 transition-[translate,scale,rotate] duration-700 group-hover:scale-[3]" />
                <div className="relative flex items-start justify-between">
                  <span className="bg-brand flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg">
                    <ServiceIcon name={s.icon} className="h-7 w-7" />
                  </span>
                  <span className="font-display text-5xl font-bold text-ink-900/5">0{i + 1}</span>
                </div>
                <h2 className="relative mt-8 font-display text-3xl font-semibold tracking-tight text-ink-900">{s.title}</h2>
                <p className="relative mt-3 text-ink-700/80">{s.description}</p>
                <ul className="relative mt-6 flex flex-wrap gap-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-1.5 rounded-full bg-cream-100 px-3 py-1.5 text-sm font-medium text-ink-700">
                      <Check className="h-3.5 w-3.5 text-flame-600" /> {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <Process />

      <section className="bg-cream-50 py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <ParallaxImage src={media.hampi.pushkarani} alt="Team offsite in Hampi" className="aspect-[4/5] rounded-[2rem]" sizes="(min-width: 1024px) 50vw, 100vw" />
          <div>
            <SectionHeading
              eyebrow="Corporate & groups"
              title={
                <>
                  Offsites people <span className="accent text-flame-600">actually</span> want to attend.
                </>
              }
              description="We've hosted teams, colleges and communities of 10 to 200+. Activities, venues, travel, food and GST invoicing — one point of contact, zero stress."
            />
            <Reveal stagger={0.08} className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Team-building activities", "Conference-ready venues", "Custom merch & kits", "Dedicated event manager", "Flexible group payments", "GST invoices"].map((p) => (
                <div key={p} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 font-medium text-ink-700">
                  <Check className="h-4 w-4 text-flame-600" /> {p}
                </div>
              ))}
            </Reveal>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/contact" variant="primary">
                Get a group quote
              </Button>
              <Button href={whatsappLink("Hi TLT! I'd like a quote for a group/corporate trip.")} variant="outline">
                WhatsApp us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-100 py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="FAQs" title="Questions, answered" />
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
