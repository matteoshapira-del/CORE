// Cartoon figure illustration for hero card + runtime player.
// Variants reflect the broad exercise category. Always a friendly stylized character.

const SKIN = '#e8b890';
const HAIR = '#2a1810';
const SHIRT = '#d65a40';
const PANTS = '#1a3a52';

// Standing/welcoming figure for Home hero
export function figureStanding(size = 120) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="58" fill="none" stroke="rgba(26,26,26,0.08)" stroke-width="1"/>
    <g transform="translate(60 60)">
      <ellipse cx="0" cy="-28" rx="14" ry="16" fill="${HAIR}"/>
      <circle cx="0" cy="-26" r="11" fill="${SKIN}"/>
      <circle cx="-3" cy="-26" r="1.3" fill="${HAIR}"/>
      <circle cx="3" cy="-26" r="1.3" fill="${HAIR}"/>
      <path d="M -2 -22 Q 0 -20 2 -22" stroke="${HAIR}" stroke-width="1" fill="none" stroke-linecap="round"/>
      <path d="M -16 -10 L -14 24 L 14 24 L 16 -10 Q 12 -16 0 -16 Q -12 -16 -16 -10 Z" fill="${SHIRT}"/>
      <path d="M -16 -8 Q -22 -4 -20 14" stroke="${SKIN}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M 16 -8 Q 22 -4 20 14" stroke="${SKIN}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <rect x="-12" y="22" width="9" height="20" fill="${PANTS}" rx="2"/>
      <rect x="3" y="22" width="9" height="20" fill="${PANTS}" rx="2"/>
    </g>
  </svg>`;
}

// Stretching figure for runtime player (variant by category)
export function figureStretch(size = 170, category = 'stretch') {
  if (category === 'warmup' || category === 'mobility') return figureWarmup(size);
  if (category === 'strength') return figurePlank(size);
  if (category === 'balance') return figureBalance(size);
  return figureFold(size);
}

function figureWarmup(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 170 170" fill="none">
    <g transform="translate(85 85)">
      <ellipse cx="0" cy="-32" rx="18" ry="20" fill="${HAIR}"/>
      <circle cx="0" cy="-30" r="15" fill="${SKIN}"/>
      <circle cx="-4" cy="-30" r="1.5" fill="${HAIR}"/>
      <circle cx="4" cy="-30" r="1.5" fill="${HAIR}"/>
      <path d="M -3 -25 Q 0 -23 3 -25" stroke="${HAIR}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M -22 -10 L -18 30 L 18 30 L 22 -10 Q 18 -16 0 -16 Q -18 -16 -22 -10 Z" fill="${SHIRT}"/>
      <path d="M -22 -8 Q -32 -2 -28 12 Q -26 18 -20 18" stroke="${SKIN}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M 22 -8 Q 32 -2 28 12 Q 26 18 20 18" stroke="${SKIN}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M -18 30 L -16 60 L -4 60 L -2 30 Z" fill="${PANTS}"/>
      <path d="M 18 30 L 16 60 L 4 60 L 2 30 Z" fill="${PANTS}"/>
      <!-- motion arrows around shoulders -->
      <path d="M -36 -14 Q -42 -8 -38 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M -36 -14 L -34 -16 M -36 -14 L -38 -11" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 36 -14 Q 42 -8 38 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 36 -14 L 34 -16 M 36 -14 L 38 -11" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`;
}

function figureFold(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 170 170" fill="none">
    <g transform="translate(85 95)">
      <!-- legs straight to the right -->
      <rect x="-10" y="22" width="56" height="14" rx="5" fill="${PANTS}"/>
      <rect x="42" y="14" width="10" height="22" rx="3" fill="${PANTS}"/>
      <!-- torso folded forward -->
      <ellipse cx="6" cy="6" rx="14" ry="9" fill="${SHIRT}"/>
      <!-- arms reaching forward to toes -->
      <path d="M 12 6 Q 28 12 44 18" stroke="${SKIN}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M 6 6 Q 24 14 42 22" stroke="${SKIN}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <!-- head tucked -->
      <ellipse cx="-2" cy="0" rx="8" ry="9" fill="${HAIR}"/>
      <circle cx="0" cy="2" r="6" fill="${SKIN}"/>
    </g>
  </svg>`;
}

function figurePlank(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 170 170" fill="none">
    <g transform="translate(85 95)">
      <!-- body in plank position, horizontal -->
      <rect x="-40" y="-2" width="80" height="14" rx="6" fill="${SHIRT}"/>
      <!-- head -->
      <circle cx="-46" cy="0" r="10" fill="${SKIN}"/>
      <ellipse cx="-46" cy="-3" rx="11" ry="8" fill="${HAIR}"/>
      <circle cx="-44" cy="0" r="6" fill="${SKIN}"/>
      <!-- legs straight -->
      <rect x="36" y="2" width="32" height="10" rx="4" fill="${PANTS}"/>
      <!-- forearms supporting -->
      <path d="M -38 12 Q -32 22 -22 22" stroke="${SKIN}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <!-- back leg foot -->
      <rect x="64" y="6" width="8" height="6" rx="2" fill="${PANTS}"/>
    </g>
  </svg>`;
}

function figureBalance(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 170 170" fill="none">
    <g transform="translate(85 85)">
      <ellipse cx="0" cy="-44" rx="14" ry="16" fill="${HAIR}"/>
      <circle cx="0" cy="-42" r="11" fill="${SKIN}"/>
      <!-- torso -->
      <path d="M -14 -28 L -10 8 L 10 8 L 14 -28 Z" fill="${SHIRT}"/>
      <!-- arms out -->
      <path d="M -14 -22 Q -28 -14 -34 -2" stroke="${SKIN}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M 14 -22 Q 28 -14 34 -2" stroke="${SKIN}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <!-- standing leg -->
      <rect x="-5" y="8" width="10" height="40" rx="3" fill="${PANTS}"/>
      <!-- raised leg crossing -->
      <path d="M 5 8 Q 16 14 6 26" stroke="${PANTS}" stroke-width="10" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`;
}

// Tiny seated stretch figure for measure-test video block
export function figureMeasureDemo() {
  return `<svg width="120" height="80" viewBox="0 0 120 80" fill="none">
    <line x1="10" y1="55" x2="110" y2="55" stroke="var(--accent)" stroke-width="1" stroke-dasharray="2 2"/>
    <g transform="translate(50 30)">
      <rect x="0" y="22" width="50" height="6" fill="${PANTS}" rx="2"/>
      <rect x="48" y="18" width="6" height="10" fill="${PANTS}" rx="1"/>
      <ellipse cx="8" cy="14" rx="10" ry="6" fill="${SHIRT}"/>
      <path d="M 10 16 Q 25 26 40 28" stroke="${SKIN}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="14" cy="20" r="4" fill="${SKIN}"/>
    </g>
    <path d="M 95 50 L 110 50" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 108 48 L 110 50 L 108 52" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
}

// Welcome/empty radar illustration
export function figureEmptyRadar() {
  return `<svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    <g transform="translate(60 60)" stroke="var(--text-faint)" stroke-width="1" fill="none">
      <polygon points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20"/>
      <polygon points="0,-26 23,-13 23,13 0,26 -23,13 -23,-13"/>
      <polygon points="0,-13 11,-7 11,7 0,13 -11,7 -11,-7"/>
    </g>
  </svg>`;
}
