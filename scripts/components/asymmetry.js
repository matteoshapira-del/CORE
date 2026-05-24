// L/R asymmetry visualization. Tight side gets warm coral; longer side teal.
export function asymmetryHtml({ left, right, unit = 'cm' }) {
  if (left == null || right == null) return '';
  const max = Math.max(Math.abs(left), Math.abs(right), 1);
  const lpct = Math.round((Math.abs(left) / max) * 100);
  const rpct = Math.round((Math.abs(right) / max) * 100);
  const tighter = Math.abs(left) < Math.abs(right) ? 'left' : 'right';
  const lFill = tighter === 'left' ? 'warm' : '';
  const rFill = tighter === 'right' ? 'warm' : '';
  const pct = Math.round(((max - Math.min(Math.abs(left), Math.abs(right))) / max) * 100);
  const note = tighter === 'left'
    ? '"Your left is a bit tighter. Try a few extra reps on that side."'
    : '"Your right is a bit tighter. Try a few extra reps on that side."';
  return `
    <div class="asym-card">
      <div class="hr"><div class="lbl">Left vs Right</div><div class="pct">${pct}% asymmetric</div></div>
      <div class="asym-row"><div class="side">L</div><div class="bar"><div class="fill ${lFill}" style="width:${lpct}%"></div></div><div class="value">${formatVal(left, unit)}</div></div>
      <div class="asym-row"><div class="side">R</div><div class="bar"><div class="fill ${rFill}" style="width:${rpct}%"></div></div><div class="value">${formatVal(right, unit)}</div></div>
      ${pct >= 5 ? `<div class="note">${note}</div>` : ''}
    </div>
  `;
}

function formatVal(v, unit) {
  if (unit === '°') return `${Math.round(v)}°`;
  if (unit === 's') return `${Math.round(v)}s`;
  if (unit === 'qualitative') return `${v}/5`;
  return `${v}${unit}`;
}
