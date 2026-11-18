export type LeadType = "contact" | "enquiry" | "feedback" | "newsletter";

export async function submitLead(type: LeadType, data: Record<string, unknown>) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, ...data }),
  });
  const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong. Please try again.");
  return json;
}
