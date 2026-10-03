import { getExercise } from '../data/exercises.js';
import { setState, recordSession } from '../store.js';
import { resolveIds } from './safety.js';

// Bookends — three fixed daily slots (spec: CORE-bookends-spec.md, v1 2026-10-03).
// Post-Sea 7 and Car Reset 60 are guided; Beach 3 is memorised (no phone on
// the sand) and logged after the fact with one tap.

// Post-Sea is built from the user's focus areas (state.selectedAreas, edited
// via the body map on Home). Blocks keep a fixed floor-friendly order, so a
// given selection always gives the same routine. `extra` moves are dropped
// first when the selection would run long. With the default selection
// (lower back, hips, glutes, hamstrings) this is exactly the spec's Post-Sea 7.
export const DEFAULT_FOCUS = ['lower_back', 'hips', 'glutes', 'hamstrings'];
const POST_SEA_BLOCKS = [
  { area: 'lower_back', id: 'knees_to_chest_rock', sec: 45, cue: 'Hug both knees, rock gently side to side.' },
  { area: 'upper_back', id: 'cat_cow', sec: 45, reps: 8 },
  { area: 'upper_back', id: 'open_book', sec: 30, sides: true, extra: true },
  { area: 'hips', id: 'kneeling_hip_flexor', name: 'Half-Kneeling Hip Flexor', sec: 45, sides: true, cue: 'Squeeze the back-leg glute, tuck the pelvis, shift forward.' },
  { area: 'quads', id: 'side_lying_quad', sec: 30, sides: true },
  { area: 'glutes', id: 'reclined_figure4', name: 'Figure-4 (Piriformis)', sec: 45, sides: true, cue: 'Ankle over knee, pull the thigh in gently.' },
  { area: 'core_anterior', id: 'dead_bug', sec: 40 },
  { area: 'core_posterior', id: 'bird_dog', sec: 40 },
  { area: 'core_lateral', id: 'side_plank_knees', sec: 25, sides: true },
  { area: 'hamstrings', id: 'sciatic_nerve_slider', sec: 40, sides: true, reps: 10, cue: 'Seated tall. Straighten the knee AND look up; bend the knee AND look down. A glide, never a pull.' },
  { area: 'hamstrings', id: 'supine_hamstring_towel', sec: 45, sides: true, cue: 'Knee soft, foot relaxed, stop before any tingling.' },
  { area: 'shoulders', id: 'thread_needle', sec: 30, sides: true },
  { area: 'shoulders', id: 'cross_body_shoulder', sec: 25, sides: true, extra: true },
  { area: 'chest', id: 'corner_stretch', sec: 30 },
  { area: 'neck', id: 'chin_tucks', sec: 30 },
  { area: 'neck', id: 'ear_to_shoulder', sec: 25, sides: true, extra: true },
  { area: 'ankles_calves', id: 'bent_knee_calf', sec: 30, sides: true },
  { area: 'full_body', id: 'worlds_greatest_stretch', sec: 30, sides: true, reps: 3 },
  { area: 'balance', id: 'single_leg_balance', sec: 25, sides: true },
  { area: 'lower_back', id: 'childs_pose', sec: 30, cue: 'Sit back on your heels, fold forward, breathe into the low back.' },
];
const POST_SEA_MAX_SEC = 9 * 60;

export function focusAreas(state) {
  const sel = (state.selectedAreas || []).filter(Boolean);
  return sel.length ? sel : DEFAULT_FOCUS;
}

function postSeaMoves(state) {
  const focus = new Set(focusAreas(state));
  let moves = POST_SEA_BLOCKS.filter(b => focus.has(b.area));
  const len = ms => ms.reduce((t, m) => t + m.sec * (m.sides ? 2 : 1), 0);
  if (len(moves) > POST_SEA_MAX_SEC) moves = moves.filter(m => !m.extra);
  if (!moves.length) moves = POST_SEA_BLOCKS.filter(b => DEFAULT_FOCUS.includes(b.area));
  return moves;
}

const CAR_RESET = [
  { id: 'standing_back_extension', sec: 20, reps: 5, cue: 'Hands on your low back, hips forward; lean back gently.' },
  { id: 'standing_hip_flexor', sec: 20, sides: true, cue: 'Squeeze the back-leg glute, tuck the pelvis, shift forward.' },
];

// Beach 3: memorised for the sand, but playable as a guided routine (Home
// "Guide" toggle) until it sticks.
const BEACH_MOVES = [
  { id: 'cat_cow', sec: 45, reps: 8 },
  { id: 'leg_swings', name: 'Leg Swings (Front/Back)', sec: 30, sides: true, reps: 10 },
  { id: 'worlds_greatest_stretch', sec: 35, sides: true, reps: 3 },
];
export const BEACH_3 = [
  { id: 'cat_cow', label: 'Cat-cow', dose: '×8' },
  { id: 'leg_swings', label: 'Leg swings front/back', dose: '×10 per side' },
  { id: 'worlds_greatest_stretch', label: "World's greatest stretch", dose: '×3 per side' },
];

