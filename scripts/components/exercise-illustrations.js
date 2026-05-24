// One distinct illustration per exercise. Each pose function takes a `size`
// and returns an SVG string. Composed from primitives in figure-primitives.js.
import {
  C, head, torso, arm, leg, foot, motionArrow, floorLine, wall, mat, bench, chair, step, wrapFigure,
} from './figure-primitives.js';

const VB = 200;
const CX = VB / 2;
const CY = VB / 2;

// ===== NECK =====

export function poseChinTuck(size) {
  // Standing, chin pulled back. Arrow pointing back at chin.
  const headCx = CX, headCy = CY - 30;
  const body = `
    ${head(headCx, headCy, 13, { dir: 'side' })}
    ${torso(CX, CY - 16, 28, 38)}
    ${arm(CX - 14, CY - 14, CX - 18, CY + 14)}
    ${arm(CX + 14, CY - 14, CX + 18, CY + 14)}
    ${leg(CX - 6, CY + 22, CX - 7, CY + 60)}
    ${leg(CX + 6, CY + 22, CX + 7, CY + 60)}
    ${foot(CX - 7, CY + 62, 0)}
    ${foot(CX + 7, CY + 62, 0)}
    ${motionArrow(headCx + 28, headCy - 4, headCx + 32, headCy, headCx + 22, headCy + 2, { color: '#fff' })}
  `;
  return wrapFigure(size, body);
}

export function poseNeckFlexion(size) {
  // Head dropped to chest
  const headCx = CX, headCy = CY - 20;
  const body = `
    ${head(headCx, headCy, 12, { dir: 'down' })}
    ${torso(CX, CY - 12, 28, 38)}
    ${arm(CX - 14, CY - 8, CX - 6, CY + 16, { elbow: [CX - 10, CY + 4] })}
    ${arm(CX + 14, CY - 8, CX + 6, CY + 16, { elbow: [CX + 10, CY + 4] })}
    ${leg(CX - 6, CY + 26, CX - 7, CY + 64)}
    ${leg(CX + 6, CY + 26, CX + 7, CY + 64)}
    ${foot(CX - 7, CY + 66)}
    ${foot(CX + 7, CY + 66)}
    ${motionArrow(headCx + 22, headCy - 6, headCx + 26, headCy + 6, headCx + 10, headCy + 18, { color: '#fff' })}
  `;
  return wrapFigure(size, body);
}

export function poseNeckExtension(size) {
  // Looking up
  const headCx = CX, headCy = CY - 32;
  const body = `
    ${head(headCx, headCy, 12, { dir: 'up' })}
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX - 14, CY - 10, CX - 16, CY + 18)}
    ${arm(CX + 14, CY - 10, CX + 16, CY + 18)}
    ${leg(CX - 6, CY + 24, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 24, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
    ${motionArrow(headCx + 20, headCy + 14, headCx + 24, headCy + 2, headCx + 12, headCy - 14, { color: '#fff' })}
  `;
  return wrapFigure(size, body);
}

export function poseNeckLateral(size) {
  // Ear to shoulder (tilted right)
  const headCx = CX + 8, headCy = CY - 26;
  const body = `
    <g transform="rotate(28 ${headCx} ${headCy})">${head(headCx, headCy, 12)}</g>
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX - 14, CY - 10, CX - 18, CY + 18)}
    ${arm(CX + 14, CY - 10, CX + 18, CY + 18)}
    ${leg(CX - 6, CY + 24, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 24, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
    ${motionArrow(headCx - 18, headCy - 16, headCx - 10, headCy + 2, headCx, headCy + 8, { color: '#fff' })}
  `;
  return wrapFigure(size, body);
}

export function poseNeckRotation(size) {
  // Head turned to side (showing 3/4 profile)
  const headCx = CX, headCy = CY - 28;
  const body = `
    ${head(headCx, headCy, 12, { dir: 'side' })}
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX - 14, CY - 10, CX - 18, CY + 18)}
    ${arm(CX + 14, CY - 10, CX + 18, CY + 18)}
    ${leg(CX - 6, CY + 24, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 24, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
    ${motionArrow(headCx - 18, headCy + 6, headCx, headCy + 14, headCx + 20, headCy + 6, { color: '#fff' })}
  `;
  return wrapFigure(size, body);
}

export function poseUpperTrap(size) {
  // Head tilted + arm pulled down behind back
  const headCx = CX + 4, headCy = CY - 26;
  const body = `
    <g transform="rotate(24 ${headCx} ${headCy})">${head(headCx, headCy, 12)}</g>
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX - 14, CY - 10, CX - 4, CY + 6, { elbow: [CX - 16, CY + 2] })}
    ${arm(CX + 14, CY - 10, CX + 26, CY - 20, { elbow: [CX + 22, CY - 16] })}
    ${leg(CX - 6, CY + 24, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 24, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
  `;
  return wrapFigure(size, body);
}

export function poseLevator(size) {
  // Looking down to opposite armpit, hand assist
  const headCx = CX + 6, headCy = CY - 18;
  const body = `
    <g transform="rotate(36 ${headCx} ${headCy})">${head(headCx, headCy, 12, { dir: 'down' })}</g>
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX + 14, CY - 10, CX + 4, CY - 24, { elbow: [CX + 18, CY - 22] })}
    ${arm(CX - 14, CY - 10, CX - 18, CY + 16)}
    ${leg(CX - 6, CY + 24, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 24, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
  `;
  return wrapFigure(size, body);
}

export function poseScalene(size) {
  // Tilted back + rotated
  const headCx = CX + 6, headCy = CY - 30;
  const body = `
    <g transform="rotate(-22 ${headCx} ${headCy})">${head(headCx, headCy, 12, { dir: 'up' })}</g>
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX - 14, CY - 10, CX - 18, CY + 18)}
    ${arm(CX + 14, CY - 10, CX + 18, CY + 18)}
    ${leg(CX - 6, CY + 24, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 24, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
  `;
  return wrapFigure(size, body);
}

// ===== SHOULDERS =====

export function poseShoulderRolls(size) {
  // Standing, arms relaxed, motion arrows by shoulders
  const headCx = CX, headCy = CY - 32;
  const body = `
    ${head(headCx, headCy, 13)}
    ${torso(CX, CY - 16, 28, 38)}
    ${arm(CX - 14, CY - 12, CX - 16, CY + 20)}
    ${arm(CX + 14, CY - 12, CX + 16, CY + 20)}
    ${leg(CX - 6, CY + 24, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 24, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
    <g><circle cx="${CX - 14}" cy="${CY - 12}" r="14" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.7"/>
    ${motionArrow(CX - 26, CY - 16, CX - 22, CY - 22, CX - 14, CY - 24, { color: '#fff' })}</g>
    <g><circle cx="${CX + 14}" cy="${CY - 12}" r="14" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.7"/>
    ${motionArrow(CX + 26, CY - 16, CX + 22, CY - 22, CX + 14, CY - 24, { color: '#fff' })}</g>
  `;
  return wrapFigure(size, body);
}

export function poseCrossBodyShoulder(size) {
  // One arm pulled across chest
  const headCx = CX, headCy = CY - 30;
  const body = `
    ${head(headCx, headCy, 13)}
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX - 14, CY - 10, CX + 18, CY + 4, { elbow: [CX + 4, CY - 4] })}
    ${arm(CX + 14, CY - 10, CX + 8, CY - 4, { elbow: [CX + 22, CY - 4] })}
    ${leg(CX - 6, CY + 26, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 26, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
  `;
  return wrapFigure(size, body);
}

export function poseEagleArms(size) {
  // Arms wrapped around each other, lifted in front
  const headCx = CX, headCy = CY - 30;
  const body = `
    ${head(headCx, headCy, 13)}
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX - 14, CY - 10, CX + 2, CY - 28, { elbow: [CX, CY - 6] })}
    ${arm(CX + 14, CY - 10, CX - 2, CY - 28, { elbow: [CX, CY - 6] })}
    ${leg(CX - 6, CY + 26, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 26, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
  `;
  return wrapFigure(size, body);
}

export function poseCowFaceArms(size) {
  // One hand reaches up over shoulder, other up from behind
  const headCx = CX, headCy = CY - 30;
  const body = `
    ${head(headCx, headCy, 13)}
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX - 14, CY - 10, CX, CY - 28, { elbow: [CX - 22, CY - 28] })}
    ${arm(CX + 14, CY - 10, CX - 2, CY + 6, { elbow: [CX + 22, CY + 8] })}
    ${leg(CX - 6, CY + 26, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 26, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
  `;
  return wrapFigure(size, body);
}

export function poseReversePrayer(size) {
  // Hands clasped behind back. Back view.
  const headCx = CX, headCy = CY - 30;
  const body = `
    ${head(headCx, headCy, 13)}
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX - 14, CY - 10, CX, CY + 6, { elbow: [CX - 22, CY + 4] })}
    ${arm(CX + 14, CY - 10, CX, CY + 6, { elbow: [CX + 22, CY + 4] })}
    ${leg(CX - 6, CY + 26, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 26, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
  `;
  return wrapFigure(size, body);
}

export function poseDoorwayPec(size) {
  // Beside a doorframe (vertical line), forearm on frame, leaning through
  const body = `
    ${wall(CX + 30, CY - 50, CY + 60)}
    ${head(CX - 4, CY - 28, 12, { dir: 'side' })}
    ${torso(CX - 6, CY - 14, 26, 36, -8)}
    ${arm(CX + 8, CY - 10, CX + 30, CY - 22, { elbow: [CX + 24, CY - 14] })}
    ${arm(CX - 18, CY - 8, CX - 14, CY + 16)}
    ${leg(CX - 6, CY + 26, CX - 14, CY + 62, { knee: [CX - 14, CY + 42] })}
    ${leg(CX + 6, CY + 26, CX + 6, CY + 62)}
    ${foot(CX - 14, CY + 64)}
    ${foot(CX + 6, CY + 64)}
  `;
  return wrapFigure(size, body);
}

export function poseSleeperStretch(size) {
  // Side-lying, bottom arm 90°, pushing toward floor
  const body = `
    ${floorLine(20, 180, CY + 30)}
    ${head(CX - 50, CY + 8, 12, { dir: 'side' })}
    <ellipse cx="${CX + 4}" cy="${CY + 14}" rx="38" ry="14" fill="${C.shirt}"/>
    ${arm(CX - 30, CY + 8, CX - 30, CY + 30, { elbow: [CX - 26, CY + 18] })}
    ${arm(CX - 30, CY + 8, CX - 8, CY + 26)}
    ${leg(CX + 36, CY + 18, CX + 64, CY + 18)}
    ${leg(CX + 36, CY + 22, CX + 60, CY + 24)}
    ${motionArrow(CX - 12, CY + 16, CX - 16, CY + 24, CX - 22, CY + 30, { color: '#fff' })}
  `;
  return wrapFigure(size, body);
}

export function poseWallSlide(size) {
  // Back to wall, arms in W ready to slide up to Y
  const body = `
    ${wall(CX - 28, CY - 50, CY + 60)}
    ${head(CX - 14, CY - 30, 12, { dir: 'side' })}
    ${torso(CX - 12, CY - 16, 26, 38, 2)}
    ${arm(CX, CY - 12, CX + 6, CY - 30, { elbow: [CX + 16, CY - 20] })}
    ${arm(CX - 22, CY - 12, CX - 18, CY - 30, { elbow: [CX - 30, CY - 20] })}
    ${leg(CX - 14, CY + 24, CX - 14, CY + 62)}
    ${leg(CX + 2, CY + 24, CX + 2, CY + 62)}
    ${foot(CX - 14, CY + 64)}
    ${foot(CX + 2, CY + 64)}
    ${motionArrow(CX + 6, CY - 22, CX + 12, CY - 38, CX + 12, CY - 50, { color: '#fff' })}
  `;
  return wrapFigure(size, body);
}

export function poseThreadNeedle(size) {
  // Quadruped, one arm threaded across
  const body = `
    ${floorLine(20, 180, CY + 36)}
    <ellipse cx="${CX}" cy="${CY + 4}" rx="32" ry="14" fill="${C.shirt}"/>
    ${head(CX - 22, CY + 16, 12, { dir: 'down' })}
    ${arm(CX + 20, CY + 4, CX - 10, CY + 30, { elbow: [CX + 4, CY + 20] })}
    ${arm(CX - 20, CY + 4, CX - 20, CY + 26, { elbow: [CX - 26, CY + 16] })}
    ${leg(CX + 18, CY + 16, CX + 32, CY + 34, { knee: [CX + 30, CY + 26] })}
    ${leg(CX + 4, CY + 16, CX + 20, CY + 34, { knee: [CX + 16, CY + 26] })}
  `;
  return wrapFigure(size, body);
}

export function poseChildsPose(size) {
  // Sitting on heels, arms reaching forward, body folded
  const body = `
    ${floorLine(20, 180, CY + 34)}
    <ellipse cx="${CX + 6}" cy="${CY + 14}" rx="32" ry="10" fill="${C.shirt}"/>
    ${head(CX - 22, CY + 12, 12)}
    ${arm(CX - 8, CY + 12, CX - 36, CY + 30, { elbow: [CX - 26, CY + 18] })}
    ${arm(CX - 8, CY + 16, CX - 38, CY + 32, { elbow: [CX - 28, CY + 22] })}
    <ellipse cx="${CX + 24}" cy="${CY + 22}" rx="14" ry="10" fill="${C.pants}"/>
    <rect x="${CX + 32}" y="${CY + 20}" width="14" height="6" rx="2" fill="${C.pants}"/>
  `;
  return wrapFigure(size, body);
}

export function posePendulum(size) {
  // Bent forward, one arm dangling
  const body = `
    ${floorLine(20, 180, CY + 56)}
    ${head(CX + 4, CY - 12, 12, { dir: 'down' })}
    <ellipse cx="${CX + 4}" cy="${CY + 4}" rx="20" ry="14" fill="${C.shirt}"/>
    ${arm(CX - 8, CY + 12, CX - 14, CY + 32, { elbow: [CX - 14, CY + 22] })}
    ${arm(CX + 16, CY + 8, CX + 30, CY + 14)}
    ${leg(CX - 4, CY + 18, CX - 8, CY + 54)}
    ${leg(CX + 12, CY + 18, CX + 14, CY + 54)}
    ${foot(CX - 8, CY + 56)}
    ${foot(CX + 14, CY + 56)}
    ${motionArrow(CX - 26, CY + 30, CX - 14, CY + 38, CX - 2, CY + 32, { color: '#fff' })}
  `;
  return wrapFigure(size, body);
}

