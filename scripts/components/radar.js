// Radar chart with N axes. Values 0..5 each. Renders concentric rings + filled polygon.
// Pass { axes: [{ label, value }], size: 260, labels: true, animate: true }
export function radarSvg({ axes, size = 200, labels = false, animate = false } = {}) {
  const n = axes.length;
  if (n < 3) {
    // Degenerate fallback for fewer than 3 axes
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size*0.4}" fill="rgba(91,192,167,0.1)" stroke="var(--accent)" stroke-width="1"/>
    </svg>`;
  }
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const pointFor = (i, v) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const rad = (v / 5) * r;
    return [cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad];
  };
  const ringPolys = [1, 2, 3, 4, 5].map(level => {
    const pts = axes.map((_, i) => pointFor(i, level).join(',')).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="rgba(91,192,167,0.12)" stroke-width="0.8"/>`;
  }).join('');
  const axisLines = axes.map((_, i) => {
    const [x, y] = pointFor(i, 5);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(91,192,167,0.15)" stroke-width="1"/>`;
  }).join('');
  const fillPts = axes.map((a, i) => pointFor(i, a.value).join(',')).join(' ');
  const polyClass = animate ? 'radar-poly' : '';
  const dotDelay = animate ? 'style="opacity:0;animation:fadeIn 240ms var(--ease) 800ms both;"' : '';
  const dots = axes.map((a, i) => {
    const [x, y] = pointFor(i, a.value);
    return `<circle cx="${x}" cy="${y}" r="2.5" fill="var(--accent)" ${dotDelay}/>`;
  }).join('');
  const labelEls = labels ? axes.map((a, i) => {
    const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const lx = cx + Math.cos(angle) * (r + 12);
    const ly = cy + Math.sin(angle) * (r + 12);
    const anchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';
    const short = (a.label || '').slice(0, 7);
    return `<text x="${lx}" y="${ly}" text-anchor="${anchor}" fill="var(--text-muted)" font-size="8.5" font-family="Outfit" font-weight="600" dominant-baseline="middle">${short}</text>`;
  }).join('') : '';
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    ${ringPolys}
    ${axisLines}
    <polygon class="${polyClass}" points="${fillPts}" fill="rgba(91,192,167,0.28)" stroke="var(--accent)" stroke-width="1.8"/>
    ${dots}
    ${labelEls}
  </svg>`;
}
