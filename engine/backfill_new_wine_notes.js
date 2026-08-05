// engine/backfill_new_wine_notes.js
//
// DxF orphan backfill scoped to the 2026-08-05 wine-list additions.
// Walks pairing-map-v2.js tier lists for the 11 new wines, finds drink x food
// pairs with no pair-note, and generates one via drink_x_food_generator.
// Mirror-keys results ("A|B" and "B|A"). Existing notes are NEVER touched.
// Modeled on regenerate_templated_notes.js (the FxF backfill orchestrator).
//
// Usage:
//   node engine/backfill_new_wine_notes.js --dry-run    # preview sample 12
//   node engine/backfill_new_wine_notes.js              # apply
'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const taxonomy = require('./pairing_engine_taxonomy');
const dxf = require('./drink_x_food_generator');

const REPO = path.resolve(__dirname, '..');
const NOTES_FILE = path.join(REPO, 'pairing-notes.js');
const BACKUP = path.join(REPO, 'pairing-notes.js.pre-new-wines.bak');

const NEW_WINES = new Set([
  "Ceretto Moscato d'Asti", 'Calçada Reserva Vinho Verde', 'Lubanzi Chenin Blanc',
  'Maison du Chancelier Les Mosnières', 'Painted Fields Curse of Knowledge',
  'Soul of Mendocino', 'Tenuta dei Sette Cieli Yantra', 'Tenuta Tascante Ghiaia Nera',
  'Domaine des Ardoisières Silice', 'Michel Goubard Mont Avril', 'Sanford Pinot Noir'
]);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

const ctx = {};
vm.createContext(ctx);
const load = (f, n) => vm.runInContext(fs.readFileSync(path.join(REPO, f), 'utf8') + '\nthis.' + n + ' = ' + n + ';', ctx);
load('pairing-map-v2.js', 'PAIRING_MAP');
load('enriched-profiles.js', 'ENRICHED_PROFILES');
load('chemistry-claims.js', 'CHEMISTRY_CLAIMS');
load('editorial-snippets.js', 'EDITORIAL_SNIPPETS');
load('pairing-notes.js', 'PAIRING_NOTES');

const byName = {};
for (const e of ctx.PAIRING_MAP) if (e && e.name) byName[e.name] = e;
const noteKeys = new Set(Object.keys(ctx.PAIRING_NOTES));

const tiers = ['gold', 'excellent', 'strong', 'works', 'avoid'];
const seen = new Set();
const jobs = [];
for (const e of ctx.PAIRING_MAP) {
  if (!e || !NEW_WINES.has(e.name)) continue;
  for (const tier of tiers) {
    const list = e[tier];
    if (!Array.isArray(list)) continue;
    for (const target of list) {
      const t = byName[target];
      if (!t) { console.error('[WARN] unknown target: ' + target); continue; }
      if (!taxonomy.FOOD_CATS.has(t.category)) continue;
      if (noteKeys.has(e.name + '|' + target) || noteKeys.has(target + '|' + e.name)) continue;
      const sig = e.name + '|' + target;
      if (seen.has(sig)) continue;  // gold-subset-of-excellent dupes
      seen.add(sig);
      jobs.push({ drink: e, food: t, tier: tier === 'gold' ? 'gold' : tier });
    }
  }
}
// gold pairs also appear in excellent; keep the STRONGEST tier per pair
const best = new Map();
const rank = { gold: 0, excellent: 1, strong: 2, works: 3, avoid: 4 };
for (const j of jobs) {
  const k = j.drink.name + '|' + j.food.name;
  if (!best.has(k) || rank[j.tier] < rank[best.get(k).tier]) best.set(k, j);
}
const finalJobs = Array.from(best.values());
console.log('new-wine orphan pairs: ' + finalJobs.length);

const generated = [];
const errors = [];
for (const j of finalJobs) {
  try {
    const note = dxf.generate(j.drink, j.food, j.tier, ctx);
    if (!note || typeof note !== 'string' || note.length < 20) throw new Error('thin note: ' + JSON.stringify(note));
    generated.push({ a: j.drink.name, b: j.food.name, tier: j.tier, note });
  } catch (err) {
    errors.push({ a: j.drink.name, b: j.food.name, tier: j.tier, error: err.message });
  }
}
console.log('generated: ' + generated.length + ' | errors: ' + errors.length);
errors.slice(0, 8).forEach(e => console.log('  ERR ' + e.a + ' x ' + e.b + ' [' + e.tier + ']: ' + e.error));

// sample across tiers and wines
const sample = [];
for (const tier of tiers) {
  const ofTier = generated.filter(g => g.tier === tier);
  for (const g of ofTier.slice(0, tier === 'works' ? 2 : 3)) sample.push(g);
}
console.log('\n--- SAMPLE ---');
for (const g of sample) {
  console.log('[' + g.tier.padEnd(9) + '] ' + g.a + ' x ' + g.b);
  console.log('  ' + g.note + '\n');
}

if (dryRun) { console.log('[DRY-RUN] no files modified.'); process.exit(0); }
if (errors.length) { console.error('[ABORT] errors present; not applying.'); process.exit(1); }

const originalSrc = fs.readFileSync(NOTES_FILE, 'utf8');
fs.writeFileSync(BACKUP, originalSrc);

const startIdx = originalSrc.indexOf('const PAIRING_NOTES = {');
if (startIdx === -1) throw new Error('PAIRING_NOTES decl not found');
let depth = 0, endIdx = -1, inStr = null;
for (let i = originalSrc.indexOf('{', startIdx); i < originalSrc.length; i++) {
  const c = originalSrc[i], p = originalSrc[i - 1];
  if (inStr) { if (c === inStr && p !== '\\') inStr = null; continue; }
  if (c === '"') { inStr = c; continue; }
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { endIdx = i; break; } }
}
if (endIdx === -1) throw new Error('PAIRING_NOTES close not found');

const lines = [];
for (const g of generated) {
  const esc = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const noteStr = '"' + esc(g.note) + '"';
  lines.push('  "' + esc(g.a + '|' + g.b) + '": ' + noteStr + ',');
  lines.push('  "' + esc(g.b + '|' + g.a) + '": ' + noteStr + ',');
}
const newSrc = originalSrc.slice(0, endIdx) + '\n' + lines.join('\n') + '\n' + originalSrc.slice(endIdx);

const sanity = {};
vm.createContext(sanity);
vm.runInContext(newSrc + '\nthis.P = PAIRING_NOTES;', sanity);
const oldCount = Object.keys(ctx.PAIRING_NOTES).length;
const newCount = Object.keys(sanity.P).length;
if (newCount !== oldCount + generated.length * 2) {
  console.error('[FAIL] key math: ' + oldCount + ' + ' + generated.length * 2 + ' != ' + newCount);
  process.exit(1);
}
fs.writeFileSync(NOTES_FILE, newSrc);
console.log('[OK] pairing-notes.js: ' + oldCount + ' -> ' + newCount + ' keys');
