import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Bot, MessageCircle, Send, X, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { UserAuth } from "@/context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

type ChatRole = "user" | "model";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

const WELCOME_TEXT =
  "Hi — I’m Dimon, your Finora assistant. Ask me about trading ideas, the app, or how to journal better. I’ll keep answers short.";

export function DimonChat() {
  const auth = UserAuth();
  const userId = auth?.session?.user?.id as string | undefined;

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  /** Only user/model pairs sent to Gemini — welcome is UI-only so the API always starts with a user turn. */
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, open, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };

    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const payload = [...messages, userMsg].map((m) => ({
      role: m.role,
      text: m.text,
    }));

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/dimon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payload,
          ...(userId ? { user_id: userId } : {}),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errText =
          typeof data?.error === "string" ? data.error : "Something went wrong. Try again.";
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "model",
            text: errText,
          },
        ]);
        return;
      }

      const reply = String(data.reply || "").trim() || "No reply received.";
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "model",
          text: reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "model",
          text: "Network error — is the API running on port 5001?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, userId]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <>
      <Button
        type="button"
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "border border-primary/30",
        )}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Dimon chat" : "Open Dimon chat"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 flex w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-xl border border-border bg-card/95 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out",
          open
            ? "pointer-events-auto max-h-[min(580px,85vh)] translate-x-0 opacity-100"
            : "pointer-events-none max-h-0 translate-x-3 opacity-0",
        )}
        style={{ boxShadow: "0 25px 50px -12px hsl(var(--foreground) / 0.15)" }}
      >
        <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Bot className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">Dimon</p>
            <p className="truncate text-xs text-muted-foreground">Finora assistant · Gemini</p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="h-[min(380px,50vh)] overflow-y-auto px-3 py-3"
        >
          <div className="space-y-3 pr-1">
            {messages.length === 0 && (
              <div className="flex justify-start">
                <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-border/60 bg-muted/80 px-3 py-2 text-sm leading-relaxed text-foreground">
                  <p className="whitespace-pre-wrap break-words">{WELCOME_TEXT}</p>
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted/80 text-foreground rounded-bl-md border border-border/60",
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">
                    <ReactMarkdown
                      components={{
                        ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                        li: ({ children }) => <li>{children}</li>,
                        strong: ({ children }) => <span className="font-semibold">{children}</span>,
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border/60 bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Dimon is thinking…
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border bg-card/80 p-3">
          <Textarea
            placeholder="Message Dimon…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            className="min-h-[72px] resize-none border-border bg-background/80 text-sm"
            disabled={loading}
          />
          <div className="mt-2 flex justify-end">
            <Button type="button" size="sm" onClick={() => void send()} disabled={loading || !input.trim()}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
