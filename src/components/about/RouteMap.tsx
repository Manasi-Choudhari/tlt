"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

const nodes = [
  { id: "blr", label: "Bengaluru", sub: "Start point", x: 470, y: 600, main: false, dx: 0, dy: 44, anchor: "middle" },
  { id: "hampi", label: "Hampi", sub: "Heritage & boulders", x: 400, y: 330, main: true, dx: 26, dy: -4, anchor: "start" },
  { id: "goa", label: "Goa", sub: "Beaches & nightlife", x: 150, y: 250, main: true, dx: -24, dy: -4, anchor: "end" },
] as const;

const routeMain = "M470 600 C 520 500, 420 430, 400 330 C 380 230, 260 180, 150 250";
const routeAlt = "M470 600 C 330 600, 160 480, 150 250";

export function RouteMap() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: 1 },
      });
      tl.from("[data-route-main]", { drawSVG: "0%", ease: "none", duration: 3 })
        .from("[data-route-alt]", { drawSVG: "0%", ease: "none", duration: 3 }, 0.5)
        .to(
          "[data-plane]",
          {
            motionPath: { path: "[data-route-main]", align: "[data-route-main]", alignOrigin: [0.5, 0.5], autoRotate: true },
            ease: "none",
            duration: 3,
          },
          0,
        )
        .fromTo("[data-plane]", { opacity: 0 }, { opacity: 1, duration: 0.15, immediateRender: true }, 0);
      gsap.from("[data-node]", {
        scale: 0,
        transformOrigin: "50% 50%",
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(2)",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
      gsap.to("[data-pulse]", { scale: 2.6, opacity: 0, transformOrigin: "50% 50%", duration: 2, repeat: -1, ease: "power2.out", stagger: 0.5 });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative mx-auto aspect-[9/10] w-full max-w-xl">
      <svg viewBox="-30 0 630 700" className="h-full w-full" role="img" aria-label="Map of TLT routes from Bengaluru to Hampi and Goa">
        <defs>
          <linearGradient id="route" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffd84d" />
            <stop offset="100%" stopColor="#ff5a14" />
          </linearGradient>
          <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="rgba(255,255,255,0.12)" />
          </pattern>
        </defs>
        <rect x="-30" width="630" height="700" fill="url(#dots)" />
        {[120, 200, 280].map((r) => (
          <circle key={r} cx="400" cy="330" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 8" />
        ))}
        <text x="40" y="520" fill="rgba(255,255,255,0.18)" fontSize="15" letterSpacing="6" fontFamily="var(--font-outfit)">
          ARABIAN SEA
        </text>

        <path d={routeAlt} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
        <path data-route-alt d={routeAlt} fill="none" stroke="rgba(255,216,77,0.45)" strokeWidth="2" strokeLinecap="round" />
        <path d={routeMain} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
        <path data-route-main d={routeMain} fill="none" stroke="url(#route)" strokeWidth="4" strokeLinecap="round" />

        {nodes.map((n) => (
          <g key={n.id} data-node>
            {n.main && <circle data-pulse cx={n.x} cy={n.y} r="14" fill="#ff7a1a" opacity="0.5" />}
            <circle cx={n.x} cy={n.y} r={n.main ? 14 : 9} fill={n.main ? "#ff7a1a" : "#fff"} stroke="#120c07" strokeWidth="4" />
            <text
              x={n.x + n.dx}
              y={n.y + n.dy}
              textAnchor={n.anchor}
              fill="#fff"
              fontSize="26"
              fontWeight="600"
              fontFamily="var(--font-outfit)"
            >
              {n.label}
            </text>
            <text
              x={n.x + n.dx}
              y={n.y + n.dy + 26}
              textAnchor={n.anchor}
              fill="rgba(255,255,255,0.55)"
              fontSize="15"
              fontFamily="var(--font-manrope)"
            >
              {n.sub}
            </text>
          </g>
        ))}

        <g data-plane style={{ opacity: 0 }}>
          <path d="M0 -14 L4 -3 L14 2 L14 5 L4 2 L3 10 L7 13 L7 15 L0 13 L-7 15 L-7 13 L-3 10 L-4 2 L-14 5 L-14 2 L-4 -3 Z" fill="#fff" transform="rotate(90)" />
        </g>
      </svg>
    </div>
  );
}
