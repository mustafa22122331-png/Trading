"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SYMBOLS = [
  { value: "BTCUSDT", label: "BTC/USDT" },
  { value: "ETHUSDT", label: "ETH/USDT" },
];

const VISIBLE_COUNT = 120; // عدد الشموع الظاهرة قبل نقطة القرار
const REVEAL_COUNT = 15; // عدد الشموع التي تُكشف بعد التوقع

export default function BacktestChart({ onRoundEnd }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [status, setStatus] = useState("loading");
  const [phase, setPhase] = useState("guessing"); // guessing | revealed
  const [allCandles, setAllCandles] = useState([]);
  const [guess, setGuess] = useState(null);
  const [outcome, setOutcome] = useState(null);

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

  const loadNewRound = useCallback(async (sym) => {
    setStatus("loading");
    setPhase("guessing");
    setGuess(null);
    setOutcome(null);
    try {
      // نقطة نهاية عشوائية بالماضي (بين 30 يوماً و 3 سنوات قبل الآن)
      const now = Date.now();
      const minAgo = 30 * 24 * 60 * 60 * 1000;
      const maxAgo = 3 * 365 * 24 * 60 * 60 * 1000;
      const endTime = now - Math.floor(minAgo + Math.random() * (maxAgo - minAgo));

      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=4h&endTime=${endTime}&limit=${
          VISIBLE_COUNT + REVEAL_COUNT
        }`
      );
      if (!res.ok) throw new Error("fetch failed");
      const raw = await res.json();
      if (!raw.length || raw.length < VISIBLE_COUNT + REVEAL_COUNT) throw new Error("not enough data");

      const candles = raw.map((k) => ({
        time: Math.floor(k[0] / 1000),
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
      }));

      setAllCandles(candles);

      const trySet = (attempt = 0) => {
        if (seriesRef.current) {
          seriesRef.current.setData(candles.slice(0, VISIBLE_COUNT));
          chartRef.current?.timeScale().fitContent();
          setStatus("ready");
        } else if (attempt < 20) {
          setTimeout(() => trySet(attempt + 1), 100);
        }
      };
      trySet();
    } catch (e) {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadNewRound(symbol);
  }, [symbol, loadNewRound]);

  function handleGuess(direction) {
    if (phase !== "guessing" || !allCandles.length) return;
    setGuess(direction);
    setPhase("revealed");

    const revealSlice = allCandles.slice(0, VISIBLE_COUNT + REVEAL_COUNT);
    seriesRef.current?.setData(revealSlice);
    chartRef.current?.timeScale().fitContent();

    const lastVisible = allCandles[VISIBLE_COUNT - 1];
    const lastRevealed = allCandles[VISIBLE_COUNT + REVEAL_COUNT - 1];
    const actualDirection = lastRevealed.close >= lastVisible.close ? "up" : "down";
    const correct = actualDirection === direction;
    const changePercent = (
      ((lastRevealed.close - lastVisible.close) / lastVisible.close) *
      100
    ).toFixed(2);

    const result = { correct, actualDirection, changePercent };
    setOutcome(result);
    onRoundEnd?.(result);
  }

  return (
    <div className="rounded-xl border border-base-line bg-base-surface overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-base-line">
        <div className="flex gap-1">
          {SYMBOLS.map((s) => (
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
        <span className="text-ink-faint text-xs mr-auto">فريم 4 ساعات · نقطة عشوائية من التاريخ</span>
      </div>

      <div className="relative">
        <div ref={containerRef} className="w-full" />
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-surface/60 tick-label text-ink-muted text-sm">
            جاري تحميل جولة جديدة…
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-surface/90 text-bear text-sm px-6 text-center">
            تعذّر تحميل البيانات. جرّب رمزاً آخر أو أعد المحاولة.
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {phase === "guessing" && status === "ready" && (
          <>
            <p className="text-ink text-sm">
              حلّل الشارت: هل تتوقع أن السعر بعد الشموع القادمة (4 ساعات × {REVEAL_COUNT}) سيكون
              أعلى أم أدنى من آخر إغلاق ظاهر؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleGuess("up")}
                className="flex-1 py-3 rounded-md bg-bull/15 text-bull font-semibold hover:bg-bull/25 transition-colors"
              >
                أتوقع صعوداً ↑
              </button>
              <button
                onClick={() => handleGuess("down")}
                className="flex-1 py-3 rounded-md bg-bear/15 text-bear font-semibold hover:bg-bear/25 transition-colors"
              >
                أتوقع هبوطاً ↓
              </button>
            </div>
          </>
        )}

        {phase === "revealed" && outcome && (
          <div className="space-y-3">
            <div
              className={`rounded-lg p-4 ${
                outcome.correct ? "bg-bull/10 border border-bull/30" : "bg-bear/10 border border-bear/30"
              }`}
            >
              <p className={`font-semibold ${outcome.correct ? "text-bull" : "text-bear"}`}>
                {outcome.correct ? "توقع صحيح ✓" : "توقع خاطئ ✗"}
              </p>
              <p className="text-ink-muted text-sm mt-1">
                الحركة الفعلية: {outcome.actualDirection === "up" ? "صعود" : "هبوط"} بنسبة{" "}
                {outcome.changePercent}% — توقعت: {guess === "up" ? "صعود" : "هبوط"}
              </p>
            </div>
            <button
              onClick={() => loadNewRound(symbol)}
              className="w-full py-2.5 rounded-md bg-brass text-base font-semibold hover:bg-brass-light transition-colors"
            >
              جولة جديدة
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
