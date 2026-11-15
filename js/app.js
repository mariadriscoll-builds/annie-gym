import { AREAS, CARDIO, SETS, exerciseById } from './data/exercises.js';
import {
  CHARACTERS, PROPS, FAMILY, EXERCISE_MESSAGES, SESSION_MESSAGES, FRESH_WEEK_MESSAGES,
  WEEK_MESSAGES, BONUS_SOCK_MESSAGES, WELCOME, OPENING_LINES,
} from './data/messages.js';
import { SURPRISES } from './data/surprises.js';
import { HOWTO } from './data/howto.js';
import {
  toKey, fromKey, weekKey, doneCount, isCounted, weekTotals, earnedSurprises, dateSurprise,
  weightAdvice, generateSession, swapOption, nextFromBag, PARTS_PER_SESSION, PARTS_TO_COUNT,
  SESSIONS_PER_WEEK,
} from './logic.js';
import { loadState, saveState, askToPersist, exportJSON, importJSON } from './store.js';

const REST_SECONDS = 75;

const $app = document.getElementById('app');
const $overlay = document.getElementById('overlay');
const $toast = document.getElementById('toast');
const $timer = document.getElementById('timer');
const $splash = document.getElementById('splash');

let state = loadState();
let view = { screen: 'home', month: null, confirmFinish: false };
let queue = [];
let showing = null;
let toastTimeout = null;
let timer = null; // { endsAt, label, tick }
let wakeLock = null;

const today = () => toKey(new Date());
const save = () => saveState(state);

// ---------- helpers ----------

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function pickFromBag(name, list) {
  const r = nextFromBag(state.bags[name], list.length);
  state.bags[name] = r.bag;
  return list[r.index];
}

