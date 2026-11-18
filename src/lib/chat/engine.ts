import { trips, formatDate, formatPrice, destinationLabel, type Trip } from "@/data/trips";
import { faqs } from "@/data/content";
import { site } from "@/data/site";
import type { ChatMessage, ChatReply } from "./types";

// Rule-based travel assistant used when no LLM key is configured (and as a
// fallback). It only answers from TLT's own trip data and politely refuses
// anything that isn't travel related.

type Intent =
  | "greet"
  | "thanks"
  | "bye"
  | "price"
  | "itinerary"
  | "duration"
  | "dates"
  | "inclusions"
  | "exclusions"
  | "carry"
  | "bestTime"
  | "pickup"
  | "booking"
  | "cancellation"
  | "safety"
  | "group"
  | "contact"
  | "custom"
  | "recommend"
  | "highlights"
  | "compare"
  | "list"
  | "food"
  | "stay"
  | "activities"
  | "about";

const INTENTS: Record<Intent, RegExp> = {
  greet: /\b(hi+|hello|hey|hola|namaste|yo|good (morning|afternoon|evening))\b/,
  thanks: /\b(thanks?|thank you|thx|ty|great|awesome|cool|perfect)\b/,
  bye: /\b(bye|goodbye|see you|cya)\b/,
  price: /\b(price|prices|pricing|cost|costs|budget|how much|rate|rates|charges?|fees?|rupees?|inr|cheap|cheapest|expensive|afford|package cost)\b|₹/,
  itinerary: /\b(itinerary|itineraries|plan|schedule|day[- ]?wise|day \d|what (will|do) we do|places covered|cover|route|agenda)\b/,
  duration: /\b(how (many|long)|duration|days?|nights?)\b/,
  dates: /\b(dates?|departures?|when|upcoming|next (trip|batch)|batch(es)?|slots?|seats?|availability|available|december|january|february|march|november|weekend)\b/,
  inclusions: /\b(includ(e|es|ed|ing)|inclusions?|covered|what('s| is) (covered|included))\b/,
  exclusions: /\b(exclu(de|des|ded|sions?)|not included|extra cost|hidden)\b/,
  carry: /\b(carry|pack|packing|bring|luggage|clothes|wear|essentials)\b/,
  bestTime: /\b(best time|season|weather|monsoon|rain|rainy|temperature|climate|hot|cold|summer|winter)\b/,
  pickup: /\b(pick ?up|start(ing)? (point|from)|from (bangalore|bengaluru|mumbai|pune|hyderabad|chennai)|join(ing)?|boarding|bus|train|flight|travel from|transport)\b/,
  booking: /\b(book|booking|reserve|register|sign ?up|enrol|advance|pay|payment|emi|upi|token amount|confirm)\b/,
  cancellation: /\b(cancel|cancellation|refund|reschedule|postpone|transfer my seat)\b/,
  safety: /\b(safe|safety|secure|women|woman|female|girls?|solo|alone|single)\b/,
  group: /\b(group size|how many (people|travellers|members)|age|people|strangers|crowd|who travels)\b/,
  contact: /\b(contact|call|phone|number|whatsapp|email|mail|talk to|human|agent|representative|reach you|office)\b/,
  custom: /\b(custom|customi[sz]e|private|personali[sz]ed|tailor|corporate|offsite|office trip|college|family|honeymoon|friends trip)\b/,
  recommend: /\b(suggest|recommend|which (trip|one)|best trip|first time|confused|help me choose|should i|ideal|perfect for|couple|couples)\b/,
  highlights: /\b(highlights?|special|famous|must see|must-see|attractions?|places to visit|sightseeing|things to do|what to see)\b/,
  compare: /\b(vs|versus|compare|difference|better|or)\b/,
  list: /\b(all trips|trips|tours|packages|what do you offer|options|destinations)\b/,
  food: /\b(food|meals?|breakfast|lunch|dinner|veg|vegetarian|non[- ]?veg|jain|eat)\b/,
  stay: /\b(stay|hotel|hostel|resort|room|rooms|accommodation|homestay|sharing)\b/,
  activities: /\b(water ?sports?|parasailing|jet ?ski|scuba|snorkel|kayak|cruise|party|nightlife|club|trek|hike|bouldering|climb|coracle|cycl(e|ing)|cliff)\b/,
  about: /\b(who are you|about (you|tlt)|what is tlt|tlt community|legend travellers|your company)\b/,
};

const TRAVEL_HINT =
  /\b(trip|travel|tour|vacation|holiday|getaway|visit|destination|beach|temple|ruins|hotel|itinerary|goa|hampi|manali|kerala|ladakh|coorg|gokarna|pondicherry|rishikesh|kasol|meghalaya|andaman|backpack|sightseeing|journey|explore|weekend)\b/;

const OTHER_DESTINATIONS = /\b(manali|kerala|ladakh|leh|coorg|gokarna|pondicherry|pondy|rishikesh|kasol|spiti|meghalaya|andaman|ooty|munnar|kashmir|rajasthan|udaipur|jaipur|sikkim|darjeeling|bali|thailand|dubai|vietnam|europe|chikmagalur|wayanad)\b/;

const TRIP_MATCHERS: { slug: string; re: RegExp }[] = [
  { slug: "goa-beach-therapy", re: /\b(beach therapy|goa beach|north goa|signature goa)\b/ },
  { slug: "south-goa-serenity", re: /\b(serenity|south goa|palolem|agonda|quiet goa|calm goa)\b/ },
  { slug: "hampi-heritage-trail", re: /\b(heritage trail|hampi heritage|heritage)\b/ },
  { slug: "hampi-backpacker-weekend", re: /\b(boulders?|caf(e|é)s?|backpack(er|ing)?|hippie island|cycling)\b/ },
  { slug: "legend-circuit-hampi-goa", re: /\b(legend circuit|circuit|combo|both|hampi (and|\+|&) goa|goa (and|\+|&) hampi|road trip)\b/ },
];

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();

function detectTrips(text: string): Trip[] {
  const found = TRIP_MATCHERS.filter((m) => m.re.test(text)).map((m) => trips.find((t) => t.slug === m.slug)!);
  return Array.from(new Set(found));
}

function detectDestination(text: string): "goa" | "hampi" | "both" | undefined {
  const g = /\bgoa\b/.test(text);
  const h = /\bhampi\b/.test(text);
  if (g && h) return "both";
  if (g) return "goa";
  if (h) return "hampi";
}

function detectIntents(text: string) {
  return (Object.keys(INTENTS) as Intent[]).filter((k) => INTENTS[k].test(text));
}

function tripsFor(dest?: "goa" | "hampi" | "both") {
  if (!dest) return [];
  if (dest === "both") return trips.filter((t) => t.destination === "combo");
  return trips.filter((t) => t.destination === dest);
}

const line = (t: Trip) => `• **${t.title}** — ${t.nights}N/${t.days}D · from ${formatPrice(t.price)}`;

function upcoming(t: Trip, n = 3) {
  return t.departures
    .slice(0, n)
    .map((d) => `${formatDate(d.date)} (${d.seatsLeft} seats left)`)
    .join(", ");
}

function answerForTrip(intent: Intent, t: Trip): string | undefined {
  switch (intent) {
    case "price":
      return `**${t.title}** costs **${formatPrice(t.price)}** per person${t.originalPrice ? ` (regular ${formatPrice(t.originalPrice)})` : ""} on twin/triple sharing, including return travel from Bengaluru. Joining directly at the destination is cheaper — just ask!\n\nBook with a ₹2,000 token amount; the balance is due 7 days before departure.`;
    case "itinerary":
      return `Here's the day-wise plan for **${t.title}** (${t.nights}N/${t.days}D):\n\n${t.itinerary
        .map((d) => `**Day ${d.day}: ${d.title}** — ${d.activities.join(", ")}`)
        .join("\n")}\n\nWant the full details? Open the trip page below.`;
    case "duration":
      return `**${t.title}** is **${t.nights} nights / ${t.days} days**, plus overnight travel from Bengaluru.`;
    case "dates":
      return `Upcoming departures for **${t.title}**: ${upcoming(t, 4)}.\n\nSeats fill fast — lock yours with a ₹2,000 token.`;
    case "inclusions":
      return `**${t.title}** includes:\n${t.inclusions.map((i) => `• ${i}`).join("\n")}`;
    case "exclusions":
      return `Not included in **${t.title}**:\n${t.exclusions.map((i) => `• ${i}`).join("\n")}`;
    case "carry":
      return `Packing list for **${t.title}**:\n${t.thingsToCarry.map((i) => `• ${i}`).join("\n")}`;
    case "bestTime":
      return `The best time for **${t.title}** is **${t.bestTime}**. All our departures are scheduled in the ideal season.`;
    case "pickup":
      return `**Pickup:** ${t.pickup}.`;
    case "group":
      return `**${t.title}** runs with **${t.groupSize}**, mostly aged 18–35 — and solo travellers are always welcome.`;
    case "highlights":
    case "activities":
      return `Highlights of **${t.title}**:\n${t.highlights.map((h) => `• ${h}`).join("\n")}`;
    case "food":
      return `Meals on **${t.title}**: ${t.itinerary
        .filter((d) => d.meals)
        .map((d) => `Day ${d.day} – ${d.meals}`)
        .join(" · ")}. Veg & non-veg options are always available; tell us about allergies or Jain food in advance.`;
    case "stay":
      return `Stays on **${t.title}**: ${Array.from(new Set(t.itinerary.map((d) => d.stay).filter(Boolean))).join(" → ")}. Rooms are twin/triple sharing with same-gender roommates.`;
  }
}

const DEST_INFO = {
  goa: `**Goa** is our beach therapy! Think golden beaches, Portuguese lanes in Fontainhas, UNESCO churches in Old Goa, water sports, sunset cruises and legendary nightlife in the North — plus hidden, quiet coves like Palolem, Cola and Butterfly Beach in the South. Best time: **October – March**.`,
  hampi: `**Hampi** is a UNESCO World Heritage Site — the ruins of the 14th-century Vijayanagara Empire, set in a surreal landscape of giant boulders. Highlights: the Stone Chariot at Vittala Temple, Virupaksha Temple, Matanga Hill sunrise, coracle rides on the Tungabhadra and Hippie Island cafés. Best time: **October – February**.`,
};

const DEFAULT_SUGGESTIONS = ["Show all trips", "Goa trip price", "Hampi itinerary", "Upcoming dates"];

export function localReply(messages: ChatMessage[]): ChatReply {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = norm(lastUser?.content ?? "");
  if (!text) return { reply: "Ask me anything about our trips!", suggestions: DEFAULT_SUGGESTIONS };

  const intents = detectIntents(text);
  let mentioned = detectTrips(text);
  const dest = detectDestination(text);

  // Carry trip context from earlier in the conversation ("what's the price?").
  let context: Trip[] = [];
  let contextDest: typeof dest;
  if (!mentioned.length && !dest) {
    for (const m of [...messages].reverse().slice(1)) {
      const t = norm(m.content);
      const prev = detectTrips(t);
      if (prev.length) {
        context = prev.slice(0, 1);
        break;
      }
      const d = detectDestination(t);
      if (d) {
        contextDest = d;
        break;
      }
    }
  }

  if (!mentioned.length && dest) mentioned = tripsFor(dest);
  const scoped = mentioned.length ? mentioned : context.length ? context : tripsFor(contextDest);
  const topical = intents.filter((i) => !["greet", "thanks", "bye", "compare"].includes(i));

  // Off-topic guard
  if (!topical.length && !mentioned.length && !dest && !TRAVEL_HINT.test(text)) {
    if (intents.includes("greet"))
      return {
        reply: `Hey there, legend! 👋 I'm **Tara**, TLT's travel assistant. I can help with trip details, itineraries, prices, dates, packing lists and bookings for our **Goa** and **Hampi** trips. What are you dreaming of?`,
        suggestions: DEFAULT_SUGGESTIONS,
      };
    if (intents.includes("thanks"))
      return { reply: "Anytime! 🧡 Anything else about your trip I can help with?", suggestions: ["Upcoming dates", "How do I book?"] };
    if (intents.includes("bye"))
      return { reply: "Happy travels! Come back whenever you're ready for some therapy. 🌴", suggestions: [] };
    return {
      reply:
        "I'm TLT's travel assistant, so I can only help with **trips, itineraries, bookings and travel tips** for our journeys. Try asking about our Goa or Hampi trips, prices, dates or what to pack!",
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  if (OTHER_DESTINATIONS.test(text) && !dest) {
    return {
      reply: `Right now our fixed group departures are to **Goa** and **Hampi** — more destinations are coming soon! 🗺️\n\nWe can also design a **custom / private trip** almost anywhere in India. Share your dates and budget on WhatsApp (${site.phone}) or the contact form and our trip designers will build it for you.`,
      suggestions: ["Show all trips", "Custom trip", "Contact the team"],
    };
  }

  if (intents.includes("about")) {
    return {
      reply: `**TLT Community — The Legend Travellers Community** is a travel community that runs curated group trips, custom itineraries, weekend getaways and corporate offsites. Our philosophy: **Trip. Travel. Therapy.** — come as strangers, leave as family.`,
      suggestions: ["Show all trips", "Is it safe for solo travellers?"],
    };
  }

  // Generic policy intents that don't depend on a trip
  if (intents.includes("cancellation")) {
    return { reply: faqs[1].a, suggestions: ["How do I book?", "Upcoming dates"] };
  }
  if (intents.includes("booking") && !intents.includes("price")) {
    return {
      reply: `Booking is easy:\n• Pick your trip & departure date\n• Fill the enquiry form on the trip page or WhatsApp us at **${site.phone}**\n• Pay a **₹2,000 token** to lock your seat (UPI, cards, net-banking, EMI)\n• Balance is due 7 days before departure\n\nYou'll get a WhatsApp group with your trip captain a few days before the trip.`,
      trips: scoped.slice(0, 2).map((t) => t.slug),
      suggestions: ["Cancellation policy", "Upcoming dates"],
    };
  }
  if (intents.includes("safety")) {
    return { reply: `${faqs[2].a}\n\nOver 60% of our travellers come solo — you'll fit right in.`, suggestions: ["Show all trips", "Group size"] };
  }
  if (intents.includes("contact")) {
    return {
      reply: `You can reach the TLT team at:\n• **Phone / WhatsApp:** ${site.phone}\n• **Email:** ${site.email}\n• **Hours:** ${site.hours}\n\nOr use the contact page — we reply within 2–4 working hours.`,
      suggestions: ["How do I book?"],
    };
  }
  if (intents.includes("custom")) {
    return {
      reply: `Yes! We design **custom & private trips** for friends, couples, families, colleges and **corporate offsites** — any group size from 2 to 200+. Tell us your dates, budget and vibe via the contact form or WhatsApp and we'll send a tailored itinerary within 24 hours.`,
      suggestions: ["Contact the team", "Show all trips"],
    };
  }

  // Compare Goa vs Hampi
  if (dest === "both" && (intents.includes("compare") || intents.includes("recommend"))) {
    return {
      reply: `Both are amazing, just different vibes:\n• **Goa** — beaches, water sports, nightlife, sunsets & cafés. Perfect to unwind and party.\n• **Hampi** — ancient ruins, boulders, sunrise hikes & river crossings. Perfect for culture, photography & adventure.\n\nCan't choose? **The Legend Circuit** covers both in 6 days.`,
      trips: ["legend-circuit-hampi-goa", "goa-beach-therapy", "hampi-heritage-trail"],
    };
  }

  // Recommendations
  if (intents.includes("recommend") && !mentioned.length) {
    let picks = trips.filter((t) => t.featured);
    let why = "Here are our most-loved trips:";
    if (/\b(couple|couples|quiet|calm|chill|relax|peace)\b/.test(text)) {
      picks = trips.filter((t) => ["south-goa-serenity", "hampi-heritage-trail"].includes(t.slug));
      why = "For a relaxed, couple-friendly vibe I'd suggest:";
    } else if (/\b(adventure|thrill|active|budget|cheap|backpack)\b/.test(text)) {
      picks = trips.filter((t) => ["hampi-backpacker-weekend", "goa-beach-therapy"].includes(t.slug));
      why = "For adventure on a budget, try:";
    } else if (/\b(party|nightlife|friends|fun)\b/.test(text)) {
      picks = trips.filter((t) => ["goa-beach-therapy", "legend-circuit-hampi-goa"].includes(t.slug));
      why = "For max fun with your gang:";
    } else if (/\b(first time|solo)\b/.test(text)) {
      picks = trips.filter((t) => ["goa-beach-therapy", "hampi-heritage-trail"].includes(t.slug));
      why = "Perfect for a first trip with us:";
    }
    return { reply: `${why}\n${picks.map(line).join("\n")}`, trips: picks.map((t) => t.slug), suggestions: ["Compare Goa vs Hampi", "Upcoming dates"] };
  }

  // Trip-specific intents
  const tripIntents = topical.filter((i) =>
    ["price", "itinerary", "duration", "dates", "inclusions", "exclusions", "carry", "bestTime", "pickup", "group", "highlights", "activities", "food", "stay"].includes(i),
  ) as Intent[];

  if (scoped.length === 1 && tripIntents.length) {
    const t = scoped[0];
    const parts = tripIntents
      .slice(0, 2)
      .map((i) => answerForTrip(i, t))
      .filter(Boolean);
    if (parts.length) return { reply: parts.join("\n\n"), trips: [t.slug], suggestions: followUps(tripIntents[0]) };
  }

  if (scoped.length > 1 && tripIntents.length) {
    const i = tripIntents[0];
    if (i === "price" || i === "duration" || i === "dates") {
      const body = scoped
        .map((t) => (i === "dates" ? `• **${t.title}** — ${upcoming(t, 2)}` : line(t)))
        .join("\n");
      const label = dest && dest !== "both" ? destinationLabel[dest] : "our";
      return {
        reply: `Here are ${label} trips:\n${body}\n\nTell me which one you like and I'll share the full itinerary.`,
        trips: scoped.map((t) => t.slug),
        suggestions: scoped.slice(0, 2).map((t) => `${t.title} itinerary`),
      };
    }
    if (i === "bestTime" && dest && dest !== "both") {
      return { reply: DEST_INFO[dest], trips: scoped.map((t) => t.slug) };
    }
    return {
      reply: `We have ${scoped.length} options — which one are you interested in?\n${scoped.map(line).join("\n")}`,
      trips: scoped.map((t) => t.slug),
      suggestions: scoped.map((t) => `${t.title} ${i === "itinerary" ? "itinerary" : "details"}`),
    };
  }

  if (tripIntents.length && !scoped.length) {
    const i = tripIntents[0];
    if (i === "bestTime") {
      return { reply: `${DEST_INFO.goa}\n\n${DEST_INFO.hampi}`, suggestions: ["Goa trips", "Hampi trips"] };
    }
    if (i === "pickup") {
      return {
        reply: `All our trips start from **Bengaluru** with overnight AC sleeper travel. You can also join directly — **Mapusa/Margao** for Goa and **Hosapete** for Hampi — at a lower price. Coming from Mumbai, Pune or Hyderabad? We'll help you plan the connection.`,
        suggestions: ["Show all trips"],
      };
    }
    if (i === "dates") {
      return {
        reply: `Upcoming departures:\n${trips.map((t) => `• **${t.title}** — ${upcoming(t, 2)}`).join("\n")}\n\nSeats are limited per batch, so lock yours early!`,
        trips: trips.filter((t) => t.featured).map((t) => t.slug),
        suggestions: ["How do I book?", "Goa trip price", "Hampi trip price"],
      };
    }
    if (i === "group") {
      return {
        reply: `Our group trips usually have **10–25 travellers**, mostly aged 18–35, and over 60% join solo. ${faqs[3].a}`,
        suggestions: ["Is it safe for solo travellers?", "Show all trips"],
      };
    }
    if (i === "food") {
      return {
        reply: "Breakfast and most dinners are included on every trip, with veg & non-veg options. Jain or allergy-specific meals can be arranged — just tell us while booking. Lunches are kept flexible so you can try local cafés and shacks!",
        suggestions: ["What's included?", "Show all trips"],
      };
    }
    if (i === "stay") {
      return {
        reply: "We stay in verified beach-side hostels/resorts in Goa and boutique homestays or riverside cottages in Hampi — clean, safe and full of character. Rooms are twin/triple sharing with same-gender roommates; private rooms available on request.",
        suggestions: ["Show all trips", "What's the price?"],
      };
    }
    if (i === "carry") {
      return {
        reply: `General packing list:\n${trips[0].thingsToCarry.slice(0, 6).map((x) => `• ${x}`).join("\n")}\n\nFor Goa add swimwear; for Hampi add modest temple clothing and a headlamp for sunrise hikes.`,
        suggestions: ["Goa trips", "Hampi trips"],
      };
    }
    return {
      reply: `Here are all our current trips:\n${trips.map(line).join("\n")}\n\nWhich one should I tell you more about?`,
      trips: trips.map((t) => t.slug),
      suggestions: ["Goa trips", "Hampi trips", "Compare Goa vs Hampi"],
    };
  }

  if (dest && dest !== "both") {
    return {
      reply: `${DEST_INFO[dest]}\n\nOur ${destinationLabel[dest]} trips:\n${scoped.map(line).join("\n")}`,
      trips: scoped.map((t) => t.slug),
      suggestions: [`${destinationLabel[dest]} trip price`, "Upcoming dates", "What to pack?"],
    };
  }

  if (scoped.length === 1) {
    const t = scoped[0];
    return {
      reply: `**${t.title}** — ${t.tagline}\n\n${t.summary}\n\n${t.nights}N/${t.days}D · from **${formatPrice(t.price)}** · ⭐ ${t.rating} (${t.reviews} reviews)`,
      trips: [t.slug],
      suggestions: [`${t.title} itinerary`, "Upcoming dates", "What's included?"],
    };
  }

  return {
    reply: `Here's everything we're running right now:\n${trips.map(line).join("\n")}\n\nAsk me about prices, itineraries, dates, inclusions or packing for any of these!`,
    trips: trips.filter((t) => t.featured).map((t) => t.slug),
    suggestions: DEFAULT_SUGGESTIONS,
  };
}

function followUps(i: Intent): string[] {
  const map: Partial<Record<Intent, string[]>> = {
    price: ["What's included?", "Upcoming dates", "How do I book?"],
    itinerary: ["What's the price?", "What to pack?", "Upcoming dates"],
    dates: ["How do I book?", "What's the price?"],
    inclusions: ["What's not included?", "Upcoming dates"],
  };
  return map[i] ?? ["Itinerary", "Price", "How do I book?"];
}

export function tripsMentionedIn(text: string) {
  const t = norm(text);
  return trips.filter((trip) => t.includes(trip.title.toLowerCase())).map((trip) => trip.slug);
}
