// Maps exercise IDs to PNG icon filenames in /icons/exercises/.
// PNGs were extracted from NANO1 source grids by the crop_and_name.py script
// and named by OCR of the in-image captions. This map is the authoritative
// link between an exercise's data-layer id and its illustration file.
//
// If an exercise id is not in this map, illustrationFor() falls back to the
// inline SVG cartoon in exercise-illustrations.js.

export const EXERCISE_PNG = {
  // ---------- Direct matches (filename === exercise id) ----------
  bird_dog: 'bird_dog.png',
  cobra: 'cobra.png',
  cossack_squat: 'cossack_squat.png',
  couch_stretch: 'couch_stretch.png',
  cross_body_shoulder: 'cross_body_shoulder.png',
  dead_bug: 'dead_bug.png',
  forearm_plank: 'forearm_plank.png',
  glute_bridge: 'glute_bridge.png',
  hollow_body_hold: 'hollow_body_hold.png',
  kneeling_hip_flexor: 'kneeling_hip_flexor.png',
  lateral_lunge: 'lateral_lunge.png',
  lizard_pose: 'lizard_pose.png',
  neck_extension: 'neck_extension.png',
  neck_flexion: 'neck_flexion.png',
  neck_rotation: 'neck_rotation.png',
  reverse_plank: 'reverse_plank.png',
  seated_forward_fold: 'seated_forward_fold.png',
  single_leg_deadlift: 'single_leg_deadlift.png',
  single_leg_glute_bridge: 'single_leg_glute_bridge.png',
  sleeper_stretch: 'sleeper_stretch.png',
  sphinx: 'sphinx.png',
  standing_forward_fold: 'standing_forward_fold.png',
  supine_spinal_twist: 'supine_spinal_twist.png',
  tree_pose: 'tree_pose.png',
  wall_slides: 'wall_slides.png',
  worlds_greatest_stretch: 'worlds_greatest_stretch.png',

  // ---------- Aliased matches ----------
  // Neck
  ear_to_shoulder: 'neck_lateral_flexion.png',
  upper_trap_stretch: 'neck_lateral_flexion.png',

  // Shoulders
  cow_face_arms: 'apley_behind_back.png',
  doorway_pec: 'doorway_pec_stretch.png',
  doorway_pec_high: 'doorway_pec_stretch.png',
  doorway_pec_low: 'doorway_pec_stretch.png',
  thread_needle: 'thread_the_needle.png',

  // Upper back
  cat_cow: 'cat_pose.png',
  quadruped_tspine_rotation: 'reach_through.png',
  wall_angels: 'wall_slides.png',
  bear_hug: 'art_bear_hug.png',
  thoracic_extension_chair: 'foam_roll_t_spine.png',
  open_book: 'art_open_book.png',

  // Chest
  reclined_butterfly: 'art_reclined_butterfly.png',

  // Lower back
  childs_pose: 'art_childs_pose.png',
  child_pose_extended: 'art_childs_pose.png',
  knee_to_chest: 'single_knee_to_chest.png',
  mckenzie_press_ups: 'cobra.png',
  superman_hold: 'superman.png',

  // Hips
  pigeon_pose: 'half_pigeon.png',
  half_pigeon_supine: 'supine_figure_4.png',
  butterfly_stretch: 'butterfly.png',
  ninety_ninety: 'seated_90_90.png',
  reclined_figure4: 'supine_figure_4.png',
  deep_squat_hold: 'deep_squat.png',

  // Glutes
  donkey_kicks: 'art_donkey_kicks.png',

  // Hamstrings
  wide_leg_forward_fold: 'wide_legged_straddle_fold.png',
  supine_hamstring_strap: 'supine_hamstring_stretch.png',
  single_leg_forward_fold: 'seated_forward_fold.png',
  standing_hamstring_chair: 'art_standing_hamstring_chair.png',
  toe_to_wall: 'knee_to_wall_test.png',

  // Quads
  standing_quad: 'standing_quad_stretch.png',
  kneeling_quad: 'couch_stretch.png',

  // Ankles & calves
  standing_calf: 'wall_calf_stretch.png',
  bent_knee_calf: 'wall_calf_stretch.png',
  heel_drops: 'art_heel_drops.png',

  // Core anterior
  knee_plank: 'art_knee_plank.png',
  hollow_body_rocks: 'hollow_body_hold.png',
  toe_taps: 'mcgill_curl_up_2.png',
  leg_lowers: 'art_leg_lowers.png',

  // Core lateral
  side_plank: 'side_plank_left_side.png',
  side_plank_knees: 'side_plank_left_side.png',
  side_bend: 'standing_side_bend.png',
  standing_oblique_reach: 'standing_side_bend.png',

  // Core posterior
  quadruped_opp_raise: 'bird_dog.png',
  prone_ytw: 'superman.png',

  // Full body
  bodyweight_squat: 'deep_squat.png',
  goblet_squat_hold: 'goblet_squat.png',
  forward_lunge: 'low_lunge.png',
  reverse_lunge: 'crescent_lunge.png',
  down_dog_flow: 'inchworm.png',

  // Balance
  single_leg_balance: 'single_leg_stance_eyes_open.png',
  eyes_closed_romberg: 'art_eyes_closed_romberg.png',
  heel_toe_walk: 'tandem_stance.png',
  sit_to_stand_practice: 'sit_to_stand_transitioning.png',

  // Pilates (closest match)
  pilates_hundred: 'art_pilates_hundred.png',
  pilates_roll_up: 'art_pilates_roll_up.png',
  pilates_double_leg_stretch: 'hollow_body_hold_2.png',
  pilates_single_leg_stretch: 'single_knee_to_chest.png',
  pilates_criss_cross: 'art_pilates_criss_cross.png',
  pilates_teaser: 'v_sit_hold.png',
  pilates_roll_over: 'reverse_crunch.png',
  pilates_saw: 'art_pilates_saw.png',
  pilates_spine_stretch: 'seated_forward_fold.png',
  pilates_swimming: 'superman.png',
  pilates_side_kick: 'side_lying_hip_abduction.png',
  pilates_mermaid: 'cross_legged_side_reach.png',
  pilates_open_leg_rocker: 'art_pilates_open_leg_rocker.png',
  pilates_leg_circles: 'supine_straight_leg_raise.png',
  pilates_bridge: 'supine_pelvic_tilt.png',

  // ---------- Fill-ins from the 2nd NANO1 batch (Neck/Shoulder + Mat + 2x1) ----
  chin_tucks: 'chin_tucks.png',
  levator_scapulae_stretch: 'levator_scapulae.png',
  scalene_stretch: 'scalene_stretch.png',
  shoulder_rolls: 'shoulder_rolls.png',
  eagle_arms: 'eagle_arms.png',
  reverse_prayer: 'reverse_prayer.png',
  pendulum_swings: 'pendulum_swings.png',
  corner_stretch: 'corner_pec_stretch.png',
  ankle_circles: 'ankle_circles.png',
  floor_y_hold: 'floor_y_hold.png',
  frog_stretch: 'frog_stretch.png',
  clamshells: 'clamshells.png',
  fire_hydrants: 'fire_hydrants.png',
  side_lying_hip_abduction: 'side_lying_hip_abduction.png',
  side_lying_quad: 'side_lying_quad_stretch.png',
  hero_pose: 'hero_pose.png',
  down_dog: 'downward_dog.png',
  down_dog_pedal: 'pedaling_the_heels.png',
  v_sit_hold: 'v_sit_hold.png',
  // Bookend moves
  knees_to_chest_rock: 'double_knee_to_chest.png',
  supine_hamstring_towel: 'art_supine_hamstring_towel.png',
  supine_9090_hamstring: 'art_supine_9090_hamstring.png',
  figure4_wall: 'supine_figure_4.png',
  childs_pose_supported: 'art_childs_pose_supported.png',
  standing_hip_flexor: 'high_lunge.png',
  pallof_press: 'pallof_press.png',
  // Drawn with tools/draw_poses.py (no matching NANO1 art)
  sciatic_nerve_slider: 'art_sciatic_nerve_slider.png',
  sciatic_slider_gentle: 'art_sciatic_slider_gentle.png',
  standing_back_extension: 'art_standing_back_extension.png',
  leg_swings: 'art_leg_swings.png',
  sun_salute: 'art_sun_salute.png',
};

