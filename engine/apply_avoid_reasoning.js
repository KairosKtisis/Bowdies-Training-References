// engine/apply_avoid_reasoning.js (v2 — single-pass substitution)
//
// Phase 3 (Session 3) — applies per-pair AVOID reasoning. Reads pairing-notes.js
// once, builds a key→new-value map, then walks the source text in a single
// regex pass replacing matching keys. O(n) total, not O(n²).

'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');
const taxonomy = require('./pairing_engine_taxonomy');
const gen = require('./drink_x_food_generator');

const ARGS = process.argv.slice(2);
const COMMIT = ARGS.includes('--commit');
const SAMPLE_N = (() => {
  const idx = ARGS.indexOf('--sample');
  if (idx >= 0 && ARGS[idx + 1]) return parseInt(ARGS[idx + 1], 10) || 50;
  return 50;
})();

const repoRoot = path.resolve(__dirname, '..');

function loadRepoData() {
  const ctx = { console };
  vm.createContext(ctx);
  const load = (file, name) => {
    const src = fs.readFileSync(path.join(repoRoot, file), 'utf8');
    vm.runInContext(src + '\nthis.' + name + ' = ' + name + ';', ctx);
  };
  load('pairing-map-v2.js', 'PAIRING_MAP');
  load('pairing-notes.js', 'PAIRING_NOTES');
  return ctx;
}

const data = loadRepoData();
const PAIRING_MAP = data.PAIRING_MAP;
const PAIRING_NOTES = data.PAIRING_NOTES;

const ENTITY = Object.create(null);
for (const e of PAIRING_MAP) ENTITY[e.name] = e;

const FOOD_CATS = taxonomy.FOOD_CATS;
const DRINK_CATS = taxonomy.DRINK_CATS;

function tierForKey(key) {
  const [a, b] = key.split('|');
  const ea = ENTITY[a], eb = ENTITY[b];
  if (!ea || !eb) return null;
  for (const tier of ['gold', 'excellent', 'strong', 'works', 'avoid']) {
    if ((ea[tier] || []).includes(b)) return tier;
    if ((eb[tier] || []).includes(a)) return tier;
  }
  return null;
}

const LEGACY_OVERPOWERS_RX = / overpowers .+\s*--\s*the plate deserves /;
const TEMPLATED_AVOID_RX = /\s*--\s*[^.]+\.\s+The plate deserves .+, not /;

function isTemplatedAvoid(note) {
  return LEGACY_OVERPOWERS_RX.test(note) || TEMPLATED_AVOID_RX.test(note);
}

// ── Build change map ──────────────────────────────────────────────────
console.log('Building change map...');
const t0 = Date.now();
const changes = new Map(); // key → { before, after }
const skippedEditorial = [];
let totalAvoid = 0;

for (const key of Object.keys(PAIRING_NOTES)) {
  if (tierForKey(key) !== 'avoid') continue;
  totalAvoid++;
  const before = PAIRING_NOTES[key];
  if (!isTemplatedAvoid(before)) { skippedEditorial.push(key); continue; }
  const [a, b] = key.split('|');
  const ea = ENTITY[a], eb = ENTITY[b];
  if (!ea || !eb) continue;
  const drink = DRINK_CATS.has(ea.category) ? ea : eb;
  const food  = FOOD_CATS.has(ea.category) ? ea : eb;
  if (!drink || !food) continue;
  let after;
  try {
    after = gen.generate(drink, food, 'avoid', { PAIRING_MAP });
  } catch (e) {
    console.error('GENERATE FAILED for', key, ':', e.message);
    continue;
  }
  if (after && after !== before) {
    changes.set(key, { before, after });
  }
}
console.log('Built change map in ' + (Date.now() - t0) + 'ms');

console.log('');
console.log('=== APPLY AVOID REASONING v2 — ' + (COMMIT ? 'COMMIT' : 'DRY-RUN') + ' ===');
console.log('Total pair-notes:        ' + Object.keys(PAIRING_NOTES).length);
console.log('AVOID-tier notes:        ' + totalAvoid);
console.log('Templated (will change): ' + changes.size);
console.log('Editorial (preserved):   ' + skippedEditorial.length);
console.log('');

