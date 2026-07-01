"use client";

import { useState } from "react";

export default function Quiz({ questions, onPassed }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  const correctCount = questions.reduce(
    (sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0),
    0
  );
  const passed = submitted && correctCount === questions.length;

  function submit() {
    setSubmitted(true);
    if (correctCount === questions.length) onPassed?.();
  }

  return (
    <div className="rounded-xl border border-base-line bg-base-surface p-6 space-y-6">
      <p className="tick-label text-xs text-brass">اختبار سريع لترسيخ الفهم</p>

      {questions.map((q, qi) => (
        <div key={qi} className="space-y-2">
          <p className="text-ink font-medium">{qi + 1}. {q.q}</p>
          <div className="grid gap-2">
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              const isCorrect = submitted && oi === q.answer;
              const isWrongSelected = submitted && selected && oi !== q.answer;
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                  className={`text-right rounded-md border px-4 py-2.5 text-sm transition-colors ${
                    isCorrect
                      ? "border-bull/50 bg-bull/10 text-bull"
                      : isWrongSelected
                      ? "border-bear/50 bg-bear/10 text-bear"
                      : selected
                      ? "border-brass/50 bg-brass/10 text-brass"
                      : "border-base-line text-ink-muted hover:border-brass/30"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={submit}
          disabled={!allAnswered}
          className="px-5 py-2.5 rounded-md bg-brass text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brass-light transition-colors"
        >
          تحقق من الإجابات
        </button>
      ) : passed ? (
        <p className="text-bull text-sm">✓ إجابات صحيحة، تم تسجيل الدرس كمكتمل.</p>
      ) : (
        <div className="space-y-3">
          <p className="text-bear text-sm">
            أجبت بشكل صحيح على {correctCount} من {questions.length}. راجع المحتوى وحاول مجدداً.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
            }}
            className="text-sm text-brass hover:text-brass-light"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
    </div>
  );
}