// Returns the PNG filename for an exercise id, or null if no mapping exists.
export function pngForExercise(id) {
  return EXERCISE_PNG[id] || null;
}

// HTML <img> snippet sized to `size` pixels.
// Object-position keeps the figure centered. Captions baked into the PNG are
// visible but small at the icon scales we use.
export function imgHtmlForExercise(id, size = 200) {
  const fname = EXERCISE_PNG[id];
  if (!fname) return null;
  return `<img src="icons/exercises/${fname}" alt="" width="${size}" height="${size}" class="ex-png" loading="lazy" decoding="async" draggable="false">`;
}

// Map KPI test ids to the best PNG illustration for that measurement test.
// Many tests have an exact-named PNG in the NANO1 set (e.g. apley_behind_back,
// knee_to_wall_test, sorensen_hold, mcgill_curl_up).
export const KPI_TEST_PNG = {
  f1_forward_fold: 'seated_forward_fold.png',
  f2_slr: 'supine_straight_leg_raise.png',
  f3_hip_flexor: 'thomas_position.png',
  f4_knee_to_wall: 'knee_to_wall_test.png',
  f5_apley: 'apley_behind_back.png',
  f6_overhead: 'overhead_reach_supine.png',
  f7_tspine: 'standing_trunk_rotation.png',
  f8_cervical_rom: 'neck_lateral_flexion.png',
  f9_butterfly: 'butterfly.png',
  f10_deep_squat: 'deep_squat.png',
  f11_aslr: 'supine_straight_leg_raise.png',
  c1_front_plank: 'forearm_plank.png',
  c2_side_plank: 'side_plank_left_side.png',
  c3_flexor: 'mcgill_curl_up.png',
  c4_extensor: 'sorensen_hold.png',
  b2_one_leg_eyes_closed: 'single_leg_stance_eyes_closed.png',
  b3_sit_to_stand: 'sit_to_stand_transitioning.png',
};

