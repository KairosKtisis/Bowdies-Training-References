// engine/break_works_connectives.js
//
// Phase 7 / Session 18 — redistributes the 4 dominant WORKS-tier connectives
// ("finds neutral with", "reads alongside", "sits alongside", "leans against")
// across a 19-variant pool, matching the now-expanded pickAction() in the
// generator.
//
// Filters: only WORKS-tier notes (closing "Works;") get touched. Editorial
// preserved automatically because hand-written notes rarely use the templated
// "{character} {connective} the {food}" body pattern. Each occurrence is
// hash-picked deterministically by pair-key.

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NOTES_FILE = path.join(ROOT, 'pairing-notes.js');
const SANDBOX = '/sessions/adoring-serene-dijkstra/mnt/outputs/pairing-notes.break-works.js';

function hashPair(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Full 19-variant pool (4 originals + 15 new). Originals included so they
// don't go extinct — just diluted from ~25% concentration to ~5%.
const VARIANTS = [
  'finds neutral with', 'reads alongside', 'sits alongside', 'leans against',
  'sits beside', 'stays alongside', 'holds with', 'plays cleanly against',
  'settles next to', 'rests beside', 'anchors against', 'carries with',
  'composes alongside', 'frames quietly', 'matches register with',
  'wraps cleanly into', 'threads into', 'sits at register with', 'touches',
];

const TARGETS = [
  /\bfinds neutral with\b/g,
  /\breads alongside\b/g,
  /\bsits alongside\b/g,
  /\bleans against\b/g,
];

const src = fs.readFileSync(NOTES_FILE, 'utf8');
const lines = src.split('\n');
const lineRe = /^(\s*"([^"]+)":\s*)"((?:[^"\\]|\\.)*)"(,?)\s*$/;

let totalSwaps = 0;
let pairsTouched = 0;
const swapsByVerb = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Quick prefilter
  if (!line.includes('finds neutral with') && !line.includes('reads alongside')
      && !line.includes('sits alongside') && !line.includes('leans against')) continue;

  const m = lineRe.exec(line);
  if (!m) continue;
  const [, prefix, key, raw, comma] = m;

  let text;
  try { text = JSON.parse('"' + raw + '"'); } catch (e) { continue; }

  // Filter: only WORKS-tier notes (must end with "Works;" closer somewhere near the end)
  if (!/\bWorks;/.test(text)) continue;

  let modified = false;
  let occurrence = 0;
  for (const rx of TARGETS) {
    rx.lastIndex = 0;
    if (!rx.test(text)) continue;
    rx.lastIndex = 0;
    text = text.replace(rx, (matchStr) => {
      occurrence++;
      const idx = hashPair(key + '|' + matchStr + '|' + occurrence) % VARIANTS.length;
      const pick = VARIANTS[idx];
      if (pick !== matchStr) {
        totalSwaps++;
        swapsByVerb[matchStr] = (swapsByVerb[matchStr] || 0) + 1;
        return pick;
      }
      // Hash landed on the original — keep it
      return matchStr;
    });
    rx.lastIndex = 0;
    modified = true;
  }
  if (modified) {
    pairsTouched++;
    lines[i] = prefix + JSON.stringify(text) + comma;
  }
}

console.log('=== BREAK WORKS-TIER CONNECTIVES ===');
console.log('Pairs touched: ' + pairsTouched);
console.log('Total swaps:   ' + totalSwaps);
console.log('');
console.log('By original verb:');
for (const [v, n] of Object.entries(swapsByVerb).sort((a,b) => b[1]-a[1])) {
  console.log('  ' + v.padEnd(28) + ' ' + n);
}

if (totalSwaps === 0) {
  console.log('\nNo changes to write.');
  process.exit(0);
}

const out = lines.join('\n');
fs.writeFileSync(SANDBOX, out);
console.log('\nWrote ' + out.length + ' bytes to sandbox: ' + SANDBOX);
console.log('NEXT: cp -> pairing-notes.js (atomic) + verify + mirror sync + health check');