function namesOf(who) {
  const names = who.map((id) => CHARACTERS[id]?.name).filter(Boolean);
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} & ${names.at(-1)}`;
}

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatDate(key, opts = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return fromKey(key).toLocaleDateString(undefined, opts);
}


// ---------- icons (drawn, so they take the theme's gold) ----------

const PAW = '<svg class="paw" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><ellipse cx="12" cy="16.5" rx="5.2" ry="4.3"/><ellipse cx="5.2" cy="10.5" rx="2.1" ry="2.7"/><ellipse cx="9.3" cy="6.4" rx="2.1" ry="2.8"/><ellipse cx="14.7" cy="6.4" rx="2.1" ry="2.8"/><ellipse cx="18.8" cy="10.5" rx="2.1" ry="2.7"/></svg>';
const TAB_ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  surprises: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="9" width="18" height="12" rx="1"/><path d="M12 9v12M3 13h18M12 9c-1.5-3.5-6-4-6-1.5S10 9 12 9c2 0 6 1 6-1.5S13.5 5.5 12 9z"/></svg>',
};

// ---------- caricatures ----------
// Small circles use images/<id>.png (a close-up). Big celebration figures use
// images/<id>-full.png when it exists, then the close-up, then a coloured circle with initials.

const imgOk = new Set();
const imgBad = new Set();

function imgTag(files) {
  const usable = files.filter((f) => !imgBad.has(f));
  if (!usable.length) return { html: '', file: null };
  const [file, fallback] = usable;
  const fb = fallback ? ` data-fallback="${fallback}"` : '';
  return { html: `<img src="images/${file}.png" alt="" data-img="${file}"${fb}>`, file };
}

function avatar(id, cls = '', style = '') {
  const c = CHARACTERS[id];
  if (!c) return '';
  const big = /\b(lg|xl)\b/.test(cls);
  const { html, file } = imgTag(big ? [`${id}-full`, id] : [id]);
  const loaded = file && imgOk.has(file);
  const state = loaded ? `has-img${file.endsWith('-full') ? ' full-img' : ''}` : '';
  return `<div class="avatar ${state} ${cls}" style="--c:${c.color};${style}" aria-label="${esc(c.name)}"><span class="initials">${esc(c.initials)}</span>${html}</div>`;
}

function prop(id, cls = '', style = '') {
  const p = PROPS[id];
  if (!p) return '';
  const { html, file } = imgTag([id]);
  return `<span class="prop ${file && imgOk.has(file) ? 'has-img' : ''} ${cls}" style="${style}"><span class="emoji">${p.emoji}</span>${html}</span>`;
}

document.addEventListener('load', (e) => {
  const t = e.target;
  if (t.tagName === 'IMG' && t.dataset.img) {
    imgOk.add(t.dataset.img);
    t.parentElement?.classList.add('has-img');
    if (t.dataset.img.endsWith('-full')) t.parentElement?.classList.add('full-img');
  }
}, true);
document.addEventListener('error', (e) => {
  const t = e.target;
  if (t.tagName === 'IMG' && t.dataset.img) {
    imgBad.add(t.dataset.img);
    const fb = t.dataset.fallback;
    if (fb && !imgBad.has(fb)) {
      delete t.dataset.fallback;
      t.dataset.img = fb;
      t.src = `images/${fb}.png`;
    } else {
      t.remove();
    }
  }
}, true);

// ---------- screens ----------

function render() {
  const s = view.screen;
  let html = '';
  if (s === 'home') html = homeHTML();
  else if (s === 'session') html = sessionHTML();
  else if (s === 'calendar') html = calendarHTML();
  else if (s === 'history') html = historyHTML();
  else if (s === 'surprises') html = surprisesHTML();
  else if (s === 'settings') html = settingsHTML();
  $app.innerHTML = html + (s === 'session' ? '' : navHTML());
  document.body.dataset.screen = s;
}

function navHTML() {
  const tab = (to, label) => `<button class="tab ${view.screen === to ? 'on' : ''}" data-act="nav" data-to="${to}">${TAB_ICONS[to]}${label}</button>`;
  return `<nav class="tabs">${tab('home', 'Home')}${tab('calendar', 'Gym days')}${tab('history', 'Proof')}${tab('surprises', 'Surprises')}</nav>`;
}

function freshWeekMessage() {
  const wk = weekKey(today());
  if (!state.fresh || state.fresh.week !== wk) {
    const r = nextFromBag(state.bags.fresh, FRESH_WEEK_MESSAGES.length);
    state.bags.fresh = r.bag;
    state.fresh = { week: wk, index: r.index };
    save();
  }
  return FRESH_WEEK_MESSAGES[state.fresh.index] || FRESH_WEEK_MESSAGES[0];
}

function homeHTML() {
  const t = weekTotals(state.sessions, today());
  const msg = freshWeekMessage();
  const count = t.thisWeekCount;
  const toGo = SESSIONS_PER_WEEK - count;
  let weekText;
  if (count === 0) weekText = 'Fresh week. Every session counts.';
  else if (toGo > 0) weekText = `${count} done! ${toGo} more for a full week.`;
  else if (count === SESSIONS_PER_WEEK) weekText = 'Week done! Anything extra earns Dobby a sock.';
  else weekText = `Week done, plus ${count - SESSIONS_PER_WEEK} bonus! Dobby is thrilled.`;

  const didToday = state.sessions.some((x) => x.date === today());
  const big = t.totalWeeks > 0
    ? `<div class="num">${t.totalWeeks}</div><div class="num-label">${t.totalWeeks === 1 ? 'week' : 'weeks'} done</div>`
    : `<div class="num paw-num">${PAW}</div><div class="num-label">Your first full week starts now</div>`;

  return `
  <header class="home-head">
    <div><p class="eyebrow">Annie's gym</p><h1>Hi Annie!</h1></div>
    <button class="icon-btn" data-act="nav" data-to="settings" aria-label="Settings"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg></button>
  </header>
  <section class="card fresh">
    <div class="who-row">${msg.who.map((id) => avatar(id, 'sm')).join('')}${(msg.props || []).map((p) => prop(p)).join('')}</div>
    <p>${esc(msg.text)}</p>
  </section>
  <section class="big">
    ${big}
    ${t.run >= 2 ? `<div class="run">${t.run} weeks in a row!</div>` : ''}
  </section>
  <section class="card week">
    <h2>This week</h2>
    ${count ? `<div class="paws">${PAW.repeat(Math.min(count, SESSIONS_PER_WEEK))}${count > SESSIONS_PER_WEEK ? '🧦'.repeat(count - SESSIONS_PER_WEEK) : ''}</div>` : ''}
    <p>${weekText}</p>
  </section>
  ${t.socks ? `<section class="card socks">${prop('sock', 'big-prop')}<div><strong>${t.socks}</strong> ${t.socks === 1 ? 'sock' : 'socks'} in Dobby's collection</div></section>` : ''}
  <div class="start">
    ${state.active
      ? `<button class="primary big-btn" data-act="continue-session">Back to your workout</button>`
      : `<button class="primary big-btn" data-act="start-session">${didToday ? 'Start another workout' : "Start today's workout"}</button>`}
    <p class="hint">Warm-up, 6 full-body moves, cardio finisher. About 45 to 60 minutes.</p>
  </div>`;
}

function itemInfo(item) {
  if (item.kind === 'cardio') {
    const c = CARDIO[item.cardioId];
    return { name: c.name, reps: c.reps, tip: c.tip, area: 'Cardio', weighted: false, cardio: c };
  }
  const ex = exerciseById(item.exerciseId);
  const area = AREAS.find((a) => a.id === item.area);
  return { name: ex.name, reps: `${SETS} sets · ${ex.reps}`, tip: ex.tip, area: area?.label || '', weighted: ex.weighted, ex };
}

const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
const STEPS_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/></svg>';

// Links open in a new tab, so the workout stays put underneath
function howtoHTML(exerciseId) {
  const h = HOWTO[exerciseId];
  if (!h) return '';
  const name = esc(exerciseById(exerciseId).name);
  const video = h.video ? `<a class="howto" href="${esc(h.video)}" target="_blank" rel="noopener noreferrer" aria-label="Watch a video of ${name}">${PLAY_ICON}Watch</a>` : '';
  const ace = h.ace ? `<a class="howto" href="${esc(h.ace)}" target="_blank" rel="noopener noreferrer" aria-label="Step-by-step photos of ${name} on ACE">${STEPS_ICON}ACE steps</a>` : '';
  return `<div class="howto-row">${video}${ace}</div>`;
}

function sessionHTML() {
  const s = state.active;
  if (!s) return homeHTML();
  const done = doneCount(s);
  const left = PARTS_TO_COUNT - done;
  let hint;
  if (done === 0) hint = "Let's go! Tap Done after each part.";
  else if (left > 0) hint = `${left} more and this one counts toward your week.`;
  else if (done < PARTS_PER_SESSION) hint = 'This one counts! Finish whenever you like.';
  else hint = 'Everything done! Tap Finish for your celebration.';

  const cards = s.items.map((item, i) => {
    const info = itemInfo(item);
    let weight = '';
    if (info.weighted && !item.done) {
      const adv = weightAdvice(item.exerciseId, state.sessions);
      const value = item.weight ?? adv.last ?? '';
      weight = `
        <div class="weight">
          <label>Weight <input type="number" inputmode="decimal" min="0" step="2.5" value="${value}" data-weight="${i}" placeholder="–"> lb</label>
          ${adv.last !== null ? `<span class="last">Last time: ${adv.last} lb</span>` : '<span class="last">Pick a weight that feels good for every rep.</span>'}
        </div>
        ${adv.suggest ? `<button class="suggest" data-act="use-suggest" data-i="${i}" data-w="${adv.suggest}">Feeling strong? Try ${adv.suggest} lb</button>` : ''}`;
    } else if (info.weighted && item.done && item.weight) {
      weight = `<p class="logged">${item.weight} lb</p>`;
    }
    const timerBtn = item.kind === 'cardio'
      ? `<button class="ghost" data-act="cardio-timer" data-i="${i}">${info.cardio.minutes}:00 timer</button>`
      : `<button class="ghost" data-act="rest" data-i="${i}">Rest timer</button><button class="ghost" data-act="swap" data-i="${i}">Swap</button>`;
    return `
    <article class="card ex ${item.done ? 'done' : ''} ${item.kind}">
      <div class="ex-top"><span class="area">${esc(info.area)}</span>${item.done ? '<span class="check">✓</span>' : ''}</div>
      <h3>${esc(info.name)}</h3>
      <p class="reps">${esc(info.reps)}</p>
      ${item.done ? '' : `<p class="tip">${esc(info.tip)}</p>`}
      ${item.done || item.kind !== 'lift' ? '' : howtoHTML(item.exerciseId)}
      ${weight}
      <div class="ex-actions">
        ${item.done ? '' : timerBtn}
        <button class="${item.done ? 'undo' : 'primary'} done-btn" data-act="toggle-done" data-i="${i}">${item.done ? 'Done! Tap to undo' : 'Done'}</button>
      </div>
    </article>`;
  }).join('');

  return `
  <header class="session-head">
    <button class="icon-btn" data-act="nav" data-to="home" aria-label="Back to home">←</button>
    <div class="progress">
      <div class="bar"><span style="width:${(done / PARTS_PER_SESSION) * 100}%"></span></div>
      <p>${hint}</p>
    </div>
  </header>
  ${cards}
  <div class="finish">
    <button class="primary big-btn" data-act="finish-session" ${done === 0 ? 'disabled' : ''}>Finish workout</button>
  </div>
  ${view.confirmFinish ? `
  <div class="sheet-wrap" data-act="cancel-finish">
    <div class="sheet" data-stop>
      <h3>Finish for today?</h3>
      <p>Everything you did gets saved. ${isCounted(s) ? 'And this one counts toward your week!' : ''}</p>
      <button class="primary big-btn" data-act="confirm-finish">Finish</button>
      <button class="ghost wide" data-act="cancel-finish">Keep going</button>
    </div>
  </div>` : ''}`;
}

function calendarHTML() {
  const base = view.month ? fromKey(view.month) : fromKey(today());
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const daysIn = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Monday first
  const gymDays = new Set(state.sessions.map((s) => s.date));
  const t = today();
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<div class="day blank"></div>';
  let monthCount = 0;
  for (let d = 1; d <= daysIn; d++) {
    const key = toKey(new Date(base.getFullYear(), base.getMonth(), d));
    const gym = gymDays.has(key);
    if (gym) monthCount++;
    cells += `<div class="day ${gym ? 'gym' : ''} ${key === t ? 'today' : ''}"><span>${d}</span>${gym ? `<b>${PAW}</b>` : ''}</div>`;
  }
  const label = first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const tot = weekTotals(state.sessions, t);
  return `
  <header class="page-head"><h1>Gym days</h1></header>
  <section class="card cal">
    <div class="cal-head">
      <button class="icon-btn" data-act="cal" data-dir="-1" aria-label="Previous month">‹</button>
      <h2>${label}</h2>
      <button class="icon-btn" data-act="cal" data-dir="1" aria-label="Next month">›</button>
    </div>
    <div class="dow">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((x) => `<span>${x}</span>`).join('')}</div>
    <div class="grid">${cells}</div>
    <p class="cal-foot">${monthCount ? `${monthCount} gym ${monthCount === 1 ? 'day' : 'days'} this month` : 'Every paw print here is a gym day.'}</p>
  </section>
  ${tot.totalWeeks ? `<p class="center muted">${tot.totalWeeks} full ${tot.totalWeeks === 1 ? 'week' : 'weeks'} so far, and counting.</p>` : ''}`;
}

function historyHTML() {
  const list = [...state.sessions].sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));
  const items = list.map((s) => {
    const moves = s.items.filter((i) => i.done).map((i) => {
      const info = itemInfo(i);
      return `<li>${esc(info.name)}${i.weight ? ` <span class="muted">${i.weight} lb</span>` : ''}</li>`;
    }).join('');
    return `<article class="card hist">
      <div class="hist-head"><h3>${formatDate(s.date)}</h3>${isCounted(s) ? '<span class="badge">Counts ✓</span>' : ''}</div>
      <ul>${moves}</ul>
    </article>`;
  }).join('');
  return `
  <header class="page-head"><h1>Proof</h1><p class="muted">Not an Annie story. Every workout, on the record.</p></header>
  ${items || '<section class="card"><p>Your first workout will show up here. Then nobody can say it was an Annie story.</p></section>'}`;
}

function surprisesHTML() {
  const cards = SURPRISES.map((s) => {
    const seen = s.trigger.type === 'date'
      ? Object.keys(state.seen).some((k) => k.startsWith(`${s.id}-`))
      : !!state.seen[s.id];
    if (seen) {
      return `<button class="card surprise open" data-act="replay" data-id="${s.id}">
        <div class="who-row">${s.who.slice(0, 4).map((id) => avatar(id, 'xs')).join('')}</div>
        <strong>${esc(s.title)}</strong><span class="muted">Tap to replay</span></button>`;
    }
    const tr = s.trigger;
    const hint = tr.type === 'total' ? `At ${tr.weeks} ${tr.weeks === 1 ? 'week' : 'weeks'}`
      : tr.type === 'run' ? `At ${tr.weeks} weeks in a row`
      : tr.type === 'first-session' ? 'After your first workout'
      : 'On a special day';
    return `<div class="card surprise wrapped"><span class="gift">🎁</span><strong>Still wrapped</strong><span class="muted">${hint}</span></div>`;
  }).join('');
  return `
  <header class="page-head"><h1>Surprises</h1><p class="muted">The family hid a few things in here.</p></header>
  <section class="surprise-grid">${cards}</section>
  <button class="ghost wide" data-act="replay" data-id="welcome">Replay Maria's welcome</button>`;
}

