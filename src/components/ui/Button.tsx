"use client";

import Link from "next/link";
import clsx from "clsx";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

type Variant = "primary" | "dark" | "light" | "outline" | "outline-light";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-[0_12px_40px_-12px_rgba(255,90,20,0.7)]",
  dark: "bg-ink-900 text-white",
  light: "bg-white text-ink-900",
  outline: "border border-ink-900/20 text-ink-900 hover:border-ink-900",
  "outline-light": "border border-white/30 text-white hover:border-white",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  icon?: boolean;
  className?: string;
  magnetic?: boolean;
};

type ButtonProps = CommonProps &
  (({ href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children" | "className">) |
    ({ href?: undefined } & Omit<ComponentProps<"button">, "children" | "className">));

export function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", icon = true, className, magnetic = true, ...rest } = props;
  const wrap = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = wrap.current;
      if (!el || !magnetic || !window.matchMedia("(pointer: fine)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
      };
      const reset = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
      };
    },
    { scope: wrap },
  );

  const classes = clsx(
    "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-display font-semibold tracking-tight transition-[scale,background-color,border-color,color] duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60",
    size === "lg" ? "h-14 px-8 text-base" : "h-12 px-6 text-[0.95rem]",
    variants[variant],
    className,
  );

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        <span className="relative block overflow-hidden">
          <span className="block transition-[translate,scale,rotate] duration-500 ease-out-expo group-hover/btn:-translate-y-full">{children}</span>
          <span aria-hidden className="absolute inset-0 block translate-y-full transition-[translate,scale,rotate] duration-500 ease-out-expo group-hover/btn:translate-y-0">
            {children}
          </span>
        </span>
        {icon && (
          <ArrowUpRight className="h-4 w-4 transition-[translate,scale,rotate] duration-500 ease-out-expo group-hover/btn:rotate-45" aria-hidden />
        )}
      </span>
    </>
  );

  let el: ReactNode;
  if ("href" in rest && rest.href !== undefined) {
    const { href, external, ...anchor } = rest as { href: string; external?: boolean } & ComponentProps<"a">;
    el =
      external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:") ? (
        <a href={href} className={classes} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" {...anchor}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={classes} {...anchor}>
          {inner}
        </Link>
      );
  } else {
    el = (
      <button className={classes} {...(rest as ComponentProps<"button">)}>
        {inner}
      </button>
    );
  }

  return (
    <span ref={wrap} className="inline-block will-change-transform">
      {el}
    </span>
  );
}
