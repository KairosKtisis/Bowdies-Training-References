// engine/louis_xiii_lifts.js (Phase 6 / Session 15)
// Hand-curated lifts for the 3 weakest Louis XIII pair-notes.
// Voice matched to the EXCELLENT-tier register: cites bottle facts
// (1,200+ eaux-de-vie, 40-100yr Grande Champagne, Baccarat decanter,
// ~$4,000/bottle), explains tier placement, recommends alternative
// bottles for the same dish.

'use strict';

const LOUIS_XIII_LIFTS = {
  // Was: "Louis XIII with mushrooms — 1,200-eaux-de-vie cognac against earthy umami.
  //       Strong; the mushrooms' earth-depth engages Louis XIII's aged complexity at
  //       reverent register."
  'Louis XIII Cognac|Mushrooms':
    "Louis XIII with the mushrooms — Rémy Martin luxury icon, 1,200+ eaux-de-vie aged 40-100 years, Grande Champagne only, Baccarat decanter (~$4,000/bottle). Strong; mushrooms' earthy umami depth is one of the rare side flavors intense enough to engage Louis XIII at reverent register — the truffle fries and bone marrow remain the canonical side calls, but mushrooms hold their own without wasting the pour.",

  // Was: templated "Louis XIII Cognac's luxury-icon cognac depth leans against the
  //       chocolate cake's layered chocolate body: the prestige-blend weight carries
  //       the chocolate cake, and the caramel rounds the dessert. Works; ..."
  'Louis XIII Cognac|Chocolate Cake':
    "Louis XIII with the chocolate cake — Grande Champagne luxury icon, 40-100 year eaux-de-vie, Baccarat-decanter craft against layered chocolate weight. Works; the cake is rich enough to receive the bottle but the chocolate brownie remains the canonical Louis XIII dessert pairing — chocolate cake is a Rémy XO or Hennessy Paradis tier dish, save Louis XIII for the brownie or for a separate sipping moment.",

  // Was: templated "Louis XIII Cognac's luxury-icon cognac depth sits alongside the
  //       mocha creme's coffee-chocolate richness: the icon-cognac register elevates
  //       the mocha creme, and the polished oak softens the dessert. Works; ..."
  'Louis XIII Cognac|Mocha Creme':
    "Louis XIII with the mocha creme — 1,200-eaux-de-vie Grande Champagne against coffee-chocolate custard. Works; the mocha's coffee-and-cocoa register has the depth to share the pour, but the dessert lands at Pierre Ferrand or Hennessy XO tier — Louis XIII's 40-100 year complexity is over-specified for a custard. Better at the close, alone, or with the chocolate brownie which earns it.",
};

module.exports = { LOUIS_XIII_LIFTS };