export const BOOKENDS = {
  r_post_sea7: { kind: 'post_sea', title: 'Post-Sea 7', moves: postSeaMoves, pastel: 'var(--pastel-mist)', areas: ['lower_back', 'hips'] },
  r_beach3: { kind: 'beach', title: 'Beach 3', moves: BEACH_MOVES, pastel: 'var(--pastel-cream)', areas: ['full_body'] },
  r_car60: { kind: 'car', title: 'Car Reset 60', moves: CAR_RESET, pastel: 'var(--pastel-peach)', areas: ['lower_back'] },
};

export const BOOKEND_KINDS = new Set(['post_sea', 'beach', 'car']);

// Build a playable routine. Each L/R side is its own step so a tingle can be
// logged against the exact side. Tingle swaps (via safety.resolveIds) replace
// a move with its gentler alternate, keeping the slot's timing.
export function getBookendRoutine(routineId, state) {
  const def = BOOKENDS[routineId];
  if (!def) return null;
  const moves = typeof def.moves === 'function' ? def.moves(state) : def.moves;
  const steps = [];
  for (const m of moves) {
    const ids = resolveIds(state, m.id);
    for (const id of ids) {
      const ex = getExercise(id);
      if (!ex) continue;
      const swapped = id !== m.id;
      const base = {
        ...ex,
        name: swapped ? ex.name : (m.name || ex.name),
        oneLiner: swapped || !m.cue ? ex.oneLiner : m.cue,
        durationSec: m.sec,
        reps: m.reps || null,
        sideSpecific: false,
      };
      if (swapped && ex.sideSpecific && !m.sides) {
        const half = Math.round(m.sec / 2);
        steps.push({ ...base, durationSec: half, side: 'left' }, { ...base, durationSec: half, side: 'right' });
      } else if (m.sides) {
        steps.push({ ...base, side: 'left' }, { ...base, side: 'right' });
      } else {
        steps.push({ ...base, side: null });
      }
    }
  }
  return {
    id: routineId,
    kind: def.kind,
    title: def.title,
    areas: routineId === 'r_post_sea7' ? focusAreas(state) : def.areas,
    pastel: def.pastel,
    exercises: steps,
    durationSec: steps.reduce((s, e) => s + e.durationSec, 0),
    kpisTargeted: [...new Set(steps.flatMap(e => e.primaryKpis))],
  };
}

// ----- Days -----
function pad(n) { return String(n).padStart(2, '0'); }
export function dayKey(d = new Date()) {
  const x = new Date(d);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
}
export function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function keyToDate(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); }

// day -> 'solid' (full Post-Sea 7) | 'hollow' (any bookend, even one move)
export function dayMap(state) {
  const map = {};
  for (const s of state.sessions || []) {
    if (!BOOKEND_KINDS.has(s.kind)) continue;
    if (!s.completed && !(s.movesDone >= 1)) continue;
    const k = dayKey(s.timestamp);
    if (s.kind === 'post_sea' && s.full) map[k] = 'solid';
    else if (!map[k]) map[k] = 'hollow';
  }
  return map;
}

export function streakInfo(state) {
  const map = dayMap(state);
  let d = new Date();
  const todayDone = !!map[dayKey(d)];
  if (!todayDone) d = addDays(d, -1); // today is still open
  let current = 0;
  while (map[dayKey(d)]) { current++; d = addDays(d, -1); }

  const keys = Object.keys(map).sort();
  let longest = 0, run = 0, prev = null;
  for (const k of keys) {
    run = prev && dayKey(addDays(keyToDate(prev), 1)) === k ? run + 1 : 1;
    if (run > longest) longest = run;
    prev = k;
  }
  return { current, longest, todayDone, map };
}

// Last n days, oldest first, each { key, date, status }
export function recentDays(state, n, map = dayMap(state)) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = addDays(new Date(), -i);
    const key = dayKey(date);
    out.push({ key, date, status: map[key] || null });
  }
  return out;
}

// ----- Today -----
export function todaySummary(state, key = dayKey()) {
  const sessions = (state.sessions || []).filter(s => dayKey(s.timestamp) === key);
  const post = sessions.filter(s => s.kind === 'post_sea' && (s.completed || s.movesDone >= 1));
  return {
    postSea: post.some(s => s.full) ? 'full' : post.length ? 'partial' : null,
    beach: sessions.some(s => s.kind === 'beach'),
    car: sessions.filter(s => s.kind === 'car' && (s.completed || s.movesDone >= 1)).length,
    morningStiff: checkinFor(state, 'morning_stiffness', key),
    driveStiff: checkinFor(state, 'drive_stiffness', key),
    tingles: (state.tingles || []).filter(t => t.date === key).length,
  };
}

export function checkinFor(state, kind, key = dayKey()) {
  const c = (state.checkins || []).filter(x => x.kind === kind && x.date === key).pop();
  return c ? c.value : null;
}