export function imgHtmlForKpiTest(kpiId, size = 150) {
  const fname = KPI_TEST_PNG[kpiId];
  if (!fname) return null;
  return `<img src="icons/exercises/${fname}" alt="" width="${size}" height="${size}" class="ex-png ex-png-test" loading="lazy" decoding="async" draggable="false">`;
}

// One signature PNG per area — used for the Home hero card.
export const AREA_HERO_PNG = {
  neck: 'neck_lateral_flexion.png',
  shoulders: 'cross_body_shoulder.png',
  upper_back: 'cat_pose.png',
  chest: 'corner_pec_stretch.png',
  lower_back: 'art_childs_pose.png',
  hips: 'pigeon_forward_fold.png',
  glutes: 'glute_bridge.png',
  hamstrings: 'seated_forward_fold.png',
  quads: 'standing_quad_stretch.png',
  ankles_calves: 'wall_calf_stretch.png',
  core_anterior: 'forearm_plank.png',
  core_lateral: 'side_plank_left_side.png',
  core_posterior: 'superman.png',
  full_body: 'deep_squat.png',
  balance: 'tree_pose.png',
};

export function imgHtmlForAreaHero(areaId, size = 150) {
  // Some areas don't have a doorway_pec.png (childs_pose was aliased). Resolve
  // via the broader EXERCISE_PNG map if the direct one is missing.
  const fname = AREA_HERO_PNG[areaId];
  if (!fname) return null;
  return `<img src="icons/exercises/${fname}" alt="" width="${size}" height="${size}" class="ex-png ex-hero" loading="lazy" decoding="async" draggable="false">`;
}
