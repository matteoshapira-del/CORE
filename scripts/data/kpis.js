// KPI definitions per PRD §7. Each has a scoring function from raw value → 1..5.
// kind: 'distance' (cm/in), 'angle' (degrees), 'time' (seconds), 'qualitative' (1-5 picker)
// sided: true if L/R is measured separately
const BAND_LABELS = {
  1: 'Plenty of room to grow.',
  2: 'Working ground.',
  3: 'Solid base. Average for your age.',
  4: 'Strong — above most.',
  5: 'Top tier. Nice work.',
};

function score(value, bands) {
  // bands: array of { max?, min?, score } evaluated in order
  for (const b of bands) {
    if ('max' in b && value < b.max) return b.score;
    if ('min' in b && value >= b.min) return b.score;
  }
  return 3;
}

export const KPIS = [
  {
    id: 'f1_forward_fold',
    name: 'Forward Fold',
    shortName: 'Forward Fold',
    plain: 'How far you can reach past your toes when seated with straight legs.',
    unit: 'cm', kind: 'distance', sided: false,
    protocol: 'Sit-and-reach. Legs straight, feet at wall as zero line. Best of 3 trials.',
    setup: ['Sit on the floor', 'Legs straight, feet against wall', 'Reach forward, hold 2 seconds'],
    scoreFn: v => score(v, [
      { max: -10, score: 1 },
      { max: 0, score: 2 },
      { max: 7, score: 3 },
      { max: 15, score: 4 },
      { min: 15, score: 5 },
    ]),
    areas: ['lower_back', 'hamstrings'],
  },
  {
    id: 'f2_slr',
    name: 'Straight-Leg Raise',
    shortName: 'SLR',
    plain: 'How high you can lift one straight leg lying on your back.',
    unit: '°', kind: 'angle', sided: true,
    protocol: 'Supine, opposite leg flat. Lift one straight leg until first resistance. Hip flexion angle.',
    setup: ['Lie on your back', 'Opposite leg flat on floor', 'Lift one straight leg slowly until you feel resistance'],
    scoreFn: v => score(v, [
      { max: 50, score: 1 },
      { max: 65, score: 2 },
      { max: 80, score: 3 },
      { max: 90, score: 4 },
      { min: 90, score: 5 },
    ]),
    areas: ['hamstrings'],
  },
  {
    id: 'f3_hip_flexor',
    name: 'Hip Flexor (Thomas)',
    shortName: 'Hip Flexor',
    plain: 'How well your hip flexors release when one leg hangs off a bench.',
    unit: 'qualitative', kind: 'qualitative', sided: true,
    protocol: 'Lie on edge of bench, knees to chest. Lower one leg toward floor.',
    setup: ['Lie on edge of a bench', 'Pull both knees to your chest', 'Slowly lower one leg toward the floor'],
    scoreFn: v => Math.max(1, Math.min(5, Math.round(v))),
    qualitativeOptions: [
      { v: 1, label: 'Thigh above horizontal, knee fully extended' },
      { v: 2, label: 'Thigh above horizontal OR knee past 80°' },
      { v: 3, label: 'Thigh at horizontal, knee at 80°' },
      { v: 4, label: 'Thigh slightly below horizontal, knee ~90°' },
      { v: 5, label: 'Thigh comfortably below horizontal, knee past 90°' },
    ],
    areas: ['hips', 'quads'],
  },
  {
    id: 'f4_knee_to_wall',
    name: 'Knee-to-Wall',
    shortName: 'Knee-to-Wall',
    plain: 'How much your ankle bends — the foundation of squats, lunges, and pain-free knees.',
    unit: 'cm', kind: 'distance', sided: true,
    protocol: 'Lunge stance facing wall. Slide foot back until knee just touches wall heel-down.',
    setup: ['Face a wall in lunge stance', 'Keep heel down', 'Touch knee to wall and measure big-toe-to-wall'],
    scoreFn: v => score(v, [
      { max: 3, score: 1 },
      { max: 6, score: 2 },
      { max: 9, score: 3 },
      { max: 12, score: 4 },
      { min: 12, score: 5 },
    ]),
    asymmetryThresholdAbs: 1.5,
    areas: ['ankles_calves'],
  },
  {
    id: 'f5_apley',
    name: 'Shoulder IR (Apley)',
    shortName: 'Shoulder IR',
    plain: 'Reach one hand over your shoulder down the back; the other up behind your back. Measure the gap.',
    unit: 'cm', kind: 'distance', sided: true,
    protocol: 'One hand over shoulder down back; other up behind back. Measure fingertip gap.',
    setup: ['Stand or sit tall', 'Reach one arm up and over the shoulder', 'Reach the other up behind the back'],
    // For gaps, lower = better. Invert for scoring.
    scoreFn: v => score(-v, [ // negative gap = overlap (good)
      { max: -10, score: 1 },  // gap > 20 → -20 < -10
      { max: 0, score: 2 },
      { max: 9, score: 3 },
      { max: 20, score: 4 },
      { min: 20, score: 5 },
    ]),
    inverted: true, // smaller number is better
    areas: ['shoulders'],
  },
  {
    id: 'f6_overhead',
    name: 'Overhead Reach',
    shortName: 'Overhead',
    plain: 'Lying on your back, knees bent, how close your arms reach the floor overhead without arching.',
    unit: 'cm', kind: 'distance', sided: false,
    protocol: 'Supine, knees bent, low back flat. Raise both arms overhead toward floor. Measure gap.',
    setup: ['Lie on back, knees bent', 'Keep low back flat against floor', 'Raise both arms overhead toward floor'],
    scoreFn: v => score(v, [
      { max: -1, score: 5 },   // overlap (full contact)
      { max: 3, score: 4 },
      { max: 10, score: 3 },
      { max: 20, score: 2 },
      { min: 20, score: 1 },
    ]),
    inverted: true,
    areas: ['shoulders', 'upper_back'],
  },
  {
    id: 'f7_tspine',
    name: 'T-Spine Rotation',
    shortName: 'T-Spine',
    plain: 'How far you can twist your upper back while seated.',
    unit: '°', kind: 'angle', sided: true,
    protocol: 'Seated, dowel across collarbones. Rotate as far as possible each direction.',
    setup: ['Sit tall on a chair', 'Hold a dowel across your collarbones', 'Rotate as far as comfortable each direction'],
    scoreFn: v => score(v, [
      { max: 15, score: 1 },
      { max: 30, score: 2 },
      { max: 45, score: 3 },
      { max: 60, score: 4 },
      { min: 60, score: 5 },
    ]),
    areas: ['upper_back'],
  },
  {
    id: 'f8_cervical_rom',
    name: 'Cervical ROM',
    shortName: 'Neck ROM',
    plain: 'Average of four neck directions: flexion, extension, lateral flexion, rotation.',
    unit: 'qualitative', kind: 'qualitative', sided: false,
    protocol: 'Sit upright, neutral spine. Composite "Neck Score" = average of all four directions.',
    setup: ['Sit upright, neutral spine', 'Move neck through each direction', 'Rate overall comfort and range'],
    scoreFn: v => Math.max(1, Math.min(5, Math.round(v))),
    qualitativeOptions: [
      { v: 1, label: 'All directions feel tight or restricted' },
      { v: 2, label: 'Most directions limited; some discomfort' },
      { v: 3, label: 'Average — within normal ranges' },
      { v: 4, label: 'Above average — comfortable in all 4 directions' },
      { v: 5, label: 'Full range, no restriction' },
    ],
    areas: ['neck'],
  },
  {
    id: 'f9_butterfly',
    name: 'Butterfly (Knee-to-Floor)',
    shortName: 'Butterfly',
    plain: 'Seated butterfly. How close your knees rest to the floor.',
    unit: 'cm', kind: 'distance', sided: false,
    protocol: 'Seated butterfly. Measure knee-to-floor distance.',
    setup: ['Sit with soles together', 'Let knees fall outward', 'Measure knee-to-floor distance'],
    scoreFn: v => score(v, [
      { max: 3, score: 5 },
      { max: 8, score: 4 },
      { max: 15, score: 3 },
      { max: 25, score: 2 },
      { min: 25, score: 1 },
    ]),
    inverted: true,
    areas: ['hips'],
  },
  {
    id: 'f10_deep_squat',
    name: 'Deep Squat (FMS)',
    shortName: 'Deep Squat',
    plain: 'How deep a heels-down, dowel-overhead squat you can hold.',
    unit: 'qualitative', kind: 'qualitative', sided: false,
    protocol: 'Feet shoulder-width, dowel overhead with elbows locked, descend as deep as possible.',
    setup: ['Feet shoulder-width', 'Hold dowel overhead, elbows locked', 'Descend as deep as possible, heels down'],
    scoreFn: v => Math.max(1, Math.min(5, Math.round(v))),
    qualitativeOptions: [
      { v: 1, label: 'Cannot reach parallel even with heel elevation' },
      { v: 2, label: 'Below parallel with heels elevated, dowel forward' },
      { v: 3, label: 'Below parallel heels-down, dowel drifts forward' },
      { v: 4, label: 'Full depth, dowel slightly forward' },
      { v: 5, label: 'Full depth, dowel over midfoot, torso upright' },
    ],
    areas: ['full_body'],
  },
  {
    id: 'f11_aslr',
    name: 'Active Straight-Leg Raise',
    shortName: 'ASLR',
    plain: 'Lying down: how high you can raise one straight leg with the other flat.',
    unit: '°', kind: 'angle', sided: true,
    protocol: 'Supine, opposite leg flat. Active leg raise with knee straight, toes up.',
    setup: ['Lie on back', 'Keep opposite leg flat', 'Raise straight leg as high as comfortable'],
    scoreFn: v => score(v, [
      { max: 50, score: 1 },
      { max: 65, score: 2 },
      { max: 80, score: 3 },
      { max: 90, score: 4 },
      { min: 90, score: 5 },
    ]),
    areas: ['full_body'],
  },
  {
    id: 'c1_front_plank',
    name: 'Front Plank',
    shortName: 'Plank',
    plain: 'How long you can hold a forearm plank with good form.',
    unit: 's', kind: 'time', sided: false,
    protocol: 'Forearm plank, body straight. Hold to failure or 4:00 cap.',
    setup: ['Get into forearm plank', 'Body straight, no sagging', 'Hold to failure (or 4 min max)'],
    scoreFn: v => score(v, [
      { max: 20, score: 1 },
      { max: 45, score: 2 },
      { max: 90, score: 3 },
      { max: 180, score: 4 },
      { min: 180, score: 5 },
    ]),
    areas: ['core_anterior'],
  },
  {
    id: 'c2_side_plank',
    name: 'Side Plank',
    shortName: 'Side Plank',
    plain: 'How long you can hold a side plank, each side.',
    unit: 's', kind: 'time', sided: true,
    protocol: 'McGill side-bridge protocol. Hold to failure each side.',
    setup: ['Get into forearm side plank', 'Hips up, body in a line', 'Hold to failure each side'],
    scoreFn: v => score(v, [
      { max: 20, score: 1 },
      { max: 45, score: 2 },
      { max: 75, score: 3 },
      { max: 120, score: 4 },
      { min: 120, score: 5 },
    ]),
    asymmetryThresholdPct: 20,
    areas: ['core_lateral'],
  },
  {
    id: 'c3_flexor',
    name: 'Trunk Flexor Endurance',
    shortName: 'Flexor Endurance',
    plain: 'McGill 60° hold — anti-extension trunk strength.',
    unit: 's', kind: 'time', sided: false,
    protocol: 'Sit on floor, back at 60° from horizontal, knees bent, feet anchored. Hold to failure.',
    setup: ['Sit, back leaned at ~60°', 'Knees bent, feet anchored', 'Hold the position to failure'],
    scoreFn: v => score(v, [
      { max: 30, score: 1 },
      { max: 60, score: 2 },
      { max: 100, score: 3 },
      { max: 150, score: 4 },
      { min: 150, score: 5 },
    ]),
    areas: ['core_anterior'],
  },
  {
    id: 'c4_extensor',
    name: 'Trunk Extensor Endurance',
    shortName: 'Extensor Endurance',
    plain: 'Biering-Sørensen — how long you can hold horizontal with lower body anchored.',
    unit: 's', kind: 'time', sided: false,
    protocol: 'Prone on bench, upper body unsupported past iliac crest. Hold horizontal to failure.',
    setup: ['Lie face-down on bench', 'Upper body off the edge past hips', 'Hold horizontal to failure'],
    scoreFn: v => score(v, [
      { max: 30, score: 1 },
      { max: 60, score: 2 },
      { max: 100, score: 3 },
      { max: 150, score: 4 },
      { min: 150, score: 5 },
    ]),
    areas: ['lower_back', 'core_posterior'],
  },
  {
    id: 'b2_one_leg_eyes_closed',
    name: 'One-Leg Balance (Eyes Closed)',
    shortName: 'Balance EC',
    plain: 'Stand on one leg, arms crossed, eyes closed. Time to first touch-down.',
    unit: 's', kind: 'time', sided: true,
    protocol: 'Stand on one leg, arms crossed, eyes closed. Time to first touch-down.',
    setup: ['Stand on one leg', 'Cross arms over chest', 'Close eyes; time until you touch down'],
    scoreFn: v => score(v, [
      { max: 5, score: 1 },
      { max: 10, score: 2 },
      { max: 20, score: 3 },
      { max: 30, score: 4 },
      { min: 30, score: 5 },
    ]),
    areas: ['balance'],
  },
  {
    id: 'b3_sit_to_stand',
    name: 'Sit-to-Stand',
    shortName: 'Sit-to-Stand',
    plain: 'From cross-legged on the floor, can you stand without using hands or knees?',
    unit: 'qualitative', kind: 'qualitative', sided: false,
    protocol: 'From cross-legged seated on floor, stand without using hands, knees, or external support.',
    setup: ['Sit cross-legged on the floor', 'Try to stand without using hands or knees', 'Rate how clean the rise was'],
    scoreFn: v => Math.max(1, Math.min(5, Math.round(v))),
    qualitativeOptions: [
      { v: 1, label: 'Required full assistance (hands + knee)' },
      { v: 2, label: 'One hand or knee touch' },
      { v: 3, label: 'Brief hand-touch or wobble' },
      { v: 4, label: 'No assistance, slight wobble' },
      { v: 5, label: 'Clean and controlled, no support' },
    ],
    areas: ['balance'],
  },
];

