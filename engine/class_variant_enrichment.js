// engine/class_variant_enrichment.js
//
// Phase 9 / Session 24 — class-level bridge variant enrichment for the
// 5 highest-uncurated-volume classes. Each existing class-default in
// drink_x_food_generator.js DRINK_CLASS_DEFAULT has 5-6 variants per
// bridge; this module appends 7 new phrases per bridge per class
// (taking each pool to 12-13 total).
//
// Variants are class-level (apply to MANY bottles in the class) but
// still textured — drawing on regional/style anchors that read true
// for the typical entries in each class.
//
// Applied via apply_class_variant_enrichment.js (regex-anchored
// injection at the closing ] of each variant array).

'use strict';

const CLASS_ENRICHMENT = {
  BOURBON_BOLD: {
    bridge1_add: [
      'the cask-aged backbone meets {foodTarget}',
      'the aged-spirit depth threads {foodTarget}',
      'the whiskey-family character composes with {foodTarget}',
      'the matured brown-spirit body wraps {foodTarget}',
      'the barrel-influenced register settles into {foodTarget}',
      'the toasted-oak whiskey body anchors against {foodTarget}',
      'the long-aged grain-and-malt depth carries {foodTarget}',
    ],
    bridge2_add: [
      'the cask-aged warmth plays against {foodSubj}',
      'the dried-fruit-and-spice note frames {foodSubj}',
      'the deep toffee finish underlines {foodSubj}',
      'the oak-and-honey close softens {foodSubj}',
      'the long-finish whiskey depth threads {foodSubj}',
      'the barrel-driven sweetness plays against {foodSubj}',
      'the cocoa-and-tobacco edge frames {foodSubj}',
    ],
  },

  BIG_RED: {
    bridge1_add: [
      'the heavy-extraction body anchors against {foodTarget}',
      'the high-alcohol Cab structure settles into {foodTarget}',
      'the concentrated-fruit grip threads {foodTarget}',
      'the dense-red weight composes with {foodTarget}',
      'the new-oak Cab body wraps {foodTarget}',
      'the powerhouse red register matches {foodTarget}',
      'the muscular-tannin frame meets {foodTarget}',
    ],
    bridge2_add: [
      'the dark-chocolate-and-cassis edge softens {foodSubj}',
      'the cedar-and-graphite finish plays against {foodSubj}',
      'the oak-driven cocoa note underlines {foodSubj}',
      'the tobacco-and-leather close frames {foodSubj}',
      'the heavy-fruit-and-spice register threads {foodSubj}',
      'the iron-and-cassis grip plays against {foodSubj}',
      'the dense black-fruit close softens {foodSubj}',
    ],
  },

  ELEGANT_RED: {
    bridge1_add: [
      'the medium-bodied red carries {foodTarget}',
      'the bright-acidity Pinot body meets {foodTarget}',
      'the cool-climate red register threads {foodTarget}',
      'the food-friendly red-fruit weight composes with {foodTarget}',
      'the silk-tannin elegant body wraps {foodTarget}',
      'the high-acid red-fruit frame anchors against {foodTarget}',
      'the polished medium-red body sits with {foodTarget}',
    ],
    bridge2_add: [
      'the dried-cherry-and-rose close frames {foodSubj}',
      'the forest-floor-and-spice note plays against {foodSubj}',
      'the rhubarb-and-cranberry edge underlines {foodSubj}',
      'the polished red-fruit acidity threads {foodSubj}',
      'the silky cherry-and-pepper finish softens {foodSubj}',
      'the cool-climate brightness plays against {foodSubj}',
      'the elegant earth-and-fruit close frames {foodSubj}',
    ],
  },

  GIN: {
    bridge1_add: [
      'the dry-style gin body meets {foodTarget}',
      'the London-Dry register threads {foodTarget}',
      'the citrus-juniper build wraps {foodTarget}',
      'the contemporary-gin character composes with {foodTarget}',
      'the high-juniper body settles into {foodTarget}',
      'the cucumber-and-coriander botanical anchors against {foodTarget}',
      'the spirit-forward gin character carries {foodTarget}',
    ],
    bridge2_add: [
      'the angelica-and-orris close frames {foodSubj}',
      'the bright-juniper finish plays against {foodSubj}',
      'the spice-and-pepper botanical edge underlines {foodSubj}',
      'the orange-peel-and-cardamom note threads {foodSubj}',
      'the London-Dry crispness softens {foodSubj}',
      'the cucumber-cool finish plays against {foodSubj}',
      'the contemporary-botanical close frames {foodSubj}',
    ],
  },

  TEQUILA_BOLD: {
    bridge1_add: [
      'the highland-agave depth meets {foodTarget}',
      'the añejo-tequila weight settles into {foodTarget}',
      'the extra-añejo aged body wraps {foodTarget}',
      'the reposado-finished register threads {foodTarget}',
      'the oak-rested tequila character composes with {foodTarget}',
      'the cooked-agave-and-cask body anchors against {foodTarget}',
      'the aged-Jalisco depth carries {foodTarget}',
    ],
    bridge2_add: [
      'the cooked-agave-and-honey edge frames {foodSubj}',
      'the dried-fruit-and-spice tequila note underlines {foodSubj}',
      'the bourbon-cask-finished agave close plays against {foodSubj}',
      'the highland-fruit-and-pepper finish softens {foodSubj}',
      'the long-aged caramel-and-pepper threads {foodSubj}',
      'the reposado oak-touched edge frames {foodSubj}',
      'the extra-añejo dried-orange close plays against {foodSubj}',
    ],
  },
};

module.exports = { CLASS_ENRICHMENT };
