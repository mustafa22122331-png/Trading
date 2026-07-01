"use client";

import { useEffect, useRef, useState } from "react";

const SYMBOLS = [
  { value: "BTCUSDT", label: "BTC/USDT" },
  { value: "ETHUSDT", label: "ETH/USDT" },
  { value: "EURUSD", label: "EUR/USD (تقريبي عبر عملات رقمية مرتبطة)", disabled: true },
];

const INTERVALS = [
  { value: "15m", label: "15 دقيقة" },
  { value: "1h", label: "ساعة" },
  { value: "4h", label: "4 ساعات" },
  { value: "1d", label: "يومي" },
];

export default function TradingChart({ onDataChange }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setIntervalValue] = useState("1h");
  const [status, setStatus] = useState("loading");

  // إنشاء الشارت مرة واحدة
  useEffect(() => {
    let disposed = false;

    async function init() {
      const { createChart, ColorType } = await import("lightweight-charts");
      if (disposed || !containerRef.current) return;

      const chart = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "#121820" },
          textColor: "#8A96A3",
          fontFamily: "JetBrains Mono, monospace",
        },
        grid: {
          vertLines: { color: "#1A222C" },
          horzLines: { color: "#1A222C" },
        },
        rightPriceScale: { borderColor: "#26323E" },
        timeScale: { borderColor: "#26323E", timeVisible: true },
        width: containerRef.current.clientWidth,
        height: 420,
      });

      const series = chart.addCandlestickSeries({
        upColor: "#2DD4A7",
        downColor: "#E5484D",
        borderVisible: false,
        wickUpColor: "#2DD4A7",
        wickDownColor: "#E5484D",
      });

      chartRef.current = chart;
      seriesRef.current = series;

      const handleResize = () => {
        if (containerRef.current) {
          chart.applyOptions({ width: containerRef.current.clientWidth });
        }
      };
      window.addEventListener("resize", handleResize);

      chart.__cleanup = () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }

    init();

    return () => {
      disposed = true;
      chartRef.current?.__cleanup?.();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // جلب البيانات عند تغيير الرمز أو الفريم
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setStatus("loading");
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=200`
        );
        if (!res.ok) throw new Error("تعذّر جلب البيانات");
        const raw = await res.json();

        const candles = raw.map((k) => ({
          time: Math.floor(k[0] / 1000),
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
        }));

        if (cancelled) return;

        // انتظار جاهزية السلسلة (قد لا تكون جاهزة فور أول تحميل)
        const trySet = (attempt = 0) => {
          if (seriesRef.current) {
            seriesRef.current.setData(candles);
            chartRef.current?.timeScale().fitContent();
            setStatus("ready");
            const last = candles[candles.length - 1];
            onDataChange?.({ symbol, interval, last, count: candles.length });
          } else if (attempt < 20) {
            setTimeout(() => trySet(attempt + 1), 100);
          }
        };
        trySet();
      } catch (e) {
        if (!cancelled) setStatus("error");
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [symbol, interval, onDataChange]);

  return (
    <div className="rounded-xl border border-base-line bg-base-surface overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-base-line">
        <div className="flex gap-1">
          {SYMBOLS.filter((s) => !s.disabled).map((s) => (
            <button
              key={s.value}
              onClick={() => setSymbol(s.value)}
              className={`tick-label text-xs px-3 py-1.5 rounded-md transition-colors ${
                symbol === s.value
                  ? "bg-brass text-base"
                  : "text-ink-muted hover:text-ink border border-base-line"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 sm:mr-auto">
          {INTERVALS.map((i) => (
            <button
              key={i.value}
              onClick={() => setIntervalValue(i.value)}
              className={`tick-label text-xs px-3 py-1.5 rounded-md transition-colors ${
                interval === i.value
                  ? "bg-brass text-base"
                  : "text-ink-muted hover:text-ink border border-base-line"
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div ref={containerRef} className="w-full" />
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-surface/60 tick-label text-ink-muted text-sm">
            جاري تحميل بيانات السعر…
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-surface/90 text-bear text-sm px-6 text-center">
            تعذّر تحميل البيانات (قد يكون الوصول لـ Binance محجوباً من شبكتك). جرّب رمزاً أو فريماً آخر.
          </div>
        )}
      </div>
    </div>
  );
}
