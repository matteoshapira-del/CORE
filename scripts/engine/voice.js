import { VOICE } from '../data/voice-manifest.js';

// Audio guide. Pre-rendered clips (tools/voice/generate.py) are scheduled
// against the player's exercise clock:
//   t=0      side announcement (if any) + setup → in position within ~10 s
//   t≥10     coaching tips, spread through the hold, only as many as fit
//   end−4 s  "gently release" (holds ≥ 25 s)
// The player drives it with the elapsed-second count, so pause/resume and
// skipping stay in sync without any timers of our own.

const BASE = 'audio/voice/';
const GAP = 2.5;            // min silence between tips (s)
const FIRST_TIP_AT = 10;    // tips never start before this
const TAIL = 5;             // keep the last seconds for the release cue

let audio = null;
let unlocked = false;
let queue = [];
let playing = false;
let events = [];            // [{ t, clips: [name], fired }]
let suspended = false;

function el() {
  if (!audio) {
    audio = new Audio();
    audio.preload = 'auto';
    audio.addEventListener('ended', next);
    audio.addEventListener('error', next);
  }
  return audio;
}

// iOS only lets an <audio> element play after it has been started inside a
// user gesture. Prime the shared element on the first tap anywhere.
export function installUnlock() {
  const prime = () => {
    if (unlocked) return;
    const a = el();
    a.src = BASE + '_silence.mp3';
    a.play().then(() => { unlocked = true; }).catch(() => {});
  };
  document.addEventListener('touchend', prime, { capture: true });
  document.addEventListener('click', prime, { capture: true });
}

function next() {
  playing = false;
  if (suspended) return;
  const name = queue.shift();
  if (!name) return;
  const a = el();
  a.src = BASE + name + '.mp3';
  playing = true;
  a.play().catch(() => { playing = false; });
}

function enqueue(names) {
  queue.push(...names);
  if (!playing && !suspended) next();
}

export function stop() {
  queue = [];
  events = [];
  playing = false;
  if (audio) audio.pause();
}

export function pause() {
  suspended = true;
  if (audio && playing) audio.pause();
}

export function resume() {
  suspended = false;
  if (audio && playing && audio.src) audio.play().catch(() => {});
  else next();
}

export function hasScript(exId) { return !!(VOICE.ex && VOICE.ex[exId]); }

// Build the timeline for one step. `tipOffset` rotates tips on the second
// side so L and R don't repeat the same insights.
export function startStep(step, { tipOffset = 0, prefix = [] } = {}) {
  stop();
  const v = VOICE.ex && VOICE.ex[step.id];
  if (!v) return;
  const g = VOICE.generic || {};
  const dur = step.durationSec;
  const intro = [...prefix];
  let introLen = prefix.reduce((s, n) => s + ((VOICE.generic || {})[n] || 2), 0);
  if (step.side === 'left') { intro.push('_side_left'); introLen += g._side_left || 1.5; }
  if (step.side === 'right') { intro.push('_side_right'); introLen += g._side_right || 1.8; }
  // Second side: you're already set up — announce the side and go to tips.
  const fullSetup = step.side !== 'right' || dur >= 40;
  if (fullSetup) { intro.push(step.id + '.s'); introLen += v.s; }
  events.push({ t: 0, clips: intro, fired: false });

  const hasRelease = dur >= 25 && g._release;
  const windowEnd = dur - (hasRelease ? TAIL + g._release : 2);
  let t = Math.max(FIRST_TIP_AT, introLen + GAP);
  const order = v.t.map((d, i) => i).map(i => (i + tipOffset) % v.t.length);
  const chosen = [];
  for (const i of order) {
    if (t + v.t[i] > windowEnd) break;
    chosen.push(i);
    t += v.t[i] + GAP;
  }
  // Spread the chosen tips evenly across the hold instead of bunching them.
  if (chosen.length) {
    const start = Math.max(FIRST_TIP_AT, introLen + GAP);
    const speech = chosen.reduce((s, i) => s + v.t[i], 0);
    const slack = Math.max(0, windowEnd - start - speech);
    const gap = slack / chosen.length;
    let at = start + gap / 2;
    for (const i of chosen) {
      events.push({ t: Math.round(at), clips: [`${step.id}.t${i + 1}`], fired: false });
      at += v.t[i] + gap;
    }
  }
  if (hasRelease) events.push({ t: Math.max(0, Math.round(dur - TAIL)), clips: ['_release'], fired: false });
}

// Turning the guide on mid-step: don't replay what's already past.
export function skipTo(elapsed) {
  for (const e of events) if (e.t < elapsed) e.fired = true;
}

// Called with whole elapsed seconds of the current step.
export function tick(elapsed) {
  for (const e of events) {
    if (!e.fired && elapsed >= e.t) {
      e.fired = true;
      if (e.clips.length) enqueue(e.clips);
    }
  }
}

export function say(name) {
  stop();
  enqueue([name]);
}

// Current step's timeline (for debugging / tests).
export function timeline() { return events.map(e => ({ t: e.t, clips: [...e.clips] })); }
