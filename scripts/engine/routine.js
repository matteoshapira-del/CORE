import { AREAS, getArea } from '../data/areas.js';
import { EXERCISES, exercisesForArea } from '../data/exercises.js';
import { getKpi } from '../data/kpis.js';
import { applySafety } from './safety.js';

// Pick today's routine. Rotation: cycle through selected areas day by day,
// pair two complementary areas, target ~7–10 minutes total.
export function pickTodayRoutine(state) {
  const selected = state.selectedAreas.length ? state.selectedAreas : ['hips', 'hamstrings'];
  const dayIndex = daysSinceStart(state);
  const primary = selected[dayIndex % selected.length];
  const secondary = selected[(dayIndex + 1) % selected.length];
  const areas = primary === secondary ? [primary] : [primary, secondary];
  return buildRoutine(areas, { targetSec: 8 * 60, state });
}

// Suggest a few alternate routine options
export function listRoutineOptions(state) {
  const selected = state.selectedAreas.length ? state.selectedAreas : ['hips', 'hamstrings'];
  const dayIndex = daysSinceStart(state);
  const options = [];
  for (let i = 0; i < Math.min(selected.length, 4); i++) {
    const a = selected[(dayIndex + i) % selected.length];
    const b = selected[(dayIndex + i + 1) % selected.length];
    const areas = a === b ? [a] : [a, b];
    options.push(buildRoutine(areas, { targetSec: 7 * 60, seed: i, state }));
  }
  return options;
}

function buildRoutine(areaIds, opts = {}) {
  const targetSec = opts.targetSec || 7 * 60;
  const seed = opts.seed || 0;
  // Gather candidates across the selected areas
  const pool = [];
  for (const a of areaIds) pool.push(...exercisesForArea(a));

  // Add useful cross-area exercises that target shared KPIs
  const areaKpis = new Set();
  for (const a of areaIds) {
    const ar = getArea(a);
    if (!ar) continue;
    ar.primaryKpis.forEach(k => areaKpis.add(k));
    ar.secondaryKpis.forEach(k => areaKpis.add(k));
  }
  for (const ex of EXERCISES) {
    if (pool.includes(ex)) continue;
    if (ex.primaryKpis.some(k => areaKpis.has(k))) pool.push(ex);
  }

  // Group: 1 warmup, then a mix of stretch+strength balanced by area, end with longer stretch
  const seen = new Set();
  let unique = pool.filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true; });
  if (opts.state) unique = applySafety(opts.state, unique);
  const warmups = unique.filter(e => e.category === 'warmup');
  const stretches = unique.filter(e => e.category === 'stretch');
  const strengths = unique.filter(e => e.category === 'strength');

  const ordered = [];
  if (warmups.length) ordered.push(rotPick(warmups, seed));
  // Build by alternating area + category
  const targets = [];
  // 3 stretches biased to primary, then 1 strength, then 2 more stretches
  const order = ['stretch', 'stretch', 'strength', 'stretch', 'strength', 'stretch', 'stretch'];
  let stretchIdx = 0, strengthIdx = 0;
  for (const cat of order) {
    const list = cat === 'stretch' ? stretches : strengths;
    if (!list.length) continue;
    const pickIdx = cat === 'stretch' ? stretchIdx++ : strengthIdx++;
    const idx = (pickIdx + seed) % list.length;
    const pick = list[idx];
    if (!ordered.includes(pick)) ordered.push(pick);
  }
  // Trim/extend to target duration
  let total = ordered.reduce((s, e) => s + (e.durationSec || 30), 0);
  const fallback = [...stretches, ...strengths, ...warmups].filter(e => !ordered.includes(e));
  let fi = 0;
  while (total < targetSec && fi < fallback.length) {
    ordered.push(fallback[fi++]);
    total = ordered.reduce((s, e) => s + (e.durationSec || 30), 0);
  }
  while (ordered.length > 9 && total > targetSec + 60) {
    const removed = ordered.pop();
    total -= removed.durationSec || 30;
  }

  const title = areaIds.length === 1
    ? `${getArea(areaIds[0]).name}`
    : `${getArea(areaIds[0]).name} & ${getArea(areaIds[1]).name}`;
  const pastel = getArea(areaIds[0]).pastel;
  const targetedKpis = collectKpis(ordered);

  return {
    id: `r_${areaIds.join('+')}`,
    title,
    areas: areaIds,
    pastel,
    exercises: ordered,
    durationSec: total,
    kpisTargeted: targetedKpis,
  };
}

function rotPick(arr, seed) { return arr[seed % arr.length]; }

function collectKpis(exercises) {
  const out = new Set();
  for (const e of exercises) e.primaryKpis.forEach(k => out.add(k));
  return [...out];
}

function daysSinceStart(state) {
  const created = state.profile && state.profile.createdAt;
  if (!created) return 0;
  return Math.floor((Date.now() - new Date(created).getTime()) / 86400000);
}
