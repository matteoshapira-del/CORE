// Numeric field that can take negative values on any phone keyboard.
// Mobile decimal keypads (iOS and Android/Gboard) have no minus key, so a
// ± button flips the sign. Uses type="text" + inputmode="decimal" because
// type="number" can't hold an in-progress "-" and rejects locale commas.

export function signedInputHtml({ id, placeholder = '0', allowNegative = true, cls = '' }) {
  return `<div class="signed-input ${cls}">
    ${allowNegative ? `<button type="button" class="sign-btn bare" data-sign-for="${id}" aria-label="Make negative or positive">±</button>` : ''}
    <input type="text" inputmode="decimal" autocomplete="off" enterkeyhint="done" id="${id}" placeholder="${placeholder}">
  </div>`;
}

// "-4", "−4", "4,5" → number; '' or junk → null
export function parseSigned(str) {
  const s = String(str || '').trim().replace(/−/g, '-').replace(',', '.');
  if (!/^-?\d*\.?\d+$|^-?\d+\.?$/.test(s)) return null;
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : null;
}

// Wire sanitising + the ± button. onChange(valueOrNull) fires on every edit.
export function attachSignedInput(root, id, onChange = () => {}) {
  const inp = root.querySelector('#' + id);
  if (!inp) return;
  const clean = () => {
    let s = inp.value.replace(/−/g, '-').replace(/[^0-9.,-]/g, '');
    const neg = s.startsWith('-');
    s = s.replace(/-/g, '');
    const sep = s.search(/[.,]/);
    if (sep >= 0) s = s.slice(0, sep + 1) + s.slice(sep + 1).replace(/[.,]/g, '');
    inp.value = (neg ? '-' : '') + s;
    onChange(parseSigned(inp.value));
  };
  inp.addEventListener('input', clean);
  root.querySelector(`[data-sign-for="${id}"]`)?.addEventListener('click', () => {
    inp.value = inp.value.startsWith('-') ? inp.value.slice(1) : '-' + inp.value;
    onChange(parseSigned(inp.value));
    inp.focus();
  });
}
