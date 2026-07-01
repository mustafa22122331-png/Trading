"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ChatPanel from "@/components/ChatPanel";

const TradingChart = dynamic(() => import("@/components/TradingChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] rounded-xl border border-base-line bg-base-surface flex items-center justify-center text-ink-muted text-sm">
      جاري تجهيز الشارت…
    </div>
  ),
});

export default function PracticePage() {
  const [chartInfo, setChartInfo] = useState(null);
  const [notes, setNotes] = useState("");
  const [reviewRequest, setReviewRequest] = useState(null);

  const handleDataChange = useCallback((info) => setChartInfo(info), []);

  const context = useMemo(() => {
    if (!chartInfo) return undefined;
    const { symbol, interval, last } = chartInfo;
    return `المستخدم يتدرب على شارت ${symbol} فريم ${interval}. آخر شمعة: افتتاح ${last?.open}, أعلى ${last?.high}, أدنى ${last?.low}, إغلاق ${last?.close}. اعتبر هذا سياقاً فقط عند مراجعة تحليل المستخدم، ولا تُصدر توصية تنفيذ مباشرة.`;
  }, [chartInfo]);

  function sendForReview() {
    if (!notes.trim()) return;
    setReviewRequest(
      `هذا تحليلي لهذا الشارت، راجعه من منظور ICT/SMC ووضّح نقاط القوة والضعف فيه:\n\n${notes.trim()}`
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div>
        <p className="tick-label text-xs text-brass mb-2">تدريب عملي · بيانات حقيقية من Binance</p>
        <h1 className="font-display text-3xl text-ink mb-3">تدرّب بدون مخاطرة</h1>
        <p className="text-ink-muted leading-relaxed max-w-2xl">
          حلّل الشارت بنفسك: حدد الاتجاه، السيولة المحتملة، ومناطق الاهتمام. اكتب
          ملاحظاتك، ثم اطلب من المرشد الذكي مراجعة منطقك — هذا تدريب تعليمي فقط
          وليس توصية تنفيذ حقيقية.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        <div className="space-y-4">
          <TradingChart onDataChange={handleDataChange} />

          <div className="rounded-xl border border-base-line bg-base-surface p-5 space-y-3">
            <p className="tick-label text-xs text-brass">دفتر ملاحظاتك</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="مثال: الاتجاه العام صاعد على الفريم الأكبر، أرى قمة وقاع متساويين تقريباً هنا مما يشير لسيولة محتملة، وهناك أوردر بلوك عند..."
              className="w-full bg-base-raised rounded-md p-4 text-sm text-ink placeholder:text-ink-faint outline-none focus:ring-1 focus:ring-brass/50 resize-none"
            />
            <button
              onClick={sendForReview}
              disabled={!notes.trim()}
              className="px-5 py-2.5 rounded-md bg-brass text-base text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brass-light transition-colors"
            >
              اطلب مراجعة المرشد الذكي
            </button>
          </div>
        </div>

        <ChatPanel
          key={reviewRequest || "empty"}
          context={context}
          placeholder="اسأل عن هذا الشارت أو أي مفهوم متعلق به…"
          autoSendText={reviewRequest}
          initialAssistantMessage={
            reviewRequest
              ? undefined
              : "أهلاً! حلّل الشارت المقابل واكتب ملاحظاتك، ثم اضغط 'اطلب مراجعة المرشد الذكي' لأراجع تحليلك معك."
          }
        />
      </div>
    </div>
  );
}
