// engine/fxf_strong_steak_side_editorial.js
//
// Phase 4 / Session 9 — hand-curated editorial for the 21 side × steak × strong pairs.
// Voice matched to the 6 FxF gold standards (Filet × Mushrooms, Bone-In Filet × Au Gratin,
// KC × Brussels & Belly, Ribeye × Lobster Mac, Tomahawk × Truffle Fries, Porterhouse × Creamed
// Spinach). Each pair gets per-pair reasoning grounded in cut-weight canon (10/14/18/26/36/40 oz),
// kitchen prep (flame-grilled, oven-finished), and the side's defining character.
//
// Structure: { "steak|side": "note text" } — keyed in canonical direction (steak first).
// Mirror sync will copy these into reverse (side|steak) entries automatically.
//
// Target voice: matches gold tier's structural pattern (the {cut} {connective} the {side}
// — body bridge with cut character + side character. Strong; pair-specific closer.) but at
// strong-tier register: composed, defensible, server-ready. No "*" prefix (that's gold-only).
// Avg target word count: 30-38 words.

'use strict';

const FXF_STRONG_STEAK_SIDE = {
  // ── FILET MIGNON (10oz, lean buttery) ────────────────────────────────
  'Filet Mignon|Brussels and Belly':
    "Filet Mignon with Brussels + Belly — the 10oz tenderloin's lean butter meets the maple-glazed pork belly over charred sprouts, the glaze lending the richness the lean cut leaves room for. Strong; the side rounds out the filet's clean register.",

  'Filet Mignon|Creamed Spinach':
    "Filet Mignon alongside the creamed spinach — the 10oz lean cut sits with the bechamel-laced greens, the cream matching the filet's natural butter without crowding it. Strong; reliable, season-after-season order.",

  'Filet Mignon|Sauteed Garlic Spinach':
    "Filet Mignon with the garlic spinach — the 10oz tenderloin meets the wilted garlic-buttered greens cleanly, the garlic anchoring the cut's mild beefy register. Strong; lighter than creamed, just as composed.",

  'Filet Mignon|Asparagus':
    "Filet Mignon with the asparagus — the lean 10oz cut meets the asparagus's tender green-vegetal lift, the spear cutting the filet's butter without competing for weight. Strong; the most refined side on the strong-tier list.",

  // ── BONE-IN FILET (14oz, bone-enhanced) ──────────────────────────────
  'Bone-In Filet|Brussels and Belly':
    "The bone-in filet alongside Brussels + Belly — the 14oz bone-enhanced cut's deeper marrow character meets the maple-pork-belly glaze, sweet-savory richness against bone-deepened beef. Strong; the side reads built for the bone-in version.",

  'Bone-In Filet|Creamed Spinach':
    "The bone-in filet with the creamed spinach — the 14oz bone-deepened butter holds with the rich bechamel-laced greens, the cream complementing the marrow-touched richness. Strong; the call composes without strain.",

  'Bone-In Filet|Sauteed Garlic Spinach':
    "The bone-in filet alongside the garlic spinach — the 14oz bone-enhanced cut meets the wilted garlic-buttered greens, the garlic anchoring the marrow's natural depth. Strong; cleaner option than creamed, equally confident.",

  'Bone-In Filet|Asparagus':
    "The bone-in filet with the asparagus — the 14oz bone-deepened cut meets the asparagus's tender green-vegetal edge, the spear's lift balancing the marrow-touched richness. Strong; the side carries cleanly against the cut.",

  // ── KANSAS CITY (18oz lean-bold strip) ───────────────────────────────
  'Kansas City|Truffle Fries':
    "Kansas City with the truffle fries — the 18oz lean-bold strip's savory grain meets the parmesan-and-truffle fry weight, classic steakhouse plate, both sides hold their weight. Strong; a confident order, no second-guessing.",

  'Kansas City|Creamed Spinach':
    "Kansas City alongside the creamed spinach — the 18oz strip's clean savory grain sits with the bechamel-laced greens, cream balancing the strip's leaner edge. Strong; the side anchors the cut without crowding it.",

  'Kansas City|Sauteed Garlic Spinach':
    "Kansas City with the garlic spinach — the 18oz strip meets the wilted garlic-buttered greens, garlic accenting the strip's beefy register cleanly. Strong; lighter than the creamed pairing, just as honest.",

  // ── COWBOY RIBEYE (26oz marbled cap-and-fat) ─────────────────────────
  'Cowboy Ribeye|Brussels and Belly':
    "Cowboy Ribeye with Brussels + Belly — the 26oz cap-and-fat richness meets the maple-glazed pork belly, the smoke from the grilled cut threading the glaze's sweet edge. Strong; the side mirrors the cut's indulgence note for note.",

  'Cowboy Ribeye|Creamed Spinach':
    "Cowboy Ribeye alongside the creamed spinach — the 26oz marbled char-and-fat holds with the rich bechamel-laced greens, the cream catching the rendered fat without doubling it. Strong; the classic call for the cut.",

  'Cowboy Ribeye|Sauteed Garlic Spinach':
    "The cowboy ribeye with the garlic spinach — the 26oz cap-fat cut sits with the wilted garlic-buttered greens, the garlic cutting through the rendered fat with a clean edge. Strong; the side holds against the cut without crowding.",

  'Cowboy Ribeye|Mushrooms':
    "Cowboy Ribeye with the mushrooms — the 26oz cap-and-fat richness threads the mushrooms' earthy umami weight, char meeting forest-floor in the same register. Strong; the side reads built for the marbled cut.",

  // ── THE TOMAHAWK (36oz long-bone theatrical) ─────────────────────────
  'The Tomahawk|Brussels and Belly':
    "The Tomahawk alongside Brussels + Belly — the 36oz long-bone showpiece's theatrical char meets the maple-glazed pork belly, the bone-in smoke matching the glaze's sweet-savory edge. Strong; the side holds the table's theater.",

  'The Tomahawk|Creamed Spinach':
    "The Tomahawk with the creamed spinach — the 36oz showpiece's theatrical bone-in marbling meets the rich bechamel-laced greens, the cream catching the rendered fat the long-bone delivers. Strong; the side anchors the spectacle.",

  'The Tomahawk|Sauteed Garlic Spinach':
    "The Tomahawk alongside the garlic spinach — the 36oz showpiece meets the wilted garlic-buttered greens, the garlic threading the smoky char without competing. Strong; lighter than creamed, still server-confident.",

  // ── PORTERHOUSE (40oz dual strip-and-filet) ──────────────────────────
  'Porterhouse|Lobster Mac':
    "Porterhouse with the lobster mac — the 40oz dual strip-and-filet meets the shellfish-in-cream indulgence, both courses indulgent, neither outpacing the other. Strong; the side reads steakhouse-classic alongside the cut.",

  'Porterhouse|Brussels and Belly':
    "Porterhouse with Brussels + Belly — the 40oz dual strip-and-filet meets the maple-pork-belly glaze, the strip side carrying the savory and the filet side meeting the sweet. Strong; the dual cut's range matches the side's range.",

  'Porterhouse|Sauteed Garlic Spinach':
    "Porterhouse alongside the garlic spinach — the 40oz dual strip-and-filet meets the wilted garlic-buttered greens, garlic anchoring both the strip's char and the filet's butter. Strong; a confident table-wide order.",
};

module.exports = { FXF_STRONG_STEAK_SIDE };
