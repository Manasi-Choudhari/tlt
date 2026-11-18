"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowUp, RotateCcw, X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { trips, formatPrice } from "@/data/trips";
import { whatsappLink } from "@/data/site";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import { useLenis } from "@/components/providers/SmoothScroll";
import type { ChatMessage, ChatReply } from "@/lib/chat/types";

type UIMessage = ChatMessage & { trips?: string[]; suggestions?: string[] };

const STORAGE_KEY = "tlt-chat-v1";

const WELCOME: UIMessage = {
  role: "assistant",
  content:
    "Hey legend! 👋 I'm **Tara**, your TLT travel assistant.\n\nAsk me about our **Goa** & **Hampi** trips — itineraries, prices, dates, what to pack or how to book.",
  suggestions: ["Show all trips", "Goa trip price", "Hampi itinerary", "Upcoming dates"],
};

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink-900">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((l, i) => {
        const trimmed = l.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        if (/^[•\-*]\s/.test(trimmed))
          return (
            <div key={i} className="flex gap-2">
              <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-flame-500" />
              <span>{renderInline(trimmed.replace(/^[•\-*]\s/, ""))}</span>
            </div>
          );
        return <p key={i}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

export function ChatWidget() {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const lenis = useLenis();

  const restored = useRef(false);

  useEffect(() => {
    const t = window.setTimeout(() => setTeaser(true), 6000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (restored.current) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function restore(): UIMessage[] {
    if (restored.current) return messages;
    restored.current = true;
    try {
      const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null") as UIMessage[] | null;
      if (Array.isArray(parsed) && parsed.length) {
        setMessages(parsed);
        return parsed;
      }
    } catch {}
    return messages;
  }

  function openPanel() {
    restore();
    setOpen(true);
    setTeaser(false);
  }

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(panel.current, { display: "flex" })
        .fromTo(
          panel.current,
          { opacity: 0, scale: 0.85, y: 30, transformOrigin: "100% 100%" },
          { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.4)" },
        )
        .from("[data-chat-item]", { opacity: 0, y: 14, stagger: 0.05, duration: 0.4 }, "-=0.25");
      gsap.fromTo(
        "[data-chat-fab]",
        { scale: 0, rotate: -90 },
        { scale: 1, rotate: 0, duration: 0.8, delay: 1.5, ease: "back.out(1.7)", stagger: 0.12 },
      );
    },
    { scope: root },
  );

  useEffect(() => {
    if (open) {
      tl.current?.timeScale(1).play();
      if (window.matchMedia("(pointer: fine)").matches) window.setTimeout(() => inputRef.current?.focus(), 350);
    } else {
      tl.current?.timeScale(1.8).reverse();
    }
    const sheet = open && window.matchMedia("(max-width: 639px)").matches;
    if (sheet) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = sheet ? "hidden" : "";
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onOpen = (e: Event) => {
      const history = restore();
      setOpen(true);
      setTeaser(false);
      const q = (e as CustomEvent<string | undefined>).detail;
      if (q) window.setTimeout(() => send(q, history), 400);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("tlt:open-chat", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("tlt:open-chat", onOpen);
    };
  });

  async function send(text: string, history: UIMessage[] = messages) {
    const content = text.trim();
    if (!content || loading) return;
    const next: UIMessage[] = [...history, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = (await res.json()) as ChatReply;
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? "Sorry, something went wrong.", trips: data.trips, suggestions: data.suggestions },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I couldn't connect just now. Please try again, or message us on WhatsApp! 🙏" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  const last = messages[messages.length - 1];

  return (
    <div ref={root} className="fixed bottom-5 right-5 z-[200] flex flex-col items-end gap-3 transition-opacity duration-300 sm:bottom-6 sm:right-6 in-data-menu-open:pointer-events-none in-data-menu-open:opacity-0">
      <div
        ref={panel}
        role="dialog"
        aria-label="TLT travel assistant"
        aria-hidden={!open}
        className="fixed inset-0 z-10 h-dvh w-full flex-col overflow-hidden bg-cream-50 sm:static sm:z-auto sm:mb-1 sm:h-[min(640px,calc(100dvh-7rem))] sm:w-[400px] sm:rounded-[1.75rem] sm:border sm:border-ink-900/5 sm:shadow-[0_30px_80px_-20px_rgba(26,18,11,0.45)]"
        style={{ display: "none" }}
      >
        <div className="bg-brand relative flex items-center gap-3 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] text-white sm:pt-4">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <span className="relative h-7 w-5">
              <Image src="/brand/mark-white.png" alt="" fill sizes="20px" className="object-contain" />
            </span>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-flame-500 bg-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold leading-tight">Tara · TLT Assistant</p>
            <p className="text-xs text-white/80">Travel queries only · replies instantly</p>
          </div>
          <a
            href={whatsappLink("Hi TLT! I have a question about a trip.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with a human on WhatsApp"
            title="Talk to a human"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/30"
          >
            <WhatsappIcon className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setMessages([WELCOME])}
            aria-label="Restart conversation"
            title="Restart"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/30"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div ref={scroller} data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} data-chat-item className={clsx("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
              <div
                className={clsx(
                  "max-w-[88%] rounded-2xl px-4 py-3 text-[0.92rem] leading-relaxed",
                  m.role === "user" ? "rounded-br-md bg-ink-900 text-white" : "rounded-bl-md bg-white text-ink-700 shadow-sm",
                )}
              >
                {m.role === "user" ? m.content : <RichText text={m.content} />}
              </div>
              {m.trips && m.trips.length > 0 && (
                <div className="mt-2 flex w-full gap-2 no-scrollbar overflow-x-auto pb-1" data-lenis-prevent>
                  {m.trips.map((slug) => {
                    const t = trips.find((x) => x.slug === slug);
                    if (!t) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/trips/${slug}`}
                        onClick={() => setOpen(false)}
                        className="group flex w-56 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm"
                      >
                        <span className="relative h-auto w-20 shrink-0 overflow-hidden">
                          <Image src={t.image} alt="" fill sizes="80px" className="object-cover transition-[translate,scale,rotate] duration-500 group-hover:scale-110" />
                        </span>
                        <span className="min-w-0 p-3">
                          <span className="block truncate font-display text-sm font-semibold text-ink-900">{t.title}</span>
                          <span className="block text-xs text-ink-500">
                            {t.nights}N/{t.days}D · {formatPrice(t.price)}
                          </span>
                          <span className="mt-1 block text-xs font-semibold text-flame-600">View trip →</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-4 shadow-sm" style={{ width: "fit-content" }}>
              {[0, 1, 2].map((d) => (
                <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-flame-400" style={{ animationDelay: `${d * 0.15}s` }} />
              ))}
            </div>
          )}
        </div>

        {!loading && last?.role === "assistant" && last.suggestions && last.suggestions.length > 0 && (
          <div className="flex gap-2 no-scrollbar overflow-x-auto px-4 pb-3" data-lenis-prevent>
            {last.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="shrink-0 rounded-full border border-flame-500/30 bg-white px-3.5 py-1.5 text-xs font-semibold text-flame-700 transition-colors hover:bg-flame-500 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-ink-900/5 bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:pb-3">
          <label htmlFor="chat-input" className="sr-only">
            Ask about trips
          </label>
          <input
            ref={inputRef}
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={600}
            autoComplete="off"
            placeholder="Ask about trips, prices, dates…"
            className="min-w-0 flex-1 rounded-full bg-cream-100 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-flame-500/40 sm:text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send"
            className="bg-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-[scale] duration-300 hover:scale-105 disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </form>
      </div>

      {teaser && !open && (
        <button
          type="button"
          onClick={openPanel}
          className="hidden max-w-[240px] animate-float rounded-2xl sm:block rounded-br-sm bg-white px-4 py-3 text-left text-sm text-ink-700 shadow-xl"
        >
          <span className="font-semibold text-ink-900">Planning a trip? 🌴</span>
          <br />
          Ask Tara about Goa & Hampi itineraries!
        </button>
      )}

      <div className="flex items-center gap-3">
        <a
          data-chat-fab
          href={whatsappLink("Hi TLT! I want to plan a trip.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-[scale] duration-300 hover:scale-110"
        >
          <WhatsappIcon className="h-6 w-6" />
        </a>
        <button
          data-chat-fab
          type="button"
          onClick={() => (open ? setOpen(false) : openPanel())}
          aria-label={open ? "Close travel assistant" : "Open travel assistant"}
          aria-expanded={open}
          className="bg-brand relative flex h-16 w-16 items-center justify-center rounded-full text-white shadow-[0_15px_40px_-10px_rgba(255,90,20,0.8)] transition-[scale] duration-300 hover:scale-105"
        >
          {!open && <span className="absolute inset-0 animate-ping rounded-full bg-flame-500/40 [animation-duration:2.5s]" />}
          {open ? (
            <X className="relative h-6 w-6" />
          ) : (
            <span className="relative h-8 w-6">
              <Image src="/brand/mark-white.png" alt="" fill sizes="24px" className="object-contain" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export function openChat(question?: string) {
  window.dispatchEvent(new CustomEvent("tlt:open-chat", { detail: question }));
}
