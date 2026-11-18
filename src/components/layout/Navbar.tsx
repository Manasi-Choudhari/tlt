"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav, site, whatsappLink } from "@/data/site";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Button } from "@/components/ui/Button";
import { InstagramIcon, WhatsappIcon, YoutubeIcon } from "@/components/ui/BrandIcons";

export function Navbar() {
  const pathname = usePathname();
  const lenis = useLenis();
  const scope = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (header.current && !open) {
        const hide = y > lastY && y > 300;
        gsap.to(header.current, { yPercent: hide ? -110 : 0, duration: 0.45, ease: "power3.out", overwrite: true });
      }
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { display: "flex" })
        .fromTo(menu.current, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "power4.inOut" })
        .from("[data-menu-link]", { yPercent: 120, rotate: 4, stagger: 0.06, duration: 0.8, ease: "power4.out" }, "-=0.45")
        .from("[data-menu-meta]", { opacity: 0, y: 20, stagger: 0.08, duration: 0.6 }, "-=0.6");
    },
    { scope },
  );

  useEffect(() => {
    if (open) {
      gsap.to(header.current, { yPercent: 0, duration: 0.3, overwrite: true });
      tl.current?.timeScale(1).play();
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      tl.current?.timeScale(1.6).reverse();
      lenis?.start();
      document.body.style.overflow = "";
    }
    document.documentElement.toggleAttribute("data-menu-open", open);
  }, [open, lenis]);

  const solid = scrolled && !open;

  return (
    <div ref={scope}>
    <header ref={header} className="fixed inset-x-0 top-0 z-[100]">
      <div
        className={clsx(
          "transition-[background-color,box-shadow,backdrop-filter] duration-500",
          solid ? "bg-cream-50/80 shadow-[0_1px_0_rgba(26,18,11,0.06)] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <nav className="container-x flex h-20 items-center justify-between gap-6" aria-label="Main">
          <Link href="/" className="group relative z-[2] flex items-center gap-3" aria-label={`${site.name} home`}>
            <span className="relative h-10 w-8 transition-[translate,scale,rotate] duration-500 group-hover:-rotate-12">
              <Image
                src={solid ? "/brand/mark-dark.png" : "/brand/mark-white.png"}
                alt=""
                fill
                sizes="32px"
                className={clsx("object-contain", !solid && "drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]")}
                priority
              />
            </span>
            <span className={clsx("leading-none transition-colors duration-500", solid ? "text-ink-900" : "text-white")}>
              <span className="block font-display text-lg font-bold tracking-tight">TLT Community</span>
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.25em] opacity-70">Trip Travel Therapy</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "group relative rounded-full px-4 py-2 font-display text-[0.95rem] font-medium transition-colors duration-300",
                      solid ? "text-ink-900" : "text-white",
                    )}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <span
                      className={clsx(
                        "absolute inset-x-4 -bottom-0.5 h-[2px] origin-left rounded-full bg-flame-500 transition-[translate,scale,rotate] duration-500 ease-out-expo",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="relative z-[2] flex items-center gap-3">
            <div className="hidden sm:block">
              <Button href="/trips" variant={solid ? "primary" : "light"} size="md">
                Book a trip
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={clsx(
                "relative flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300 lg:hidden",
                open ? "bg-white text-ink-900" : solid ? "bg-ink-900 text-white" : "bg-white/15 text-white backdrop-blur",
              )}
            >
              <span className="relative block h-3 w-5">
                <span className={clsx("absolute left-0 top-0 h-[2px] w-5 rounded bg-current transition-[translate,scale,rotate] duration-500", open && "translate-y-[5px] rotate-45")} />
                <span className={clsx("absolute bottom-0 left-0 h-[2px] w-5 rounded bg-current transition-[translate,scale,rotate] duration-500", open && "-translate-y-[5px] -rotate-45")} />
              </span>
            </button>
          </div>
        </nav>
      </div>
    </header>

      <div
        id="mobile-menu"
        ref={menu}
        className="bg-brand fixed inset-0 z-[99] flex-col justify-between overflow-y-auto px-6 pb-10 pt-28 text-white"
        style={{ display: "none" }}
        data-lenis-prevent
      >
        <ul className="space-y-1">
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <Link
                href={item.href}
                data-menu-link
                className="flex items-baseline gap-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl"
                onClick={() => setOpen(false)}
              >
                <span className="text-sm font-medium opacity-60">0{i + 1}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12 space-y-6">
          <div data-menu-meta>
            <p className="text-xs uppercase tracking-[0.25em] opacity-70">Say hello</p>
            <a href={`mailto:${site.email}`} className="mt-2 block text-xl font-medium">
              {site.email}
            </a>
            <a href={site.phoneHref} className="mt-1 block text-xl font-medium">
              {site.phone}
            </a>
          </div>
          <div data-menu-meta className="flex gap-3">
            {[
              { href: site.socials.instagram, Icon: InstagramIcon, label: "Instagram" },
              { href: site.socials.youtube, Icon: YoutubeIcon, label: "YouTube" },
              { href: whatsappLink("Hi TLT! I want to plan a trip."), Icon: WhatsappIcon, label: "WhatsApp" },
            ].map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