function settingsHTML() {
  return `
  <header class="page-head"><h1>Settings</h1></header>
  <section class="card">
    <h2>Back up your workouts</h2>
    <p>Everything is saved on this phone. A backup file keeps it safe if you ever get a new phone.</p>
    <button class="primary wide" data-act="export">Save a backup</button>
    <label class="ghost wide file-btn">Restore from a backup<input type="file" accept="application/json,.json" data-import hidden></label>
  </section>
  <section class="card">
    <h2>Put it on your home screen</h2>
    <p>On iPhone, open this page in Safari, tap the Share button, then Add to Home Screen. It then opens like a regular app and works without signal at the gym.</p>
  </section>
  <p class="center muted">Made with love by Maria 💜</p>`;
}

// ---------- celebrations ----------

function confetti(n = 36) {
  const colors = ['#b79cff', '#5fd4c4', '#ff7a8a', '#ffc857', '#f4f1fb', '#8f6cff'];
  let out = '';
  for (let i = 0; i < n; i++) {
    out += `<i style="left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${(Math.random() * 1.2).toFixed(2)}s;animation-duration:${(2.2 + Math.random() * 1.6).toFixed(2)}s"></i>`;
  }
  return `<div class="confetti" aria-hidden="true">${out}</div>`;
}

function stageHTML(c) {
  const who = c.who || [];
  const av = (cls) => who.map((id, i) => avatar(id, cls, `--i:${i}`)).join('');
  switch (c.scene) {
    case 'conga':
      return `<div class="stage conga"><div class="train">${av('md')}</div></div>`;
    case 'danceoff':
      return `<div class="stage danceoff">${av('lg')}</div>`;
    case 'moira':
      return `<div class="stage moira"><div class="spot"></div>${av('xl')}</div>`;
    case 'banner':
      return `<div class="stage banner-stage">${av('md')}<div class="banner">${esc(c.banner || '')}</div></div>`;
    case 'zoomies':
      return `<div class="stage zoomies">${av('lg')}</div>`;
    case 'sockpile': {
      let socks = '';
      for (let i = 0; i < 18; i++) socks += prop('sock', 'falling', `left:${Math.random() * 90}%;animation-delay:${(i * 0.12).toFixed(2)}s`);
      return `<div class="stage sockpile">${socks}${av('lg')}</div>`;
    }
    case 'fetch':
      return `<div class="stage fetch">${avatar(who[0], 'lg')}${prop('ball', 'arc')}${avatar(who[1], 'lg')}</div>`;
    case 'crown':
      return `<div class="stage crown-stage">${avatar(who[0], 'md')}<div class="crowned">${prop('crown', 'drop')}${avatar(who[1], 'lg')}</div></div>`;
    case 'birthday':
      return `<div class="stage dance">${av('sm')}</div><div class="toast-gift">${avatar('dobby', 'lg')}${prop('toast', 'big-prop')}${prop('candle', 'candle')}${prop('sock', 'big-prop')}</div>`;
    case 'anniversary':
      return `<div class="stage danceoff">${av('lg')}</div>`;
    case 'party':
      return `<div class="stage dance party">${av('sm')}</div>`;
    case 'sock':
      return `<div class="stage">${av('lg')}${prop('sock', 'fly-in big-prop')}</div>`;
    case 'dance':
    default:
      return `<div class="stage dance">${av(who.length > 4 ? 'sm' : 'lg')}${(c.props || []).map((p) => prop(p, 'big-prop bob')).join('')}</div>`;
  }
}

