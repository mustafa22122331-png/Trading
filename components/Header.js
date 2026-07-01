"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "الرئيسية" },
  { href: "/curriculum", label: "المنهج" },
  { href: "/practice", label: "التدريب العملي" },
  { href: "/mentor", label: "المرشد الذكي" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-base-line bg-base/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-2 h-6 bg-brass rounded-sm group-hover:h-8 transition-all" />
          <span className="font-display text-lg tracking-tight text-ink">
            أكاديمية <span className="text-brass">الفهم</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 tick-label text-sm">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md transition-colors ${
                  active
                    ? "text-brass bg-base-raised"
                    : "text-ink-muted hover:text-ink hover:bg-base-raised/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/curriculum"
          className="hidden sm:inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-brass text-base font-semibold hover:bg-brass-light transition-colors"
        >
          ابدأ التعلم
        </Link>
      </div>

      <nav className="md:hidden flex items-center gap-1 px-4 pb-3 tick-label text-xs overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
                active ? "text-brass bg-base-raised" : "text-ink-muted"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
