'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = '/sessions/adoring-serene-dijkstra/mnt/Bowdies-Training-References';
const NOTES_FILE = path.join(ROOT, 'pairing-notes.js');
const OUT = '/sessions/adoring-serene-dijkstra/mnt/outputs/pairing-notes.pathB.js';

const args = process.argv.slice(2);
function arg(name, def) { const i = args.indexOf(name); return i === -1 ? def : args[i+1]; }
const START = parseInt(arg('--start', '0'), 10);
const LIMIT = parseInt(arg('--limit', '300'), 10);

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

// Comprehensive phrase-leak detector (combines all 3 rounds of patterns)
const LEAKS = [
  // Round 1-3 bottle name refs
  'Sinatra Select','Voyage 23','JD Bonded','Neptunia','AE Triple Cask','Fernet Branca still',
  'EC 18','HH 20','HH 17','BH Red Wine Cask','IW Harper 15','GTS','Boss Hog','Marian McLain',
  'Pact 7','Pact 8','Pact 9','Pact 10','Fortuna','own-plus-sourced','Old Fitz 7','Old Fitz 9',
  'CC 43','Old Elk Cigar Cut','Kentucky Owl St',
  // Round 4 (Path B) additions — patterns from sample v3 audit
  'single-barrel vanilla-forward','Caribbean Cask rides','KBS distinctiveness',
  'Gran Cru', 'Remus 15','Gatsby-tribute','Millennium','lava-filtered',
  'Michigan character','the truffle the way polished','two-cut plate',
  'rare bottle','save the collector bottle','save the bottle for',
  'the aging helps vs','helps vs.',
  // Closers that reference specific bottle styles
  "frames the cut at",
];

// Identify targets
const targets = [];
for (const k of Object.keys(notes)) {
  const v = notes[k];
  if (typeof v !== 'string') continue;
  if (/^Never pair /.test(v)) continue;
  const [a, b] = k.split('|');
  let hit = false;
  for (const leak of LEAKS) {
    if (v.includes(leak) && !a.includes(leak) && !b.includes(leak)) {
      const idx = v.indexOf(leak);
      const before = v.slice(Math.max(0,idx-50), idx);
      if (!/plate deserves|Reach for|route to|Lead with|alts above are|recommend one of/i.test(before)) {
        hit = true; break;
      }
    }
  }
  if (!hit) continue;
  const t = taxonomy.tierFor(a, b, ctx.PAIRING_MAP);
  if (!t) continue;
  targets.push({k, t});
}
console.log('Phrase-leak targets: ' + targets.length);

const slice = targets.slice(START, START + LIMIT);
console.log('Slice [' + START + ' .. ' + (START + slice.length) + ')');

const foodCats = new Set(['steak','main','starter','side','salad','soup','soup-salad','dessert']);
let regen = 0, err = 0;
for (const {k, t} of slice) {
  const [a, b] = k.split('|');
  const ea = ctx.ENRICHED_PROFILES[a], eb = ctx.ENRICHED_PROFILES[b];
  if (!ea || !eb) { err++; continue; }
  const d = foodCats.has(ea.category) ? eb : ea;
  const f = foodCats.has(ea.category) ? ea : eb;
  try {
    const note = dxf.generate(d, f, t, {
      PAIRING_MAP: ctx.PAIRING_MAP, ENRICHED_PROFILES: ctx.ENRICHED_PROFILES,
      CHEMISTRY_CLAIMS: ctx.CHEMISTRY_CLAIMS, EDITORIAL_SNIPPETS: ctx.EDITORIAL_SNIPPETS
    });
    if (note) { notes[k] = note; notes[b + '|' + a] = note; regen++; }
  } catch (e) { err++; }
}
console.log('Regen: ' + regen + ' / Err: ' + err);

const allKeys = Object.keys(notes);
const parts = ['const PAIRING_NOTES = {'];
for (const k of allKeys) parts.push('  ' + JSON.stringify(k) + ': ' + JSON.stringify(notes[k]) + ',');
parts.push('};', '',
  'function getPairingNote(itemName, pairingName) {',
  "  return PAIRING_NOTES[itemName + '|' + pairingName] || null;",
  '}', '',
  "if (typeof module !== 'undefined' && module.exports) {",
  '  module.exports = { PAIRING_NOTES, getPairingNote };',
  '}', '');
fs.writeFileSync(OUT, parts.join('\n'));
console.log('Wrote ' + parts.join('\n').length + ' bytes');
console.log('NEXT --start ' + (START + LIMIT));