export function checkinHistory(state, kind) {
  return (state.checkins || []).filter(x => x.kind === kind).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function isSunday(d = new Date()) { return new Date(d).getDay() === 0; }

export function sundayCheckDone(state, key = dayKey()) {
  return checkinFor(state, 'drive_stiffness', key) != null
    || (state.measurements || []).some(m => m.kpiId === 'f1_forward_fold' && dayKey(m.timestamp) === key);
}

// ----- Share day -----
export function shareLine(state) {
  const t = todaySummary(state);
  const { current } = streakInfo(state);
  const post = t.postSea === 'full' ? '✓' : t.postSea === 'partial' ? '½' : '✗';
  let line = `🧘 streak ${current} · Post-Sea ${post} · Beach ${t.beach ? '✓' : '✗'} · Car ×${t.car} · stiff ${t.morningStiff ?? '–'}/5 · tingle ${t.tingles}`;
  if (isSunday()) {
    const key = dayKey();
    const today = (state.measurements || []).filter(m => dayKey(m.timestamp) === key);
    const ff = today.filter(m => m.kpiId === 'f1_forward_fold').pop();
    const th = side => {
      const m = today.filter(x => x.kpiId === 'f3_hip_flexor' && x.side === side).pop();
      return m ? (m.score >= 3 ? '✓' : '✗') : '–';
    };
    line += ` · FF ${ff ? signed(ff.rawValue) + ' cm' : '–'} · Thomas L/R ${th('left')}/${th('right')}`;
    if (t.driveStiff != null) line += ` · drive ${t.driveStiff}/5`;
  }
  return line;
}

export function signed(v) {
  const n = Math.round(Number(v) * 10) / 10;
  return n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0';
}

// ----- Mutators -----
function newId(p) { return p + Date.now() + '_' + Math.random().toString(36).slice(2, 6); }

export function logBeach() {
  recordSession({ id: newId('s_'), routineId: 'r_beach3', kind: 'beach', durationSec: 180, movesDone: 3, totalMoves: 3, full: true, logged: true });
}

export function undoBeachToday() {
  const key = dayKey();
  setState(s => {
    const idx = s.sessions.map(x => x.kind === 'beach' && dayKey(x.timestamp) === key).lastIndexOf(true);
    if (idx < 0) return s;
    return { ...s, sessions: s.sessions.filter((_, i) => i !== idx) };
  });
}

export function recordTingle(move, side) {
  const now = new Date();
  setState(s => ({
    ...s,
    tingles: [...(s.tingles || []), { move, side: side || null, date: dayKey(now), timestamp: now.toISOString() }],
  }), { silent: true });
}

export function restoreMove(move) {
  setState(s => ({
    ...s,
    bookends: { ...s.bookends, tingleResets: { ...(s.bookends.tingleResets || {}), [move]: new Date().toISOString() } },
  }));
}

export function setCheckin(kind, value, opts) {
  const now = new Date();
  const key = dayKey(now);
  setState(s => ({
    ...s,
    checkins: [
      ...(s.checkins || []).filter(c => !(c.kind === kind && c.date === key)),
      { kind, value, date: key, timestamp: now.toISOString() },
    ],
  }), opts);
}

// ----- 4-week success criteria (spec §6) -----
export function successCriteria(state) {
  const { map } = streakInfo(state);
  const last28 = recentDays(state, 28, map);
  const days = last28.filter(d => d.status).length;
  // Days still to come in this 4-week window (since bookends started); while
  // 24 is reachable the streak criterion is pending, not failed.
  const startDay = dayKey((state.bookends && state.bookends.startedAt) || new Date());
  const remaining = last28.filter(d => d.key >= startDay).length < 28
    ? 28 - last28.filter(d => d.key >= startDay).length
    : 0;
  const daysOnPace = days >= 24 ? true : days + remaining >= 24 ? null : false;

  const drive = checkinHistory(state, 'drive_stiffness');
  const driveDelta = drive.length >= 2 ? drive[drive.length - 1].value - drive[0].value : null;

  const start = (state.bookends && state.bookends.startedAt) || '';
  const ff = (state.measurements || []).filter(m => m.kpiId === 'f1_forward_fold').sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const ffBase = ff.filter(m => m.timestamp <= start).pop() || ff[0];
  const ffLast = ff[ff.length - 1];
  const ffDelta = ffBase && ffLast && ffBase !== ffLast ? Math.round((ffLast.rawValue - ffBase.rawValue) * 10) / 10 : null;

  const since = dayKey(addDays(new Date(), -27));
  const tingles28 = (state.tingles || []).filter(t => t.date >= since).length;

  return {
    days, last28, daysOnPace,
    driveDelta, driveLatest: drive.length ? drive[drive.length - 1].value : null,
    ffDelta, ffLatest: ffLast ? ffLast.rawValue : null,
    tingles28,
    reviewBy: (state.bookends && state.bookends.reviewBy) || null,
  };
}
