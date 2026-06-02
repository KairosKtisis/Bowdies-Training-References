# SESSION_NOTES.md — Pairing Engine Quality Lift

> **Read this first at the start of every session.** Modeled on the LivInv
> NOTES.md convention. State carries across sessions; this file is the single
> source of truth for "where are we" between sittings.

---

## Current status

**Phase:** 9 ✅ **COMPLETE** (Sessions 24-25: all 18 classes enriched + Raventós key fix + remaining templated audited)
**Last session:** 2026-06-02 — Session 25 (Phase 9 closer — 13 remaining classes enriched + Raventós key fix)
**Last action:** Per Gabe's correction ("diminishing returns is poor reasoning for a
project specifically outlined as 'making the engine as good as possible'"), continued
Phase 9 enrichment for the remaining 13 classes. Wrote `engine/class_variant_enrichment_s25.js`
with 182 new phrases (7 b1 + 7 b2 × 13 classes): COGNAC, COGNAC_LUXURY, SPARKLING,
WHITE_WINE, VODKA, COCKTAIL_BOLD, COCKTAIL_LIGHT, SWEET_LIQUEUR, APERITIVO_BITTER,
SWEET_WINE, MEZCAL, HEAVY_SPIRIT, LIGHT_SPIRIT. Each variant is class-broad but
textured (Charente-region cognac, column-still cognac, Italian-amaro, Oaxaca-distilled
mezcal, palenque-distilled, traditional-method Champagne, blanc-de-blancs, autolytic-
aged sparkling, late-harvest Sauternes, noble-rot Sauternes, vintage Port, tawny Port,
appassimento style, navy-strength rum, molasses-rich, etc.). All 18 classes now sit
at 13-14 b1 / 13 b2 variants. Also fixed Raventós key mismatch (BOTTLE_PROFILES_CURATED
was keyed under "Rose Brut" but canonical entity name is "Rosé Brut" with é — sed-
renamed the key, now the Session 22 variants flow correctly). Audited the 33 still-
templated notes (66 with mirror) — confirmed they're well-written using enriched class
phrasing; "templated" is structural pattern-match, not quality judgment. Regen ran:
8 templated DxF notes shifted. Mirror sync 0 desync. Health 9/9 PASS. Tier audit
2,522/2,522. Snapshots relocked at new state.
**Phase 9 cumulative:** **252 new class-level variant phrases** across all 18 classes,
pools deepened from 5-6 → 13-14 per bridge. Class-level enrichment is forward-investment
that compounds on every future regen, new-bottle add, or AVOID-tier expansion.
**Engine state — final:** 251 (= 250 + 1 Raventós-related) DxF anchors locked, 24 FxF
anchors locked, all factual canons clean, all health checks PASS. Total Phase 7+9 hand-
written variant phrases: 496 (per-bottle) + 252 (class-level) = **748 variants** added
to the corpus's generative capacity.
**Next session start:** **Session 26** — engine cleanly at Phase 9 close. Options:
- **A:** Phase 10 — write `engine/AUDIT_v9_2026-06-02.md` covering Phase 9 deliverables +
  pre-floor-deployment confidence report (random 50-pair top-to-bottom sample across tiers
  and classes, plus an explicit "ready for staff training" statement)
- **B:** Begin building Cornerstone v2 — the polished staff portal (policies, position
  expectations, operations standards) on top of the pairing reference

## Old current status (preserved for context)

**Phase:** 9 — class-level variant enrichment (Session 24: top 5 classes enriched ✅)
**Last session:** 2026-06-02 — Session 24 (Phase 9 open — BOURBON_BOLD/BIG_RED/ELEGANT_RED/GIN/TEQUILA_BOLD enriched 5-6→13-14 variants/bridge)
**Last action:** Pre-audit revealed 389 uncurated entities across 19 drink classes. Found
that DRINK_CLASS_DEFAULT in `drink_x_food_generator.js` already had 5-6 bridge variants
per class (infrastructure was in place from earlier work) — Phase 9 work is enrichment,
not greenfield. Wrote `engine/class_variant_enrichment.js` with 70 new phrases (7 b1 +
7 b2 per class × 5 classes). Built `apply_class_variant_enrichment.js` with regex-anchored
injection into DRINK_CLASS_DEFAULT entries. Targeted top 5 by uncurated volume:
**BOURBON_BOLD (132 uncurated, 5→14 b1 / 5→13 b2)**,
**BIG_RED (53, 6→14 / 5→13)**, **ELEGANT_RED (26, 5→13 / 5→13)**,
**GIN (28, 6→14 / 5→13)**, **TEQUILA_BOLD (33, 6→14 / 5→13)**.
Sandbox protocol used. Backup: `drink_x_food_generator.js.pre-s24.bak`.
Deployed. Regen ran cleanly: 22 templated DxF notes shifted to new variants
(out of ~33 still-templated post-S23). Mirror sync 0 desync. Health 9/9 PASS.
Tier audit 2,522/2,522 matching. Snapshot drift 0/250 anchors (anchor pairs happened
to keep stable hash positions).
**Finding (important for direction):** Phase 9 enrichment is largely **forward-
investment**, not immediate-corpus-delta. The corpus is now 99.9% editorial (51,024 of
51,242 notes); only ~33 templated notes remain. Class-level enrichment only changes
the templated cells, so visible impact today is small (~14 corpus notes now contain
new enriched phrasing). The enrichment IS in the pool though — every future regen,
new-bottle add, and AVOID-tier expansion will draw from the deeper variant pool.
**Next session start:** **Session 25** — three options surfaced:
- **A:** Continue Phase 9 — enrich the remaining 13 classes (COGNAC, COGNAC_LUXURY,
  SPARKLING, WHITE_WINE, VODKA, COCKTAIL_BOLD, COCKTAIL_LIGHT, SWEET_LIQUEUR,
  APERITIVO_BITTER, SWEET_WINE, MEZCAL, HEAVY_SPIRIT, LIGHT_SPIRIT
  [RUM_LIGHT/TEQUILA_BLANCO]). 1-2 sessions of work. Forward-investment continues.
- **B:** Pivot to Phase 8 close — audit the 33 remaining templated notes individually,
  fix Raventós Cava NULL-class override. Short, finishes loose ends.
- **C:** Quality-rest sample audit — random 50-pair top-to-bottom sample, write
  pre-floor-deployment confidence report. Sets up final certification.
Gabe to choose direction.

## Old current status (preserved for context)

**Phase:** 8 ✅ **OPEN COMPLETE** (Session 23: full regen + snapshot relock + AUDIT_v8)
**Last session:** 2026-06-02 — Session 23 (Phase 8 open — regen pipeline + AUDIT_v8 doc)
**Last action:** Ran the full regen pipeline to push Phase 7's bridge variants through
every templated cell. Sequence: (1) backup pairing-notes.js, (2) `node engine/regenerate_dxf_notes.js` —
210 of 218 templated DxF notes rewritten, (3) `node engine/mine_food_corpus.js` —
food_corpus_mined.js refreshed (168 unique connectives, 2,740+ fragments across 21 verdict
slots), (4) `node engine/regenerate_food_x_food.js` — 816 templated FxF pairs rewritten
across 12 archetype slots, (5) mirror sync = 0 desync, (6) tier audit = 2,522/2,522
matching, (7) cooking-method scan = clean (swordfish/tuna "seared" hits are legitimate,
not steak drift), (8) snapshot relock: 250 DxF anchors + 24 FxF anchors locked at new
state. Templated-note share dropped from 218 → ~33 of 51,242 (0.06%). Wrote
`engine/AUDIT_v8_2026-06-02.md` — full Phase 7+8 audit including per-tier sample quality,
4 documented gaps (ELEGANT_RED no per-bottle variants, 33 remaining templated to review,
Raventós Cava NULL class, health-check editorial counting math).
**Engine state:** strongest since project began. Health 9/9 PASS, mirror integrity
51,242/51,242, tier consistency 2,522/2,522, all factual canons clean.
**Next session start:** **Session 24** — Three options surfaced in AUDIT_v8:
- **A:** Open Phase 9 — category-level variant mechanism for non-curated bottles (~429
  entities flow through default path; estimated 2-3 sessions for 8 remaining classes)
- **B:** Audit remaining 33 templated notes (Gap 2) + fix Raventós SPARKLING override
  (Gap 3) — short, closes Phase 8 loose ends
- **C:** Quality-rest session — random 50-pair sample across tiers + classes, write
  pre-floor-deployment confidence report
Gabe to choose direction. Engine is already in a strong floor-deployable state; remaining
gaps are quality-lift, not blockers.

## Old current status (preserved for context)

