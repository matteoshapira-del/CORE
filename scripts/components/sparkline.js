// Tiny sparkline from an array of score values (1..5)
export function sparklineSvg(values, w = 36, h = 14) {
  if (!values || values.length === 0) {
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><line x1="0" y1="${h-2}" x2="${w}" y2="${h-2}" stroke="var(--text-faint)" stroke-width="1" stroke-dasharray="2 2"/></svg>`;
  }
  if (values.length === 1) {
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><circle cx="${w/2}" cy="${h/2}" r="2" fill="var(--accent)"/></svg>`;
  }
  const min = 1, max = 5;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><polyline points="${pts.join(' ')}" stroke="var(--accent)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
