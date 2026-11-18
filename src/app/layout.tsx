import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope, Outfit } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { Cursor } from "@/components/ui/Cursor";
import { ChatWidget } from "@/components/chat/ChatWidget";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Trip. Travel. Therapy. | Goa & Hampi Group Trips`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "TLT Community",
    "The Legend Travellers Community",
    "Goa group trip",
    "Hampi trip",
    "group tours from Bangalore",
    "weekend getaways",
    "solo travel India",
    "Goa itinerary",
    "Hampi itinerary",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: `${site.name} — Trip. Travel. Therapy.`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: `${site.name} — Trip. Travel. Therapy.`, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ff7a1a",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: site.name,
  alternateName: site.legalName,
  slogan: site.tagline,
  url: site.url,
  logo: `${site.url}/brand/logo-full.png`,
  email: site.email,
  telephone: site.phone,
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" },
  sameAs: [site.socials.instagram, site.socials.youtube, site.socials.facebook],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "1177" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${outfit.variable} ${manrope.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10001] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-white">
          Skip to content
        </a>
        <SmoothScroll>
          <Preloader />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <ChatWidget />
          <Cursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
