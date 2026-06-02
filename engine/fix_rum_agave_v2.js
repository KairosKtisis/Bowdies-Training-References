// engine/fix_rum_agave_v2.js
//
// Phase 5 / Session 14 — strips remaining tequila/agave language from rum-bottle
// notes. The existing fix_rum_language.js (Apr 2026) handled "silver-spirit lift"
// and "blanco-tequila" patterns; this v2 targets the dominant leak that survived:
// "green-agave-and-cane lift" (the old LIGHT_SPIRIT class default character).
//
// Targets rum bottles only — both light rums (RUM_LIGHT class post-Phase-5) and
// heavy rums (HEAVY_SPIRIT class). Tequila bottles are untouched.
//
// Writes to sandbox first, then atomic-rename via tmp pattern.

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NOTES_FILE = path.join(ROOT, 'pairing-notes.js');

function hashPair(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const RUMS = new Set([
  // Light rums (RUM_LIGHT)
  'Bacardi Rum', 'Mount Gay Rum', 'Captain Morgan Rum', 'Malibu Rum',
  // Heavy rums (HEAVY_SPIRIT)
  'Ron Zacapa Rum', 'Doctor Bird Jamaica Rum', "Myers's Rum",
  'Jung and Wulff Trinidad', 'Jung and Wulff Guyana',
]);

// Tequila/agave phrase substitutions for rum-context notes.
// Variants are picked deterministically by pair-key hash so each pair is stable
// and the distribution spreads across the variant pool.
const SUBSTITUTIONS = [
  {
    name: 'green-agave-and-cane lift',
    match: /green-agave-and-cane lift/g,
    variants: [
      'cane-and-citrus lift',
      'Caribbean-rum lift with cane',
      'bright sugarcane-and-citrus body',
      'light-rum register with cane',
      'molasses-light register with citrus',
    ],
  },
  {
    name: 'green-agave edge',
    match: /green-agave edge/g,
    variants: [
      'bright sugarcane edge',
      'cane-and-citrus edge',
      'Caribbean-rum edge',
      'molasses-light edge',
      'unaged-cane edge',
    ],
  },
  {
    name: 'silver-tequila body',
    match: /silver-tequila body/g,
    variants: [
      'light-rum body',
      'Caribbean-rum body',
      'silver-rum body',
      'unaged-cane body',
      'molasses-light body',
    ],
  },
  {
    name: 'silver-tequila register',
    match: /silver-tequila register/g,
    variants: [
      'light-rum register',
      'Caribbean-rum register',
      'silver-rum register',
      'cane-and-citrus register',
      'molasses-light register',
    ],
  },
  {
    name: 'unaged-agave note',
    match: /unaged-agave note/g,
    variants: [
      'unaged-cane note',
      'Caribbean-rum note',
      'bright sugarcane note',
      'molasses-light note',
      'cane-and-citrus note',
    ],
  },
  {
    name: 'unaged-agave',
    match: /unaged-agave/g,
    variants: [
      'unaged-cane',
      'silver-rum',
      'Caribbean-rum',
      'molasses-light',
      'cane-and-citrus',
    ],
  },
  {
    name: 'blanco-tequila body',
    match: /blanco-tequila body/g,
    variants: [
      'light-rum body',
      'Caribbean-rum body',
      'silver-rum body',
      'unaged-cane body',
      'cane-and-citrus body',
    ],
  },
  {
    name: 'blanco tequila lift',
    match: /blanco tequila lift/g,
    variants: [
      'light-rum lift',
      'Caribbean-rum lift',
      'sugarcane-and-citrus lift',
      'silver-rum lift',
      'molasses-light lift',
    ],
  },
];

const src = fs.readFileSync(NOTES_FILE, 'utf8');
const lines = src.split('\n');
const lineRe = /^(\s*"([^"]+)":\s*)"((?:[^"\\]|\\.)*)"(,?)\s*$/;

let totalSwaps = 0;
const swapsByPattern = {};
const swapsByBottle = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Quick prefilter — skip lines without any rum bottle name
  let hasRum = false;
  for (const r of RUMS) { if (line.includes(r)) { hasRum = true; break; } }
  if (!hasRum) continue;

  const m = lineRe.exec(line);
  if (!m) continue;
  const [, prefix, key, raw, comma] = m;
  const [a, b] = key.split('|');
  if (!RUMS.has(a) && !RUMS.has(b)) continue;
  const bottle = RUMS.has(a) ? a : b;

  let text;
  try { text = JSON.parse('"' + raw + '"'); } catch (e) { continue; }
  let modified = false;

  for (const sub of SUBSTITUTIONS) {
    sub.match.lastIndex = 0;
    if (!sub.match.test(text)) continue;
    sub.match.lastIndex = 0;
    text = text.replace(sub.match, (matchStr) => {
      const canon = key.split('|').sort().join('::');
      const idx = hashPair(canon + '|' + sub.name) % sub.variants.length;
      totalSwaps++;
      swapsByPattern[sub.name] = (swapsByPattern[sub.name] || 0) + 1;
      swapsByBottle[bottle] = (swapsByBottle[bottle] || 0) + 1;
      return sub.variants[idx];
    });
    sub.match.lastIndex = 0;
    modified = true;
  }

  if (modified) lines[i] = prefix + JSON.stringify(text) + comma;
}

console.log('=== FIX RUM AGAVE v2 ===');
console.log('Total swaps: ' + totalSwaps);
console.log('');
console.log('By pattern:');
for (const [p, n] of Object.entries(swapsByPattern).sort((a,b) => b[1]-a[1])) {
  console.log('  ' + p.padEnd(28) + ' ' + n);
}
console.log('');
console.log('By bottle:');
for (const [b, n] of Object.entries(swapsByBottle).sort((a,b) => b[1]-a[1])) {
  console.log('  ' + b.padEnd(28) + ' ' + n);
}

if (totalSwaps === 0) {
  console.log('\nNo changes to write.');
  process.exit(0);
}

// Write via sandbox + atomic rename
const SANDBOX = '/sessions/adoring-serene-dijkstra/mnt/outputs/pairing-notes.fix-rum.js';
const out = lines.join('\n');
fs.writeFileSync(SANDBOX, out);
console.log('\nWrote ' + out.length + ' bytes to sandbox: ' + SANDBOX);
console.log('NEXT: cp sandbox -> pairing-notes.js (atomic) + verify size + mirror sync + health check');
