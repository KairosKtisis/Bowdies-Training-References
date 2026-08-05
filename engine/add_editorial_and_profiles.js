// add_editorial_and_profiles.js — curated bottle profiles (3) + editorial gold notes (22)
// for the 2026-08-05 wine additions. Editorial goes in BEFORE templated backfill
// so the backfill skips these pairs (editorial is never overwritten by regens).
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const REPO = path.resolve(__dirname, '..');

// ---- 1. curated bottle profiles ----
const PROFILES = {
  "Ceretto Moscato d'Asti": {
    tastingNotes: ["gently sweet frizzante", "stopped-fermentation Moscato", "5.5% lightness"],
    character: "gently sweet frizzante Moscato at 5.5%",
    bridge1: "the honeyed peach-and-melon sweetness meets {foodTarget}",
    bridge2: "the gentle bubbles lift {foodSubj}",
    bridge1Variants: [
      "the honeyed peach-and-melon sweetness meets {foodTarget}",
      "the arrested-fermentation grape sweetness carries {foodTarget}",
      "the soft frizzante mousse rinses {foodTarget}",
      "the orange-blossom-and-jasmine lift threads {foodTarget}",
      "the low-alcohol Moscato lightness floats over {foodTarget}"
    ],
    bridge2Variants: [
      "the gentle bubbles lift {foodSubj}",
      "the honeyed finish rounds {foodSubj}",
      "the Santo-Stefano-Belbo peach note frames {foodSubj}",
      "the delicate fizz refreshes {foodSubj}",
      "the sweet-but-weightless register flatters {foodSubj}"
    ]
  },
  "Tenuta Tascante Ghiaia Nera": {
    tastingNotes: ["volcanic Etna Nerello", "smoky black-gravel minerality", "fine soft tannin"],
    character: "volcanic Etna Nerello with smoky fine-tannin elegance",
    bridge1: "the ash-and-cherry volcanic register meets {foodTarget}",
    bridge2: "the fine-tannin Etna finish frames {foodSubj}",
    bridge1Variants: [
      "the ash-and-cherry volcanic register meets {foodTarget}",
      "the north-slope 600-meter freshness lifts {foodTarget}",
      "the black-gravel minerality threads {foodTarget}",
      "the orange-peel-and-dried-flower lift carries {foodTarget}",
      "the volcanic-Pinot elegance wraps {foodTarget}"
    ],
    bridge2Variants: [
      "the fine-tannin Etna finish frames {foodSubj}",
      "the smoky mineral edge underlines {foodSubj}",
      "the bright cherry core refreshes {foodSubj}",
      "the Etna-north-face restraint flatters {foodSubj}",
      "the volcanic smoke reads alongside {foodSubj}"
    ]
  },
  "Domaine des Ardoisières Silice": {
    tastingNotes: ["chillable Alpine red", "10.5% mountain lightness", "biodynamic terrace fruit"],
    character: "chillable 10.5% Alpine Mondeuse blend",
    bridge1: "the wild-strawberry-and-pepper brightness meets {foodTarget}",
    bridge2: "the lightly chilled Alpine lift refreshes {foodSubj}",
    bridge1Variants: [
      "the wild-strawberry-and-pepper brightness meets {foodTarget}",
      "the 10.5% mountain lightness floats over {foodTarget}",
      "the crunchy redcurrant fruit threads {foodTarget}",
      "the peppery Mondeuse spice carries {foodTarget}",
      "the rescued-terrace Alpine energy lifts {foodTarget}"
    ],
    bridge2Variants: [
      "the lightly chilled Alpine lift refreshes {foodSubj}",
      "the stony mountain finish frames {foodSubj}",
      "the violet-and-white-pepper edge underlines {foodSubj}",
      "the low-alcohol freshness resets {foodSubj}",
      "the biodynamic mountain-fruit purity flatters {foodSubj}"
    ]
  }
};

let bp = fs.readFileSync(path.join(__dirname, 'bottle_profiles_curated.js'), 'utf8');
const bpAnchor = bp.indexOf('const BOTTLE_PROFILES_CURATED = {');
if (bpAnchor === -1) throw new Error('profiles anchor not found');
const insertAt = bp.indexOf('{', bpAnchor) + 1;
const bpLines = Object.entries(PROFILES).map(([k, v]) =>
  '\n  // Wine list update 2026-08-05\n  ' + JSON.stringify(k) + ': ' + JSON.stringify(v, null, 2).split('\n').join('\n  ') + ',');
