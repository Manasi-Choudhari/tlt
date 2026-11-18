"use client";

import Image from "next/image";
import clsx from "clsx";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Reveal } from "@/components/ui/Reveal";

export function TripGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const lenis = useLenis();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const step = (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + images.length) % images.length));

  const onTouchStart = (e: TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) setIndex(null);
  };

  useEffect(() => {
    if (index === null) {
      lenis?.start();
      return;
    }
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, lenis]);

  return (
    <>
      <Reveal stagger={0.08} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            data-cursor="Zoom"
            onClick={() => setIndex(i)}
            className={clsx("group relative overflow-hidden rounded-2xl", i === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-auto" : "aspect-square")}
            aria-label={`Open photo ${i + 1} of ${title}`}
          >
            <Image
              src={src}
              alt={`${title} photo ${i + 1}`}
              fill
              sizes={i === 0 ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 640px) 33vw, 50vw"}
              className="object-cover transition-[translate,scale,rotate] duration-[1.2s] ease-out-expo group-hover:scale-110"
            />
          </button>
        ))}
      </Reveal>

      {index !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[600] flex touch-none items-center justify-center bg-ink-950/95 p-4"
            role="dialog"
            aria-modal
            aria-label={`${title} gallery`}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <button type="button" onClick={() => setIndex(null)} aria-label="Close" className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-900">
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute bottom-5 left-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:bottom-auto sm:left-4"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="relative h-[80vh] w-full max-w-6xl">
              <Image src={images[index]} alt={`${title} photo ${index + 1}`} fill sizes="100vw" className="object-contain" />
            </div>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute bottom-5 right-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:bottom-auto sm:right-4"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <p className="absolute bottom-8 text-sm text-white/70">
              {index + 1} / {images.length}
              <span className="sm:hidden"> · swipe</span>
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
