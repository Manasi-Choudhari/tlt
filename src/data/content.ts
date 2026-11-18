export type Testimonial = {
  name: string;
  city: string;
  trip: string;
  rating: number;
  quote: string;
  tag?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Ananya Sharma",
    city: "Bengaluru",
    trip: "Goa Beach Therapy",
    rating: 5,
    quote:
      "I went solo, a little nervous, and came back with 20 new friends. The trip captain handled everything — I just had to show up and have fun. Actual therapy!",
    tag: "Solo traveller",
  },
  {
    name: "Rohit Menon",
    city: "Kochi",
    trip: "Hampi Heritage Trail",
    rating: 5,
    quote:
      "The Matanga Hill sunrise is something I'll never forget. Our guide made 600-year-old stones feel alive. Brilliantly organised from pickup to drop.",
    tag: "Photographer",
  },
  {
    name: "Sneha & Karthik",
    city: "Hyderabad",
    trip: "South Goa Serenity",
    rating: 5,
    quote:
      "We wanted Goa without the chaos and this was perfect. Cola beach kayaking and the silent-noise party were the highlights. Already booked Hampi!",
    tag: "Couple",
  },
  {
    name: "Aditya Rao",
    city: "Pune",
    trip: "The Legend Circuit",
    rating: 5,
    quote:
      "Six days, two completely different worlds. Ruins to beaches with a gang that genuinely felt like family. Worth every rupee and then some.",
    tag: "Repeat traveller",
  },
  {
    name: "Priya Nair",
    city: "Chennai",
    trip: "Hampi Boulders & Cafés",
    rating: 5,
    quote:
      "Bouldering for the first time, cycling through banana fields, cliff-jumping at Sanapur — this trip pushed me out of my comfort zone in the best way.",
    tag: "First-timer",
  },
  {
    name: "Vikram Singh",
    city: "Mumbai",
    trip: "Goa Beach Therapy",
    rating: 4,
    quote:
      "Stays were clean, food was great and the itinerary had the right balance of party and chill. The sunset cruise was a vibe. Would go again.",
    tag: "Friends group",
  },
  {
    name: "Meera Iyer",
    city: "Bengaluru",
    trip: "Hampi Heritage Trail",
    rating: 5,
    quote:
      "As a woman travelling alone, safety was my top concern. TLT made me feel completely at ease — female trip captain, verified stays, constant check-ins.",
    tag: "Solo female traveller",
  },
  {
    name: "Arjun & Team",
    city: "Bengaluru",
    trip: "Corporate offsite — Goa",
    rating: 5,
    quote:
      "TLT planned our 40-person team offsite end to end. Smooth logistics, fun activities and zero stress for HR. Our team still talks about it.",
    tag: "Corporate",
  },
];

export type Service = {
  icon: "users" | "map" | "calendar" | "briefcase" | "graduation" | "hotel" | "shield" | "mountain";
  title: string;
  description: string;
  points: string[];
};

export const services: Service[] = [
  {
    icon: "users",
    title: "Group Trips",
    description: "Fixed-departure trips with handpicked travellers, a trip captain and an itinerary that just works.",
    points: ["Solo-friendly rooming", "Curated group vibe", "All-inclusive pricing"],
  },
  {
    icon: "map",
    title: "Custom Itineraries",
    description: "Tell us your dates, budget and vibe — we'll design a trip that's 100% yours.",
    points: ["Personal trip designer", "Flexible dates", "Handpicked stays"],
  },
  {
    icon: "calendar",
    title: "Weekend Getaways",
    description: "Leave Friday night, return Monday morning recharged. Zero leaves, maximum therapy.",
    points: ["Overnight travel", "2N / 3D formats", "Budget friendly"],
  },
  {
    icon: "briefcase",
    title: "Corporate Offsites",
    description: "Team outings, offsites and retreats with activities that actually build bonds.",
    points: ["Team-building games", "Meeting-ready venues", "GST invoicing"],
  },
  {
    icon: "graduation",
    title: "College & Friends Trips",
    description: "Big group? We handle the chaos — transport, stays, food and fun for 10 to 100+ people.",
    points: ["Special group pricing", "Split payments", "Party-safe planning"],
  },
  {
    icon: "hotel",
    title: "Stays & Transport",
    description: "Verified hostels, resorts and homestays plus AC sleeper, tempo traveller and self-drive options.",
    points: ["Verified properties", "Doorstep pickups", "Bike & car rentals"],
  },
  {
    icon: "mountain",
    title: "Adventure Add-ons",
    description: "Scuba, parasailing, bouldering, kayaking, cliff-jumping and treks — with certified partners.",
    points: ["Certified instructors", "All safety gear", "Beginner friendly"],
  },
  {
    icon: "shield",
    title: "Safe Solo & Women Travel",
    description: "Female trip captains, verified stays and 24×7 support so everyone travels with confidence.",
    points: ["Female trip captains", "Same-gender rooming", "24×7 helpline"],
  },
];

export const faqs = [
  {
    q: "How do I book a trip?",
    a: "Pick a trip and departure date, fill the enquiry form or message us on WhatsApp. Pay a booking amount of ₹2,000 to lock your seat — the balance is due 7 days before departure.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancel 15+ days before departure for a full refund minus the booking amount. 7–14 days: 50% refund. Under 7 days: non-refundable, but you can transfer your seat to a friend or a future trip.",
  },
  {
    q: "Are your trips safe for solo and women travellers?",
    a: "Yes. Every trip has a trained trip captain, verified stays, same-gender room sharing and 24×7 support. Many departures have female trip captains.",
  },
  {
    q: "What age group travels with TLT?",
    a: "Most of our travellers are 18–35, but our community is open to every young-at-heart traveller. Custom trips work for families too.",
  },
  {
    q: "Can I join from a city other than Bengaluru?",
    a: "Yes. Choose the destination joining option — Mapusa/Margao for Goa or Hosapete for Hampi — and we'll adjust the price.",
  },
  {
    q: "Do you offer EMI or split payments?",
    a: "Yes, we support UPI, cards, net-banking and no-cost EMI on select cards. Groups can split payments individually.",
  },
];

export const values = [
  { title: "Community first", text: "Every trip is designed so strangers leave as friends. That's the 'C' in TLT." },
  { title: "Safety, always", text: "Verified stays, trained captains, emergency protocols and 24×7 support." },
  { title: "Local & responsible", text: "Local guides, homestays and businesses — and we leave every place cleaner than we found it." },
  { title: "Honest pricing", text: "What you see is what you pay. No hidden costs, no surprise add-ons." },
];
