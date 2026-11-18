# TLT Community — website

Marketing site for **TLT Community (The Legend Travellers)** — *Trip Travel Therapy.*

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText, Flip, DrawSVG, MotionPath), Lenis smooth scroll and three.js via React Three Fiber.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

Requires Node.js 20.9 or newer.

## Deploy

The easiest option is [Vercel](https://vercel.com/new): import the repository, keep the defaults and add the environment variables from `.env.example` in the project settings. Any Node.js host that can run `npm run build && npm start` also works.

## Environment variables

All optional — see `.env.example` for details.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO, sitemap and social previews |
| `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL` | Upgrade the travel assistant to an LLM (falls back to the built-in engine) |
| `LEADS_WEBHOOK_URL` | Receive form submissions as JSON on a webhook |
| `RESEND_API_KEY`, `LEADS_TO_EMAIL`, `LEADS_FROM_EMAIL` | Receive form submissions by email |

## Editing content

| What | Where |
| --- | --- |
| Business name, phone, WhatsApp, email, address, socials, stats, map | `src/data/site.ts` |
| Trips — prices, itineraries, departures, inclusions, FAQs | `src/data/trips.ts` |
| Testimonials, services, general FAQs, values | `src/data/content.ts` |
| Image and video paths used across the site | `src/data/media.ts` |
| Photos | `public/images/` |
| Videos | `public/videos/` (then set `media.video.showreel`, e.g. `/videos/showreel.mp4`) |
| Logo and icons | `public/brand/`, `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/opengraph-image.png` |

The chatbot answers from `src/data/trips.ts` and `src/data/site.ts` automatically, so trip edits are reflected in its replies.

### Replacing images

Add `.webp` or `.jpg` files to `public/images/` (around 1920px wide keeps pages fast) and update the paths in `src/data/media.ts` / `src/data/trips.ts`. Reusing an existing file name swaps the photo everywhere without code changes.

## Placeholder content

Before launch, replace:

- Contact details in `src/data/site.ts` (phone `+91 90000 00000`, WhatsApp, email, address, map).
- Stats, testimonials and story copy — these are illustrative.
- Photos — current images are Creative Commons photos from Wikimedia Commons, used as placeholders.
