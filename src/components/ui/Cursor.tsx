"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";

const QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(fn: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", fn);
  return () => mq.removeEventListener("change", fn);
}

// Elements can set data-cursor="View" (label) or data-cursor="hover" (grow only).
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const enabled = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    let current: Element | null = null;
    let seen = false;

    const move = (e: PointerEvent) => {
      if (!seen) {
        seen = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e: PointerEvent) => {
      if (!seen) return;
      const target = (e.target as Element).closest("[data-cursor], a, button, input, textarea, select, label");
      if (target === current) return;
      current = target;
      const value = target?.getAttribute("data-cursor") ?? (target ? "hover" : "");
      const isText = target?.matches("input, textarea");
      if (isText) {
        setLabel("");
        gsap.to(ring.current, { scale: 0.4, opacity: 0.5, duration: 0.3 });
        gsap.to(dot.current, { scale: 0, duration: 0.2 });
        return;
      }
      if (value && value !== "hover") {
        setLabel(value);
        gsap.to(ring.current, { scale: 2.6, opacity: 1, backgroundColor: "#ff7a1a", borderColor: "#ff7a1a", duration: 0.4 });
        gsap.to(dot.current, { scale: 0, duration: 0.2 });
      } else if (value === "hover") {
        setLabel("");
        gsap.to(ring.current, { scale: 1.6, opacity: 1, backgroundColor: "rgba(255,122,26,0.12)", borderColor: "#ff7a1a", duration: 0.35 });
        gsap.to(dot.current, { scale: 0.5, duration: 0.2 });
      } else {
        setLabel("");
        gsap.to(ring.current, { scale: 1, opacity: 1, backgroundColor: "rgba(0,0,0,0)", borderColor: "rgba(255,122,26,0.7)", duration: 0.35 });
        gsap.to(dot.current, { scale: 1, duration: 0.2 });
      }
    };

    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    const enter = () => seen && gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
    const down = () => gsap.to(ring.current, { scale: "-=0.25", duration: 0.15 });
    const up = () => gsap.to(ring.current, { scale: "+=0.25", duration: 0.2 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-flame-500/70 opacity-0"
      >
        <span className="font-display text-[5px] font-semibold uppercase tracking-[0.2em] text-white">{label}</span>
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-1 -mt-1 h-2 w-2 rounded-full bg-flame-500 opacity-0"
      />
    </>
  );
}