// ===== UPPER BACK / CHEST =====

export function poseCatCow(size) {
  // Quadruped, rounded back
  const body = `
    ${floorLine(20, 180, CY + 40)}
    <path d="M ${CX - 30} ${CY + 4} Q ${CX} ${CY - 16} ${CX + 30} ${CY + 4} Q ${CX + 30} ${CY + 12} ${CX + 24} ${CY + 14} Q ${CX} ${CY - 6} ${CX - 24} ${CY + 14} Q ${CX - 30} ${CY + 12} ${CX - 30} ${CY + 4} Z" fill="${C.shirt}"/>
    ${head(CX - 32, CY + 10, 11, { dir: 'down' })}
    ${arm(CX - 24, CY + 14, CX - 26, CY + 36)}
    ${leg(CX + 22, CY + 14, CX + 30, CY + 38, { knee: [CX + 28, CY + 28] })}
    ${leg(CX + 10, CY + 14, CX + 18, CY + 38, { knee: [CX + 16, CY + 28] })}
    ${arm(CX - 14, CY + 12, CX - 16, CY + 36)}
  `;
  return wrapFigure(size, body);
}

export function poseThoracicExtChair(size) {
  // Sit on chair, lean back over chair-back, arms overhead
  const body = `
    ${chair(CX, CY + 30)}
    ${head(CX - 8, CY - 12, 12, { dir: 'up' })}
    <path d="M ${CX - 16} ${CY - 2} Q ${CX} ${CY - 20} ${CX + 16} ${CY - 2} Q ${CX + 16} ${CY + 16} ${CX - 16} ${CY + 16} Z" fill="${C.shirt}"/>
    ${arm(CX - 8, CY, CX - 28, CY - 30, { elbow: [CX - 22, CY - 14] })}
    ${arm(CX + 8, CY, CX - 14, CY - 32, { elbow: [CX + 2, CY - 18] })}
    ${leg(CX - 6, CY + 18, CX - 8, CY + 50, { knee: [CX - 8, CY + 36] })}
    ${leg(CX + 6, CY + 18, CX + 8, CY + 50, { knee: [CX + 8, CY + 36] })}
  `;
  return wrapFigure(size, body);
}

export function poseOpenBook(size) {
  // Side-lying, top arm opening up
  const body = `
    ${floorLine(20, 180, CY + 30)}
    ${head(CX - 50, CY + 14, 12, { dir: 'side' })}
    <ellipse cx="${CX + 6}" cy="${CY + 18}" rx="38" ry="12" fill="${C.shirt}"/>
    ${arm(CX - 26, CY + 14, CX + 24, CY - 20, { elbow: [CX, CY - 6] })}
    ${arm(CX - 26, CY + 18, CX - 4, CY + 26)}
    ${leg(CX + 40, CY + 22, CX + 26, CY + 8, { knee: [CX + 38, CY + 8] })}
    ${leg(CX + 40, CY + 26, CX + 22, CY + 16, { knee: [CX + 36, CY + 14] })}
  `;
  return wrapFigure(size, body);
}

export function poseBearHug(size) {
  // Standing, arms crossed over chest hugging self
  const headCx = CX, headCy = CY - 30;
  const body = `
    ${head(headCx, headCy, 13)}
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX - 14, CY - 10, CX + 12, CY + 10, { elbow: [CX + 6, CY - 4] })}
    ${arm(CX + 14, CY - 10, CX - 12, CY + 10, { elbow: [CX - 6, CY - 4] })}
    ${leg(CX - 6, CY + 26, CX - 7, CY + 62)}
    ${leg(CX + 6, CY + 26, CX + 7, CY + 62)}
    ${foot(CX - 7, CY + 64)}
    ${foot(CX + 7, CY + 64)}
  `;
  return wrapFigure(size, body);
}

export function poseCornerStretch(size) {
  // Corner — two walls meeting; figure leaning in
  const body = `
    ${wall(CX - 32, CY - 50, CY + 60)}
    ${wall(CX + 32, CY - 50, CY + 60)}
    <line x1="${CX - 32}" y1="${CY + 60}" x2="${CX + 32}" y2="${CY + 60}" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
    ${head(CX, CY - 26, 12, { dir: 'side' })}
    ${torso(CX, CY - 12, 26, 38)}
    ${arm(CX - 14, CY - 8, CX - 32, CY - 18, { elbow: [CX - 26, CY - 14] })}
    ${arm(CX + 14, CY - 8, CX + 32, CY - 18, { elbow: [CX + 26, CY - 14] })}
    ${leg(CX - 6, CY + 26, CX - 8, CY + 58)}
    ${leg(CX + 6, CY + 26, CX + 8, CY + 58)}
    ${foot(CX - 8, CY + 60)}
    ${foot(CX + 8, CY + 60)}
  `;
  return wrapFigure(size, body);
}

export function poseProneY(size) {
  // Prone, arms in Y, lift slightly
  const body = `
    ${floorLine(20, 180, CY + 24)}
    ${head(CX, CY + 4, 11, { dir: 'down' })}
    <ellipse cx="${CX}" cy="${CY + 16}" rx="14" ry="32" fill="${C.shirt}"/>
    ${arm(CX - 10, CY + 4, CX - 36, CY - 24)}
    ${arm(CX + 10, CY + 4, CX + 36, CY - 24)}
    ${leg(CX - 6, CY + 46, CX - 8, CY + 22, { knee: [CX - 8, CY + 34] })}
    ${leg(CX + 6, CY + 46, CX + 8, CY + 22, { knee: [CX + 8, CY + 34] })}
  `;
  return wrapFigure(size, body);
}

export function poseReclinedButterfly(size) {
  // Supine, soles together, arms overhead
  const body = `
    ${floorLine(20, 180, CY + 28)}
    ${head(CX, CY - 38, 11)}
    <ellipse cx="${CX}" cy="${CY - 14}" rx="14" ry="20" fill="${C.shirt}"/>
    ${arm(CX - 10, CY - 30, CX - 30, CY - 50)}
    ${arm(CX + 10, CY - 30, CX + 30, CY - 50)}
    ${leg(CX - 8, CY + 4, CX, CY + 24, { knee: [CX - 28, CY + 14] })}
    ${leg(CX + 8, CY + 4, CX, CY + 24, { knee: [CX + 28, CY + 14] })}
    ${foot(CX, CY + 24)}
  `;
  return wrapFigure(size, body);
}

// ===== LOWER BACK / CORE POSTERIOR =====

export function poseKneeToChest(size) {
  // Supine, one knee pulled to chest
  const body = `
    ${floorLine(20, 180, CY + 28)}
    ${head(CX - 40, CY + 4, 11, { dir: 'side' })}
    <ellipse cx="${CX - 14}" cy="${CY + 12}" rx="20" ry="12" fill="${C.shirt}"/>
    ${arm(CX, CY + 4, CX + 18, CY - 8, { elbow: [CX + 10, CY - 6] })}
    ${arm(CX, CY + 8, CX + 14, CY - 4)}
    ${leg(CX + 4, CY + 18, CX + 18, CY - 8, { knee: [CX + 22, CY] })}
    ${leg(CX + 6, CY + 18, CX + 30, CY + 18)}
  `;
  return wrapFigure(size, body);
}

export function poseCobra(size) {
  // Prone, press up on hands
  const body = `
    ${floorLine(20, 180, CY + 24)}
    ${head(CX - 22, CY - 14, 12, { dir: 'up' })}
    <path d="M ${CX - 14} ${CY - 4} Q ${CX} ${CY - 14} ${CX + 18} ${CY + 4} L ${CX + 36} ${CY + 22} L ${CX - 14} ${CY + 22} Z" fill="${C.shirt}"/>
    ${arm(CX - 10, CY - 2, CX - 14, CY + 22, { elbow: [CX - 18, CY + 14] })}
    ${leg(CX + 26, CY + 22, CX + 56, CY + 22)}
    ${leg(CX + 26, CY + 22, CX + 56, CY + 24)}
  `;
  return wrapFigure(size, body);
}

export function poseSphinx(size) {
  // Prone on forearms (gentler than cobra)
  const body = `
    ${floorLine(20, 180, CY + 24)}
    ${head(CX - 28, CY + 2, 12, { dir: 'side' })}
    <path d="M ${CX - 18} ${CY + 10} Q ${CX} ${CY} ${CX + 18} ${CY + 14} L ${CX + 36} ${CY + 22} L ${CX - 18} ${CY + 22} Z" fill="${C.shirt}"/>
    ${arm(CX - 14, CY + 8, CX - 22, CY + 22, { elbow: [CX - 22, CY + 16] })}
    <line x1="${CX - 22}" y1="${CY + 22}" x2="${CX + 4}" y2="${CY + 22}" stroke="${C.skin}" stroke-width="5" stroke-linecap="round"/>
    ${leg(CX + 26, CY + 22, CX + 56, CY + 22)}
  `;
  return wrapFigure(size, body);
}

export function poseSupineTwist(size) {
  // Supine, knees dropped to side
  const body = `
    ${floorLine(20, 180, CY + 28)}
    ${head(CX - 44, CY + 4, 11, { dir: 'side' })}
    <ellipse cx="${CX - 14}" cy="${CY + 12}" rx="22" ry="12" fill="${C.shirt}"/>
    ${arm(CX - 4, CY + 4, CX - 30, CY - 14)}
    ${arm(CX, CY + 4, CX + 30, CY - 14)}
    ${leg(CX + 6, CY + 18, CX + 30, CY + 30, { knee: [CX + 28, CY + 14] })}
    ${leg(CX + 8, CY + 22, CX + 32, CY + 32, { knee: [CX + 30, CY + 18] })}
  `;
  return wrapFigure(size, body);
}

export function poseBirdDog(size) {
  // Quadruped, opposite arm + leg extended
  const body = `
    ${floorLine(20, 180, CY + 40)}
    <ellipse cx="${CX}" cy="${CY + 4}" rx="28" ry="12" fill="${C.shirt}"/>
    ${head(CX - 22, CY + 8, 11, { dir: 'side' })}
    ${arm(CX - 18, CY + 4, CX - 42, CY - 14)}
    ${arm(CX - 14, CY + 12, CX - 14, CY + 36)}
    ${leg(CX + 18, CY + 4, CX + 50, CY - 6)}
    ${leg(CX + 8, CY + 14, CX + 14, CY + 36, { knee: [CX + 14, CY + 26] })}
  `;
  return wrapFigure(size, body);
}

export function poseGluteBridge(size) {
  // Supine, hips lifted
  const body = `
    ${floorLine(20, 180, CY + 36)}
    ${head(CX - 50, CY + 22, 11, { dir: 'side' })}
    <ellipse cx="${CX - 14}" cy="${CY + 18}" rx="26" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 36, CY + 22, CX - 50, CY + 34)}
    ${arm(CX - 4, CY + 18, CX + 4, CY + 34, { elbow: [CX + 6, CY + 22] })}
    ${leg(CX + 8, CY + 14, CX + 30, CY + 34, { knee: [CX + 30, CY + 14] })}
    ${leg(CX + 10, CY + 18, CX + 32, CY + 34, { knee: [CX + 32, CY + 18] })}
  `;
  return wrapFigure(size, body);
}

export function poseSuperman(size) {
  // Prone, arms + legs lifted
  const body = `
    ${floorLine(20, 180, CY + 28)}
    ${head(CX - 36, CY - 4, 11, { dir: 'down' })}
    <ellipse cx="${CX - 6}" cy="${CY + 6}" rx="24" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 24, CY - 2, CX - 50, CY - 14)}
    ${arm(CX - 24, CY + 4, CX - 50, CY - 8)}
    ${leg(CX + 14, CY + 8, CX + 44, CY - 4)}
    ${leg(CX + 14, CY + 14, CX + 44, CY)}
  `;
  return wrapFigure(size, body);
}

export function poseMckenzie(size) {
  // Similar to cobra but mid-rep
  return poseCobra(size);
}

export function poseReversePlank(size) {
  // Sit, hands behind, lift hips
  const body = `
    ${floorLine(20, 180, CY + 40)}
    ${head(CX - 4, CY - 22, 12, { dir: 'up' })}
    <path d="M ${CX - 14} ${CY - 8} Q ${CX} ${CY - 18} ${CX + 14} ${CY - 8} L ${CX + 30} ${CY + 14} L ${CX - 30} ${CY + 14} Z" fill="${C.shirt}"/>
    ${arm(CX - 22, CY - 6, CX - 30, CY + 36)}
    ${arm(CX + 22, CY - 6, CX + 14, CY + 36)}
    ${leg(CX + 22, CY + 14, CX + 50, CY + 38)}
    ${leg(CX + 22, CY + 18, CX + 50, CY + 38)}
  `;
  return wrapFigure(size, body);
}

// ===== HIPS =====

export function poseKneelingHipFlexor(size) {
  // Lunge, back knee down
  const body = `
    ${floorLine(20, 180, CY + 40)}
    ${head(CX - 22, CY - 30, 12, { dir: 'side' })}
    ${torso(CX - 22, CY - 16, 26, 32, 2)}
    ${arm(CX - 30, CY - 12, CX - 36, CY + 16)}
    ${arm(CX - 14, CY - 12, CX - 4, CY + 16)}
    ${leg(CX - 14, CY + 14, CX + 32, CY + 14, { knee: [CX + 8, CY + 38] })}
    ${leg(CX - 28, CY + 14, CX - 40, CY + 38, { knee: [CX - 36, CY + 28] })}
    ${foot(CX + 32, CY + 38, 0, { rx: 8 })}
    ${foot(CX - 40, CY + 38, 0, { rx: 7 })}
  `;
  return wrapFigure(size, body);
}

export function poseCouchStretch(size) {
  // Like kneeling hip flexor, back foot on couch
  const body = `
    ${floorLine(20, 180, CY + 40)}
    ${bench(CX - 36, CY - 4, 50, 14)}
    ${head(CX, CY - 30, 12, { dir: 'side' })}
    ${torso(CX, CY - 16, 26, 32, 4)}
    ${arm(CX - 8, CY - 12, CX - 14, CY + 16)}
    ${arm(CX + 10, CY - 12, CX + 20, CY + 16)}
    ${leg(CX + 8, CY + 14, CX + 50, CY + 38, { knee: [CX + 30, CY + 30] })}
    ${leg(CX - 8, CY + 14, CX - 50, CY - 2, { knee: [CX - 24, CY + 10] })}
  `;
  return wrapFigure(size, body);
}

