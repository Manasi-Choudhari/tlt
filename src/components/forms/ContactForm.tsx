"use client";

import clsx from "clsx";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { trips } from "@/data/trips";
import { submitLead, type LeadType } from "@/lib/submit";
import { whatsappLink } from "@/data/site";
import { WhatsappIcon } from "@/components/ui/BrandIcons";

export function ContactForm({
  defaultTrip,
  type = "contact",
  dark = false,
  compact = false,
}: {
  defaultTrip?: string;
  type?: LeadType;
  dark?: boolean;
  compact?: boolean;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const input = clsx("input", dark && "input-dark");
  const label = clsx("mb-2 block text-sm font-medium", dark ? "text-white/70" : "text-ink-700");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("loading");
    setError("");
    try {
      await submitLead(type, data);
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className={clsx("flex flex-col items-center rounded-3xl p-10 text-center", dark ? "bg-white/5" : "bg-cream-100")}>
        <CheckCircle2 className="h-14 w-14 text-flame-500" />
        <h3 className={clsx("mt-5 font-display text-2xl font-semibold", dark ? "text-white" : "text-ink-900")}>Request received!</h3>
        <p className={clsx("mt-2 max-w-sm", dark ? "text-white/70" : "text-ink-700/80")}>
          Our trip designers will reach out within a few hours. Can&apos;t wait? Ping us on WhatsApp.
        </p>
        <a
          href={whatsappLink("Hi TLT! I just sent an enquiry on your website.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-display font-semibold text-white"
        >
          <WhatsappIcon className="h-5 w-5" /> Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      <div className={clsx("grid gap-5", !compact && "sm:grid-cols-2")}>
        <div>
          <label htmlFor={`${type}-name`} className={label}>
            Full name *
          </label>
          <input id={`${type}-name`} name="name" required minLength={2} maxLength={80} autoComplete="name" className={input} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor={`${type}-phone`} className={label}>
            Phone / WhatsApp *
          </label>
          <input
            id={`${type}-phone`}
            name="phone"
            required
            type="tel"
            pattern="[0-9+\-\s()]{8,16}"
            autoComplete="tel"
            className={input}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>
      <div className={clsx("grid gap-5", !compact && "sm:grid-cols-2")}>
        <div>
          <label htmlFor={`${type}-email`} className={label}>
            Email *
          </label>
          <input id={`${type}-email`} name="email" type="email" required autoComplete="email" className={input} placeholder="you@email.com" />
        </div>
        <div>
          <label htmlFor={`${type}-trip`} className={label}>
            Interested in
          </label>
          <select id={`${type}-trip`} name="trip" defaultValue={defaultTrip ?? ""} className={input}>
            <option value="">Not sure yet — help me choose</option>
            {trips.map((t) => (
              <option key={t.slug} value={t.title}>
                {t.title}
              </option>
            ))}
            <option value="Custom trip">Custom / private trip</option>
            <option value="Corporate offsite">Corporate offsite</option>
          </select>
        </div>
      </div>
      <div className={clsx("grid gap-5", !compact && "sm:grid-cols-2")}>
        <div>
          <label htmlFor={`${type}-travellers`} className={label}>
            Travellers
          </label>
          <input id={`${type}-travellers`} name="travellers" type="number" min={1} max={200} defaultValue={1} className={input} />
        </div>
        <div>
          <label htmlFor={`${type}-date`} className={label}>
            Preferred dates
          </label>
          <input id={`${type}-date`} name="dates" className={input} placeholder="e.g. 2nd week of Dec" maxLength={60} />
        </div>
      </div>
      <div>
        <label htmlFor={`${type}-message`} className={label}>
          Anything else?
        </label>
        <textarea
          id={`${type}-message`}
          name="message"
          rows={compact ? 3 : 4}
          maxLength={1500}
          className={clsx(input, "resize-none")}
          placeholder="Tell us about your dream trip, budget, special requests…"
        />
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {state === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="bg-brand inline-flex h-14 w-full items-center justify-center gap-2 rounded-full font-display text-base font-semibold text-white shadow-[0_12px_40px_-12px_rgba(255,90,20,0.7)] transition-[translate,scale,rotate] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
      >
        {state === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        {state === "loading" ? "Sending…" : type === "enquiry" ? "Request a callback" : "Send message"}
      </button>
      <p className={clsx("text-center text-xs", dark ? "text-white/40" : "text-ink-500")}>
        We reply within 2–4 working hours. Your details are never shared.
      </p>
    </form>
  );
}
