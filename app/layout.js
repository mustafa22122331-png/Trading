import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "أكاديمية الفهم | تداول ICT وSMC من الصفر للاحتراف",
  description:
    "منصة تعليمية متكاملة لتعلّم التداول بمنهجية ICT وSmart Money Concepts، مع مرشد ذكاء اصطناعي ومحاكي شارت للتدريب العملي.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-base bg-grid-fade flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-base-line">
          <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-ink-faint flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>أكاديمية الفهم — منهج ICT / Smart Money Concepts</p>
            <p className="tick-label text-xs">
              تنبيه: محتوى تعليمي بحت، التداول ينطوي على مخاطر حقيقية على رأس المال.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
