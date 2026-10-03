import { getExercise } from '../data/exercises.js';

// Sciatica-safe mode (profile.sciaticaSafe). Applied to every routine the
// app builds — Today's pick, CORE FLEX and the bookends — so a move that's
// been ruled out never sneaks back in through the random mix.

// Moves that tension the sciatic nerve (spinal flexion + hip flexion + knee
// extension together) are replaced by gentler equivalents...
const SAFE_SWAP = {
  seated_forward_fold: ['sciatic_nerve_slider', 'supine_hamstring_towel'],
  supine_hamstring_strap: ['supine_hamstring_towel'],
};

// ...or dropped: standing toe-touch holds, long straight-leg forward folds
// and slump positions.
const SAFE_EXCLUDE = new Set([
  'standing_forward_fold',
  'wide_leg_forward_fold',
  'single_leg_forward_fold',
  'standing_hamstring_chair',
  'pilates_spine_stretch',
  'pilates_saw',
  'pilates_roll_up',
  'pilates_roll_over',
  'pilates_open_leg_rocker',
]);

// Three tingles on the same move swap it for a gentler variant. Moves with
// no entry here are simply dropped once swapped.
export const TINGLE_LIMIT = 3;
const TINGLE_ALTERNATE = {
  knees_to_chest_rock: 'knee_to_chest',
  kneeling_hip_flexor: 'standing_hip_flexor',
  reclined_figure4: 'figure4_wall',
  sciatic_nerve_slider: 'sciatic_slider_gentle',
  supine_hamstring_towel: 'supine_9090_hamstring',
  childs_pose: 'childs_pose_supported',
};

export function isSafeMode(state) {
  return !!(state.profile && state.profile.sciaticaSafe);
}

// Tingles count from the last time the user restored the move.
export function tingleCount(state, moveId) {
  const since = (state.bookends && state.bookends.tingleResets && state.bookends.tingleResets[moveId]) || '';
  return (state.tingles || []).filter(t => t.move === moveId && t.timestamp > since).length;
}

export function isTingleSwapped(state, moveId) {
  return tingleCount(state, moveId) >= TINGLE_LIMIT;
}

export function tingleAlternate(moveId) {
  return TINGLE_ALTERNATE[moveId] || null;
}

// Moves currently swapped out by the tingle rule (for Progress).
export function flaggedMoves(state) {
  const ids = [...new Set((state.tingles || []).map(t => t.move))];
  return ids.filter(id => isTingleSwapped(state, id)).map(id => ({
    id,
    name: (getExercise(id) || {}).name || id,
    alternate: tingleAlternate(id) ? (getExercise(tingleAlternate(id)) || {}).name : null,
  }));
}

// Is this exercise id allowed to be *picked* at all (FLEX / Today's pick)?
export function isAllowed(state, id) {
  if (isTingleSwapped(state, id) && !tingleAlternate(id)) return false;
  if (isSafeMode(state) && SAFE_EXCLUDE.has(id)) return false;
  return true;
}

// Resolve one exercise id to the ids that should actually be played.
// Returns [] when the move is dropped.
export function resolveIds(state, id) {
  if (isSafeMode(state) && SAFE_EXCLUDE.has(id)) return [];
  if (isSafeMode(state) && SAFE_SWAP[id]) return SAFE_SWAP[id].flatMap(x => resolveIds(state, x));
  if (isTingleSwapped(state, id)) {
    const alt = tingleAlternate(id);
    return alt && !isTingleSwapped(state, alt) ? [alt] : [];
  }
  return [id];
}

// Apply the rules to a list of exercise objects, de-duplicating.
export function applySafety(state, exercises) {
  const out = [];
  const seen = new Set();
  for (const ex of exercises) {
    for (const id of resolveIds(state, ex.id)) {
      if (seen.has(id)) continue;
      const e = getExercise(id);
      if (!e) continue;
      seen.add(id);
      out.push(e);
    }
  }
  return out;
}