function linesHTML(lines) {
  return lines.map((l, i) => {
    const d = `--d:${i}`;
    if (/^\*.*\*$/.test(l)) return `<p class="line stage-dir" style="${d}">${esc(l.slice(1, -1))}</p>`;
    if (/\bfuck\b/i.test(l)) {
      const words = l.split(' ').map((w, j) => `<span style="--w:${j}">${esc(w)}</span>`).join(' ');
      return `<p class="line bubble" style="${d}">${words}</p>`;
    }
    return `<p class="line" style="${d}">${esc(l)}</p>`;
  }).join('');
}

let showPending = false;
let splashOpen = false;
function celebrate(c) {
  queue.push(c);
  // wait until everything for this moment is queued, so the button says Next! correctly
  if (!showing && !showPending && !splashOpen) {
    showPending = true;
    queueMicrotask(() => { showPending = false; if (!showing && !splashOpen) showNext(); });
  }
}

function showNext() {
  showing = queue.shift() || null;
  if (!showing) {
    $overlay.hidden = true;
    $overlay.innerHTML = '';
    return;
  }
  const c = showing;
  const btn = queue.length ? 'Next!' : c.button || 'Yay!';
  $overlay.innerHTML = `
    ${c.confetti === false ? '' : confetti()}
    <div class="celebration scene-${c.scene || 'dance'}" role="dialog" aria-label="${esc(c.title || 'Celebration')}">
      ${c.title ? `<h2>${esc(c.title)}</h2>` : ''}
      ${stageHTML(c)}
      <div class="lines">${linesHTML(c.lines || [])}</div>
      ${c.from ? `<p class="from">from ${esc(c.from)}</p>` : ''}
      <button class="primary big-btn" data-act="next">${btn}</button>
    </div>`;
  $overlay.hidden = false;
}

