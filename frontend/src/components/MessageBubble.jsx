import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Logo from "./Logo.jsx";

function useTypewriter(fullText, enabled) {
  const [shown, setShown] = useState(enabled ? "" : fullText);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setShown(fullText);
      return;
    }
    indexRef.current = 0;
    setShown("");

    const CHARS_PER_TICK = 4;
    const TICK_MS = 12;

    const interval = setInterval(() => {
      indexRef.current += CHARS_PER_TICK;
      if (indexRef.current >= fullText.length) {
        setShown(fullText);
        clearInterval(interval);
      } else {
        setShown(fullText.slice(0, indexRef.current));
      }
    }, TICK_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return shown;
}

export default function MessageBubble({ role, text, animate = false }) {
  const isUser = role === "user";
  const displayedText = useTypewriter(text, !isUser && animate);

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] md:max-w-[70%] rounded-2xl rounded-br-sm bg-navy text-paper px-4 py-3 text-sm md:text-base">
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-7 h-7 flex items-center justify-center mt-0.5 overflow-hidden">
        <img src="/logo.png" alt="AI" className="w-6 h-6 object-contain" />
      </div>
      <div className="ai-markdown flex-1 min-w-0 text-sm md:text-base">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText}</ReactMarkdown>
      </div>
    </div>
  );
}