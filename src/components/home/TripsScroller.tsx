"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { trips } from "@/data/trips";
import { useLenis } from "@/components/providers/SmoothScroll";
import { TripCard } from "@/components/trips/TripCard";
import { Button } from "@/components/ui/Button";

export function TripsScroller() {
  const root = useRef<HTMLElement>(null);
  const nudge = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const pin = useRef<ScrollTrigger | null>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  const cardStep = () => {
    const card = track.current?.querySelector<HTMLElement>("[data-trip-card]");
    return card ? card.offsetWidth + 24 : 400;
  };

  const scrollWindowTo = (y: number, immediate = false) => {
    if (lenisRef.current) lenisRef.current.scrollTo(y, immediate ? { immediate: true } : { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
  };

  const go = (dir: 1 | -1) => {
    const st = pin.current;
    if (st?.isActive || (st && window.scrollY >= st.start - 2 && window.scrollY <= st.end + 2)) {
      scrollWindowTo(gsap.utils.clamp(st.start, st.end, window.scrollY + dir * cardStep()));
    } else if (st) {
      scrollWindowTo(dir > 0 ? st.start + cardStep() : st.start);
    } else {
      track.current?.scrollBy({ left: dir * cardStep(), behavior: "smooth" });
    }
  };

  useGSAP(
    () => {
      const el = track.current!;
      const setProgress = gsap.quickSetter(progress.current, "scaleX");

      const onNativeScroll = () => {
        if (pin.current) return;
        const max = el.scrollWidth - el.clientWidth;
        setProgress(max > 0 ? el.scrollLeft / max : 0);
      };
      el.addEventListener("scroll", onNativeScroll, { passive: true });

      // Click-and-drag with a mouse: scrubs the pinned section on desktop, scrolls the row otherwise.
      let drag: { x: number; scroll: number; moved: boolean } | null = null;
      const onDown = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        drag = { x: e.clientX, scroll: pin.current ? window.scrollY : el.scrollLeft, moved: false };
      };
      const onMove = (e: PointerEvent) => {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        if (!drag.moved && Math.abs(dx) < 6) return;
        if (!drag.moved) {
          drag.moved = true;
          root.current?.classList.add("is-dragging");
        }
        if (pin.current) {
          scrollWindowTo(gsap.utils.clamp(pin.current.start, pin.current.end, drag.scroll - dx), true);
        } else {
          el.scrollLeft = drag.scroll - dx;
        }
      };
      const onUp = () => {
        if (drag?.moved) {
          const swallow = (ev: Event) => {
            ev.preventDefault();
            ev.stopPropagation();
          };
          el.addEventListener("click", swallow, { capture: true, once: true });
          window.setTimeout(() => el.removeEventListener("click", swallow, true), 50);
        }
        drag = null;
        root.current?.classList.remove("is-dragging");
      };
      el.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        if (prefersReducedMotion()) return;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        });
        pin.current = tween.scrollTrigger ?? null;
        gsap.utils.toArray<HTMLElement>("[data-trip-card]").forEach((card) => {
          gsap.from(card, {
            rotate: 4,
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "center center",
              scrub: true,
            },
          });
        });
        return () => {
          pin.current = null;
        };
      });

      // The row drifts with the cursor and each card tilts towards it.
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const section = root.current!;
        const nudgeTo = gsap.quickTo(nudge.current, "x", { duration: 1.2, ease: "power3.out" });
        const onSectionMove = (e: PointerEvent) => {
          if (drag?.moved) return;
          const r = section.getBoundingClientRect();
          nudgeTo(((e.clientX - r.left) / r.width - 0.5) * -90);
        };
        const onSectionLeave = () => nudgeTo(0);
        section.addEventListener("pointermove", onSectionMove);
        section.addEventListener("pointerleave", onSectionLeave);

        const cleanups = gsap.utils.toArray<HTMLElement>("[data-tilt]").map((card) => {
          gsap.set(card, { transformPerspective: 900 });
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
          const onCardMove = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 12);
            rx(((e.clientY - r.top) / r.height - 0.5) * -10);
          };
          const onCardLeave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", onCardMove);
          card.addEventListener("pointerleave", onCardLeave);
          return () => {
            card.removeEventListener("pointermove", onCardMove);
            card.removeEventListener("pointerleave", onCardLeave);
          };
        });

        return () => {
          section.removeEventListener("pointermove", onSectionMove);
          section.removeEventListener("pointerleave", onSectionLeave);
          cleanups.forEach((fn) => fn());
        };
      });

      return () => {
        mm.revert();
        el.removeEventListener("scroll", onNativeScroll);
        el.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="group/scroller relative overflow-hidden bg-ink-950 py-24 text-white lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0"
    >
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-flame-500/30 blur-[140px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sun-400/20 blur-[120px]" />

      <div ref={nudge}>
        <div
          ref={track}
          data-cursor="Drag"
          onDragStart={(e) => e.preventDefault()}
          className="relative flex cursor-grab snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pb-6 no-scrollbar select-none group-[.is-dragging]/scroller:cursor-grabbing group-[.is-dragging]/scroller:snap-none sm:scroll-px-10 sm:px-10 lg:snap-none lg:overflow-visible lg:px-[6vw] lg:pb-0"
        >
          <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-center sm:w-[420px] lg:w-[34vw] lg:pr-10">
            <span className="eyebrow text-sun-300">Upcoming trips</span>
            <h2 className="heading-lg mt-5">
              Pick your <span className="accent text-gradient">therapy</span> session.
            </h2>
            <p className="mt-6 max-w-md text-lg text-white/70">
              Fixed-departure group trips with stays, travel, experiences and a trip captain — all sorted. You just pack.
            </p>
            <div className="mt-8">
              <Button href="/trips" variant="primary">
                All trips
              </Button>
            </div>
          </div>

          {trips.map((t) => (
            <div key={t.slug} data-trip-card className="w-[82vw] shrink-0 snap-start sm:w-[380px] lg:w-[min(30vw,420px)]">
              <div data-tilt className="h-full will-change-transform">
                <TripCard trip={t} className="h-full" imageClassName="lg:aspect-auto lg:h-[clamp(110px,calc(100svh-27rem),300px)]" />
              </div>
            </div>
          ))}
          <div className="w-1 shrink-0 lg:w-[4vw]" />
        </div>
      </div>

      <div className="container-x relative mt-8 flex items-center gap-5 lg:mt-[min(3rem,5vh)] lg:max-w-none lg:px-[6vw]">
        <div className="h-px flex-1 bg-white/15 lg:max-w-xs">
          <div ref={progress} className="bg-brand h-px origin-left scale-x-0" />
        </div>
        <span className="hidden text-xs uppercase tracking-[0.3em] text-white/50 lg:inline">Drag or scroll</span>
        <div className="flex gap-2 lg:ml-auto">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous trips"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white hover:bg-white hover:text-ink-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next trips"
            className="bg-brand flex h-12 w-12 items-center justify-center rounded-full text-white transition-[scale] duration-300 hover:scale-105"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
