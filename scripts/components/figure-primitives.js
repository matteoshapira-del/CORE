// Reusable SVG primitives for cartoon figures. All coordinates are in a
// local space; callers position them with <g transform="translate/rotate(...)">.
//
// Palette (PRD §3):
export const C = {
  skin: '#e8b890',
  skinDark: '#c8946a',
  hair: '#2a1810',
  shirt: '#d65a40',
  shirtDk: '#a8442f',
  pants: '#1a3a52',
  pantsDk: '#0f2538',
  shoe: '#2a1810',
  white: '#ffffff',
  motionArrow: '#ffffff',
};

// Head — circle with hair on top + simple face
// cx,cy is the center of the head (face)
// dir: 'front' | 'side' | 'down' | 'up'
export function head(cx, cy, r = 13, opts = {}) {
  const dir = opts.dir || 'front';
  const hairOffset = opts.hairOffset || 2;
  // Hair as oversized ellipse behind head
  const hair = `<ellipse cx="${cx}" cy="${cy - hairOffset}" rx="${r + 3}" ry="${r + 4}" fill="${C.hair}"/>`;
  const face = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${opts.skin || C.skin}"/>`;
  let features = '';
  if (dir === 'front') {
    features = `
      <circle cx="${cx - r*0.3}" cy="${cy - r*0.05}" r="1.4" fill="${C.hair}"/>
      <circle cx="${cx + r*0.3}" cy="${cy - r*0.05}" r="1.4" fill="${C.hair}"/>
      <path d="M ${cx - r*0.25} ${cy + r*0.35} Q ${cx} ${cy + r*0.55} ${cx + r*0.25} ${cy + r*0.35}" stroke="${C.hair}" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    `;
  } else if (dir === 'side') {
    // facing right
    features = `
      <circle cx="${cx + r*0.4}" cy="${cy}" r="1.3" fill="${C.hair}"/>
      <path d="M ${cx + r*0.3} ${cy + r*0.4} Q ${cx + r*0.55} ${cy + r*0.5} ${cx + r*0.65} ${cy + r*0.3}" stroke="${C.hair}" stroke-width="1" fill="none" stroke-linecap="round"/>
    `;
  } else if (dir === 'down') {
    // looking down — eyes are dots below center
    features = `
      <circle cx="${cx - r*0.3}" cy="${cy + r*0.2}" r="1.2" fill="${C.hair}"/>
      <circle cx="${cx + r*0.3}" cy="${cy + r*0.2}" r="1.2" fill="${C.hair}"/>
    `;
  } else if (dir === 'up') {
    features = `
      <circle cx="${cx - r*0.3}" cy="${cy - r*0.25}" r="1.2" fill="${C.hair}"/>
      <circle cx="${cx + r*0.3}" cy="${cy - r*0.25}" r="1.2" fill="${C.hair}"/>
    `;
  }
  return hair + face + features;
}

// Torso — a rounded rect or oblong. Stylized as the shirt.
// (x,y) is the top-center of torso. h = height, w = width.
export function torso(x, y, w = 28, h = 36, angle = 0, opts = {}) {
  const half = w / 2;
  const color = opts.color || C.shirt;
  // Use path so we can add a slight curve at neck/waist
  return `<g transform="rotate(${angle} ${x} ${y})">
    <path d="M ${x - half + 3} ${y}
             L ${x - half - 1} ${y + h}
             L ${x + half + 1} ${y + h}
             L ${x + half - 3} ${y}
             Q ${x} ${y - 2} ${x - half + 3} ${y} Z"
          fill="${color}"/>
  </g>`;
}

// Arm — drawn as a stroked path with rounded caps. Skin colored.
// (sx,sy) shoulder anchor → (ex,ey) hand end. mid is an optional bend point [mx, my] for elbow.
export function arm(sx, sy, ex, ey, opts = {}) {
  const w = opts.width || 6;
  const color = opts.color || C.skin;
  if (opts.elbow) {
    const [mx, my] = opts.elbow;
    return `<path d="M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
}

// Leg — like arm but slightly thicker. Pants color.
export function leg(sx, sy, ex, ey, opts = {}) {
  const w = opts.width || 9;
  const color = opts.color || C.pants;
  if (opts.knee) {
    const [mx, my] = opts.knee;
    return `<path d="M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
}

// Foot — small ellipse at the end of a leg
export function foot(x, y, angle = 0, opts = {}) {
  return `<ellipse cx="${x}" cy="${y}" rx="${opts.rx || 5}" ry="${opts.ry || 2.5}" fill="${opts.color || C.pants}" transform="rotate(${angle} ${x} ${y})"/>`;
}

// Motion arrow — a thin curved arrow with arrowhead. Used for "this part moves."
// from (x1,y1) curving to (x2,y2) via control (cx,cy). Arrow points at (x2,y2).
export function motionArrow(x1, y1, cx, cy, x2, y2, opts = {}) {
  const color = opts.color || C.motionArrow;
  const w = opts.width || 2;
  // Compute arrowhead direction
  const dx = x2 - cx;
  const dy = y2 - cy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  // Perpendicular for arrowhead wings
  const px = -uy;
  const py = ux;
  const wingLen = 3;
  const ax = x2 - ux * wingLen + px * wingLen;
  const ay = y2 - uy * wingLen + py * wingLen;
  const bx = x2 - ux * wingLen - px * wingLen;
  const by = y2 - uy * wingLen - py * wingLen;
  return `<g>
    <path d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>
    <path d="M ${ax} ${ay} L ${x2} ${y2} L ${bx} ${by}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;
}

// Floor line — a subtle dashed reference floor
export function floorLine(x1, x2, y, opts = {}) {
  const color = opts.color || 'rgba(255,255,255,0.18)';
  return `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="1" stroke-dasharray="3 4"/>`;
}

// Wall — vertical reference, slightly darker than the background
export function wall(x, y1, y2, opts = {}) {
  return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-linecap="round"/>`;
}

// Mat — slim rounded rect on the floor
export function mat(cx, y, w = 80, opts = {}) {
  return `<rect x="${cx - w/2}" y="${y - 2}" width="${w}" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>`;
}

// Bench/box — for hip flexor, couch stretch, etc.
export function bench(cx, y, w = 70, h = 16, opts = {}) {
  return `<rect x="${cx - w/2}" y="${y}" width="${w}" height="${h}" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>`;
}

// Chair — for thoracic ext over chair
export function chair(cx, y, opts = {}) {
  return `<g>
    <rect x="${cx - 18}" y="${y - 8}" width="36" height="6" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)"/>
    <rect x="${cx + 12}" y="${y - 30}" width="6" height="24" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)"/>
    <rect x="${cx - 16}" y="${y - 2}" width="3" height="14" fill="rgba(255,255,255,0.1)"/>
    <rect x="${cx + 13}" y="${y - 2}" width="3" height="14" fill="rgba(255,255,255,0.1)"/>
  </g>`;
}

// Stack/step
export function step(cx, y, w = 50, h = 12) {
  return `<rect x="${cx - w/2}" y="${y}" width="${w}" height="${h}" rx="2" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.22)"/>`;
}

// Wraps a pose body inside a sized viewBox SVG
export function wrapFigure(size, body, vb = 200) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${vb} ${vb}" fill="none">${body}</svg>`;
}