bp = bp.slice(0, insertAt) + bpLines.join('') + bp.slice(insertAt);
fs.writeFileSync(path.join(__dirname, 'bottle_profiles_curated.js'), bp);
delete require.cache[require.resolve('./bottle_profiles_curated')];
const check = require('./bottle_profiles_curated').BOTTLE_PROFILES_CURATED;
if (!check["Ceretto Moscato d'Asti"]) throw new Error('profile insert failed');
console.log('[ok] curated profiles:', Object.keys(check).length);

// ---- 2. editorial gold notes (22 pairs, mirror-keyed = 44 entries) ----
const EDITORIAL = {
  "Ceretto Moscato d'Asti|Creme Brulee": "Santo Stefano Belbo Moscato — sweet melon, orange blossom, jasmine, gentle frizzante at 5.5%. The arrested-fermentation sweetness meets the burnt-sugar crust head-on while the soft bubbles rinse the custard's weight. Gold standard; the dessert-course pour that outsells the dessert.",
  "Ceretto Moscato d'Asti|Cheesecake": "Ceretto's Moscato keeps its natural grape sugar — melon, jasmine, ripe pear over a gentle fizz. Sweetness against tangy density, bubbles against graham crust: the cheesecake pairing that needs no explaining. Gold standard; pour it and watch.",
  "Calçada Reserva Vinho Verde|Seafood Tower": "Reserva-tier Vinho Verde — citrus, green apple, light florals, bracing gastronomic acidity at 11.5%. Built like a raw-bar wine: the acid does the mignonette's job and the low alcohol keeps the tower long. Gold standard; the table-share opener's natural partner.",
  "Lubanzi Chenin Blanc|Roast Half Chicken": "Dry-farmed Swartland Chenin — apple, pear, lemon confit, honeyed roundness over stone. Chenin and roast chicken is the Loire's oldest handshake; the herbed crisp skin meets the honey note and the acid resets each bite. Gold standard; the chicken call.",
  "Maison du Chancelier Les Mosnières|Seared Scallops": "Côte de Beaune Chardonnay from a single stony plot — white flowers, creamy lees, discreet oak. The caramelized sear finds the cream; the limestone cut finds the sweetness. White Burgundy and scallops is the textbook — this is the page. Gold standard; the scallop pour.",
  "Maison du Chancelier Les Mosnières|Lobster Mac": "White Burgundy against the richest side on the menu — creamy lees texture rides the truffle cream while the mineral spine keeps the manchego in check. Lobster and Chardonnay, the classic, upgraded to Beaune. Gold standard; rich-on-rich done right.",
  "Painted Fields Curse of Knowledge|Kansas City": "Sierra Foothills Cab off high-elevation granite — black cherry, dried violet, cocoa, velvet tannin from a Napa cult-Cab consulting bench. The KC's leaner, beefier frame wants exactly this: dark fruit with a mineral edge and no excess weight. Gold standard; the by-the-glass Cab for the strip.",
  "Painted Fields Curse of Knowledge|Filet Mignon": "Velvety granite-grown Cabernet — black cherry and cocoa with fine, polished tannin. The filet's clean tenderness takes polish over power; the wine adds the dark-fruit depth the lean cut doesn't carry itself. Gold standard; a by-the-glass pour that drinks like a list-middle bottle.",
  "Soul of Mendocino|Kansas City": "Old-vine Mendocino field blend — black plum, bramble berry, dark compote, savory spice on a velvet frame. The zin-led fruit meets the KC's savory grain; eighty-year-old Carignane brings the earth. Gold standard; the heritage-vine call for the strip.",
  "Soul of Mendocino|Cowboy Ribeye": "Zinfandel, Petite Sirah, Grenache, and Carignane off vines up to eighty years old — inky, velvety, brambly-rich. The ribeye's rendered fat wants exactly this much fruit and this much grip. Gold standard; field-blend soul against the richest marbling on the menu.",
  "Tenuta dei Sette Cieli Yantra|Kansas City": "High-elevation Bolgheri-coast Cabernet and Merlot — wild blackberry, preserved cherry, mocha, brambly earth with unusual freshness. The KC's beefier profile meets Tuscan structure; the 400-meter lift keeps it from sitting heavy. Gold standard; the Super Tuscan route to the strip.",
  "Tenuta dei Sette Cieli Yantra|Filet Mignon": "A baby Super Tuscan with mountain freshness — blackberry and cherry over soft ripe tannins, six months in French oak. Merlot rounds the filet's lean frame; the altitude acidity keeps the plate lively. Gold standard; elegant structure for the tender cut.",
  "Tenuta Tascante Ghiaia Nera|Roast Half Chicken": "Etna Nerello off black volcanic gravel at 600 meters — cherry, orange peel, dried flowers, smoky minerality on fine tannins. Drinks like volcanic Pinot: the herbed crisp skin picks up the smoke, the bright cherry lifts the roast. Gold standard; the somm move on the chicken.",
  "Tenuta Tascante Ghiaia Nera|Mushrooms": "Volcanic Sicilian red — ash-and-cherry minerality with a fine-tannin finish. Escargot-butter mushrooms are umami on umami; the Etna smoke reads like the pan. Gold standard; earth meets lava.",
  "Domaine des Ardoisières Silice|Faroe Island Salmon": "Biodynamic Alpine red at 10.5% — wild strawberry, redcurrant, white pepper, violet, stony finish. Serve it lightly chilled against the salmon's rich oily flesh and it behaves like fine cru Beaujolais: lift, not weight. Gold standard; the chilled-red salmon play.",
  "Domaine des Ardoisières Silice|Roast Half Chicken": "Mondeuse with Pinot Noir and Gamay off rescued mountain terraces — crunchy red fruit, white pepper, Alpine freshness. Light chill, crisp skin, peppery lift: a pairing that converts red-wine skeptics to Savoie. Gold standard; the adventurous chicken pour.",
  "Michel Goubard Mont Avril|Roast Half Chicken": "Côte Chalonnaise Pinot from a family farming Saint-Désert since the 1600s — red cherry, raspberry, violet, earthy spice. Burgundy and roast bird is the region's own table; Mont Avril's south-facing fruit keeps it generous. Gold standard; the value-Burgundy chicken call.",
  "Michel Goubard Mont Avril|Escargot": "Village Burgundy against Burgundy's own dish — earthy Pinot spice into garlic-herb butter, bright cherry against the richness. The regional pairing served at its source price. Gold standard; escargot's oldest friend.",
  "Sanford Pinot Noir|Filet Mignon": "Sta. Rita Hills Pinot with fruit from the appellation's founding 1971 vineyard — black plum, tart cranberry, bay leaf, forest floor with structured acid. The filet takes Pinot elegance over Cab power; the wine's spine holds the steak course. Gold standard; history in the glass beside the tenderloin.",
  "Sanford Pinot Noir|Faroe Island Salmon": "Structured Sta. Rita Hills Pinot — black plum and cranberry with mace and forest floor. Cool-climate acidity against rich oily flesh is the salmon's best red; the Sanford & Benedict fruit in the blend brings the pedigree. Gold standard; the coastal-Pinot salmon match.",
  "Lubanzi Chenin Blanc|Crab Cake": "Swartland Chenin's stony minerality and lemon-confit lift against jumbo lump sweetness — the honeyed mid-palate matches the crab, the acid handles the romesco's parmesan richness. Gold standard adjacent; filed under excellent for the rotation.",
  "Calçada Reserva Vinho Verde|Shrimp Cocktail": "Vinho Verde's citrus snap against chilled shrimp and horseradish heat — the 11.5% lightness and green-apple acidity reset the cocktail sauce between bites. Excellent; the raw-bar warm-up pour."
};
// NOTE: last two are excellent-tier editorial (not gold) — verdict labels match their tiers.

