# Plan — Wire the 6 New Cocktails into Set the Stage

**Date:** 2026-06-11 · **Status:** awaiting approval before any engine edit
**Scope:** Paper Plane, Last Word, Oaxaca Old Fashioned, Naked & Famous, Penicillin, Jungle Bird

---

## How Set the Stage actually works (audit result)

Set the Stage reads exactly two files at runtime: `pairing-map-v2.js` (the tier arrays) and `pairing-notes.js` (the written explanations). Everything else — profiles, taxonomy, generators — is build-time only.

For a cocktail to appear with full pairings, it needs:

1. **A taxonomy classification.** Each drink name is hand-registered in `engine/pairing_engine_taxonomy.js` → `DRINK_CLASS_OVERRIDES` as either `COCKTAIL_BOLD` or `COCKTAIL_LIGHT`. Cocktails have *no* automatic fallback — an unregistered cocktail returns `null` and fails the health check. (Note: CLAUDE.md references a `class_drinks.json`; it doesn't exist in this repo — the override table is the real mechanism.)

2. **A pairing-map entry** in `pairing-map-v2.js`: `name`, `category: "cocktail"`, a `profile` tag array, and five tier arrays — `gold`, `excellent`, `strong`, `works`, `avoid`. **Every cocktail rates all 56 menu foods**, distributed across excellent/strong/works/avoid, with `gold` a hand-picked subset of `excellent`. (Negroni: gold 1, excellent 6, strong 13, works 22, avoid 15 → 56 unique foods.)

3. **Per-pair notes** in `pairing-notes.js`, keyed `"Cocktail|Food"` and mirrored `"Food|Cocktail"`. ~112 keys per cocktail (56 foods × 2 directions). Cocktails have **zero** drink×drink notes — drink×drink was pruned, so we only need drink×food.

**The load-bearing finding:** there is **no script that invents tiers or bootstraps notes for a brand-new entity.** Tiers are authored by hand. The existing `regenerate_dxf_*` scripts only *rewrite* notes for pairs that already have keys — they can't create them. So the work splits cleanly into **authoring** (tiers) and **generation** (notes via a small new seed script).

**What's optional:** an `enriched-profiles.js` entry (only its `axes` block is consumed — it sets the drink's weight/intensity so notes read correctly) and a `bottle_profiles_curated.js` entry (sharpens voice). Without them, the generator falls back to the class-default voice and still produces valid notes. `voice-data.js` / `entity-character.js` are not needed by the engine.

---

## The real work: 336 tier decisions

The substance here isn't code — it's **6 cocktails × 56 foods = 336 pairing-tier judgments**, plus 6 gold-subset picks. This is the same sommelier-grade authoring the existing 24 cocktails got. Notes are then generated mechanically from those tiers.

My proposed approach: **I draft all 336 tier assignments** using each cocktail's flavor profile, its class, the CLAUDE.md ingredient/cooking canon, and the tiering of the closest existing cocktail as a template — then **you review the draft** (a compact 6-column table, one row per food) before I generate a single note. Nothing touches `pairing-notes.js` until you've signed off on the tiers.

Anchor logic per cocktail (draft rationale, yours to override):

- **Paper Plane** (COCKTAIL_LIGHT) — bittersweet citrus, shaken. Template: bright aperitivo-sours. Excellent with tartare/charcuterie/fattier starters; avoid delicate raw seafood and most desserts.
- **Last Word** (COCKTAIL_LIGHT) — herbal/bright gin. Template: Bee's Knees / French 75 register. Excellent with seafood starters, scallops, crab; cautious on big steaks.
- **Naked & Famous** (COCKTAIL_LIGHT) — smoky mezcal sour. Template: Paper Plane but smokier. Bridges to grilled sides and lighter grill items.
- **Jungle Bird** (COCKTAIL_LIGHT) — tropical bittersweet rum. Template: the lone tropical lane. Seafood, crab, salmon; avoid heavy red-meat and rich desserts.
- **Oaxaca Old Fashioned** (COCKTAIL_BOLD) — smoky agave, spirit-forward, OF register. Template: Bowdie's Old Fashioned / Sazerac. Gold/excellent on the grill — Tomahawk, Cowboy, belly.
- **Penicillin** (COCKTAIL_BOLD) — smoky honey-ginger scotch. Template: smoky-bold whiskey. Excellent with grilled steaks, mushrooms, and dark-chocolate dessert (the one cocktail that crosses into dessert well).

---

## Execution sequence (only after tier sign-off)

1. **Back up** `pairing-notes.js` and `pairing-map-v2.js` → dated `.bak` (per SESSION_NOTES protocol), Windows-side verified.
2. **Read-only baseline:** `engine_health_check.js`, `engine_snapshot_test.js`, `engine_fxf_snapshot.js` — capture clean state.
3. **Taxonomy:** add 6 names to `DRINK_CLASS_OVERRIDES`.
4. **Map:** add 6 entries (profile + approved tier arrays) to `pairing-map-v2.js`.
5. **Profiles:** add 6 `enriched-profiles.js` entries (axes from the recipes) for note quality.
6. **Health check:** confirm 0 unclassified drinks (the gate) before generating notes.
7. **Seed notes:** write `engine/seed_dxf_notes_for_new_cocktails.js` (modeled on the existing `backfill_*_notes.js` create-missing-key pattern): for each cocktail × each food in its tiers, call `drink_x_food_generator.generate(drink, food, tier, ctx)` and write both `Cocktail|Food` and `Food|Cocktail`. ~672 new keys total.
8. **Mirror + audit:** `sync_mirrors`, then `audit_tier_note_mismatches.js` — verify each note's verdict label matches its map tier.
9. **Re-validate:** `engine_health_check.js`; then `engine_snapshot_test.js --update` to lock the intended additions (adding entities legitimately shifts deterministic anchors). FxF untouched.
10. **Spot-check in UI:** confirm each cocktail resolves in Set the Stage search and renders all five tiers with notes.

## Footprint & safety

- `pairing-notes.js` is 16.4 MB / 51,242 entries — adding ~672 keys (~+0.25 MB). The existing 51K notes and all editorial are **untouched**; this is purely additive.
- Large-file write truncation is a known failure mode (SESSION_NOTES "Failure Mode 2" + our mount-staleness note) — every write gets a pre-write `.bak` and a post-write line-count verification, Windows-side as source of truth.
- Fully reversible: restore the two `.bak` files and revert the taxonomy/profile edits.

## Decisions I need from you

1. **Classifications** — OK with the BOLD/LIGHT split above, or adjust any?
2. **Tier authoring** — want me to draft all 336 tier assignments for your review, or will you hand me the tiers?
3. **Note style** — engine-templated notes (matches ~28% of the current corpus, consistent and fast) for launch, with the option to deepen specific pairings into hand-written editorial later — good?
