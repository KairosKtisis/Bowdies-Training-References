# Bowdie's Training Reference — Full Audit
**Date:** 2026-06-07 · **Scope:** features, data/engine, styling/layout, JS functionality, repo hygiene
**Method:** four parallel audit passes + manual verification of every critical claim. Engine checks were actually executed (read-only), not just read.

---

## Verdict

The reference is in **rollout-ready condition at its core**. All four official engine checks pass clean, the data layer is internally consistent at the note level, and every headline feature is complete and functional. What stands between "works" and "cornerstone-grade" is a short list: one pre-rollout blocker (the pre-filled management code), a contrast accessibility gap, ~940MB of backup clutter dragging the OneDrive folder, and a set of documented-but-deferred engine refinements. Nothing structural is broken.

---

## 1. What the reference offers (feature inventory)

**Four guides, ~450 cards total** (~65 cocktails, ~300 spirits, ~50 wines, ~35 dishes):

| Area | Status | Detail |
|---|---|---|
| Home screen + 4 guides | Complete | Spirits / Wine / Prime & Plate / Set the Stage, cinematic tile nav |
| Card system | Complete | Cocktails: Sell It, Staff Notes, Ingredients, Method, Garnish, Pairs With. Spirits/wine: Origin, Price, Tasting Notes, Pairs With. Food: photo, description, price, allergen badges, pairings |
| Search | Complete | Stopword filtering, synonym expansion (french↔france etc.), allergen-phrase normalization, prefix word-boundary matching |
| Filters | Complete | Per-guide primary filters + contextual sub-filters (e.g. Whiskey → Bourbon/Rye/Scotch/Single Malt/Irish/Japanese/Canadian), category accent colors |
| Device gate + roles | Complete | One-time name + optional management code (SHA-256), staff/management roles, Reset Device. Soft gate by design — attribution, not security |
| Menu Admin (86 system) | Complete | Management-only, OOS toggling with timestamp + attribution, persists to localStorage, grays cards, suppresses from pairing recs, toast feedback |
| Set the Stage — Pairing Browser | Complete | Search any item → tiered pairings (Gold/Excellent/Strong/Works/Avoid), profile tags, category filter, navigable recommendations, recents (6), OOS banners |
| Set the Stage — Compare | Complete | Any two items → verdict tier + engine reasoning note |
| Set the Stage — First-Timer | Complete | Quick (3–4 Q) or In-Depth (6–10 Q) flow → tiered recommendations across 24 categories, max 30 suggestions |
| Loop recovery | Complete | Standalone circuit-breaker page; 5 loads in 5s → storage clear + recovery flow |
| Lazy data loading | Complete, by design | The 17.5MB pairing dataset (map + notes) is NOT in the boot `<script>` tags — `lux-enhance.js:107–124` injects it 300ms after boot to keep the JS heap under Safari's memory ceiling. Two audit passes flagged this as a "critical missing file" bug; **verified false** — it is intentional and working |

**Retired by scope-down (Apr 2026):** seating/table view, sessions, group mode. `table-defs.js` (35 tables) and `Table-View/` photos remain as orphans of that era. `Bowdies-Lux-Preview.html` is a disconnected standalone design preview.

---

## 2. Data layer + engine (checks executed 2026-06-07)

### Official pipeline — all pass

| Check | Result |
|---|---|
| `engine_health_check.js` | **9 pass / 0 warn / 0 fail** |
| `engine_snapshot_test.js` | **OK** — 250/250 DxF anchors, 0 drift |
| `engine_fxf_snapshot.js` | **OK** — 24/24 FxF anchors stable |
| `audit_tier_note_mismatches.js` | **0 mismatches** / 2,522 COURSE_TO_DESSERT pairs |

### Corpus facts (verified live, not from docs)

491 entities (435 drinks + 56 foods), 0 unclassified. **51,242 directed notes** = 25,621 unique pairs, all keys valid, all mirrored cleanly. Map: 51,959 directed tier entries — gold 720, excellent 5,335, strong 7,936, works 22,979, avoid 14,989. Templated/editorial split: **14,176 templated / 37,066 editorial (27.7% templated)**.

### Findings beyond the official pipeline

