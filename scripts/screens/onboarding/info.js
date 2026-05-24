import { statusBarHtml } from '../../components/shell.js';
import { setState } from '../../store.js';

export function renderInfo(state) {
  const p = state.profile;
  const html = `
    ${statusBarHtml('9:39')}
    <div class="screen">
      <div class="screen-body scroll">
        <div class="onb-screen">
          <div class="onb-progress">
            <div class="seg done"></div>
            <div class="seg active"></div>
            <div class="seg"></div>
            <div class="seg"></div>
            <div class="seg"></div>
            <div class="seg"></div>
          </div>
          <div class="step-lbl">Step 2 of 6</div>
          <h2>Tell us about you.</h2>
          <div class="lead">Helps us score you fairly. Nothing is shared.</div>

          <div class="field">
            <label>Name (optional)</label>
            <input type="text" id="f-name" value="${escape(p.displayName || '')}" placeholder="Your name">
          </div>
          <div class="field">
            <label>Age</label>
            <input type="number" id="f-age" value="${p.age || ''}" min="10" max="120" placeholder="36">
          </div>
          <div class="field">
            <label>Sex</label>
            <div class="seg-control" id="f-sex">
              <button data-v="male" class="${p.sex === 'male' ? 'active' : ''}">Male</button>
              <button data-v="female" class="${p.sex === 'female' ? 'active' : ''}">Female</button>
              <button data-v="other" class="${p.sex === 'other' ? 'active' : ''}">Prefer not to say</button>
            </div>
          </div>
          <div class="field">
            <label>Height (cm)</label>
            <input type="number" id="f-height" value="${p.heightCm || ''}" placeholder="178">
          </div>
          <div class="field">
            <label>Weight (kg)</label>
            <input type="number" id="f-weight" value="${p.weightKg || ''}" placeholder="76">
          </div>
          <div class="field">
            <label>Activity level</label>
            <div class="seg-control" id="f-activity" style="flex-wrap:wrap;">
              <button data-v="sedentary" class="${p.activityLevel === 'sedentary' ? 'active' : ''}">Sedentary</button>
              <button data-v="light" class="${p.activityLevel === 'light' ? 'active' : ''}">Light</button>
              <button data-v="moderate" class="${p.activityLevel === 'moderate' ? 'active' : ''}">Moderate</button>
              <button data-v="active" class="${p.activityLevel === 'active' ? 'active' : ''}">Active</button>
            </div>
          </div>
          <a class="btn-primary" id="f-continue" href="#" style="text-decoration:none;display:block;text-align:center;">Continue</a>
          <div style="height:24px;"></div>
        </div>
      </div>
    </div>
  `;
  return {
    html,
    onMount(root) {
      let sex = state.profile.sex;
      let activity = state.profile.activityLevel || 'moderate';
      root.querySelectorAll('#f-sex button').forEach(b => b.addEventListener('click', () => {
        sex = b.dataset.v;
        root.querySelectorAll('#f-sex button').forEach(x => x.classList.toggle('active', x === b));
      }));
      root.querySelectorAll('#f-activity button').forEach(b => b.addEventListener('click', () => {
        activity = b.dataset.v;
        root.querySelectorAll('#f-activity button').forEach(x => x.classList.toggle('active', x === b));
      }));
      root.querySelector('#f-continue').addEventListener('click', e => {
        e.preventDefault();
        const name = root.querySelector('#f-name').value.trim();
        const age = Number(root.querySelector('#f-age').value) || null;
        const heightCm = Number(root.querySelector('#f-height').value) || null;
        const weightKg = Number(root.querySelector('#f-weight').value) || null;
        setState(s => ({
          ...s,
          profile: { ...s.profile, displayName: name, age, sex, heightCm, weightKg, activityLevel: activity },
        }));
        location.hash = '#/onboarding/areas';
      });
    },
  };
}

function escape(s) { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
