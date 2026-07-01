"use client";

const STORAGE_KEY = "ta_journal_v1";

function readAll() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(trades) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  } catch {
    // تجاهل أخطاء التخزين
  }
}

export function getTrades() {
  return readAll().sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function addTrade(trade) {
  const trades = readAll();
  const newTrade = {
    id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    date: trade.date || new Date().toISOString(),
    symbol: trade.symbol || "",
    direction: trade.direction || "buy", // buy | sell
    entry: Number(trade.entry) || 0,
    stopLoss: Number(trade.stopLoss) || 0,
    takeProfit: Number(trade.takeProfit) || 0,
    result: trade.result || "open", // win | loss | breakeven | open
    riskPercent: Number(trade.riskPercent) || 0,
    notes: trade.notes || "",
  };
  trades.push(newTrade);
  writeAll(trades);
  return newTrade;
}

export function updateTrade(id, updates) {
  const trades = readAll();
  const idx = trades.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  trades[idx] = { ...trades[idx], ...updates };
  writeAll(trades);
  return trades[idx];
}

export function deleteTrade(id) {
  const trades = readAll().filter((t) => t.id !== id);
  writeAll(trades);
}

// نسبة العائد للمخاطرة الفعلية للصفقة
export function computeRR(trade) {
  const { entry, stopLoss, takeProfit, direction } = trade;
  if (!entry || !stopLoss || !takeProfit) return null;
  const risk = direction === "buy" ? entry - stopLoss : stopLoss - entry;
  const reward = direction === "buy" ? takeProfit - entry : entry - takeProfit;
  if (risk <= 0) return null;
  return +(reward / risk).toFixed(2);
}

export function getStats(trades) {
  const closed = trades.filter((t) => t.result === "win" || t.result === "loss");
  const wins = closed.filter((t) => t.result === "win");
  const losses = closed.filter((t) => t.result === "loss");
  const winRate = closed.length ? +((wins.length / closed.length) * 100).toFixed(1) : 0;

  const rrValues = closed.map((t) => computeRR(t)).filter((v) => v !== null);
  const avgRR = rrValues.length
    ? +(rrValues.reduce((a, b) => a + b, 0) / rrValues.length).toFixed(2)
    : 0;

  // نتيجة تقريبية بوحدات R (كل صفقة رابحة = +RR الخاص فيها، كل خاسرة = -1R)
  let expectancyR = 0;
  closed.forEach((t) => {
    const rr = computeRR(t) || 0;
    expectancyR += t.result === "win" ? rr : -1;
  });

  return {
    totalTrades: trades.length,
    closedTrades: closed.length,
    openTrades: trades.filter((t) => t.result === "open").length,
    wins: wins.length,
    losses: losses.length,
    winRate,
    avgRR,
    expectancyR: +expectancyR.toFixed(2),
  };
}
