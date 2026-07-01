"use client";

const STORAGE_KEY = "ta_progress_v1";

function readAll() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // تجاهل أخطاء التخزين (مثل وضع التصفح الخاص)
  }
}

export function isLessonComplete(levelId, lessonId) {
  const data = readAll();
  return Boolean(data[`${levelId}/${lessonId}`]);
}

export function setLessonComplete(levelId, lessonId, complete = true) {
  const data = readAll();
  const key = `${levelId}/${lessonId}`;
  if (complete) {
    data[key] = { completedAt: new Date().toISOString() };
  } else {
    delete data[key];
  }
  writeAll(data);
  return data;
}

export function getCompletedCount(curriculum) {
  const data = readAll();
  let count = 0;
  for (const level of curriculum) {
    for (const lesson of level.lessons) {
      if (data[`${level.id}/${lesson.id}`]) count++;
    }
  }
  return count;
}

export function getLevelProgress(level) {
  const data = readAll();
  const done = level.lessons.filter((l) => data[`${level.id}/${l.id}`]).length;
  return { done, total: level.lessons.length };
}

export function resetProgress() {
  writeAll({});
}