export function posePigeon(size) {
  // One shin forward, back leg extended
  const body = `
    ${floorLine(20, 180, CY + 36)}
    ${head(CX - 14, CY - 4, 11, { dir: 'down' })}
    <path d="M ${CX - 24} ${CY + 8} Q ${CX - 8} ${CY - 4} ${CX + 10} ${CY + 10} L ${CX + 14} ${CY + 18} L ${CX - 24} ${CY + 18} Z" fill="${C.shirt}"/>
    ${arm(CX - 18, CY + 4, CX - 22, CY + 32)}
    ${arm(CX - 4, CY + 4, CX - 8, CY + 32)}
    ${leg(CX + 8, CY + 14, CX + 56, CY + 28)}
    <line x1="${CX - 10}" y1="${CY + 18}" x2="${CX + 30}" y2="${CY + 18}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
  `;
  return wrapFigure(size, body);
}

export function poseFigure4(size) {
  // Supine, ankle on opposite knee, pull thigh in
  const body = `
    ${floorLine(20, 180, CY + 32)}
    ${head(CX - 50, CY + 2, 11, { dir: 'side' })}
    <ellipse cx="${CX - 22}" cy="${CY + 12}" rx="20" ry="12" fill="${C.shirt}"/>
    ${arm(CX - 6, CY + 6, CX + 8, CY - 8, { elbow: [CX + 4, CY - 6] })}
    ${leg(CX + 4, CY + 16, CX + 28, CY - 14, { knee: [CX + 32, CY + 4] })}
    ${leg(CX + 6, CY + 14, CX + 26, CY - 4, { knee: [CX + 18, CY] })}
  `;
  return wrapFigure(size, body);
}

export function poseFrog(size) {
  // Quadruped, knees wide
  const body = `
    ${floorLine(20, 180, CY + 40)}
    <ellipse cx="${CX}" cy="${CY + 14}" rx="22" ry="10" fill="${C.shirt}"/>
    ${head(CX - 22, CY + 20, 11, { dir: 'down' })}
    ${arm(CX - 18, CY + 14, CX - 22, CY + 36)}
    ${arm(CX + 18, CY + 14, CX + 22, CY + 36)}
    ${leg(CX - 8, CY + 22, CX - 44, CY + 30, { knee: [CX - 28, CY + 38] })}
    ${leg(CX + 8, CY + 22, CX + 44, CY + 30, { knee: [CX + 28, CY + 38] })}
  `;
  return wrapFigure(size, body);
}

export function poseButterfly(size) {
  // Seated, soles together
  const body = `
    ${floorLine(20, 180, CY + 32)}
    ${head(CX, CY - 24, 12)}
    ${torso(CX, CY - 8, 28, 24)}
    ${arm(CX - 14, CY - 4, CX - 22, CY + 16, { elbow: [CX - 22, CY + 8] })}
    ${arm(CX + 14, CY - 4, CX + 22, CY + 16, { elbow: [CX + 22, CY + 8] })}
    ${leg(CX - 10, CY + 18, CX, CY + 28, { knee: [CX - 32, CY + 22] })}
    ${leg(CX + 10, CY + 18, CX, CY + 28, { knee: [CX + 32, CY + 22] })}
  `;
  return wrapFigure(size, body);
}

export function poseNinetyNinety(size) {
  // Seated, both legs at 90° (one in front, one to side)
  const body = `
    ${floorLine(20, 180, CY + 30)}
    ${head(CX - 4, CY - 22, 12)}
    ${torso(CX - 4, CY - 8, 26, 22, 2)}
    ${arm(CX - 16, CY - 4, CX - 26, CY + 18)}
    ${arm(CX + 10, CY - 4, CX + 18, CY + 18)}
    <line x1="${CX - 12}" y1="${CY + 14}" x2="${CX - 38}" y2="${CY + 14}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
    <line x1="${CX - 38}" y1="${CY + 14}" x2="${CX - 38}" y2="${CY + 28}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
    <line x1="${CX + 4}" y1="${CY + 14}" x2="${CX + 38}" y2="${CY + 14}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
  `;
  return wrapFigure(size, body);
}

export function poseLizard(size) {
  // Low lunge with forearms inside front foot
  const body = `
    ${floorLine(20, 180, CY + 40)}
    ${head(CX - 24, CY - 4, 11, { dir: 'down' })}
    <path d="M ${CX - 32} ${CY + 8} Q ${CX - 14} ${CY - 4} ${CX + 4} ${CY + 14} L ${CX + 8} ${CY + 20} L ${CX - 32} ${CY + 20} Z" fill="${C.shirt}"/>
    ${arm(CX - 22, CY + 4, CX - 22, CY + 38, { elbow: [CX - 18, CY + 26] })}
    ${arm(CX - 10, CY + 4, CX - 10, CY + 38, { elbow: [CX - 6, CY + 26] })}
    <line x1="${CX - 22}" y1="${CY + 38}" x2="${CX + 6}" y2="${CY + 38}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
    ${leg(CX + 4, CY + 20, CX + 48, CY + 38, { knee: [CX + 24, CY + 38] })}
  `;
  return wrapFigure(size, body);
}

export function poseDeepSquat(size) {
  // Full squat hold, heels down
  const body = `
    ${floorLine(20, 180, CY + 40)}
    ${head(CX, CY - 26, 12)}
    ${torso(CX, CY - 12, 28, 28, 2)}
    ${arm(CX - 14, CY - 8, CX - 26, CY + 8, { elbow: [CX - 22, CY] })}
    ${arm(CX + 14, CY - 8, CX + 26, CY + 8, { elbow: [CX + 22, CY] })}
    ${leg(CX - 6, CY + 18, CX - 18, CY + 38, { knee: [CX - 26, CY + 18] })}
    ${leg(CX + 6, CY + 18, CX + 18, CY + 38, { knee: [CX + 26, CY + 18] })}
    ${foot(CX - 18, CY + 40, 0, { rx: 7 })}
    ${foot(CX + 18, CY + 40, 0, { rx: 7 })}
  `;
  return wrapFigure(size, body);
}

// ===== GLUTES =====

export function poseClamshell(size) {
  // Side-lying, top knee opening
  const body = `
    ${floorLine(20, 180, CY + 30)}
    ${head(CX - 50, CY + 6, 12, { dir: 'side' })}
    <ellipse cx="${CX - 4}" cy="${CY + 14}" rx="36" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 34, CY + 6, CX - 50, CY + 18)}
    ${arm(CX - 30, CY + 14, CX - 8, CY + 22)}
    ${leg(CX + 30, CY + 16, CX + 16, CY + 4, { knee: [CX + 38, CY] })}
    ${leg(CX + 30, CY + 20, CX + 20, CY + 30, { knee: [CX + 40, CY + 22] })}
  `;
  return wrapFigure(size, body);
}

export function poseFireHydrant(size) {
  // Quadruped, lifting bent knee out to side
  const body = `
    ${floorLine(20, 180, CY + 40)}
    <ellipse cx="${CX - 8}" cy="${CY + 8}" rx="28" ry="12" fill="${C.shirt}"/>
    ${head(CX - 32, CY + 14, 11, { dir: 'down' })}
    ${arm(CX - 24, CY + 8, CX - 28, CY + 36)}
    ${arm(CX - 12, CY + 16, CX - 16, CY + 36)}
    ${leg(CX + 8, CY + 14, CX + 38, CY - 4, { knee: [CX + 36, CY + 16] })}
    ${leg(CX, CY + 18, CX + 6, CY + 38, { knee: [CX + 6, CY + 28] })}
  `;
  return wrapFigure(size, body);
}

export function poseSideLyingAbduction(size) {
  // Side-lying, straight top leg lifted
  const body = `
    ${floorLine(20, 180, CY + 30)}
    ${head(CX - 50, CY + 6, 12, { dir: 'side' })}
    <ellipse cx="${CX - 4}" cy="${CY + 16}" rx="36" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 34, CY + 6, CX - 50, CY + 16)}
    ${arm(CX - 30, CY + 16, CX - 6, CY + 24)}
    ${leg(CX + 30, CY + 12, CX + 64, CY - 8)}
    ${leg(CX + 30, CY + 22, CX + 60, CY + 24)}
  `;
  return wrapFigure(size, body);
}

export function poseDonkeyKick(size) {
  // Quadruped, push bent leg up
  const body = `
    ${floorLine(20, 180, CY + 40)}
    <ellipse cx="${CX - 6}" cy="${CY + 12}" rx="26" ry="10" fill="${C.shirt}"/>
    ${head(CX - 28, CY + 18, 11, { dir: 'down' })}
    ${arm(CX - 22, CY + 12, CX - 26, CY + 36)}
    ${arm(CX - 12, CY + 18, CX - 16, CY + 36)}
    ${leg(CX + 14, CY + 14, CX + 36, CY - 14, { knee: [CX + 28, CY] })}
    ${leg(CX + 4, CY + 18, CX + 8, CY + 38, { knee: [CX + 8, CY + 28] })}
  `;
  return wrapFigure(size, body);
}

// ===== HAMSTRINGS =====

export function poseStandingForwardFold(size) {
  // Standing, folded over completely
  const body = `
    ${floorLine(20, 180, CY + 60)}
    ${head(CX, CY + 18, 12, { dir: 'down' })}
    <path d="M ${CX - 14} ${CY + 4} Q ${CX} ${CY - 12} ${CX + 14} ${CY + 4} L ${CX + 12} ${CY + 24} L ${CX - 12} ${CY + 24} Z" fill="${C.shirt}"/>
    ${arm(CX - 10, CY + 14, CX - 4, CY + 50, { elbow: [CX - 6, CY + 32] })}
    ${arm(CX + 10, CY + 14, CX + 4, CY + 50, { elbow: [CX + 6, CY + 32] })}
    ${leg(CX - 6, CY + 24, CX - 8, CY + 58)}
    ${leg(CX + 6, CY + 24, CX + 8, CY + 58)}
    ${foot(CX - 8, CY + 60)}
    ${foot(CX + 8, CY + 60)}
  `;
  return wrapFigure(size, body);
}

export function poseSeatedForwardFold(size) {
  // Sit with straight legs, fold over to reach toes
  const body = `
    ${floorLine(20, 180, CY + 36)}
    <rect x="${CX - 16}" y="${CY + 22}" width="68" height="14" rx="5" fill="${C.pants}"/>
    <rect x="${CX + 46}" y="${CY + 14}" width="14" height="22" rx="3" fill="${C.pants}"/>
    <ellipse cx="${CX - 4}" cy="${CY + 6}" rx="18" ry="10" fill="${C.shirt}"/>
    ${head(CX - 12, CY + 4, 11, { dir: 'down' })}
    ${arm(CX + 8, CY + 6, CX + 42, CY + 20)}
    ${arm(CX + 4, CY + 12, CX + 40, CY + 24)}
  `;
  return wrapFigure(size, body);
}

export function poseSupineHamstring(size) {
  // Lie back, strap around foot, raise straight leg
  const body = `
    ${floorLine(20, 180, CY + 30)}
    ${head(CX - 60, CY + 8, 11, { dir: 'side' })}
    <ellipse cx="${CX - 30}" cy="${CY + 16}" rx="20" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 16, CY + 14, CX + 14, CY - 26, { elbow: [CX, CY - 8] })}
    ${arm(CX - 14, CY + 18, CX + 10, CY - 22, { elbow: [CX - 2, CY - 4] })}
    <line x1="${CX - 6}" y1="${CY + 18}" x2="${CX + 20}" y2="${CY - 30}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
    ${leg(CX - 2, CY + 18, CX + 50, CY + 22)}
  `;
  return wrapFigure(size, body);
}

export function poseWideLegFold(size) {
  // Wide-leg seated, fold forward
  const body = `
    ${floorLine(20, 180, CY + 38)}
    <line x1="${CX}" y1="${CY + 20}" x2="${CX - 50}" y2="${CY + 32}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
    <line x1="${CX}" y1="${CY + 20}" x2="${CX + 50}" y2="${CY + 32}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
    ${head(CX, CY + 8, 11, { dir: 'down' })}
    <ellipse cx="${CX}" cy="${CY + 18}" rx="18" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 12, CY + 14, CX - 32, CY + 28)}
    ${arm(CX + 12, CY + 14, CX + 32, CY + 28)}
  `;
  return wrapFigure(size, body);
}

export function poseSingleLegFold(size) {
  // Sit, one leg out, one bent — fold over straight
  const body = `
    ${floorLine(20, 180, CY + 36)}
    <rect x="${CX - 12}" y="${CY + 22}" width="56" height="14" rx="5" fill="${C.pants}"/>
    <line x1="${CX - 8}" y1="${CY + 28}" x2="${CX - 30}" y2="${CY + 20}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
    <line x1="${CX - 28}" y1="${CY + 20}" x2="${CX - 10}" y2="${CY + 18}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="${CX - 2}" cy="${CY + 8}" rx="16" ry="10" fill="${C.shirt}"/>
    ${head(CX - 8, CY + 6, 11, { dir: 'down' })}
    ${arm(CX + 8, CY + 8, CX + 36, CY + 22)}
  `;
  return wrapFigure(size, body);
}

export function poseStandingHamstringChair(size) {
  // Heel on chair, hinge from hips
  const body = `
    ${floorLine(20, 180, CY + 60)}
    ${step(CX + 30, CY + 14, 36, 20)}
    ${head(CX - 14, CY - 10, 12, { dir: 'down' })}
    ${torso(CX - 12, CY - 2, 26, 30, 30)}
    ${arm(CX - 4, CY + 16, CX + 24, CY + 16)}
    ${arm(CX + 6, CY + 22, CX + 32, CY + 20)}
    ${leg(CX + 6, CY + 26, CX + 32, CY + 14)}
    ${leg(CX - 4, CY + 30, CX - 6, CY + 58)}
    ${foot(CX - 6, CY + 60)}
  `;
  return wrapFigure(size, body);
}

