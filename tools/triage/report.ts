import type { Classification, Verdict } from './classify.ts';

export type Entry = {
  /** Snapshot path relative to the repo root. */
  path: string;
  component: string;
  name: string;
  browser: string;
  classification: Classification;
  /** Paths relative to the report file. */
  expectedSrc: string;
  actualSrc: string;
  diffSrc: string | null;
};

const ORDER: Verdict[] = ['regression', 'review', 'safe'];

const LABEL: Record<Verdict, string> = {
  regression: 'Regression',
  review: 'Review',
  safe: 'Safe',
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function card(entry: Entry) {
  const { classification: c } = entry;
  const biggest = c.components[0];
  const meta = biggest
    ? `${c.diffPixels}px changed · ${c.offEdgePixels}px unexplained · largest patch ${biggest.offEdgeArea}px${biggest.survivesErosion ? ' (solid)' : ''}`
    : c.reason;

  return `<article class="card" data-verdict="${c.verdict}">
  <header>
    <button class="toggle" aria-expanded="false">${escapeHtml(entry.component)} / ${escapeHtml(entry.name)}</button>
    <span class="browser">${escapeHtml(entry.browser)}</span>
  </header>
  <p class="meta">${escapeHtml(meta)}</p>
  <p class="reason">${escapeHtml(c.reason)}</p>
  <div class="detail" hidden>
    <div class="modes">
      <button data-mode="diff" class="active">diff</button>
      <button data-mode="slider">slider</button>
      <button data-mode="onion">onion</button>
      <button data-mode="side">side-by-side</button>
      <button data-mode="blink">blink</button>
    </div>
    <div class="stage" data-mode="diff"
         data-expected="${escapeHtml(entry.expectedSrc)}"
         data-actual="${escapeHtml(entry.actualSrc)}"
         data-diff="${escapeHtml(entry.diffSrc ?? '')}"></div>
    <p class="path"><code>${escapeHtml(entry.path)}</code></p>
  </div>
</article>`;
}

function section(verdict: Verdict, entries: Entry[]) {
  if (entries.length === 0) return '';
  const open = verdict === 'safe' ? '' : ' open';
  return `<details class="section" data-verdict="${verdict}"${open}>
  <summary><span class="pill ${verdict}">${LABEL[verdict]}</span> ${entries.length}</summary>
  <div class="grid">${entries.map(card).join('\n')}</div>
</details>`;
}

export function renderReport(entries: Entry[], meta: { base: string; generated: string }) {
  const counts = Object.fromEntries(
    ORDER.map(v => [v, entries.filter(e => e.classification.verdict === v).length])
  ) as Record<Verdict, number>;

  const flagged = entries
    .filter(e => e.classification.verdict !== 'safe')
    .map(e => e.path)
    .join(' \\\n  ');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Snapshot triage</title>
<style>
  :root {
    color-scheme: light dark;
    --bg: #ffffff; --fg: #16181d; --muted: #5c636e; --line: #d8dce3; --panel: #f5f6f8;
    --safe: #1f7a3f; --review: #9a6700; --regression: #b3261e;
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #16181d; --fg: #e9ecf1; --muted: #9aa2ad; --line: #2c313a; --panel: #1e222a; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 24px; background: var(--bg); color: var(--fg);
         font: 14px/1.5 ui-sans-serif, system-ui, sans-serif; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .sub { color: var(--muted); margin: 0 0 20px; }
  .counts { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .pill { border-radius: 999px; padding: 3px 11px; color: #fff; font-weight: 600; font-size: 12px; }
  .pill.safe { background: var(--safe); } .pill.review { background: var(--review); }
  .pill.regression { background: var(--regression); }
  .section { border: 1px solid var(--line); border-radius: 10px; margin-bottom: 14px; background: var(--panel); }
  .section > summary { cursor: pointer; padding: 12px 14px; font-weight: 600; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px; padding: 0 14px 14px; }
  .section:has(.card[data-verdict="safe"]) .grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
  .card { border: 1px solid var(--line); border-radius: 8px; padding: 10px; background: var(--bg); }
  .card[data-verdict="regression"] { border-color: var(--regression); }
  .card[data-verdict="review"] { border-color: var(--review); }
  .card header { display: flex; gap: 8px; align-items: baseline; }
  .toggle { all: unset; cursor: pointer; font-weight: 600; text-align: left; flex: 1; }
  .toggle:hover { text-decoration: underline; }
  .browser { color: var(--muted); font-size: 12px; }
  .meta, .reason { color: var(--muted); font-size: 12px; margin: 6px 0 0; }
  .detail { margin-top: 10px; }
  .detail[hidden] { display: none; }
  .modes { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
  .modes button { font: inherit; font-size: 12px; padding: 3px 9px; cursor: pointer;
                  border: 1px solid var(--line); border-radius: 6px;
                  background: var(--bg); color: var(--fg); }
  .modes button.active { background: var(--fg); color: var(--bg); }
  .stage { position: relative; overflow: auto; border: 1px solid var(--line);
           border-radius: 6px; background: #fff; }
  .stage img { display: block; max-width: 100%; }
  .stage .stack { position: relative; }
  .stage .stack img + img { position: absolute; inset: 0; }
  .stage .side { display: flex; gap: 6px; }
  .stage .side img { width: 50%; }
  .stage input[type=range] { width: 100%; }
  .path { font-size: 11px; color: var(--muted); margin: 8px 0 0; word-break: break-all; }
  .cmd { background: var(--panel); border: 1px solid var(--line); border-radius: 8px;
         padding: 12px; font-size: 12px; white-space: pre-wrap; word-break: break-all; margin-top: 20px; }
</style>
</head>
<body>
<h1>Snapshot triage</h1>
<p class="sub">${entries.length} changed against <code>${escapeHtml(meta.base)}</code> · ${escapeHtml(meta.generated)}</p>

<div class="counts">
  <span class="pill regression">regression ${counts.regression}</span>
  <span class="pill review">review ${counts.review}</span>
  <span class="pill safe">safe ${counts.safe}</span>
</div>

${ORDER.map(v =>
  section(
    v,
    entries.filter(e => e.classification.verdict === v)
  )
).join('\n')}

${
  flagged
    ? `<p class="sub" style="margin-top:20px">Revert everything still flagged:</p>
<div class="cmd">git checkout -- \\\n  ${escapeHtml(flagged)}</div>`
    : ''
}

<script>
function render(stage) {
  const mode = stage.dataset.mode;
  const exp = stage.dataset.expected;
  const act = stage.dataset.actual;
  const diff = stage.dataset.diff;
  if (mode === 'diff' && diff) {
    stage.innerHTML = '<img src="' + diff + '" alt="diff">';
  } else if (mode === 'side') {
    stage.innerHTML = '<div class="side"><img src="' + exp + '"><img src="' + act + '"></div>';
  } else if (mode === 'onion') {
    stage.innerHTML =
      '<div class="stack"><img src="' + exp + '"><img src="' + act + '" style="opacity:.5"></div>' +
      '<input type="range" min="0" max="100" value="50">';
    const img = stage.querySelectorAll('img')[1];
    stage.querySelector('input').oninput = e => { img.style.opacity = e.target.value / 100; };
  } else if (mode === 'slider') {
    stage.innerHTML =
      '<div class="stack"><img src="' + exp + '"><img src="' + act + '" style="clip-path:inset(0 0 0 50%)"></div>' +
      '<input type="range" min="0" max="100" value="50">';
    const img = stage.querySelectorAll('img')[1];
    stage.querySelector('input').oninput = e => {
      img.style.clipPath = 'inset(0 0 0 ' + e.target.value + '%)';
    };
  } else if (mode === 'blink') {
    stage.innerHTML = '<img src="' + exp + '" alt="blink">';
    const img = stage.querySelector('img');
    let on = false;
    stage._timer = setInterval(() => { on = !on; img.src = on ? act : exp; }, 500);
  } else {
    stage.innerHTML = '<img src="' + act + '" alt="actual">';
  }
}

document.querySelectorAll('.card').forEach(card => {
  const detail = card.querySelector('.detail');
  const stage = card.querySelector('.stage');
  card.querySelector('.toggle').onclick = () => {
    const open = detail.hasAttribute('hidden');
    detail.toggleAttribute('hidden', !open);
    card.querySelector('.toggle').setAttribute('aria-expanded', String(open));
    if (open) render(stage); else clearInterval(stage._timer);
  };
  card.querySelectorAll('.modes button').forEach(b => {
    b.onclick = () => {
      clearInterval(stage._timer);
      card.querySelectorAll('.modes button').forEach(o => o.classList.remove('active'));
      b.classList.add('active');
      stage.dataset.mode = b.dataset.mode;
      render(stage);
    };
  });
});
</script>
</body>
</html>`;
}
