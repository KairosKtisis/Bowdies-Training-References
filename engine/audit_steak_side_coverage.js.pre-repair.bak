'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const repo = path.resolve(__dirname, '..');
const taxonomy = require('./pairing_engine_taxonomy');
const ctx = {}; vm.createContext(ctx);
const load = (f, n) => vm.runInContext(fs.readFileSync(path.join(repo, f), 'utf8') + '\nthis.' + n + ' = ' + n + ';', ctx);
load('pairing-map-v2.js', 'PAIRING_MAP');
load('pairing-notes.js', 'PAIRING_NOTES');

const byName = {}; for (const e of ctx.PAIRING_MAP) byName[e.name] = e;
const STEAKS = ['Filet Mignon','Bone-In Filet','Kansas City','Cowboy Ribeye','The Tomahawk','Porterhouse'];
const sides = ctx.PAIRING_MAP.filter(e => /SIDE/.test(taxonomy.foodClassFor(e) || '')).map(e => e.name);
console.log('Steaks: ' + STEAKS.length);
console.log('Sides: ' + sides.length);
console.log('  ' + sides.join(', '));
console.log('');

const tierByKey = new Map();
for (const e of ctx.PAIRING_MAP) {
  for (const tier of ['gold','excellent','strong','works','avoid']) {
    if (!Array.isArray(e[tier])) continue;
    for (const target of e[tier]) {
      tierByKey.set(e.name + '|' + target, tier);
      tierByKey.set(target + '|' + e.name, tier);
    }
  }
}

const missingNote = [];
const missingTier = [];
for (const s of STEAKS) {
  for (const side of sides) {
    const fwd = s + '|' + side;
    const rev = side + '|' + s;
    const noteHit = ctx.PAIRING_NOTES[fwd] || ctx.PAIRING_NOTES[rev];
    const tierHit = tierByKey.get(fwd);
    if (!tierHit) missingTier.push(fwd);
    if (!noteHit) missingNote.push(fwd);
  }
}

console.log('Missing tier-classifications: ' + missingTier.length);
missingTier.forEach(k => console.log('  ' + k));
console.log('');
console.log('Missing pair-notes: ' + missingNote.length);
missingNote.forEach(k => console.log('  ' + k));
 + k));