export function poseDownDog(size) {
  // Inverted V — hands and feet on floor, hips up
  const body = `
    ${floorLine(20, 180, CY + 40)}
    <path d="M ${CX - 30} ${CY + 36} L ${CX + 14} ${CY - 18} L ${CX + 32} ${CY + 36} Z" fill="${C.shirt}" opacity="0.0"/>
    ${head(CX - 20, CY + 8, 11, { dir: 'down' })}
    <line x1="${CX - 24}" y1="${CY + 12}" x2="${CX + 8}" y2="${CY - 14}" stroke="${C.shirt}" stroke-width="12" stroke-linecap="round"/>
    <line x1="${CX - 30}" y1="${CY + 36}" x2="${CX - 14}" y2="${CY + 6}" stroke="${C.skin}" stroke-width="6" stroke-linecap="round"/>
    <line x1="${CX + 14}" y1="${CY - 14}" x2="${CX + 36}" y2="${CY + 36}" stroke="${C.pants}" stroke-width="10" stroke-linecap="round"/>
    <line x1="${CX + 12}" y1="${CY - 18}" x2="${CX + 28}" y2="${CY + 36}" stroke="${C.pants}" stroke-width="10" stroke-linecap="round"/>
  `;
  return wrapFigure(size, body);
}

export function poseToeToWall(size) {
  // Toes against wall, leaning shins forward
  const body = `
    ${wall(CX + 32, CY - 50, CY + 60)}
    ${floorLine(20, 180, CY + 60)}
    ${head(CX - 10, CY - 30, 12, { dir: 'side' })}
    ${torso(CX - 8, CY - 16, 26, 36, 10)}
    ${arm(CX - 18, CY - 10, CX - 14, CY + 18)}
    ${arm(CX + 6, CY - 10, CX + 18, CY + 16)}
    ${leg(CX, CY + 24, CX + 30, CY + 58)}
    ${leg(CX - 4, CY + 24, CX + 24, CY + 58)}
  `;
  return wrapFigure(size, body);
}

// ===== QUADS =====

export function poseStandingQuad(size) {
  // Hold one ankle behind
  const body = `
    ${floorLine(20, 180, CY + 60)}
    ${head(CX, CY - 32, 12)}
    ${torso(CX, CY - 18, 26, 38)}
    ${arm(CX - 14, CY - 14, CX - 18, CY + 12)}
    ${arm(CX + 14, CY - 14, CX + 18, CY + 26, { elbow: [CX + 28, CY + 10] })}
    ${leg(CX - 6, CY + 22, CX - 8, CY + 58)}
    ${leg(CX + 6, CY + 22, CX + 16, CY + 22, { knee: [CX + 22, CY + 44] })}
    ${foot(CX - 8, CY + 60)}
  `;
  return wrapFigure(size, body);
}

export function poseSideLyingQuad(size) {
  // Side-lying, pulling top ankle behind
  const body = `
    ${floorLine(20, 180, CY + 30)}
    ${head(CX - 50, CY + 6, 12, { dir: 'side' })}
    <ellipse cx="${CX - 8}" cy="${CY + 14}" rx="34" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 30, CY + 6, CX - 50, CY + 18)}
    ${arm(CX + 18, CY + 12, CX + 36, CY - 4, { elbow: [CX + 28, CY + 6] })}
    ${leg(CX + 26, CY + 22, CX + 50, CY + 22)}
    ${leg(CX + 26, CY + 18, CX + 36, CY, { knee: [CX + 36, CY + 14] })}
  `;
  return wrapFigure(size, body);
}

export function poseKneelingQuad(size) {
  // Lunge with back foot up on wall
  const body = `
    ${wall(CX + 38, CY - 50, CY + 60)}
    ${floorLine(20, 180, CY + 60)}
    ${head(CX - 22, CY - 32, 12)}
    ${torso(CX - 22, CY - 18, 26, 32, 4)}
    ${arm(CX - 32, CY - 14, CX - 40, CY + 12)}
    ${arm(CX - 12, CY - 14, CX - 4, CY + 12)}
    ${leg(CX - 12, CY + 14, CX + 30, CY + 14, { knee: [CX + 8, CY + 36] })}
    ${leg(CX - 28, CY + 14, CX + 36, CY - 30, { knee: [CX + 4, CY + 14] })}
  `;
  return wrapFigure(size, body);
}

export function poseHeroPose(size) {
  // Kneeling, sitting back on heels
  const body = `
    ${floorLine(15, 185, CY + 48)}
    ${head(CX, CY - 38, 14)}
    ${torso(CX, CY - 22, 32, 38)}
    ${arm(CX - 16, CY - 18, CX - 22, CY + 16, { width: 7 })}
    ${arm(CX + 16, CY - 18, CX + 22, CY + 16, { width: 7 })}
    <!-- thighs going down and back to heels under hips -->
    ${leg(CX - 10, CY + 18, CX - 30, CY + 46, { knee: [CX - 36, CY + 32], width: 13 })}
    ${leg(CX + 10, CY + 18, CX + 30, CY + 46, { knee: [CX + 36, CY + 32], width: 13 })}
    <!-- shins folded back under -->
    <line x1="${CX - 30}" y1="${CY + 46}" x2="${CX - 4}" y2="${CY + 46}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
    <line x1="${CX + 30}" y1="${CY + 46}" x2="${CX + 4}" y2="${CY + 46}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
  `;
  return wrapFigure(size, body);
}

// ===== NEW DISTINCT POSES =====

// Doorway pec — three arm-height variants

export function poseDoorwayPecMid(size) {
  // Base doorway pec — forearm at shoulder height
  const body = `
    ${wall(CX + 36, CY - 60, CY + 60)}
    ${floorLine(15, 185, CY + 60)}
    ${head(CX - 4, CY - 32, 13, { dir: 'side' })}
    ${torso(CX - 6, CY - 18, 28, 38, -10)}
    <!-- forearm flush on doorframe at shoulder height -->
    ${arm(CX + 10, CY - 14, CX + 34, CY - 14, { elbow: [CX + 28, CY - 14], width: 7 })}
    <line x1="${CX + 36}" y1="${CY - 22}" x2="${CX + 36}" y2="${CY - 6}" stroke="${C.skin}" stroke-width="6" stroke-linecap="round"/>
    ${arm(CX - 20, CY - 12, CX - 16, CY + 18, { width: 7 })}
    ${leg(CX - 8, CY + 26, CX - 18, CY + 58, { knee: [CX - 20, CY + 42], width: 12 })}
    ${leg(CX + 6, CY + 28, CX + 10, CY + 58, { width: 12 })}
  `;
  return wrapFigure(size, body);
}

export function poseDoorwayPecHigh(size) {
  // Arm raised higher — targets upper pec
  const body = `
    ${wall(CX + 36, CY - 60, CY + 60)}
    ${floorLine(15, 185, CY + 60)}
    ${head(CX - 4, CY - 32, 13, { dir: 'side' })}
    ${torso(CX - 6, CY - 18, 28, 38, -8)}
    <!-- forearm UP the doorframe, elbow above shoulder -->
    ${arm(CX + 10, CY - 16, CX + 34, CY - 40, { elbow: [CX + 28, CY - 32], width: 7 })}
    <line x1="${CX + 36}" y1="${CY - 46}" x2="${CX + 36}" y2="${CY - 32}" stroke="${C.skin}" stroke-width="6" stroke-linecap="round"/>
    ${arm(CX - 20, CY - 12, CX - 16, CY + 18, { width: 7 })}
    ${leg(CX - 8, CY + 26, CX - 18, CY + 58, { knee: [CX - 20, CY + 42], width: 12 })}
    ${leg(CX + 6, CY + 28, CX + 10, CY + 58, { width: 12 })}
    <!-- emphasis marker above arm -->
    <circle cx="${CX + 24}" cy="${CY - 46}" r="2.5" fill="${C.shirt}"/>
  `;
  return wrapFigure(size, body);
}

export function poseDoorwayPecLow(size) {
  // Arm lower than shoulder — targets pec minor / lower chest
  const body = `
    ${wall(CX + 36, CY - 60, CY + 60)}
    ${floorLine(15, 185, CY + 60)}
    ${head(CX - 4, CY - 32, 13, { dir: 'side' })}
    ${torso(CX - 6, CY - 18, 28, 38, -10)}
    <!-- forearm angled DOWN against doorframe -->
    ${arm(CX + 10, CY - 8, CX + 34, CY + 8, { elbow: [CX + 26, CY + 2], width: 7 })}
    <line x1="${CX + 36}" y1="${CY + 16}" x2="${CX + 36}" y2="${CY + 2}" stroke="${C.skin}" stroke-width="6" stroke-linecap="round"/>
    ${arm(CX - 20, CY - 12, CX - 16, CY + 18, { width: 7 })}
    ${leg(CX - 8, CY + 26, CX - 18, CY + 58, { knee: [CX - 20, CY + 42], width: 12 })}
    ${leg(CX + 6, CY + 28, CX + 10, CY + 58, { width: 12 })}
    <circle cx="${CX + 24}" cy="${CY + 18}" r="2.5" fill="${C.shirt}"/>
  `;
  return wrapFigure(size, body);
}

// Single-leg glute bridge — one foot down, other extended straight
export function poseSingleLegGluteBridge(size) {
  const body = `
    ${floorLine(15, 185, CY + 40)}
    ${head(CX - 56, CY + 22, 12, { dir: 'side' })}
    <!-- torso lifted at angle -->
    <path d="M ${CX - 38} ${CY + 20} Q ${CX - 12} ${CY - 2} ${CX + 18} ${CY + 14} L ${CX + 18} ${CY + 24} L ${CX - 38} ${CY + 24} Z" fill="${C.shirt}"/>
    ${arm(CX - 36, CY + 22, CX - 54, CY + 36)}
    ${arm(CX - 4, CY + 14, CX + 4, CY + 38, { elbow: [CX + 6, CY + 24] })}
    <!-- planted leg (bent, foot on floor) -->
    ${leg(CX + 12, CY + 14, CX + 32, CY + 38, { knee: [CX + 36, CY + 14], width: 12 })}
    <!-- extended leg (straight, lifted) -->
    <line x1="${CX + 16}" y1="${CY + 18}" x2="${CX + 62}" y2="${CY - 4}" stroke="${C.pants}" stroke-width="12" stroke-linecap="round"/>
    ${foot(CX + 64, CY - 6, -10)}
  `;
  return wrapFigure(size, body);
}

// Bent-knee calf — same wall stance but back KNEE BENT (soleus)
export function poseBentKneeCalf(size) {
  const body = `
    ${wall(CX + 36, CY - 60, CY + 60)}
    ${floorLine(15, 185, CY + 60)}
    ${head(CX - 4, CY - 32, 13, { dir: 'side' })}
    ${torso(CX - 4, CY - 16, 28, 36, 18)}
    ${arm(CX + 8, CY - 12, CX + 32, CY - 14, { elbow: [CX + 24, CY - 14], width: 7 })}
    ${arm(CX - 18, CY - 8, CX - 12, CY + 18)}
    <!-- front bent knee -->
    ${leg(CX, CY + 26, CX + 28, CY + 58, { knee: [CX + 12, CY + 46], width: 12 })}
    <!-- BACK KNEE BENT instead of straight (key differentiator) -->
    ${leg(CX - 12, CY + 26, CX - 32, CY + 58, { knee: [CX - 30, CY + 44], width: 12 })}
    ${foot(CX - 32, CY + 60, 0, { rx: 8 })}
    <!-- subtle highlight on back-knee bend -->
    <circle cx="${CX - 30}" cy="${CY + 44}" r="3.5" fill="none" stroke="${C.shirt}" stroke-width="1.5" opacity="0.7"/>
  `;
  return wrapFigure(size, body);
}

// Quadruped T-spine rotation — hand BEHIND HEAD, elbow rotating up
export function poseQuadrupedTspineRot(size) {
  const body = `
    ${floorLine(15, 185, CY + 40)}
    <ellipse cx="${CX}" cy="${CY + 8}" rx="34" ry="14" fill="${C.shirt}"/>
    ${head(CX - 28, CY + 8, 13, { dir: 'side' })}
    <!-- supporting arm -->
    ${arm(CX - 22, CY + 8, CX - 24, CY + 36, { width: 7 })}
    <!-- rotating arm: hand behind head, elbow lifted up -->
    ${arm(CX + 4, CY + 4, CX - 8, CY - 6, { elbow: [CX + 4, CY - 26], width: 7 })}
    ${leg(CX + 22, CY + 18, CX + 38, CY + 38, { knee: [CX + 36, CY + 28], width: 12 })}
    ${leg(CX + 8, CY + 18, CX + 24, CY + 38, { knee: [CX + 22, CY + 28], width: 12 })}
    <!-- rotation arrow -->
    ${motionArrow(CX + 22, CY - 22, CX + 10, CY - 28, CX, CY - 24, { color: '#fff', width: 2 })}
  `;
  return wrapFigure(size, body);
}

// Wall angels — W arms (vs wall slides which are mid-slide)
export function poseWallAngels(size) {
  const body = `
    ${wall(CX - 30, CY - 60, CY + 60)}
    ${floorLine(15, 185, CY + 60)}
    ${head(CX - 14, CY - 32, 13, { dir: 'side' })}
    ${torso(CX - 12, CY - 18, 28, 38, 2)}
    <!-- arms in W: elbows down + out, hands up at shoulder height -->
    ${arm(CX, CY - 14, CX + 8, CY - 32, { elbow: [CX + 16, CY - 10], width: 7 })}
    ${arm(CX - 24, CY - 14, CX - 18, CY - 32, { elbow: [CX - 30, CY - 10], width: 7 })}
    ${leg(CX - 14, CY + 24, CX - 14, CY + 58, { width: 12 })}
    ${leg(CX + 2, CY + 24, CX + 2, CY + 58, { width: 12 })}
    <!-- snow-angel motion arc -->
    <path d="M ${CX - 30} ${CY - 16} Q ${CX - 36} ${CY - 36} ${CX - 18} ${CY - 50}" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3" fill="none" opacity="0.7"/>
    <path d="M ${CX + 18} ${CY - 16} Q ${CX + 24} ${CY - 36} ${CX + 6} ${CY - 50}" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3" fill="none" opacity="0.7"/>
  `;
  return wrapFigure(size, body);
}

