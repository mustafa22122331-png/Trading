"use client";

import { useMemo, useState } from "react";

export default function CalculatorPage() {
  const [capital, setCapital] = useState(1000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [entry, setEntry] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [direction, setDirection] = useState("buy");

  const result = useMemo(() => {
    const cap = Number(capital);
    const risk = Number(riskPercent);
    const e = Number(entry);
    const sl = Number(stopLoss);
    const tp = Number(takeProfit);

    if (!cap || !risk || !e || !sl) return null;

    const stopDistance = direction === "buy" ? e - sl : sl - e;
    if (stopDistance <= 0) return { error: "وقف الخسارة يجب أن يكون بالاتجاه الصحيح مقارنة بالدخول." };

    const riskAmount = (cap * risk) / 100;
    const positionSize = riskAmount / stopDistance;

    let rr = null;
    if (tp) {
      const rewardDistance = direction === "buy" ? tp - e : e - tp;
      if (rewardDistance > 0) rr = +(rewardDistance / stopDistance).toFixed(2);
    }

    return {
      riskAmount: +riskAmount.toFixed(2),
      stopDistance: +stopDistance.toFixed(5),
      positionSize: +positionSize.toFixed(4),
      rr,
    };
  }, [capital, riskPercent, entry, stopLoss, takeProfit, direction]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <div>
        <p className="tick-label text-xs text-brass mb-2">أداة تنفيذية</p>
        <h1 className="font-display text-3xl text-ink mb-3">حاسبة حجم الصفقة</h1>
        <p className="text-ink-muted leading-relaxed max-w-2xl">
          حدد حجم صفقتك بدقة بناءً على رأس مالك ونسبة المخاطرة المسموحة، بدل
          التخمين. أدخل بياناتك وشاهد النتيجة فوراً.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="rounded-xl border border-base-line bg-base-surface p-6 space-y-5">
          <div>
            <label className="tick-label text-xs text-ink-muted block mb-2">رأس المال ($)</label>
            <input
              type="number"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              className="w-full bg-base-raised rounded-md p-3 text-ink outline-none focus:ring-1 focus:ring-brass/50"
            />
          </div>

          <div>
            <label className="tick-label text-xs text-ink-muted block mb-2">
              نسبة المخاطرة (%) — يُنصح 0.5% إلى 2%
            </label>
            <input
              type="number"
              step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
              className="w-full bg-base-raised rounded-md p-3 text-ink outline-none focus:ring-1 focus:ring-brass/50"
            />
          </div>

          <div>
            <label className="tick-label text-xs text-ink-muted block mb-2">اتجاه الصفقة</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDirection("buy")}
                className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  direction === "buy" ? "bg-bull text-base" : "border border-base-line text-ink-muted"
                }`}
              >
                شراء
              </button>
              <button
                onClick={() => setDirection("sell")}
                className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  direction === "sell" ? "bg-bear text-base" : "border border-base-line text-ink-muted"
                }`}
              >
                بيع
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="tick-label text-xs text-ink-muted block mb-2">سعر الدخول</label>
              <input
                type="number"
                step="any"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                className="w-full bg-base-raised rounded-md p-3 text-ink outline-none focus:ring-1 focus:ring-brass/50"
              />
            </div>
            <div>
              <label className="tick-label text-xs text-ink-muted block mb-2">وقف الخسارة</label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full bg-base-raised rounded-md p-3 text-ink outline-none focus:ring-1 focus:ring-brass/50"
              />
            </div>
            <div>
              <label className="tick-label text-xs text-ink-muted block mb-2">
                جني الأرباح (اختياري)
              </label>
              <input
                type="number"
                step="any"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full bg-base-raised rounded-md p-3 text-ink outline-none focus:ring-1 focus:ring-brass/50"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-base-line bg-base-surface p-6 space-y-5">
          <p className="tick-label text-xs text-brass">النتيجة</p>

          {!result && (
            <p className="text-ink-faint text-sm leading-relaxed">
              أدخل رأس المال، نسبة المخاطرة، سعر الدخول ووقف الخسارة لحساب حجم
              الصفقة.
            </p>
          )}

          {result?.error && <p className="text-bear text-sm">{result.error}</p>}

          {result && !result.error && (
            <div className="space-y-4">
              <div className="hairline" />
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted text-sm">المبلغ المعرّض للمخاطرة</span>
                <span className="tick-label text-lg text-ink">${result.riskAmount}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted text-sm">مسافة وقف الخسارة</span>
                <span className="tick-label text-lg text-ink">{result.stopDistance}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-ink-muted text-sm">حجم الصفقة (وحدات/عقود)</span>
                <span className="tick-label text-xl text-brass font-semibold">
                  {result.positionSize}
                </span>
              </div>
              {result.rr && (
                <div className="flex justify-between items-baseline">
                  <span className="text-ink-muted text-sm">نسبة العائد للمخاطرة</span>
                  <span
                    className={`tick-label text-lg font-semibold ${
                      result.rr >= 2 ? "text-bull" : "text-ink"
                    }`}
                  >
                    1:{result.rr}
                  </span>
                </div>
              )}
              <div className="hairline" />
              <p className="text-ink-faint text-xs leading-relaxed">
                ملاحظة: "حجم الصفقة" هنا هو عدد الوحدات الأساسية (مثال: عدد
                عملات BTC، أو عدد أونصات الذهب) وليس Lot بمعناه بمنصات الفوركس؛
                تحقق من قيمة الـ Pip/العقد الخاصة بمنصتك قبل التنفيذ الفعلي.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
