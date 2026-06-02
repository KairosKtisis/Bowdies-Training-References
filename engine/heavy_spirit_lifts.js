// engine/heavy_spirit_lifts.js (Phase 6 / Session 16)
// Hand-curated lifts for 5 HEAVY_SPIRIT excellent-tier pairs that fell
// short of sommelier-grade word count (~40w target). Voice matches the
// bottle's existing canonical character entry (Myers's = molasses-heavy
// Jamaican Diageo, Jung and Wulff Trinidad = column-still refined caramel,
// Ron Zacapa = Solera 23 Andean-aged honey-vanilla).

'use strict';

const HEAVY_SPIRIT_LIFTS = {
  // Was 16w: "Bone Marrow: umami fat meets Myers's. Excellent; the molasses-heavy
  //           profile handles marrow's umami at workhorse register."
  "Myers's Rum|Bone Marrow":
    "Myers's Rum with bone marrow — Jamaican dark rum, Diageo's molasses-heavy workhorse, deep brown-sugar register against umami fat. Excellent; the molasses-forward Jamaican profile carries marrow's beefy unctuousness — a workhorse pour that gives the starter its rum-tier pairing without reaching for Ron Zacapa or Doctor Bird's higher-register price point.",

  // Was 18w: "Carrot Cake: cream cheese and cinnamon meet Myers's. Excellent; the
  //           molasses-dark character threads carrot-cake spice at Diageo-workhorse
  //           register."
  "Myers's Rum|Carrot Cake":
    "Myers's Rum with carrot cake — Jamaican dark rum's molasses register threads cream cheese and cinnamon. Excellent; the dark-molasses-and-spice profile finds carrot cake's raisin-and-cinnamon spine without overspecifying the dessert — Myers's lands the rum-cake-pairing at workhorse register, leaving Ron Zacapa or Doctor Bird for chocolate-tier desserts.",

  // Was 22w: "Cheesecake: custard-dairy dessert meets Myers's. Excellent; the Jamaican
  //           dark-rum molasses profile frames the cream at workhorse register."
  "Myers's Rum|Cheesecake":
    "Myers's Rum with cheesecake — Jamaican dark-rum molasses profile against custard-dairy weight. Excellent; the molasses-forward Diageo workhorse threads cheesecake's cream without crowding the custard — a confident rum-dessert call at workhorse register, leaving the higher-tier Ron Zacapa or Doctor Bird for more dimensional dessert pairings.",

  // Was 21w: "Carrot Cake: cream cheese and cinnamon meet Jung and Wulff Trinidad.
  //           Excellent; the refined-caramel character threads carrot-cake spice at
  //           column-still register."
  "Jung and Wulff Trinidad|Carrot Cake":
    "Jung and Wulff Trinidad with carrot cake — Angostura's column-still Trinidad rum, refined medium-character with caramel and moderate ester. Excellent; the polished caramel-and-spice register threads carrot cake's raisin-and-cinnamon line without the wild hogo of Doctor Bird — Trinidad's column-still polish reads as the right tier for cream-cheese-frosted spice cake.",

  // Was 19w: "Cheesecake: custard-dairy dessert meets Ron Zacapa. Excellent; the
  //           honey-vanilla-solera character threads the cheesecake's creamy custard."
  "Ron Zacapa Rum|Cheesecake":
    "Ron Zacapa Rum with cheesecake — Guatemalan Solera 23, Andean-aged premium-sipping rum, honey-vanilla-caramel register against custard-dairy weight. Excellent; the Solera-honey character threads cheesecake's cream and the polished aged sweetness elevates the custard without overpowering — a confident luxury-rum call on a classic dessert.",
};

module.exports = { HEAVY_SPIRIT_LIFTS };
