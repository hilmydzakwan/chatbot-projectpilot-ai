import { useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import MessageBubble from "./MessageBubble.jsx";
import EmptyState from "./EmptyState.jsx";
import QuickActions from "./QuickActions.jsx";

const MAX_TEXTAREA_HEIGHT = 200; // px, matches the note in App UX feedback

export default function ChatBox({ messages, isLoading, error, lastAiMessageId, onSend, onQuickAction }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function resizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput("");
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {messages.length === 0 ? (
          <EmptyState onAction={onQuickAction} />
        ) : (
          <div className="space-y-5 max-w-3xl mx-auto">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                role={m.role}
                text={m.text}
                animate={m.id === lastAiMessageId}
              />
            ))}

            {isLoading && (
              <p className="text-sm text-ink/45 italic flex items-center gap-2 pl-10">
                ProjectPilot sedang berpikir
                <span className="inline-flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-ink/40 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 rounded-full bg-ink/40 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 rounded-full bg-ink/40 animate-bounce" />
                </span>
              </p>
            )}

            {error && (
              <p className="text-sm text-redline pl-10">{error}</p>
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      <div className="border-t border-navy/10 bg-white/70 backdrop-blur-sm px-4 md:px-8 py-4">
        <div className="max-w-3xl mx-auto">
          {messages.length > 0 && (
            <div className="mb-3">
              <QuickActions onAction={onQuickAction} disabled={isLoading} />
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resizeTextarea();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
              rows={1}
              placeholder="Ask ProjectPilot..."
              className="flex-1 resize-none rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm md:text-base text-ink placeholder:text-ink/40 focus:border-redline outline-none disabled:opacity-60 overflow-y-auto"
              style={{ maxHeight: MAX_TEXTAREA_HEIGHT }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label={isLoading ? "AI sedang memproses" : "Kirim pesan"}
              className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                isLoading
                  ? "bg-navy/70 cursor-wait"
                  : "bg-navy hover:bg-navy-light disabled:opacity-40 disabled:cursor-not-allowed"
              } text-white`}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowUp size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}