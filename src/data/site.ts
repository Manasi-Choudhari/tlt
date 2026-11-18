// Central business details. Replace placeholder values before going live.
export const site = {
  name: "TLT Community",
  legalName: "The Legend Travellers Community",
  tagline: "Trip Travel Therapy.",
  description:
    "TLT Community — The Legend Travellers Community. Curated group trips, custom itineraries and weekend escapes to Goa, Hampi and beyond. Trip. Travel. Therapy.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tltcommunity.in",
  phone: "+91 90000 00000",
  phoneHref: "tel:+919000000000",
  whatsapp: "919000000000",
  email: "hello@tltcommunity.in",
  address: "Bengaluru, Karnataka, India",
  hours: "Mon – Sat · 10:00 AM – 8:00 PM",
  mapEmbed:
    "https://www.google.com/maps?q=Bengaluru,Karnataka&output=embed",
  socials: {
    instagram: "https://instagram.com/tltcommunity",
    youtube: "https://youtube.com/@tltcommunity",
    facebook: "https://facebook.com/tltcommunity",
    whatsappGroup: "https://chat.whatsapp.com/",
  },
  stats: [
    { value: 2500, suffix: "+", label: "Happy travellers" },
    { value: 180, suffix: "+", label: "Trips completed" },
    { value: 4.9, suffix: "/5", label: "Average rating", decimals: 1 },
    { value: 12, suffix: "", label: "Destinations planned" },
  ],
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "Trips" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Stories" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