function surpriseToCelebration(s) {
  return { scene: s.scene, who: s.who, title: s.title, lines: s.lines, banner: s.banner };
}

function showToast(msg) {
  clearTimeout(toastTimeout);
  $toast.innerHTML = `
    <div class="toast-card" data-act="toast-close">
      <div class="who-row">${msg.who.map((id, i) => avatar(id, 'sm pop', `--i:${i}`)).join('')}</div>
      <div><p>${esc(msg.text)}</p><span class="from">${esc(namesOf(msg.who))}</span></div>
    </div>`;
  $toast.hidden = false;
  $toast.firstElementChild.classList.add('in');
  toastTimeout = setTimeout(hideToast, 5000);
}

function hideToast() {
  clearTimeout(toastTimeout);
  $toast.hidden = true;
  $toast.innerHTML = '';
}

// ---------- timers ----------

let audioCtx = null;
function beep() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = [660, 880, 1100];
    notes.forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime + i * 0.18);
      g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + i * 0.18 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + i * 0.18 + 0.16);
      o.connect(g).connect(audioCtx.destination);
      o.start(audioCtx.currentTime + i * 0.18);
      o.stop(audioCtx.currentTime + i * 0.18 + 0.2);
    });
  } catch (e) {
    // sound is a bonus
  }
  try { navigator.vibrate?.([200, 100, 200]); } catch (e) { /* no vibration */ }
}

