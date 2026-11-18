"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { submitLead } from "@/lib/submit";

export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("loading");
    try {
      await submitLead("newsletter", Object.fromEntries(form));
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-4 flex items-center gap-2 text-sun-300">
        <Check className="h-4 w-4" /> You&apos;re in! Watch your inbox for the next trip drop.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="flex rounded-full border border-white/15 bg-white/5 p-1.5 focus-within:border-flame-500">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          className="min-w-0 flex-1 bg-transparent px-4 text-white outline-none placeholder:text-white/40"
        />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button
          type="submit"
          disabled={state === "loading"}
          aria-label="Subscribe"
          className="bg-brand flex h-11 w-11 items-center justify-center rounded-full text-white transition-[translate,scale,rotate] hover:scale-105"
        >
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </form>
  );
}
