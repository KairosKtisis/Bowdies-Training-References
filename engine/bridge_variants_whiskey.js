// engine/bridge_variants_whiskey.js
//
// Phase 7 / Session 19 — bridge1/bridge2 variant expansion for the 15
// whiskey-set bottles whose current bridges appear in the live corpus.
// Each bottle gets 4 variants per bridge (5 phrases including original),
// hand-written to stay true to that bottle's specific character.
//
// Applied via merge into engine/bottle_profiles_curated.js (the generator
// already reads bridge1Variants / bridge2Variants when present —
// LIGHT_SPIRIT_VOICE_DEFAULTS established this pattern in Phase 5).

'use strict';

const BRIDGE_VARIANTS = {
  'Toki Suntory Japanese Whisky': {
    bridge1Variants: [
      'the entry Suntory body sits with {foodTarget}',
      'the light Toki blend lifts {foodTarget}',
      'the Suntory entry-level body brightens {foodTarget}',
      'the gentle Japanese-whisky register meets {foodTarget}',
      'the entry-tier Suntory grain composes with {foodTarget}',
    ],
    bridge2Variants: [
      'the citrus lifts {foodSubj}',
      'the green-citrus edge frames {foodSubj}',
      'the entry-Toki brightness underlines {foodSubj}',
      'the soft-citrus finish softens {foodSubj}',
      'the Japanese-blend lift plays against {foodSubj}',
    ],
  },

  'Redbreast 12 Year': {
    bridge1Variants: [
      'the pot-still depth wraps {foodTarget}',
      'the single-pot-still Irish weight meets {foodTarget}',
      'the Redbreast 12 sherry-cask body carries {foodTarget}',
      'the pure-pot-still register wraps {foodTarget}',
      'the Midleton pot-still depth threads {foodTarget}',
    ],
    bridge2Variants: [
      'the sherry-cask spice frames {foodSubj}',
      'the Oloroso-cask warmth underlines {foodSubj}',
      'the pot-still spice brightens {foodSubj}',
      'the Christmas-cake notes play against {foodSubj}',
      'the dried-fruit-and-spice edge frames {foodSubj}',
    ],
  },

  'Hakushu 12 Year': {
    bridge1Variants: [
      'the lightly-peated Hakushu meets {foodTarget}',
      'the Forest-Distillery green-smoke lifts {foodTarget}',
      'the Suntory "Forest Distillery" character wraps {foodTarget}',
      'the gentle-peat Hakushu body carries {foodTarget}',
      'the Yamanashi-mountain whisky lift meets {foodTarget}',
    ],
    bridge2Variants: [
      'the forest-floor frames {foodSubj}',
      'the green-smoke edge softens {foodSubj}',
      'the gentle-peat finish underlines {foodSubj}',
      'the pine-needle-and-grass note plays against {foodSubj}',
      'the Forest-Distillery brightness frames {foodSubj}',
    ],
  },

  'Yamazaki 12 Year': {
    bridge1Variants: [
      'the Japanese-whisky precision frames {foodTarget}',
      'the Suntory flagship register meets {foodTarget}',
      'the Yamazaki house-style body wraps {foodTarget}',
      'the precision-distilled Japanese body carries {foodTarget}',
      'the silky-flagship Yamazaki lift meets {foodTarget}',
    ],
    bridge2Variants: [
      'the silky body rounds {foodSubj}',
      'the honey-orchid finish softens {foodSubj}',
      'the polished Japanese-whisky note underlines {foodSubj}',
      'the silk-and-honey close plays against {foodSubj}',
      'the precision-finished register frames {foodSubj}',
    ],
  },

  'Yamazaki 18 Year': {
    bridge1Variants: [
      'the mizunara-cask depth wraps {foodTarget}',
      'the aged Japanese-mizunara body meets {foodTarget}',
      'the Yamazaki-18 collector register carries {foodTarget}',
      'the aged-flagship mizunara depth threads {foodTarget}',
      'the rare Japanese-mizunara weight wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the silky precision frames {foodSubj}',
      'the mizunara-cask incense underlines {foodSubj}',
      'the sandalwood-spice mizunara note frames {foodSubj}',
      'the aged-Suntory polish softens {foodSubj}',
      'the collector-tier silk plays against {foodSubj}',
    ],
  },

  'Jameson Irish Whiskey': {
    bridge1Variants: [
      'the triple-distilled softness sits with {foodTarget}',
      'the Jameson blend body wraps {foodTarget}',
      'the classic Irish-blend smoothness meets {foodTarget}',
      'the workhorse-Irish register carries {foodTarget}',
      'the gentle triple-distilled body composes with {foodTarget}',
    ],
    bridge2Variants: [
      'the malt rounds {foodSubj}',
      'the smooth-Irish finish softens {foodSubj}',
      'the entry-Jameson brightness underlines {foodSubj}',
      'the soft-malt-and-grain note plays against {foodSubj}',
      'the blended-Irish gentleness frames {foodSubj}',
    ],
  },

  'Macallan Estate': {
    bridge1Variants: [
      'the estate depth wraps {foodTarget}',
      'the Macallan-Estate house style meets {foodTarget}',
      'the distillery-grown estate register carries {foodTarget}',
      'the estate-character Speyside body threads {foodTarget}',
      'the family-distillery Macallan depth wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the sherry-cask weight frames {foodSubj}',
      'the estate-driven sherry-influence underlines {foodSubj}',
      'the Macallan-house dried-fruit note plays against {foodSubj}',
      'the estate-cask warmth softens {foodSubj}',
      'the distillery-story sherry-finish frames {foodSubj}',
    ],
  },

  'Balvenie 12 American Oak': {
    bridge1Variants: [
      'the bourbon-cask vanilla settles into {foodTarget}',
      'the American-oak Speyside body meets {foodTarget}',
      'the Balvenie 12 American-oak warmth carries {foodTarget}',
      'the bourbon-finished honey body wraps {foodTarget}',
      'the American-cask Speyside lift threads {foodTarget}',
    ],
    bridge2Variants: [
      'the honey rounds {foodSubj}',
      'the American-oak vanilla underlines {foodSubj}',
      'the entry-Speyside honey edge softens {foodSubj}',
      'the bourbon-cask sweetness plays against {foodSubj}',
      'the gentle-vanilla Balvenie finish frames {foodSubj}',
    ],
  },

  'Balvenie 14 Caribbean Cask': {
    bridge1Variants: [
      'the rum-cask depth meets {foodTarget}',
      'the Caribbean-rum-finished body wraps {foodTarget}',
      'the rum-finished Speyside character carries {foodTarget}',
      'the tropical-rum-cask Balvenie lifts {foodTarget}',
      'the Caribbean-finish Speyside weight threads {foodTarget}',
    ],
    bridge2Variants: [
      'the caramel rounds {foodSubj}',
      'the rum-finish brown-sugar note underlines {foodSubj}',
      'the tropical-cask sweetness softens {foodSubj}',
      'the Caribbean-rum-finish edge plays against {foodSubj}',
      'the rum-touched caramel frames {foodSubj}',
    ],
  },

  'Pierre Ferrand Cognac': {
    bridge1Variants: [
      'the artisan-cognac depth wraps {foodTarget}',
      'the Pierre-Ferrand small-house body meets {foodTarget}',
      'the craft-cognac orange-peel character carries {foodTarget}',
      'the Grande-Champagne artisan body threads {foodTarget}',
      'the Pierre-Ferrand floral-cognac depth wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the orange-peel frames {foodSubj}',
      'the floral-cognac edge softens {foodSubj}',
      'the candied-orange Pierre-Ferrand note underlines {foodSubj}',
      'the honeyed-floral cognac finish plays against {foodSubj}',
      'the orange-and-honey artisan edge frames {foodSubj}',
    ],
  },

  'The Manhattan': {
    bridge1Variants: [
      'the rye-vermouth body settles into {foodTarget}',
      'the classic Manhattan build meets {foodTarget}',
      'the rye-and-sweet-vermouth weight carries {foodTarget}',
      'the stirred whiskey-cocktail body wraps {foodTarget}',
      'the bourbon-or-rye Manhattan register threads {foodTarget}',
    ],
    bridge2Variants: [
      'the cherry-bitters edge frames {foodSubj}',
      'the Angostura-and-cherry note underlines {foodSubj}',
      'the bitter-cherry finish softens {foodSubj}',
      'the orange-bitters edge plays against {foodSubj}',
      'the stirred-cocktail close frames {foodSubj}',
    ],
  },

  'Glenmorangie 10': {
    bridge1Variants: [
      'the bourbon-cask vanilla settles into {foodTarget}',
      'the tallest-stills Highland body meets {foodTarget}',
      'the Glenmorangie 10 ex-bourbon character carries {foodTarget}',
      'the gentle-Highland bourbon-cask lift wraps {foodTarget}',
      'the entry-Glenmorangie honey-floral body threads {foodTarget}',
    ],
    bridge2Variants: [
      'the honey-floral lifts {foodSubj}',
      'the honeysuckle-and-vanilla note underlines {foodSubj}',
      'the gentle-Highland brightness softens {foodSubj}',
      'the bourbon-cask floral edge plays against {foodSubj}',
      'the soft-honey Glenmorangie finish frames {foodSubj}',
    ],
  },

  'Dalmore 12': {
    bridge1Variants: [
      'the sherry-cask depth wraps {foodTarget}',
      'the Dalmore Highland Matusalem-cask body meets {foodTarget}',
      'the sherry-finished Highland weight carries {foodTarget}',
      'the orange-and-Oloroso Dalmore body threads {foodTarget}',
      'the Highland sherry-finished character wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the orange-and-chocolate plays against {foodSubj}',
      'the orange-marmalade-and-cocoa note frames {foodSubj}',
      'the Matusalem-cask chocolate edge softens {foodSubj}',
      'the candied-orange-and-coffee finish underlines {foodSubj}',
      'the sherry-touched bittersweet finish plays against {foodSubj}',
    ],
  },

  'Aberlour 16': {
    bridge1Variants: [
      'the bourbon-plus-sherry depth wraps {foodTarget}',
      'the double-matured Aberlour body meets {foodTarget}',
      'the Aberlour 16 double-cask weight carries {foodTarget}',
      'the dual-matured Speyside register threads {foodTarget}',
      'the bourbon-and-Oloroso Aberlour body wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the balanced sweetness frames {foodSubj}',
      'the double-cask honey-and-spice note underlines {foodSubj}',
      'the dual-matured balance softens {foodSubj}',
      'the sherry-touched Speyside warmth plays against {foodSubj}',
      'the bourbon-leaning sherry-balance frames {foodSubj}',
    ],
  },

  'Bowmore 12': {
    bridge1Variants: [
      'the lighter peat meets {foodTarget}',
      'the entry-Bowmore Islay-light body wraps {foodTarget}',
      'the gentle-Islay peat character carries {foodTarget}',
      'the Bowmore 12 lighter-smoke body threads {foodTarget}',
      'the maritime-Islay lighter-peat register wraps {foodTarget}',
    ],
    bridge2Variants: [
      'the sea-salt frames {foodSubj}',
      'the maritime-salt edge underlines {foodSubj}',
      'the coastal-Islay note softens {foodSubj}',
      'the gentle-smoke-and-brine finish plays against {foodSubj}',
      'the lighter-peat-and-citrus close frames {foodSubj}',
    ],
  },
};

module.exports = { BRIDGE_VARIANTS };