function startTimer(seconds, label, doneText) {
  // create the audio context inside the tap so iPhone allows sound later
  try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume?.(); } catch (e) { /* ok */ }
  stopTimer();
  timer = { endsAt: Date.now() + seconds * 1000, label, doneText };
  timer.tick = setInterval(drawTimer, 250);
  drawTimer();
}

function stopTimer() {
  if (timer) clearInterval(timer.tick);
  timer = null;
  $timer.hidden = true;
  $timer.innerHTML = '';
}

function drawTimer() {
  if (!timer) return;
  const left = Math.max(0, Math.round((timer.endsAt - Date.now()) / 1000));
  if (left === 0 && !timer.finished) {
    timer.finished = true;
    clearInterval(timer.tick);
    beep();
    $timer.innerHTML = `<div class="timer-bar finished"><span>${esc(timer.doneText)}</span><button class="ghost" data-act="timer-stop">OK</button></div>`;
    $timer.hidden = false;
    setTimeout(() => { if (timer && timer.finished) stopTimer(); }, 6000);
    return;
  }
  const m = Math.floor(left / 60);
  const s = String(left % 60).padStart(2, '0');
  $timer.innerHTML = `<div class="timer-bar"><span>${esc(timer.label)}</span><strong>${m}:${s}</strong><button class="ghost" data-act="timer-add">+15s</button><button class="ghost" data-act="timer-stop">Stop</button></div>`;
  $timer.hidden = false;
}

async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator && !wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener?.('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch (e) {
    wakeLock = null;
  }
}

// ---------- actions ----------

function go(screen) {
  view.screen = screen;
  view.confirmFinish = false;
  if (screen !== 'session') keepAwake(false);
  render();
  window.scrollTo(0, 0);
}

function readWeight(i) {
  const input = $app.querySelector(`[data-weight="${i}"]`);
  if (!input) return null;
  const v = parseFloat(input.value);
  return Number.isFinite(v) && v > 0 ? v : null;
}

