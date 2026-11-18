import clsx from "clsx";
import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/data/content";

const palette = ["from-sun-300 to-flame-500", "from-flame-400 to-flame-700", "from-sun-400 to-flame-600", "from-flame-300 to-sun-500"];

export function TestimonialCard({ t, index = 0, dark = false, className }: { t: Testimonial; index?: number; dark?: boolean; className?: string }) {
  const initials = t.name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <figure
      className={clsx(
        "flex flex-col rounded-[1.75rem] p-7 sm:p-8",
        dark ? "border border-white/10 bg-white/[0.04] text-white" : "bg-white text-ink-900 shadow-[0_20px_60px_-35px_rgba(26,18,11,0.4)]",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={clsx("h-4 w-4", i < t.rating ? "fill-sun-400 text-sun-400" : dark ? "text-white/20" : "text-ink-900/15")} />
          ))}
        </div>
        <Quote className={clsx("h-8 w-8", dark ? "text-flame-500/60" : "text-flame-500/30")} />
      </div>
      <blockquote className={clsx("mt-5 flex-1 text-[1.02rem] leading-relaxed", dark ? "text-white/85" : "text-ink-700")}>
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-7 flex items-center gap-3">
        <span
          className={clsx(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-sm font-bold text-white",
            palette[index % palette.length],
          )}
        >
          {initials}
        </span>
        <span className="min-w-0">
          <span className="block font-display font-semibold">{t.name}</span>
          <span className={clsx("block truncate text-sm", dark ? "text-white/50" : "text-ink-500")}>
            {t.city} · {t.trip}
          </span>
        </span>
        {t.tag && (
          <span
            className={clsx(
              "ml-auto hidden shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold sm:inline",
              dark ? "bg-white/10 text-white/70" : "bg-cream-100 text-ink-700",
            )}
          >
            {t.tag}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
