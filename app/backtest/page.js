"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const BacktestChart = dynamic(() => import("@/components/BacktestChart"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] rounded-xl border border-base-line bg-base-surface flex items-center justify-center text-ink-muted text-sm">
      جاري تجهيز الشارت…
    </div>
  ),
});

export default function BacktestPage() {
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handleRoundEnd = useCallback((result) => {
    setScore((s) => ({
      correct: s.correct + (result.correct ? 1 : 0),
      total: s.total + 1,
    }));
  }, []);

  const accuracy = score.total ? Math.round((score.correct / score.total) * 100) : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div>
        <p className="tick-label text-xs text-brass mb-2">تدريب على التوقع · بيانات تاريخية حقيقية</p>
        <h1 className="font-display text-3xl text-ink mb-3">Backtesting: اختبر قراءتك</h1>
        <p className="text-ink-muted leading-relaxed max-w-2xl">
          يعرض لك التطبيق نقطة عشوائية من تاريخ السعر الحقيقي، ويطلب منك توقع
          الاتجاه القادم بناءً على ما تعلمته من هيكل السوق والسيولة. هذا تمرين
          لبناء حدسك، وليس أداة تنبؤ مضمونة — لا يوجد نموذج يتوقع السوق بشكل
          مؤكد.
        </p>
      </div>

      {score.total > 0 && (
        <div className="rounded-xl border border-base-line bg-base-surface p-4 flex items-center justify-around">
          <div className="text-center">
            <p className="tick-label text-xs text-ink-muted mb-1">الجولات</p>
            <p className="font-display text-xl text-ink">{score.total}</p>
          </div>
          <div className="text-center">
            <p className="tick-label text-xs text-ink-muted mb-1">التوقعات الصحيحة</p>
            <p className="font-display text-xl text-bull">{score.correct}</p>
          </div>
          <div className="text-center">
            <p className="tick-label text-xs text-ink-muted mb-1">نسبة الدقة</p>
            <p className="font-display text-xl text-brass">{accuracy}%</p>
          </div>
        </div>
      )}

      <BacktestChart onRoundEnd={handleRoundEnd} />

      <div className="rounded-xl border border-base-line bg-base-surface p-5">
        <p className="text-ink-faint text-xs leading-relaxed">
          تذكير: نسبة الدقة هنا لا تقارَن مباشرة بربحية استراتيجية حقيقية — في
          التداول الفعلي حتى توقع صحيح بنسبة 40% قد يكون مربحاً بنسبة R:R
          عالية، والعكس صحيح. الهدف من هذه الأداة تمرين عينك على قراءة السياق،
          وليس قياس جاهزيتك للتداول الحقيقي وحده.
        </p>
      </div>
    </div>
  );
}
