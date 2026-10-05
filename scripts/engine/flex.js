import { getExercise, EXERCISES } from '../data/exercises.js';
import { isAllowed, applySafety } from './safety.js';

// CORE FLEX — a quick randomized full-body routine drawn from 12 movement
// families. Every family maps to one or more exercises in the library;
// a build picks at most one exercise per family first, then (on Hard)
// tops up with unused exercises from the multi-option families.
const FLEX_GROUPS = [
  { key: 'down_dog',       ids: ['down_dog'] },
  { key: 'shoulder_rolls', ids: ['shoulder_rolls'] },
  { key: 'sun_salute',     ids: ['sun_salute'] },
  { key: 'bridge',         ids: ['glute_bridge', 'pilates_bridge'] },
  { key: 'hamstrings',     ids: ['standing_forward_fold', 'seated_forward_fold', 'supine_hamstring_strap', 'single_leg_forward_fold', 'standing_hamstring_chair'] },
  { key: 'double_leg',     ids: ['pilates_double_leg_stretch'] },
  { key: 'single_leg',     ids: ['pilates_single_leg_stretch'] },
  { key: 'leg_raises',     ids: ['leg_lowers'] },
  { key: 'cobra',          ids: ['cobra'] },
  { key: 'neck',           ids: ['neck_flexion', 'neck_rotation', 'ear_to_shoulder', 'upper_trap_stretch'] },
  { key: 'roll_up',        ids: ['pilates_roll_up'] },
  { key: 'surf',           ids: ['worlds_greatest_stretch', 'pigeon_pose', 'deep_squat_hold', 'lizard_pose', 'cossack_squat'] },
];

export const FLEX_LEVELS = {
  easy:   { label: 'Easy', min: 4,  max: 6 },
  medium: { label: 'Med',  min: 8,  max: 10 },
  hard:   { label: 'Hard', min: 12, max: 14 },
};

// Deterministic PRNG — the player resolves routines by re-generating them
// from the id, so `r_flex_<level>_<seed>` must always rebuild identically.
export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, rand) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// With state: a random mix drawn from the user's focus areas (body map),
// round-robin across areas so every checked area is represented, with
// sciatica-safe exclusions/swaps applied. Without state: the original
// 12-family full-body mix.
export function buildFlexRoutine(difficulty, seed, state) {
  const level = FLEX_LEVELS[difficulty] || FLEX_LEVELS.medium;
  const rand = mulberry32(seed);
  const count = level.min + Math.floor(rand() * (level.max - level.min + 1));

  let picks;
  if (state) {
    const focus = (state.selectedAreas && state.selectedAreas.length) ? state.selectedAreas : ['lower_back', 'hips', 'glutes', 'hamstrings'];
    const pools = focus.map(a => shuffle(EXERCISES.filter(e => e.area === a && isAllowed(state, e.id)).map(e => e.id), rand)).filter(p => p.length);
    // Top up thin selections with full-body moves so Hard still has enough.
    const total = pools.reduce((n, p) => n + p.length, 0);
    if (total < count) pools.push(shuffle(EXERCISES.filter(e => e.area === 'full_body' && isAllowed(state, e.id)).map(e => e.id), rand));
    const order = shuffle(pools.map((_, i) => i), rand);
    picks = [];
    while (picks.length < count && pools.some(p => p.length)) {
      for (const i of order) {
        if (picks.length >= count) break;
        const id = pools[i].shift();
        if (id && !picks.includes(id)) picks.push(id);
      }
    }
  } else {
    picks = [];
    for (const g of shuffle([...FLEX_GROUPS], rand)) {
      if (picks.length >= count) break;
      picks.push(g.ids[Math.floor(rand() * g.ids.length)]);
    }
  }

  let exercises = picks.map(getExercise).filter(Boolean);
  if (state) exercises = applySafety(state, exercises);
  // Warmups open the routine; everything else keeps its shuffled order.
  exercises.sort((a, b) => (a.category === 'warmup' ? 0 : 1) - (b.category === 'warmup' ? 0 : 1));

  return {
    id: `r_flex_${difficulty}_${seed}`,
    title: `Core Flex · ${level.label}`,
    areas: state ? [...new Set(exercises.map(e => e.area))] : ['full_body'],
    pastel: 'var(--pastel-lavender)',
    exercises,
    durationSec: exercises.reduce((s, e) => s + (e.durationSec || 30), 0),
    kpisTargeted: [...new Set(exercises.flatMap(e => e.primaryKpis))],
  };
}

// Resolve a flex routine from its id; null if the id isn't a flex routine.
export function getFlexRoutine(routineId, state) {
  const m = /^r_flex_(easy|medium|hard)_(\d+)$/.exec(routineId || '');
  if (!m) return null;
  return buildFlexRoutine(m[1], Number(m[2]), state);
}

export function newFlexSeed() {
  return Math.floor(Math.random() * 0xffffffff);
}
