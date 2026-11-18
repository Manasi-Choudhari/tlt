import { media } from "./media";

export type Destination = "goa" | "hampi" | "combo";

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals?: string;
  stay?: string;
};

export type Trip = {
  slug: string;
  title: string;
  destination: Destination;
  region: string;
  tagline: string;
  summary: string;
  nights: number;
  days: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  groupSize: string;
  difficulty: "Easy" | "Moderate" | "Active";
  bestTime: string;
  pickup: string;
  vibe: string[];
  image: string;
  gallery: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  departures: { date: string; seatsLeft: number }[];
  faqs: { q: string; a: string }[];
  featured?: boolean;
};

const commonCarry = [
  "Government photo ID (mandatory for check-in)",
  "Comfortable walking shoes + flip-flops",
  "Sunscreen, sunglasses & a cap",
  "Reusable water bottle",
  "Power bank & charging cables",
  "Personal medicines",
];

export const trips: Trip[] = [
  {
    slug: "goa-beach-therapy",
    title: "Goa Beach Therapy",
    destination: "goa",
    region: "North + South Goa",
    tagline: "Sun, sand, sunsets & the best people you haven't met yet.",
    summary:
      "Our signature Goa experience. Four days that cover the electric nightlife of the North, the hidden coves of the South, Portuguese lanes, water sports and a sunset cruise — all with a group that becomes family by Day 2.",
    nights: 3,
    days: 4,
    price: 8999,
    originalPrice: 10999,
    rating: 4.9,
    reviews: 412,
    groupSize: "15 – 25 travellers",
    difficulty: "Easy",
    bestTime: "October – March",
    pickup: "Bengaluru (overnight AC sleeper) · Goa joining point: Mapusa",
    vibe: ["Beaches", "Nightlife", "Water sports", "Group trip"],
    image: media.goa.hero,
    gallery: [media.goa.hero, media.goa.palms, media.goa.vagator, media.goa.shack, media.goa.dusk, media.goa.cola],
    highlights: [
      "Sunset at Chapora Fort — the iconic 'Dil Chahta Hai' spot",
      "Water sports combo at Calangute: parasailing, jet ski & banana ride",
      "Mandovi river sunset cruise with live music",
      "Walk the colourful Latin Quarter of Fontainhas",
      "UNESCO-listed churches of Old Goa",
      "Kayaking and a boat ride to Butterfly Beach in Palolem",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive, unwind & North Goa sunset",
        description:
          "Reach Goa in the morning, freshen up at our beach-side stay and meet the tribe over a welcome brunch. Evening at Fort Aguada and Candolim, then a Baga beach night out.",
        activities: ["Welcome brunch & ice-breakers", "Fort Aguada lighthouse", "Candolim beach", "Baga night walk & shacks"],
        meals: "Brunch, Dinner",
        stay: "Beach-side hostel / resort, North Goa",
      },
      {
        day: 2,
        title: "Forts, flea markets & water sports",
        description:
          "Adrenaline day! Water sports at Calangute, cafe-hopping in Anjuna, the Wednesday flea market (seasonal) and sunset from Chapora Fort overlooking Vagator.",
        activities: ["Parasailing, jet ski & banana ride", "Anjuna flea market", "Vagator & Little Vagator beach", "Chapora Fort sunset"],
        meals: "Breakfast, Dinner",
        stay: "Beach-side hostel / resort, North Goa",
      },
      {
        day: 3,
        title: "Heritage, Latin Quarter & river cruise",
        description:
          "Slow down with Goa's history — Basilica of Bom Jesus and Se Cathedral in Old Goa, a photo walk through Fontainhas, and a sunset cruise on the Mandovi.",
        activities: ["Basilica of Bom Jesus", "Se Cathedral", "Fontainhas heritage walk", "Mandovi sunset cruise"],
        meals: "Breakfast, Dinner",
        stay: "Beach-side resort, South Goa",
      },
      {
        day: 4,
        title: "South Goa calm & departure",
        description:
          "Morning kayaking at Palolem, a boat ride to Butterfly Beach to spot dolphins, beach lunch, souvenir shopping and an evening departure home with a camera roll full of memories.",
        activities: ["Palolem kayaking", "Butterfly Beach boat ride", "Dolphin spotting", "Local market shopping"],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "3 nights' stay on twin/triple/quad sharing",
      "Return AC sleeper travel from Bengaluru",
      "All local transfers in a private tempo traveller",
      "Daily breakfast + 3 dinners",
      "Water sports combo & Mandovi cruise tickets",
      "Dedicated TLT trip captain throughout",
      "First-aid kit & 24×7 on-trip support",
    ],
    exclusions: [
      "Lunch & personal expenses",
      "Entry tickets not mentioned in inclusions",
      "Club cover charges",
      "Anything not listed under inclusions",
    ],
    thingsToCarry: [...commonCarry, "Swimwear & a quick-dry towel", "Light cotton clothes + one party outfit"],
    departures: [
      { date: "2026-12-04", seatsLeft: 6 },
      { date: "2026-12-18", seatsLeft: 3 },
      { date: "2026-12-28", seatsLeft: 9 },
      { date: "2027-01-15", seatsLeft: 14 },
    ],
    faqs: [
      { q: "Is this trip good for solo travellers?", a: "Absolutely — over 60% of our travellers come solo. You'll be paired with same-gender roommates and the group bonds fast." },
      { q: "Can I join directly in Goa?", a: "Yes. Choose the 'Goa joining' option at booking and the price drops by the transport cost. Meet us at Mapusa bus stand." },
      { q: "Is alcohol included?", a: "No. Drinks are on personal expense. We follow a respectful, safe-party policy on all trips." },
    ],
    featured: true,
  },
  {
    slug: "south-goa-serenity",
    title: "South Goa Serenity",
    destination: "goa",
    region: "Palolem · Agonda · Cola",
    tagline: "The quiet side of Goa — hidden coves, hammocks and silent-noise nights.",
    summary:
      "For travellers who want Goa without the crowds. Hidden beaches like Cola and Butterfly, the cliffs of Cabo de Rama, sunrise yoga, kayaking in lagoons and the famous silent headphone party.",
    nights: 2,
    days: 3,
    price: 7499,
    originalPrice: 8999,
    rating: 4.8,
    reviews: 186,
    groupSize: "10 – 18 travellers",
    difficulty: "Easy",
    bestTime: "November – March",
    pickup: "Bengaluru (overnight AC sleeper) · Goa joining point: Margao",
    vibe: ["Hidden beaches", "Chill", "Couples friendly", "Sunsets"],
    image: media.goa.palolem2,
    gallery: [media.goa.palolem2, media.goa.butterfly, media.goa.cola, media.goa.boat, media.goa.querim, media.goa.mandrem],
    highlights: [
      "Lagoon kayaking at Cola Beach",
      "Cliff-top sunset at Cabo de Rama fort",
      "Sunrise yoga on Agonda beach",
      "Silent-noise headphone party at Palolem",
      "Butterfly Beach & dolphin boat safari",
    ],
    itinerary: [
      {
        day: 1,
        title: "Palolem arrival & beach evening",
        description: "Check into beach huts at Palolem, lazy afternoon, sunset by the rocks and a candle-lit beach dinner with the group.",
        activities: ["Beach-hut check-in", "Palolem sunset", "Group beach dinner"],
        meals: "Dinner",
        stay: "Beach huts, Palolem",
      },
      {
        day: 2,
        title: "Hidden coves & Cabo de Rama",
        description: "Sunrise yoga at Agonda, then off to the secret lagoon of Cola beach for kayaking. Golden hour at Cabo de Rama fort, followed by the silent-noise party.",
        activities: ["Sunrise yoga", "Cola lagoon kayaking", "Cabo de Rama fort", "Silent-noise party"],
        meals: "Breakfast, Dinner",
        stay: "Beach huts, Palolem",
      },
      {
        day: 3,
        title: "Dolphins & goodbye",
        description: "Early boat safari to Butterfly Beach and Honeymoon Beach with dolphin spotting. Brunch, shopping and departure.",
        activities: ["Dolphin boat safari", "Butterfly Beach", "Brunch & shopping"],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "2 nights in beach huts (twin/triple sharing)",
      "Return AC sleeper travel from Bengaluru",
      "Local transfers",
      "2 breakfasts + 2 dinners",
      "Kayaking, boat safari & silent-noise entry",
      "TLT trip captain",
    ],
    exclusions: ["Lunch", "Personal expenses", "Anything not listed under inclusions"],
    thingsToCarry: [...commonCarry, "Swimwear", "Yoga mat (optional)"],
    departures: [
      { date: "2026-12-11", seatsLeft: 8 },
      { date: "2027-01-08", seatsLeft: 12 },
      { date: "2027-01-29", seatsLeft: 15 },
    ],
    faqs: [
      { q: "Is this good for couples?", a: "Yes! Couples get private huts on request (small supplement)." },
      { q: "Are the beach huts air-conditioned?", a: "AC huts are available on upgrade. Standard huts have fans and are steps from the sea." },
    ],
  },
  {
    slug: "hampi-heritage-trail",
    title: "Hampi Heritage Trail",
    destination: "hampi",
    region: "Hampi · Anegundi · Sanapur",
    tagline: "Walk through a 14th-century empire, one boulder at a time.",
    summary:
      "Explore the ruins of the Vijayanagara Empire — a UNESCO World Heritage Site — with a local storyteller. Stone chariots, musical pillars, sunrise from Matanga Hill, coracle rides on the Tungabhadra and evenings at hippie-island cafés.",
    nights: 2,
    days: 3,
    price: 5999,
    originalPrice: 7499,
    rating: 4.9,
    reviews: 327,
    groupSize: "12 – 22 travellers",
    difficulty: "Moderate",
    bestTime: "October – February",
    pickup: "Bengaluru (overnight AC sleeper) · Hampi joining point: Hosapete",
    vibe: ["Heritage", "Sunrise treks", "Culture", "Photography"],
    image: media.hampi.hero,
    gallery: [media.hampi.hero, media.hampi.chariot, media.hampi.virupaksha, media.hampi.pushkarani, media.hampi.hemakuta, media.hampi.relief],
    highlights: [
      "The iconic Stone Chariot & musical pillars of Vittala Temple",
      "Sunrise from Matanga Hill over a sea of boulders",
      "Coracle ride on the Tungabhadra river",
      "Sunset at Hemakuta Hill overlooking Virupaksha Temple",
      "Climb 575 steps to Anjanadri — birthplace of Hanuman",
      "Guided storytelling walk with a local historian",
    ],
    itinerary: [
      {
        day: 1,
        title: "Sacred centre & Hemakuta sunset",
        description:
          "Arrive at Hosapete early morning and head to our stay. Begin at the 7th-century Virupaksha Temple, stroll Hampi Bazaar and end the day with a sunset on Hemakuta Hill.",
        activities: ["Virupaksha Temple", "Hampi Bazaar", "Kadalekalu & Sasivekalu Ganesha", "Hemakuta Hill sunset"],
        meals: "Breakfast, Dinner",
        stay: "Boutique homestay / resort, Hampi",
      },
      {
        day: 2,
        title: "Royal Hampi & the Stone Chariot",
        description:
          "A full day with our local guide: Vittala Temple and the Stone Chariot, the Royal Enclosure, Lotus Mahal, Elephant Stables, Queen's Bath and the stepped tank. Evening coracle ride.",
        activities: ["Vittala Temple & Stone Chariot", "Royal Enclosure & Mahanavami Dibba", "Lotus Mahal & Elephant Stables", "Coracle ride on Tungabhadra"],
        meals: "Breakfast, Dinner",
        stay: "Boutique homestay / resort, Hampi",
      },
      {
        day: 3,
        title: "Matanga sunrise, Anegundi & Sanapur",
        description:
          "Pre-dawn hike up Matanga Hill for the most magical sunrise in South India. Cross the river to Anegundi, climb Anjanadri Hill and chill at Sanapur Lake before departing.",
        activities: ["Matanga Hill sunrise hike", "Anegundi village", "Anjanadri Hill (575 steps)", "Sanapur Lake"],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "2 nights' stay (twin/triple sharing)",
      "Return AC sleeper travel from Bengaluru",
      "All local transfers & sightseeing",
      "Daily breakfast + 2 dinners",
      "Certified local guide for Day 2",
      "Coracle ride",
      "TLT trip captain",
    ],
    exclusions: ["Monument entry tickets (~₹40 for Indians)", "Lunch", "Personal expenses"],
    thingsToCarry: [...commonCarry, "Modest clothing for temples (shoulders & knees covered)", "Headlamp for sunrise hike"],
    departures: [
      { date: "2026-11-27", seatsLeft: 4 },
      { date: "2026-12-11", seatsLeft: 10 },
      { date: "2027-01-01", seatsLeft: 7 },
      { date: "2027-01-22", seatsLeft: 16 },
    ],
    faqs: [
      { q: "How much walking is involved?", a: "Around 6–10 km a day across mostly flat terrain, plus an optional sunrise hike. Moderate fitness is enough." },
      { q: "Is Hampi hot?", a: "Daytime can be warm even in winter — we plan sightseeing for mornings and late afternoons." },
    ],
    featured: true,
  },
  {
    slug: "hampi-backpacker-weekend",
    title: "Hampi Boulders & Cafés",
    destination: "hampi",
    region: "Hippie Island · Sanapur · Hampi",
    tagline: "Cycle, climb, cliff-jump and café-hop across a boulder wonderland.",
    summary:
      "The backpacker's Hampi. Cycling tours through banana plantations, beginner bouldering with a certified instructor, cliff-jumping at Sanapur, and lazy evenings at the iconic cafés across the river.",
    nights: 2,
    days: 3,
    price: 4999,
    originalPrice: 5999,
    rating: 4.8,
    reviews: 154,
    groupSize: "10 – 20 travellers",
    difficulty: "Active",
    bestTime: "October – February",
    pickup: "Bengaluru (overnight AC sleeper) · Hampi joining point: Hosapete",
    vibe: ["Adventure", "Backpacking", "Cafés", "Budget"],
    image: media.hampi.ruins,
    gallery: [media.hampi.ruins, media.hampi.chariot2, media.hampi.lakshmi, media.hampi.gopuram, media.hampi.hemakuta],
    highlights: [
      "Cycling tour of the ruins and banana plantations",
      "Beginner bouldering session with a certified instructor",
      "Cliff-jumping & coracle at Sanapur Lake",
      "Sunset at Hanuman Temple hill",
      "Hippie Island café crawl",
    ],
    itinerary: [
      {
        day: 1,
        title: "Hippie Island vibes",
        description: "Arrive, cross the river to Virupapur Gaddi (Hippie Island), check into our riverside stay and catch sunset from the rocks.",
        activities: ["Riverside check-in", "Café crawl", "Sunset rock session"],
        meals: "Dinner",
        stay: "Riverside cottages, Virupapur Gaddi",
      },
      {
        day: 2,
        title: "Cycle, climb & cliff-jump",
        description: "Morning cycling tour through the ruins, afternoon bouldering session, and an evening at Sanapur Lake for coracle rides and cliff-jumping (optional).",
        activities: ["Cycling heritage tour", "Bouldering session", "Sanapur Lake", "Bonfire night"],
        meals: "Breakfast, Dinner",
        stay: "Riverside cottages, Virupapur Gaddi",
      },
      {
        day: 3,
        title: "Sunrise & see you soon",
        description: "Sunrise at Anjanadri Hill, breakfast at a riverside café and departure.",
        activities: ["Anjanadri sunrise", "Riverside breakfast"],
        meals: "Breakfast",
      },
    ],
    inclusions: [
      "2 nights in riverside cottages",
      "Return AC sleeper travel from Bengaluru",
      "Bicycle rental & guided cycling tour",
      "Bouldering session with gear",
      "2 breakfasts + 2 dinners",
      "TLT trip captain",
    ],
    exclusions: ["Lunch", "Ferry tickets (~₹50)", "Personal expenses"],
    thingsToCarry: [...commonCarry, "Sports shoes with good grip", "Swimwear for Sanapur"],
    departures: [
      { date: "2026-12-04", seatsLeft: 11 },
      { date: "2027-01-08", seatsLeft: 13 },
    ],
    faqs: [
      { q: "Do I need climbing experience?", a: "No — the session is designed for complete beginners with a certified instructor and crash pads." },
      { q: "Is cliff-jumping compulsory?", a: "Never. All adventure activities are optional and supervised." },
    ],
  },
  {
    slug: "legend-circuit-hampi-goa",
    title: "The Legend Circuit",
    destination: "combo",
    region: "Hampi → Goa",
    tagline: "Ancient ruins to golden beaches — the ultimate South-West road trip.",
    summary:
      "Our flagship combo: two days among Hampi's boulders and temples, then a scenic drive through the Western Ghats to three days of Goa beaches and nightlife. The trip our community calls 'pure therapy'.",
    nights: 5,
    days: 6,
    price: 15999,
    originalPrice: 18999,
    rating: 5.0,
    reviews: 98,
    groupSize: "15 – 22 travellers",
    difficulty: "Moderate",
    bestTime: "November – February",
    pickup: "Bengaluru (overnight AC sleeper)",
    vibe: ["Road trip", "Heritage + Beaches", "Flagship", "Group trip"],
    image: media.hampi.pushkarani,
    gallery: [media.hampi.pushkarani, media.hampi.chariot, media.goa.vagator, media.goa.dusk, media.hampi.virupaksha, media.goa.palms],
    highlights: [
      "Best of Hampi: Stone Chariot, Virupaksha & Matanga sunrise",
      "Scenic Western Ghats road trip",
      "North Goa nightlife + South Goa hidden beaches",
      "Water sports & sunset cruise",
      "A community that lasts long after the trip",
    ],
    itinerary: [
      { day: 1, title: "Hampi sacred centre", description: "Virupaksha Temple, Hampi Bazaar and Hemakuta sunset.", activities: ["Virupaksha Temple", "Hampi Bazaar", "Hemakuta sunset"], meals: "Breakfast, Dinner", stay: "Resort, Hampi" },
      { day: 2, title: "Royal Hampi", description: "Vittala Temple, Stone Chariot, Royal Enclosure, Lotus Mahal and an evening coracle ride.", activities: ["Stone Chariot", "Royal Enclosure", "Coracle ride"], meals: "Breakfast, Dinner", stay: "Resort, Hampi" },
      { day: 3, title: "Sunrise & road to Goa", description: "Matanga Hill sunrise, then a scenic drive through the Ghats to North Goa. Beach evening.", activities: ["Matanga sunrise", "Western Ghats drive", "Baga beach evening"], meals: "Breakfast, Dinner", stay: "Beach resort, North Goa" },
      { day: 4, title: "North Goa", description: "Water sports, Anjuna, Vagator and Chapora Fort sunset.", activities: ["Water sports", "Anjuna & Vagator", "Chapora Fort"], meals: "Breakfast, Dinner", stay: "Beach resort, North Goa" },
      { day: 5, title: "Heritage & cruise", description: "Old Goa churches, Fontainhas and the Mandovi sunset cruise.", activities: ["Old Goa", "Fontainhas", "Sunset cruise"], meals: "Breakfast, Dinner", stay: "Beach resort, South Goa" },
      { day: 6, title: "South Goa & departure", description: "Palolem, Butterfly Beach boat ride and departure.", activities: ["Palolem", "Butterfly Beach", "Departure"], meals: "Breakfast" },
    ],
    inclusions: [
      "5 nights' stay (twin/triple sharing)",
      "Return AC sleeper travel from Bengaluru + Hampi → Goa transfer",
      "All local transfers in tempo traveller",
      "Daily breakfast + 5 dinners",
      "Hampi guide, coracle, water sports & cruise",
      "TLT trip captain",
    ],
    exclusions: ["Lunch", "Monument entries", "Personal expenses"],
    thingsToCarry: [...commonCarry, "Swimwear", "Modest clothing for temples"],
    departures: [
      { date: "2026-12-23", seatsLeft: 5 },
      { date: "2027-01-20", seatsLeft: 12 },
    ],
    faqs: [
      { q: "How long is the Hampi → Goa drive?", a: "About 6–7 hours with scenic stops through the Western Ghats." },
      { q: "Can I do only one leg?", a: "Yes — check out our Hampi Heritage Trail or Goa Beach Therapy trips." },
    ],
    featured: true,
  },
];

export const destinations = [
  {
    id: "goa" as const,
    name: "Goa",
    title: "Goa",
    blurb: "Golden beaches, Portuguese lanes, sunset cruises and nights that never end.",
    image: media.goa.palms,
    coords: { lat: 15.2993, lng: 74.124 },
  },
  {
    id: "hampi" as const,
    name: "Hampi",
    title: "Hampi",
    blurb: "A boulder-strewn kingdom of ruins, river crossings and sunrises worth waking up for.",
    image: media.hampi.chariot,
    coords: { lat: 15.335, lng: 76.46 },
  },
];

export function getTrip(slug: string) {
  return trips.find((t) => t.slug === slug);
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(
    new Date(`${iso}T00:00:00+05:30`),
  );
}

export const destinationLabel: Record<Destination, string> = {
  goa: "Goa",
  hampi: "Hampi",
  combo: "Hampi + Goa",
};