const NOTES_FILE = path.join(REPO, 'pairing-notes.js');
const src = fs.readFileSync(NOTES_FILE, 'utf8');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(src + '\nthis.P = PAIRING_NOTES;', ctx);
for (const k of Object.keys(EDITORIAL)) {
  if (ctx.P[k]) throw new Error('key already exists: ' + k);
}
const startIdx = src.indexOf('const PAIRING_NOTES = {');
let depth = 0, endIdx = -1, inStr = null;
for (let i = src.indexOf('{', startIdx); i < src.length; i++) {
  const c = src[i], p = src[i - 1];
  if (inStr) { if (c === inStr && p !== '\\') inStr = null; continue; }
  if (c === '"') { inStr = c; continue; }
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { endIdx = i; break; } }
}
const esc = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const lines = [];
for (const [k, v] of Object.entries(EDITORIAL)) {
  const [a, b] = k.split('|');
  lines.push('  "' + esc(k) + '": "' + esc(v) + '",');
  lines.push('  "' + esc(b + '|' + a) + '": "' + esc(v) + '",');
}
const out = src.slice(0, endIdx) + '\n' + lines.join('\n') + '\n' + src.slice(endIdx);
const s2 = {}; vm.createContext(s2);
vm.runInContext(out + '\nthis.P = PAIRING_NOTES;', s2);
const oldN = Object.keys(ctx.P).length, newN = Object.keys(s2.P).length;
if (newN !== oldN + Object.keys(EDITORIAL).length * 2) throw new Error('editorial key math wrong: ' + oldN + ' -> ' + newN);
fs.writeFileSync(NOTES_FILE, out);
console.log('[ok] editorial notes: ' + oldN + ' -> ' + newN + ' keys (+' + Object.keys(EDITORIAL).length * 2 + ')');
