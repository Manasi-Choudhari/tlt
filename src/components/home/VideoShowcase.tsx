"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";
import { site } from "@/data/site";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { media } from "@/data/media";
import { useLenis } from "@/components/providers/SmoothScroll";

// Scroll-driven expanding media frame. Uses media.video.showreel when the
// client supplies a video; otherwise shows the poster with a Ken Burns drift.
export function VideoShowcase() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const hasVideo = Boolean(media.video.showreel);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=120%", scrub: 1, pin: true },
      });
      tl.fromTo(
        "[data-frame]",
        { clipPath: "inset(22% 28% 22% 28% round 2.5rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none" },
      )
        .fromTo("[data-frame-media]", { scale: 1.35 }, { scale: 1, ease: "none" }, 0)
        .fromTo("[data-word-left]", { xPercent: 0 }, { xPercent: -120, ease: "none" }, 0)
        .fromTo("[data-word-right]", { xPercent: 0 }, { xPercent: 120, ease: "none" }, 0)
        .fromTo("[data-frame-ui]", { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "none" }, 0.55);
    },
    { scope: root },
  );

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  return (
    <section ref={root} className="relative h-screen overflow-hidden bg-cream-50">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-between px-[4vw] font-display text-[clamp(3rem,12vw,12rem)] font-semibold tracking-[-0.05em] text-ink-900">
        <span data-word-left>Feel</span>
        <span data-word-right className="accent text-flame-600">
          alive
        </span>
      </div>

      <div data-frame className="absolute inset-0 z-10 overflow-hidden" style={{ clipPath: "inset(0% 0% 0% 0% round 0rem)" }}>
        <div data-frame-media className="absolute inset-0">
          {hasVideo ? (
            <video className="h-full w-full object-cover" src={media.video.showreel} poster={media.video.showreelPoster} autoPlay muted loop playsInline />
          ) : (
            <Image src={media.video.showreelPoster} alt="Sunset over Palolem beach, Goa" fill sizes="100vw" className="object-cover" />
          )}
        </div>
        <div className="absolute inset-0 bg-ink-950/35" />
        <div data-frame-ui className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <button
            type="button"
            onClick={() => setOpen(true)}
            data-cursor="Play"
            aria-label="Play TLT showreel"
            className="group relative flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-[translate,scale,rotate] hover:scale-110 sm:h-32 sm:w-32"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-white/20 [animation-duration:2.4s]" />
            <Play className="h-8 w-8 fill-white sm:h-10 sm:w-10" />
          </button>
          <p className="heading-md mt-8 max-w-2xl px-6">
            This is what <span className="accent">therapy</span> looks like.
          </p>
          <p className="mt-3 text-white/80">Watch the TLT Community showreel</p>
        </div>
      </div>

      {open &&
        createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-ink-950/90 p-4 backdrop-blur" role="dialog" aria-modal aria-label="Showreel">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close video"
            className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-900"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-3xl bg-black">
            {hasVideo ? (
              <video src={media.video.showreel} controls autoPlay playsInline className="h-full w-full" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-white/80">
                <Image src={media.video.showreelPoster} alt="" fill sizes="100vw" className="object-cover opacity-30" />
                <p className="relative font-display text-2xl font-semibold text-white">Our showreel drops soon 🎬</p>
                <p className="relative max-w-md text-sm">
                  Meanwhile, catch the latest trip reels on{" "}
                  <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-sun-300 underline">
                    Instagram
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </div>,
          document.body,
        )}
    </section>
  );
}