function finishSession() {
  const s = state.active;
  if (!s) return;
  s.finishedAt = Date.now();
  const before = weekTotals(state.sessions, today());
  state.sessions.push(s);
  state.active = null;
  stopTimer();
  keepAwake(false);
  const after = weekTotals(state.sessions, today());
  const counted = isCounted(s);

  const sm = pickFromBag('session', SESSION_MESSAGES);
  celebrate({
    scene: 'dance', who: sm.who, props: sm.props, title: 'Workout done!',
    lines: [sm.text, counted ? '' : 'Saved to your history. Every bit counts.'].filter(Boolean),
  });

  const sessionWeek = weekKey(s.date);
  const thisWeek = weekKey(today());
  if (counted && sessionWeek === thisWeek) {
    if (after.thisWeekCount === SESSIONS_PER_WEEK && before.thisWeekCount < SESSIONS_PER_WEEK) {
      const lines = [WEEK_MESSAGES[Math.floor(Math.random() * WEEK_MESSAGES.length)], `That makes ${after.totalWeeks} full ${after.totalWeeks === 1 ? 'week' : 'weeks'}.`];
      if (after.run >= 2) lines.push(`${after.run} weeks in a row!`);
      celebrate({ scene: 'party', who: shuffle(FAMILY).slice(0, 6), title: 'Full week!', lines });
    } else if (after.thisWeekCount > SESSIONS_PER_WEEK) {
      const bm = pickFromBag('sock', BONUS_SOCK_MESSAGES);
      celebrate({ scene: 'sock', who: bm.who, title: 'Bonus sock!', lines: [bm.text, `Dobby's collection: ${after.socks} ${after.socks === 1 ? 'sock' : 'socks'}.`] });
    }
  }

  for (const id of earnedSurprises(state.sessions, today())) {
    if (state.seen[id]) continue;
    state.seen[id] = today();
    const sp = SURPRISES.find((x) => x.id === id);
    if (sp) celebrate({ ...surpriseToCelebration(sp), button: 'Love it' });
  }
  save();
  go('home');
}