// Hollow body rocks — same as hold + rocking motion arrow
export function poseHollowBodyRocks(size) {
  const body = `
    ${floorLine(15, 185, CY + 32)}
    ${head(CX - 50, CY + 2, 13, { dir: 'side' })}
    <ellipse cx="${CX - 14}" cy="${CY + 10}" rx="30" ry="11" fill="${C.shirt}"/>
    ${arm(CX - 40, CY + 2, CX - 64, CY - 10, { width: 7 })}
    ${arm(CX + 10, CY + 4, CX + 32, CY - 12, { width: 7 })}
    ${leg(CX + 10, CY + 18, CX + 56, CY + 8, { width: 12 })}
    ${leg(CX + 10, CY + 14, CX + 56, CY + 4, { width: 12 })}
    <!-- rocking motion: curved double-arrow under figure -->
    <path d="M ${CX - 36} ${CY + 28} Q ${CX} ${CY + 38} ${CX + 36} ${CY + 28}" stroke="#fff" stroke-width="2" stroke-dasharray="4 3" fill="none" opacity="0.65"/>
    ${motionArrow(CX - 30, CY + 30, CX - 36, CY + 28, CX - 42, CY + 24, { color: '#fff', width: 2 })}
    ${motionArrow(CX + 30, CY + 30, CX + 36, CY + 28, CX + 42, CY + 24, { color: '#fff', width: 2 })}
  `;
  return wrapFigure(size, body);
}

// Quadruped opposite raise — like bird-dog but lower extension (beginner)
export function poseQuadrupedOppRaise(size) {
  const body = `
    ${floorLine(15, 185, CY + 40)}
    <ellipse cx="${CX}" cy="${CY + 8}" rx="32" ry="12" fill="${C.shirt}"/>
    ${head(CX - 26, CY + 12, 13, { dir: 'side' })}
    <!-- lifted arm but only slightly raised (vs bird-dog horizontal) -->
    ${arm(CX - 18, CY + 8, CX - 36, CY - 4, { width: 7 })}
    ${arm(CX - 14, CY + 16, CX - 14, CY + 38, { width: 7 })}
    <!-- back leg lifted but lower than bird-dog -->
    ${leg(CX + 20, CY + 8, CX + 44, CY + 12, { width: 12 })}
    ${leg(CX + 8, CY + 18, CX + 14, CY + 38, { knee: [CX + 14, CY + 28], width: 12 })}
  `;
  return wrapFigure(size, body);
}

// McKenzie press-up — cobra-like + reps arrow
export function poseMckenziePressup(size) {
  const body = `
    ${floorLine(15, 185, CY + 30)}
    ${head(CX - 24, CY - 12, 13, { dir: 'up' })}
    <path d="M ${CX - 14} ${CY - 2} Q ${CX} ${CY - 12} ${CX + 20} ${CY + 8} L ${CX + 38} ${CY + 24} L ${CX - 14} ${CY + 24} Z" fill="${C.shirt}"/>
    <!-- both arms pressing -->
    ${arm(CX - 10, CY + 4, CX - 14, CY + 24, { elbow: [CX - 20, CY + 14], width: 7 })}
    ${arm(CX - 6, CY + 8, CX + 14, CY + 24, { elbow: [CX + 4, CY + 18], width: 7 })}
    ${leg(CX + 28, CY + 24, CX + 60, CY + 24, { width: 12 })}
    ${leg(CX + 28, CY + 26, CX + 60, CY + 26, { width: 12 })}
    <!-- vertical rep motion arrow -->
    ${motionArrow(CX + 14, CY - 14, CX + 16, CY - 4, CX + 18, CY + 8, { color: '#fff', width: 2 })}
    ${motionArrow(CX + 22, CY + 14, CX + 20, CY + 4, CX + 18, CY - 6, { color: '#fff', width: 2 })}
  `;
  return wrapFigure(size, body);
}

// Child's pose extended — arms reaching MUCH further forward
export function poseChildsPoseExtended(size) {
  const body = `
    ${floorLine(15, 185, CY + 38)}
    <!-- hips at heels (right side of figure) -->
    <ellipse cx="${CX + 28}" cy="${CY + 26}" rx="16" ry="10" fill="${C.pants}"/>
    <!-- torso laid forward and reaching arms -->
    <path d="M ${CX + 10} ${CY + 16} Q ${CX - 12} ${CY + 4} ${CX - 22} ${CY + 8} L ${CX - 20} ${CY + 22} Q ${CX + 8} ${CY + 28} ${CX + 16} ${CY + 22} Z" fill="${C.shirt}"/>
    <!-- head between extended arms -->
    ${head(CX - 30, CY + 14, 11, { dir: 'down' })}
    <!-- both arms reaching ALL the way forward -->
    ${arm(CX - 14, CY + 8, CX - 70, CY + 14, { width: 7, elbow: [CX - 50, CY + 8] })}
    ${arm(CX - 14, CY + 16, CX - 70, CY + 22, { width: 7, elbow: [CX - 50, CY + 16] })}
    <!-- shins folded under -->
    <rect x="${CX + 32}" y="${CY + 30}" width="22" height="6" rx="2" fill="${C.pants}"/>
  `;
  return wrapFigure(size, body);
}

// Foam roller t-spine — figure supine on a roller under mid-back, arms overhead
export function poseFoamRollerTspine(size) {
  const body = `
    ${floorLine(15, 185, CY + 40)}
    <!-- foam roller cylinder under mid-back -->
    <ellipse cx="${CX}" cy="${CY + 14}" rx="22" ry="8" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.32)" stroke-width="1"/>
    <!-- head + neck supported -->
    ${head(CX - 44, CY + 4, 12, { dir: 'side' })}
    <!-- torso draped over roller -->
    <path d="M ${CX - 28} ${CY + 10} Q ${CX} ${CY - 2} ${CX + 26} ${CY + 10} L ${CX + 26} ${CY + 18} Q ${CX} ${CY + 22} ${CX - 28} ${CY + 18} Z" fill="${C.shirt}"/>
    <!-- arms reaching overhead -->
    ${arm(CX - 24, CY + 10, CX - 60, CY - 14, { width: 7 })}
    ${arm(CX - 24, CY + 18, CX - 60, CY - 6, { width: 7 })}
    <!-- hips down on floor, knees bent -->
    ${leg(CX + 22, CY + 20, CX + 44, CY + 38, { knee: [CX + 50, CY + 18], width: 12 })}
    ${leg(CX + 22, CY + 24, CX + 44, CY + 38, { knee: [CX + 50, CY + 22], width: 12 })}
  `;
  return wrapFigure(size, body);
}

// Banded ankle distraction — figure in lunge with band around ankle pulling back
export function poseBandedAnkle(size) {
  const body = `
    ${floorLine(15, 185, CY + 60)}
    <!-- low anchor point behind -->
    <circle cx="${CX - 64}" cy="${CY + 56}" r="4" fill="rgba(255,255,255,0.3)"/>
    ${head(CX, CY - 30, 13, { dir: 'side' })}
    ${torso(CX, CY - 16, 28, 36, 14)}
    ${arm(CX - 14, CY - 12, CX + 4, CY + 18, { width: 7 })}
    ${arm(CX + 14, CY - 12, CX + 28, CY + 18, { width: 7 })}
    <!-- front lunge knee -->
    ${leg(CX + 6, CY + 24, CX + 38, CY + 56, { knee: [CX + 22, CY + 42], width: 12 })}
    <!-- back leg straight -->
    ${leg(CX - 8, CY + 24, CX - 34, CY + 56, { width: 12 })}
    ${foot(CX - 36, CY + 58, 0, { rx: 8 })}
    <!-- band stretched from anchor to front foot pulling knee forward -->
    <line x1="${CX - 64}" y1="${CY + 56}" x2="${CX + 38}" y2="${CY + 56}" stroke="#fff" stroke-width="2" stroke-dasharray="4 2" opacity="0.7"/>
    ${motionArrow(CX + 22, CY + 38, CX + 28, CY + 50, CX + 34, CY + 56, { color: '#fff', width: 2 })}
  `;
  return wrapFigure(size, body);
}

// Half pigeon supine — distinct from reclined figure-4: knee pulled fully to chest
export function poseHalfPigeonSupine(size) {
  const body = `
    ${floorLine(15, 185, CY + 34)}
    ${head(CX - 56, CY + 4, 12, { dir: 'side' })}
    <ellipse cx="${CX - 26}" cy="${CY + 14}" rx="22" ry="11" fill="${C.shirt}"/>
    <!-- both hands pulling thigh in -->
    ${arm(CX - 8, CY + 8, CX + 20, CY - 14, { elbow: [CX + 6, CY - 4], width: 7 })}
    ${arm(CX - 8, CY + 16, CX + 14, CY - 8, { elbow: [CX + 2, CY + 4], width: 7 })}
    <!-- bent leg pulled in toward chest, ankle crossed over -->
    ${leg(CX + 4, CY + 16, CX + 28, CY - 14, { knee: [CX + 30, CY + 4], width: 12 })}
    <!-- shin of bent leg crossing -->
    <line x1="${CX + 28}" y1="${CY - 14}" x2="${CX + 4}" y2="${CY - 8}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
    <!-- other leg straight on floor -->
    ${leg(CX + 4, CY + 22, CX + 56, CY + 28, { width: 12 })}
  `;
  return wrapFigure(size, body);
}

// Bodyweight squat (tempo) — mid-squat with tempo timing arrow
export function poseBodyweightSquatTempo(size) {
  const body = `
    ${floorLine(15, 185, CY + 50)}
    ${head(CX, CY - 30, 14)}
    ${torso(CX, CY - 14, 30, 30, 0)}
    ${arm(CX - 16, CY - 10, CX - 32, CY + 4, { elbow: [CX - 26, CY - 6], width: 7 })}
    ${arm(CX + 16, CY - 10, CX + 32, CY + 4, { elbow: [CX + 26, CY - 6], width: 7 })}
    <!-- mid-squat: thighs ~parallel -->
    ${leg(CX - 8, CY + 18, CX - 24, CY + 48, { knee: [CX - 32, CY + 24], width: 13 })}
    ${leg(CX + 8, CY + 18, CX + 24, CY + 48, { knee: [CX + 32, CY + 24], width: 13 })}
    ${foot(CX - 24, CY + 50, 0, { rx: 8 })}
    ${foot(CX + 24, CY + 50, 0, { rx: 8 })}
    <!-- tempo down-arrow on left, up on right -->
    ${motionArrow(CX - 58, CY - 8, CX - 58, CY + 8, CX - 58, CY + 22, { color: '#fff', width: 2 })}
    ${motionArrow(CX + 58, CY + 22, CX + 58, CY + 8, CX + 58, CY - 8, { color: '#fff', width: 2 })}
  `;
  return wrapFigure(size, body);
}

// Down dog with pedaling — heel-drop motion arrows on feet
export function poseDownDogPedal(size) {
  const body = `
    ${floorLine(15, 185, CY + 44)}
    ${head(CX - 22, CY + 12, 12, { dir: 'down' })}
    <line x1="${CX - 26}" y1="${CY + 16}" x2="${CX + 10}" y2="${CY - 18}" stroke="${C.shirt}" stroke-width="14" stroke-linecap="round"/>
    <line x1="${CX - 32}" y1="${CY + 40}" x2="${CX - 16}" y2="${CY + 8}" stroke="${C.skin}" stroke-width="7" stroke-linecap="round"/>
    <line x1="${CX + 14}" y1="${CY - 18}" x2="${CX + 38}" y2="${CY + 40}" stroke="${C.pants}" stroke-width="12" stroke-linecap="round"/>
    <line x1="${CX + 12}" y1="${CY - 22}" x2="${CX + 32}" y2="${CY + 40}" stroke="${C.pants}" stroke-width="12" stroke-linecap="round"/>
    <!-- alternating heel-drop motion arrows -->
    ${motionArrow(CX + 30, CY + 28, CX + 36, CY + 36, CX + 40, CY + 42, { color: '#fff', width: 2 })}
    ${motionArrow(CX + 38, CY + 36, CX + 32, CY + 28, CX + 26, CY + 20, { color: '#fff', width: 2 })}
  `;
  return wrapFigure(size, body);
}

// Down dog flow — three sequential pose silhouettes
export function poseDownDogFlow(size) {
  const body = `
    ${floorLine(15, 185, CY + 44)}
    <!-- down dog (full) -->
    ${head(CX - 22, CY + 12, 12, { dir: 'down' })}
    <line x1="${CX - 26}" y1="${CY + 16}" x2="${CX + 10}" y2="${CY - 18}" stroke="${C.shirt}" stroke-width="14" stroke-linecap="round"/>
    <line x1="${CX - 32}" y1="${CY + 40}" x2="${CX - 16}" y2="${CY + 8}" stroke="${C.skin}" stroke-width="7" stroke-linecap="round"/>
    <line x1="${CX + 14}" y1="${CY - 18}" x2="${CX + 38}" y2="${CY + 40}" stroke="${C.pants}" stroke-width="12" stroke-linecap="round"/>
    <!-- ghost silhouette: plank -->
    <line x1="${CX - 42}" y1="${CY + 28}" x2="${CX + 42}" y2="${CY + 28}" stroke="#fff" stroke-width="3" opacity="0.18" stroke-linecap="round"/>
    <!-- ghost silhouette: up dog (arched) -->
    <path d="M ${CX - 42} ${CY + 36} Q ${CX} ${CY + 16} ${CX + 42} ${CY + 36}" stroke="#fff" stroke-width="2" opacity="0.18" fill="none" stroke-linecap="round"/>
    <!-- flow arrow -->
    ${motionArrow(CX + 50, CY - 10, CX + 56, CY + 10, CX + 50, CY + 32, { color: '#fff', width: 2 })}
  `;
  return wrapFigure(size, body);
}

// Overhead reach supine (test demo for f6_overhead)
export function poseOverheadReachSupine(size) {
  const body = `
    ${floorLine(15, 185, CY + 36)}
    <!-- supine, knees bent, low back flat -->
    ${head(CX - 60, CY + 12, 12, { dir: 'side' })}
    <ellipse cx="${CX - 30}" cy="${CY + 22}" rx="26" ry="10" fill="${C.shirt}"/>
    <!-- arms reaching overhead toward floor -->
    ${arm(CX - 50, CY + 16, CX - 86, CY + 4, { width: 7 })}
    ${arm(CX - 50, CY + 26, CX - 86, CY + 14, { width: 7 })}
    <!-- knees bent up -->
    ${leg(CX - 8, CY + 26, CX + 12, CY + 4, { knee: [CX + 16, CY + 16], width: 12 })}
    ${leg(CX - 8, CY + 30, CX + 20, CY + 8, { knee: [CX + 24, CY + 20], width: 12 })}
    <!-- gap measurement marker between fingertips and floor -->
    <line x1="${CX - 86}" y1="${CY + 10}" x2="${CX - 86}" y2="${CY + 36}" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="2 2"/>
    <text x="${CX - 78}" y="${CY + 26}" fill="var(--accent)" font-size="9" font-family="Outfit" font-weight="600">gap</text>
  `;
  return wrapFigure(size, body);
}



