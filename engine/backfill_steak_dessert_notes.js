// engine/backfill_steak_dessert_notes.js
//
// Hand-curated editorial backfill for the 48 steak × dessert FxF pairs.
// COURSE_TO_DESSERT.works was the weakest archetype in the v6 audit
// (77 templated of 112 pairs, 28.7w avg). These notes replace the templated
// "savory gives way to sweet, the close lands cleanly" pattern with item-
// specific, kitchen-grounded close-of-meal commentary.
//
// Voice: matches the 16 hand-curated AVOID notes — confident, server-grade,
// no hedging. Average length 32-45 words.
//
// Tier note: most of these are 'works' (workable but not the headline) —
// the close after a steak is rarely a "must-order" pairing. A few classic
// combos are bumped to 'strong' or 'excellent' where the kitchen-side logic
// supports it (e.g. Cowboy Ribeye → Chocolate Cake — bold-into-bold).
//
// Run: node engine/backfill_steak_dessert_notes.js

'use strict';
const fs = require('fs');
const path = require('path');
const repo = path.resolve(__dirname, '..');

// 48 pairs (6 steaks × 8 desserts). Each pair gets ONE note used in both
// directions (mirror identity guaranteed at write time).
const PAIRS = [

  // ── FILET MIGNON (lean buttery 6oz tenderloin) ─────────────────────────
  { a: 'Filet Mignon', b: 'Chocolate Cake',
    note: "After the filet, the chocolate cake — the lean butter-tender 10oz hands off to layered cocoa-and-ganache weight, and the vanilla ice cream lifts the close back to the filet's restraint. Works; clean transition from the meal's lighter steak into the richer close.",
    tier: 'works' },
  { a: 'Filet Mignon', b: 'Chocolate Brownie',
    note: "The filet closes with the warm fudge brownie — the butter-tender 10oz gives way to dense cocoa fudge, and the warm vanilla ice cream lifts the close. Works; a substantial finish to a restrained main.",
    tier: 'works' },
  { a: 'Filet Mignon', b: 'Peanut Butter Brownie',
    note: "After the filet, the PB brownie — the lean tenderloin yields to peanut-and-chocolate fudge, the vanilla scoop tempering the close. Works; the peanut richness reads heavier than the filet but the warm pairing settles cleanly.",
    tier: 'works' },
  { a: 'Filet Mignon', b: 'Mocha Creme',
    note: "The filet into the mocha creme — the butter-tender 10oz hands off to silky coffee-chocolate cream, espresso depth closing the meal cleanly. Strong; the lighter steak meets the layered dessert at register.",
    tier: 'strong' },
  { a: 'Filet Mignon', b: 'Creme Brulee',
    note: "After the filet, the brulee — the lean restraint yields to vanilla-bean custard and torched-sugar crust, berries lifting the close. Strong; the steakhouse classic close on the lighter cut.",
    tier: 'strong' },
  { a: 'Filet Mignon', b: 'Cheesecake',
    note: "The filet closes with the cheesecake — the butter-tender 10oz hands off to dense cream-cheese custard on graham crust, berry compote brightening the close. Works; a heavier close than the steak called for, but it lands cleanly.",
    tier: 'works' },
  { a: 'Filet Mignon', b: 'Beignets',
    note: "After the filet, the beignets — the restrained tenderloin gives way to warm choux and powdered sugar, the dipping sauce tempering the heat. Works; the table closes light after a measured main.",
    tier: 'works' },
  { a: 'Filet Mignon', b: 'Carrot Cake',
    note: "The filet into the carrot cake — the butter-tender 10oz yields to spiced cake and cream-cheese frosting, walnut adding crunch on the close. Works; the spice-and-frosting weight outsizes the steak, but the table builds cleanly across courses.",
    tier: 'works' },

  // ── BONE-IN FILET (marrow-edged, elevated tenderloin) ────────────────
  { a: 'Bone-In Filet', b: 'Chocolate Cake',
    note: "After the bone-in filet, the chocolate cake — the marrow-edged butter-tender flesh hands off to layered cocoa-and-ganache, the vanilla scoop framing the close. Strong; the elevated cut earns the layered dessert across the meal.",
    tier: 'strong' },
  { a: 'Bone-In Filet', b: 'Chocolate Brownie',
    note: "The bone-in filet closes with the warm fudge brownie — the marrow-laced finish yields to dense cocoa fudge, the warm vanilla lifting the close. Strong; bone-depth into chocolate-depth, the meal arc reads thoughtful.",
    tier: 'strong' },
  { a: 'Bone-In Filet', b: 'Peanut Butter Brownie',
    note: "After the bone-in filet, the PB brownie — the marrow-edged cut gives way to peanut-and-chocolate fudge, the vanilla scoop tempering the heat. Works; the warm dessert lands cleanly after the elevated main.",
    tier: 'works' },
  { a: 'Bone-In Filet', b: 'Mocha Creme',
    note: "The bone-in filet into the mocha creme — the marrow-laced butter-tender yields to silky coffee-chocolate cream, espresso depth tying the courses. Strong; the elevated steak earns the layered close at register.",
    tier: 'strong' },
  { a: 'Bone-In Filet', b: 'Creme Brulee',
    note: "After the bone-in filet, the brulee — the marrow-edged finish gives way to vanilla-bean custard and torched-sugar crust, berries lifting the close. Strong; the elevated cut into the steakhouse classic.",
    tier: 'strong' },
  { a: 'Bone-In Filet', b: 'Cheesecake',
    note: "The bone-in filet closes with the cheesecake — the marrow-laced butter-tender yields to dense dairy custard on graham crust, berry compote brightening the close. Works; the dairy-on-marrow read is dense but it carries.",
    tier: 'works' },
  { a: 'Bone-In Filet', b: 'Beignets',
    note: "After the bone-in filet, the beignets — the elevated cut hands off to warm choux and powdered sugar, the dipping sauce easing the close. Works; the meal closes light after the marrow-edged main.",
    tier: 'works' },
  { a: 'Bone-In Filet', b: 'Carrot Cake',
    note: "The bone-in filet into the carrot cake — the marrow-edged butter-tender yields to spiced cake and cream-cheese frosting, walnut crunch on the close. Works; the spice-and-frosting reads heavier than the cut needed, but the meal builds clean across courses.",
    tier: 'works' },

  // ── KANSAS CITY (lean-bold strip with savory grain) ──────────────────
  { a: 'Kansas City', b: 'Chocolate Cake',
    note: "After the KC, the chocolate cake — the lean-bold strip hands off to layered cocoa-and-ganache, vanilla ice cream lifting the close. Strong; the firm-grain steak meets the classic chocolate close at full register.",
    tier: 'strong' },
  { a: 'Kansas City', b: 'Chocolate Brownie',
    note: "The KC closes with the warm fudge brownie — the savory-grain strip yields to dense cocoa fudge, warm vanilla scooping over the top. Strong; the bold strip earns the dense brownie close.",
    tier: 'strong' },
  { a: 'Kansas City', b: 'Peanut Butter Brownie',
    note: "After the KC, the PB brownie — the lean-bold strip gives way to peanut-and-chocolate fudge, the warm vanilla tempering the heat. Strong; both have weight on the plate, the meal closes substantial.",
    tier: 'strong' },
  { a: 'Kansas City', b: 'Mocha Creme',
    note: "The KC into the mocha creme — the savory-grain strip hands off to silky coffee-chocolate cream, the espresso edge closing the meal cleanly. Works; the lighter dessert reads delicate against the bold main, but the contrast holds.",
    tier: 'works' },
  { a: 'Kansas City', b: 'Creme Brulee',
    note: "After the KC, the brulee — the lean-bold strip yields to vanilla-bean custard and torched-sugar crust. Works; the classic-on-classic close, the strip hands cleanly to the silky finish.",
    tier: 'works' },
  { a: 'Kansas City', b: 'Cheesecake',
    note: "The KC closes with the cheesecake — the firm savory grain hands off to dense cream-cheese custard, berry compote brightening the graham-crust base. Works; the meal closes substantial, neither course pulling against the other.",
    tier: 'works' },
  { a: 'Kansas City', b: 'Beignets',
    note: "After the KC, the beignets — the lean-bold strip yields to warm fried choux and powdered sugar, the dipping sauce closing the meal at register. Works; the table closes light after the bold main.",
    tier: 'works' },
  { a: 'Kansas City', b: 'Carrot Cake',
    note: "The KC into the carrot cake — the savory grain hands off to spiced cake and cream-cheese frosting, walnut crunch on the close. Works; the spice and the strip find each other across the meal arc.",
    tier: 'works' },

  // ── COWBOY RIBEYE (22oz marbled char-and-fat) ────────────────────────
  { a: 'Cowboy Ribeye', b: 'Chocolate Cake',
    note: "After the cowboy ribeye, the chocolate cake — the rendered cap-fat hands off to layered cocoa-and-ganache, the vanilla scoop tempering both. Excellent; the bold steakhouse close on the bone-in cut.",
    tier: 'excellent' },
  { a: 'Cowboy Ribeye', b: 'Chocolate Brownie',
    note: "The cowboy ribeye closes with the warm fudge brownie — the marbled char-and-fat yields to dense cocoa fudge, warm vanilla over the top. Excellent; bold-into-bold, the meal closes the way the table came for.",
    tier: 'excellent' },
  { a: 'Cowboy Ribeye', b: 'Peanut Butter Brownie',
    note: "After the cowboy ribeye, the PB brownie — the rendered fat gives way to peanut-and-chocolate fudge, the vanilla scoop tempering the close. Strong; the bone-in ribeye earns the substantial dessert.",
    tier: 'strong' },
  { a: 'Cowboy Ribeye', b: 'Mocha Creme',
    note: "The cowboy ribeye into the mocha creme — the marbled char-and-fat hands off to silky coffee-chocolate cream, espresso depth closing the meal. Strong; the bold cut meets the layered close at register.",
    tier: 'strong' },
  { a: 'Cowboy Ribeye', b: 'Creme Brulee',
    note: "After the cowboy ribeye, the brulee — the rendered cap-fat yields to vanilla-bean custard and torched-sugar crust, berries brightening the close. Strong; the heavy steak finds relief in the silky finish.",
    tier: 'strong' },
  { a: 'Cowboy Ribeye', b: 'Cheesecake',
    note: "The cowboy ribeye closes with the cheesecake — the marbled char-and-fat hands off to dense dairy custard on graham crust, berry compote lifting the close. Works; the table closes heavy, but the dairy reads round against the rendered fat.",
    tier: 'works' },
  { a: 'Cowboy Ribeye', b: 'Beignets',
    note: "After the cowboy ribeye, the beignets — the bold marbled cut yields to warm choux and powdered sugar, the dipping sauce easing the meal home. Works; the table closes light after the heaviest steak.",
    tier: 'works' },
  { a: 'Cowboy Ribeye', b: 'Carrot Cake',
    note: "The cowboy ribeye into the carrot cake — the rendered cap-fat hands off to spiced cake and cream-cheese frosting, walnut crunch on the close. Works; the bold cut and the spiced cake share weight without crowding.",
    tier: 'works' },

  // ── THE TOMAHAWK (36oz theatrical bone-in) ───────────────────────────
  { a: 'The Tomahawk', b: 'Chocolate Cake',
    note: "After the Tomahawk, the chocolate cake — the 36oz long-bone showpiece hands off to layered cocoa-and-ganache, the vanilla scoop closing the table. Excellent; the headline cut earns the layered chocolate close.",
    tier: 'excellent' },
  { a: 'The Tomahawk', b: 'Chocolate Brownie',
    note: "The Tomahawk closes with the warm fudge brownie — the smoky char-and-fat yields to dense cocoa fudge, warm vanilla over the top. Excellent; the showpiece into the canonical chocolate close, the meal lands at full register.",
    tier: 'excellent' },
  { a: 'The Tomahawk', b: 'Peanut Butter Brownie',
    note: "After the Tomahawk, the PB brownie — the 36oz cut yields to peanut-and-chocolate fudge, vanilla ice cream tempering the heat. Strong; the headline steak meets the substantial close.",
    tier: 'strong' },
  { a: 'The Tomahawk', b: 'Mocha Creme',
    note: "The Tomahawk into the mocha creme — the smoky bone-in marbling hands off to silky coffee-chocolate cream, espresso depth closing the table. Strong; the theatrical cut meets the layered dessert.",
    tier: 'strong' },
  { a: 'The Tomahawk', b: 'Creme Brulee',
    note: "After the Tomahawk, the brulee — the 36oz showpiece yields to vanilla-bean custard and torched-sugar crust, berries brightening the close. Strong; the theatrical steak earns the steakhouse classic close.",
    tier: 'strong' },
  { a: 'The Tomahawk', b: 'Cheesecake',
    note: "The Tomahawk closes with the cheesecake — the smoky bone-in marbling hands off to dense cream-cheese custard, graham crust holding the dairy weight. Works; the table closes heavy after the heaviest steak, but it carries.",
    tier: 'works' },
  { a: 'The Tomahawk', b: 'Beignets',
    note: "After the Tomahawk, the beignets — the showpiece cut yields to warm fried choux and powdered sugar, the dipping sauce closing the meal cleanly. Works; the table closes light after the table-defining main.",
    tier: 'works' },
  { a: 'The Tomahawk', b: 'Carrot Cake',
    note: "The Tomahawk into the carrot cake — the smoky bone-in marbling hands off to spiced cake and cream-cheese frosting, walnut crunch on the close. Works; the showpiece cut and the spiced cake share the meal at separate registers.",
    tier: 'works' },

  // ── PORTERHOUSE (dual strip-and-tender T-bone) ───────────────────────
  { a: 'Porterhouse', b: 'Chocolate Cake',
    note: "After the Porterhouse, the chocolate cake — the dual strip-and-tender hands off to layered cocoa-and-ganache, vanilla ice cream framing the close. Strong; the table-share steak meets the canonical chocolate dessert at full register.",
    tier: 'strong' },
  { a: 'Porterhouse', b: 'Chocolate Brownie',
    note: "The Porterhouse closes with the warm fudge brownie — the dual-character cut yields to dense cocoa fudge, warm vanilla scooped over. Strong; both cuts and the warm brownie share the close cleanly.",
    tier: 'strong' },
  { a: 'Porterhouse', b: 'Peanut Butter Brownie',
    note: "After the Porterhouse, the PB brownie — the dual strip-and-tender gives way to peanut-and-chocolate fudge, the vanilla tempering the heat. Strong; the table-share build meets the substantial close.",
    tier: 'strong' },
  { a: 'Porterhouse', b: 'Mocha Creme',
    note: "The Porterhouse into the mocha creme — the strip-and-tender T-bone hands off to silky coffee-chocolate cream, espresso closing the meal. Strong; both cuts share register with the layered dessert.",
    tier: 'strong' },
  { a: 'Porterhouse', b: 'Creme Brulee',
    note: "After the Porterhouse, the brulee — the dual strip-and-tender yields to vanilla-bean custard and torched-sugar crust, berries lifting the close. Strong; the table-share steak meets the steakhouse classic close.",
    tier: 'strong' },
  { a: 'Porterhouse', b: 'Cheesecake',
    note: "The Porterhouse closes with the cheesecake — the dual-character cut hands off to dense dairy custard, graham crust and berry compote framing the close. Works; the meal closes substantial, the dual cuts carrying the dairy weight cleanly.",
    tier: 'works' },
  { a: 'Porterhouse', b: 'Beignets',
    note: "After the Porterhouse, the beignets — the dual strip-and-tender yields to warm choux and powdered sugar, the dipping sauce closing light. Works; the table-share steak hands off to a measured close.",
    tier: 'works' },
  { a: 'Porterhouse', b: 'Carrot Cake',
    note: "The Porterhouse into the carrot cake — the dual strip-and-tender hands off to spiced cake and cream-cheese frosting, walnut crunch on the close. Works; the table-share build and the spice cake share the meal across courses.",
    tier: 'works' },

];