// A workout left open from an earlier day is saved quietly (or dropped if nothing was done)
function tidyOldActive() {
  const a = state.active;
  if (a && a.date !== today()) {
    if (doneCount(a) > 0) {
      a.finishedAt = a.finishedAt || Date.now();
      state.sessions.push(a);
      for (const id of earnedSurprises(state.sessions, today())) {
        if (!state.seen[id]) {
          state.seen[id] = today();
          const sp = SURPRISES.find((x) => x.id === id);
          if (sp) celebrate(surpriseToCelebration(sp));
        }
      }
    }
    state.active = null;
    save();
  }
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  if (e.target.closest('[data-stop]') && el.classList.contains('sheet-wrap')) return;
  const act = el.dataset.act;
  const i = el.dataset.i !== undefined ? Number(el.dataset.i) : null;

  switch (act) {
    case 'nav':
      go(el.dataset.to);
      break;
    case 'start-session':
      state.active = generateSession(state.sessions, today());
      save();
      keepAwake(true);
      go('session');
      break;
    case 'continue-session':
      keepAwake(true);
      go('session');
      break;
    case 'toggle-done': {
      const item = state.active.items[i];
      if (!item.done) {
        if (item.kind === 'lift') item.weight = readWeight(i) ?? item.weight;
        item.done = true;
        save();
        render();
        showToast(pickFromBag('exercise', EXERCISE_MESSAGES));
        save();
      } else {
        item.done = false;
        save();
        render();
      }
      break;
    }
    case 'swap': {
      const ex = swapOption(state.active, i);
      if (ex) {
        state.active.items[i].exerciseId = ex.id;
        state.active.items[i].weight = null;
        save();
        render();
      }
      break;
    }
    case 'use-suggest': {
      const input = $app.querySelector(`[data-weight="${i}"]`);
      if (input) input.value = el.dataset.w;
      state.active.items[i].weight = Number(el.dataset.w);
      save();
      el.textContent = `Set to ${el.dataset.w} lb. You've got this!`;
      break;
    }
    case 'rest':
      startTimer(REST_SECONDS, 'Rest', 'Rest done! Next set 💪');
      break;
    case 'cardio-timer': {
      const c = CARDIO[state.active.items[i].cardioId];
      startTimer(c.minutes * 60, c.name, `${c.name} done! Tap Done ✓`);
      break;
    }
    case 'timer-add':
      if (timer) { timer.endsAt += 15000; drawTimer(); }
      break;
    case 'timer-stop':
      stopTimer();
      break;
    case 'finish-session':
      if (doneCount(state.active) >= PARTS_PER_SESSION) finishSession();
      else { view.confirmFinish = true; render(); }
      break;
    case 'confirm-finish':
      finishSession();
      break;
    case 'cancel-finish':
      view.confirmFinish = false;
      render();
      break;
    case 'next':
      showNext();
      break;
    case 'splash-close':
      closeSplash();
      break;
    case 'toast-close':
      hideToast();
      break;
    case 'replay':
      if (el.dataset.id === 'welcome') celebrate({ scene: 'dance', who: WELCOME.who, title: WELCOME.title, lines: [WELCOME.text], confetti: false });
      else {
        const sp = SURPRISES.find((x) => x.id === el.dataset.id);
        if (sp) celebrate(surpriseToCelebration(sp));
      }
      break;
    case 'cal': {
      const base = view.month ? fromKey(view.month) : fromKey(today());
      view.month = toKey(new Date(base.getFullYear(), base.getMonth() + Number(el.dataset.dir), 1));
      render();
      break;
    }
    case 'export': {
      const blob = new Blob([exportJSON(state)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `annie-gym-backup-${today()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      break;
    }
    default:
      break;
  }
});

document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.weight !== undefined && state.active) {
    const v = parseFloat(t.value);
    state.active.items[Number(t.dataset.weight)].weight = Number.isFinite(v) && v > 0 ? v : null;
    save();
  }
  if (t.matches && t.matches('[data-import]') && t.files && t.files[0]) {
    t.files[0].text().then((text) => {
      try {
        state = importJSON(text);
        save();
        celebrate({ scene: 'dance', who: ['dobby', 'luna'], title: 'Backup restored!', lines: [`${state.sessions.length} workouts are back where they belong.`] });
        go('home');
      } catch (err) {
        celebrate({ scene: 'dance', who: ['dobby'], title: 'Hmm, that file did not work', lines: ['Dobby sniffed it and it is not a gym backup. Try the file named annie-gym-backup.'], confetti: false });
      }
    });
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    if (view.screen === 'session' && state.active) keepAwake(true);
    drawTimer();
  }
});

// ---------- opening screen ----------
// Plays each time the app opens. Moves on by itself, or straight away on a tap.

let splashTimer = null;

function showSplash() {
  const line = pickFromBag('opening', OPENING_LINES);
  save();
  const t = weekTotals(state.sessions, today());
  const greeting = state.sessions.length ? 'Welcome back to' : 'Welcome to';
  const status = t.thisWeekCount
    ? `<p class="splash-status">${t.thisWeekCount} ${t.thisWeekCount === 1 ? 'workout' : 'workouts'} this week already!</p>`
    : '';
  let paws = '';
  for (let i = 0; i < 6; i++) paws += `<span class="splash-paw" style="--i:${i}">${PAW}</span>`;
  $splash.innerHTML = `
    <div class="splash-inner" data-act="splash-close">
      <p class="eyebrow splash-eyebrow">${greeting}</p>
      <h1 class="splash-title">Annie's<br>Gym</h1>
      <div class="splash-dogs">${avatar('dobby', 'lg splash-dobby')}${avatar('luna', 'lg splash-luna')}</div>
      <div class="splash-trail" aria-hidden="true">${paws}</div>
      <div class="splash-line">
        <p>${esc(line.text)}</p>
        <span class="from">${esc(namesOf(line.who))}</span>
      </div>
      ${status}
      <p class="splash-tap">Tap anywhere to start</p>
    </div>`;
  $splash.hidden = false;
  splashOpen = true;
  splashTimer = setTimeout(closeSplash, 3600);
}

function closeSplash() {
  if (!splashOpen) return;
  clearTimeout(splashTimer);
  splashOpen = false;
  $splash.classList.add('leaving');
  setTimeout(() => {
    $splash.hidden = true;
    $splash.classList.remove('leaving');
    $splash.innerHTML = '';
  }, 350);
  if (!showing && queue.length) showNext();
}

// ---------- start ----------

function start() {
  tidyOldActive();
  askToPersist();
  if (!state.welcomed) {
    state.welcomed = true;
    save();
    celebrate({ scene: 'dance', who: WELCOME.who, title: WELCOME.title, lines: [WELCOME.text], button: "Let's go!" });
  }
  const ds = dateSurprise(today());
  if (ds && !state.seen[ds.seenKey]) {
    state.seen[ds.seenKey] = today();
    save();
    celebrate({ ...surpriseToCelebration(ds.surprise), button: 'Love it' });
  }
  if (state.active) view.screen = 'session';
  render();
  showSplash();
}

start();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
