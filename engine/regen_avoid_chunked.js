'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const args = process.argv.slice(2);
function arg(name, def) { const i = args.indexOf(name); return i === -1 ? def : args[i+1]; }
const START = parseInt(arg('--start', '0'), 10);
const LIMIT = parseInt(arg('--limit', '5000'), 10);

const ROOT = '/sessions/adoring-serene-dijkstra/mnt/Bowdies-Training-References';
const NOTES_FILE = path.join(ROOT, 'pairing-notes.js');
const SANDBOX_OUT = '/sessions/adoring-serene-dijkstra/mnt/outputs/pairing-notes.s26-avoid.js';

const taxonomy = require(path.join(ROOT, 'engine/pairing_engine_taxonomy.js'));
const dxf = require(path.join(ROOT, 'engine/drink_x_food_generator.js'));
const { isTemplatedNote } = require(path.join(ROOT, 'engine/templated_detection.js'));

const ctx = {};
vm.createContext(ctx);
function loadInto(file, name) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8') + '\nthis.' + name + ' = ' + name + ';', ctx);
}
loadInto('pairing-map-v2.js', 'PAIRING_MAP');
loadInto('enriched-profiles.js', 'ENRICHED_PROFILES');
loadInto('chemistry-claims.js', 'CHEMISTRY_CLAIMS');
loadInto('editorial-snippets.js', 'EDITORIAL_SNIPPETS');

// Use sandbox output if it exists from previous chunk; else use master
const sourceFile = (START > 0 && fs.existsSync(SANDBOX_OUT)) ? SANDBOX_OUT : NOTES_FILE;
console.log('Reading: ' + sourceFile);
vm.runInContext(fs.readFileSync(sourceFile, 'utf8') + '\nthis.PAIRING_NOTES = PAIRING_NOTES;', ctx);
const notes = ctx.PAIRING_NOTES;

// Identify AVOID keys that need regen
const avoidKeys = [];
for (const key of Object.keys(notes)) {
  const [a, b] = key.split('|');
  if (taxonomy.tierFor(a, b, ctx.PAIRING_MAP) !== 'avoid') continue;
  if (!isTemplatedNote(notes[key])) continue;
  avoidKeys.push(key);
}
console.log('Total templated AVOID keys: ' + avoidKeys.length);

const slice = avoidKeys.slice(START, START + LIMIT);
console.log('Slice [' + START + ' .. ' + (START + slice.length) + ') = ' + slice.length);

const foodCats = new Set(['steak','main','starter','side','salad','soup','dessert']);
let regenCount = 0, errCount = 0;
for (const key of slice) {
  const [a, b] = key.split('|');
  const ea = ctx.ENRICHED_PROFILES[a], eb = ctx.ENRICHED_PROFILES[b];
  if (!ea || !eb) { errCount++; continue; }
  const d = foodCats.has(ea.category) ? eb : ea;
  const f = foodCats.has(ea.category) ? ea : eb;
  try {
    const note = dxf.generate(d, f, 'avoid', {
      PAIRING_MAP: ctx.PAIRING_MAP,
      ENRICHED_PROFILES: ctx.ENRICHED_PROFILES,
      CHEMISTRY_CLAIMS: ctx.CHEMISTRY_CLAIMS,
      EDITORIAL_SNIPPETS: ctx.EDITORIAL_SNIPPETS
    });
    if (note && typeof note === 'string') {
      notes[key] = note;
      notes[b + '|' + a] = note;
      regenCount++;
    }
  } catch (e) { errCount++; }
}

console.log('Regenerated: ' + regenCount + ' / Errors: ' + errCount);

// Serialize
const allKeys = Object.keys(notes);
const parts = ['const PAIRING_NOTES = {'];
for (const k of allKeys) parts.push('  ' + JSON.stringify(k) + ': ' + JSON.stringify(notes[k]) + ',');
parts.push('};', '', "if (typeof module !== 'undefined') module.exports = { PAIRING_NOTES };", '');
fs.writeFileSync(SANDBOX_OUT, parts.join('\n'));
console.log('Wrote ' + parts.join('\n').length + ' bytes');
console.log('NEXT --start ' + (START + LIMIT));
