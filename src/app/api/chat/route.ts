import { localReply, tripsMentionedIn } from "@/lib/chat/engine";
import { buildSystemPrompt } from "@/lib/chat/knowledge";
import type { ChatMessage, ChatReply } from "@/lib/chat/types";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const MAX_MESSAGES = 12;
const MAX_CHARS = 600;

function sanitize(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const msgs = input
    .filter(
      (m): m is ChatMessage =>
        !!m && typeof m === "object" && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_MESSAGES);
  return msgs.length && msgs[msgs.length - 1].role === "user" ? msgs : null;
}

async function aiReply(messages: ChatMessage[]): Promise<ChatReply | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const base = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 450,
      messages: [{ role: "system", content: buildSystemPrompt() }, ...messages],
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const reply = json.choices?.[0]?.message?.content?.trim();
  if (!reply) return null;
  return { reply, trips: tripsMentionedIn(reply).slice(0, 3), source: "ai" };
}

export async function POST(req: Request) {
  if (!rateLimit(`chat:${clientIp(req)}`, 40, 5 * 60 * 1000)) {
    return Response.json({ reply: "You're chatting fast! Give me a moment and try again. 🙂" } satisfies ChatReply, { status: 429 });
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const messages = sanitize(body.messages);
  if (!messages) return Response.json({ error: "Invalid messages" }, { status: 400 });

  try {
    const ai = await aiReply(messages);
    if (ai) {
      const local = localReply(messages);
      return Response.json({ ...ai, suggestions: local.suggestions?.slice(0, 3) } satisfies ChatReply);
    }
  } catch (err) {
    console.error("[chat] AI provider failed, using local engine", err);
  }

  return Response.json({ ...localReply(messages), source: "local" } satisfies ChatReply);
}