// ===== ANKLES & CALVES =====

export function poseStandingCalf(size) {
  // Wall, back leg straight, heel down
  const body = `
    ${wall(CX + 36, CY - 50, CY + 60)}
    ${floorLine(20, 180, CY + 60)}
    ${head(CX - 4, CY - 30, 12, { dir: 'side' })}
    ${torso(CX - 4, CY - 14, 26, 36, 12)}
    ${arm(CX + 6, CY - 10, CX + 30, CY - 14, { elbow: [CX + 22, CY - 14] })}
    ${arm(CX - 18, CY - 8, CX - 12, CY + 18)}
    ${leg(CX, CY + 26, CX + 28, CY + 58, { knee: [CX + 12, CY + 46] })}
    ${leg(CX - 12, CY + 26, CX - 36, CY + 58)}
    ${foot(CX - 38, CY + 60, 0, { rx: 8 })}
  `;
  return wrapFigure(size, body);
}

export function poseHeelDrops(size) {
  // Stand on step, drop heels below level
  const body = `
    ${step(CX, CY + 30, 50, 14)}
    ${head(CX, CY - 30, 12)}
    ${torso(CX, CY - 14, 26, 38)}
    ${arm(CX - 14, CY - 10, CX - 18, CY + 18)}
    ${arm(CX + 14, CY - 10, CX + 18, CY + 18)}
    ${leg(CX - 6, CY + 26, CX - 6, CY + 44)}
    ${leg(CX + 6, CY + 26, CX + 6, CY + 44)}
    ${foot(CX - 6, CY + 46, -8)}
    ${foot(CX + 6, CY + 46, -8)}
    ${motionArrow(CX + 20, CY + 30, CX + 24, CY + 42, CX + 20, CY + 52, { color: '#fff' })}
  `;
  return wrapFigure(size, body);
}

export function poseAnkleCircles(size) {
  // Seated, one foot up making circles
  const body = `
    ${head(CX, CY - 24, 12)}
    ${torso(CX, CY - 10, 26, 24)}
    ${arm(CX - 14, CY - 6, CX - 18, CY + 14)}
    ${arm(CX + 14, CY - 6, CX + 14, CY + 24, { elbow: [CX + 18, CY + 8] })}
    <line x1="${CX - 6}" y1="${CY + 14}" x2="${CX + 14}" y2="${CY + 28}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
    <line x1="${CX + 6}" y1="${CY + 14}" x2="${CX + 36}" y2="${CY + 2}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="${CX + 38}" cy="${CY}" r="10" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.7"/>
  `;
  return wrapFigure(size, body);
}

// ===== CORE ANTERIOR =====

export function posePlank(size) {
  // Forearm plank, horizontal
  const body = `
    ${floorLine(20, 180, CY + 24)}
    <rect x="${CX - 38}" y="${CY - 4}" width="76" height="14" rx="6" fill="${C.shirt}"/>
    ${head(CX - 42, CY + 4, 11, { dir: 'side' })}
    <line x1="${CX - 32}" y1="${CY + 10}" x2="${CX - 32}" y2="${CY + 22}" stroke="${C.skin}" stroke-width="5" stroke-linecap="round"/>
    <line x1="${CX - 32}" y1="${CY + 22}" x2="${CX - 18}" y2="${CY + 22}" stroke="${C.skin}" stroke-width="5" stroke-linecap="round"/>
    <line x1="${CX + 28}" y1="${CY + 10}" x2="${CX + 60}" y2="${CY + 22}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
    ${foot(CX + 62, CY + 22, -15)}
  `;
  return wrapFigure(size, body);
}

export function poseKneePlank(size) {
  // Plank from knees
  const body = `
    ${floorLine(20, 180, CY + 24)}
    <rect x="${CX - 30}" y="${CY - 4}" width="60" height="14" rx="6" fill="${C.shirt}"/>
    ${head(CX - 34, CY + 4, 11, { dir: 'side' })}
    <line x1="${CX - 26}" y1="${CY + 10}" x2="${CX - 26}" y2="${CY + 22}" stroke="${C.skin}" stroke-width="5" stroke-linecap="round"/>
    <line x1="${CX - 26}" y1="${CY + 22}" x2="${CX - 12}" y2="${CY + 22}" stroke="${C.skin}" stroke-width="5" stroke-linecap="round"/>
    <line x1="${CX + 24}" y1="${CY + 10}" x2="${CX + 32}" y2="${CY + 22}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
  `;
  return wrapFigure(size, body);
}

export function poseDeadBug(size) {
  // Supine, opposite arm + leg extended up
  const body = `
    ${floorLine(20, 180, CY + 26)}
    ${head(CX - 50, CY + 4, 11, { dir: 'side' })}
    <ellipse cx="${CX - 20}" cy="${CY + 12}" rx="22" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 6, CY + 4, CX - 4, CY - 24)}
    ${arm(CX - 12, CY + 14, CX + 14, CY + 20)}
    ${leg(CX + 6, CY + 16, CX + 14, CY - 14, { knee: [CX + 14, CY + 4] })}
    ${leg(CX + 8, CY + 18, CX + 38, CY + 22)}
  `;
  return wrapFigure(size, body);
}

export function poseHollowBody(size) {
  // Supine, arms + legs raised slightly
  const body = `
    ${floorLine(20, 180, CY + 26)}
    ${head(CX - 44, CY + 4, 11, { dir: 'side' })}
    <ellipse cx="${CX - 14}" cy="${CY + 10}" rx="26" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 36, CY + 4, CX - 56, CY - 8)}
    ${arm(CX + 8, CY + 4, CX + 28, CY - 14)}
    ${leg(CX + 8, CY + 18, CX + 48, CY + 8)}
    ${leg(CX + 8, CY + 14, CX + 48, CY + 4)}
  `;
  return wrapFigure(size, body);
}

export function poseToeTaps(size) {
  // Supine, knees up, one toe tap
  const body = `
    ${floorLine(20, 180, CY + 26)}
    ${head(CX - 50, CY + 4, 11, { dir: 'side' })}
    <ellipse cx="${CX - 20}" cy="${CY + 10}" rx="22" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 36, CY + 4, CX - 38, CY + 20)}
    ${arm(CX - 4, CY + 12, CX + 6, CY + 18)}
    ${leg(CX + 4, CY + 14, CX + 20, CY - 14, { knee: [CX + 24, CY + 4] })}
    ${leg(CX + 8, CY + 18, CX + 30, CY + 22, { knee: [CX + 18, CY + 16] })}
  `;
  return wrapFigure(size, body);
}

export function poseLegLowers(size) {
  // Supine, straight legs lowering
  const body = `
    ${floorLine(20, 180, CY + 26)}
    ${head(CX - 50, CY + 4, 11, { dir: 'side' })}
    <ellipse cx="${CX - 20}" cy="${CY + 10}" rx="22" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 36, CY + 4, CX - 56, CY - 4)}
    ${arm(CX - 36, CY + 14, CX - 50, CY + 18)}
    ${leg(CX + 4, CY + 14, CX + 50, CY - 6)}
    ${leg(CX + 6, CY + 18, CX + 50, CY - 2)}
  `;
  return wrapFigure(size, body);
}

export function poseVSit(size) {
  // Seated V, arms forward
  const body = `
    ${floorLine(20, 180, CY + 32)}
    ${head(CX, CY - 18, 12)}
    ${torso(CX, CY - 6, 26, 22, -16)}
    ${arm(CX - 6, CY, CX - 30, CY + 6)}
    ${arm(CX + 6, CY, CX + 30, CY + 4)}
    <line x1="${CX + 4}" y1="${CY + 16}" x2="${CX + 36}" y2="${CY - 14}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
    <line x1="${CX - 4}" y1="${CY + 16}" x2="${CX + 30}" y2="${CY - 18}" stroke="${C.pants}" stroke-width="9" stroke-linecap="round"/>
  `;
  return wrapFigure(size, body);
}

// ===== CORE LATERAL =====

export function poseSidePlank(size) {
  // Forearm side plank
  const body = `
    ${floorLine(20, 180, CY + 36)}
    <line x1="${CX - 38}" y1="${CY + 32}" x2="${CX + 38}" y2="${CY - 22}" stroke="${C.shirt}" stroke-width="14" stroke-linecap="round"/>
    ${head(CX + 38, CY - 28, 11)}
    <line x1="${CX - 38}" y1="${CY + 32}" x2="${CX - 38}" y2="${CY + 22}" stroke="${C.skin}" stroke-width="5" stroke-linecap="round"/>
    <line x1="${CX - 38}" y1="${CY + 22}" x2="${CX - 22}" y2="${CY + 22}" stroke="${C.skin}" stroke-width="5" stroke-linecap="round"/>
    ${arm(CX + 32, CY - 18, CX + 38, CY - 40)}
  `;
  return wrapFigure(size, body);
}

export function poseSidePlankKnees(size) {
  // Side plank from knees
  const body = `
    ${floorLine(20, 180, CY + 36)}
    <line x1="${CX - 28}" y1="${CY + 32}" x2="${CX + 30}" y2="${CY - 14}" stroke="${C.shirt}" stroke-width="14" stroke-linecap="round"/>
    ${head(CX + 30, CY - 22, 11)}
    <line x1="${CX - 28}" y1="${CY + 32}" x2="${CX - 28}" y2="${CY + 22}" stroke="${C.skin}" stroke-width="5" stroke-linecap="round"/>
    <line x1="${CX - 28}" y1="${CY + 22}" x2="${CX - 14}" y2="${CY + 22}" stroke="${C.skin}" stroke-width="5" stroke-linecap="round"/>
    <line x1="${CX - 24}" y1="${CY + 28}" x2="${CX + 20}" y2="${CY + 32}" stroke="${C.pants}" stroke-width="10" stroke-linecap="round"/>
  `;
  return wrapFigure(size, body);
}

export function poseSideBend(size) {
  // Standing, reach overhead to opposite side
  const body = `
    ${head(CX - 4, CY - 30, 12)}
    ${torso(CX, CY - 14, 28, 38, -12)}
    ${arm(CX - 16, CY - 8, CX - 32, CY + 24)}
    ${arm(CX + 12, CY - 16, CX + 30, CY - 36, { elbow: [CX + 22, CY - 30] })}
    ${leg(CX - 6, CY + 22, CX - 8, CY + 58)}
    ${leg(CX + 6, CY + 22, CX + 8, CY + 58)}
    ${foot(CX - 8, CY + 60)}
    ${foot(CX + 8, CY + 60)}
  `;
  return wrapFigure(size, body);
}

export function poseStandingObliqueReach(size) {
  // Reach one arm over head, lengthen side
  const body = `
    ${head(CX, CY - 30, 12)}
    ${torso(CX, CY - 14, 28, 38, -8)}
    ${arm(CX - 12, CY - 12, CX + 32, CY - 36, { elbow: [CX + 14, CY - 32] })}
    ${arm(CX + 12, CY - 12, CX + 16, CY + 18)}
    ${leg(CX - 6, CY + 22, CX - 8, CY + 58)}
    ${leg(CX + 6, CY + 22, CX + 8, CY + 58)}
    ${foot(CX - 8, CY + 60)}
    ${foot(CX + 8, CY + 60)}
  `;
  return wrapFigure(size, body);
}

// ===== FULL BODY =====

export function poseSquat(size) {
  return poseDeepSquat(size);
}

export function poseGobletSquat(size) {
  // Squat with weight at chest
  const body = `
    ${floorLine(20, 180, CY + 40)}
    ${head(CX, CY - 28, 12)}
    ${torso(CX, CY - 14, 28, 28)}
    <rect x="${CX - 12}" y="${CY - 12}" width="24" height="12" rx="2" fill="#3a3a3a" stroke="#5a5a5a"/>
    ${arm(CX - 14, CY - 8, CX - 14, CY + 0, { elbow: [CX - 16, CY - 8] })}
    ${arm(CX + 14, CY - 8, CX + 14, CY + 0, { elbow: [CX + 16, CY - 8] })}
    ${leg(CX - 6, CY + 18, CX - 18, CY + 38, { knee: [CX - 26, CY + 18] })}
    ${leg(CX + 6, CY + 18, CX + 18, CY + 38, { knee: [CX + 26, CY + 18] })}
    ${foot(CX - 18, CY + 40, 0, { rx: 7 })}
    ${foot(CX + 18, CY + 40, 0, { rx: 7 })}
  `;
  return wrapFigure(size, body);
}

export function poseForwardLunge(size) {
  // Step forward
  const body = `
    ${floorLine(20, 180, CY + 40)}
    ${head(CX - 8, CY - 30, 12)}
    ${torso(CX - 8, CY - 16, 26, 36, 6)}
    ${arm(CX - 22, CY - 10, CX - 30, CY + 12)}
    ${arm(CX + 4, CY - 12, CX + 10, CY + 12)}
    ${leg(CX, CY + 18, CX + 30, CY + 38, { knee: [CX + 30, CY + 20] })}
    ${leg(CX - 14, CY + 18, CX - 38, CY + 38)}
  `;
  return wrapFigure(size, body);
}

export function poseReverseLunge(size) {
  // Mirror of forward
  const body = `
    ${floorLine(20, 180, CY + 40)}
    ${head(CX + 8, CY - 30, 12)}
    ${torso(CX + 8, CY - 16, 26, 36, -6)}
    ${arm(CX - 4, CY - 12, CX - 10, CY + 12)}
    ${arm(CX + 22, CY - 10, CX + 30, CY + 12)}
    ${leg(CX, CY + 18, CX - 30, CY + 38, { knee: [CX - 30, CY + 20] })}
    ${leg(CX + 14, CY + 18, CX + 38, CY + 38)}
  `;
  return wrapFigure(size, body);
}

export function poseLateralLunge(size) {
  // Step wide to side
  const body = `
    ${floorLine(20, 180, CY + 40)}
    ${head(CX + 4, CY - 28, 12)}
    ${torso(CX + 4, CY - 14, 26, 30, -4)}
    ${arm(CX - 8, CY - 10, CX - 22, CY + 14)}
    ${arm(CX + 16, CY - 10, CX + 22, CY + 14)}
    ${leg(CX, CY + 16, CX - 40, CY + 38, { knee: [CX - 30, CY + 30] })}
    ${leg(CX + 8, CY + 16, CX + 38, CY + 38)}
  `;
  return wrapFigure(size, body);
}