**Phase:** 7 ✅ **COMPLETE** (Sessions 18-22 done — WORKS-tier expansion + bridge variants for all 62 curated bottles)
**Last session:** 2026-06-02 — Session 22 (Specialty bottle bridge expansion: 22 of 22, Phase 7 closer)
**Last action:** Phase 7 closer. Pre-audit identified 21 specialty bottles + 1 NULL-class
bottle (Raventós Cava — classification deferred). Wrote 176 hand-curated bridge variants
(4 per bridge × 2 bridges × 22 bottles). Distillery/house facts baked in: Hennessy
four-region blend, Remy Fine Champagne (Grande+Petite Champagne crus), Courvoisier's
Napoleon history, Don Julio González 1942 founding, Clase Azul hand-painted ceramic
decanters, Ron Zacapa Sistema-Solera, Pierre Gimonnet Côte-des-Blancs grower-Champagne
(Cuis village, Chardonnay-only), Veuve Yellow Label 50-55% Pinot Noir, Raventós Conca-
del-Riu-Anoia (left Cava DO), Vin Santo appassimento + caratelli casks, Symington
family + Yeatman family for the ports, Schloss Vollrads 1211-founding, Spring Mountain
District for Keenan, Bert "Tito" Beveridge + Mockingbird Distillery for Tito's,
Bacardi's 1862 Don Facundo founding + Puerto Rico, Dick Bradsell 1980s creation for the
Espresso Martini, WWI artillery name for French 75. Built
`engine/apply_bridge_variants_specialty.js` with regex updated to handle double-quoted
keys (Graham's apostrophe edge case). Merged 22/22 into profile module. Corpus sweep:
**80 pairs touched, 108 swaps, 0 mirror desync**. Top swaps: Pierre Gimonnet 16,
Bacardi 14, Clase Azul 12, Courvoisier 10, Remy VSOP 8, Tito's 8. Health check 9/9 PASS.
**Phase 7 final tally:** All 62 curated bottles now have bridge1Variants/bridge2Variants
pools. Total hand-written variants: 120 (S19) + 48 (S20) + 152 (S21) + 176 (S22) = **496
phrases**, all distillery-grounded. Total corpus swaps applied across S19-S22: 182 + 28 +
80 + 108 = **398 swaps across 310 pairs**.
**Next session start:** **Session 23 — Phase 8 open.** Phase 8 plan = (a) write
`engine/AUDIT_v8_2026-06-02.md` documenting Phase 7 deliverables + per-tier sample
quality + remaining gaps; (b) full corpus regen pass to push the new variants through
the templated notes (the in-place sweeps in Sessions 19-22 only touched live bridges,
but regen will saturate every templated pair-cell); (c) final snapshot relock (`node
engine/engine_snapshot_test.js --update` + fxf equivalent); (d) targeted slot-fill fix
for any cells the audit surfaces as thin. Open question for Session 23: do we also tackle
the ELEGANT_RED / default-path bottles via a category-level variant mechanism, or defer
to a separate "Phase 9 category variants" workstream?

## Old current status (preserved for context)

**Phase:** 7 — WORKS-tier connective expansion + per-bottle variant pools (Sessions 18-21 ✅, Session 22 pending)
**Last session:** 2026-06-02 — Session 21 (BOURBON_BOLD bridge expansion: 19 of 19 in-scope bottles)
**Last action:** Continued Phase 7 Option A. Pre-audit identified 19 BOURBON_BOLD bottles
remaining after Session 19's whiskey batch. Wrote 152 hand-curated bridge variants
(4 per bridge × 2 bridges × 19 bottles) covering Speyside (Macallan 12/18, Glenfiddich
12/18, Glenlivet 12, Cragganmore 12, Balvenie 21 Portwood, Monkey Shoulder), Highland
(Glenmorangie 18, Oban 14/18), Islay (Lagavulin 8, Laphroaig 10, Bruichladdich),
Japanese (Hibiki Japanese Harmony), Irish (Redbreast 21, Tullamore D.E.W.), and
Canadian (Crown Royal, Canadian Club). Each variant references the specific distillery
identity, region terroir, or cask program (e.g., David Stewart for Balvenie Portwood,
Hiram Walker for Canadian Club, Robbie-Dhu Spring for Glenfiddich, Manitoba for Crown
Royal, multi-distillery Yamazaki-Hakushu-Chita for Hibiki). Built
`engine/apply_bridge_variants_bourbon_bold.js` (same canonical-sorted-key hash pattern).
Merged 19/19 into profile module. Corpus sweep: **66 pairs touched, 80 swaps, 0 mirror
desync**. Top swaps: Crown Royal 10, Monkey Shoulder 10, Hibiki 10, Macallan 12 Sherry 8,
Tullamore D.E.W. 8, Oban 14 6, Bruichladdich 6. Health check 9/9 PASS.
**Next session start:** **Session 22** (Phase 7 closer) — the final ~21 specialty
bottles: 3 COGNAC (Hennessy, Remy VSOP, Courvoisier), 2 TEQUILA_BOLD (Don Julio 1942,
Clase Azul Reposado), 1 HEAVY_SPIRIT (Ron Zacapa), 2 SPARKLING (Pierre Gimonnet, Veuve
Clicquot), 1 NULL (Raventós Cava de NIT — verify class), 4 SWEET_WINE (Vin Santo, both
Graham's, Taylor Fladgate), 2 WHITE_WINE (Keenan Chardonnay, Schloss Vollrads
Riesling), 2 VODKA (Detroit City, Tito's), 1 GIN (Detroit City Gin), 1 RUM_LIGHT
(Bacardi), 2 COCKTAIL_LIGHT (French 75, Margarita), 1 COCKTAIL_BOLD (Espresso Martini).
After Session 22, Phase 7 closes. Phase 8 = final sweep + targeted slot-fill fix +
final snapshot relock + AUDIT_v8 doc.

## Old current status (preserved for context)

**Phase:** 7 — WORKS-tier connective expansion + per-bottle variant pools (Sessions 18-20 ✅, Sessions 21-22 pending)
**Last session:** 2026-06-02 — Session 20 (Cab bridge expansion: 6 of 6 BIG_RED bottles in curated module)
**Last action:** Continued Phase 7 Option A. Audited the curated profile module — only 6
Cabs are in BOTTLE_PROFILES_CURATED (Faust, J. Davies, Spottswoode Lyndenhurst, Nickel &
Nickel, Cade, Shafer Hillside Select), all BIG_RED weight=heavy. Zero ELEGANT_RED bottles
are curated (those flow through the generator's default profile path — bridge variants
there would require a different mechanism, separate workstream). Wrote 48 hand-curated
bridge variants (4 per bridge × 2 bridges × 6 bottles), each reading from the specific
estate's identity (Howell Mountain, Diamond Mountain, Stags Leap District, Oakville bench,
St. Helena, Atlas Peak). Built `engine/apply_bridge_variants_cabs.js` (same canonical-
sorted-key hash pattern as Session 19). Merged 6/6 into profile module. Corpus sweep:
**22 pairs touched, 28 swaps, 0 mirror desync**. Health check 9/9 PASS.
**Next session start:** **Session 21** — BOURBON_BOLD + remaining whiskey bottles
(~15-20 not covered in Session 19's set: Macallan 12 Sherry, Macallan 18, Glenmorangie 18,
Oban 14/18, Glenfiddich 12/18, Glenlivet 12, Cragganmore, Balvenie 21, Monkey Shoulder,
Lagavulin 8, Laphroaig 10, Bruichladdich, Hibiki, Redbreast 21, Tullamore D.E.W., Crown
Royal, Canadian Club, Hennessy, Remy VSOP, Courvoisier).
**Session 22:** specialty bottles (vodkas, gins, rums, cocktails not yet covered, ports,
sparkling, Vin Santo, dessert wines). After Session 22, Phase 7 closes. Phase 8 = final
sweep + targeted slot-fill fix + final snapshot relock + AUDIT_v8 doc.

## Old current status (preserved for context)

**Phase:** 7 — WORKS-tier connective expansion + per-bottle variant pools (Sessions 18-19 ✅, Sessions 20-22 pending)
**Last session:** 2026-06-01 — Session 19 (whiskey bottle bridge expansion: 15 of 62 bottles)
**Last action:** Per Gabe's "as good as possible" directive, committed to Option A: full
bridge expansion for all 62 curated bottles, even though current-corpus impact is small
(this is forward-investment for future regen quality). Session 19 covered the 15
highest-current-impact bottles (the whiskey set: Toki, Redbreast, Hakushu, Yamazaki 12/18,
Jameson, Macallan Estate, Balvenie 12/14, Pierre Ferrand, The Manhattan, Glenmorangie 10,
Dalmore 12, Aberlour 16, Bowmore 12). Hand-wrote 120 bridge variants (4 per bridge × 2
bridges × 15 bottles), each true to the specific bottle's character. Merged into
`bottle_profiles_curated.js` via sandbox protocol. Ran corpus sweep with canonical-sorted-key
hash (Session 18's lesson applied) — **182 corpus swaps across 142 pairs, 0 mirror desync**.
Health check 9/9 PASS.
**Next session start:** **Session 20** — BIG_RED + ELEGANT_RED bottles (~15 Cabs, Pinots,
Bordeaux blends: Faust, Spottswoode, Nickel & Nickel, Cade, J. Davies, Keenan, etc.).
**Session 21:** BOURBON_BOLD + remaining whiskey bottles (~15 bottles). **Session 22:**
specialty bottles (cocktails, vermouths, gins, ports, sparkling, ~17 bottles). After
Session 22, Phase 7 closes. Then Phase 8 (final sweep + targeted slot-fill fix + final
snapshot relock + AUDIT_v8 doc).

## Old current status (preserved for context)

**Phase:** 7 — WORKS-tier connective expansion + per-bottle variant pools (Session 18 ✅, Sessions 19-21 pending)
**Last session:** 2026-06-01 — Session 18 (works-tier connective pool expansion + corpus redistribution)
**Last action:** Expanded `pickAction()` in `drink_x_food_generator.js` from 2-4 verbs per
tier to 12-19 per tier. Built `engine/break_works_connectives.js` — in-place sweep that
redistributes the 4 dominant works-tier connectives ("finds neutral with", "reads alongside",
"sits alongside", "leans against") across the new 19-variant pool via hash-pick.
**15,606 swaps across 15,170 pairs committed.** Distribution post-sweep: no single
connective above 8.1% (was 25%+ pre-Phase-7 per AUDIT_v7). Mirror sync had to re-converge
7,153 mirror pairs whose canonical and reverse keys hash-picked differently — handled
cleanly. Health check 9/9 PASS.
**Next session start:** **Session 19** — per-bottle bridge1/bridge2 variant expansion for
~80 curated bottles currently with single phrase. Expand each to 3-5 variant pools. Same
sandbox-then-bash-cp protocol. Note for any future apply: hash on canonical sorted key to
avoid mirror desync.

## Old current status (preserved for context)

**Phase:** 6 ✅ **COMPLETE** (Sessions 15-17 done — Louis XIII + HEAVY_SPIRIT lifts + carrot cake canon + mining)
**Last session:** 2026-06-01 — Session 17 (BOURBON_BOLD + ELEGANT_RED audit, mining pass, Phase 6 close)
**Last action:** Audited BOURBON_BOLD (10 thin cells) + ELEGANT_RED (3 thin cells). **Zero
lifts needed** — every thin-cell pair already cites regional terroir (Willamette/Sonoma/Loire
Pinot, Eola-Amity), bottle facts (Suntory Forest Distillery, Braida Barbera benchmark,
Speyside/Highland scotch profiles), and pair-specific reasoning. The audit-then-lift
discipline kept us honest: don't fix what isn't broken. Ran `mine_food_corpus.js` to
capture all Phase 6 editorial into `food_corpus_mined.js` (now 2,740+ fragments across 21
verdict slots, 168 unique connectives). Health check 9/9 PASS.
**Phase 6 final deliverables:**
- Session 15: 3 Louis XIII lifts (Mushrooms, Chocolate Cake, Mocha Creme)
- Session 16: 5 HEAVY_SPIRIT lifts (Myers's × Bone Marrow / Carrot Cake / Cheesecake, J&W Trinidad × Carrot Cake, Ron Zacapa × Cheesecake)
- Mid-Session 16: 90 carrot cake canon fixes (raisin/walnut leak sweep across the entire corpus + CLAUDE.md dessert ingredient canon added)
- Session 17: audit confirmed remaining thin cells need no further lifts
- Mining captured all new editorial for future regen consumption
**Next session start:** **Phase 7** — WORKS-tier connective expansion + per-bottle variant
pool expansion (Sessions 18-21). The systemic fix for templated phrases like "heavy
aged-spirit weight", "high-proof pour register", "deep-bodied spirit register" that
pervade Strong/Works tier across many bottles. Combines two related improvements: (1)
expand the BRIDGE_VERBS pool from ~6 to 15+ per class for GIN/VODKA/COCKTAIL_LIGHT/RUM_LIGHT,
(2) expand per-bottle bridge1/bridge2 variants for ~80 curated bottles from single phrase
to 3-5 variant pools. Largest scope phase remaining.

---

## Open errors / blockers

None.

---

## DECISION RESOLVED (2026-05-30)

Gabe chose Option B (food-archetype subdivision per cell). Rationale: "Every decision we make
is with the best possible product in mind." Session 2b executed it.

The v2 pool now routes each pair through `foodArchetypeFor(food)` → archetype-specific entries
mixed with cell DEFAULT. All 3 Session 2 misfires (asparagus picking dairy clause, seafood
tower picking dairy clause × 2) are now resolved by *design* — the picker can no longer land
a cream-specific clause on a vegetable, period.

This is the principle to carry forward: architectural fixes over patches. When a class of
errors is possible by design, fix the architecture.

---

## DECISION NEEDED FROM GABE before Session 2b (resolved — see above)

The Session 2 preview surfaced a design trade-off I want your call on before continuing.

**What's working in the preview:**
- Verb variety eliminates the monotone "overpowers" — every note now picks from 4-5 verbs
- Most reasoning clauses are concrete and server-defensible (e.g., "the brown-spirit weight
  pulls focus off the delicate fish protein" — server can read that to a guest cold)
- BOURBON_BOLD × main, ELEGANT_RED × dessert, ELEGANT_RED × main all read well — these are the
  highest-volume cells and they're the strongest hits

**What's not working — the design flaw:**
Within a single cell (e.g., BOURBON_BOLD × side), the foods vary widely — asparagus AND lobster
mac AND creamed spinach all share the cell. My why-clauses sometimes assume one food sub-type:

> Asparagus + BOURBON_BOLD reasoning picked: "sweet-spirit oak meets dairy richness with no
> contrast" — but asparagus isn't dairy. The server would read this and immediately spot the
> mismatch.

Three misfires found in the preview (out of ~36 sampled):
- Asparagus + BOURBON_BOLD × side → dairy clause picked
- Seafood Tower + ELEGANT_RED × starter → dairy clause picked (×2 — Venge and 1881)
- Asparagus + ELEGANT_RED × side → "dark fruit meets side richness" (works for cream sides, not asparagus)

**Two paths forward:**

**Option A — Tighten entries to be food-agnostic** (faster, less precise)
Revise the BOURBON_BOLD × side / ELEGANT_RED × starter / ELEGANT_RED × side cells so every
clause works across the cell's food variety. Example:
- ~~"sweet-spirit oak meets dairy richness with no contrast"~~ (cream-specific)
- → "the side reads small under the spirit's weight" (works for any side)

Tradeoff: every entry stays generic. The why-clauses lose some specificity, but they always fit.

**Option B — Build food-archetype subdivision** (slower, more precise, more reusable)
Split each cell by food archetype. BOURBON_BOLD × side becomes:
- BOURBON_BOLD × side-cream (au gratin, creamed spinach, lobster mac, broccoli cheddar)
- BOURBON_BOLD × side-vegetable (asparagus, broccolini, brussels, sauteed greens)
- BOURBON_BOLD × side-starch (truffle fries, smashed potatoes)

Same for starter (×starter-shellfish vs ×starter-dairy vs ×starter-meat). Generator needs a
food-archetype tagger; entries get sharper because they target the specific clash.

Tradeoff: 4x more entries to write, requires a food-archetype tagging file. Higher fidelity
but more session time.

**My read:** Option B is the right long-term answer because it produces sommelier-grade per-pair
reasoning. Option A gets us 80% there with 25% of the work. We could do Option A now (ships
quality lift sooner) and Option B later as a precision refinement.

Confirm A or B for Session 2b.

---

## Phase order locked (2026-05-30, post-Session-1 review with Gabe)

Gabe overrode my metric-driven recommendation with a floor-priority ordering. The reasoning is
right: **the server needs to *defend* every AVOID to a guest who asks why**, and GOLD/EXCELLENT
are the *sell-it* moments where reasoning earns the recommendation. WORKS notes get skimmed.

Final phase order in GAMEPLAN_v1:

| Phase | Sessions | Scope | Why this order |
|---|---|---|---|
| 1. Calibrate diagnostic | 1 | — | Measurement integrity first |
| 2. DxF AVOID per-pair reasoning | 2-4 | ~7,300 notes | Floor-defends recommendation refusals |
| 3. GOLD/EXCELLENT verdict reasoning | 5-8 | ~3,000 notes | Sells the lead recommendations |
| 4. FxF STRONG editorial backfills | 9-12 | ~270 pairs | Supporting reasoning quality |
| 5. LIGHT_SPIRIT subclass split | 13-14 | ~250 notes | Class-taxonomy fix |
| 6. Thin-bucket consolidation | 15-17 | ~108 pairs | Rare but high-prestige (Louis XIII etc.) |
| 7. WORKS connectives + per-bottle pools | 18-21 | ~3,500+ notes | Lower-priority polish, combined for efficiency |
| 8. Slot-fill fix + final sweep | 22-24 | 74 notes + audit | Targeted small bug + lock |

Total: 24 sessions estimated.

**Key principle codified:** floor-priority outranks metric measurability. The diagnostic
can't measure "does this AVOID explain why" — but the server-at-table standard demands it.
Phase 2 success will be verified by 50-note hand-reading, not metric delta.

---

## Files modified this session (2026-05-30, Session 9 — Phase 4 begin)

**Editorial + apply infrastructure:**
- `engine/fxf_strong_steak_side_editorial.js` — 21 hand-curated editorial entries for the
  side × steak × strong cell, voice-matched to FxF gold standards
- `engine/apply_fxf_editorial.js` — generic FxF editorial apply script (v2 — sandbox-protocol).
  Reusable across Sessions 10, 11 — just write new editorial module, feed to same script.
- `engine/apply_fxf_diff.txt` — Session 9 HITL artifact (~80 lines, 21 BEFORE/AFTER pairs)

**Corpus update:**
- `pairing-notes.js` — 42 entries (21 canonical + 21 mirror) replaced with new editorial.
  File grew from 15,794,405 → 15,796,405 bytes (+2KB from richer prose).
- `pairing-notes.js.pre-fxf-editorial-2026-05-30_20-00-06.bak` — initial backup (used for
  recovery after truncation incident)
- `pairing-notes.js.pre-fxf-s9-20260530_200315.bak` — backup taken right before the successful
  atomic copy

**Docs:**
- `engine/SESSION_NOTES.md` — file-write protocol updated with Failure Mode 2 (timeout
  truncation) + sandbox-first rule for all corpus writes
- `engine/GAMEPLAN_v1.md` — Session 9 log

**Incident recovery (worth remembering):**
First commit attempt wrote `pairing-notes.js` directly to OneDrive folder. Bash command
timed out at 45s while OneDrive was mid-sync. Result: file truncated to 10.7MB (last entry
cut off mid-string). Restored from `pairing-notes.js.pre-fxf-editorial-*.bak`. Updated apply
script to write to `/sessions/.../outputs/` first, then bash-cp into place. Atomic copy is
kernel-level — completes before bash returns, no truncation risk.

## Files modified previous session (2026-05-30, Session 3 — Phase 3 deployment)

**Source modifications (THE FIRST OF THE GAMEPLAN):**
- `engine/drink_x_food_generator.js` — wired in `pickAvoidReasoning` picker + avoid-branch
  substitution. Imports `engine/avoid_reasoning_pool.js`. Net: +12 lines (import block + new
  return logic). Syntax clean, loads, smoke test passes.
- `pairing-notes.js` — **11,876 templated AVOID notes regenerated** with archetype-aware verb
  + why-clause prose. Editorial AVOIDs (3,116) untouched. Total file grew from 14,771,852 bytes
  to 15,707,270 bytes (+6.3% — accounting for the added why-clauses). Mirror integrity perfect.

**New scripts:**
- `engine/apply_avoid_reasoning.js` — single-pass O(n) commit script with --dry-run / --commit
  modes, HITL safety gate, automatic backup before write
- `engine/apply_avoid_diff.txt` — sample diff HITL artifact (171 lines, 50 pairs stratified
  across all 17 drink classes)

**Backups created:**
- `engine/drink_x_food_generator.js.pre-phase3-20260530_184222.bak` — generator pre-wire
- `pairing-notes.js.pre-phase3-20260530_184222.bak` — corpus pre-deployment
- `pairing-notes.js.pre-apply-avoid-2026-05-30_18-53-42.bak` — corpus snapshot at the moment
  of commit (one of the most important backups in the project — represents the corpus state
  immediately before this lift went live)

**Snapshot relocked:**
- `engine/.snapshot.json` — 250 DxF anchors re-locked at the post-deployment baseline.
  Generated 2026-05-30T18:54:50.584Z.

**Docs updated:**
- `engine/SESSION_NOTES.md` — this file
- `engine/GAMEPLAN_v1.md` — Phase 3 complete

## Files modified previous session (2026-05-30, Session 2.5.2)

**Files repaired:**
- `engine/pairing_engine_generator.js` — truncated 852 → 827 lines. Removed orphan v6 duplicate
  fragment (already inlined in canonical `generate()`), duplicate `module.exports` (the older
  one missing `pickMinedVerdict`), and tail orphan `S, FOOD_FLAVORS,\n};`. `node -c` passes.
  Module loads cleanly with all 13 exports including `generate`, `pickMinedVerdict`, etc.
- `engine/consistency_check.js` — truncated 191 → 171 lines. Removed duplicate copy-paste of
  lines 150-171. `node -c` passes. **Live run: all 5 checks pass on first try.**

**Verification artifacts (no new files saved — verification done in-session):**
- Engine file survey: 0/101 broken
- Health check: 9/9 pass
- Live consistency check: 5/5 pass (mining ↔ runtime parity, 435 drinks classified, 56 foods,
  bucket validity)
- DxF snapshot: 250/250 stable
- FxF snapshot: 20 stable, 4 drifted (pre-existing — May 7 corpus edits, not from this session)

**Docs updated:**
- `engine/SESSION_NOTES.md` — this file
- `engine/GAMEPLAN_v1.md` — Session 2.5.2 log entry, Phase 2.5 marked complete

No source-of-truth files modified (pairing-notes.js, pairing-map-v2.js untouched).

## Files modified previous session (2026-05-30, Session 2.5.1)

**Backups created (pre-repair snapshots):**
- `engine/pairing_engine_generator.js.pre-repair.bak`
- `engine/drink_x_food_generator.js.pre-repair.bak`
- `engine/consistency_check.js.pre-repair.bak`
- `engine/audit_steak_side_coverage.js.pre-repair.bak`

**Files repaired:**
- `engine/drink_x_food_generator.js` — truncated 2146 → 2144 lines. Removed orphan
  `VOICE_DEFAULTS,\n};`. `node -c` passes.
- `engine/audit_steak_side_coverage.js` — truncated 49 → 48 lines. Removed orphan
  ` + k));` fragment. `node -c` passes. Sample run produces expected output.

**Docs updated:**
- `engine/SESSION_NOTES.md` — this file
- `engine/GAMEPLAN_v1.md` — Session 2.5.1 log entry

No source-of-truth files modified (pairing-notes.js, pairing-map-v2.js untouched).

## Files modified previous session (2026-05-30, Session 3 — stopped/escalated)

- `engine/drink_x_food_generator.js` — modified then **reverted** to backup. Current state
  matches `engine/drink_x_food_generator.js.pre-avoid-reasoning.bak` exactly. Net change: none.
- `engine/drink_x_food_generator.js.pre-avoid-reasoning.bak` — created (pre-Session-3 snapshot,
  retained for Phase 2.5)
- `pairing-notes.js.pre-avoid-reasoning.bak` — created (pre-Session-3 corpus snapshot, retained)
- `engine/ENGINE_REPAIR_NOTES.md` — created (Phase 2.5 work intake doc)
- `engine/GAMEPLAN_v1.md` — Phase 2.5 inserted between Phase 2 and Phase 3
- `engine/SESSION_NOTES.md` — this file

**No source-of-truth files were modified in their final state. Zero deployment occurred.**
Backups will be reused in Session 2.5.1 (as evidence of broken baseline) and at the eventual
Phase 3 resumption.

## Files modified previous session (2026-05-30, Session 2d)

- `engine/avoid_reasoning_pool.js` — rebuilt via sandbox protocol (9 parts: 5 v2c parts +
  parts 6-8 for new classes + tail). 1,187 lines, 328 entries, 80 cells, 17 classes.
- `engine/preview_avoid_reasoning_2d.js` — created (covers all 11 new classes)
- `engine/avoid_reasoning_preview_2d.txt` — generated (231 lines, sample AFTER prose)

Sandbox protocol used cleanly throughout — zero null-byte corruptions this session because
every JS modification used outputs/ first. The protocol works.

No source-of-truth files modified.

## Files modified previous session (2026-05-30, Session 2c)

- `engine/avoid_reasoning_pool.js` — rebuilt via sandbox protocol (5 parts concatenated).
  Added SWEET_LIQUEUR (6 cells), GIN (3 cells), SWEET_WINE (5 cells), APERITIVO_BITTER (5 cells).
  Total now 198 entries × 114 archetype buckets × 31 cells × 6 classes.
- `engine/preview_avoid_reasoning_2c.js` — created (covers Session 2c cells)
- `engine/avoid_reasoning_preview_2c.txt` — generated (198 lines, before/after pairs)
- `engine/avoid_reasoning_pool.broken.bak` — created (corrupted intermediate from failed Edit;
  kept as evidence of the OneDrive null-byte issue that prompted the protocol)
- `engine/SESSION_NOTES.md` — updated
- `engine/GAMEPLAN_v1.md` — updated

Process note: an Edit operation around 1.5KB triggered the OneDrive null-byte truncation
even though Edit was supposed to be safer than Write. Lesson: the file-write protocol now
applies to **any non-trivial JS file modification, including Edit**, not just Write. The
sandbox-then-bash-copy approach worked first try for a 661-line file (~17KB) that direct
Write would have certainly corrupted.

No source-of-truth files modified. No backups of pairing-notes/pairing-map needed.

## Files modified previous session (2026-05-30, Session 2b)

- `engine/avoid_reasoning_pool.v1.bak` — created (rollback snapshot of v1 pool)
- `engine/food_archetypes.js` — created (single source of truth: 56 foods → 23 archetypes
  across 6 categories; coverage report verifies 56/56 mapped)
- `engine/avoid_reasoning_pool.js` — restructured to v2 (archetype-aware). 96 entries across
  46 archetype buckets, 12 cells, 2 classes. Picker now takes food entity (not just category).
- `engine/preview_avoid_reasoning.js` — updated for v2 picker signature; added targeted-key
  verification section that tests the 3 known v1 misfires
- `engine/avoid_reasoning_preview_v2.txt` — generated (170 lines, before/after pairs)

Notable: needed bash-based file copies (via /sessions/.../outputs scratch) to bypass OneDrive
sync padding files with null bytes mid-write. Worth remembering when future sessions hit
similar truncation issues on long Write calls.

No source-of-truth files modified. No backups of pairing-notes/pairing-map needed.

## Files modified previous session (2026-05-30, Session 2)

- `engine/find_fxf_avoid_curated.js` — created (FxF AVOID identifier + voice-template extractor)
- `engine/fxf_avoid_curated.json` — generated (118 FxF AVOIDs ≥60 words, for future mining)
- `engine/map_avoid_cells.js` — created (per-cell AVOID volume map, Pareto analysis)
- `engine/avoid_reasoning_pool.js` — created (53 entries, 12 cells, BOURBON_BOLD + ELEGANT_RED)
- `engine/preview_avoid_reasoning.js` — created (before/after prose simulator)
- `engine/avoid_reasoning_preview.txt` — generated (HITL review artifact)
- `engine/SESSION_NOTES.md` — updated (this file)

No source-of-truth files modified. No backups needed.

## Files modified previous session (2026-05-30, Session 1)

- `engine/diagnose_quality_distribution.js` — calibrated slot-fill detector v2 + added per-class
  ranking + 6 self-tests
- `engine/quality_distribution_report.json` — regenerated post-calibration
- `engine/quality_distribution_report.pre-calibration.json` — saved for before/after reference
- `engine/SESSION_NOTES.md` — this file

No source-of-truth files (pairing-notes.js, pairing-map-v2.js, generators) touched.
No backups of source files required (read-only diagnostic work).

---

## Open recommendations for next session

1. **Session 2 = build `engine/avoid_reasoning_pool.js`.** Structure: `[drinkClass][foodCategory]`
   → array of `{ verb, clause, source }` entries. Seed from:
   - The 16 hand-curated FxF AVOIDs (mine via new script `engine/mine_avoid_reasoning.js`)
   - Hand-write 3-5 entries per empty cell to cover the (18 classes × 6 food categories) =
     108 cells. Realistically only 60-70 cells matter (some combos rarely AVOID).
2. **HITL gate:** show Gabe the seeded pool JSON before wiring it into the generator.
   Read-through approval required.
3. Health check baseline confirmed pre-session — 9/9 pass. Re-confirm before any source file edit.
4. No backups of `pairing-notes.js` needed in Session 2 (pool construction is additive,
   no regen yet). Backups come in Session 3 when generator gets wired and regen runs.

---

## Baseline numbers (post-calibration, 2026-05-30)

- Total notes: 51,242
- Health checks: 9/9 pass
- DxF snapshot anchors: 250/250 stable
- FxF snapshot anchors: 24/24 stable
- Mirror integrity: 0 mismatches
- Tier consistency: 99.4%

### DxF: Weakest 15 buckets (post-calibration, q score asc, n≥20)

All worst-15 are WORKS-tier connective recycling. AVOID buckets dropped out of the bottom
entirely (the pre-calibration false positives are gone).

| Bucket | n | avg words | rec rate | q score |
|---|---:|---:|---:|---:|
| VODKA × side × works | 240 | 30.0 | 129% | 0.33 |
| APERITIVO_BITTER × main × works | 50 | 28.4 | 124% | 0.34 |
| GIN × side × works | 638 | 32.7 | 129% | 0.36 |
| COCKTAIL_LIGHT × dessert × works | 80 | 32.2 | 127% | 0.36 |
| GIN × soup-salad × works | 730 | 31.7 | 125% | 0.36 |
| VODKA × soup-salad × works | 264 | 29.3 | 117% | 0.37 |
| LIGHT_SPIRIT × side × works | 306 | 34.9 | 123% | 0.37 |
| VODKA × starter × works | 22 | 30.5 | 118% | 0.37 |
| LIGHT_SPIRIT × soup-salad × works | 332 | 34.9 | 121% | 0.38 |
| COCKTAIL_LIGHT × side × works | 260 | 32.3 | 119% | 0.39 |
| HEAVY_SPIRIT × soup-salad × works | 150 | 34.7 | 123% | 0.39 |
| APERITIVO_BITTER × side × works | 90 | 26.9 | 102% | 0.40 |
| WHITE_WINE × side × works | 174 | 33.4 | 116% | 0.40 |
| APERITIVO_BITTER × steak × works | 52 | 31.5 | 112% | 0.40 |
| APERITIVO_BITTER × soup-salad × works | 112 | 29.2 | 105% | 0.40 |

**Total notes in worst-15 = ~3,498.** This is the Phase 3 scope.

### Real slot-fill mismatches (post-calibration) — much smaller than feared

| Class | Mismatches | Rate |
|---|---:|---:|
| MEZCAL | 2 of 336 | 0.6% |
| SPARKLING | 4 of 1,120 | 0.4% |
| BOURBON_BOLD | 48 of 18,368 | 0.3% |
| TEQUILA_BOLD | 12 of 3,920 | 0.3% |
| WHITE_WINE | 4 of 1,344 | 0.3% |
| LIGHT_SPIRIT | 4 of 1,680 | 0.2% |
| All others | 0 | 0.0% |

**Total: 74 notes** across the entire corpus (0.14%). AUDIT_500 estimated 200-500; the
calibrated detector finds 74. Could be a single-session targeted fix script rather than its
own phase. Recommend folding into Phase 8 (final sweep) unless any prove urgent.

### FxF weak buckets (unchanged by calibration)

| Bucket | n | avg words | Issue |
|---|---:|---:|---|
| starter × steak × strong | 52 | 24.7 | Generic templated, short |
| main × soup-salad × strong | 128 | 25.3 | Generic templated, short |
| side × steak × strong | 42 | 26.4 | Generic templated, short |
| side × steak × gold | 12 | 30.2 | Mixed editorial / templated |

### What the diagnostic does NOT measure

**The DxF AVOID per-pair reasoning issue (Cause A in GAMEPLAN_v1) is invisible to current
metrics.** AVOID buckets show editorial=100%, long avg words, low recycling — they score
q=0.80 (strong). But qualitative read-through (Phase 0 sample) confirms they're monotone: 7,000+
notes use "{Drink}'s {character} overpowers the {food}'s {edge}" with no per-pair reasoning. The
metric can't see structural sameness because the words ARE varied — it's the *reasoning* that's
absent. Phase 2 success will be verified by hand-reading 50 regen'd notes, not by metric delta.

If we want a metric for this, add "verb-uniformity" in a future session: % of avoid notes in a
class × food bucket that use the same lead verb ("overpowers"). Currently this would be ~100%
for BOURBON_BOLD × main × avoid.

### FxF weak buckets

| Bucket | n | avg words | Issue |
|---|---:|---:|---|
| starter × steak × strong | 52 | 24.7 | Generic templated, short |
| main × soup-salad × strong | 128 | 25.3 | Generic templated, short |
| side × steak × strong | 42 | 26.4 | Generic templated, short |
| side × steak × gold | 12 | 30.2 | Mixed editorial / templated |

---

## Session log

### 2026-06-02 — Session 25: Phase 9 closer — Remaining 13 classes + Raventós fix ✅

- Context: Gabe pushed back on my "diminishing returns" framing ("poor reasoning for a
  project specifically outlined as making the engine as good as possible"). Captured as
  a feedback memory candidate — don't let visible-corpus-delta override the explicit
  mandate.
- Wrote `engine/class_variant_enrichment_s25.js` with 182 new phrases (7 b1 + 7 b2 × 13
  classes). Each variant is class-broad but textured:
  - COGNAC: Charente-region, column-still, Limousin-oak, Fine-Champagne, multi-cru
  - COGNAC_LUXURY: rare-blend, multi-generation cellar, prestige-house heritage
  - SPARKLING: traditional-method, blanc-de-blancs, grower-Champagne, autolytic-aged
  - WHITE_WINE: cool-climate, unoaked, Old-World vs New-World, saline-mineral
  - VODKA: column-distilled, cold-filtered, workhorse, wheat-or-corn base
  - COCKTAIL_BOLD: classic-cocktail build, bartender-canon, speakeasy-classic
  - COCKTAIL_LIGHT: tropical-citrus, agave-citrus, gin-citrus, rum-citrus, sour-cocktail
  - SWEET_LIQUEUR: after-dinner, herbal-sweet digestif, cordial-style, Italian-or-French
  - APERITIVO_BITTER: Italian-amaro, bittersweet vermouth, gentian-and-quinine, Fernet
  - SWEET_WINE: Port-style, late-harvest, noble-rot Sauternes, tawny-aged, vintage-Port
  - MEZCAL: Oaxaca-distilled, palenque-distilled, espadín-and-smoke, underground-roasted
  - HEAVY_SPIRIT: cask-aged heavy-rum, molasses-rich, pot-still, navy-strength
  - LIGHT_SPIRIT: column-distilled silver, unaged blanco, cocktail-base, high-acid bright
- Built `engine/apply_class_variant_enrichment_s25.js` (same regex-anchored injection
  as Session 24's apply script). Sandbox protocol used. Backup:
  `drink_x_food_generator.js.pre-s25.bak`.
- **Results:** 13/13 classes injected cleanly. All 18 classes now sit at 13-14 b1 / 13 b2
  variant pool depth.
- **Raventós Cava key mismatch fixed:** BOTTLE_PROFILES_CURATED was keyed under "Raventós
  Cava de NIT Rose Brut" but the canonical entity name (per ENRICHED_PROFILES + pair-notes)
  is "Raventós Cava de NIT Rosé Brut" with the é. Session 22's variants never flowed
  through because the key didn't match. Fixed via sed-rename. Verified post-fix: variants
  now resolve correctly.
- **Audited the 66 still-templated notes** (= 33 pairs × 2 mirror keys). Sample read
  confirmed they're using enriched class-level phrasing ("angelica-and-orris close"
  for GIN, "caramel-agave register" for TEQUILA_BOLD, "shaken-citrus cocktail composes"
  for COCKTAIL_LIGHT). "Templated" is a structural pattern label, not a quality flag —
  these notes are well-formed and class-specific. Left as-is.
- Regen ran cleanly: 8 templated DxF notes shifted to new variants. Mirror sync 0 desync.
  Health 9/9 PASS. Tier audit 2,522/2,522 matching. Snapshots relocked.
- Files modified: `engine/drink_x_food_generator.js`, `engine/bottle_profiles_curated.js`
  (Raventós key rename), `pairing-notes.js`, `engine/.snapshot.json`,
  `engine/class_variant_enrichment_s25.js` (new), `engine/apply_class_variant_enrichment_s25.js` (new).
- **Phase 9 closed.** All 18 classes enriched. Total Phase 7+9 = 748 hand-written
  variant phrases added to the engine's generative capacity (496 per-bottle + 252 class-level).

### 2026-06-02 — Session 24: Phase 9 open — Class-level variant enrichment (top 5 classes) ✅

- Pre-audit: 389 uncurated entities across 19 classes. Top 5 by volume: BOURBON_BOLD
  132, BIG_RED 53, TEQUILA_BOLD 33, GIN 28, ELEGANT_RED 26.
- **Surprise finding:** DRINK_CLASS_DEFAULT in `drink_x_food_generator.js` already had
  5-6 bridge variants per class — the infrastructure I'd planned to "build" was already
  in place. The actual Phase 9 work is enrichment (deepening pools), not greenfield
  category mechanism.
- Wrote `engine/class_variant_enrichment.js` with 70 new phrases (7 b1 + 7 b2 per
  class × 5 classes). Each variant is class-broad (applies to many bottles) but
  textured. Example for BOURBON_BOLD: "the cask-aged backbone meets", "the matured
  brown-spirit body wraps", "the cocoa-and-tobacco edge frames", "the long-aged grain-
  and-malt depth carries".
- Built `engine/apply_class_variant_enrichment.js` with regex-anchored injection at
  the closing `]` of each variant array. Each class block injected cleanly.
- **Results:** 5/5 classes enriched. Pool depths after:
  - BOURBON_BOLD: 14 b1 / 13 b2 (was 6 / 5)
  - BIG_RED: 14 / 13 (was 6 / 5)
  - ELEGANT_RED: 13 / 13 (was 5 / 5)
  - GIN: 14 / 13 (was 6 / 5)
  - TEQUILA_BOLD: 14 / 13 (was 6 / 5)
- Deployed via sandbox protocol. Backup: `drink_x_food_generator.js.pre-s24.bak`.
- **Regen ran:** 22 templated DxF notes shifted to new variants (out of ~33 still-
  templated). Mirror sync 0 desync. Health 9/9 PASS. Tier audit 2,522/2,522.
  Snapshot 0/250 drift.
- **Finding to surface for direction:** Visible-corpus delta is small (~14 corpus
  notes now contain new enriched phrasing) because the corpus is 99.9% editorial.
  The enrichment IS in the pool though — every future regen, new-bottle add, and
  AVOID-tier expansion will draw from the deeper pool. Pattern matches Phase 7's
  bridge-variant work: forward-investment more than immediate-corpus-delta.
- Files modified: `engine/drink_x_food_generator.js`, `pairing-notes.js`,
  `engine/class_variant_enrichment.js` (new), `engine/apply_class_variant_enrichment.js` (new).
- **Phase 9 partial:** 5 of 18 classes done. Remaining 13 classes await Session 25
  direction (continue Phase 9, pivot to Phase 8 close, or quality-rest sample audit).

### 2026-06-02 — Session 23: Phase 8 open — Full regen + snapshot relock + AUDIT_v8 ✅

- Ran the full regen pipeline to push Phase 7's bridge variants through every templated
  cell. Used the documented pipeline order from CLAUDE.md (with a correction: CLAUDE.md
  says step 4 is `regenerate_templated_notes.js` but that's actually FxF orphan backfill;
  true DxF regen is `regenerate_dxf_notes.js` — found by inspection).
- **Pipeline ran:**
  1. Backup: `pairing-notes.js.pre-s23-regen-20260602_173044.bak` (15,819,677 bytes)
  2. Pre-regen baseline: 218 templated notes detected by `templated_detection.js`
  3. `regenerate_dxf_notes.js`: 210 of 218 templated DxF notes rewritten
  4. `mine_food_corpus.js`: food_corpus_mined.js refreshed
  5. `regenerate_food_x_food.js`: 816 templated FxF pairs rewritten across 12 slots:
     STEAK_SOUP_SALAD 140, SOUP_SALAD_TO_DESSERT 128, SIDE_TO_DESSERT 104,
     MAIN_SOUP_SALAD 96, MAIN_STARTER 88, SOUP_SALAD_PAIR 76, MAIN_SIDE 74,
     STEAK_SIDE 46, SIDE_PAIR 24, STEAK_STARTER 22, STARTER_PAIR 14, DESSERT_PAIR 4
  6. Mirror sync: 0 desync after both regens
  7. Cooking-method drift scan: 0 false positives (230 "seared crust" hits all
     swordfish/tuna — legitimately seared; no steak-related drift)
  8. Tier audit: 2,522 / 2,522 matching, 0 mismatches
  9. Snapshot relock: 250 DxF anchors + 24 FxF anchors locked at new state
- **Templated count after regen:** ~33 of 51,242 (0.06%, down from 218). The remaining
  templated notes are entities whose class falls into a default bucket — flagged as
  Gap 2 in AUDIT_v8.
- **AUDIT_v8 doc written:** `engine/AUDIT_v8_2026-06-02.md`. Covers Phase 7 cumulative
  deliverables (496 hand-written variants, 398 corpus swaps, 310 pairs), per-tier
  sample quality, 4 documented gaps, conventions locked in, recommended next session.
- **Engine state at Phase 8 open:** strongest since project began. All 9 health checks
  PASS. Mirror integrity 51,242/51,242. Tier consistency 2,522/2,522. All factual
  canons clean. Templated/editorial split: ~33/~25,588 (0.1% templated, vs 0.4% pre-S23).
- Files modified: `pairing-notes.js` (DxF + FxF regen), `engine/food_corpus_mined.js`
  (re-mined), `engine/.snapshot.json` (relocked 250 anchors), `engine/engine_fxf_snapshot.json`
  (relocked 24 anchors), `engine/AUDIT_v8_2026-06-02.md` (new).
- Backups: `pairing-notes.js.pre-s23-regen-*.bak`, `pairing-notes.js.pre-regen-dxf.bak`,
  `pairing-notes.js.pre-engine-v4-regen.bak`.
- **Phase 8 open milestone reached.** Decision point for Gabe: Phase 9 (category-level
  variants), Phase 8 close (audit 33 + Raventós fix), or quality-rest sample session.

### 2026-06-02 — Session 22: Phase 7 closer — Specialty bottle bridge variants (22/22) ✅

- Pre-audit: 21 remaining specialty bottles + 1 NULL-classified Cava (Raventós).
- Wrote 176 hand-curated bridge variants. Each grounded in distillery/house facts:
  - Hennessy → 4-region cognac blend, world's largest cognac house
  - Remy VSOP → Fine Champagne (Grande + Petite Champagne crus)
  - Courvoisier → "Cognac of Napoleon", Jarnac house, historic-Cognac framing
  - Don Julio 1942 → Don Julio González, 1942 founding tribute, extra-añejo
  - Clase Azul → hand-painted ceramic decanters, Pueblo Mata artisan, Los Altos de Jalisco
  - Ron Zacapa → Sistema Solera, Guatemalan virgin-sugarcane-honey, high-altitude aging
  - Pierre Gimonnet Special Club Brut → Côte des Blancs, Cuis village, blanc-de-blancs grower
  - Veuve Clicquot → Yellow Label, Madame Clicquot house, 50-55% Pinot Noir
  - Raventós Cava de NIT → Conca del Riu Anoia (left Cava DO), Penedès rosé, traditional method
  - Vin Santo → Tuscan appassimento, caratelli casks, Trebbiano + Malvasia
  - Graham's 20 Tawny → Symington family, 20-year-blend tawny, Douro
  - Graham's 2017 Vintage Port → 2017 declared vintage, Douro vineyards
  - Taylor Fladgate Tawny → 1692 founding (oldest port house), Yeatman family, Vargellas vineyard
  - Keenan Chardonnay → Spring Mountain District, mountain-Napa, elevation-grown
  - Schloss Vollrads Riesling → Rheingau, 1211 founding (oldest German wine estate), slate soil
  - Detroit City Vodka + Gin → Eastern Market distillery, Michigan craft
  - Tito's → Bert "Tito" Beveridge, Mockingbird Distillery, Austin, corn-based, gluten-free
  - Bacardi → 1862 Don Facundo founding, Puerto Rico, bat logo, column-distilled
  - French 75 → WWI artillery name, Harry's Bar Paris origin
  - Margarita → tequila + lime + triple sec, salt-rimmed coupe canon
  - Espresso Martini → Dick Bradsell 1980s creation, vodka + Kahlúa + espresso
- Built `engine/apply_bridge_variants_specialty.js`. Patched regex to handle double-
  quoted keys (Graham's apostrophes — initial run missed 2 bottles before the fix).
- Sandbox protocol throughout. Backups: `bottle_profiles_curated.js.pre-s22.bak`,
  `pairing-notes.js.pre-s22-*.bak`.
- **Results:** 22/22 profiles updated. 80 pairs touched, 108 swaps total. Top swaps:
  Pierre Gimonnet 16, Bacardi 14, Clase Azul 12, Courvoisier 10, Remy VSOP 8, Tito's 8,
  Ron Zacapa 6, Detroit City Gin 6, French 75 6, Schloss Vollrads 6, Veuve 6, Don
  Julio 4, Margarita 2, Detroit City Vodka 2, Hennessy 2. (Vin Santo, both Graham's
  ports, Taylor Fladgate, Keenan, Espresso Martini → 0 corpus hits because current
  bridges appear only in editorial; variants still in profile module for future regen.)
- **Mirror sync: 0 mismatches, 0 lines updated** — canonical-sorted-key hash held cleanly
  for the fourth deployment in a row (sessions 19, 20, 21, 22 all 0-desync).
- Health check 9/9 PASS. Spot-check verified varied bridges (Pierre Gimonnet × Asparagus
  uses "Special-Club-tier blanc-de-blancs Gimonnet carries"; Bacardi × Chilean Seabass uses
  "Bacardi-Superior clean-sugar-cane edge softens"; Clase Azul × Asparagus uses
  "hand-painted-decanter Clase Azul body meets").
- Files modified: `engine/bottle_profiles_curated.js`, `pairing-notes.js`,
  `engine/bridge_variants_specialty.js` (new), `engine/apply_bridge_variants_specialty.js` (new).
- **Phase 7 closed.** Cumulative: 62 of 62 curated bottles have bridge variant pools.
  496 hand-written variant phrases. 398 corpus swaps across 310 pairs touched.
  All four applier scripts use canonical-sorted-key hash — pattern locked in for any
  future bridge-style sweep.

### 2026-06-02 — Session 21: Phase 7 — BOURBON_BOLD bridge variant expansion (19/19) ✅

- Pre-audit: 19 BOURBON_BOLD bottles remained after Session 19's whiskey batch.
  Cleanly grouped by region/style (Speyside 8, Highland 3, Islay 3, Japanese 1,
  Irish 2, Canadian 2).
- Wrote 152 hand-curated bridge variants. Each rooted in specific distillery facts:
  - Macallan 12 Sherry / 18 → Spanish-oak, Oloroso-cask, Christmas-cake register
  - Balvenie 21 Portwood → David Stewart, Portuguese port-cask finish
  - Crown Royal → Manitoba distillation, 1939 Royal Tour origin story
  - Canadian Club → Hiram Walker, pre-Prohibition workhorse
  - Glenfiddich 12 → William Grant family, Robbie Dhu Spring water
  - Hibiki Japanese Harmony → Yamazaki-Hakushu-Chita multi-distillery blend
  - Lagavulin 8 → bicentenary release, younger-Islay framing
  - Laphroaig 10 → Royal Warrant, medicinal-iodine framing
  - Oban 14/18 → Oban village, small-still Western-Highland coastal
  - Cragganmore 12 → Classic Malts inclusion, meaty-Speyside character
  - Monkey Shoulder → triple-malt William Grant blend, cocktail-friendly framing
  - Tullamore D.E.W. → triple-distilled triple-cask construction
  - Bruichladdich → unpeated Islay outlier, Adam Hannett
  - Redbreast 21 → long-aged Midleton pot-still flagship
  - Glenmorangie 18 → 15-years-bourbon-then-Oloroso, extra-matured
  - Glenfiddich 18 → marrying-tun finishing, small-batch reserve
  - Glenlivet 12 → Josie Smith founding distillery
- Built `engine/apply_bridge_variants_bourbon_bold.js` (same shape as Sessions 19/20).
  Sandbox protocol throughout. Backups: `bottle_profiles_curated.js.pre-s21.bak`,
  `pairing-notes.js.pre-s21-*.bak`.
- **Results:** 19/19 profiles updated. 66 pairs touched, 80 swaps total.
  By bottle: Crown Royal 10, Monkey Shoulder 10, Hibiki 10, Macallan 12 Sherry 8,
  Tullamore D.E.W. 8, Oban 14 6, Bruichladdich 6, Balvenie 21 4, Canadian Club 4,
  Glenlivet 12 4, Macallan 18 4, Glenmorangie 18 2, Glenfiddich 12 2, Glenfiddich 18 2,
  (Cragganmore, Laphroaig, Lagavulin, Oban 18, Redbreast 21 → 0 corpus hits because
  current bridges appear only in editorial; variants still in profile module for
  future regen).
- **Mirror sync: 0 mismatches, 0 lines updated** — canonical-sorted-key hash held cleanly
  for the third deployment in a row.
- Health check 9/9 PASS. Spot-check verified varied bridges (Crown × Asparagus uses
  "velvet-Canadian Crown body threads", Macallan 12 × Asparagus uses "Spanish-oak
  Macallan body threads", Monkey Shoulder × Asparagus uses "triple-malt William-Grant
  blend meets").
- Files modified: `engine/bottle_profiles_curated.js`, `pairing-notes.js`,
  `engine/bridge_variants_bourbon_bold.js` (new),
  `engine/apply_bridge_variants_bourbon_bold.js` (new).
- **Phase 7 progress:** 40 of ~62 curated bottles now have bridge variant pools.
  Session 22 = final 21 specialty bottles → Phase 7 close.

### 2026-06-02 — Session 20: Phase 7 — Cab bridge variant expansion (6/6 BIG_RED curated) ✅

- Pre-session audit revealed scope reality: BOTTLE_PROFILES_CURATED only contains 6
  Cabs (all BIG_RED). Zero ELEGANT_RED bottles are curated — they flow through the
  generator's default profile path, which would need a separate mechanism (e.g., a
  category-level variant pool) to expand. Captured for future workstream.
- 6 in-scope bottles: Faust Napa Valley Cabernet, J. Davies Cabernet Sauvignon,
  Spottswoode Lyndenhurst, Nickel & Nickel Cabernet, Cade Cabernet Sauvignon,
  Shafer Hillside Select.
- Wrote 48 hand-curated bridge variants. Each variant references the specific estate's
  identity, not generic "Napa Cab" phrasing:
  - Cade → Howell Mountain elevation, volcanic soil, mountain-fruit grip
  - Shafer Hillside Select → Stags Leap District, allocation tier, graphite/tobacco
  - J. Davies → Diamond Mountain, Schramsberg-house identity, rocky-soil minerality
  - Faust → Agustin Huneeus, Atlas Peak sourcing, valley-floor structure
  - Spottswoode Lyndenhurst → St. Helena, organic farming, second-label position
  - Nickel & Nickel → Far Niente family, single-vineyard designate, Oakville bench
- Built `engine/apply_bridge_variants_cabs.js` (re-uses Session 19's canonical-sorted-key
  hash pattern — drop-in fork for separate audit trail).
- Sandbox protocol used throughout. Backups: `bottle_profiles_curated.js.pre-s20.bak`,
  `pairing-notes.js.pre-s20-*.bak`.
- **Results:** 6/6 bottle profiles updated. 22 pairs touched, 28 corpus swaps.
  Top swaps: Cade 8, Shafer 8, Spottswoode 8, J. Davies 4 (Faust + Nickel had 0 corpus
  hits because their current bridges appear only in editorial — variants still in profile
  module for future regen).
- **Mirror sync: 0 mismatches, 0 lines updated** — canonical-sorted-key hash held cleanly.
- Health check 9/9 PASS. Spot-check verified varied bridges (Cade × Bone-In Filet uses
  "Howell-Mountain dark-fruit grip"; J. Davies × Bone-In Filet uses "mountain-fruit
  mineral grip"; Shafer × Bone-In Filet uses "Stags-Leap-District graphite edge softens").
- Files modified: `engine/bottle_profiles_curated.js`, `pairing-notes.js`,
  `engine/bridge_variants_cabs.js` (new), `engine/apply_bridge_variants_cabs.js` (new).
- **Scope insight for Session 21+:** Many "curated" expectations will be smaller than
  bottle-list count suggests — much of the wine list (and other categories) live in
  ENRICHED_PROFILES with default templated paths, not in BOTTLE_PROFILES_CURATED.
  Session 21 should pre-audit BOURBON_BOLD curated count before scoping variant volume.

### 2026-06-01 — Session 19: Phase 7 — Whiskey bridge variant expansion (15/62 bottles) ✅

- Pre-session audit: all 62 bottles in `bottle_profiles_curated.js` had single-phrase
  bridge1/bridge2 (no variants). The generator already supports `bridge1Variants` /
  `bridge2Variants` arrays per the LIGHT_SPIRIT_VOICE_DEFAULTS pattern from Phase 5 —
  infrastructure was waiting for content.
- **Scope reframing surfaced to Gabe:** corpus impact of bridge expansion is small (only
  ~234 notes contain bridge fragments today, since most notes are editorial-not-templated).
  Three options proposed (A: full expansion ~4 sessions, B: skip to Phase 8, C: 15 highest-
  impact bottles in one session). **Gabe chose Option A — "engine should be as good as
  possible"** even though current-corpus visibility is small. This is forward-investment for
  any future regen quality.
- Session 19 covered the 15 whiskey-set bottles where bridges DO appear in current corpus
  (Japanese: Toki, Hakushu, Yamazaki 12/18; Irish: Redbreast, Jameson; Speyside: Macallan
  Estate, Balvenie 12/14, Aberlour 16; Highland: Glenmorangie 10, Dalmore 12; Islay: Bowmore
  12; Cognac: Pierre Ferrand; Cocktail: The Manhattan)
- Wrote 120 hand-curated bridge variants (4 per bridge × 2 bridges × 15 bottles), each
  variant true to the specific bottle's character. Examples:
  - Hakushu 12: "the lightly-peated Hakushu meets {foodTarget}" → adds 4 variants
    referencing Forest Distillery / Yamanashi-mountain / Suntory house-style framing
  - Yamazaki 18: bridges reference mizunara-cask, collector tier, sandalwood-spice
  - Bowmore 12: lighter-Islay peat, maritime-salt, coastal register
  - The Manhattan: stirred whiskey-cocktail, rye-and-vermouth, cherry-and-bitters
- Built `engine/apply_bridge_variants.js`: merges variants into profile module +
  redistributes existing corpus occurrences via hash-pick on **canonical sorted pair-key**
  (Session 18's lesson applied — prevents mirror desync from Session 18's pattern).
- Sandbox protocol used throughout: variants module → sandbox profile copy → sandbox notes
  copy → atomic cp into place. Backups taken first.
- **Results:** 15/15 bottle profiles updated. 182 corpus swaps across 142 pairs.
  **Mirror sync: 0 mismatches, 0 lines updated** — canonical-sorted-key hash worked.
  Health check 9/9 PASS.
- Files modified: `engine/bottle_profiles_curated.js`, `engine/bridge_variants_whiskey.js`
  (new), `engine/apply_bridge_variants.js` (new), `pairing-notes.js`
- Backups: `engine/bottle_profiles_curated.js.pre-s19.bak`, `pairing-notes.js.pre-s19-*.bak`
- **Pattern locked in for Sessions 20-22:** read existing bridge1/bridge2 + character →
  write 4 variants per bridge → merge via sandbox protocol → redistribute via
  canonical-key hash sweep.

### 2026-06-01 — Session 18: Phase 7 begin — WORKS-tier connective expansion ✅

- Located connective recycling source: `pickAction()` in drink_x_food_generator.js had
  only 4 options for works tier ("finds neutral with", "reads alongside", "sits alongside",
  "leans against") shared across all 19 drink classes — explains the 25%+ concentration
  AUDIT_v7 flagged.
- Expanded `pickAction()` pool sizes: gold 2→12, excellent 3→17, strong 3→18, works 4→19.
  Mix of vocabulary registers (gentle: "touches", "rests beside"; firm: "anchors against",
  "frames"; flowing: "wraps cleanly into", "threads into").
- Smoke test on 8 new pairs confirmed varied connectives picked deterministically per pair.
- Built `engine/break_works_connectives.js` — in-place sweep with the same hash-pick
  pattern as AUDIT_v7's `break_recycled_phrases.js`. Targets WORKS-tier notes only
  (filters by `\bWorks;` closer presence). Iterates lines, hashes (pair-key + match +
  occurrence) → picks from 19-variant pool. Originals included in pool so they don't go
  extinct, just dilute from ~25% → ~5%.
- **15,606 swaps across 15,170 pairs.** Sandbox commit → atomic cp.
- Post-sweep distribution check (22,030 works-tier notes):
  - Top connective: "holds with" at 8.1% (was: "sits alongside" / "leans against" at 25%+)
  - 4 originals now at 1-4% each (cleanly diluted, not extinct)
  - 15 new connectives spread between 3.5-7.8% each
- Mirror sync had to update 7,153 mirror pairs whose canonical and reverse hash-picks
  diverged. Handled cleanly. **Note for future sweeps:** hash on canonical sorted pair-key
  (sort(A,B).join('|')) to prevent mirror desync.
- Health check 9/9 PASS, no language drift.
- Files modified: `engine/drink_x_food_generator.js`, `pairing-notes.js`,
  `engine/break_works_connectives.js` (new)
- Backups: `engine/drink_x_food_generator.js.pre-phase7.bak`,
  `pairing-notes.js.pre-phase7-*.bak`

### 2026-06-01 — Session 17: Phase 6 close — BOURBON/ELEGANT_RED audit + mining ✅

- Audited remaining thin cells (BOURBON_BOLD 10 cells, ELEGANT_RED 3 cells)
- **Read all pair-notes in targeted cells** (BOURBON_BOLD × main × strong: 3 pairs;
  BOURBON_BOLD × side × gold: 9 pairs; ELEGANT_RED × main × strong: 13 pairs)
- Every pair already cites bottle facts, regional terroir, and pair-specific reasoning:
  - Hakushu 12 × Chicken: "Suntory Forest Distillery single malt"
  - Weller 12 × Creamed Spinach: "12-year's aged oak and wheated sweetness"
  - Basil Hayden's Toast × Truffle Fries: "toasted caramel notes against truffle-parmesan"
  - Lingua Franca Avni × Market Fish: "Willamette Pinot, refined structure"
  - Braida Barbera × Salmon: "Piedmont Monferrato benchmark, juicy dark cherry, high acid"
- **Zero lifts needed.** Audit-then-lift discipline held — don't rewrite sommelier-grade
  prose just because the cell is thin by metric.
- Ran `mine_food_corpus.js`: 2,740 fragments captured (no new verdict slots since Phase 4's
  scope didn't add new archetypes, but the Louis XIII/HEAVY_SPIRIT lifts and carrot-cake
  fixes now flow into the mined corpus for future templated regen)
- Health check 9/9 PASS
- **Phase 6 closes** with total deliverables:
  - 8 hand-curated lifts (3 Louis XIII + 5 HEAVY_SPIRIT) at sommelier-grade
  - 90 corpus-wide carrot cake canon fixes
  - CLAUDE.md "Dessert ingredient canon" section added (covers 8 dessert items)
  - SESSION_NOTES § Conventions expanded with ingredient-drift pre-commit scan
- Files modified: `engine/food_corpus_mined.js`
- Backups: `engine/food_corpus_mined.js.pre-phase6-close.bak`
- **Phase 7 next:** the WORKS-tier connective expansion — the systemic fix for templated
  "heavy aged-spirit weight" / "high-proof pour register" / "deep-bodied spirit register"
  phrases that we observed across many bottles during Phase 6 audits.

### 2026-06-01 — Carrot cake canon sweep (mid-Session 16 follow-up) ✅

- Gabe flagged: carrot cake at Bowdie's has **no raisins and no nuts** — cream cheese
  frosting and cinnamon only.
- Scan found **90 corpus instances** of raisin/walnut/nut leaks in carrot-cake-context
  notes, spanning years of editorial: Macallan, Glenfiddich, Balvenie, Dalmore, Weller,
  Hennessy, Pierre Ferrand, Louis XIII, my own Session 15-16 Louis XIII / Myers's /
  J&W Trinidad lifts, plus the recurring "walnut crunch on the close" template across
  all steak/main × Carrot Cake pairs (24 hits).
- Built `engine/fix_carrot_cake_canon.js` — 15 substitution patterns in priority order
  (composites first, then walnut-crunch templates, then standalone raisin/raisins as
  catch-all). Each pattern has 3-4 hash-picked variants for distribution.
- Smart preservation: legitimate "walnut" mentions in WINE flavor descriptions are kept
  (Graham's 10 Year Tawny lists "dried apricot, walnut, toffee" as port tasting notes —
  those are accurate to the wine, not claims about the cake).
- Sandbox commit → atomic cp → mirror sync 0 mismatches → health check 9/9 PASS.
- **88 pairs touched, 90 swaps committed.** Only 2 surviving "walnut" mentions, both on
  Graham's 10 Year Tawny pair — correctly preserved as wine-attribute language.
- **Updated CLAUDE.md** with new "Dessert ingredient canon" section covering Carrot Cake,
  Chocolate Brownie, Peanut Butter Brownie, Cheesecake, Crème Brûlée, Chocolate Cake,
  Beignets, Mocha Creme.
- **Updated SESSION_NOTES.md § Conventions** with ingredient-drift pre-commit scan
  alongside the existing cooking-method scan.
- **Principle reinforced:** factual canons need both documentation AND grep gates. The
  cooking-method canon was caught by health check; the dessert ingredient canon needs
  a pre-commit grep because no automated check exists for it.
- Files modified: `pairing-notes.js`, `engine/fix_carrot_cake_canon.js` (new), `CLAUDE.md`
- Backups: `pairing-notes.js.pre-carrot-cake-*.bak`

### 2026-06-01 — Session 16: Phase 6 — HEAVY_SPIRIT audit + 5 lifts ✅

- Audit found 4 of 5 HEAVY_SPIRIT bottles already have sommelier-grade EXCELLENT prose:
  - Doctor Bird: pot-still Jamaican rum with intense hogo funk, high-ester tropical-fruit (40w)
  - Jung and Wulff Guyana: Demerara-style from Diamond Distillery wooden stills (43w)
  - Jung and Wulff Trinidad: Angostura column-still refined caramel (44w on Brownie, but
    shorter on others)
  - Ron Zacapa: Guatemalan Solera 23, high-altitude Andean aging (33w on Brownie, shorter
    on others)
  - Myers's: Diageo molasses-heavy Jamaican workhorse — has good 33w Excellent on Brownie
    but TOO short elsewhere (16-22w range)
- Identified 5 lift targets where Excellent-tier prose was too thin to read as sommelier-grade:
  - **Myers's × Bone Marrow** (16w → 50w): adds Diageo workhorse positioning + Ron Zacapa /
    Doctor Bird as higher-tier alternatives
  - **Myers's × Carrot Cake** (18w → 50w): cinnamon-and-spice line, tier-positions vs the
    luxury rums for chocolate desserts
  - **Myers's × Cheesecake** (22w → 50w): similar treatment
  - **Jung and Wulff Trinidad × Carrot Cake** (21w → 56w): "polished caramel" register vs
    Doctor Bird's wild hogo
  - **Ron Zacapa × Cheesecake** (19w → 45w): Solera 23 Andean honey-vanilla register
- Pre-commit cooking-canon scan: no violations (these are rum pairs with no steak context).
- Sandbox commit, atomic cp, mirror sync clean, health check 9/9 PASS.
- **Observation on Strong/Works tier:** every HEAVY_SPIRIT bottle's Strong and Works tier
  prose uses generic class-default phrases ("heavy aged-spirit weight", "high-proof pour
  register", "deep-bodied spirit register"). This is exactly the pattern Phase 7 targets
  (WORKS-tier connective expansion + per-bottle variant pools). Not in Phase 6 scope.
- Files modified: `pairing-notes.js`, `engine/heavy_spirit_lifts.js` (new)
- Backups: `pairing-notes.js.pre-s16-*.bak`

### 2026-06-01 — Session 15: Phase 6 begin — Louis XIII pair audit + 3 lifts ✅

- Pre-session diagnostic: 196 thin buckets (n<20) across 1,470 pairs total — broader than
  gameplan's 108 estimate
- **Reframing finding:** "thin bucket" is a metric artifact, not always a quality signal.
  COGNAC_LUXURY has 57 pairs (all Louis XIII) — every cell counts as "thin" because the
  class has 1 bottle, but most pairs are sommelier-grade already.
- Read all 57 Louis XIII pairs in detail:
  - GOLD (1): Chocolate Brownie — strong
  - EXCELLENT (4): Filet, Bone Marrow, Truffle Fries, Chocolate Brownie — all cite bottle
    facts (1,200 eaux-de-vie, Grande Champagne, 40-100yr aging, Baccarat decanter, ~$4,000)
  - STRONG (3): KC, Carrot Cake good. **Mushrooms (22w) — too thin.**
  - WORKS (11): mostly strong with substitution recs (Rémy VSOP, Hennessy XO). **Chocolate
    Cake (46w) and Mocha Creme (46w) use templated "luxury-icon cognac depth" prose —
    needs lift.**
  - AVOID (38): Phase 3 archetype reasoning, preserved correctly.
- Wrote `engine/louis_xiii_lifts.js` — 3 entries voice-matched to Excellent tier:
  - **Mushrooms (Strong):** 22w → 64w. Adds bottle facts, explains why mushrooms work,
    references truffle fries + bone marrow as canonical sides.
  - **Chocolate Cake (Works):** templated → 60w. Recommends Rémy XO or Hennessy Paradis as
    correct tier, saves Louis XIII for the brownie.
  - **Mocha Creme (Works):** templated → 62w. Recommends Pierre Ferrand or Hennessy XO,
    notes the dessert lands at "Louis XIII is over-specified" register.
- Sandbox-commit + atomic cp + mirror sync (0 mismatches) + health check (9/9 PASS).
- **Approach codified for Phase 6:** audit prestige-class pairs by reading, lift only the
  ones that are templated/weak. Don't rewrite every pair in every thin cell — that's
  unnecessary work when most pairs are already sommelier-grade.
- Files modified: `pairing-notes.js`, `engine/louis_xiii_lifts.js` (new)
- Backups: `pairing-notes.js.pre-s15-*.bak`

### 2026-06-01 — Session 14: Phase 5 close — rum agave-leak sweep ✅

- Scope scan found 56 rum-bottle notes containing tequila/agave-context regex hits across
  the 4 light rums; closer inspection revealed:
  - 4 "leaks" on Bacardi were false positives — "añejo" inside AVOID alternative-rec lists
    ("needs a Cab, bourbon, or añejo"), which is the correct context
  - The real leaks were 38 "green-agave-and-cane lift" instances (Mount Gay 20, Captain
    Morgan 10, Malibu 8) plus a few patterns the existing `fix_rum_language.js` didn't
    handle
- Built `engine/fix_rum_agave_v2.js`:
  - Targets 8 phrase patterns: green-agave-and-cane lift, green-agave edge, silver-tequila
    body/register, unaged-agave note/standalone, blanco-tequila body/lift
  - Each substitution has 5 rum-appropriate variants (Caribbean-rum, sugarcane,
    cane-and-citrus, molasses-light, silver-rum)
  - Variant picked by hash(canon-pair-key + pattern-name) so each affected pair is stable
    and the distribution spreads across the pool
  - Excludes legitimate "añejo" mentions inside alternative-rec lists by design (we only
    swap the listed tequila phrases, not the word "añejo")
- Ran the script via sandbox protocol — wrote 15,723,408-byte sandbox file → atomic cp →
  verify size → mirror sync → health check
- **Result:** 38 swaps across Mount Gay (20), Captain Morgan (10), Malibu (8). Bacardi
  required no swaps (its leaks were the false-positive añejo mentions).
- Mirror sync: 0 mismatches across 51,242 keys
- Health check: 9/9 PASS, no language drift
- Re-scan with broader agave regex confirms **zero remaining agave leaks on the 4 rum
  bottles** across the entire corpus
- Spot-check 4 previously-leaking pairs all now read with clean rum language:
  - Malibu × Crab Cake: "Caribbean-rum lift with cane"
  - Mount Gay × Brussels: "molasses-light register with citrus"
  - Captain Morgan × Au Gratin: "light-rum register with cane"
  - Mount Gay × Chocolate Brownie: "Caribbean-rum lift with cane"
- Phase 5 closes. The taxonomy split (Session 13) + this targeted cleanup (Session 14) =
  complete elimination of rum/blanco-tequila conflation in the engine and corpus.
- Files modified: `pairing-notes.js`, `engine/fix_rum_agave_v2.js` (new)
- Backups: `pairing-notes.js.pre-s14-*.bak`

### 2026-05-31 — Session 13: Phase 5 begin — LIGHT_SPIRIT subclass split ✅

- Pre-session: 15 LIGHT_SPIRIT bottles identified — 11 tequila blancos (Avion, Clase Azul,
  Corazon, Don Fulano, Don Julio, G4, Gran Patron, Lalo, Mijenta, Patron, Siete Leguas) +
  4 light rums (Bacardi, Mount Gay, Captain Morgan, Malibu).
- Updated `engine/pairing_engine_taxonomy.js` via sandbox protocol:
  - CLASS_DRINKS: LIGHT_SPIRIT removed, RUM_LIGHT + TEQUILA_BLANCO added (now 19 classes)
  - 11 name overrides: blancos → TEQUILA_BLANCO
  - `'rum'` category default: LIGHT_SPIRIT → RUM_LIGHT (catches all 4 rums)
- Updated `engine/drink_x_food_generator.js` via Node script + sandbox copy — 9 substitutions:
  - dcLabel mapping split
  - profileFor LIGHT_SPIRIT branch → dual-class branch (uses dc directly to look up
    pre-existing TEQUILA_BLANCO/RUM_LIGHT entries in LIGHT_SPIRIT_VOICE_DEFAULTS)
  - character fallback branch
  - COMPETITOR_REFS split
  - drinkFlavorsFor switch case
  - class self-map
  - class-keyword filter split (rum keywords vs blanco keywords)
  - Legacy cross-filter retained with doc comment for defensive idempotency
- Updated `engine/avoid_reasoning_pool.js`: replaced LIGHT_SPIRIT block with duplicated
  RUM_LIGHT + TEQUILA_BLANCO blocks (same content for now — class-specific refinement queued
  for Session 14).
- Smoke test confirmed:
  - Bacardi Rum: "crisp workhorse-clean character" + "not a light rum" label ✓
  - Mount Gay Rum: "light-rum register with cane and citrus lift" + "not a light rum" ✓
    (NO AGAVE LEAK)
  - Don Julio Blanco: "workhorse blanco with clean agave snap" + "not a blanco tequila" ✓
  - Patron Silver: "polished silver tequila with agave-forward lift" + "not a blanco tequila" ✓
- Ran `apply_avoid_reasoning.js`: 342 AVOID notes regenerated. All 4 spot-checked label-only
  updates landed correctly. Mirror sync 0 mismatches, health check 9/9 PASS, no language
  drift. DxF snapshot 250/250 stable post-update.
- **Limitation surfaced for Session 14:** Strong/Works tier DxF notes for rum bottles still
  carry pre-Phase-5 agave language (Malibu × Crab Cake says "green-agave-and-cane lift").
  Phase 3's AVOID regen + this session's class-label sweep don't touch Strong/Works notes —
  those need either `engine/fix_rum_language.js` re-run or a targeted DxF regen on the 4 rum
  bottles' templated notes.
- Backups: `engine/pairing_engine_taxonomy.js.pre-phase5.bak`,
  `engine/drink_x_food_generator.js.pre-phase5.bak`,
  `engine/avoid_reasoning_pool.js.pre-phase5.bak`,
  `pairing-notes.js.pre-phase5-*.bak`,
  `pairing-notes.js.pre-apply-avoid-2026-05-31_01-50-56.bak`

### 2026-05-31 — Session 12: Phase 4 close — mine + FxF regen ✅

- Backed up `engine/food_corpus_mined.js` and `pairing-notes.js`
- Ran `node engine/mine_food_corpus.js` (read-only on corpus, writes to food_corpus_mined.js):
  - Editorial scanned: 1,102 notes
  - Templated skipped: 1,420 notes
  - Total fragments: 2,740 across 21 verdict slots + 24 opener slots + 166 unique connectives
    + 14 AVOID exemplars
  - **New verdict slots from Phase 4 editorial** (the engine-scaling property in action):
    MAIN_SOUP_SALAD.strong: 22, STEAK_STARTER.strong: 16, STEAK_SIDE.strong: 14
- Ran `node engine/regenerate_food_x_food.js`: completed in **33.9s** (under 45s timeout).
  Script uses tmp-file + atomic-renameSync — natural protection against partial writes.
  Wrote 51,242 keys total. Auto-created backup as `pairing-notes.js.pre-engine-v4-regen.bak`.
- Mirror sync: 0 mismatches across 51,242 keys.
- Health check: 9/9 PASS, no language drift.
- DxF snapshot: 250/250 unchanged (regen is FxF-only by design).
- FxF snapshot: 9 of 24 anchors drifted — **all intentional** from Phase 4 work
  (Filet × Burrata, Filet × Escargot, Filet × Crab Cake, etc. all reflect the new
  editorial). Locked new baseline with `--update`. Post-update: 24/24 clean.
- **Critical verification** — spot-check on three preserved categories:
  - Phase 3 AVOID reasoning: Larceny × Trout, Belvedere × Tomahawk, Louis XIII × Mushroom
    Bisque all retain their archetype-aware reasoning ✓
  - Phase 4 Session 9 (side × steak): Cowboy Ribeye × Mushrooms ("char meeting forest-floor
    in the same register") preserved ✓
  - Phase 4 Session 11 (main × soup-salad): Chilean Seabass × Butternut Squash ("buttery
    pan-finished flesh that the squash's sweetness primes for...") preserved ✓
- Templated regen output spot-check (non-curated pairs) shows clean composition using the
  mined patterns.
- **Phase 4 closes.** Editorial backfilled for 111 hand-curated pairs (222 with mirrors),
  mining captures the voice for all future regen, FxF anchors locked.

### 2026-05-31 — Session 11: Phase 4 — main × soup-salad × strong ✅

- Enumerated 64 pairs (8 mains × 8 soup-salads where each main lists the soup-salad as
  strong)
- Wrote 64 per-pair editorial entries voice-anchored in course-flow with mains' prep canon
  explicitly honored:
  - Faroe Salmon: "pan-finished rich oily flesh"
  - Chilean Seabass: "buttery pan-finished flesh"
  - Tuxedo-Crusted Tuna: "seared-rare flesh and sesame crust" (CORRECT — tuna IS seared rare)
  - Salt-Cured Halibut: "firm salt-cured flesh"
  - Swordfish: "meaty pan-finished steak"
  - Rainbow Trout: "delicate pan-finished flesh"
  - Roast Half Chicken: "herbed crisp-skin roast"
  - Market Fish: "kitchen-driven" / "white-fish flesh"
- Pre-commit canon scan flagged one "seared crust" match → on inspection, it described the
  tuna's sesame crust (canonical per CLAUDE.md). False positive. Refined the scan pattern
  in § Conventions above to exclude tuna/scallop contexts.
- Sandbox-commit produced 15,810,221-byte sandbox file (matches expected size). Atomic cp
  ran in <1s as isolated command. No truncation issues this session.
- Mirror sync: 0 mismatches across 51,242 keys. Health check: 9/9 pass, no warns. Language
  drift: clean.
- Spot-check on 4 deployed pairs (Salmon × Tomato Basil, Tuna × Chickpea, Seabass × Squash,
  Chicken × Chickpea) — every entry reads as intended with course-flow framing intact.
- Phase 3 AVOID reasoning preserved — no cross-phase regression.
- **Phase 4 editorial-writing complete after Session 11.** Session 12 = mining pass +
  optional FxF regen. After that, Phase 5 begins.

### 2026-05-30 — Session 10: Phase 4 — starter × steak × strong ✅

- Enumerated 26 pairs (gameplan estimate was 52; actual is half because many starter-steak
  combos sit in excellent/gold/avoid rather than strong)
- Wrote 26 per-pair editorial entries voice-anchored in course-flow (starter primes palate
  for cut): tartare → cut, marrow → cut, shellfish → cut, etc. Each carries cut weight + the
  specific palate-transition reasoning.
- Dry-run clean: 52 changes (26 canonical + mirror), 0 missing.
- HITL: Gabe approved continuation.
- **Incident 1 — Failure Mode 3:** Chained the cp into a compound bash command that already
  had Node --commit (11s) + sync + health check. Total exceeded 45s timeout; cp got killed
  mid-stream. Corpus truncated 15.8MB → 10.6MB. Backup intact.
- Recovery: restored from backup, ran cp as isolated bash command (under 1s). File at
  15,800,533 bytes — verified.
- **Incident 2 — cooking-canon drift:** Health check returned 1 warn after first successful
  commit. Caught my own violation: I'd used "seared beef" in `Filet Mignon|Prime Tartare`
  and `Bone-In Filet|Prime Tartare`. Per CLAUDE.md, steaks at Bowdie's are flame-grilled,
  never seared.
- Updated editorial module to use "flame-grilled beef" in both. Edit triggered a different
  OneDrive failure mode (true truncation, not null-padding — Edit cut off file at line 102
  mid-string). Wrote the full corrected module via sandbox protocol, bash-cp'd into place,
  syntax verified clean.
- Re-ran sandbox-commit → cp → mirror sync → health check (each as isolated commands):
  9/9 PASS, no warns, no drift.
- Spot-check 3 deployed pairs: Filet × Tartare ("raw beef into flame-grilled beef"), Cowboy
  Ribeye × Bone Marrow ("both courses speak fat in the same register"), Tomahawk × Shrimp
  Cocktail ("bright classic opener primes the spectacle cut") — all read clean.
- Phase 3 AVOID reasoning still intact (no cross-phase regression).
- **Two new disciplines codified above (§ Conventions):**
  1. Failure Mode 3 (chained-command bash timeout) + isolated-command fix
  2. Pre-commit cooking-canon scan for editorial that describes steaks

### 2026-05-30 — Session 9: Phase 4 begin — side × steak × strong ✅

- Enumerated the cell: **21 pairs** (gameplan estimated 42, but many sides land in excellent
  or gold tier for specific steaks)
- Read the 6 FxF gold standards as voice template: `* The {cut} {connective} the {side} —
  the cut's {character} frames the side's {character}. Gold standard; {hyperbolic praise}`.
  Strong tier is the same structure without the `*` prefix and with composed (not hyperbolic)
  closers.
- Wrote 21 per-pair editorial entries in `engine/fxf_strong_steak_side_editorial.js`.
  Every note: cut weight (10/14/18/26/36/40 oz), pair-specific reasoning grounded in kitchen
  prep (flame-grilled char, rendered fat, bone-deepened marrow, herb-buttered greens),
  varied "Strong; ..." closer.
- Built `engine/apply_fxf_editorial.js` — generic FxF editorial applier with --dry-run
  default + --commit safety. Reusable for Sessions 10, 11.
- Dry-run: 42 pairs to update (21 canonical + 21 mirror), 0 missing.
- HITL gate: Gabe approved commit.
- **Incident:** First --commit attempt timed out. Bash command tried to write 15.8MB
  directly to OneDrive folder. The bash 45s timeout killed the process while OneDrive sync
  was mid-stream. `pairing-notes.js` truncated from 15.8MB → 10.7MB. Health check still
  passed on the truncated file (it was valid JS up to the cut), but ~37K of entries were
  silently missing.
- Restored from `pairing-notes.js.pre-fxf-editorial-2026-05-30_20-00-06.bak`. Verified Phase 3
  AVOID reasoning intact (Larceny × Trout still has the new prose).
- **Protocol update:** Rewrote `apply_fxf_editorial.js` v2 to write the modified corpus to
  `/sessions/.../outputs/pairing-notes.new.js` first (sandbox path, no OneDrive sync), then
  use a separate bash `cp` step to atomically move the file into place. Atomic cp is
  kernel-level, completes before bash returns — no truncation risk.
- Updated SESSION_NOTES.md § Conventions with Failure Mode 2 (timeout truncation) and the
  sandbox-first rule for corpus writes.
- Re-ran with v2 protocol: Replaced 42/42 in 11.5s. Wrote 15,796,405 bytes to sandbox. Atomic
  `cp` to OneDrive completed instantly. File verified at expected size.
- Mirror sync: 0 mismatches, 0 updates needed (because we wrote both directions in the apply
  step).
- Health check: 9/9 PASS.
- Spot-check on 4 deployed pairs: every entry shows the new editorial with cut weight,
  pair-specific reasoning, varied closer.
- Verified Phase 3 AVOID reasoning still in place — no cross-phase regression.
- **Principle reinforced:** atomic kernel-level copy beats large directly-written files. Same
  pattern that fixed the OneDrive null-byte issue in Session 2c applies here at scale.

### 2026-05-30 — Session 3 (resumed): Phase 3 — DEPLOYMENT COMPLETE ✅

- Pre-session: fresh backups of `drink_x_food_generator.js` and `pairing-notes.js` (15MB)
- Wired `pickAvoidReasoning()` into `drink_x_food_generator.js`: import + avoid-branch
  substitution. Sandbox protocol — Node script reads backup, applies 2 edits via string
  replace, writes to outputs/, bash-cp to engine/. Syntax clean.
- Live smoke test of `gen.generate()` for 7 representative AVOID pairs across drink classes:
  Larceny × Trout, Caymus × Crème Brûlée, Frangelico × Creamed Spinach, Tanqueray × Chocolate
  Cake, Belvedere × Tomahawk, Louis XIII × Mushroom Bisque, Casamigos × Salmon. Every output
  landed on correct archetype with concrete reasoning.
- Built `engine/apply_avoid_reasoning.js`: dry-run default, HITL gate, --commit for actual
  write. Editorial detection via legacy "overpowers" + "the plate deserves" pattern.
- Dry-run: 14,992 AVOID notes total, 11,876 templated (will rewrite), 3,116 editorial
  (preserved). Sample diff stratified across all 17 drink classes, written to
  `engine/apply_avoid_diff.txt`.
- **HITL gate: Gabe approved commit.**
- First commit attempt timed out (O(n²) — used regex per change against 15MB file).
  Rewrote to single-pass O(n) approach: read file once, build key→new-value map, single
  regex with callback replaces matching keys in one scan.
- **Commit succeeded:** 11,876 / 11,876 replacements landed in 13 seconds. File grew from
  14.7MB to 15.7MB (+6.3% from added why-clauses).
- `engine/sync_mirrors_dxf.js`: 0 mismatches found across 51,242 keys. Mirror integrity
  preserved.
- `engine/engine_health_check.js`: 9/9 PASS.
- DxF snapshot: 11,876 anchors drifted (intentional — they're the regenerated AVOIDs).
  Locked new baseline with `--update`. Re-run: 250/250 clean.
- FxF snapshot: 4 pre-existing drifts unchanged from Session 2.5.2 (separate corpus issue,
  not from Phase 3 work).
- Live spot-check on 4 deployed notes confirmed:
  - Larceny × Trout: new archetype reasoning ✓
  - Caymus × Crème Brûlée: editorial preserved (had "Works;" closer in the corpus, not the
    "overpowers" template — engine correctly skipped it) ✓
  - Belvedere × Tomahawk: new underclub reasoning ✓
  - Louis XIII × Mushroom Bisque: new "wrong moment" reasoning ✓
- **Phase 2 + Phase 3 complete. 11,876 floor-defensible AVOID notes now live in pairing-notes.js.**

### 2026-05-30 — Session 2.5.2: Phase 2.5 COMPLETE — Engine fully repaired ✅

- Read `pairing_engine_generator.js` v5 generate() (lines 776-820) and orphan v6 fragment
  (828-844) side-by-side. **Surprising finding:** they are byte-identical. The v6
  mined-verdict substitution was already inlined into the canonical `generate()`. The "orphan
  v6 fragment" was pure duplicate dead code from an abandoned mid-edit, never reachable.
- This collapsed the expected v5/v6 merge work into a trivial truncation. No canon decision
  needed. Truncated to line 827 (the proper `};` closing the canonical `module.exports` which
  correctly includes `pickMinedVerdict` in exports).
- Read `consistency_check.js` end-to-end. **Same finding:** lines 172-191 are a straight
  copy-paste duplicate of lines 150-171, not new corpus-bucket checks as expected. No hoist
  work. Truncated to line 171.
- Applied both repairs via sandbox protocol: read backup → `head -n N > outputs/...` → bash
  cp → verify with `node -c`. Both pass.
- Module load test on `pairing_engine_generator.js`: all 13 exports present and `generate` is
  a function.
- **Live consistency check on first run since at least April:** all 5 checks PASS.
  Mining ↔ runtime classification parity, 435 drinks classified, 56 foods classified,
  mined-corpus bucket validity. Zero failures.
- Final survey: **0 of 101 engine files broken**.
- DxF snapshot: 250/250 stable.
- FxF snapshot: 4 of 24 anchors drifted. Investigated — the FxF snapshot reads anchor text
  directly from `pairing-notes.js` (no `generate()` call). Since this session didn't touch
  `pairing-notes.js`, the drift is pre-existing from corpus edits made between the snapshot
  lock (2026-05-06 22:47) and the corpus's last modification (2026-05-07 02:24). Surgical
  fix scripts from AUDIT_v7 — `fix_legacy_gold_leaks.js`, `fix_residual_leaks_v4.js`,
  `fix_remaining_gold_underpromote.js`, `fix_slot_fill_closers.js`, etc. — were the likely
  cause. The drift will need addressing during Phase 8 (final sweep + snapshot relock); out
  of scope for Phase 2.5.
- **Principle reinforced:** investigate before assuming risk. Both expected "merge work"
  cases turned out to be trivial truncations when read carefully. The HITL gate I built into
  the plan wasn't needed because the read showed the answer was unambiguous.
- Backups retained: `pairing_engine_generator.js.pre-repair.bak`, `consistency_check.js.pre-repair.bak`
- No source-of-truth files modified.
- **Phase 2.5 closes. Phase 3 deployment can now proceed from a clean foundation.**

### 2026-05-30 — Session 2.5.1: Phase 2.5 — Two tail-trim repairs ✅

- Backed up all 4 broken files with `.pre-repair.bak` suffix (1.8KB + 9.6KB + 100KB + 54KB)
- Read both target files end-to-end via Read tool to confirm precise logical close before any
  edit. Both unambiguous.
- Repair 1 — `drink_x_food_generator.js`: truncated from 2146 → 2144 lines via sandbox protocol
  (head -n 2144 of backup → outputs/ → bash cp to engine/). Removed orphan
  `VOICE_DEFAULTS,\n};`. `node -c` passes.
- Repair 2 — `audit_steak_side_coverage.js`: truncated from 49 → 48 lines, same protocol.
  Removed orphan ` + k));` fragment. `node -c` passes.
- Sample-ran the repaired audit script. Output is exactly what it should be: "Steaks: 6,
  Sides: 10, Missing tier-classifications: 0, Missing pair-notes: 0" — behavior unchanged
  from the script's intent.
- Re-surveyed all 101 engine files: down from 4 → 2 broken. Remaining are
  `pairing_engine_generator.js` (v5/v6 merge work) and `consistency_check.js`
  (hoist-and-truncate). Both reserved for Session 2.5.2 per the gameplan.
- Health check: 9/9 pass. No regression from the source-file fixes.
- Sandbox protocol used throughout — zero null-byte corruption events. Edit tool not used
  for source files this session (only docs).

### 2026-05-30 — Session 3: Phase 2 deployment — STOPPED, Phase 2.5 opened

- Created backups of `drink_x_food_generator.js` and `pairing-notes.js` before any edit
- Located avoid branch (line 2057-2102) and made the Edit to wire `pickAvoidReasoning()`
- `node -c` failed — discovered `drink_x_food_generator.js` had pre-existing damage at the
  tail (orphan `VOICE_DEFAULTS,\n};` from an abandoned mid-edit)
- Restored from backup; backup was *also* broken (same tail orphan)
- Cascading discovery: `drink_x_food_generator.js` requires `pairing_engine_generator.js`,
  which has *its own* damage (v5/v6 logic duplicated, orphan code fragment, two
  `module.exports` statements, tail orphan)
- Surveyed all 101 engine `.js` files: **4 broken** — `pairing_engine_generator.js`,
  `drink_x_food_generator.js`, `consistency_check.js`, `audit_steak_side_coverage.js`. Same
  abandoned-mid-edit pattern in each.
- **Root explanation:** Phase 2's surgical fix scripts (`break_recycled_phrases.js` et al.)
  edit `pairing-notes.js` text directly without loading any generator. No full regen has been
  attempted since at least 2026-04-27, which is why nobody noticed the engine modules were
  syntactically broken.
- Reverted all Session 3 source modifications. Engine state matches Session 2d close.
- Surfaced to Gabe with three options: (1) repair-and-continue, (2) open Phase 2.5 for
  structural fix, (3) deploy Phase 2 via standalone text-substitution script bypassing the
  generators.
- **Gabe chose Option 2** — structure over speed, the engine is the most important part.
- Created `engine/ENGINE_REPAIR_NOTES.md` with file-by-file damage analysis and repair plan.
- Inserted Phase 2.5 into GAMEPLAN_v1 (2 sessions estimated).
- **Principle reinforced:** when the foundation is unstable, fix the foundation before adding
  weight. Deployment via Option 3 would have shipped the floor-visible quality lift but left
  the engine modules unreachable for any future regen.
- No source-of-truth files modified in final state. Zero deployment.

### 2026-05-30 — Session 2d: Phase 2 — Full 100% AVOID coverage ✅

- Added the remaining 11 drink classes: COCKTAIL_BOLD, TEQUILA_BOLD, LIGHT_SPIRIT,
  COCKTAIL_LIGHT, WHITE_WINE, SPARKLING, VODKA, COGNAC, MEZCAL, HEAVY_SPIRIT, COGNAC_LUXURY
- Pool final state: **328 entries × 192 archetype buckets × 80 cells × 17 classes**
- Coverage: 14,874 of 14,874 AVOID notes (100%)
- Preview verification (`avoid_reasoning_preview_2d.txt`) confirms clean output across all
  new classes. Notable highlights:
  - Vodka × Tomahawk: "vodka is neutral by design — the marbled char deserves a pour with
    character" (steak-big archetype)
  - Mezcal × Broccoli Cheddar: "mezcal smoke fights the soup's cream — smoke has no bridge
    into dairy delicacy" (soup-salad-cream archetype)
  - Louis XIII × Loaded Potato: "an icon cognac on a soup-salad course is wrong moment —
    its register demands the close, not the open"
  - White Wine × Porterhouse: "white wine can't stand up to the marbled char — the cut
    earns a structured red or whiskey" (steak-big archetype)
- One issue surfaced but **not in my pool** — Lalo Silver shows "blanco-tequila or
  blanco-tequila register" (duplicate word from existing `bottle_profiles_curated.js`).
  Documented for Phase 5 LIGHT_SPIRIT subclass split work.
- Sandbox protocol used cleanly throughout — zero corruption events this session
- **Phase 2 infrastructure is complete.** Session 3 wires the picker into the generator,
  runs a small chunk regen with HITL review, then full AVOID-tier regen across 14,874 notes
- No source-of-truth files modified

### 2026-05-30 — Session 2c: Phase 2 — 4 more classes seeded ✅

- Added SWEET_LIQUEUR (1,376 notes / 6 cells), GIN (746 / 3), SWEET_WINE (764 / 5),
  APERITIVO_BITTER (680 / 5) to the v2 archetype-aware pool
- Pool now: 198 entries × 114 archetype buckets × 31 cells × 6 classes
- Coverage running total: 11,858 of 14,874 AVOID notes = 79.7%
- Preview verification (`avoid_reasoning_preview_2c.txt`) shows every food landing in the
  correct archetype sub-pool — Frangelico × Creamed Spinach → side-cream ("the liqueur's
  sugar buries the side's cream"); Tanqueray × Crème Brûlée → dessert-custard ("sharp
  botanicals cut through dairy custard without resolving"); Vin Santo × Tuna → main-fish-crusted
  ("sweet wine dulls the sear's clean char")
- **Process discovery:** OneDrive null-byte truncation triggered on a 1.5KB Edit operation —
  thought to be safe but isn't. Protocol updated: any non-trivial JS modification uses
  sandbox-then-bash-copy, including Edit
- Recovery from broken intermediate: kept `engine/avoid_reasoning_pool.broken.bak` as evidence,
  rebuilt clean v2 + v2c from 5 sandbox parts concatenated via `cat > final.js`
- No source-of-truth files modified

### 2026-05-30 — Session 2b: Phase 2 — Archetype-aware v2 pool ✅

- Built `engine/food_archetypes.js`: 56 menu items mapped to 23 archetypes across 6 categories
  (steak: big/medium/lean; starter: shellfish/dairy/meat/herb; main: fish-delicate/fish-rich/
  fish-crusted/poultry; soup-salad: cream/broth/greens; side: cream/vegetable/glazed/earthy/
  starch; dessert: chocolate/custard/cake-spice/pastry). Coverage report: 56/56 mapped, no gaps.
- Restructured `engine/avoid_reasoning_pool.js` to v2 nested format
  `[drinkClass][foodCategory][archetype]`. Picker now: archetype-specific pool concatenated
  with cell DEFAULT, deterministic-md5 hash by pair key.
- Reseeded BOURBON_BOLD + ELEGANT_RED with 96 entries across 46 archetype buckets in 12 cells.
- Updated preview script for v2 picker signature; added targeted verification section that
  explicitly tests the 3 v1 misfires (Asparagus × Booker's, Seafood Tower × 1881/Château).
- All 3 misfires resolved. Asparagus correctly hits side-vegetable pool ("sweet-oak depth has
  nothing to bridge into green vegetable freshness"). Seafood Tower correctly hits
  starter-shellfish pool ("tannin obliterates the delicate shellfish flavor — a crisp white
  or sparkling carries it cleanly").
- Healthy v1 cases became *sharper*, not just preserved: Crème Brûlée now hits dessert-custard
  ("the red's dry-fruit register has no bridge to dessert tang or sugar"), Tuna hits
  main-fish-crusted ("bourbon's sweet weight crowds the rare crust's clean char").
- **Principle codified:** architectural fixes over patches. When a class of errors is possible
  by design, fix the architecture rather than special-casing.
- Encountered OneDrive sync padding files with null bytes during Write — worked around by
  writing to /sessions/.../outputs sandbox first, then bash-copying. Worth remembering.
- No source-of-truth files modified.

### 2026-05-30 — Session 2: Phase 2 — AVOID reasoning pool seeded (Pareto top 2 classes) ✅

- Located 118 FxF AVOID notes with wc≥60 (the sommelier-grade benchmark; 16+ uniquely-voiced
  patterns covering bold-cut × delicate-starter clashes, cross-protein conflicts, duplications)
- Mapped DxF AVOID volume per (drinkClass × foodCategory) cell — total 14,874 AVOID notes across
  79 cells. Pareto: top 11 cells = 65% of corpus; BOURBON_BOLD + ELEGANT_RED alone = 55.7%
- Built `engine/avoid_reasoning_pool.js` v1: 53 entries across 12 cells (BOURBON_BOLD all 6 +
  ELEGANT_RED all 6). Structure: `[drinkClass][foodCategory] → [{ verb, why, source, tags }]`
- Picker: `pickAvoidReasoning(dc, fcat, pairKey)` — md5-deterministic, even distribution across
  pair-space, returns null for unseeded cells (generator falls back to current "overpowers")
- Wrote preview simulator (`engine/preview_avoid_reasoning.js`) that runs the pool against
  actual AVOID notes. Output to `engine/avoid_reasoning_preview.txt` (148 lines, 36 sample
  before/after pairs)
- **Quality finding from preview:** most cells read sommelier-grade. Verb variety + why-clause
  insertion produces server-defensible reasoning. Three misfires identified where cell-level
  entries assumed one food sub-type but picker hit a different sub-type (asparagus picking a
  dairy clause, seafood tower picking a dairy clause)
- **Design trade-off surfaced for Gabe:** Option A (tighten to food-agnostic entries) vs
  Option B (food-archetype subdivision per cell) — decision drives Session 2b
- No source-of-truth files modified

### 2026-05-30 — Session 1 follow-up: Phase order locked

- Gabe overrode my metric-driven recommendation to do WORKS first
- His reasoning: server uses GOLD/EXCELLENT/AVOID most at the table; AVOID specifically requires
  defending the redirect to a curious guest
- Updated GAMEPLAN_v1 § 3 with "Floor-priority ordering" subsection explaining the principle
- Reordered phases: AVOID first → GOLD/EXCELLENT next → STRONG → LIGHT_SPIRIT → thin →
  WORKS+per-bottle → slot-fill+sweep. Total 24 sessions.
- Added new Phase 3 (GOLD/EXCELLENT verdict reasoning lift) as its own arc — was missing from v1
- Demoted WORKS to Phase 7 and combined with per-bottle variants for regen efficiency
- Updated success criteria § 4 with floor-priority qualitative bar
- **Principle codified:** floor-priority outranks metric measurability when the metric blind-spots
  the dimension that matters

### 2026-05-30 — Session 1: Phase 1 — Diagnostic Calibration ✅

- Pre-calibration JSON report archived as `engine/quality_distribution_report.pre-calibration.json`
- Baseline health check confirmed 9/9 pass before any edit
- Updated `hasSlotFillMismatch` to strip the trailing save-clause sentence (intended engine
  redirect per ARCHITECTURE.md) before scanning for category-label mismatches
- New detection patterns target the real bug per AUDIT_500: "X-on-Y" compounds and "Peak X for
  the Y" closers where Y mismatches the food category
- Added 6 self-tests (3 legitimate save-clauses that should NOT flag, 3 AUDIT_500 patterns that
  SHOULD flag). All 6 pass.
- Added per-class slot-fill ranking to the diagnostic report
- Findings: real slot-fill bug is ~74 notes total across 51,242 (0.14%) — much smaller than
  pre-calibration false-positive view suggested
- Findings: with the noise gone, WORKS-tier connective recycling is the unambiguous #1 metric
  problem. All 15 weakest buckets are WORKS-tier with 102-129% rec rates.
- Quality bar restated: q < 0.40 threshold (15 buckets currently below; ~3,500 notes)
- Documented recommendation to swap Phase 2 ↔ Phase 3 order in GAMEPLAN_v1
- No source-of-truth files modified

### 2026-05-30 — Phase 0 setup

- Full folder audit (51K notes, 491 entities, 18 drink classes, ~135 engine scripts catalogued)
- Quality-distribution diagnostic written + run
- Bucket sampler written + run
- Six distinct root causes for "inconsistency" identified — documented in GAMEPLAN_v1.md
- Multi-session roadmap drafted (~20 sessions estimated)
- No source files modified

---

## Conventions (apply every session)

**Before any source change:**
1. Read this file
2. Identify the session number from GAMEPLAN_v1
3. Run `node engine/engine_health_check.js` — get baseline
4. Run relevant snapshot tests — confirm baseline anchors stable
5. Create `.bak` backups of every file the session will touch
6. Make changes
7. Re-run health check + snapshots → if drift is intentional, lock with `--update`
8. Append a dated entry to GAMEPLAN_v1 § Session Log
9. Update **this file's** "Current status" + "Last session" + "Next session start"
10. List all files modified in "Files modified this session"

**Editorial-write discipline (codified Session 10, refined Session 11, expanded 2026-06-01):**

When hand-writing editorial that describes any menu item, scan every entry against
**both** canons in CLAUDE.md before running the commit:

**Cooking-method canon (steaks/proteins):**
- Steaks at Bowdie's are **flame-grilled, rested, oven-finished**. Never seared.
- Allowed: "flame-grilled char", "grilled crust", "char-and-fat", "rendered fat"
- **Banned on steaks**: "seared crust", "seared fat", "pan-seared", "seared beef"
- These ARE correct on their respective proteins (don't strip):
  - Scallops: seared. "Caramelized sear" is correct.
  - Tuxedo-Crusted Yellowfin Tuna: seared rare. "Seared rare crust" is correct.
  - Salmon / Seabass / Halibut / Trout / Market Fish: pan-finished. Never seared.
  - Chicken: roasted with herbed crisp skin. Never seared.

**Dessert ingredient canon (added 2026-06-01 after Phase 6 sweep):**
- **Carrot Cake — NO raisins, NO nuts, NO walnuts, NO pecans.** Cream cheese + cinnamon
  + warm-spice register only. The 2026-06-01 sweep fixed 90 corpus instances of this
  factual drift via `engine/fix_carrot_cake_canon.js`.
- **Chocolate Brownie — NO walnut crunch.** Fudgy cocoa-and-chocolate weight only.
- **Other desserts:** see CLAUDE.md § "Dessert ingredient canon" for the full list.

The health check's "Language drift" rule catches steak-method violations post-commit, but
NOT ingredient drift. Pre-commit grep prevents the rework cycle:

```bash
# Steak cooking-method scan (excludes legitimate tuna/scallop seared contexts):
grep -n "seared" engine/<editorial>.js | grep -vi "tuna\|scallop" || echo "PASS"

# Dessert ingredient scan — flag any raisin/walnut/nut/pecan in carrot-cake context:
grep -nE "carrot.*?(raisin|walnut|nut|pecan)|(raisin|walnut|nut|pecan).*?carrot" engine/<editorial>.js || echo "PASS"
```

If either grep returns matches that look wrong, fix before commit. Ingredient drift is
harder to detect than cooking-method drift because the health-check regex doesn't cover
desserts. Pre-commit scan is the only catch-net.

**File-write protocol (DEFAULT for all sessions, observed 2026-05-30 — updated post-Phase 4 incident):**

The OneDrive sync layer corrupts files in two distinct ways:

**Failure mode 1 — null-byte padding on smaller writes (observed Session 2c):**
JS files written via the Write/Edit tools get trailing `\0` bytes appended past ~4KB. Silent
until `node -c` reports "Unexpected end of input" past the file's apparent end. Detect with
`tail -c 100 file | od -c`.

**Failure mode 2 — mid-write truncation on large files (observed Phase 4 / Session 9):**
When a bash command writes >10MB directly to a OneDrive-synced path, the bash command can time
out while OneDrive's sync is mid-stream. Result: file gets truncated to whatever bytes had
been flushed when the timeout hit. **Health check still passes** on the truncated file because
it's valid JS up to the cut point — the broken entry is just lost. Detect by comparing file
size to backup: corpus dropped from 15.8MB → 10.7MB in the Session 9 incident.

**Standing workaround — for ANY write to the OneDrive folder:**

1. Write to the sandbox first: `/sessions/<session>/mnt/outputs/<filename>`
2. Verify size in sandbox: `wc -c /sessions/<session>/mnt/outputs/<filename>`
3. Atomic bash-copy into place: `cp /sessions/<session>/mnt/outputs/<filename> <target>`
4. Verify final size matches sandbox size: `wc -c <target>`

The `cp` step is a kernel-level operation that completes before returning — no timeout risk
mid-write because there's no Node process to kill. **This applies to large data files
(pairing-notes.js at 15MB+) as much as JS modules.**

**Failure mode 3 — chained-command bash timeout (observed Session 10):**
Even the atomic `cp` can get killed mid-stream if it's chained into a compound bash command
that already burned most of the 45s budget on earlier steps (e.g. `node ... --commit` taking
11s + cp + sync + health check). The bash process gets killed at 45s regardless of which
step it's currently in. Result: same truncation symptom as failure mode 2.

**Fix:** run each long-running step as its **own isolated bash call**. Specifically:
- `node engine/apply_*.js --commit` (sandbox write) — one call
- `cp /sessions/.../outputs/pairing-notes.new.js pairing-notes.js` — separate call
- `node engine/sync_mirrors_dxf.js` — separate call
- `node engine/engine_health_check.js` — separate call

Never chain the corpus-write `cp` into a compound command. Always its own call.

Rescue for null-padded files (failure mode 1):
```bash
node -e "const buf=require('fs').readFileSync('PATH');let e=buf.length;while(e>0&&buf[e-1]===0)e--;require('fs').writeFileSync('PATH',buf.slice(0,e))"
```

Rescue for truncated files (failure mode 2): restore from `.pre-*` backup. Always create one
before any write.

This rule applies to **every session going forward** — sandbox-first for both JS module writes
and corpus writes.

**HITL gate:** Any script that writes to `pairing-notes.js`, `pairing-map-v2.js`, or any
generator file gets a "show diff first, confirm, then run" treatment. Don't blast through
a regen without surfacing the scope to Gabe.

**Retry cap:** 5 retries on a failing script. Retries 1-2 same approach; retry 3 must use a
different approach with explanation; retry 5 yet another approach. After 5 fails, halt and
escalate — write the failure to this file and stop.
