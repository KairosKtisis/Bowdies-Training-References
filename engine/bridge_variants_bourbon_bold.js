// engine/bridge_variants_bourbon_bold.js
//
// Phase 7 / Session 21 — bridge1/bridge2 variant expansion for the
// 19 remaining BOURBON_BOLD curated bottles (Session 19 covered the
// other 15 whiskey-family bottles). Same 5-variants-per-bridge pattern
// (4 new + original), each true to the specific distillery / region /
// cask program.

'use strict';

const BRIDGE_VARIANTS = {
  // ── Highland ──────────────────────────────────────────────
  'Glenmorangie 18': {
    bridge1Variants: [
      'the Oloroso-cask depth wraps {foodTarget}',
      'the aged-Glenmorangie sherry-finish body meets {foodTarget}',
      'the 15-years-bourbon-then-Oloroso Glenmorangie carries {foodTarget}',
      'the extra-matured Highland body wraps {foodTarget}',
      'the tallest-stills aged-Glenmorangie depth threads {foodTarget}',
    ],
    bridge2Variants: [
      'the aged-Highland weight frames {foodSubj}',
      'the dried-orange-and-Oloroso edge underlines {foodSubj}',
      'the 18-year Glenmorangie sherry-warmth softens {foodSubj}',
      'the extra-matured honey-and-spice close plays against {foodSubj}',
      'the aged-floral Highland finish frames {foodSubj}',
    ],
  },

  'Oban 14': {
    bridge1Variants: [
      'the coastal salinity meets {foodTarget}',
      'the Western-Highland coastal body wraps {foodTarget}',
      'the Oban-village distillery character carries {foodTarget}',
      'the small-still Oban weight threads {foodTarget}',
      'the maritime-Highland 14-year body meets {foodTarget}',
    ],
    bridge2Variants: [
      'the honey rounds {foodSubj}',
      'the orange-honey-and-sea-salt note underlines {foodSubj}',
      'the gentle-smoke-and-honey finish softens {foodSubj}',
      'the coastal-honey edge plays against {foodSubj}',
      'the Western-Highland honey-spice close frames {foodSubj}',
    ],
  },

  'Oban 18': {
    bridge1Variants: [
      'the coastal-Highland weight wraps {foodTarget}',
      'the aged-Oban maritime body meets {foodTarget}',
      'the 18-year coastal-Highland depth carries {foodTarget}',
      'the small-still aged-Oban weight threads {foodTarget}',
      'the limited-Oban maritime body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the honey-spice edge softens {foodSubj}',
      'the aged honey-and-salt finish underlines {foodSubj}',
      'the 18-year orange-and-smoke close plays against {foodSubj}',
      'the coastal-honey-and-pepper edge frames {foodSubj}',
      'the limited-Oban aged-spice finish softens {foodSubj}',
    ],
  },

  'Dalmore 12': {
    // already done in Session 19 — skip
  },

  // ── Speyside ──────────────────────────────────────────────
  'Macallan 12 Sherry': {
    bridge1Variants: [
      'the sherry-cask depth wraps {foodTarget}',
      'the Macallan-house Oloroso-cask body meets {foodTarget}',
      'the 12-year sherry-matured Macallan carries {foodTarget}',
      'the Spanish-oak Macallan body threads {foodTarget}',
      'the sherry-style Speyside benchmark wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the dried-fruit-and-spice frames {foodSubj}',
      'the Christmas-cake Macallan note underlines {foodSubj}',
      'the Oloroso-cask raisin-and-clove edge softens {foodSubj}',
      'the sherry-led dried-fruit close plays against {foodSubj}',
      'the Spanish-oak spice frames {foodSubj}',
    ],
  },

  'Macallan 18': {
    bridge1Variants: [
      'the aged Oloroso depth wraps {foodTarget}',
      'the 18-year Macallan flagship body meets {foodTarget}',
      'the Spanish-oak Macallan-18 weight carries {foodTarget}',
      'the aged-sherry Macallan benchmark threads {foodTarget}',
      'the collector-tier Macallan 18 body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the dried-fruit-and-spice softens {foodSubj}',
      'the aged Christmas-cake Macallan note underlines {foodSubj}',
      'the 18-year Oloroso-cask warmth plays against {foodSubj}',
      'the deep-sherry dried-fig finish frames {foodSubj}',
      'the polished aged-sherry close softens {foodSubj}',
    ],
  },

  'Glenfiddich 12': {
    bridge1Variants: [
      'the bourbon-cask apple lifts {foodTarget}',
      'the entry-Glenfiddich Speyside body meets {foodTarget}',
      'the William-Grant Speyside flagship carries {foodTarget}',
      'the Robbie-Dhu-Spring water Glenfiddich body threads {foodTarget}',
      'the bourbon-and-sherry Glenfiddich 12 wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the honey rounds {foodSubj}',
      'the pear-and-honey Speyside note underlines {foodSubj}',
      'the gentle-malt honey-and-orchard finish softens {foodSubj}',
      'the entry-Glenfiddich orchard-fruit close plays against {foodSubj}',
      'the soft Speyside honey-edge frames {foodSubj}',
    ],
  },

  'Glenfiddich 18': {
    bridge1Variants: [
      'the aged-Speyside depth wraps {foodTarget}',
      'the 18-year small-batch Glenfiddich body meets {foodTarget}',
      'the small-batch reserve Speyside character carries {foodTarget}',
      'the aged William-Grant Speyside weight threads {foodTarget}',
      'the marrying-tun-finished Glenfiddich body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the sherry-finish frames {foodSubj}',
      'the aged-orchard-and-sherry note underlines {foodSubj}',
      'the 18-year baked-apple-and-Oloroso edge softens {foodSubj}',
      'the small-batch sherry-touched close plays against {foodSubj}',
      'the polished Speyside sherry-warmth frames {foodSubj}',
    ],
  },

  'Glenlivet 12': {
    bridge1Variants: [
      'the bourbon-cask pear lifts {foodTarget}',
      'the Speyside-original Glenlivet body meets {foodTarget}',
      'the Smith-house Speyside flagship carries {foodTarget}',
      'the Josie-Smith founding Glenlivet body threads {foodTarget}',
      'the gentle bourbon-and-sherry Glenlivet 12 wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the honey rounds {foodSubj}',
      'the pear-and-floral Glenlivet note underlines {foodSubj}',
      'the entry-Speyside orchard-fruit edge softens {foodSubj}',
      'the soft-honey founding-Speyside close plays against {foodSubj}',
      'the Smith-house honey-and-pear finish frames {foodSubj}',
    ],
  },

  'Cragganmore 12': {
    bridge1Variants: [
      'the layered malt wraps {foodTarget}',
      'the Cragganmore Classic-Malts body meets {foodTarget}',
      'the small-Speyside-distillery character carries {foodTarget}',
      'the meaty-Cragganmore body threads {foodTarget}',
      'the layered-Speyside Cragganmore body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the fruit lifts {foodSubj}',
      'the dried-fruit-and-meaty-malt note underlines {foodSubj}',
      'the layered Speyside complexity softens {foodSubj}',
      'the Classic-Malts fruit-and-spice close plays against {foodSubj}',
      'the Cragganmore-house dried-orchard edge frames {foodSubj}',
    ],
  },

  'Balvenie 21 Portwood': {
    bridge1Variants: [
      'the port-cask depth wraps {foodTarget}',
      'the 21-year Balvenie Portwood body meets {foodTarget}',
      'the David-Stewart-finished port-cask character carries {foodTarget}',
      'the aged-Speyside port-finish weight threads {foodTarget}',
      'the Balvenie 21 Portuguese-port-cask body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the red-fruit frames {foodSubj}',
      'the port-cask dried-cherry-and-fig note underlines {foodSubj}',
      'the 21-year port-finish dark-fruit edge softens {foodSubj}',
      'the rich Portwood Balvenie close plays against {foodSubj}',
      'the deep red-fruit-and-spice Portwood frames {foodSubj}',
    ],
  },

  'Monkey Shoulder': {
    bridge1Variants: [
      'the blended-malt body sits with {foodTarget}',
      'the triple-malt William-Grant blend meets {foodTarget}',
      'the three-Speyside-malts Monkey Shoulder carries {foodTarget}',
      'the approachable-Speyside blend body wraps {foodTarget}',
      'the cocktail-friendly Monkey Shoulder body threads {foodTarget}',
    ],
    bridge2Variants: [
      'the honey rounds {foodSubj}',
      'the gentle-Speyside honey-and-vanilla note underlines {foodSubj}',
      'the triple-malt soft-honey edge softens {foodSubj}',
      'the approachable-blend orchard-and-honey close plays against {foodSubj}',
      'the William-Grant blended-honey finish frames {foodSubj}',
    ],
  },

  // ── Islay ──────────────────────────────────────────────
  'Lagavulin 8': {
    bridge1Variants: [
      'the peat-smoke meets {foodTarget}',
      'the bicentenary-release Lagavulin body wraps {foodTarget}',
      'the younger-Lagavulin Islay character carries {foodTarget}',
      'the 8-year Lagavulin smoke-and-malt weight threads {foodTarget}',
      'the entry-Lagavulin Islay-smoke body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the saline edge frames {foodSubj}',
      'the maritime-Islay smoke-and-brine note underlines {foodSubj}',
      'the Lagavulin-house peat-and-salt finish softens {foodSubj}',
      'the younger Lagavulin smoke-edge plays against {foodSubj}',
      'the brine-and-peat Islay close frames {foodSubj}',
    ],
  },

  'Laphroaig 10': {
    bridge1Variants: [
      'the peat-smoke meets {foodTarget}',
      'the medicinal-Islay Laphroaig body wraps {foodTarget}',
      'the Royal-Warrant Laphroaig 10 character carries {foodTarget}',
      'the iodine-and-peat Laphroaig body threads {foodTarget}',
      'the southern-Islay 10-year body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the iodine-edge frames {foodSubj}',
      'the medicinal-Laphroaig iodine-and-seaweed note underlines {foodSubj}',
      'the Islay-peat-and-iodine edge softens {foodSubj}',
      'the tar-and-brine Laphroaig close plays against {foodSubj}',
      'the heavy-peat medicinal finish frames {foodSubj}',
    ],
  },

  'Bruichladdich': {
    bridge1Variants: [
      'the unpeated Islay body sits with {foodTarget}',
      'the Bruichladdich Classic-Laddie body meets {foodTarget}',
      'the unpeated Bruichladdich Islay outlier carries {foodTarget}',
      'the Adam-Hannett Bruichladdich body threads {foodTarget}',
      'the malt-forward unpeated Islay body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the malt edge frames {foodSubj}',
      'the clean malt-and-coastal-mineral note underlines {foodSubj}',
      'the unpeated Islay barley-edge softens {foodSubj}',
      'the Classic-Laddie maritime-floral close plays against {foodSubj}',
      'the bright-malt Bruichladdich finish frames {foodSubj}',
    ],
  },

  // ── Japanese ──────────────────────────────────────────────
  'Hibiki Japanese Harmony': {
    bridge1Variants: [
      'the blended-whisky harmony frames {foodTarget}',
      'the Suntory blended-Hibiki body meets {foodTarget}',
      'the multi-distillery Hibiki harmony carries {foodTarget}',
      'the Yamazaki-Hakushu-Chita blend threads {foodTarget}',
      'the Japanese-blended-flagship body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the silky body rounds {foodSubj}',
      'the polished Hibiki silk-and-honey note underlines {foodSubj}',
      'the multi-cask Japanese-blend finish softens {foodSubj}',
      'the Suntory-harmony silk close plays against {foodSubj}',
      'the floral-and-honey Hibiki finish frames {foodSubj}',
    ],
  },

  // ── Irish ──────────────────────────────────────────────
  'Redbreast 21 Year': {
    bridge1Variants: [
      'the aged pot-still depth wraps {foodTarget}',
      'the 21-year Midleton pot-still body meets {foodTarget}',
      'the long-aged single-pot-still Irish carries {foodTarget}',
      'the aged-Redbreast Oloroso-and-bourbon body threads {foodTarget}',
      'the Midleton flagship 21-year body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the sherry-cask spice frames {foodSubj}',
      'the aged-pot-still dried-fruit-and-clove note underlines {foodSubj}',
      'the 21-year Oloroso-cask warmth softens {foodSubj}',
      'the deep Redbreast-21 Christmas-cake close plays against {foodSubj}',
      'the long-aged Irish pot-still spice frames {foodSubj}',
    ],
  },

  'Tullamore D.E.W.': {
    bridge1Variants: [
      'the gentle Irish body sits with {foodTarget}',
      'the triple-distilled triple-cask Tullamore body meets {foodTarget}',
      'the Daniel-E-Williams Irish blend carries {foodTarget}',
      'the bourbon-sherry-rum-cask Tullamore body threads {foodTarget}',
      'the gentle-Irish triple-cask body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the soft malt rounds {foodSubj}',
      'the triple-cask honey-and-grain note underlines {foodSubj}',
      'the soft-Irish-blend finish softens {foodSubj}',
      'the Tullamore triple-distilled close plays against {foodSubj}',
      'the gentle-malt-and-vanilla Irish finish frames {foodSubj}',
    ],
  },

  // ── Canadian ──────────────────────────────────────────────
  'Crown Royal': {
    bridge1Variants: [
      'the Canadian-whisky body sits with {foodTarget}',
      'the Royal-blend Crown body meets {foodTarget}',
      'the Manitoba-distilled Crown Royal carries {foodTarget}',
      'the velvet-Canadian Crown body threads {foodTarget}',
      'the 1939-Royal-Tour blend body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the caramel rounds {foodSubj}',
      'the gentle vanilla-and-caramel Canadian note underlines {foodSubj}',
      'the soft-rye Crown caramel-edge softens {foodSubj}',
      'the velvet Canadian-blend close plays against {foodSubj}',
      'the Crown-house honeyed-caramel finish frames {foodSubj}',
    ],
  },

  'Canadian Club': {
    bridge1Variants: [
      'the Canadian-blend body sits with {foodTarget}',
      'the Hiram-Walker Canadian Club body meets {foodTarget}',
      'the pre-Prohibition Canadian Club character carries {foodTarget}',
      'the workhorse Canadian-blend body threads {foodTarget}',
      'the entry-Canadian-whisky body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the gentle caramel rounds {foodSubj}',
      'the soft-rye-and-corn caramel note underlines {foodSubj}',
      'the Hiram-Walker blended-grain finish softens {foodSubj}',
      'the entry Canadian-whisky caramel-edge plays against {foodSubj}',
      'the workhorse Canadian-blend finish frames {foodSubj}',
    ],
  },
};

// Remove the Dalmore stub (Session 19 covered it)
delete BRIDGE_VARIANTS['Dalmore 12'];

module.exports = { BRIDGE_VARIANTS };