export function poseWorldsGreatest(size) {
  // Lunge + T-spine rotation
  const body = `
    ${floorLine(20, 180, CY + 40)}
    ${head(CX - 4, CY - 16, 12, { dir: 'side' })}
    ${torso(CX - 4, CY - 4, 26, 26, 30)}
    ${arm(CX + 14, CY + 8, CX + 30, CY - 24, { elbow: [CX + 24, CY - 12] })}
    ${arm(CX - 22, CY + 4, CX - 28, CY + 30)}
    ${leg(CX + 6, CY + 20, CX + 34, CY + 40, { knee: [CX + 32, CY + 18] })}
    ${leg(CX - 8, CY + 24, CX - 36, CY + 40)}
  `;
  return wrapFigure(size, body);
}

export function poseCossackSquat(size) {
  // Wide stance, shift to one side
  const body = `
    ${floorLine(20, 180, CY + 40)}
    ${head(CX - 14, CY - 22, 12)}
    ${torso(CX - 14, CY - 10, 26, 26, 4)}
    ${arm(CX - 26, CY - 6, CX - 32, CY + 14)}
    ${arm(CX - 2, CY - 6, CX + 4, CY + 14)}
    ${leg(CX - 18, CY + 14, CX - 38, CY + 38, { knee: [CX - 44, CY + 18] })}
    ${leg(CX - 10, CY + 14, CX + 38, CY + 38)}
  `;
  return wrapFigure(size, body);
}

// ===== BALANCE =====

export function poseSingleLegBalance(size) {
  // Stand on one leg, eyes closed or arms crossed
  const body = `
    ${floorLine(20, 180, CY + 60)}
    ${head(CX, CY - 32, 12)}
    ${torso(CX, CY - 18, 28, 38)}
    ${arm(CX - 14, CY - 14, CX + 12, CY + 8, { elbow: [CX + 6, CY - 6] })}
    ${arm(CX + 14, CY - 14, CX - 12, CY + 8, { elbow: [CX - 6, CY - 6] })}
    ${leg(CX - 4, CY + 22, CX - 6, CY + 58)}
    ${leg(CX + 6, CY + 22, CX + 18, CY + 28, { knee: [CX + 24, CY + 18] })}
    ${foot(CX - 6, CY + 60)}
  `;
  return wrapFigure(size, body);
}

export function poseTreePose(size) {
  // Sole on inner thigh, arms overhead
  const body = `
    ${floorLine(20, 180, CY + 60)}
    ${head(CX, CY - 32, 12)}
    ${torso(CX, CY - 18, 28, 36)}
    ${arm(CX - 14, CY - 14, CX - 8, CY - 50, { elbow: [CX - 14, CY - 32] })}
    ${arm(CX + 14, CY - 14, CX + 8, CY - 50, { elbow: [CX + 14, CY - 32] })}
    ${leg(CX - 4, CY + 18, CX - 6, CY + 58)}
    ${leg(CX + 6, CY + 18, CX, CY + 14, { knee: [CX + 28, CY + 22] })}
    ${foot(CX - 6, CY + 60)}
  `;
  return wrapFigure(size, body);
}

export function poseHeelToeWalk(size) {
  // Walking, one foot heel touching toe of other
  const body = `
    ${floorLine(20, 180, CY + 60)}
    ${head(CX, CY - 30, 12, { dir: 'side' })}
    ${torso(CX, CY - 14, 26, 38)}
    ${arm(CX - 14, CY - 10, CX - 18, CY + 14)}
    ${arm(CX + 14, CY - 10, CX + 18, CY + 14)}
    ${leg(CX - 6, CY + 24, CX + 4, CY + 58)}
    ${leg(CX + 6, CY + 24, CX - 4, CY + 58)}
    ${foot(CX + 4, CY + 60, 0, { rx: 9 })}
    ${foot(CX - 4, CY + 60, 0, { rx: 9 })}
  `;
  return wrapFigure(size, body);
}

export function poseSitToStand(size) {
  // Mid-rise from cross-legged
  const body = `
    ${floorLine(20, 180, CY + 60)}
    ${head(CX - 6, CY - 14, 12)}
    ${torso(CX - 4, CY, 26, 30, 12)}
    ${arm(CX - 14, CY + 4, CX - 30, CY + 14)}
    ${arm(CX + 8, CY + 4, CX + 30, CY - 10)}
    ${leg(CX, CY + 26, CX + 20, CY + 58, { knee: [CX + 30, CY + 30] })}
    ${leg(CX + 4, CY + 26, CX - 20, CY + 58, { knee: [CX - 16, CY + 50] })}
  `;
  return wrapFigure(size, body);
}

export function poseSingleLegDeadlift(size) {
  // Hinge on one leg, other leg extended back
  const body = `
    ${floorLine(20, 180, CY + 60)}
    ${head(CX - 30, CY + 6, 12, { dir: 'down' })}
    ${torso(CX - 18, CY + 12, 26, 30, 80)}
    ${arm(CX - 14, CY + 18, CX - 14, CY + 38)}
    ${arm(CX - 4, CY + 22, CX - 4, CY + 38)}
    ${leg(CX + 6, CY + 24, CX + 8, CY + 58)}
    ${leg(CX + 12, CY + 18, CX + 56, CY + 16)}
    ${foot(CX + 8, CY + 60)}
  `;
  return wrapFigure(size, body);
}

export function poseRomberg(size) {
  // Standing, feet together, eyes closed
  const body = `
    ${floorLine(20, 180, CY + 60)}
    ${head(CX, CY - 32, 12, { dir: 'down' })}
    ${torso(CX, CY - 18, 28, 38)}
    ${arm(CX - 14, CY - 14, CX - 16, CY + 18)}
    ${arm(CX + 14, CY - 14, CX + 16, CY + 18)}
    ${leg(CX - 3, CY + 22, CX - 4, CY + 58)}
    ${leg(CX + 3, CY + 22, CX + 4, CY + 58)}
    ${foot(CX - 4, CY + 60)}
    ${foot(CX + 4, CY + 60)}
  `;
  return wrapFigure(size, body);
}

export function posePallofPress(size) {
  // Standing, band to one side, pressing out
  const body = `
    ${head(CX, CY - 30, 12, { dir: 'side' })}
    ${torso(CX, CY - 14, 28, 38)}
    ${arm(CX, CY - 8, CX + 36, CY - 8)}
    ${arm(CX - 4, CY - 4, CX + 32, CY - 4)}
    ${leg(CX - 6, CY + 24, CX - 8, CY + 58)}
    ${leg(CX + 6, CY + 24, CX + 8, CY + 58)}
    <line x1="${CX + 36}" y1="${CY - 6}" x2="${CX + 76}" y2="${CY - 6}" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6"/>
  `;
  return wrapFigure(size, body);
}

// ===== PILATES =====

export function poseHundred(size) {
  // Supine, head + shoulders curled up, arms pumping by hips, legs in tabletop
  const body = `
    ${floorLine(15, 185, CY + 44)}
    ${head(CX - 64, CY - 6, 14, { dir: 'side' })}
    <ellipse cx="${CX - 26}" cy="${CY + 16}" rx="34" ry="14" fill="${C.shirt}"/>
    ${arm(CX - 50, CY + 8, CX - 78, CY + 30, { width: 7 })}
    ${arm(CX - 50, CY + 16, CX - 78, CY + 38, { width: 7 })}
    ${leg(CX + 6, CY + 24, CX + 30, CY - 20, { knee: [CX + 38, CY + 4], width: 12 })}
    ${leg(CX + 10, CY + 30, CX + 38, CY - 14, { knee: [CX + 46, CY + 8], width: 12 })}
    ${motionArrow(CX - 80, CY + 12, CX - 80, CY + 22, CX - 80, CY + 36, { color: '#fff', width: 2.5 })}
    ${motionArrow(CX - 80, CY + 38, CX - 80, CY + 28, CX - 80, CY + 14, { color: '#fff', width: 2.5 })}
  `;
  return wrapFigure(size, body);
}

export function poseRollUp(size) {
  // Sit-up mid-roll, arms reaching forward
  const body = `
    ${floorLine(20, 180, CY + 34)}
    ${head(CX - 2, CY - 14, 12, { dir: 'down' })}
    <path d="M ${CX - 16} ${CY} Q ${CX - 4} ${CY - 8} ${CX + 8} ${CY + 14} L ${CX + 8} ${CY + 22} L ${CX - 16} ${CY + 22} Z" fill="${C.shirt}"/>
    ${arm(CX + 4, CY - 2, CX + 38, CY - 4, { elbow: [CX + 22, CY - 8] })}
    ${arm(CX + 6, CY + 4, CX + 36, CY + 2)}
    <line x1="${CX + 6}" y1="${CY + 22}" x2="${CX + 56}" y2="${CY + 26}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
    <line x1="${CX + 6}" y1="${CY + 26}" x2="${CX + 56}" y2="${CY + 30}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
  `;
  return wrapFigure(size, body);
}

export function poseDoubleLegStretch(size) {
  // Supine, both legs extended at 45°, arms back, head curled
  const body = `
    ${floorLine(20, 180, CY + 30)}
    ${head(CX - 48, CY - 2, 11, { dir: 'side' })}
    <ellipse cx="${CX - 22}" cy="${CY + 10}" rx="22" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 36, CY + 4, CX - 60, CY - 14)}
    ${arm(CX - 36, CY + 10, CX - 60, CY - 8)}
    ${leg(CX + 4, CY + 16, CX + 56, CY - 12)}
    ${leg(CX + 6, CY + 18, CX + 56, CY - 6)}
  `;
  return wrapFigure(size, body);
}

export function poseSingleLegStretch(size) {
  // Supine, one knee in, one leg extended out
  const body = `
    ${floorLine(20, 180, CY + 30)}
    ${head(CX - 48, CY - 2, 11, { dir: 'side' })}
    <ellipse cx="${CX - 22}" cy="${CY + 10}" rx="22" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 16, CY + 4, CX + 6, CY + 4, { elbow: [CX - 6, CY] })}
    ${arm(CX - 14, CY + 12, CX + 14, CY + 14, { elbow: [CX, CY + 6] })}
    ${leg(CX + 4, CY + 16, CX + 16, CY - 4, { knee: [CX + 20, CY + 6] })}
    ${leg(CX + 6, CY + 18, CX + 56, CY + 6)}
  `;
  return wrapFigure(size, body);
}

export function poseCrissCross(size) {
  // Supine twist, elbow to opposite knee
  const body = `
    ${floorLine(20, 180, CY + 30)}
    ${head(CX - 42, CY - 4, 11, { dir: 'side' })}
    <ellipse cx="${CX - 18}" cy="${CY + 10}" rx="22" ry="10" fill="${C.shirt}" transform="rotate(-12 ${CX - 18} ${CY + 10})"/>
    ${arm(CX - 28, CY + 4, CX - 30, CY - 14, { elbow: [CX - 36, CY - 6] })}
    ${arm(CX - 6, CY + 2, CX + 18, CY - 6, { elbow: [CX + 8, CY - 8] })}
    ${leg(CX + 4, CY + 16, CX + 14, CY - 4, { knee: [CX + 20, CY + 6] })}
    ${leg(CX + 6, CY + 18, CX + 50, CY + 14)}
  `;
  return wrapFigure(size, body);
}

export function poseTeaser(size) {
  // V-hold: torso up + legs up at ~45°, hands reaching toes
  const body = `
    ${floorLine(15, 185, CY + 50)}
    <!-- sit-bones contact -->
    <ellipse cx="${CX - 8}" cy="${CY + 36}" rx="14" ry="4" fill="rgba(255,255,255,0.18)"/>
    <!-- torso angled up-right -->
    ${head(CX - 38, CY - 26, 14)}
    ${torso(CX - 30, CY - 8, 30, 36, 36)}
    <!-- arms reaching forward to toes -->
    ${arm(CX - 10, CY + 14, CX + 48, CY - 20, { width: 7 })}
    ${arm(CX - 4, CY + 22, CX + 52, CY - 14, { width: 7 })}
    <!-- legs angled up at ~45° -->
    <line x1="${CX + 4}" y1="${CY + 30}" x2="${CX + 54}" y2="${CY - 22}" stroke="${C.pants}" stroke-width="13" stroke-linecap="round"/>
    <line x1="${CX + 8}" y1="${CY + 36}" x2="${CX + 58}" y2="${CY - 16}" stroke="${C.pants}" stroke-width="13" stroke-linecap="round"/>
  `;
  return wrapFigure(size, body);
}

export function poseRollOver(size) {
  // Inverted: shoulders on floor, legs reaching back over head
  const body = `
    ${floorLine(20, 180, CY + 36)}
    ${head(CX - 50, CY + 20, 11, { dir: 'side' })}
    <ellipse cx="${CX - 22}" cy="${CY + 22}" rx="22" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 36, CY + 24, CX - 56, CY + 30)}
    ${arm(CX - 12, CY + 28, CX - 4, CY + 32)}
    <line x1="${CX - 4}" y1="${CY + 18}" x2="${CX - 20}" y2="${CY - 26}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
    <line x1="${CX + 2}" y1="${CY + 22}" x2="${CX - 14}" y2="${CY - 22}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
  `;
  return wrapFigure(size, body);
}

export function poseSaw(size) {
  // Seated, legs wide; rotated and reaching past opposite foot
  const body = `
    ${floorLine(20, 180, CY + 38)}
    <line x1="${CX}" y1="${CY + 22}" x2="${CX - 50}" y2="${CY + 32}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
    <line x1="${CX}" y1="${CY + 22}" x2="${CX + 50}" y2="${CY + 32}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
    ${head(CX - 18, CY + 10, 11, { dir: 'down' })}
    <ellipse cx="${CX - 10}" cy="${CY + 18}" rx="18" ry="10" fill="${C.shirt}" transform="rotate(-12 ${CX - 10} ${CY + 18})"/>
    ${arm(CX - 22, CY + 14, CX - 50, CY + 28)}
    ${arm(CX - 2, CY + 20, CX + 28, CY + 4)}
  `;
  return wrapFigure(size, body);
}

