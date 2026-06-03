'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = '/sessions/adoring-serene-dijkstra/mnt/Bowdies-Training-References';
const NOTES_FILE = path.join(ROOT, 'pairing-notes.js');
const OUT = '/sessions/adoring-serene-dijkstra/mnt/outputs/pairing-notes.multiverdict-fix.js';

const args = process.argv.slice(2);
function arg(name, def) { const i = args.indexOf(name); return i === -1 ? def : args[i+1]; }
const START = parseInt(arg('--start', '0'), 10);
const LIMIT = parseInt(arg('--limit', '500'), 10);

const taxonomy = require(path.join(ROOT, 'engine/pairing_engine_taxonomy.js'));
const dxf = require(path.join(ROOT, 'engine/drink_x_food_generator.js'));

const ctx = {}; vm.createContext(ctx);
function loadInto(file, name) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8') + '\nthis.' + name + ' = ' + name + ';', ctx);
}
loadInto('pairing-map-v2.js', 'PAIRING_MAP');
loadInto('enriched-profiles.js', 'ENRICHED_PROFILES');
loadInto('chemistry-claims.js', 'CHEMISTRY_CLAIMS');
loadInto('editorial-snippets.js', 'EDITORIAL_SNIPPETS');

const sourceFile = (START > 0 && fs.existsSync(OUT)) ? OUT : NOTES_FILE;
console.log('Reading: ' + sourceFile);
vm.runInContext(fs.readFileSync(sourceFile, 'utf8') + '\nthis.PAIRING_NOTES = PAIRING_NOTES;', ctx);
const notes = ctx.PAIRING_NOTES;

// Identify keys with 2+ verdict markers (and tier-resolvable)
const targets = [];
for (const k of Object.keys(notes)) {
  const v = notes[k];
  if (typeof v !== 'string') continue;
  const verdicts = (v.match(/\b(Gold standard;|Excellent;|Strong;|Works;|Avoid;)/g) || []).length;
  if (verdicts < 2) continue;
  const [a, b] = k.split('|');
  const t = taxonomy.tierFor(a, b, ctx.PAIRING_MAP);
  if (!t) continue;
  // Skip hand-curated Never-pair editorial
  if (/^Never pair /.test(v)) continue;
  targets.push({k, t});
}
console.log('Total multi-verdict keys: ' + targets.length);

const slice = targets.slice(START, START + LIMIT);
console.log('Slice [' + START + ' .. ' + (START + slice.length) + ') = ' + slice.length);

const foodCats = new Set(['steak','main','starter','side','salad','soup','soup-salad','dessert']);
let regenCount = 0, errCount = 0;
for (const {k, t} of slice) {
  const [a, b] = k.split('|');
  const ea = ctx.ENRICHED_PROFILES[a], eb = ctx.ENRICHED_PROFILES[b];
  if (!ea || !eb) { errCount++; continue; }
  const d = foodCats.has(ea.category) ? eb : ea;
  const f = foodCats.has(ea.category) ? ea : eb;
  try {
    const note = dxf.generate(d, f, t, {
      PAIRING_MAP: ctx.PAIRING_MAP,
      ENRICHED_PROFILES: ctx.ENRICHED_PROFILES,
      CHEMISTRY_CLAIMS: ctx.CHEMISTRY_CLAIMS,
      EDITORIAL_SNIPPETS: ctx.EDITORIAL_SNIPPETS
    });
    if (note && typeof note === 'string') {
      notes[k] = note;
      notes[b + '|' + a] = note;
      regenCount++;
    }
  } catch (e) { errCount++; }
}

console.log('Regenerated: ' + regenCount + ' / Errors: ' + errCount);

// Serialize back with the footer
const allKeys = Object.keys(notes);
const parts = ['const PAIRING_NOTES = {'];
for (const k of allKeys) parts.push('  ' + JSON.stringify(k) + ': ' + JSON.stringify(notes[k]) + ',');
parts.push('};', '',
  'function getPairingNote(itemName, pairingName) {',
  "  return PAIRING_NOTES[itemName + '|' + pairingName] || null;",
  '}',
  '',
  "if (typeof module !== 'undefined' && module.exports) {",
  '  module.exports = { PAIRING_NOTES, getPairingNote };',
  '}',
  '');
fs.writeFileSync(OUT, parts.join('\n'));
console.log('Wrote ' + parts.join('\n').length + ' bytes');
console.log('NEXT --start ' + (START + LIMIT));