// Write sample diff (always, for verification)
const diffPath = path.join(__dirname, 'apply_avoid_diff.txt');
const diff = [];
diff.push('=== APPLY AVOID REASONING v2 — SAMPLE DIFF ===');
diff.push('Run mode: ' + (COMMIT ? 'COMMIT' : 'DRY-RUN'));
diff.push('Generated: ' + new Date().toISOString());
diff.push('Total changes: ' + changes.size + ' / ' + totalAvoid + ' AVOID notes');
diff.push('');
const sampleByClass = new Map();
for (const [key, c] of changes) {
  const [da, db] = key.split('|');
  const ea = ENTITY[da], eb = ENTITY[db];
  const drink = DRINK_CATS.has(ea.category) ? ea : eb;
  const dc = taxonomy.drinkClassFor(drink) || 'OTHER';
  if (!sampleByClass.has(dc)) sampleByClass.set(dc, []);
  sampleByClass.get(dc).push({ key, ...c });
}
const perClass = Math.max(2, Math.floor(SAMPLE_N / sampleByClass.size));
let sampled = 0;
for (const [dc, arr] of [...sampleByClass.entries()].sort()) {
  diff.push('─── ' + dc + ' (cell has ' + arr.length + ' changes) ───');
  const picks = arr.length <= perClass ? arr :
    Array.from({length: perClass}, (_, i) => arr[Math.floor(i * arr.length / perClass)]);
  for (const p of picks) {
    if (sampled >= SAMPLE_N) break;
    diff.push('  [' + p.key + ']');
    diff.push('    BEFORE: ' + p.before);
    diff.push('    AFTER:  ' + p.after);
    diff.push('');
    sampled++;
  }
  if (sampled >= SAMPLE_N) break;
}
fs.writeFileSync(diffPath, diff.join('\n'));
console.log('Sample diff written to: engine/apply_avoid_diff.txt');

if (!COMMIT) {
  console.log('');
  console.log('DRY-RUN complete. No files modified.');
  process.exit(0);
}

// ── COMMIT MODE — single-pass substitution ─────────────────────────────
console.log('');
console.log('COMMIT mode — reading pairing-notes.js as text');
const t1 = Date.now();

const ts = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
const backupPath = path.join(repoRoot, 'pairing-notes.js.pre-apply-avoid-' + ts + '.bak');
fs.copyFileSync(path.join(repoRoot, 'pairing-notes.js'), backupPath);
console.log('Backup: ' + backupPath);

const src = fs.readFileSync(path.join(repoRoot, 'pairing-notes.js'), 'utf8');
console.log('Source file: ' + src.length + ' bytes');

// Single regex matching all lines of the form:
//   "key": "value",   (or no trailing comma)
// Captures (1) key, (2) full value-with-quotes. Callback looks up key in changes.
const LINE_RX = /^(  ")([^"]+(?:\\.[^"]*)*)("\s*:\s*)("(?:[^"\\]|\\.)*")(,?\s*)$/gm;

let replaceCount = 0;
let scannedLines = 0;
const out = src.replace(LINE_RX, (match, indent, key, sep, valQuoted, trail) => {
  scannedLines++;
  const change = changes.get(key);
  if (!change) return match;
  // Escape via JSON.stringify (handles em-dashes, accents, quotes)
  const newVal = JSON.stringify(change.after);
  replaceCount++;
  return indent + key + sep + newVal + trail;
});

console.log('Scanned ' + scannedLines + ' entry-lines in ' + (Date.now() - t1) + 'ms');
console.log('Replaced: ' + replaceCount + ' / ' + changes.size + ' expected');

if (replaceCount !== changes.size) {
  console.error('WARN: replace count does not match expected change count');
  console.error('  Likely cause: some pair-note keys not on lines matching the format regex');
  // Don't abort — write what we have
}

fs.writeFileSync(path.join(repoRoot, 'pairing-notes.js'), out);
console.log('Wrote ' + out.length + ' bytes to pairing-notes.js');
console.log('Total commit time: ' + (Date.now() - t1) + 'ms');
console.log('');
console.log('NEXT: run engine/sync_mirrors_dxf.js, then engine/engine_health_check.js');
