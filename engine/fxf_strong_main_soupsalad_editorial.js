// engine/fxf_strong_main_soupsalad_editorial.js
//
// Phase 4 / Session 11 — hand-curated editorial for 64 main × soup-salad × strong pairs.
// Voice: course-flow framing (soup-salad opener primes palate for the main).
//
// Prep canon (per CLAUDE.md):
//   Chilean Seabass     — buttery, pan-finished
//   Faroe Island Salmon — rich oily, pan-finished
//   Tuxedo-Crusted Tuna — seared rare with sesame crust
//   Swordfish           — meaty steak, pan-finished
//   Salt-Cured Halibut  — cured then pan-finished
//   Rainbow Trout       — delicate flesh, pan-finished
//   Market Fish         — kitchen-driven, varies daily
//   Roast Half Chicken  — roasted with herbed crisp skin
//
// Soup-salad archetypes:
//   cream:  Broccoli Cheddar, Butternut Squash, Creamy Potato, Loaded Potato, Mushroom Bisque, Shrimp Bisque
//   broth:  French Onion, Gumbo, Tomato Basil, Seasonal Soup, Roasted Red Pepper Chickpea, Vegetable Curry
//   greens: House Wedge, Grilled Caesar

'use strict';

const FXF_STRONG_MAIN_SOUPSALAD = {
  // ── FAROE ISLAND SALMON (rich oily, pan-finished) ─────────────────────
  'Faroe Island Salmon|House Wedge':
    "Faroe Island Salmon after the wedge — the iceberg-and-bleu cool crunch refreshes the palate, the salmon following with rich oily flesh that the cold opener cleared room for. Strong; the salad's bite primes the rich fish course.",

  'Faroe Island Salmon|Grilled Caesar':
    "Faroe Island Salmon after the Caesar — the charred-romaine and anchovy edge opens with savory-bright lift, the salmon following with rich oily flesh that the anchovy preceded in the same register. Strong; anchovy into oily fish reads composed.",

  'Faroe Island Salmon|Seasonal Soup':
    "Faroe Island Salmon after the seasonal soup — the kitchen's seasonal bowl opens with rotating warmth, the salmon following with rich oily flesh that the soup's lighter register sets the stage for. Strong; the opener carries cleanly into the main.",

  'Faroe Island Salmon|Creamy Potato':
    "Faroe Island Salmon after the potato soup — the silky leek-and-potato cream opens with quiet richness, the salmon following with rich oily flesh that meets the cream on the same plane. Strong; cream into oil reads indulgent without overlap.",

  'Faroe Island Salmon|Tomato Basil':
    "Faroe Island Salmon after the tomato basil — the bright tomato-basil acid cleans the palate, the salmon following with rich oily flesh that the soup's brightness preceded with intent. Strong; acid primes the oil-rich main.",

  'Faroe Island Salmon|Roasted Red Pepper Chickpea':
    "Faroe Island Salmon after the chickpea soup — the roasted-pepper warmth opens with smoky-sweet lift, the salmon following with rich oily flesh the soup's char preceded in echoing register. Strong; warm opener primes the warm main.",

  'Faroe Island Salmon|Broccoli Cheddar':
    "Faroe Island Salmon after the broccoli cheddar — the cheddar-and-broccoli cream opens with rich-savory weight, the salmon following with oily flesh that meets the cream without crowding. Strong; both courses honor richness in their own register.",

  'Faroe Island Salmon|Butternut Squash':
    "Faroe Island Salmon after the butternut squash — the silky sweet squash cream opens with autumnal warmth, the salmon following with rich oily flesh that the squash's sweetness echoes without doubling. Strong; sweet cream sets the table for oily fish.",

  // ── MARKET FISH (kitchen-driven, rotating) ────────────────────────────
  'Market Fish|House Wedge':
    "Market Fish after the wedge — the iceberg-and-bleu cool crunch refreshes the palate, the kitchen-driven fish following with clean flesh that the cold opener primed. Strong; the salad cleans the table for the rotating main.",

  'Market Fish|Grilled Caesar':
    "Market Fish after the Caesar — the charred-romaine and anchovy edge opens with savory-bright lift, the kitchen-driven fish following with white-fish flesh the anchovy primes cleanly. Strong; the bright opener carries into the fish course.",

  'Market Fish|Seasonal Soup':
    "Market Fish after the seasonal soup — the kitchen's rotating bowl opens with house warmth, the market fish following in its own rotating register. Strong; two house picks composed in sequence.",

  'Market Fish|Creamy Potato':
    "Market Fish after the potato soup — the silky leek-and-potato cream opens with quiet richness, the kitchen-driven fish following with white-fish flesh that the cream cleaned the palate for. Strong; the cream cushions the rotating main.",

  'Market Fish|Tomato Basil':
    "Market Fish after the tomato basil — the bright tomato-basil acid cleans the palate, the kitchen-driven fish following with white-fish flesh that the acid set up cleanly. Strong; acid into clean fish reads timeless.",

  'Market Fish|Roasted Red Pepper Chickpea':
    "Market Fish after the chickpea soup — the roasted-pepper warmth opens with smoky-sweet lift, the kitchen-driven fish following with clean flesh the soup's spice frames without crowding. Strong; warm opener sets the rotating main.",

  'Market Fish|Broccoli Cheddar':
    "Market Fish after the broccoli cheddar — the cheddar-and-broccoli cream opens with rich-savory weight, the kitchen-driven fish following with white-fish flesh the cream gave the palate room for. Strong; the cream cleans for the fish.",

  'Market Fish|Butternut Squash':
    "Market Fish after the butternut squash — the silky sweet squash cream opens with autumnal warmth, the kitchen-driven fish following with clean flesh the squash's sweetness primes without doubling. Strong; sweet cream sets the table for the rotating main.",

  // ── TUXEDO-CRUSTED YELLOWFIN TUNA (seared rare with sesame) ───────────
  'Tuxedo-Crusted Yellowfin Tuna|House Wedge':
    "Tuxedo-Crusted Yellowfin Tuna after the wedge — the iceberg-and-bleu cool crunch refreshes the palate, the tuna following with seared-rare flesh and sesame crust that the cold opener primed. Strong; cold salad into seared-rare main reads composed.",

  'Tuxedo-Crusted Yellowfin Tuna|Grilled Caesar':
    "Tuxedo-Crusted Yellowfin Tuna after the Caesar — the charred-romaine and anchovy edge opens with savory-bright lift, the tuna following with seared-rare flesh and sesame crust the anchovy primed cleanly. Strong; the savory opener sets up the seared main.",

  'Tuxedo-Crusted Yellowfin Tuna|Seasonal Soup':
    "Tuxedo-Crusted Yellowfin Tuna after the seasonal soup — the kitchen's rotating bowl opens with house warmth, the tuna following with seared-rare flesh and sesame crust. Strong; the warm opener primes the seared-rare main.",

  'Tuxedo-Crusted Yellowfin Tuna|Creamy Potato':
    "Tuxedo-Crusted Yellowfin Tuna after the potato soup — the silky leek-and-potato cream opens with quiet richness, the tuna following with seared-rare flesh that the cream primed for. Strong; cream into seared-rare reads refined.",

  'Tuxedo-Crusted Yellowfin Tuna|Tomato Basil':
    "Tuxedo-Crusted Yellowfin Tuna after the tomato basil — the bright tomato-basil acid cleans the palate, the tuna following with seared-rare flesh and sesame crust the acid sharpened the palate for. Strong; acid into seared crust reads composed.",

  'Tuxedo-Crusted Yellowfin Tuna|Roasted Red Pepper Chickpea':
    "Tuxedo-Crusted Yellowfin Tuna after the chickpea soup — the roasted-pepper warmth opens with smoky-sweet lift, the tuna following with seared-rare flesh and sesame crust that the soup's char echoes cleanly. Strong; warm char into seared char reads composed.",

  'Tuxedo-Crusted Yellowfin Tuna|Broccoli Cheddar':
    "Tuxedo-Crusted Yellowfin Tuna after the broccoli cheddar — the cheddar-and-broccoli cream opens with rich-savory weight, the tuna following with seared-rare flesh and sesame crust the cream primed cleanly. Strong; cream cleans for the seared-rare main.",

  'Tuxedo-Crusted Yellowfin Tuna|Butternut Squash':
    "Tuxedo-Crusted Yellowfin Tuna after the butternut squash — the silky sweet squash cream opens with autumnal warmth, the tuna following with seared-rare flesh and sesame crust the squash's sweetness primes cleanly. Strong; sweet cream sets up the seared-rare main.",

  // ── SALT-CURED HALIBUT (cured then pan-finished) ──────────────────────
  'Salt-Cured Halibut|House Wedge':
    "Salt-Cured Halibut after the wedge — the iceberg-and-bleu cool crunch refreshes the palate, the halibut following with firm salt-cured flesh that the cold opener primed cleanly. Strong; the salad's bite carries into the cured main.",

  'Salt-Cured Halibut|Grilled Caesar':
    "Salt-Cured Halibut after the Caesar — the charred-romaine and anchovy edge opens with savory-bright lift, the halibut following with firm salt-cured flesh the anchovy preceded in the same brine-saline register. Strong; salt into salt reads coherent.",

  'Salt-Cured Halibut|Seasonal Soup':
    "Salt-Cured Halibut after the seasonal soup — the kitchen's rotating bowl opens with house warmth, the halibut following with firm salt-cured flesh that the soup's lighter register set up. Strong; the opener primes the cured main.",

  'Salt-Cured Halibut|Creamy Potato':
    "Salt-Cured Halibut after the potato soup — the silky leek-and-potato cream opens with quiet richness, the halibut following with firm cured flesh that the cream cleaned the palate for. Strong; cream into cured fish reads classic.",

  'Salt-Cured Halibut|Tomato Basil':
    "Salt-Cured Halibut after the tomato basil — the bright tomato-basil acid cleans the palate, the halibut following with firm salt-cured flesh that the acid primed cleanly. Strong; acid into cured fish reads composed.",

  'Salt-Cured Halibut|Roasted Red Pepper Chickpea':
    "Salt-Cured Halibut after the chickpea soup — the roasted-pepper warmth opens with smoky-sweet lift, the halibut following with firm salt-cured flesh the soup's spice primed without crowding. Strong; warm spice into cured fish reads layered.",

  'Salt-Cured Halibut|Broccoli Cheddar':
    "Salt-Cured Halibut after the broccoli cheddar — the cheddar-and-broccoli cream opens with rich-savory weight, the halibut following with firm cured flesh the cream gave room for. Strong; cream cleans for the cured main.",

  'Salt-Cured Halibut|Butternut Squash':
    "Salt-Cured Halibut after the butternut squash — the silky sweet squash cream opens with autumnal warmth, the halibut following with firm cured flesh the squash's sweetness primes the salt-cure to land on. Strong; sweet into salt reads composed.",

  // ── SWORDFISH (meaty pan-finished steak) ──────────────────────────────
  'Swordfish|House Wedge':
    "Swordfish after the wedge — the iceberg-and-bleu cool crunch refreshes the palate, the swordfish following with meaty pan-finished steak that the cold opener primed cleanly. Strong; the salad cleans for the dense fish course.",

  'Swordfish|Grilled Caesar':
    "Swordfish after the Caesar — the charred-romaine and anchovy edge opens with savory-bright lift, the swordfish following with meaty pan-finished steak the anchovy preceded in the same savory register. Strong; the bright opener primes the meaty main.",

  'Swordfish|Seasonal Soup':
    "Swordfish after the seasonal soup — the kitchen's rotating bowl opens with house warmth, the swordfish following with meaty pan-finished steak in its own register. Strong; the opener composes cleanly with the dense main.",

  'Swordfish|Creamy Potato':
    "Swordfish after the potato soup — the silky leek-and-potato cream opens with quiet richness, the swordfish following with meaty pan-finished steak that the cream primed without crowding. Strong; cream into dense fish reads composed.",

  'Swordfish|Tomato Basil':
    "Swordfish after the tomato basil — the bright tomato-basil acid cleans the palate, the swordfish following with meaty pan-finished steak the acid sharpened the palate for. Strong; acid into the dense fish reads classic.",

  'Swordfish|Roasted Red Pepper Chickpea':
    "Swordfish after the chickpea soup — the roasted-pepper warmth opens with smoky-sweet lift, the swordfish following with meaty pan-finished steak the soup's char primed cleanly. Strong; warm into meaty reads composed.",

  'Swordfish|Broccoli Cheddar':
    "Swordfish after the broccoli cheddar — the cheddar-and-broccoli cream opens with rich-savory weight, the swordfish following with meaty pan-finished steak the cream primed without overlap. Strong; the cream sets the table for the dense main.",

  'Swordfish|Butternut Squash':
    "Swordfish after the butternut squash — the silky sweet squash cream opens with autumnal warmth, the swordfish following with meaty pan-finished steak that the squash's sweetness primes the savory main to land on. Strong; sweet cream into dense fish reads layered.",

  // ── CHILEAN SEABASS (buttery, pan-finished) ───────────────────────────
  'Chilean Seabass|House Wedge':
    "Chilean Seabass after the wedge — the iceberg-and-bleu cool crunch refreshes the palate, the seabass following with buttery pan-finished flesh that the cold opener gave room for. Strong; the salad cleans the table for the rich main.",

  'Chilean Seabass|Grilled Caesar':
    "Chilean Seabass after the Caesar — the charred-romaine and anchovy edge opens with savory-bright lift, the seabass following with buttery pan-finished flesh the anchovy primed cleanly. Strong; bright opener into rich fish reads classic.",

  'Chilean Seabass|Seasonal Soup':
    "Chilean Seabass after the seasonal soup — the kitchen's rotating bowl opens with house warmth, the seabass following with buttery pan-finished flesh the soup primed without crowding. Strong; the opener carries into the rich main.",

  'Chilean Seabass|Creamy Potato':
    "Chilean Seabass after the potato soup — the silky leek-and-potato cream opens with quiet richness, the seabass following with buttery pan-finished flesh that the cream complements on the same plane. Strong; cream into butter reads indulgent.",

  'Chilean Seabass|Tomato Basil':
    "Chilean Seabass after the tomato basil — the bright tomato-basil acid cleans the palate, the seabass following with buttery pan-finished flesh the acid sharpened the palate to receive. Strong; acid primes the rich main.",

  'Chilean Seabass|Roasted Red Pepper Chickpea':
    "Chilean Seabass after the chickpea soup — the roasted-pepper warmth opens with smoky-sweet lift, the seabass following with buttery pan-finished flesh the soup's spice primed without crowding. Strong; warm spice into buttery fish reads layered.",

  'Chilean Seabass|Broccoli Cheddar':
    "Chilean Seabass after the broccoli cheddar — the cheddar-and-broccoli cream opens with rich-savory weight, the seabass following with buttery pan-finished flesh that meets the cream in matching register. Strong; cream into butter reads doubled in the right key.",

  'Chilean Seabass|Butternut Squash':
    "Chilean Seabass after the butternut squash — the silky sweet squash cream opens with autumnal warmth, the seabass following with buttery pan-finished flesh that the squash's sweetness primes for the richness to land on. Strong; sweet cream sets up the buttery main.",

  // ── RAINBOW TROUT (delicate, pan-finished) ────────────────────────────
  'Rainbow Trout|House Wedge':
    "Rainbow Trout after the wedge — the iceberg-and-bleu cool crunch refreshes the palate, the trout following with delicate pan-finished flesh that the cold opener gave clean room for. Strong; the salad cleans for the gentle main.",

  'Rainbow Trout|Grilled Caesar':
    "Rainbow Trout after the Caesar — the charred-romaine and anchovy edge opens with savory-bright lift, the trout following with delicate pan-finished flesh that the anchovy primed cleanly. Strong; bright opener into delicate fish reads classic.",

  'Rainbow Trout|Seasonal Soup':
    "Rainbow Trout after the seasonal soup — the kitchen's rotating bowl opens with house warmth, the trout following with delicate pan-finished flesh that the soup's lighter register set up. Strong; the opener composes cleanly with the gentle main.",

  'Rainbow Trout|Creamy Potato':
    "Rainbow Trout after the potato soup — the silky leek-and-potato cream opens with quiet richness, the trout following with delicate pan-finished flesh the cream cushioned the palate for. Strong; cream into delicate reads gentle.",

  'Rainbow Trout|Tomato Basil':
    "Rainbow Trout after the tomato basil — the bright tomato-basil acid cleans the palate, the trout following with delicate pan-finished flesh that the acid sharpened the palate to receive without bruising. Strong; bright opener into delicate main reads composed.",

  'Rainbow Trout|Roasted Red Pepper Chickpea':
    "Rainbow Trout after the chickpea soup — the roasted-pepper warmth opens with smoky-sweet lift, the trout following with delicate pan-finished flesh that the soup's spice didn't crowd. Strong; gentle opener into gentle main with warmth between.",

  'Rainbow Trout|Broccoli Cheddar':
    "Rainbow Trout after the broccoli cheddar — the cheddar-and-broccoli cream opens with rich-savory weight, the trout following with delicate pan-finished flesh the cream gave the palate room for. Strong; the cream cushions for the gentle main.",

  'Rainbow Trout|Butternut Squash':
    "Rainbow Trout after the butternut squash — the silky sweet squash cream opens with autumnal warmth, the trout following with delicate pan-finished flesh that the squash's sweetness primes without crowding. Strong; sweet cream sets up the gentle main.",

  // ── ROAST HALF CHICKEN (roasted with herbed crisp skin) ───────────────
  'Roast Half Chicken|House Wedge':
    "Roast Half Chicken after the wedge — the iceberg-and-bleu cool crunch refreshes the palate, the chicken following with herbed crisp-skin roast that the cold opener primed cleanly. Strong; the salad cleans for the warm bird.",

  'Roast Half Chicken|Grilled Caesar':
    "Roast Half Chicken after the Caesar — the charred-romaine and anchovy edge opens with savory-bright lift, the chicken following with herbed crisp-skin roast the anchovy preceded in matching savory register. Strong; the bright opener primes the herbed bird.",

  'Roast Half Chicken|Seasonal Soup':
    "Roast Half Chicken after the seasonal soup — the kitchen's rotating bowl opens with house warmth, the chicken following with herbed crisp-skin roast in its own warm register. Strong; warm opener carries cleanly into warm main.",

  'Roast Half Chicken|Creamy Potato':
    "Roast Half Chicken after the potato soup — the silky leek-and-potato cream opens with quiet richness, the chicken following with herbed crisp-skin roast the cream complements without doubling. Strong; cream into roast reads classic comfort.",

  'Roast Half Chicken|Tomato Basil':
    "Roast Half Chicken after the tomato basil — the bright tomato-basil acid cleans the palate, the chicken following with herbed crisp-skin roast that the acid sharpened the palate to receive. Strong; acid into roast reads bright and clean.",

  'Roast Half Chicken|Roasted Red Pepper Chickpea':
    "Roast Half Chicken after the chickpea soup — the roasted-pepper warmth opens with smoky-sweet lift, the chicken following with herbed crisp-skin roast the soup's char primed in matching register. Strong; roast into roast reads coherent.",

  'Roast Half Chicken|Broccoli Cheddar':
    "Roast Half Chicken after the broccoli cheddar — the cheddar-and-broccoli cream opens with rich-savory weight, the chicken following with herbed crisp-skin roast the cream primed without crowding. Strong; cream into roast reads classic.",

  'Roast Half Chicken|Butternut Squash':
    "Roast Half Chicken after the butternut squash — the silky sweet squash cream opens with autumnal warmth, the chicken following with herbed crisp-skin roast that the squash's sweetness echoes cleanly. Strong; autumn into autumn reads complete.",
};

module.exports = { FXF_STRONG_MAIN_SOUPSALAD };