export function poseSpineStretch(size) {
  // Seated, legs wide, rounded fold forward articulating through spine
  const body = `
    ${floorLine(20, 180, CY + 38)}
    <line x1="${CX}" y1="${CY + 22}" x2="${CX - 50}" y2="${CY + 32}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
    <line x1="${CX}" y1="${CY + 22}" x2="${CX + 50}" y2="${CY + 32}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
    ${head(CX, CY + 6, 11, { dir: 'down' })}
    <path d="M ${CX - 14} ${CY + 14} Q ${CX} ${CY + 4} ${CX + 14} ${CY + 14} L ${CX + 10} ${CY + 22} L ${CX - 10} ${CY + 22} Z" fill="${C.shirt}"/>
    ${arm(CX - 8, CY + 14, CX - 20, CY + 26)}
    ${arm(CX + 8, CY + 14, CX + 20, CY + 26)}
  `;
  return wrapFigure(size, body);
}

export function poseSwimming(size) {
  // Prone, opposite arm + leg lifted, fluttery (use motion lines)
  const body = `
    ${floorLine(20, 180, CY + 28)}
    ${head(CX - 38, CY - 4, 11, { dir: 'down' })}
    <ellipse cx="${CX - 6}" cy="${CY + 6}" rx="26" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 26, CY - 2, CX - 56, CY - 14)}
    ${arm(CX - 26, CY + 8, CX - 50, CY + 6)}
    ${leg(CX + 14, CY + 6, CX + 52, CY - 12)}
    ${leg(CX + 14, CY + 12, CX + 48, CY + 8)}
    <path d="M ${CX - 50} ${CY - 18} L ${CX - 56} ${CY - 22}" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    <path d="M ${CX + 50} ${CY - 16} L ${CX + 56} ${CY - 20}" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
  `;
  return wrapFigure(size, body);
}

export function poseSideKick(size) {
  // Side-lying, top leg lifted and kicked forward
  const body = `
    ${floorLine(20, 180, CY + 30)}
    ${head(CX - 50, CY + 6, 12, { dir: 'side' })}
    <ellipse cx="${CX - 8}" cy="${CY + 14}" rx="34" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 32, CY + 6, CX - 50, CY + 18)}
    ${arm(CX - 28, CY + 14, CX, CY + 10, { elbow: [CX - 16, CY + 4] })}
    ${leg(CX + 26, CY + 16, CX + 60, CY + 18)}
    <line x1="${CX + 26}" y1="${CY + 12}" x2="${CX + 58}" y2="${CY - 6}" stroke="${C.pants}" stroke-width="10" stroke-linecap="round"/>
    ${motionArrow(CX + 60, CY + 8, CX + 60, CY, CX + 60, CY - 6, { color: '#fff' })}
  `;
  return wrapFigure(size, body);
}

export function poseMermaid(size) {
  // Side-seated, one arm reaching over head
  const body = `
    ${floorLine(20, 180, CY + 38)}
    <line x1="${CX - 38}" y1="${CY + 28}" x2="${CX + 8}" y2="${CY + 28}" stroke="${C.pants}" stroke-width="14" stroke-linecap="round"/>
    ${head(CX + 8, CY - 12, 12)}
    ${torso(CX + 8, CY + 4, 26, 24, -28)}
    ${arm(CX + 2, CY + 6, CX - 28, CY - 40, { elbow: [CX - 18, CY - 24] })}
    ${arm(CX + 22, CY + 6, CX + 22, CY + 24)}
  `;
  return wrapFigure(size, body);
}

export function poseOpenLegRocker(size) {
  // Seated balance, holding ankles, legs in V
  const body = `
    ${floorLine(20, 180, CY + 38)}
    ${head(CX - 4, CY - 24, 12)}
    ${torso(CX - 4, CY - 10, 26, 22, -10)}
    ${arm(CX - 14, CY - 6, CX - 32, CY + 14, { elbow: [CX - 24, CY] })}
    ${arm(CX + 8, CY - 6, CX + 32, CY + 14, { elbow: [CX + 24, CY] })}
    <line x1="${CX - 6}" y1="${CY + 12}" x2="${CX - 36}" y2="${CY - 18}" stroke="${C.pants}" stroke-width="10" stroke-linecap="round"/>
    <line x1="${CX + 6}" y1="${CY + 12}" x2="${CX + 36}" y2="${CY - 18}" stroke="${C.pants}" stroke-width="10" stroke-linecap="round"/>
  `;
  return wrapFigure(size, body);
}

export function poseLegCircles(size) {
  // Supine, one leg straight up with a small circle arrow around the foot
  const body = `
    ${floorLine(20, 180, CY + 28)}
    ${head(CX - 50, CY + 4, 11, { dir: 'side' })}
    <ellipse cx="${CX - 22}" cy="${CY + 12}" rx="22" ry="10" fill="${C.shirt}"/>
    ${arm(CX - 36, CY + 4, CX - 56, CY + 14)}
    ${arm(CX - 36, CY + 14, CX - 50, CY + 22)}
    <line x1="${CX - 4}" y1="${CY + 14}" x2="${CX + 2}" y2="${CY - 38}" stroke="${C.pants}" stroke-width="11" stroke-linecap="round"/>
    ${leg(CX + 4, CY + 16, CX + 50, CY + 22)}
    <circle cx="${CX + 2}" cy="${CY - 38}" r="10" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.75"/>
  `;
  return wrapFigure(size, body);
}

export function posePilatesBridge(size) {
  // Pelvic curl — hips lifted, spine slightly articulated (high bridge)
  const body = `
    ${floorLine(20, 180, CY + 34)}
    ${head(CX - 50, CY + 22, 11, { dir: 'side' })}
    <path d="M ${CX - 34} ${CY + 20} Q ${CX - 10} ${CY - 4} ${CX + 14} ${CY + 12} L ${CX + 14} ${CY + 22} L ${CX - 34} ${CY + 22} Z" fill="${C.shirt}"/>
    ${arm(CX - 32, CY + 22, CX - 50, CY + 32)}
    ${arm(CX - 4, CY + 14, CX + 4, CY + 32, { elbow: [CX + 6, CY + 20] })}
    ${leg(CX + 12, CY + 12, CX + 30, CY + 32, { knee: [CX + 30, CY + 10] })}
    ${leg(CX + 14, CY + 16, CX + 32, CY + 32, { knee: [CX + 32, CY + 14] })}
  `;
  return wrapFigure(size, body);
}

// ===== Exercise → pose mapping =====

export const POSE_MAP = {
  // Neck
  chin_tucks: poseChinTuck,
  neck_flexion: poseNeckFlexion,
  neck_extension: poseNeckExtension,
  ear_to_shoulder: poseNeckLateral,
  neck_rotation: poseNeckRotation,
  upper_trap_stretch: poseUpperTrap,
  levator_scapulae_stretch: poseLevator,
  scalene_stretch: poseScalene,

  // Shoulders
  shoulder_rolls: poseShoulderRolls,
  cross_body_shoulder: poseCrossBodyShoulder,
  eagle_arms: poseEagleArms,
  cow_face_arms: poseCowFaceArms,
  reverse_prayer: poseReversePrayer,
  doorway_pec: poseDoorwayPecMid,
  doorway_pec_high: poseDoorwayPecHigh,
  doorway_pec_low: poseDoorwayPecLow,
  sleeper_stretch: poseSleeperStretch,
  wall_slides: poseWallSlide,
  thread_needle: poseThreadNeedle,
  child_pose_extended: poseChildsPoseExtended,
  pendulum_swings: posePendulum,

  // Upper back
  cat_cow: poseCatCow,
  thoracic_extension_chair: poseThoracicExtChair,
  open_book: poseOpenBook,
  quadruped_tspine_rotation: poseQuadrupedTspineRot,
  wall_angels: poseWallAngels,
  bear_hug: poseBearHug,
  foam_roller_tspine: poseFoamRollerTspine,

  // Chest
  corner_stretch: poseCornerStretch,
  floor_y_hold: poseProneY,
  reclined_butterfly: poseReclinedButterfly,

  // Lower back
  childs_pose: poseChildsPose,
  knee_to_chest: poseKneeToChest,
  cobra: poseCobra,
  sphinx: poseSphinx,
  supine_spinal_twist: poseSupineTwist,
  bird_dog: poseBirdDog,
  glute_bridge: poseGluteBridge,
  mckenzie_press_ups: poseMckenziePressup,
  superman_hold: poseSuperman,

  // Hips
  kneeling_hip_flexor: poseKneelingHipFlexor,
  couch_stretch: poseCouchStretch,
  pigeon_pose: posePigeon,
  half_pigeon_supine: poseHalfPigeonSupine,
  frog_stretch: poseFrog,
  butterfly_stretch: poseButterfly,
  ninety_ninety: poseNinetyNinety,
  lizard_pose: poseLizard,
  reclined_figure4: poseFigure4,
  figure4_stretch: poseFigure4,
  deep_squat_hold: poseDeepSquat,

  // Glutes
  single_leg_glute_bridge: poseSingleLegGluteBridge,
  clamshells: poseClamshell,
  fire_hydrants: poseFireHydrant,
  side_lying_hip_abduction: poseSideLyingAbduction,
  donkey_kicks: poseDonkeyKick,

  // Hamstrings
  standing_forward_fold: poseStandingForwardFold,
  seated_forward_fold: poseSeatedForwardFold,
  supine_hamstring_strap: poseSupineHamstring,
  wide_leg_forward_fold: poseWideLegFold,
  single_leg_forward_fold: poseSingleLegFold,
  standing_hamstring_chair: poseStandingHamstringChair,
  down_dog: poseDownDog,
  toe_to_wall: poseToeToWall,

  // Quads
  standing_quad: poseStandingQuad,
  side_lying_quad: poseSideLyingQuad,
  kneeling_quad: poseKneelingQuad,
  hero_pose: poseHeroPose,

  // Ankles & calves
  standing_calf: poseStandingCalf,
  bent_knee_calf: poseBentKneeCalf,
  down_dog_pedal: poseDownDogPedal,
  heel_drops: poseHeelDrops,
  ankle_circles: poseAnkleCircles,
  banded_ankle_distraction: poseBandedAnkle,

  // Core anterior
  forearm_plank: posePlank,
  knee_plank: poseKneePlank,
  dead_bug: poseDeadBug,
  hollow_body_hold: poseHollowBody,
  hollow_body_rocks: poseHollowBodyRocks,
  toe_taps: poseToeTaps,
  leg_lowers: poseLegLowers,
  v_sit_hold: poseVSit,

  // Core lateral
  side_plank: poseSidePlank,
  side_plank_knees: poseSidePlankKnees,
  side_bend: poseSideBend,
  standing_oblique_reach: poseStandingObliqueReach,
  pallof_press: posePallofPress,

  // Core posterior
  reverse_plank: poseReversePlank,
  quadruped_opp_raise: poseQuadrupedOppRaise,
  prone_ytw: poseProneY,

  // Full body
  bodyweight_squat: poseBodyweightSquatTempo,
  goblet_squat_hold: poseGobletSquat,
  forward_lunge: poseForwardLunge,
  reverse_lunge: poseReverseLunge,
  lateral_lunge: poseLateralLunge,
  worlds_greatest_stretch: poseWorldsGreatest,
  cossack_squat: poseCossackSquat,
  down_dog_flow: poseDownDogFlow,

  // Balance
  single_leg_balance: poseSingleLegBalance,
  tree_pose: poseTreePose,
  heel_toe_walk: poseHeelToeWalk,
  sit_to_stand_practice: poseSitToStand,
  single_leg_deadlift: poseSingleLegDeadlift,
  eyes_closed_romberg: poseRomberg,

  // Pilates
  pilates_hundred: poseHundred,
  pilates_roll_up: poseRollUp,
  pilates_double_leg_stretch: poseDoubleLegStretch,
  pilates_single_leg_stretch: poseSingleLegStretch,
  pilates_criss_cross: poseCrissCross,
  pilates_teaser: poseTeaser,
  pilates_roll_over: poseRollOver,
  pilates_saw: poseSaw,
  pilates_spine_stretch: poseSpineStretch,
  pilates_swimming: poseSwimming,
  pilates_side_kick: poseSideKick,
  pilates_mermaid: poseMermaid,
  pilates_open_leg_rocker: poseOpenLegRocker,
  pilates_leg_circles: poseLegCircles,
  pilates_bridge: posePilatesBridge,
};

export function illustrationFor(exerciseId, size = 170) {
  const fn = POSE_MAP[exerciseId];
  if (!fn) return poseShoulderRolls(size); // gentle fallback
  return fn(size);
}

// Direct illustration for a measurement test (KPI demo). Each KPI gets a
// dedicated pose chosen to clearly convey what's being measured.
const KPI_TEST_POSE = {
  f1_forward_fold: poseSeatedForwardFold,
  f2_slr: poseSupineHamstring,
  f3_hip_flexor: poseCouchStretch,
  f4_knee_to_wall: poseToeToWall,
  f5_apley: poseCowFaceArms,
  f6_overhead: poseOverheadReachSupine,
  f7_tspine: poseOpenBook,
  f8_cervical_rom: poseNeckLateral,
  f9_butterfly: poseButterfly,
  f10_deep_squat: poseDeepSquat,
  f11_aslr: poseSupineHamstring,
  c1_front_plank: posePlank,
  c2_side_plank: poseSidePlank,
  c3_flexor: poseHollowBody,
  c4_extensor: poseSuperman,
  b2_one_leg_eyes_closed: poseSingleLegBalance,
  b3_sit_to_stand: poseSitToStand,
};

export function testIllustrationFor(kpiId, size = 150) {
  const fn = KPI_TEST_POSE[kpiId];
  return fn ? fn(size) : poseShoulderRolls(size);
}

// Hero illustration — picks a pose appropriate for the routine's primary area
const AREA_HERO_POSE = {
  neck: poseNeckLateral,
  shoulders: poseShoulderRolls,
  upper_back: poseCatCow,
  chest: poseCornerStretch,
  lower_back: poseChildsPose,
  hips: poseButterfly,
  glutes: poseGluteBridge,
  hamstrings: poseStandingForwardFold,
  quads: poseStandingQuad,
  ankles_calves: poseStandingCalf,
  core_anterior: posePlank,
  core_lateral: poseSidePlank,
  core_posterior: poseSuperman,
  full_body: poseDeepSquat,
  balance: poseTreePose,
};

export function heroIllustration(areaId, size = 120) {
  const fn = AREA_HERO_POSE[areaId];
  return fn ? fn(size) : poseShoulderRolls(size);
}
