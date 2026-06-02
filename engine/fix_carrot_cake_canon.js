// engine/fix_carrot_cake_canon.js
//
// CARROT CAKE CANON (per Gabe, 2026-06-01):
//   Bowdie's carrot cake = cream cheese frosting + cinnamon spice. **No raisins, no nuts.**
//
// This sweep targets the 90 carrot-cake-context notes that contain "raisin(s)" or
// nut/walnut/pecan claims. Replacement language: cinnamon, spice, cream-cheese, allspice —
// the actual flavor profile of Bowdie's carrot cake.
//
// Context filter: only swaps when the pair-key contains "Carrot Cake" AND the matched
// phrase is in a cake-attribute context. Preserves walnut mentions that belong to a wine's
// own tasting notes (e.g. Graham's 10 Year Tawny lists "walnut" as a port flavor —
// legitimate, kept).

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const NOTES_FILE = path.join(ROOT, 'pairing-notes.js');
const SANDBOX = '/sessions/adoring-serene-dijkstra/mnt/outputs/pairing-notes.fix-carrot-cake.js';

function hashPair(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Substitution patterns. Applied in priority order (longest/most specific first)
// so composite phrases get replaced before their constituent words.
const SUBS = [
  // ── Multi-word composites — these MUST run first ─────────────────────
  { match: /raisins, cream cheese frosting, and cinnamon warmth/g,
    variants: ['cream-cheese frosting and cinnamon warmth', 'cream-cheese-and-cinnamon warmth', 'cream cheese frosting and warm cinnamon spice'] },
  { match: /cream cheese and raisins/g,
    variants: ['cream cheese and cinnamon', 'cream-cheese frosting and cinnamon', 'cream cheese and warm spice'] },
  { match: /raisin-and-cinnamon/g,
    variants: ['spice-and-cinnamon', 'cinnamon-and-spice', 'cinnamon-warmth-and-spice'] },
  { match: /raisin-and-spice/g,
    variants: ['spice-and-cinnamon', 'cinnamon-and-spice', 'cinnamon-warmth-and-allspice'] },
  { match: /spice-and-raisins/g,
    variants: ['cinnamon-and-spice', 'spice-and-cinnamon', 'allspice-and-cinnamon'] },
  { match: /raisins and frosting/g,
    variants: ['cinnamon and frosting', 'cream-cheese frosting', 'spice and frosting'] },
  { match: /raisins and spice/g,
    variants: ['cinnamon and spice', 'spice and cinnamon', 'allspice and cinnamon'] },
  { match: /raisins and cinnamon/g,
    variants: ['cinnamon and spice', 'allspice and cinnamon', 'cinnamon and warm spice'] },
  { match: /(?:the )?cake's raisins/g,
    variants: ["the cake's cinnamon", "the cake's cinnamon-spice", "the cake's warm spice", "the cake's cream-cheese-and-spice"] },
  { match: /red-wine fruit marries raisins/g,
    variants: ["red-wine fruit marries the cake's spice", "red-wine fruit threads the cake's cinnamon", "red-wine fruit lifts the cake's warm spice"] },
  { match: /red-wine-finish \+ raisins bridge/g,
    variants: ['red-wine-finish bridge', 'red-wine-finish + cinnamon-spice bridge', 'red-wine-finish + cream-cheese bridge'] },

  // ── Walnut crunch patterns (cake-context) ────────────────────────────
  { match: /walnut crunch on the close/g,
    variants: ['cinnamon warmth on the close', 'cream-cheese richness on the close', 'spice register on the close', 'cinnamon-and-spice close'] },
  { match: /walnut adding crunch on the close/g,
    variants: ['cinnamon warmth on the close', 'spice warmth on the close', 'cream-cheese richness on the close'] },
  { match: /walnut on the close/g,
    variants: ['cinnamon on the close', 'spice on the close', 'warm-spice close'] },
  { match: /spiced cake and cream-cheese frosting, walnut crunch/g,
    variants: ['spiced cake and cream-cheese frosting', 'cinnamon-and-spice cake and cream-cheese frosting', 'spiced cake with warm cinnamon and cream-cheese frosting'] },
  { match: /spiced cake and cream-cheese frosting, walnut/g,
    variants: ['spiced cake and cream-cheese frosting', 'cinnamon-spiced cake with cream-cheese frosting'] },

  // ── Standalone raisin/raisins (post-composite catch-all) ─────────────
  { match: /\braisins\b/g,
    variants: ['cinnamon-spice', 'cake spice', 'warm-spice register', 'cinnamon notes'] },
  { match: /\braisin\b(?!-)/g,
    variants: ['cinnamon', 'spice', 'cake-spice'] },
];

const src = fs.readFileSync(NOTES_FILE, 'utf8');
const lines = src.split('\n');
const lineRe = /^(\s*"([^"]+)":\s*)"((?:[^"\\]|\\.)*)"(,?)\s*$/;

let totalSwaps = 0;
const swapsByPattern = {};
let pairsTouched = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.toLowerCase().includes('carrot cake')) continue;
  const m = lineRe.exec(line);
  if (!m) continue;
  const [, prefix, key, raw, comma] = m;
  if (!key.toLowerCase().includes('carrot cake')) continue;

  let text;
  try { text = JSON.parse('"' + raw + '"'); } catch (e) { continue; }
  let modified = false;
  for (const sub of SUBS) {
    sub.match.lastIndex = 0;
    if (!sub.match.test(text)) continue;
    sub.match.lastIndex = 0;
    text = text.replace(sub.match, () => {
      const canon = key.split('|').sort().join('::');
      const idx = hashPair(canon + '|' + sub.match.source) % sub.variants.length;
      totalSwaps++;
      const ptn = sub.match.source.slice(0, 40);
      swapsByPattern[ptn] = (swapsByPattern[ptn] || 0) + 1;
      return sub.variants[idx];
    });
    sub.match.lastIndex = 0;
    modified = true;
  }
  if (modified) {
    pairsTouched++;
    lines[i] = prefix + JSON.stringify(text) + comma;
  }
}

console.log('=== FIX CARROT CAKE CANON ===');
console.log('Pairs touched: ' + pairsTouched);
console.log('Total swaps:   ' + totalSwaps);
console.log('');
console.log('By pattern:');
for (const [p, n] of Object.entries(swapsByPattern).sort((a,b) => b[1]-a[1])) {
  console.log('  ' + p.padEnd(50) + ' ' + n);
}

if (totalSwaps === 0) {
  console.log('\nNo changes to write.');
  process.exit(0);
}

const out = lines.join('\n');
fs.writeFileSync(SANDBOX, out);
console.log('\nWrote ' + out.length + ' bytes to sandbox: ' + SANDBOX);
console.log('NEXT: cp sandbox -> pairing-notes.js (atomic) + verify size + mirror sync + health check');
