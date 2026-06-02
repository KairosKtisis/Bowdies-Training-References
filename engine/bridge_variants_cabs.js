// engine/bridge_variants_cabs.js
//
// Phase 7 / Session 20 — bridge1/bridge2 variant expansion for the
// 6 curated BIG_RED Cab bottles. Same pattern as Session 19 whiskey set:
// 5 variants per bridge (4 new + original), each true to the specific
// bottle's character (mountain Cab vs valley-floor, allocation tier,
// estate identity, etc.).
//
// Applied via engine/apply_bridge_variants.js (drop-in, just point to
// this module instead). Corpus sweep uses canonical-sorted-key hash
// to preserve mirror integrity.

'use strict';

const BRIDGE_VARIANTS = {
  'Faust Napa Valley Cabernet': {
    bridge1Variants: [
      'the structured-Cab body wraps {foodTarget}',
      'the Agustin-Huneeus Napa-floor Cab body meets {foodTarget}',
      'the Faust Napa-Cab structure carries {foodTarget}',
      'the polished valley-floor Cab depth wraps {foodTarget}',
      'the Atlas-Peak-sourced Cab weight threads {foodTarget}',
    ],
    bridge2Variants: [
      'the cassis-and-cedar edge frames {foodSubj}',
      'the dark-cassis-and-toasty-oak note underlines {foodSubj}',
      'the polished cedar-and-cassis finish softens {foodSubj}',
      'the cassis-driven Napa close plays against {foodSubj}',
      'the cedar-and-graphite Faust edge frames {foodSubj}',
    ],
  },

  'J. Davies Cabernet Sauvignon': {
    bridge1Variants: [
      'the Diamond-Mountain-Cab body wraps {foodTarget}',
      'the J. Davies mountain-grown Cab structure meets {foodTarget}',
      'the Schramsberg-house Diamond-Mountain Cab carries {foodTarget}',
      'the mountain-fruit Cab weight threads {foodTarget}',
      'the rocky-soil Cab depth wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the mineral edge frames {foodSubj}',
      'the volcanic-soil mineral-edge note underlines {foodSubj}',
      'the Diamond-Mountain rocky-finish frames {foodSubj}',
      'the graphite-and-mineral close plays against {foodSubj}',
      'the mountain-fruit mineral grip frames {foodSubj}',
    ],
  },

  'Spottswoode Lyndenhurst': {
    bridge1Variants: [
      'the structured-Cab depth wraps {foodTarget}',
      'the Spottswoode-estate St. Helena body meets {foodTarget}',
      'the second-label Lyndenhurst structure carries {foodTarget}',
      'the organic-farmed Spottswoode Cab weight threads {foodTarget}',
      'the estate-blended Lyndenhurst body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the cassis frames {foodSubj}',
      'the bright-cassis-and-violet note underlines {foodSubj}',
      'the polished red-fruit-and-cassis finish softens {foodSubj}',
      'the estate-elegant cassis close frames {foodSubj}',
      'the Spottswoode-house cassis edge plays against {foodSubj}',
    ],
  },

  'Nickel & Nickel Cabernet': {
    bridge1Variants: [
      'the concentrated body wraps {foodTarget}',
      'the single-vineyard Far-Niente-family Cab meets {foodTarget}',
      'the Nickel & Nickel vineyard-designate body carries {foodTarget}',
      'the concentrated Oakville-bench Cab weight threads {foodTarget}',
      'the single-site Cab structure wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the cassis-and-oak edge frames {foodSubj}',
      'the dark-cassis-and-American-oak note underlines {foodSubj}',
      'the polished oak-and-cassis Napa finish softens {foodSubj}',
      'the vineyard-designate cassis-and-toast close plays against {foodSubj}',
      'the Nickel-house oak-driven Cab edge frames {foodSubj}',
    ],
  },

  'Cade Cabernet Sauvignon': {
    bridge1Variants: [
      'the Howell-Mountain Cab tannin frames {foodTarget}',
      'the Plumpjack-family Howell-Mountain structure meets {foodTarget}',
      'the high-elevation Cade Cab tannin carries {foodTarget}',
      'the volcanic Howell-Mountain Cab weight threads {foodTarget}',
      'the mountain-fruit Cade body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the cassis grips {foodSubj}',
      'the dense-cassis-and-tannin grip underlines {foodSubj}',
      'the volcanic-soil cassis edge frames {foodSubj}',
      'the Howell-Mountain dark-fruit grip plays against {foodSubj}',
      'the mountain-Cab cassis tension frames {foodSubj}',
    ],
  },

  'Shafer Hillside Select': {
    bridge1Variants: [
      'the allocated-Cab depth wraps {foodTarget}',
      'the Stags-Leap-District flagship body meets {foodTarget}',
      'the Shafer collector-tier Cab carries {foodTarget}',
      'the Hillside-Select hillside-fruit weight threads {foodTarget}',
      'the allocation-list Shafer body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the graphite frames {foodSubj}',
      'the dark-graphite-and-tobacco note underlines {foodSubj}',
      'the Stags-Leap-District graphite edge softens {foodSubj}',
      'the collector-tier graphite-and-cassis close plays against {foodSubj}',
      'the Hillside-Select pencil-lead finish frames {foodSubj}',
    ],
  },
};

module.exports = { BRIDGE_VARIANTS };
