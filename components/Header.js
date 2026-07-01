"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "الرئيسية" },
  { href: "/curriculum", label: "المنهج" },
  { href: "/practice", label: "التدريب العملي" },
  { href: "/backtest", label: "Backtesting" },
  { href: "/journal", label: "سجل الصفقات" },
  { href: "/calculator", label: "حاسبة الحجم" },
  { href: "/mentor", label: "المرشد الذكي" },
];
 