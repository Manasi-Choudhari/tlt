import { clientIp, rateLimit } from "@/lib/rate-limit";
import { site } from "@/data/site";

const TYPES = ["contact", "enquiry", "feedback", "newsletter"] as const;
type LeadType = (typeof TYPES)[number];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[0-9+\-\s()]{8,16}$/;

const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function validate(body: Record<string, unknown>) {
  const type = body.type as LeadType;
  if (!TYPES.includes(type)) return { error: "Invalid form type." };

  const lead = {
    type,
    name: clean(body.name, 80),
    email: clean(body.email, 120).toLowerCase(),
    phone: clean(body.phone, 20),
    trip: clean(body.trip, 120),
    travellers: clean(String(body.travellers ?? ""), 4),
    dates: clean(body.dates, 60),
    message: clean(body.message, 1500),
    rating: typeof body.rating === "number" ? Math.min(5, Math.max(1, Math.round(body.rating))) : undefined,
    publish: body.publish === "yes",
  };

  if (!EMAIL.test(lead.email)) return { error: "Please enter a valid email address." };
  if (type !== "newsletter" && lead.name.length < 2) return { error: "Please enter your name." };
  if ((type === "contact" || type === "enquiry") && !PHONE.test(lead.phone)) return { error: "Please enter a valid phone number." };
  if (type === "feedback" && lead.message.length < 10) return { error: "Please tell us a little more (10+ characters)." };
  return { lead };
}

type Lead = NonNullable<ReturnType<typeof validate>["lead"]>;

function toText(lead: Lead) {
  return Object.entries(lead)
    .filter(([, v]) => v !== "" && v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

async function deliver(lead: Lead) {
  const tasks: Promise<unknown>[] = [];

  if (process.env.LEADS_WEBHOOK_URL) {
    tasks.push(
      fetch(process.env.LEADS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString(), source: site.url }),
      }),
    );
  }

  if (process.env.RESEND_API_KEY && process.env.LEADS_TO_EMAIL) {
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.LEADS_FROM_EMAIL ?? "TLT Website <onboarding@resend.dev>",
          to: process.env.LEADS_TO_EMAIL.split(","),
          reply_to: lead.email,
          subject: `New ${lead.type} — ${lead.name || lead.email}${lead.trip ? ` · ${lead.trip}` : ""}`,
          text: toText(lead),
        }),
      }),
    );
  }

  if (tasks.length === 0) {
    console.info(`[lead] ${lead.type}\n${toText(lead)}`);
    return;
  }

  const results = await Promise.allSettled(tasks);
  const failed = results.filter(
    (r) => r.status === "rejected" || (r.status === "fulfilled" && r.value instanceof Response && !r.value.ok),
  );
  if (failed.length === results.length) throw new Error("All lead destinations failed");
}

export async function POST(req: Request) {
  if (!rateLimit(`lead:${clientIp(req)}`, 8, 10 * 60 * 1000)) {
    return Response.json({ ok: false, error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields, humans don't.
  if (clean(body.company)) return Response.json({ ok: true });

  const { lead, error } = validate(body);
  if (!lead) return Response.json({ ok: false, error }, { status: 422 });

  try {
    await deliver(lead);
  } catch (err) {
    console.error("[lead] delivery failed", err);
    return Response.json({ ok: false, error: "We couldn't send that right now. Please WhatsApp us instead." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
