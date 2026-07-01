"use client";

import { useEffect, useState } from "react";
import {
  getTrades,
  addTrade,
  updateTrade,
  deleteTrade,
  computeRR,
  getStats,
} from "@/lib/journal";

const EMPTY_FORM = {
  symbol: "",
  direction: "buy",
  entry: "",
  stopLoss: "",
  takeProfit: "",
  riskPercent: 1,
  notes: "",
};

export default function JournalPage() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTrades(getTrades());
    setMounted(true);
  }, []);

  const stats = getStats(trades);

  function handleAdd(e) {
    e.preventDefault();
    if (!form.symbol || !form.entry || !form.stopLoss) return;
    addTrade(form);
    setTrades(getTrades());
    setForm(EMPTY_FORM);
  }

  function handleResult(id, result) {
    updateTrade(id, { result });
    setTrades(getTrades());
  }

  function handleDelete(id) {
    deleteTrade(id);
    setTrades(getTrades());
  }

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div>
        <p className="tick-label text-xs text-brass mb-2">تتبع الأداء</p>
        <h1 className="font-display text-3xl text-ink mb-3">سجل الصفقات</h1>
        <p className="text-ink-muted leading-relaxed max-w-2xl">
          الانضباط يُبنى بالقياس. سجّل كل صفقة، حدد نتيجتها، وراقب نسبة نجاحك
          ومتوسط عائدك للمخاطرة بمرور الوقت. البيانات محفوظة في متصفحك فقط.
        </p>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="عدد الصفقات" value={stats.totalTrades} />
        <StatCard label="نسبة النجاح" value={`${stats.winRate}%`} />
        <StatCard label="متوسط R:R" value={stats.avgRR ? `1:${stats.avgRR}` : "—"} />
        <StatCard
          label="النتيجة التراكمية"
          value={`${stats.expectancyR >= 0 ? "+" : ""}${stats.expectancyR}R`}
          highlight={stats.expectancyR >= 0 ? "bull" : "bear"}
        />
      </div>

      {/* نموذج إضافة صفقة */}
      <form
        onSubmit={handleAdd}
        className="rounded-xl border border-base-line bg-base-surface p-6 grid sm:grid-cols-3 gap-4"
      >
        <input
          placeholder="الرمز (مثال: XAUUSD)"
          value={form.symbol}
          onChange={(e) => setForm({ ...form, symbol: e.target.value })}
          className="bg-base-raised rounded-md p-3 text-sm text-ink outline-none focus:ring-1 focus:ring-brass/50"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, direction: "buy" })}
            className={`flex-1 rounded-md text-sm font-semibold ${
              form.direction === "buy" ? "bg-bull text-base" : "border border-base-line text-ink-muted"
            }`}
          >
            شراء
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, direction: "sell" })}
            className={`flex-1 rounded-md text-sm font-semibold ${
              form.direction === "sell" ? "bg-bear text-base" : "border border-base-line text-ink-muted"
            }`}
          >
            بيع
          </button>
        </div>

        <input
          type="number"
          step="any"
          placeholder="نسبة المخاطرة %"
          value={form.riskPercent}
          onChange={(e) => setForm({ ...form, riskPercent: e.target.value })}
          className="bg-base-raised rounded-md p-3 text-sm text-ink outline-none focus:ring-1 focus:ring-brass/50"
        />

        <input
          type="number"
          step="any"
          placeholder="سعر الدخول"
          value={form.entry}
          onChange={(e) => setForm({ ...form, entry: e.target.value })}
          className="bg-base-raised rounded-md p-3 text-sm text-ink outline-none focus:ring-1 focus:ring-brass/50"
        />
        <input
          type="number"
          step="any"
          placeholder="وقف الخسارة"
          value={form.stopLoss}
          onChange={(e) => setForm({ ...form, stopLoss: e.target.value })}
          className="bg-base-raised rounded-md p-3 text-sm text-ink outline-none focus:ring-1 focus:ring-brass/50"
        />
        <input
          type="number"
          step="any"
          placeholder="جني الأرباح"
          value={form.takeProfit}
          onChange={(e) => setForm({ ...form, takeProfit: e.target.value })}
          className="bg-base-raised rounded-md p-3 text-sm text-ink outline-none focus:ring-1 focus:ring-brass/50"
        />

        <textarea
          placeholder="ملاحظات عن سبب الدخول (اختياري)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={2}
          className="sm:col-span-2 bg-base-raised rounded-md p-3 text-sm text-ink outline-none focus:ring-1 focus:ring-brass/50 resize-none"
        />

        <button
          type="submit"
          className="rounded-md bg-brass text-base font-semibold text-sm hover:bg-brass-light transition-colors"
        >
          إضافة الصفقة
        </button>
      </form>

      {/* قائمة الصفقات */}
      <div className="space-y-3">
        {trades.length === 0 && (
          <p className="text-ink-faint text-sm text-center py-10">
            لا توجد صفقات مسجلة بعد. أضف أول صفقة من النموذج أعلاه.
          </p>
        )}

        {trades.map((t) => {
          const rr = computeRR(t);
          return (
            <div
              key={t.id}
              className="rounded-xl border border-base-line bg-base-surface p-4 flex flex-wrap items-center gap-4"
            >
              <span
                className={`tick-label text-xs px-2 py-1 rounded ${
                  t.direction === "buy" ? "bg-bull/15 text-bull" : "bg-bear/15 text-bear"
                }`}
              >
                {t.direction === "buy" ? "شراء" : "بيع"}
              </span>

              <div className="min-w-[90px]">
                <p className="text-ink font-semibold text-sm">{t.symbol}</p>
                <p className="text-ink-faint text-xs">
                  {new Date(t.date).toLocaleDateString("ar-EG")}
                </p>
              </div>

              <div className="text-xs text-ink-muted tick-label">
                دخول {t.entry} · وقف {t.stopLoss} · هدف {t.takeProfit || "—"}
              </div>

              {rr && <div className="text-xs tick-label text-brass">R:R = 1:{rr}</div>}

              <div className="flex gap-1 sm:mr-auto">
                {["win", "loss", "breakeven", "open"].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleResult(t.id, r)}
                    className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                      t.result === r
                        ? r === "win"
                          ? "bg-bull text-base"
                          : r === "loss"
                          ? "bg-bear text-base"
                          : "bg-base-line text-ink"
                        : "border border-base-line text-ink-faint"
                    }`}
                  >
                    {{ win: "ربح", loss: "خسارة", breakeven: "تعادل", open: "مفتوحة" }[r]}
                  </button>
                ))}
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-xs px-2.5 py-1.5 rounded-md text-bear/70 hover:text-bear"
                >
                  حذف
                </button>
              </div>

              {t.notes && (
                <p className="w-full text-ink-faint text-xs leading-relaxed border-t border-base-line pt-2 mt-1">
                  {t.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  const color =
    highlight === "bull" ? "text-bull" : highlight === "bear" ? "text-bear" : "text-ink";
  return (
    <div className="rounded-xl border border-base-line bg-base-surface p-4 text-center">
      <p className="tick-label text-xs text-ink-muted mb-1">{label}</p>
      <p className={`font-display text-xl ${color}`}>{value}</p>
    </div>
  );
}
