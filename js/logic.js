// Pure logic: dates, week counting, weight suggestions, workout generation.
// No DOM here, so it can be tested with node.

import { AREAS, EXERCISES, CARDIO, exerciseById, weightStep } from './data/exercises.js';
import { SURPRISES } from './data/surprises.js';

export const PARTS_PER_SESSION = 8; // warm-up + 6 strength + finisher
export const PARTS_TO_COUNT = 7; // a session counts toward the week at 7 of 8
export const SESSIONS_PER_WEEK = 3;
export const MAX_BARBELL = 2; // barbell setups take time; keep it to 2 per session

// ---------- dates (always local time, as YYYY-MM-DD) ----------

export function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, days) {
  const d = fromKey(key);
  d.setDate(d.getDate() + days);
  return toKey(d);
}

// Monday of the week containing this date
export function weekKey(key) {
  const d = fromKey(key);
  const sinceMonday = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - sinceMonday);
  return toKey(d);
}

// ---------- sessions ----------

export function doneCount(session) {
  return session.items.filter((i) => i.done).length;
}

export function isCounted(session) {
  return doneCount(session) >= PARTS_TO_COUNT;
}

function countedPerWeek(sessions) {
  const counts = {};
  for (const s of sessions) {
    if (!isCounted(s)) continue;
    const wk = weekKey(s.date);
    counts[wk] = (counts[wk] || 0) + 1;
  }
  return counts;
}

// Everything the home screen shows. totalWeeks never goes down.
export function weekTotals(sessions, todayKey) {
  const counts = countedPerWeek(sessions);
  const thisWeek = weekKey(todayKey);
  const fullWeeks = Object.keys(counts).filter((wk) => counts[wk] >= SESSIONS_PER_WEEK).sort();

  // Current run: weeks in a row with 3+. This week only joins once it reaches 3,
  // and an unfinished current week does not end the run.
  let run = 0;
  let wk = counts[thisWeek] >= SESSIONS_PER_WEEK ? thisWeek : addDays(thisWeek, -7);
  while (counts[wk] >= SESSIONS_PER_WEEK) {
    run += 1;
    wk = addDays(wk, -7);
  }

  // Longest run ever, for unlocking run surprises
  let bestRun = 0;
  let current = 0;
  let prev = null;
  for (const w of fullWeeks) {
    current = prev && addDays(prev, 7) === w ? current + 1 : 1;
    bestRun = Math.max(bestRun, current);
    prev = w;
  }

  let socks = 0;
  for (const c of Object.values(counts)) socks += Math.max(0, c - SESSIONS_PER_WEEK);

  return {
    totalWeeks: fullWeeks.length,
    run,
    bestRun,
    thisWeekCount: counts[thisWeek] || 0,
    socks,
    sessionCount: sessions.length,
  };
}

// Surprise ids earned by sessions so far (date surprises are handled separately)
export function earnedSurprises(sessions, todayKey) {
  const t = weekTotals(sessions, todayKey);
  const ids = [];
  for (const s of SURPRISES) {
    const tr = s.trigger;
    if (tr.type === 'first-session' && t.sessionCount >= 1) ids.push(s.id);
    if (tr.type === 'total' && t.totalWeeks >= tr.weeks) ids.push(s.id);
    if (tr.type === 'run' && t.bestRun >= tr.weeks) ids.push(s.id);
  }
  return ids;
}

// Date surprise for today, if any. Returns { surprise, seenKey }.
export function dateSurprise(todayKey) {
  const d = fromKey(todayKey);
  for (const s of SURPRISES) {
    if (s.trigger.type !== 'date') continue;
    if (s.trigger.month === d.getMonth() + 1 && s.trigger.day === d.getDate()) {
      return { surprise: s, seenKey: `${s.id}-${d.getFullYear()}` };
    }
  }
  return null;
}

// ---------- weights ----------

function weightHistory(exerciseId, sessions) {
  const out = [];
  const sorted = [...sessions].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  for (const s of sorted) {
    for (const item of s.items) {
      if (item.exerciseId === exerciseId && item.done && item.weight > 0) out.push(item.weight);
    }
  }
  return out;
}

// { last, suggest } where suggest is set after two sessions at the same weight
export function weightAdvice(exerciseId, sessions) {
  const ex = exerciseById(exerciseId);
  if (!ex || !ex.weighted) return { last: null, suggest: null };
  const h = weightHistory(exerciseId, sessions);
  const last = h.length ? h[h.length - 1] : null;
  const prev = h.length > 1 ? h[h.length - 2] : null;
  const suggest = last !== null && prev === last ? last + weightStep(ex) : null;
  return { last, suggest };
}

// ---------- workout generation ----------

function pick(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function lastSessionIds(sessions) {
  if (!sessions.length) return new Set();
  const latest = [...sessions].sort((a, b) => (a.startedAt || 0) - (b.startedAt || 0)).at(-1);
  return new Set(latest.items.map((i) => i.exerciseId).filter(Boolean));
}

export function generateSession(sessions, todayKey, rng = Math.random) {
  const avoid = lastSessionIds(sessions);
  let barbells = 0;
  const lifts = [];
  for (const area of AREAS) {
    let options = EXERCISES.filter((e) => e.area === area.id);
    const fresh = options.filter((e) => !avoid.has(e.id));
    if (fresh.length) options = fresh;
    if (barbells >= MAX_BARBELL) {
      const noBar = options.filter((e) => e.equipment !== 'barbell');
      if (noBar.length) options = noBar;
    }
    const ex = pick(options, rng);
    if (ex.equipment === 'barbell') barbells += 1;
    lifts.push({ kind: 'lift', exerciseId: ex.id, area: area.id, weight: null, done: false });
  }
  return {
    id: `s-${Date.now().toString(36)}-${Math.floor(rng() * 1e6).toString(36)}`,
    date: todayKey,
    startedAt: Date.now(),
    finishedAt: null,
    items: [
      { kind: 'cardio', cardioId: CARDIO.warmup.id, done: false },
      ...lifts,
      { kind: 'cardio', cardioId: CARDIO.finisher.id, done: false },
    ],
  };
}

// Another exercise for the same area that isn't already in the session
export function swapOption(session, index, rng = Math.random) {
  const item = session.items[index];
  if (!item || item.kind !== 'lift') return null;
  const inSession = new Set(session.items.map((i) => i.exerciseId).filter(Boolean));
  const barbells = session.items.filter((i, n) => n !== index && i.exerciseId && exerciseById(i.exerciseId).equipment === 'barbell').length;
  let options = EXERCISES.filter((e) => e.area === item.area && !inSession.has(e.id));
  if (barbells >= MAX_BARBELL) {
    const noBar = options.filter((e) => e.equipment !== 'barbell');
    if (noBar.length) options = noBar;
  }
  return options.length ? pick(options, rng) : null;
}

// ---------- message rotation ----------

// Shuffle-bag: every message shows once before any repeats.
export function nextFromBag(bag, size, rng = Math.random) {
  let b = Array.isArray(bag) ? bag.filter((i) => i < size) : [];
  if (!b.length) {
    b = Array.from({ length: size }, (_, i) => i);
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
  }
  const index = b.pop();
  return { index, bag: b };
}