export function getKpi(id) { return KPIS.find(k => k.id === id); }
export function bandLabel(score) { return BAND_LABELS[score] || ''; }

// Compute a 1..5 score for a KPI given a raw value
export function scoreFor(kpiId, value) {
  const k = getKpi(kpiId);
  if (!k) return null;
  return k.scoreFn(value);
}

// For sided KPIs with both L+R recordings, the displayed score is the average
export function compositeScore(kpiId, measurements) {
  const k = getKpi(kpiId);
  if (!k) return null;
  const recent = recentForKpi(kpiId, measurements);
  if (!recent.length) return null;
  if (!k.sided) return recent[0].score;
  const left = recent.find(m => m.side === 'left');
  const right = recent.find(m => m.side === 'right');
  if (left && right) return Math.round((left.score + right.score) / 2);
  return (left || right || recent[0]).score;
}

// Returns most recent measurement per side (or just the most recent if unsided)
export function recentForKpi(kpiId, measurements) {
  const all = measurements.filter(m => m.kpiId === kpiId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  if (!all.length) return [];
  const k = getKpi(kpiId);
  if (!k || !k.sided) return [all[0]];
  const out = [];
  const seen = new Set();
  for (const m of all) {
    const key = m.side || '_';
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(m);
    if (seen.size >= 2) break;
  }
  return out;
}

export function historyForKpi(kpiId, measurements, days = 90) {
  const cutoff = Date.now() - days * 86400000;
  return measurements
    .filter(m => m.kpiId === kpiId && new Date(m.timestamp).getTime() >= cutoff)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function deltaSinceBaseline(kpiId, measurements) {
  const sorted = measurements.filter(m => m.kpiId === kpiId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  if (sorted.length < 2) return 0;
  const first = sorted[0].score;
  const latest = sorted[sorted.length - 1].score;
  return latest - first;
}
