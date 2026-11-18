"use client";

import clsx from "clsx";
import { useState, type FormEvent } from "react";
import { Heart, Loader2, Star } from "lucide-react";
import { trips } from "@/data/trips";
import { submitLead } from "@/lib/submit";

export function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("loading");
    try {
      await submitLead("feedback", { ...data, rating });
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-white/5 p-10 text-center">
        <Heart className="h-14 w-14 fill-flame-500 text-flame-500" />
        <h3 className="mt-5 font-display text-2xl font-semibold text-white">Thank you, legend!</h3>
        <p className="mt-2 max-w-sm text-white/70">Your feedback helps us make every trip more therapeutic than the last.</p>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset>
        <legend className="mb-3 block text-sm font-medium text-white/70">How was your trip?</legend>
        <div className="flex gap-2" onPointerLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              onPointerEnter={() => setHover(n)}
              onClick={() => setRating(n)}
              className="transition-[translate,scale,rotate] hover:scale-110"
            >
              <Star className={clsx("h-9 w-9 transition-colors", n <= shown ? "fill-sun-400 text-sun-400" : "text-white/25")} />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-name" className="mb-2 block text-sm font-medium text-white/70">
            Your name *
          </label>
          <input id="fb-name" name="name" required minLength={2} maxLength={80} className="input input-dark" placeholder="Name" />
        </div>
        <div>
          <label htmlFor="fb-email" className="mb-2 block text-sm font-medium text-white/70">
            Email *
          </label>
          <input id="fb-email" name="email" type="email" required className="input input-dark" placeholder="you@email.com" />
        </div>
      </div>
      <div>
        <label htmlFor="fb-trip" className="mb-2 block text-sm font-medium text-white/70">
          Which trip?
        </label>
        <select id="fb-trip" name="trip" className="input input-dark" defaultValue="">
          <option value="">Select a trip</option>
          {trips.map((t) => (
            <option key={t.slug} value={t.title}>
              {t.title}
            </option>
          ))}
          <option value="Custom trip">Custom / private trip</option>
        </select>
      </div>
      <div>
        <label htmlFor="fb-message" className="mb-2 block text-sm font-medium text-white/70">
          Your story *
        </label>
        <textarea
          id="fb-message"
          name="message"
          required
          minLength={10}
          maxLength={1500}
          rows={4}
          className="input input-dark resize-none"
          placeholder="What made the trip special? What can we do better?"
        />
      </div>
      <label className="flex items-start gap-3 text-sm text-white/60">
        <input type="checkbox" name="publish" value="yes" defaultChecked className="mt-1 h-4 w-4 accent-flame-500" />
        You can feature my review on the TLT website & socials.
      </label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {state === "error" && <p className="text-sm text-red-300">{error}</p>}
      <button
        type="submit"
        disabled={state === "loading"}
        className="bg-brand inline-flex h-14 w-full items-center justify-center gap-2 rounded-full font-display font-semibold text-white disabled:opacity-70"
      >
        {state === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
        {state === "loading" ? "Sending…" : "Share feedback"}
      </button>
    </form>
  );
}
