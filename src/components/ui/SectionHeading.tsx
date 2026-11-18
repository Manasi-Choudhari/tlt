import clsx from "clsx";
import type { ReactNode } from "react";
import { SplitReveal } from "./SplitReveal";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal y={16}>
          <span className={clsx("eyebrow", dark ? "text-sun-300" : "text-flame-600")}>{eyebrow}</span>
        </Reveal>
      )}
      <SplitReveal as="h2" className={clsx("heading-lg mt-5", dark ? "text-white" : "text-ink-900")}>
        {title}
      </SplitReveal>
      {description && (
        <Reveal y={24} delay={0.15}>
          <p className={clsx("mt-6 text-lg leading-relaxed", dark ? "text-white/70" : "text-ink-700/80", align === "center" && "mx-auto")}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
