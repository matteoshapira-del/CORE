import { KPIS, compositeScore, getKpi, recentForKpi } from '../data/kpis.js';

// CORE Index = mean of the user's active KPIs (1..5, one decimal)
export function coreIndex(state) {
  const active = activeKpiIds(state);
  if (!active.length) return null;
  const pairs = active
    .map(id => [id, compositeScore(id, state.measurements)])
    .filter(([, s]) => s != null);
  return weightedMean(pairs);
}

// Bookends spec §4: the lower back and hips are the target, so their KPIs
// count more; Neck ROM and Butterfly are kept but de-prioritised.
export const KPI_WEIGHTS = {
  f1_forward_fold: 2,
  f3_hip_flexor: 2,
  f2_slr: 1.5,
  c4_extensor: 1.5,
  f8_cervical_rom: 0.5,
  f9_butterfly: 0.5,
};
export function kpiWeight(id) { return KPI_WEIGHTS[id] ?? 1; }

function weightedMean(pairs) {
  if (!pairs.length) return null;
  let sum = 0, w = 0;
  for (const [id, s] of pairs) { sum += s * kpiWeight(id); w += kpiWeight(id); }
  return Math.round((sum / w) * 10) / 10;
}

// Baseline CORE Index = first recorded measurement per KPI
export function baselineCoreIndex(state) {
  const active = activeKpiIds(state);
  if (!active.length) return null;
  const pairs = [];
  for (const id of active) {
    const all = state.measurements.filter(m => m.kpiId === id)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    if (!all.length) continue;
    if (getKpi(id) && getKpi(id).sided) {
      const l = all.find(m => m.side === 'left');
      const r = all.find(m => m.side === 'right');
      // Same rounding as compositeScore, so no change reads as no change.
      if (l && r) pairs.push([id, Math.round((l.score + r.score) / 2)]);
      else pairs.push([id, (l || r || all[0]).score]);
    } else {
      pairs.push([id, all[0].score]);
    }
  }
  return weightedMean(pairs);
}

export function activeKpiIds(state) {
  if (state.activeKpis && state.activeKpis.length) return state.activeKpis;
  // Derive from selected areas via KPI.areas
  const set = new Set();
  for (const k of KPIS) {
    if (k.areas.some(a => state.selectedAreas.includes(a))) set.add(k.id);
  }
  return [...set];
}

// Find the lowest-scoring active KPI ("weakest link")
export function weakestKpi(state) {
  const ids = activeKpiIds(state);
  let weakest = null;
  let lowest = 6;
  for (const id of ids) {
    const score = compositeScore(id, state.measurements);
    if (score == null) continue;
    if (score < lowest) { lowest = score; weakest = id; }
  }
  return weakest;
}

// Which KPIs are "stale" (need re-measure)
export function staleKpis(state) {
  const cadence = state.preferences.remeasureCadenceDays || 14;
  const cutoff = Date.now() - cadence * 86400000;
  const ids = activeKpiIds(state);
  return ids.filter(id => {
    const recent = recentForKpi(id, state.measurements);
    if (!recent.length) return false;
    return new Date(recent[0].timestamp).getTime() < cutoff;
  });
}

// Asymmetry % for sided KPI (most-recent L vs R)
export function asymmetryPct(kpiId, measurements) {
  const k = getKpi(kpiId);
  if (!k || !k.sided) return null;
  const recent = recentForKpi(kpiId, measurements);
  const l = recent.find(m => m.side === 'left');
  const r = recent.find(m => m.side === 'right');
  if (!l || !r) return null;
  const lv = l.rawValue ?? 0;
  const rv = r.rawValue ?? 0;
  const hi = Math.max(lv, rv);
  const lo = Math.min(lv, rv);
  if (hi <= 0) return 0;
  return Math.round(((hi - lo) / hi) * 100);
}