// Load and write
const vm = require('vm');
const ctx = {}; vm.createContext(ctx);
const load = (f, n) => vm.runInContext(fs.readFileSync(path.join(repo, f), 'utf8') + '\nthis.' + n + ' = ' + n + ';', ctx);
load('pairing-notes.js', 'PAIRING_NOTES');

const updates = {};
let changed = 0;
for (const p of PAIRS) {
  const fwd = p.a + '|' + p.b;
  const rev = p.b + '|' + p.a;
  if (ctx.PAIRING_NOTES[fwd] !== p.note) { updates[fwd] = p.note; changed++; }
  if (ctx.PAIRING_NOTES[rev] !== p.note) { updates[rev] = p.note; changed++; }
}

console.log('Steak × dessert backfill:');
console.log('  Pairs defined:    ' + PAIRS.length);
console.log('  Mirror entries:   ' + (PAIRS.length * 2));
console.log('  Notes changed:    ' + changed);

const tierCounts = {};
for (const p of PAIRS) tierCounts[p.tier] = (tierCounts[p.tier] || 0) + 1;
console.log('  Tier distribution:', JSON.stringify(tierCounts));

const lengths = PAIRS.map(p => p.note.split(/\s+/).length);
console.log('  Avg length:       ' + (lengths.reduce((s, n) => s + n, 0) / lengths.length).toFixed(1) + ' words');
console.log('  Min/max length:   ' + Math.min(...lengths) + ' / ' + Math.max(...lengths));

