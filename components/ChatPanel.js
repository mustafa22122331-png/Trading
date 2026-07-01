"use client";

import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "وضّح لي الفرق بين BOS وCHoCH بمثال بسيط",
  "كيف أحدد الأوردر بلوك الصحيح على شارت 15 دقيقة؟",
  "ما هي أفضل طريقة لإدارة المخاطر لحساب صغير؟",
  "اشرح لي نموذج Power of Three بخطوات عملية",
];

export default function ChatPanel({
  context,
  placeholder,
  initialAssistantMessage,
  autoSendText,
}) {
  const [messages, setMessages] = useState(() =>
    initialAssistantMessage
      ? [{ role: "assistant", content: initialAssistantMessage }]
      : []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (autoSendText) send(autoSendText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSendText]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "حدث خطأ غير متوقع.");
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch (e) {
      setError("تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مجدداً.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-base-line bg-base-surface overflow-hidden h-[560px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <p className="text-ink-muted text-sm">
              اسأل المرشد عن أي مفهوم في المنهج، أو الصق تحليلك الخاص لمراجعته.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-right text-sm rounded-md border border-base-line px-3 py-2.5 text-ink-muted hover:border-brass/40 hover:text-ink transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-brass/15 text-ink mr-0 ml-auto"
                : "bg-base-raised text-ink/90"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="bg-base-raised text-ink-muted text-sm rounded-lg px-4 py-3 w-fit">
            <span className="tick-label animate-pulse">المرشد يكتب…</span>
          </div>
        )}

        {error && (
          <div className="bg-bear/10 border border-bear/30 text-bear text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-base-line p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={placeholder || "اكتب سؤالك هنا…"}
          className="flex-1 bg-base-raised rounded-md px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none focus:ring-1 focus:ring-brass/50"
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 rounded-md bg-brass text-base text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brass-light transition-colors"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
