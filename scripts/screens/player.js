import { statusBarHtml } from '../components/shell.js';
import { Icon } from '../components/icons.js';
import { illustrationFor } from '../components/exercise-illustrations.js';
import { pickTodayRoutine, listRoutineOptions } from '../engine/routine.js';
import { getFlexRoutine } from '../engine/flex.js';
import { recordSession } from '../store.js';

export function renderPlayer(state, routineId) {
  // Resolve routine: a Core Flex build, today's pick, or an alternate by id
  let routine = getFlexRoutine(routineId);
  if (!routine) {
    const today = pickTodayRoutine(state);
    routine = today.id === routineId ? today : listRoutineOptions(state).find(r => r.id === routineId);
    if (!routine) routine = today;
  }

  let idx = 0;
  let secondsLeft = routine.exercises[0].durationSec;
  let paused = true;
  let tickHandle = null;
  let wakeLock = null;

  const html = `
    ${statusBarHtml('9:42')}
    <div class="screen player">
      <div class="top-row">
        <button class="close-btn bare" data-action="close" aria-label="Close">${Icon.close()}</button>
        <div class="counter"><span id="ct-i">1</span> of ${routine.exercises.length}</div>
        <div class="free-pill">FREE</div>
      </div>
      <div class="circle-wrap">
        <div class="circle">
          <div class="circle-bg" id="circle-bg" style="background: radial-gradient(circle at 30% 30%, color-mix(in srgb, ${routine.pastel} 90%, #fff) 0%, ${routine.pastel} 100%);"></div>
          <svg class="arc" viewBox="0 0 254 254">
            <circle cx="127" cy="127" r="125" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3"/>
            <circle id="arc-fg" cx="127" cy="127" r="125" fill="none" stroke="var(--accent)" stroke-width="3" stroke-dasharray="785" stroke-dashoffset="785" transform="rotate(-90 127 127)" stroke-linecap="round" style="transition: stroke-dashoffset 800ms linear;"/>
          </svg>
          <div class="ill-inside" id="ill-inside">${illustrationFor(routine.exercises[0].id, 200)}</div>
        </div>
      </div>
      <div class="bottom">
        <button class="swap-btn bare" data-action="skip" aria-label="Skip" title="Skip exercise">${Icon.swap()}</button>
        <div class="ex-name">
          <span id="ex-name">${routine.exercises[0].name}</span>
          <button class="info-circle bare" data-action="info" aria-label="Info">i</button>
        </div>
        <div class="ex-oneliner" id="ex-oneliner">${escapeOneLiner(routine.exercises[0].oneLiner || '')}</div>
        <div class="timer" id="timer">${fmtTime(secondsLeft)}</div>
        <div class="controls">
          <button class="ctrl bare" data-action="prev" aria-label="Previous">${Icon.prev()}</button>
          <button class="ctrl pause bare" data-action="toggle" aria-label="Play/Pause">${Icon.play()}</button>
          <button class="ctrl bare" data-action="next" aria-label="Next">${Icon.next()}</button>
        </div>
      </div>
    </div>
  `;

  return {
    html,
    onMount(root) {
      const $ = sel => root.querySelector(sel);
      const totalLen = routine.exercises.length;

      function setUiFor(i) {
        const ex = routine.exercises[i];
        secondsLeft = ex.durationSec;
        $('#ex-name').textContent = ex.name + (ex.sideSpecific ? ` · L+R` : '');
        $('#ex-oneliner').textContent = ex.oneLiner || '';
        $('#ct-i').textContent = i + 1;
        $('#timer').textContent = fmtTime(secondsLeft);
        const ill = $('#ill-inside');
        ill.innerHTML = illustrationFor(ex.id, 200);
        ill.classList.remove('ill-fade');
        // Force reflow then re-add to restart animation
        void ill.offsetWidth;
        ill.classList.add('ill-fade');
        updateArc(i, totalLen);
      }
      function updateArc(i, total) {
        const fraction = (i + 1) / total;
        const dashoffset = 785 - 785 * fraction;
        $('#arc-fg').setAttribute('stroke-dashoffset', dashoffset);
      }
      function play() {
        paused = false;
        $('[data-action="toggle"]').innerHTML = Icon.pause();
        clearInterval(tickHandle);
        tickHandle = setInterval(() => {
          secondsLeft -= 1;
          if (secondsLeft < 0) {
            advance(1);
            return;
          }
          $('#timer').textContent = fmtTime(secondsLeft);
        }, 1000);
        requestWakeLock();
      }
      function pause() {
        paused = true;
        $('[data-action="toggle"]').innerHTML = Icon.play();
        clearInterval(tickHandle);
        tickHandle = null;
        releaseWakeLock();
      }
      function advance(delta) {
        const next = idx + delta;
        if (next >= totalLen) {
          finish();
          return;
        }
        if (next < 0) return;
        idx = next;
        setUiFor(idx);
        playDing();
        if (!paused) {
          // restart interval to align ticks
          clearInterval(tickHandle);
          tickHandle = setInterval(() => {
            secondsLeft -= 1;
            if (secondsLeft < 0) { advance(1); return; }
            $('#timer').textContent = fmtTime(secondsLeft);
          }, 1000);
        }
      }
      function finish() {
        clearInterval(tickHandle);
        releaseWakeLock();
        recordSession({
          routineId: routine.id,
          durationSec: routine.durationSec,
          exerciseIds: routine.exercises.map(e => e.id),
          kpisTargeted: routine.kpisTargeted,
        });
        location.hash = `#/complete/${routine.id}`;
      }

      root.querySelector('[data-action="close"]').addEventListener('click', () => {
        clearInterval(tickHandle);
        releaseWakeLock();
        history.length > 1 ? history.back() : (location.hash = '#/home');
      });
      root.querySelector('[data-action="toggle"]').addEventListener('click', () => {
        if (paused) play(); else pause();
      });
      root.querySelector('[data-action="prev"]').addEventListener('click', () => advance(-1));
      root.querySelector('[data-action="next"]').addEventListener('click', () => advance(1));
      root.querySelector('[data-action="skip"]').addEventListener('click', () => advance(1));
      root.querySelector('[data-action="info"]').addEventListener('click', () => showInfoSheet(root, routine.exercises[idx]));

      // Auto-start after a beat
      setUiFor(0);
      setTimeout(play, 350);

      async function requestWakeLock() {
        if (!('wakeLock' in navigator)) return;
        try { wakeLock = await navigator.wakeLock.request('screen'); } catch {}
      }
      function releaseWakeLock() {
        if (wakeLock) { try { wakeLock.release(); } catch {} wakeLock = null; }
      }
      function playDing() {
        if (!state.preferences.transitionSounds) return;
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.frequency.value = 660;
          g.gain.value = 0.05;
          o.connect(g).connect(ctx.destination);
          o.start();
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
          o.stop(ctx.currentTime + 0.2);
          setTimeout(() => ctx.close(), 250);
        } catch {}
      }

      return () => { clearInterval(tickHandle); releaseWakeLock(); };
    },
  };
}

