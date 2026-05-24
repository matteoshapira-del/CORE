import { KPIS, compositeScore, getKpi, recentForKpi } from '../data/kpis.js';

// CORE Index = mean of the user's active KPIs (1..5, one decimal)
export function coreIndex(state) {
  const active = activeKpiIds(state);
  if (!active.length) return null;
  const scores = active
    .map(id => compositeScore(id, state.measurements))
    .filter(s => s != null);
  if (!scores.length) return null;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(avg * 10) / 10;
}

// Baseline CORE Index = first recorded measurement per KPI
export function baselineCoreIndex(state) {
  const active = activeKpiIds(state);
  if (!active.length) return null;
  const scores = [];
  for (const id of active) {
    const all = state.measurements.filter(m => m.kpiId === id)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    if (!all.length) continue;
    if (getKpi(id) && getKpi(id).sided) {
      const l = all.find(m => m.side === 'left');
      const r = all.find(m => m.side === 'right');
      if (l && r) scores.push((l.score + r.score) / 2);
      else scores.push((l || r || all[0]).score);
    } else {
      scores.push(all[0].score);
    }
  }
  if (!scores.length) return null;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(avg * 10) / 10;
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