1. **`consistency_check.js` FAILS** — 19 stale mined-corpus buckets still keyed to the retired `LIGHT_SPIRIT` class (taxonomy split it into `RUM_LIGHT` + `TEQUILA_BLANCO`). Dead weight, not corruption; a re-mine clears it.
2. **Generalized tier-label audit** (`audit_tier_mismatches_all.js`): 486 of 51,242 notes (0.9%) carry verdict labels disagreeing with the map tier — biggest buckets: 182 excellent→gold, 70 excellent→no-label, 52 strong→works.
3. **Map mirror asymmetries** (notes themselves are clean): 3 one-directional avoid entries (Scallops→Not a Paper Plane, Burrata→Inhibited, Cheesecake→Fireball), 33 genuine A↔B tier conflicts (e.g. Filet lists Adictivo Cristalino *strong*, Adictivo lists Filet *gold*), and 490 one-sided gold flags (only ~115 of 720 gold pairs are symmetric). The one-sided golds may be intentional directional picks — needs a ruling, because canonicalization assumes mirror integrity.
4. **`entity-character.js` missing 4 red wines:** Alexander Valley Homestead Red, St Supéry Cab, 1881 Napa Valley, San Simeon Stormwatch.
5. **CLAUDE.md is stale on three facts:** says 50,646 notes (actual 51,242), documents 18 classes including `LIGHT_SPIRIT` (actual 19 with the rum/blanco split), and says ~33K templated / ~17K editorial (actual is the reverse: 14K/37K).

### Open milestones from engine docs

AUDIT_v9 (2026-06-02) declared the engine **ready for staff training rollout**. Deferred items: Bruichladdich × Burrata mis-attributes peat smoke to an unpeated whisky (one-line fix), 66 still-templated notes optional lift, FxF audit items 5 & 7 (drink-side reciprocal anchors for gold FxF pairs; per-bottle alternatives in duplication-avoid templates), and Phase-10 per-bottle variants for ~429 long-tail bottles.

---

## 3. Styling / layout

The three-layer cascade (styles.css v26 → set-the-stage.css v23 → lux-theme.css v90) is **functionally sound**. The lux skin fully owns the visual language; the cost is `!important` layering over legacy code.