if (changed === 0) { console.log('Nothing to write.'); process.exit(0); }

const merged = Object.assign({}, ctx.PAIRING_NOTES, updates);
const sortedKeys = Object.keys(merged).sort();

const notesPath = path.join(repo, 'pairing-notes.js');
fs.copyFileSync(notesPath, notesPath + '.pre-steak-dessert-backfill.bak');

const header = '// Pairing notes — drink × food and food × food.\n' +
               '// Drink × drink pairs removed: not in engine data model.\n' +
               '// See CLAUDE.md for the editorial preservation rule and FxF generator architecture.\n' +
               'const PAIRING_NOTES = {\n';
const body = sortedKeys.map(k => '  ' + JSON.stringify(k) + ': ' + JSON.stringify(merged[k]) + ',\n').join('');
const footer = '};\n\n' +
  'function getPairingNote(itemName, pairingName) {\n' +
  '  return PAIRING_NOTES[itemName + \'|\' + pairingName] || null;\n' +
  '}\n\n' +
  'if (typeof module !== \'undefined\' && module.exports) {\n' +
  '  module.exports = { PAIRING_NOTES, getPairingNote };\n' +
  '}\n';

fs.writeFileSync(notesPath, header + body + footer);
console.log('Wrote ' + sortedKeys.length + ' keys.');
