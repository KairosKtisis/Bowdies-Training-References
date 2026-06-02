// engine/apply_bridge_variants.js
//
// Phase 7 / Session 19 — merges bridge1Variants/bridge2Variants into
// engine/bottle_profiles_curated.js for the bottles defined in
// engine/bridge_variants_whiskey.js. Generator already supports the
// {bridge}Variants fields per the LIGHT_SPIRIT_VOICE_DEFAULTS pattern.
//
// Also runs a corpus sweep: redistributes existing single-bridge phrases
// in pairing-notes.js across the new variant pool via hash-pick on the
// canonical sorted pair-key (the Session 18 lesson — avoids mirror desync).

'use strict';
const fs = require('fs');
const path = require('path');
const { BRIDGE_VARIANTS } = require('./bridge_variants_whiskey');
const { BOTTLE_PROFILES_CURATED } = require('./bottle_profiles_curated');

const ROOT = path.resolve(__dirname, '..');
const PROF_FILE = path.join(__dirname, 'bottle_profiles_curated.js');
const NOTES_FILE = path.join(ROOT, 'pairing-notes.js');
const SANDBOX_PROF = '/sessions/adoring-serene-dijkstra/mnt/outputs/bottle_profiles_curated.js';
const SANDBOX_NOTES = '/sessions/adoring-serene-dijkstra/mnt/outputs/pairing-notes.bridge-variants.js';

function hashCanon(a, b, salt) {
  const seed = [a, b].sort().join('|') + '|' + (salt || '');
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// ── PART 1 — merge variants into bottle_profiles_curated.js ──
let profSrc = fs.readFileSync(PROF_FILE, 'utf8');
let mergeCount = 0;
for (const [bottle, vs] of Object.entries(BRIDGE_VARIANTS)) {
  // Find the bottle's block and inject bridge1Variants + bridge2Variants
  // after the existing bridge2 line.
  const escName = bottle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blockRx = new RegExp(
    "('" + escName + "':\\s*\\{[\\s\\S]*?bridge2:\\s*'[^']*',)(?!\\s*bridge1Variants)",
    'm'
  );
  const m = profSrc.match(blockRx);
  if (!m) { console.error('  MISS: ' + bottle); continue; }
  const injection =
    "\n    bridge1Variants: " + JSON.stringify(vs.bridge1Variants, null, 6).replace(/\n/g, '\n    ') +
    ",\n    bridge2Variants: " + JSON.stringify(vs.bridge2Variants, null, 6).replace(/\n/g, '\n    ') + ",";
  profSrc = profSrc.replace(blockRx, m[1] + injection);
  mergeCount++;
}
fs.writeFileSync(SANDBOX_PROF, profSrc);
console.log('Merged ' + mergeCount + '/' + Object.keys(BRIDGE_VARIANTS).length + ' bottles into profile module');

// ── PART 2 — redistribute current corpus occurrences via hash-pick ──
const notesSrc = fs.readFileSync(NOTES_FILE, 'utf8');
const lines = notesSrc.split('\n');
const lineRe = /^(\s*"([^"]+)":\s*)"((?:[^"\\]|\\.)*)"(,?)\s*$/;

let totalSwaps = 0;
let pairsTouched = 0;
const swapsByBottle = {};

// Build a lookup of substitutable bridge phrases per bottle, including the original
// in the variant pool so it doesn't go extinct. We strip the {foodTarget}/{foodSubj}
// placeholder portion to get a literal phrase fragment to search for in prose
// (the corpus has it substituted with actual food names).
function fragmentsFor(bottle) {
  const p = BOTTLE_PROFILES_CURATED[bottle];
  const v = BRIDGE_VARIANTS[bottle];
  if (!p || !v) return null;
  // For each bridge, extract the leading literal text (before {foodTarget}/{foodSubj})
  // and use that as a search needle. Variants get the same leading-literal extracted.
  function leadOf(s) {
    return s.replace(/\s*\{foodTarget\}.*$/, '').replace(/\s*\{foodSubj\}.*$/, '').trim();
  }
  return {
    b1: { needle: leadOf(p.bridge1), variants: v.bridge1Variants.map(leadOf) },
    b2: { needle: leadOf(p.bridge2), variants: v.bridge2Variants.map(leadOf) },
  };
}

const bottleFrags = {};
for (const b of Object.keys(BRIDGE_VARIANTS)) bottleFrags[b] = fragmentsFor(b);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = lineRe.exec(line);
  if (!m) continue;
  const [, prefix, key, raw, comma] = m;
  const [a, b] = key.split('|');
  // Check if this pair involves one of our target bottles
  let bottle = null;
  if (bottleFrags[a]) bottle = a;
  else if (bottleFrags[b]) bottle = b;
  if (!bottle) continue;
  const frags = bottleFrags[bottle];

  let text;
  try { text = JSON.parse('"' + raw + '"'); } catch (e) { continue; }
  let modified = false;

  for (const slot of ['b1', 'b2']) {
    const { needle, variants } = frags[slot];
    if (!needle || needle.length < 8) continue;
    if (!text.includes(needle)) continue;
    const idx = hashCanon(a, b, bottle + '|' + slot) % variants.length;
    const pick = variants[idx];
    if (pick === needle) continue; // hash landed on original — skip
    text = text.split(needle).join(pick);
    totalSwaps++;
    swapsByBottle[bottle] = (swapsByBottle[bottle] || 0) + 1;
    modified = true;
  }

  if (modified) {
    pairsTouched++;
    lines[i] = prefix + JSON.stringify(text) + comma;
  }
}

console.log('');
console.log('Corpus sweep — pairs touched: ' + pairsTouched + ', total swaps: ' + totalSwaps);
console.log('Top bottles by swaps:');
for (const [b, n] of Object.entries(swapsByBottle).sort((a,b) => b[1]-a[1])) {
  console.log('  ' + b.padEnd(35) + ' ' + n);
}

if (totalSwaps > 0) {
  fs.writeFileSync(SANDBOX_NOTES, lines.join('\n'));
  console.log('\nWrote ' + lines.join('\n').length + ' bytes to sandbox: ' + SANDBOX_NOTES);
} else {
  console.log('\nNo corpus changes needed.');
}
console.log('\nNEXT (run as separate bash commands):');
console.log('  cp ' + SANDBOX_PROF + ' engine/bottle_profiles_curated.js');
if (totalSwaps > 0) console.log('  cp ' + SANDBOX_NOTES + ' pairing-notes.js  (after backing up)');
