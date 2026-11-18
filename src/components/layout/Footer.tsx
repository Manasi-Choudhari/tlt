"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav, site, whatsappLink } from "@/data/site";
import { trips } from "@/data/trips";
import { FacebookIcon, InstagramIcon, WhatsappIcon, YoutubeIcon } from "@/components/ui/BrandIcons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-giant] span", {
        yPercent: 100,
        stagger: 0.04,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: { trigger: "[data-giant]", start: "top 95%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-flame-500/25 blur-[120px]" />
      <div className="container-x relative pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3">
              <span className="relative h-14 w-11">
                <Image src="/brand/mark-white.png" alt="" fill sizes="44px" className="object-contain" />
              </span>
              <span>
                <span className="block font-display text-2xl font-bold">TLT Community</span>
                <span className="block text-xs uppercase tracking-[0.25em] text-white/60">The Legend Travellers Community</span>
              </span>
            </Link>
            <p className="mt-6 max-w-md text-white/60">
              We don&apos;t just plan trips — we build a community of legends who travel together, laugh together and come back
              lighter. Trip. Travel. Therapy.
            </p>
            <div className="mt-8 max-w-md">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sun-300">Get trip drops first</p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Explore</h3>
              <ul className="mt-5 space-y-3">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="text-white/80 transition-colors hover:text-sun-300">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Trips</h3>
              <ul className="mt-5 space-y-3">
                {trips.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/trips/${t.slug}`} className="text-white/80 transition-colors hover:text-sun-300">
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Contact</h3>
              <ul className="mt-5 space-y-4 text-white/80">
                <li>
                  <a href={site.phoneHref} className="flex items-start gap-3 hover:text-sun-300">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-flame-400" /> {site.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="flex items-start gap-3 break-all hover:text-sun-300">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-flame-400" /> {site.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-flame-400" /> {site.address}
                </li>
              </ul>
              <div className="mt-6 flex gap-2">
                {[
                  { href: site.socials.instagram, Icon: InstagramIcon, label: "Instagram" },
                  { href: site.socials.youtube, Icon: YoutubeIcon, label: "YouTube" },
                  { href: site.socials.facebook, Icon: FacebookIcon, label: "Facebook" },
                  { href: whatsappLink("Hi TLT! I want to plan a trip."), Icon: WhatsappIcon, label: "WhatsApp" },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-flame-500 hover:bg-flame-500"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div data-giant aria-hidden className="mt-20 flex select-none justify-center overflow-hidden font-display font-bold leading-[0.8] tracking-[-0.06em]">
          {"TLT COMMUNITY".split("").map((c, i, arr) => (
            <span
              key={i}
              className="inline-block text-[13.5vw]"
              style={{ color: gsap.utils.interpolate("#ffd84d", "#ff5a14", i / (arr.length - 1)) }}
            >
              {c === " " ? "\u00a0" : c}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-sm text-white/50 sm:flex-row">
          <p>
            © {site.name}. All rights reserved.
          </p>
          <p className="accent text-base text-white/70">Trip Travel Therapy.</p>
        </div>
      </div>
    </footer>
  );
}
