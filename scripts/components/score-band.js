// 5-segment score band: fills `score` segments in teal, rest in surface-3
export function scoreBandHtml(score) {
  let html = '<div class="score-band">';
  for (let i = 1; i <= 5; i++) {
    html += `<div class="seg ${i <= score ? 'filled' : ''}"></div>`;
  }
  html += '</div>';
  return html;
}