**High priority — contrast (WCAG AA failures).** `--text-dim` (#6C6251) on `--surface` (#100D0A) ≈ 2.8:1 (fails 4.5:1); `--text-muted` ≈ 4.2:1 (borderline). Tag text on faint gold backgrounds is the worst case. For a tool read on phones in a dim restaurant, this is worth fixing — bump `--text-dim` and audit small-text usage.

**Medium — internal contradictions across lux passes.** `.card.expanded` background is defined in both the v42 base (line ~170) and v67 structure pass (~514) with different values — v67 wins today, but commenting either silently changes the design. Same pattern for `.filter-btn.active` (needs its "STATE RE-ASSERTIONS" block to survive the v66 lens unifier). Consolidation pass recommended.

**Medium — responsive max-width fragmentation.** 420 → 760 (search) → 860 (stage screens) → 1000 (filter bars) → 1240 (grid). On iPad landscape these produce visible asymmetry. Pick a system.

**Low.** ~10–20% of styles.css is dead (`.header`, `.guide-tabs`, `.footer`, sticky `#top-bar`, grain/vignette). The legacy `.card::before` gold shimmer still fires on hover — predates the lux language. `.admin-topbar-btn` and `#top-bar-return` share the same fixed coordinates at z-450 (no active collision — different screens — but undocumented). set-the-stage.css retains a few pre-lux seams (`.rec-group` opaque slab, one sharp-cornered search-results panel).

**Solid:** safe-area handling on all pinned elements, `:focus-visible` + selection + reduced-motion all correctly implemented, tap targets ≥36px, typography system (Playfair/Cormorant/Josefin) consistent with unified microcaps rhythm, no undefined CSS variables anywhere.

---

## 4. JavaScript functionality

~2,600 lines of active app code across 6 modules + inline loop guard. No console.log debris. Defensive `typeof` checks on most globals. localStorage paths have corruption guards in auth, admin, and recents. Modern-browser baseline (crypto.subtle, ES6) — fine for the device fleet.

**Pre-rollout blocker.** `index.html:80` ships the management code **pre-filled in the password input** (`value="rapid72396"`, marked TEMP for Lydia's preview). Anyone who views source — or just taps Enter — gets management. The SHA-256 gate is soft by design, but this defeats even the friction. Remove the `value` attribute before staff rollout and rotate the code.

**Worth fixing soon:**

1. **Search debounce not cleared on navigation** (`set-the-stage.js` ~597) — type fast, tap a result, and the stale callback can fire after the detail renders.
2. **pbOpen() race** — state resets unconditionally; rapid navigation between pairing items can wipe a render in flight.
3. **Missing null guards** — `#admin-list` innerHTML write, `#grid-wine`/`#grid-food` insertBefore, `ftQuestions`/`CMP_TIERS` never typeof-checked.
4. **Verify 86-toggle propagation** — confirm the home-grid cards re-gray immediately after an admin toggle (the overlay re-apply hooks exist in the lazy-loader; the toggle path needs a check).
5. **Silent localStorage failures** — quota/disabled storage swallows the 86 persist with no user feedback.

**Perf nits (low):** `applyFilters()` re-queries `.card-detail` per card per pass (~450 cards); canvas recreated on every resize in the two alignment functions; `injectFoodPhotos` re-scans on every card open. None of these are user-visible today.

**Inconsistent innerHTML escaping** (`set-the-stage.js:225` result names unescaped) — injection risk is effectively nil since all names come from the static data file, but worth normalizing to `escapeHtml` everywhere for hygiene.

**localStorage keys in use:** `bc_loop_guard_v1`, `sts_device_profile_v2`, `sts_oos_items_v1`, `sts_oos_migration_v1`, `bc_sts_pb_recents_v1` (+ legacy `sts_v6` read-only merge). Five retired v1 auth keys are never cleaned off old devices.

---

## 5. Repo hygiene

This is the biggest raw number in the audit: **~940MB of root-level backup files (84 `.bak`/`.pre-*` copies, mostly ~16MB pairing-notes snapshots) — about 72% of the 1.3GB repo** — all syncing through OneDrive. engine/ adds 46+ bak/tmp/checkpoint files (~3MB) plus dozens of one-off audit .txt outputs. Also deletable: `sedFNk1NB` (stray index.html copy), 6 `batch*_diff_sample.md` files, `archive/` (1.2MB), `_lux_backup_2026-06-05_194423/` (1.1MB). Recommendation: keep the 3 most recent pairing-notes backups, archive the rest outside OneDrive or delete.

---

## 6. Prioritized action list

**Before staff rollout**
1. Remove `value="rapid72396"` from index.html:80; rotate the management code.
2. Contrast pass: raise `--text-dim`, audit small text on dark surfaces.

**Next working session**
3. Backup purge (~940MB) — biggest effort-to-value ratio in the repo.
4. Clear-debounce + pbOpen guard + the null guards (an hour of work total).
5. Verify 86 toggle re-grays home cards live.
6. Bruichladdich peat-smoke one-liner fix.

**Engine maintenance (next regen cycle)**
7. Re-mine corpora to purge the 19 stale LIGHT_SPIRIT buckets (turns consistency_check green).
8. Triage the 486 tier-vs-label disagreements (0.9%) — mostly map-bump vs note-regen calls.
9. Rule on the 490 one-sided gold flags (intentional or drift?); fix the 3 missing avoid reciprocals + 33 A↔B conflicts.
10. Add the 4 missing red wines to entity-character.js.
11. Update CLAUDE.md: 51,242 notes, 19 classes (RUM_LIGHT/TEQUILA_BLANCO), 27.7% templated.

**Eventually**
12. CSS consolidation pass (merge duplicate lux definitions, delete dead styles.css sections, unify max-widths).
13. Normalize innerHTML escaping; legacy localStorage key cleanup; decide fate of table-defs.js / Lux-Preview / Table-View orphans.

---

*Verification note: every "critical" agent finding was manually re-checked. The two flagged data-loading "bugs" were confirmed false (intentional lazy-load). The pre-filled management code, engine check results, note counts, and backup sizes were confirmed real.*
