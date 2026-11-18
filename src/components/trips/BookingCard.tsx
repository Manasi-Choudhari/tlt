"use client";

import clsx from "clsx";
import { useState } from "react";
import { CalendarDays, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { formatDate, formatPrice, type Trip } from "@/data/trips";
import { whatsappLink } from "@/data/site";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import { useLenis } from "@/components/providers/SmoothScroll";
import { openChat } from "@/components/chat/ChatWidget";

export function BookingCard({ trip }: { trip: Trip }) {
  const [selected, setSelected] = useState(trip.departures[0]?.date);
  const lenis = useLenis();
  const message = `Hi TLT! I'd like to book *${trip.title}* (${trip.nights}N/${trip.days}D)${selected ? ` for the ${formatDate(selected)} departure` : ""}. Please share details.`;

  function scrollToEnquiry() {
    const el = document.getElementById("enquire");
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -90 });
    else el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(26,18,11,0.45)] sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-500">Starting from</p>
          <p className="font-display text-4xl font-bold tracking-tight text-ink-900">{formatPrice(trip.price)}</p>
          <p className="text-sm text-ink-500">per person · twin/triple sharing</p>
        </div>
        {trip.originalPrice && (
          <div className="text-right">
            <p className="text-sm text-ink-500 line-through">{formatPrice(trip.originalPrice)}</p>
            <p className="bg-brand mt-1 rounded-full px-3 py-1 text-xs font-bold text-white">
              Save {formatPrice(trip.originalPrice - trip.price)}
            </p>
          </div>
        )}
      </div>

      <fieldset className="mt-7">
        <legend className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          <CalendarDays className="h-4 w-4 text-flame-500" /> Choose a departure
        </legend>
        <div className="mt-3 grid gap-2">
          {trip.departures.map((d) => (
            <label
              key={d.date}
              className={clsx(
                "flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all",
                selected === d.date ? "border-flame-500 bg-flame-500/5 ring-1 ring-flame-500" : "border-ink-900/10 hover:border-ink-900/30",
              )}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="departure"
                  value={d.date}
                  checked={selected === d.date}
                  onChange={() => setSelected(d.date)}
                  className="accent-flame-500"
                />
                <span className="font-semibold text-ink-900">{formatDate(d.date)}</span>
              </span>
              <span className={clsx("text-xs font-semibold", d.seatsLeft <= 5 ? "text-flame-600" : "text-emerald-600")}>
                {d.seatsLeft <= 5 ? `Only ${d.seatsLeft} left!` : `${d.seatsLeft} seats left`}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-3">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] font-display font-semibold text-white transition-[translate,scale,rotate] hover:scale-[1.02]"
        >
          <WhatsappIcon className="h-5 w-5" /> Book on WhatsApp
        </a>
        <button
          type="button"
          onClick={scrollToEnquiry}
          className="bg-brand flex h-14 items-center justify-center gap-2 rounded-full font-display font-semibold text-white transition-[translate,scale,rotate] hover:scale-[1.02]"
        >
          <MessageCircle className="h-5 w-5" /> Request a callback
        </button>
        <button
          type="button"
          onClick={() => openChat(`Tell me more about ${trip.title}`)}
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-ink-900/15 font-display text-sm font-semibold text-ink-900 transition-colors hover:border-ink-900"
        >
          <Sparkles className="h-4 w-4 text-flame-500" /> Ask our AI assistant
        </button>
      </div>

      <ul className="mt-6 space-y-2 border-t border-ink-900/5 pt-5 text-sm text-ink-700">
        {["Lock your seat with just ₹2,000", "Free cancellation up to 15 days", "Trip captain + 24×7 support"].map((p) => (
          <li key={p} className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
