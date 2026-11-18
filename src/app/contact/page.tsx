import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, whatsappLink } from "@/data/site";
import { faqs } from "@/data/content";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FAQ } from "@/components/ui/FAQ";
import { ContactForm } from "@/components/forms/ContactForm";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/BrandIcons";

export const metadata: Metadata = {
  title: "Contact — Plan Your Trip",
  description: "Talk to TLT Community's trip designers. Call, WhatsApp or send us a message to plan your Goa, Hampi or custom trip.",
  alternates: { canonical: "/contact" },
};

const channels = [
  { icon: WhatsappIcon, label: "WhatsApp", value: "Chat instantly", href: whatsappLink("Hi TLT! I want to plan a trip."), accent: "bg-[#25D366]" },
  { icon: Phone, label: "Call us", value: site.phone, href: site.phoneHref, accent: "bg-brand" },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}`, accent: "bg-ink-900" },
  { icon: InstagramIcon, label: "Instagram", value: "@tltcommunity", href: site.socials.instagram, accent: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        crumbs={[{ label: "Contact" }]}
        title={
          <>
            Let&apos;s plan your <span className="accent text-ink-900">therapy.</span>
          </>
        }
        description="Questions, custom trips, group bookings or just want to say hi — our trip designers reply within a few hours."
        size="md"
      />

      <section className="bg-cream-50 pb-24 sm:pb-32">
        <div className="container-x">
          <Reveal stagger={0.08} className="relative z-10 -mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-[1.5rem] bg-white p-5 shadow-[0_25px_60px_-35px_rgba(26,18,11,0.45)] transition-[translate,scale,rotate] duration-500 hover:-translate-y-1"
              >
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white ${c.accent}`}>
                  <c.icon className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-ink-500">{c.label}</span>
                  <span className="block truncate font-display font-semibold text-ink-900">{c.value}</span>
                </span>
              </a>
            ))}
          </Reveal>

          <div className="mt-24 grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Send a message"
                title={
                  <>
                    Tell us where you want to <span className="accent text-flame-600">feel alive.</span>
                  </>
                }
                description="Fill in a few details and we'll craft the perfect plan — fixed departure or fully custom."
              />
              <Reveal className="mt-10 space-y-5 text-ink-700">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-flame-500" /> {site.address}
                </p>
                <p className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-flame-500" /> {site.hours}
                </p>
              </Reveal>
              <Reveal className="mt-10 overflow-hidden rounded-[2rem] border border-ink-900/5">
                <iframe
                  title="TLT Community location"
                  src={site.mapEmbed}
                  className="h-72 w-full grayscale-[40%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Reveal>
            </div>
            <Reveal className="rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-45px_rgba(26,18,11,0.45)] sm:p-10 lg:col-span-7">
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-cream-100 py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="FAQs" title="Before you ask" />
          </div>
          <div className="lg:col-span-7">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
