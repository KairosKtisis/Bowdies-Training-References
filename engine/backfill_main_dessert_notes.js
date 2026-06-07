// engine/backfill_main_dessert_notes.js
//
// Hand-curated editorial backfill for the 64 MAIN × dessert FxF pairs
// (8 mains × 8 desserts). Companion to backfill_steak_dessert_notes.js —
// finishes the COURSE_TO_DESSERT.works archetype that the v6 audit flagged
// as the engine's weakest cluster.
//
// Voice: matches the AVOID notes and the steak × dessert backfill —
// kitchen-grounded, item-specific, server-deliverable. Mains are generally
// lighter than steaks, so the close-of-meal commentary reads softer.
//
// After this script lands, run engine/mine_food_corpus.js to pull the new
// editorial verdicts and openers into the corpus, then engine/regenerate_
// food_x_food.js to let the generator pick up the refreshed corpus.
//
// Run: node engine/backfill_main_dessert_notes.js

'use strict';
const fs = require('fs');
const path = require('path');
const repo = path.resolve(__dirname, '..');

const PAIRS = [

  // ── ROAST HALF CHICKEN (herbed crisp-skin roast) ─────────────────────────
  { a: 'Roast Half Chicken', b: 'Chocolate Cake',
    note: "After the chicken, the chocolate cake — the herbed crisp-skin roast hands off to layered cocoa-and-ganache, the vanilla scoop tying the close. Works; the comfort-classic main yields to the comfort-classic dessert without strain.",
    tier: 'works' },
  { a: 'Roast Half Chicken', b: 'Chocolate Brownie',
    note: "The chicken closes with the warm fudge brownie — the jus-finished bird gives way to dense cocoa fudge, warm vanilla over the top. Works; the herbed bird and the substantial brownie share the meal cleanly.",
    tier: 'works' },
  { a: 'Roast Half Chicken', b: 'Peanut Butter Brownie',
    note: "After the chicken, the PB brownie — the herb-butter bird yields to peanut-and-chocolate fudge, vanilla ice cream tempering the close. Works; the dessert outweighs the main but the table builds round across courses.",
    tier: 'works' },
  { a: 'Roast Half Chicken', b: 'Mocha Creme',
    note: "The chicken into the mocha creme — the herbed crisp-skin roast hands off to silky coffee-chocolate cream, espresso closing the meal. Strong; the cleaner main earns the layered close.",
    tier: 'strong' },
  { a: 'Roast Half Chicken', b: 'Creme Brulee',
    note: "After the chicken, the brulee — the jus-finished bird yields to vanilla-bean custard and torched-sugar crust, berries lifting the close. Strong; the steakhouse-classic close on the lighter main.",
    tier: 'strong' },
  { a: 'Roast Half Chicken', b: 'Cheesecake',
    note: "The chicken closes with the cheesecake — the herbed roast hands off to dense cream-cheese custard on graham crust, berry compote brightening the close. Works; the meal builds toward sweetness without crowding either course.",
    tier: 'works' },
  { a: 'Roast Half Chicken', b: 'Beignets',
    note: "After the chicken, the beignets — the crisp-skin roast yields to warm choux and powdered sugar, dipping sauce closing light. Works; the table closes easy after a comfort main.",
    tier: 'works' },
  { a: 'Roast Half Chicken', b: 'Carrot Cake',
    note: "The chicken into the carrot cake — the herb-butter bird hands off to spiced cake and cream-cheese frosting, walnut crunch on the close. Strong; the savory-herb main and the spiced cake share register cleanly across the meal.",
    tier: 'strong' },

  // ── FAROE ISLAND SALMON (rich oily flesh, pan-finished) ──────────────────
  { a: 'Faroe Island Salmon', b: 'Chocolate Cake',
    note: "After the salmon, the chocolate cake — the rich oily flesh hands off to layered cocoa-and-ganache, the vanilla scoop softening the close. Works; the oily fish softens before the chocolate weight, the meal builds toward the close.",
    tier: 'works' },
  { a: 'Faroe Island Salmon', b: 'Chocolate Brownie',
    note: "The salmon closes with the warm fudge brownie — the pan-finished Atlantic flesh yields to dense cocoa fudge, warm vanilla over the top. Works; the rich-on-rich close lands substantial, neither course pulling against the other.",
    tier: 'works' },
  { a: 'Faroe Island Salmon', b: 'Peanut Butter Brownie',
    note: "After the salmon, the PB brownie — the oily-rich fish gives way to peanut-and-chocolate fudge, vanilla ice cream tempering the close. Works; the heavy close after a heavy main, both courses share register.",
    tier: 'works' },
  { a: 'Faroe Island Salmon', b: 'Mocha Creme',
    note: "The salmon into the mocha creme — the rich oily flesh hands off to silky coffee-chocolate cream, espresso lifting the close. Strong; the substantial fish earns the layered cream dessert at register.",
    tier: 'strong' },
  { a: 'Faroe Island Salmon', b: 'Creme Brulee',
    note: "After the salmon, the brulee — the oily-rich Faroe yields to vanilla-bean custard and torched-sugar crust, berries lifting the close. Strong; the rich fish meets the silky dessert, the close lands clean.",
    tier: 'strong' },
  { a: 'Faroe Island Salmon', b: 'Cheesecake',
    note: "The salmon closes with the cheesecake — the pan-finished oily flesh hands off to dense dairy custard, graham crust and berry compote framing the close. Works; the meal closes round, the dairy reading thick against the rich fish.",
    tier: 'works' },
  { a: 'Faroe Island Salmon', b: 'Beignets',
    note: "After the salmon, the beignets — the rich oily flesh yields to warm choux and powdered sugar, the dipping sauce closing the meal light. Works; the substantial fish hands off to a measured close.",
    tier: 'works' },
  { a: 'Faroe Island Salmon', b: 'Carrot Cake',
    note: "The salmon into the carrot cake — the pan-finished Atlantic flesh hands off to spiced cake and cream-cheese frosting, walnut crunch on the close. Works; the rich fish and the spice cake share the meal at separate registers.",
    tier: 'works' },

  // ── SWORDFISH (meaty firm steak, grilled) ────────────────────────────────
  { a: 'Swordfish', b: 'Chocolate Cake',
    note: "After the swordfish, the chocolate cake — the meaty grilled steak hands off to layered cocoa-and-ganache, the vanilla scoop closing the meal. Works; the firm fish and the layered chocolate share register cleanly.",
    tier: 'works' },
  { a: 'Swordfish', b: 'Chocolate Brownie',
    note: "The swordfish closes with the warm fudge brownie — the meaty firm steak yields to dense cocoa fudge, warm vanilla over the top. Works; the grilled main and the substantial brownie share weight on the plate.",
    tier: 'works' },
  { a: 'Swordfish', b: 'Peanut Butter Brownie',
    note: "After the swordfish, the PB brownie — the meaty grilled fish gives way to peanut-and-chocolate fudge, vanilla ice cream over the top. Works; the dense dessert outweighs the cleaner main, but the close holds without strain.",
    tier: 'works' },
  { a: 'Swordfish', b: 'Mocha Creme',
    note: "The swordfish into the mocha creme — the meaty steak hands off to silky coffee-chocolate cream, espresso closing the meal. Works; the grilled fish meets the layered close at register.",
    tier: 'works' },
  { a: 'Swordfish', b: 'Creme Brulee',
    note: "After the swordfish, the brulee — the meaty grilled fish yields to vanilla-bean custard and torched-sugar crust, berries lifting the close. Strong; the lemon-bright main and the silky finish read clean across the courses.",
    tier: 'strong' },
  { a: 'Swordfish', b: 'Cheesecake',
    note: "The swordfish closes with the cheesecake — the firm-fish steak hands off to dense cream-cheese custard, graham crust and berry compote framing the close. Works; the dairy weight settles round against the lemon-finished fish.",
    tier: 'works' },
  { a: 'Swordfish', b: 'Beignets',
    note: "After the swordfish, the beignets — the meaty grilled steak yields to warm choux and powdered sugar, the dipping sauce closing the meal light. Works; the table closes easy after the firm main.",
    tier: 'works' },
  { a: 'Swordfish', b: 'Carrot Cake',
    note: "The swordfish into the carrot cake — the meaty grilled steak hands off to spiced cake and cream-cheese frosting, walnut crunch on the close. Works; the lemon-bright fish and the spice cake share separate registers across the meal.",
    tier: 'works' },

  // ── CHILEAN SEABASS (buttery silky flesh, miso/beurre) ──────────────────
  { a: 'Chilean Seabass', b: 'Chocolate Cake',
    note: "After the seabass, the chocolate cake — the butter-rich silky flesh hands off to layered cocoa-and-ganache, the vanilla scoop tying the close. Strong; the indulgent fish earns the layered chocolate dessert at register.",
    tier: 'strong' },
  { a: 'Chilean Seabass', b: 'Chocolate Brownie',
    note: "The seabass closes with the warm fudge brownie — the butter-finished silky fish yields to dense cocoa fudge, warm vanilla over the top. Strong; rich-into-rich, the meal closes the way the table came for.",
    tier: 'strong' },
  { a: 'Chilean Seabass', b: 'Peanut Butter Brownie',
    note: "After the seabass, the PB brownie — the silky-flesh fish gives way to peanut-and-chocolate fudge, vanilla ice cream tempering the close. Works; the rich main hands off to the substantial dessert without strain.",
    tier: 'works' },
  { a: 'Chilean Seabass', b: 'Mocha Creme',
    note: "The seabass into the mocha creme — the butter-rich silky flesh hands off to silky coffee-chocolate cream, espresso depth closing the meal. Strong; cream-on-cream done with intent, the layered close earns the indulgent main.",
    tier: 'strong' },
  { a: 'Chilean Seabass', b: 'Creme Brulee',
    note: "After the seabass, the brulee — the miso-touched butter-rich flesh yields to vanilla-bean custard and torched-sugar crust, berries lifting the close. Strong; the silky main meets the silky finish, the meal arc reads clean.",
    tier: 'strong' },
  { a: 'Chilean Seabass', b: 'Cheesecake',
    note: "The seabass closes with the cheesecake — the butter-finished silky fish hands off to dense dairy custard, berry compote brightening the graham-crust base. Works; the dairy depth reads round against the rich main.",
    tier: 'works' },
  { a: 'Chilean Seabass', b: 'Beignets',
    note: "After the seabass, the beignets — the butter-rich flesh yields to warm choux and powdered sugar, the dipping sauce closing the meal cleanly. Works; the rich main hands off to a measured close, the table breathes.",
    tier: 'works' },
  { a: 'Chilean Seabass', b: 'Carrot Cake',
    note: "The seabass into the carrot cake — the butter-rich silky flesh hands off to spiced cake and cream-cheese frosting, walnut on the close. Works; the indulgent fish and the spiced close share the meal across registers.",
    tier: 'works' },

  // ── TUXEDO-CRUSTED YELLOWFIN TUNA (seared-rare, sesame crust) ───────────
  { a: 'Tuxedo-Crusted Yellowfin Tuna', b: 'Chocolate Cake',
    note: "After the tuna, the chocolate cake — the seared-rare yellowfin yields to layered cocoa-and-ganache, the vanilla scoop closing the meal. Works; the lighter main hands off to the substantial close, the table builds toward sweetness.",
    tier: 'works' },
  { a: 'Tuxedo-Crusted Yellowfin Tuna', b: 'Chocolate Brownie',
    note: "The tuna closes with the warm fudge brownie — the sesame-crusted seared-rare flesh gives way to dense cocoa fudge, warm vanilla over the top. Works; the lighter ocean-clean main into the dense close, the meal builds.",
    tier: 'works' },
  { a: 'Tuxedo-Crusted Yellowfin Tuna', b: 'Peanut Butter Brownie',
    note: "After the tuna, the PB brownie — the rare yellowfin yields to peanut-and-chocolate fudge, vanilla ice cream tempering the close. Works; the close runs heavier than the main called for, but the contrast holds.",
    tier: 'works' },
  { a: 'Tuxedo-Crusted Yellowfin Tuna', b: 'Mocha Creme',
    note: "The tuna into the mocha creme — the sesame crust yields to silky coffee-chocolate cream, espresso closing the meal. Strong; the seared-rare main and the layered cream close share the register cleanly.",
    tier: 'strong' },
  { a: 'Tuxedo-Crusted Yellowfin Tuna', b: 'Creme Brulee',
    note: "After the tuna, the brulee — the seared-rare flesh hands off to vanilla-bean custard and torched-sugar crust, berries lifting the close. Strong; the clean ocean main meets the silky-classic finish, the meal arc lands intact.",
    tier: 'strong' },
  { a: 'Tuxedo-Crusted Yellowfin Tuna', b: 'Cheesecake',
    note: "The tuna closes with the cheesecake — the sesame-crusted yellowfin hands off to dense dairy custard, graham crust and berry compote framing the close. Works; the dairy weight outsizes the lighter main, but it lands cleanly.",
    tier: 'works' },
  { a: 'Tuxedo-Crusted Yellowfin Tuna', b: 'Beignets',
    note: "After the tuna, the beignets — the seared-rare yellowfin yields to warm choux and powdered sugar, the dipping sauce closing light. Strong; the cleaner main and the lighter close share register across the courses.",
    tier: 'strong' },
  { a: 'Tuxedo-Crusted Yellowfin Tuna', b: 'Carrot Cake',
    note: "The tuna into the carrot cake — the seared-rare flesh and sesame crust hand off to spiced cake and cream-cheese frosting, walnut crunch on the close. Works; the cleaner main and the spiced dessert share the meal at separate registers.",
    tier: 'works' },

  // ── RAINBOW TROUT (delicate, pan-finished, lemon-herb) ──────────────────
  { a: 'Rainbow Trout', b: 'Chocolate Cake',
    note: "After the trout, the chocolate cake — the delicate pan-finished flesh yields to layered cocoa-and-ganache, the vanilla scoop softening the close. Works; the close runs heavier than the lighter main called for, but the table builds toward sweetness.",
    tier: 'works' },
  { a: 'Rainbow Trout', b: 'Chocolate Brownie',
    note: "The trout closes with the warm fudge brownie — the delicate flesh gives way to dense cocoa fudge, warm vanilla over the top. Works; the dense close reads against the lighter main, but the meal builds clean.",
    tier: 'works' },
  { a: 'Rainbow Trout', b: 'Peanut Butter Brownie',
    note: "After the trout, the PB brownie — the lemon-finished delicate flesh yields to peanut-and-chocolate fudge, vanilla ice cream tempering the close. Works; the dessert outweighs the main but the meal closes substantial without crowding.",
    tier: 'works' },
  { a: 'Rainbow Trout', b: 'Mocha Creme',
    note: "The trout into the mocha creme — the delicate flesh hands off to silky coffee-chocolate cream, espresso closing the meal. Works; the lighter main and the layered close share register cleanly.",
    tier: 'works' },
  { a: 'Rainbow Trout', b: 'Creme Brulee',
    note: "After the trout, the brulee — the lemon-bright delicate flesh yields to vanilla-bean custard and torched-sugar crust, berries lifting the close. Strong; the lighter main earns the silky-classic finish at register.",
    tier: 'strong' },
  { a: 'Rainbow Trout', b: 'Cheesecake',
    note: "The trout closes with the cheesecake — the delicate pan-finished flesh hands off to dense cream-cheese custard, graham crust and berry compote framing the close. Works; the dairy weight reads thick against the lighter fish, but the meal builds clean.",
    tier: 'works' },
  { a: 'Rainbow Trout', b: 'Beignets',
    note: "After the trout, the beignets — the delicate flesh yields to warm choux and powdered sugar, the dipping sauce closing light. Strong; the lighter main and the light close share register, the meal stays composed.",
    tier: 'strong' },
  { a: 'Rainbow Trout', b: 'Carrot Cake',
    note: "The trout into the carrot cake — the lemon-finished delicate flesh hands off to spiced cake and cream-cheese frosting, walnut crunch on the close. Works; the lighter main yields to the spiced close, the meal arcs cleanly.",
    tier: 'works' },

  // ── MARKET FISH (rotating clean white fish) ─────────────────────────────
  { a: 'Market Fish', b: 'Chocolate Cake',
    note: "After the market fish, the chocolate cake — the kitchen's seasonal white-fish hands off to layered cocoa-and-ganache, the vanilla scoop closing the meal. Works; the cleaner main into the substantial close, the table builds toward the heavier dessert.",
    tier: 'works' },
  { a: 'Market Fish', b: 'Chocolate Brownie',
    note: "The market fish closes with the warm fudge brownie — the rotating clean fish yields to dense cocoa fudge, warm vanilla over the top. Works; the meal closes substantial after the lighter main.",
    tier: 'works' },
  { a: 'Market Fish', b: 'Peanut Butter Brownie',
    note: "After the market fish, the PB brownie — the simply-prepared kitchen pick gives way to peanut-and-chocolate fudge, vanilla scooping over. Works; the close outweighs the cleaner main but the meal builds round.",
    tier: 'works' },
  { a: 'Market Fish', b: 'Mocha Creme',
    note: "The market fish into the mocha creme — the rotating white-fish hands off to silky coffee-chocolate cream, espresso closing the meal. Works; the cleaner main and the layered close share register cleanly.",
    tier: 'works' },
  { a: 'Market Fish', b: 'Creme Brulee',
    note: "After the market fish, the brulee — the kitchen pick yields to vanilla-bean custard and torched-sugar crust, berries lifting the close. Strong; the lighter main meets the silky-classic finish, the meal arc lands clean.",
    tier: 'strong' },
  { a: 'Market Fish', b: 'Cheesecake',
    note: "The market fish closes with the cheesecake — the rotating white-fish hands off to dense cream-cheese custard, graham crust and berry compote framing the close. Works; the dairy weight outsizes the cleaner main, but the meal builds without strain.",
    tier: 'works' },
  { a: 'Market Fish', b: 'Beignets',
    note: "After the market fish, the beignets — the kitchen-driven simple main yields to warm choux and powdered sugar, dipping sauce closing the meal light. Works; the table closes easy after a clean main.",
    tier: 'works' },
  { a: 'Market Fish', b: 'Carrot Cake',
    note: "The market fish into the carrot cake — the rotating white-fish hands off to spiced cake and cream-cheese frosting, walnut on the close. Works; the cleaner main and the spice cake share the meal at different registers.",
    tier: 'works' },

  // ── SALT-CURED HALIBUT (salt-cured, firm flesh) ─────────────────────────
  { a: 'Salt-Cured Halibut', b: 'Chocolate Cake',
    note: "After the halibut, the chocolate cake — the salt-cured firm flesh yields to layered cocoa-and-ganache, the vanilla scoop tying the close. Works; the cured-fish depth and the layered chocolate share the meal cleanly.",
    tier: 'works' },
  { a: 'Salt-Cured Halibut', b: 'Chocolate Brownie',
    note: "The halibut closes with the warm fudge brownie — the salt-cured flesh gives way to dense cocoa fudge, warm vanilla over the top. Works; the cured main and the dense close share weight on the plate.",
    tier: 'works' },
  { a: 'Salt-Cured Halibut', b: 'Peanut Butter Brownie',
    note: "After the halibut, the PB brownie — the firm cured flesh yields to peanut-and-chocolate fudge, vanilla ice cream tempering the close. Works; the dessert outweighs the cleaner main but the meal builds without crowding.",
    tier: 'works' },
  { a: 'Salt-Cured Halibut', b: 'Mocha Creme',
    note: "The halibut into the mocha creme — the salt-cured firm flesh hands off to silky coffee-chocolate cream, espresso depth closing the meal. Works; the cured-fish main and the layered close share register cleanly.",
    tier: 'works' },
  { a: 'Salt-Cured Halibut', b: 'Creme Brulee',
    note: "After the halibut, the brulee — the cured firm flesh yields to vanilla-bean custard and torched-sugar crust, berries lifting the close. Strong; the salt-cured depth meets the silky-classic finish at register.",
    tier: 'strong' },
  { a: 'Salt-Cured Halibut', b: 'Cheesecake',
    note: "The halibut closes with the cheesecake — the salt-cured firm flesh hands off to dense dairy custard, graham crust and berry compote framing the close. Works; the cure meets the dairy weight without strain on the close.",
    tier: 'works' },
  { a: 'Salt-Cured Halibut', b: 'Beignets',
    note: "After the halibut, the beignets — the salt-cured firm flesh yields to warm choux and powdered sugar, dipping sauce closing the meal light. Works; the cure-and-pastry contrast lifts the close cleanly.",
    tier: 'works' },
  { a: 'Salt-Cured Halibut', b: 'Carrot Cake',
    note: "The halibut into the carrot cake — the salt-cured firm flesh hands off to spiced cake and cream-cheese frosting, walnut crunch on the close. Works; the cured main and the spiced dessert share the meal at separate registers.",
    tier: 'works' },

];

// --- Write pass ---------------------------------------------------------

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

console.log('Main × dessert backfill:');
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
fs.copyFileSync(notesPath, notesPath + '.pre-main-dessert-backfill.bak');

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
