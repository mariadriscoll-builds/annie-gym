// Saves everything on Annie's phone. Storage can fail (private mode, full disk),
// so every read and write is guarded and the app keeps working in memory.

const KEY = 'annie-gym-v1';

function fresh() {
  return {
    version: 1,
    sessions: [], // finished sessions
    active: null, // the session in progress
    seen: {}, // surprise ids already shown
    bags: {}, // message rotation
    fresh: null, // this week's home-screen message
    welcomed: false,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch (e) {
    // fall through to a fresh start
  }
  return fresh();
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    return false;
  }
}

// Ask the browser not to clear our data when space runs low
export async function askToPersist() {
  try {
    if (navigator.storage && navigator.storage.persist) await navigator.storage.persist();
  } catch (e) {
    // not supported, fine
  }
}

export function exportJSON(state) {
  return JSON.stringify({ app: 'annie-gym', exportedAt: new Date().toISOString(), state }, null, 2);
}

export function importJSON(text) {
  const parsed = JSON.parse(text);
  const s = parsed && parsed.app === 'annie-gym' ? parsed.state : null;
  if (!s || !Array.isArray(s.sessions)) throw new Error('not a backup');
  return { ...fresh(), ...s };
}
