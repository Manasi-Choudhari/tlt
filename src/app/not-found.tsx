import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="bg-brand grain relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 text-center text-white">
      <div className="pointer-events-none absolute -right-20 top-10 h-[480px] w-[360px] rotate-12 opacity-15">
        <Image src="/brand/mark-white.png" alt="" fill sizes="360px" className="object-contain" />
      </div>
      <div className="relative">
        <p className="font-display text-[clamp(6rem,22vw,16rem)] font-bold leading-none tracking-[-0.06em]">404</p>
        <h1 className="heading-md mt-2">
          Looks like you took a <span className="accent text-ink-900">wrong turn.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-white/85">This page has wandered off. Let&apos;s get you back on the road.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="dark" size="lg">
            Back home
          </Button>
          <Button href="/trips" variant="light" size="lg">
            Explore trips
          </Button>
        </div>
      </div>
    </section>
  );
}
