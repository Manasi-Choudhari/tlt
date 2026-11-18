export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatReply = {
  reply: string;
  trips?: string[];
  suggestions?: string[];
  source?: "ai" | "local";
};
