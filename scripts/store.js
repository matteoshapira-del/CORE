// ----- Lightweight IndexedDB key-value store (idb-keyval style) -----
const DB_NAME = 'core_app';
const STORE = 'kv';
const KEY = 'core_data_v1';
const APP_VERSION = '1.0.0';
const SCHEMA = 'core/v1';

let _dbPromise = null;
function openDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB unavailable'));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _dbPromise;
}
async function idbGet(key) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
async function idbSet(key, value) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}

// ----- Default empty state -----
export function defaultState() {
  return {
    $schema: SCHEMA,
    exportedAt: null,
    appVersion: APP_VERSION,
    onboarded: false,
    profile: {
      id: cryptoId(),
      displayName: '',
      age: null,
      sex: null,
      heightCm: null,
      weightKg: null,
      units: 'metric',
      activityLevel: 'moderate',
      injuries: [],
      createdAt: new Date().toISOString(),
    },
    selectedAreas: [],
    activeKpis: [],
    measurements: [],
    sessions: [],
    streaks: {
      practice: { current: 0, longest: 0, lastActive: null },
      improvement: { current: 0, longest: 0 },
    },
    trophies: [],
    preferences: {
      reminderTime: '08:00',
      remindersEnabled: false,
      remeasureCadenceDays: 14,
      voicePrompts: false,
      transitionSounds: true,
      showSexAdjusted: true,
      theme: 'dark',
    },
    routinesLastShown: {},
    bannerDismissedUntil: null,
  };
}

function cryptoId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ----- Store with subscribers -----
let _state = null;
const _subs = new Set();
let _saveTimer = null;

export async function loadState() {
  const saved = await idbGet(KEY);
  _state = migrate(saved) || defaultState();
  return _state;
}
export function getState() { return _state; }
export function subscribe(fn) { _subs.add(fn); return () => _subs.delete(fn); }
function emit() { _subs.forEach(fn => fn(_state)); }

export function setState(updater) {
  _state = typeof updater === 'function' ? updater(_state) : { ..._state, ...updater };
  emit();
  scheduleSave();
}

function scheduleSave() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => { idbSet(KEY, _state).catch(console.error); }, 500);
}

// ----- Migration -----
function migrate(data) {
  if (!data) return null;
  if (!data.$schema) data.$schema = SCHEMA;
  // future migrations chain here
  return { ...defaultState(), ...data };
}

// ----- Convenience mutators -----
export function recordMeasurement(m) {
  setState(s => ({
    ...s,
    measurements: [
      ...s.measurements,
      {
        id: 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        timestamp: new Date().toISOString(),
        method: 'manual',
        side: null,
        notes: '',
        ...m,
      },
    ],
  }));
}

export function recordSession(session) {
  setState(s => {
    const sessions = [
      ...s.sessions,
      {
        id: 's_' + Date.now(),
        timestamp: new Date().toISOString(),
        completed: true,
        ...session,
      },
    ];
    // Streak logic
    const today = todayKey();
    const last = s.streaks.practice.lastActive;
    let current = s.streaks.practice.current;
    let longest = s.streaks.practice.longest;
    if (last === today) {
      // already counted today
    } else if (last === yesterdayKey()) {
      current += 1;
    } else {
      current = 1;
    }
    if (current > longest) longest = current;
    return {
      ...s,
      sessions,
      streaks: {
        ...s.streaks,
        practice: { current, longest, lastActive: today },
      },
    };
  });
}

function todayKey() { return new Date().toISOString().slice(0, 10); }
function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ----- Export / Import -----
export function exportJson() {
  const data = { ..._state, exportedAt: new Date().toISOString(), appVersion: APP_VERSION };
  return JSON.stringify(data, null, 2);
}

export async function importJson(text) {
  let parsed;
  try { parsed = JSON.parse(text); } catch (e) { throw new Error('Not valid JSON'); }
  if (!parsed.$schema) throw new Error('Missing schema marker');
  const next = migrate(parsed);
  _state = next;
  await idbSet(KEY, _state);
  emit();
  return _state;
}

export async function resetAll() {
  _state = defaultState();
  await idbSet(KEY, _state);
  emit();
  return _state;
}

export { APP_VERSION, SCHEMA };