function showInfoSheet(root, exercise) {
  const sheet = document.createElement('div');
  sheet.className = 'sheet-backdrop';
  sheet.innerHTML = `
    <div class="sheet" onclick="event.stopPropagation()">
      <div class="handle"></div>
      <h3>${exercise.name}</h3>
      ${exercise.oneLiner ? `<p style="color:var(--text);font-family:var(--serif);font-style:italic;font-size:14px;margin-bottom:14px;">${exercise.oneLiner}</p>` : ''}
      <p>How to do it:</p>
      <ul style="color:var(--text);font-size:13px;line-height:1.6;padding-left:18px;margin-bottom:16px;">
        ${exercise.cues.map(c => `<li>${c}</li>`).join('')}
      </ul>
      ${exercise.primaryKpis.length ? `<p style="margin-bottom:10px;"><strong style="color:var(--accent);font-size:11px;text-transform:uppercase;letter-spacing:0.08em;">Targets</strong> <span style="color:var(--text-muted);font-size:12px;">${exercise.primaryKpis.join(', ')}</span></p>` : ''}
      <button class="btn-primary" data-dismiss>Got it</button>
    </div>
  `;
  root.appendChild(sheet);
  sheet.addEventListener('click', () => sheet.remove());
  sheet.querySelector('[data-dismiss]').addEventListener('click', () => sheet.remove());
}

function escapeOneLiner(s) {
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function fmtTime(s) {
  s = Math.max(0, s);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}
