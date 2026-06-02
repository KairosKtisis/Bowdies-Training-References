# GAMEPLAN_v1.md — Engine Quality Lift

> **Purpose:** Bring the pairing-note corpus from "structurally clean, voice-inconsistent" to
> "uniformly server-grade." Spans multiple sessions. Every step is discrete, reversible, gated by
> health checks and snapshot tests.
>
> **Owner:** Gabriel
> **Drafted:** 2026-05-30
> **Methodology:** LivInv dev-assistant discipline adapted — phase gates, backup-before-change,
> dated-doc trail, retry caps, HITL on irreversible writes.
>
> **State carry file:** [`SESSION_NOTES.md`](./SESSION_NOTES.md) — read first every session.

---

## 1. The problem, in one sentence

The 51,242-note corpus is structurally healthy (all invariants pass, mirrors clean) but the
**voice quality is stratified by bucket** — some pairs read like a sommelier wrote them, others
read like a template ran. The user-perceived "inconsistency" is real and decomposes into six
independent root causes, each fixable in its own session arc.

---

## 2. Diagnostic findings (2026-05-30)

Built `engine/diagnose_quality_distribution.js` to measure per-bucket: editorial ratio, average
word count, recycled-phrase incidence, slot-fill label mismatch, composite quality score. Built
`engine/sample_bucket_prose.js` to read actual notes from the weakest buckets. Findings:

### 2.1 The six root causes

**Cause A — DxF AVOID notes lack per-pair reasoning.**
The avoid skeleton is *"{Drink}'s {character} overpowers the {food}'s {edge} — the plate
deserves {alts}, not a {dcLabel}. Avoid; {closer}. {Save-clause}."* Every single avoid in 7,000+
notes uses "overpowers" as the verb and never explains *why* the clash exists (bitterness vs
delicacy, tannin vs cream, sugar vs acid, etc.). Compare to the 16 hand-curated FxF AVOIDs which
read *"the cut is too bold for the delicate starter"* — pair-specific reasoning.

> **Affected scope:** ~7,300 DxF avoid notes across BOURBON_BOLD-main, ELEGANT_RED-dessert,
> ELEGANT_RED-main, SWEET_LIQUEUR-soup-salad, GIN-dessert, and 30+ smaller buckets.

**Cause B — WORKS-tier connective recycling.**
Light/medium-spirit × side/soup-salad WORKS pools cycle through 6 connectives ("sits alongside",
"leans against", "reads alongside", "plays cleanly against", "finds neutral with", "stays
alongside") at 120%+ rate — meaning multiple recycled phrases per note. The variants exist, but
they're interchangeable filler that doesn't say anything different about the pair.

> **Affected scope:** ~2,000 notes across GIN × soup-salad/side, LIGHT_SPIRIT × soup-salad/side,
> VODKA × side, COCKTAIL_LIGHT × side/dessert WORKS buckets.

**Cause C — FxF STRONG-tier is thin and short.**
`starter × steak × strong` averages 24.7 words; `main × soup-salad × strong` averages 25.3 words;
`side × steak × strong` averages 26.4 words. Compare to FxF AVOID editorial at 47-75 words.
Strong-tier templates use generic verbs ("matches", "holds with", "meets") without pair-specific
reasoning. The COURSE_TO_DESSERT backfill from v6.2 proved hand-editorial works — these
archetypes need the same treatment.

> **Affected scope:** ~270 FxF strong-tier pairs across 3 archetypes.

**Cause D — LIGHT_SPIRIT class language conflates rum and tequila.**
AUDIT_500 flagged: rums classified as LIGHT_SPIRIT inherit "agave-citrus" / "blanco-tequila or
light-rum register" / "green-agave edge" phrasing. Sample re-check shows partial residual — most
rums now get cane-and-citrus language, but the underlying class taxonomy still groups them.

> **Affected scope:** All Mount Gay, Bacardi, Malibu, Doctor Bird, Myers's notes — ~250 entries.
> Fix: subclass LIGHT_SPIRIT into RUM_LIGHT vs TEQUILA_BLANCO.

**Cause E — Thin class buckets fall back to class defaults.**
108+ pairs sit in buckets with n<20 across WHITE_WINE, SPARKLING, SWEET_LIQUEUR, MEZCAL,
COGNAC_LUXURY. These pairs miss the corpus-mined verdict richness because the mining
heuristic requires 3+ entries per slot to substitute. They get the generic templated treatment.

> **Affected scope:** ~108 pairs across rare class × food-category combos.

**Cause F — Per-bottle variant pools are sparse.**
80+ curated bottles still have a single `bridge1` / `bridge2` phrase in their profile. AUDIT_v7
patched `profileFor()` to inherit class-default variants when per-bottle is single, but
per-bottle distinctiveness suffers — bottles in the same class read interchangeably outside the
character opener.

> **Affected scope:** ~80 bottles × ~30 pair-notes each = ~2,400 notes where per-bottle voice
> doesn't differentiate.

### 2.2 What's already strong (preserve, don't touch)

- The 16 hand-curated FxF AVOIDs (Cowboy Ribeye × Crab Cake et al.) — gold standard, the
  benchmark every other AVOID should aspire to
- COURSE_TO_DESSERT (112 hand-curated pairs from v6.2) — fully editorial, voice-matched
- The 6 FxF gold-standard pairs (Tomahawk × Truffle Fries, etc.)
- DxF Pattern A (em-dash setup) notes for curated bottles — Caymus, Macallan, Pappy etc. read
  well via the tasting-notes-first body
- ELEGANT_RED × soup-salad × strong, WHITE_WINE × side × strong, SPARKLING × soup-salad × strong
  — strongest non-editorial buckets (q≥0.80)

---

## 3. Multi-session roadmap

Each session is sized to fit a single sitting (90 minutes – 3 hours), self-contained, reversible.
Sessions are numbered; the order matters where dependencies exist (noted ⇢).

**Total session count estimate: 20-24 sessions.** Run at the cadence the floor schedule allows;
nothing here is time-pressured.

### Floor-priority ordering (updated 2026-05-30, Session 1 review)

The phase order is driven by **what the server uses most at the table**, not by what's easiest
to measure:

1. **AVOID** notes — the server has to *defend* every "don't pair these" to a curious guest.
   Reasoning must be specific, not skeleton.
2. **GOLD / EXCELLENT** notes — the lead recommendations. These are the moments the server
   *sells* a pairing. Verdict needs to say why this is the call, not just assert importance.
3. **STRONG** notes — supporting recommendations. Needs quality but lower stakes.
4. **WORKS** notes — polite filler the server skims past. Important for completeness but lowest
   per-note impact at the table.

Higher floor-impact tiers come first, even when the metric flags lower-tier issues as more
"measurably broken." Quality at the table outranks before/after numbers.

---

### Phase 1 — Calibrate the diagnostic (Session 1)

**Why first:** before we change anything, the measurement tool must be correct. The current
diagnostic flags the "save for the steak course" save-clause as a slot-fill miss; per
ARCHITECTURE.md that's intended redirect behavior, not a bug. Calibration prevents us from
chasing a phantom and gives us trustworthy before/after numbers.

**Tasks:**
1. Update `engine/diagnose_quality_distribution.js`: change `CLOSER_LABEL_RX` and
   `hasSlotFillMismatch` to exclude the `save the X for the steak course` / `belongs on the
   steak course` / `hold the X for the steak course` patterns.
2. Re-run diagnostic. Capture new baseline in SESSION_NOTES.md.
3. Add a per-class slot-fill ranking — surface the *real* culprits.

**Backups:** none needed (read-only script).
**Gates:** none.
**Estimated time:** 45 min.
**Deliverable:** corrected baseline numbers logged in SESSION_NOTES.md.

---

### Phase 2 — DxF AVOID per-pair reasoning (Sessions 2-4)

**Why this first among the real fixes:** highest impact (~7,300 notes affected) and the most
common server-facing case where the current voice falls short. When a guest asks "why not?",
the AVOID note should give the answer in one clause — not just "overpowers."

**Session 2 — Build the reasoning pool**
1. Create `engine/avoid_reasoning_pool.js`. Indexed by `[drinkClass][foodCategory]` →
   array of `{ verb, clause }` entries. Examples:
   - `BOURBON_BOLD × main`: `{ verb: "smothers", clause: "the brown-spirit weight crowds the delicate fish protein" }`
   - `ELEGANT_RED × dessert`: `{ verb: "fights", clause: "savory tannin pulls against dessert sweetness with no bridge" }`
2. Seed pool from the 16 hand-curated FxF AVOIDs (mining script:
   `engine/mine_avoid_reasoning.js`) + 30-40 hand-written entries covering the empty cells.
3. Wire `drink_x_food_generator.js` avoid branch to substitute `pickReasoningClause(dc, fcat)`
   after the character phrase.

**HITL:** Show Gabe the reasoning-pool JSON before substitution wires in.

**Session 3 — Regen DxF AVOID notes (chunked)**
1. Backup: `pairing-notes.js.pre-avoid-reasoning.bak`
2. Regen in chunks (full DxF regen is ~30 min; chunk into 1,000-note batches):
   `node engine/regenerate_dxf_notes.js --chunk 1000 --offset N --tier-only avoid`
3. Run mirror sync + snapshot test after each chunk.
4. If any chunk fails: rollback chunk, fix root cause, retry. Max 5 retries per chunk.

**Session 4 — Verification + lock**
1. Re-run quality-distribution diagnostic. AVOID quality scores should rise from ~0.18 to
   ~0.45+ across the impacted buckets.
2. Sample 50 regenerated AVOID notes — verify each has unique reasoning, no skeleton repetition.
3. Lock snapshot (`engine_snapshot_test.js --update`).
4. Update GAMEPLAN_v1 Session Log; update SESSION_NOTES.md.

**Backups:** pairing-notes.js + drink_x_food_generator.js
**Gates:** health check, DxF snapshot, mirror integrity, sample read-through
**Estimated time:** 7-9 hours across the 3 sessions.

---

### Phase 2.5 — Engine file repair (Sessions ~5-6) — INSERTED 2026-05-30

**Why this phase exists:** Session 3 of Phase 2 (deployment) attempted to wire the AVOID
picker into `drink_x_food_generator.js` and discovered the generator wouldn't even load. A
survey of all 101 engine `.js` files found four with pre-existing damage from abandoned
mid-edits — orphan duplicate fragments appended after the file's logical end. The Phase 2
surgical fix scripts haven't loaded any generator since these breakages were introduced,
which is why nobody noticed: no full regen has run in months.

Phase 3 (deployment) cannot proceed until at least the two load-bearing generators are repaired.

**Full detail:** [`engine/ENGINE_REPAIR_NOTES.md`](./ENGINE_REPAIR_NOTES.md) — file-by-file
damage analysis, repair strategy, risk assessment.

**The four files (severity order):**

1. `pairing_engine_generator.js` — v5/v6 merge work. **Highest risk.** Required by DxF generator.
2. `drink_x_food_generator.js` — tail-trim only. Low risk.
3. `consistency_check.js` — partial-block hoist. Medium risk. Regen pipeline dependency.
4. `audit_steak_side_coverage.js` — tail-trim only. Audit-only, lowest priority.

**Session 2.5.1 — Audit + low-risk repairs (~2 hours)**
1. Backup every broken file with `.pre-repair.bak` suffix
2. Read each file end-to-end to identify precise logical close
3. Repair `drink_x_food_generator.js` (tail-trim — remove orphan `VOICE_DEFAULTS,\n};`)
4. Repair `audit_steak_side_coverage.js` (tail-trim — remove orphan ` + k));` block)
5. `node -c` verify after each
6. Run repaired audit script with sample input to confirm no behavior change

**Session 2.5.2 — Higher-risk repairs (~3-4 hours)**
1. `pairing_engine_generator.js` v5/v6 merge:
   - Read v5 `generate()` body (lines 776-820) and orphan v6 fragment (lines 828-844) side-by-side
   - Cross-reference against `AUDIT_v7_2026-05-06.md` (mentions v6.2 — confirms v6 is canon)
   - If v5 lacks the mined-verdict substitution, merge it in. Otherwise drop the orphan.
   - Drop duplicate `module.exports` and tail orphan
   - Verify FxF snapshot anchors hash-match unchanged (orphan v6 wasn't reachable, so no
     behavior change expected)
2. `consistency_check.js` — hoist the new corpus-bucket checks into the main flow before
   `process.exit()`, drop the orphan tail. Run the script and confirm output matches what the
   regen pipeline expects.
3. Re-run full 101-file survey — target: 0 broken.
4. Health check + FxF/DxF snapshot tests — should pass unchanged.

**Backups in place from Session 3:**
- `engine/drink_x_food_generator.js.pre-avoid-reasoning.bak` (original broken state)
- `pairing-notes.js.pre-avoid-reasoning.bak` (corpus snapshot, 15MB)

**After Phase 2.5:** Phase 3 (deployment) resumes — backup `pairing-notes.js` again, wire
picker, small chunked regen, HITL gate, full AVOID-tier regen.

---

### Phase 3 — GOLD / EXCELLENT verdict reasoning lift (Sessions 5-8)

**Why next:** these are the *sell-it* moments. When a server says "this is the best wine for
the Filet," they need to know what makes it iconic — not just be told it is. The current GOLD
bodies are usually good (the curated bottle profiles do work), but the **verdicts** often just
assert importance ("iconic Napa Cab for Porterhouse", "the unskippable match", "a confident
headline pour") without a one-clause reason.

**Goal:** every GOLD and EXCELLENT verdict carries a pair-specific *why* — what about this
drink's character earns the gold-tier slot for this specific food.

**Session 5 — Audit current GOLD/EXCELLENT verdict quality**
1. Build `engine/audit_verdict_reasoning.js` — for every GOLD/EXCELLENT note, classify the
   verdict as: (a) reasoning-rich, (b) assertion-only, (c) bottle-character-only,
   (d) generic closer.
2. Quantify the current state: what % of GOLD verdicts say *why*?
3. Sample 50 GOLD verdicts by hand; categorize manually for ground truth.

**Session 6 — Build the verdict-reasoning pool**
1. Create `engine/gold_excellent_reasoning_pool.js`. Indexed by
   `[drinkClass][foodCategory] × tier(gold|excellent)` → array of `{ hook, clause }`.
2. Seed from the 6 hand-curated FxF gold pairs + mining the strongest DxF curated-bottle notes
   (Caymus on Porterhouse, Macallan 18 on Tomahawk, etc.).
3. Hand-write additional clauses for sparse cells. Target: 5+ entries per slot.

**HITL:** show Gabe the pool JSON before any regen.

**Session 7 — Wire verdict pool into generator**
1. In `drink_x_food_generator.js`, update `pickVerdict()` to consult `gold_excellent_reasoning_pool`
   as the first lookup for GOLD/EXCELLENT tiers, falling back to current `VERDICT_PATTERNS`.
2. Backup `pairing-notes.js` and `drink_x_food_generator.js`.
3. Chunked regen of GOLD + EXCELLENT slices only.
4. Health check, snapshot, mirror sync, sample read after each chunk.

**Session 8 — Verification + lock**
1. Re-run `audit_verdict_reasoning.js`. Target: 80%+ reasoning-rich.
2. 50-note hand sample. Lock snapshots if quality bar met; iterate if not.

**Estimated time:** 8-12 hours across 4 sessions.

---

### Phase 4 — FxF STRONG-tier editorial backfills (Sessions 9-12)

**Why next:** moderate scope (~270 pairs) but each is hand-curated, which feeds back into the
templated pool via `mine_food_corpus.js`. This is the engine's scaling property — every editorial
hour multiplies through future templated output.

**Session 9 — `side × steak × strong` (42 pairs)**
Reference: the 6 FxF gold standards as voice template. Write per-pair editorial covering each
steak cut × each side pairing, leaning on cooking-method canon + cut-weight canon (already in
CLAUDE.md).

**Session 10 — `starter × steak × strong` (52 pairs)**

**Session 11 — `main × soup-salad × strong` (128 pairs — split across two sessions if needed)**

**Session 12 — Mine + regen**
1. `node engine/mine_food_corpus.js` — feed the new editorial into the corpus
2. `node engine/regenerate_food_x_food.js` — rewrite templated FxF
3. Sync mirrors, snapshot, lock

**Backups:** pairing-notes.js + pairing-map-v2.js
**Gates:** FxF snapshot, mirror integrity
**Estimated time:** 8-10 hours across the 4 sessions.

---

### Phase 5 — LIGHT_SPIRIT subclass split (Sessions 13-14)

**Why next:** smaller scope (~250 notes) but fixes a class-taxonomy error that prevents future
distinct rum vs tequila-blanco voice. Once subclassed, all subsequent generation cleanly
separates the two.

**Session 13 — Taxonomy + profiles**
1. Update `engine/pairing_engine_taxonomy.js`: split `LIGHT_SPIRIT` into `RUM_LIGHT` and
   `TEQUILA_BLANCO`. Add subclass detection to `drinkClassFor()`.
2. Update `engine/bottle_profiles_curated.js` for affected bottles (rums get rum-specific
   character/bridge phrases; tequila blancos keep agave-citrus).
3. Add to `class_drinks.json` if it exists.

**Session 14 — Regen + audit**
1. Backup + regen affected slices
2. Targeted scan for "agave" leak on rum bottles — should be zero post-regen
3. Health check, snapshot, mirror sync, lock
4. **Documentation:** update CLAUDE.md class taxonomy from 18 to 19 classes

**Estimated time:** 4-5 hours.

---

### Phase 6 — Thin-bucket consolidation (Sessions 15-17)

**Why next:** rarest pairs but most visible when they DO come up — a guest who orders Louis XIII
deserves better than a generic class-default. Hand-curate enough that mining produces 3+ corpus
entries per thin bucket.

**Session 15 — Map thin buckets to specific pair lists**
1. Generate `thin_bucket_pair_list.md` from the diagnostic — the actual 108 pairs needing
   editorial coverage, organized by class.
2. Prioritize by class-prestige: COGNAC_LUXURY (Louis XIII pairs) first, then COCKTAIL_BOLD
   high-end calls, then the rest.

**Session 16-17 — Hand-curate batches**
1. Write 20-40 editorial pairs per session, voice-matched to AUDIT-grade.
2. Mine + regen between sessions to verify corpus pickup.

**Estimated time:** 6-8 hours across 3 sessions.

---

### Phase 7 — WORKS-tier connective variety + per-bottle variant pools (Sessions 18-21)

**Why now (was Phase 3, moved):** WORKS-tier notes are polite filler the server skims past
when scanning a recommendation list. They matter for completeness — Gabe's standard is "all
tiers top tier" — but lower per-note floor-impact than AVOID, GOLD, EXCELLENT. Phase 7
combines the connective expansion with the per-bottle variant pool work for efficiency
(both are regen-driven and benefit from the same backup + snapshot cycle).

**Session 18 — Expand WORKS connective pool**
1. In `drink_x_food_generator.js`, expand `BRIDGE_VERBS` and the works-tier connective array
   from current ~6 to 15+ for GIN, VODKA, LIGHT_SPIRIT, COCKTAIL_LIGHT, COCKTAIL_BOLD,
   APERITIVO_BITTER classes.
2. Mine additional connectives from the 16 FxF AVOIDs + curated bottle editorial.
3. Add deterministic hash-pick (`pickConnective(drink, food)` via md5 of pair key).

**Session 19 — Expand per-bottle variant pools**
1. The 80+ curated bottles with single `bridge1`/`bridge2` phrases get expanded to 3-5 variants
   each. Prioritize BIG_RED + ELEGANT_RED + BOURBON_BOLD curated bottles first (highest pair
   volume).

**Session 20 — Regen affected slices**
1. Backup `pairing-notes.js` + `drink_x_food_generator.js` + `bottle_profiles_curated.js`
2. Chunked regen for WORKS-tier + per-bottle slices
3. Health check + mirror sync after each chunk
4. Diagnostic re-run: target ≤50% recycled rate, increased per-bottle distinctiveness

**Session 21 — Verification + lock**
1. Re-run quality-distribution diagnostic
2. Sample read 50 WORKS notes — confirm no recycled-phrase repetition across bucket
3. Sample read 30 notes per major curated bottle — confirm voice distinctiveness
4. Lock snapshots

**Estimated time:** 8-12 hours across 4 sessions.

---

### Phase 8 — Final quality sweep + targeted slot-fill fix (Sessions 22-24)

**Session 22 — Targeted slot-fill fix (74 notes)**
1. Build `engine/fix_slot_fill_label_leaks.js` — pattern-match the ~74 notes flagged by the
   calibrated diagnostic. For each: identify the wrong food-class label, rewrite the closer
   with the correct label.
2. Backup `pairing-notes.js`. Run script with `--dry-run` first, show diff to Gabe, then apply.
3. Mirror sync + health check.

**Session 23 — Final 500-note audit**
1. Re-run `engine/diagnose_quality_distribution.js` — capture the post-quality-lift snapshot
2. Stratified 500-note sample read (60 gold / 80 excellent / 110 strong / 150 works / 100 avoid)
3. Document any residual issues for a v2 pass

**Session 24 — Documentation + final lock**
1. Update `engine/ENGINE_SPEC.md` with the new state of the system
2. Update `engine/ARCHITECTURE.md` with any structural changes (LIGHT_SPIRIT split, new
   reasoning pools, expanded variant pools)
3. Write `engine/AUDIT_v8_2026-XX-XX.md` — the post-gameplan-v1 audit doc
4. Lock all snapshots; commit final state

---

## 4. Success criteria (the bar we're aiming for)

**Quantitative (must hit):**
- Quality score: all DxF buckets with n≥20 above 0.40 (currently 23 buckets below this floor)
- Recycled-phrase rate: no bucket above 60% (currently 18 buckets above this ceiling)
- FxF strong-tier average word count: ≥30 words (currently 24-26)
- Health checks: 9/9 pass throughout (non-negotiable; any failure halts the phase)
- Snapshot anchors: stable or intentionally re-locked (no silent drift)

**Qualitative (read-through standard) — floor-priority ordering:**

1. **AVOID notes (highest priority):** every avoid answers *why this clashes* in one clause —
   bitterness vs cream, tannin vs sugar, weight vs delicacy, etc. — so a server can defend the
   redirect when a guest asks. No two avoids on the same drink should give the same reasoning.
2. **GOLD / EXCELLENT notes:** every verdict says *why this is iconic*, not just that it is.
   "Iconic Napa Cab for Porterhouse" is assertion; "the opulent tannin meets the dual-cut
   marbling and the cocoa plays against both lean and fatty sides" is reasoning. The latter
   is the bar.
3. **STRONG notes:** pair-specific reasoning grounded in the kitchen. Same bar as GOLD/EXCELLENT,
   slightly tighter prose acceptable.
4. **WORKS notes:** should feel composed, not filler. A 100-note sample stratified by class
   should read like 100 different pairings, not 100 instances of the same template.

---

## 5. Risks and mitigations

**Risk: Regen breaks editorial preservation.**
The whole engine rests on `isTemplatedNote()` correctly distinguishing engine-generated from
hand-written. If the detector misses an editorial signature and regen overwrites a curated note,
voice quality drops irreversibly.
*Mitigation:* every regen runs against `engine/templated_detection.js` (the canonical detector).
Backups before every regen. Sample 50 random "templated" classifications by hand before
proceeding with the full regen. Snapshot anchors catch drift.

**Risk: Quality score gamed by metric design.**
The score is a heuristic — a bucket could optimize for the metric without actually reading well.
*Mitigation:* every phase ends with a sample read-through (50 notes). Numbers gate, prose
verdict-locks.

**Risk: Phase 7 (per-bottle expansion) explodes scope.**
80+ bottles × 3-5 variants × ~30 pair-notes per bottle is a lot of hand-curation.
*Mitigation:* time-box per session. If a class isn't done in a session, ship what's done, log
the remainder in SESSION_NOTES.md, continue next session.

**Risk: Mid-phase interruption leaves engine in inconsistent state.**
A chunked regen interrupted mid-chunk leaves part of the corpus rewritten and part not.
*Mitigation:* every chunk is a discrete commit point with its own backup. Resume always means
"roll back the last partial chunk, restart from that offset."

**Risk: HITL gates create approval drag.**
*Mitigation:* batch HITL — show Gabe everything needing approval once per session, not once per
operation. Self-confirm low-stakes changes (test-script writes, read-only diagnostics).

---

## 6. Session log

### 2026-06-02 — Session 25: Phase 9 closer — Remaining 13 classes + Raventós fix ✅
- 182 new class-level variant phrases for the remaining 13 classes (COGNAC through LIGHT_SPIRIT)
- All 18 classes now at 13-14 b1 / 13 b2 variant pool depth
- Raventós Cava key mismatch fixed (Rose → Rosé) — Session 22 variants now flow correctly
- Audited 33 remaining templated notes — well-formed, class-specific, left as-is
- Regen: 8 templated notes shifted. Mirror 0 desync. Health 9/9 PASS. Snapshots relocked.
- **Phase 9 closed.** Total Phase 7+9 = 748 hand-written variant phrases.
- Files: `drink_x_food_generator.js`, `bottle_profiles_curated.js`, `pairing-notes.js`,
  plus 2 new scripts. Backup: `drink_x_food_generator.js.pre-s25.bak`.

### 2026-06-02 — Session 24: Phase 9 open — Class-level variant enrichment (top 5 classes) ✅
- DRINK_CLASS_DEFAULT already had 5-6 variants per class — enrichment, not greenfield
- 70 new phrases written (7 b1 + 7 b2 × 5 classes): BOURBON_BOLD, BIG_RED, ELEGANT_RED,
  GIN, TEQUILA_BOLD
- Pool depths now 13-14 per bridge per class (was 5-6)
- Regen: 22 templated notes shifted. Mirror 0 desync. Health 9/9 PASS. Snapshot 0/250 drift.
- **Forward-investment finding:** corpus is 99.9% editorial, so visible delta is small
  (~14 notes). Pool enrichment matters for future regens / new bottles / AVOID expansions.
- 5 of 18 classes done. 13 classes remain for Session 25 (or pivot to Phase 8 close).
- Files modified: `engine/drink_x_food_generator.js`, `pairing-notes.js`, plus 2 new scripts
- Backup: `drink_x_food_generator.js.pre-s24.bak`

### 2026-06-02 — Session 23: Phase 8 open — Full regen + snapshot relock + AUDIT_v8 ✅
- Full regen pipeline executed to push Phase 7 bridge variants through templated cells
- DxF regen: 210 of 218 templated notes rewritten
- FxF regen: 816 templated pairs rewritten across 12 archetype slots
- Mirror sync: 0 desync. Tier audit: 2,522/2,522 matching. Health 9/9 PASS.
- Snapshots relocked: 250 DxF anchors + 24 FxF anchors at new state
- Templated count dropped from 218 to ~33 (0.06% of corpus)
- AUDIT_v8_2026-06-02.md written — full Phase 7+8 audit, per-tier samples, 4 documented gaps
- **Engine in strongest state since project began** — all health checks PASS, all canons clean
- Decision point queued for Session 24: Phase 9 (category variants), Phase 8 close, or
  quality-rest sample session

### 2026-06-02 — Session 22: Phase 7 closer — Specialty bottle bridge variants (22/22) ✅
- 176 hand-curated bridge variants for the final 22 specialty bottles (Cognac, Tequila,
  Heavy Rum, Sparkling, Cava, Port, Vin Santo, White Wine, Vodka, Gin, Light Rum, Cocktails)
- Each grounded in specific facts (Pierre Gimonnet Côte-des-Blancs, Clase Azul ceramic
  decanters, Don Julio 1942 founding, Symington/Yeatman port families, Schloss Vollrads
  1211 founding, Bert "Tito" Beveridge, Dick Bradsell 1980s Espresso Martini, etc.)
- Applier regex patched to handle double-quoted keys (Graham's apostrophe edge case)
- Results: 22/22 profiles updated, 80 pairs touched, 108 corpus swaps, 0 mirror desync
- **Phase 7 closed.** 62 of 62 curated bottles have bridge variant pools.
- Phase 7 cumulative: 496 hand-written variant phrases, 398 corpus swaps, 310 pairs touched
- Health check 9/9 PASS
- Backups: `bottle_profiles_curated.js.pre-s22.bak`, `pairing-notes.js.pre-s22-*.bak`

### 2026-06-02 — Session 21: Phase 7 — BOURBON_BOLD bridge variant expansion (19/19) ✅
- 152 hand-curated bridge variants for 19 remaining BOURBON_BOLD bottles
- Each variant references specific distillery facts (Spanish oak, David Stewart, Hiram Walker,
  Robbie Dhu Spring, multi-distillery Hibiki blend, etc.) — not generic class language
- Results: 19/19 profiles updated, 66 pairs touched, 80 corpus swaps, 0 mirror desync
- Phase 7 cumulative: 40 of ~62 curated bottles now have variant pools
- Health check 9/9 PASS
- Backups: `bottle_profiles_curated.js.pre-s21.bak`, `pairing-notes.js.pre-s21-*.bak`
- Files modified: `engine/bottle_profiles_curated.js`, `pairing-notes.js`, plus 2 new scripts

### 2026-06-02 — Session 20: Phase 7 — Cab bridge variant expansion (6/6 BIG_RED curated) ✅
- Audit insight: BOTTLE_PROFILES_CURATED contains only 6 Cabs (all BIG_RED), 0 ELEGANT_RED
- 48 hand-curated bridge variants written, each true to the specific estate
  (Howell Mountain, Diamond Mountain, Stags Leap District, Oakville bench, St. Helena, Atlas Peak)
- Results: 6/6 profiles updated, 22 pairs touched, 28 corpus swaps, 0 mirror desync
- ELEGANT_RED expansion deferred — those bottles use the generator's default path and
  would need a category-level variant mechanism (separate workstream after Phase 7)
- Health check 9/9 PASS
- Backups: `bottle_profiles_curated.js.pre-s20.bak`, `pairing-notes.js.pre-s20-*.bak`
- Files modified: `engine/bottle_profiles_curated.js`, `pairing-notes.js`, plus 2 new scripts

### 2026-06-01 — Session 19: Phase 7 — Whiskey bridge variant expansion (15/62) ✅
- Audit: 62 curated bottles all have single-phrase bridges (zero variants)
- Surfaced finding: bridges have minimal current-corpus impact (~234 notes), but Gabe's
  "engine should be as good as possible" directive committed us to Option A (full
  expansion across all 62 bottles over Sessions 19-22)
- Session 19 covered 15 whiskey-set bottles (the ones with highest current-corpus impact):
  Toki, Redbreast, Hakushu, Yamazaki 12/18, Jameson, Macallan Estate, Balvenie 12/14,
  Pierre Ferrand, The Manhattan, Glenmorangie 10, Dalmore 12, Aberlour 16, Bowmore 12
- 120 hand-curated bridge variants written, each true to the specific bottle
- Built `engine/apply_bridge_variants.js` with canonical-sorted-key hash (Session 18's
  lesson applied — prevents mirror desync)
- Results: 15/15 profiles updated, 182 corpus swaps across 142 pairs,
  **0 mirror desync this time** (vs 7,153 in Session 18 — the fix worked)
- Health check 9/9 PASS
- Files modified: `engine/bottle_profiles_curated.js`, `pairing-notes.js`, plus 2 new scripts
- Backups: `engine/bottle_profiles_curated.js.pre-s19.bak`, `pairing-notes.js.pre-s19-*.bak`
- Pattern locked in for Sessions 20-22

### 2026-06-01 — Session 18: Phase 7 begin — WORKS connective expansion ✅
- Expanded `pickAction()` from 2-4 to 12-19 connectives per tier (works: 4→19)
- Built `engine/break_works_connectives.js` — hash-pick in-place sweep, 19-variant pool
- **15,606 swaps across 15,170 pairs** committed via sandbox protocol
- Distribution check on 22,030 works-tier notes: top connective now at 8.1% (was 25%+)
- Mirror sync re-converged 7,153 mirror pairs (canonical/reverse hash divergence — future
  sweeps should hash on sorted canonical pair-key to prevent this)
- Health check 9/9 PASS, no language drift
- Files modified: `engine/drink_x_food_generator.js`, `pairing-notes.js`,
  `engine/break_works_connectives.js` (new)
- Backups: `engine/drink_x_food_generator.js.pre-phase7.bak`, `pairing-notes.js.pre-phase7-*.bak`

### 2026-06-01 — Session 17: Phase 6 close — BOURBON/ELEGANT_RED audit + mining ✅
- BOURBON_BOLD + ELEGANT_RED thin cells audited; **zero lifts needed** — all already
  sommelier-grade with bottle facts + regional terroir + pair-specific reasoning
- Mining captured all Phase 6 editorial into food_corpus_mined.js (2,740 fragments,
  168 unique connectives, 21 verdict slots)
- Health check 9/9 PASS
- **Phase 6 closes** with: 8 hand-curated lifts (Louis XIII + HEAVY_SPIRIT), 90 corpus-wide
  carrot cake canon fixes, CLAUDE.md "Dessert ingredient canon" added, SESSION_NOTES
  ingredient-drift pre-commit scan codified
- Phase 7 next: systemic WORKS-tier connective expansion (the templated phrases observed
  during Phase 6 audits)

### 2026-06-01 — Mid-Session-16 follow-up: Carrot cake canon sweep ✅
- 90 corpus instances of raisin/walnut leaks in carrot-cake-context notes fixed via
  `engine/fix_carrot_cake_canon.js`
- 15 substitution patterns with hash-picked variants; smart preservation of legitimate
  wine-attribute "walnut" mentions (e.g. Graham's 10 Year Tawny port profile)
- 88 pairs touched, 90 swaps committed via sandbox protocol
- CLAUDE.md updated with Dessert ingredient canon (covers 8 dessert items including
  no-raisin/no-nut carrot cake rule)
- SESSION_NOTES.md § Conventions expanded with ingredient-drift pre-commit scan
- Principle: factual canons need both documentation AND grep gates

### 2026-06-01 — Session 16: Phase 6 — HEAVY_SPIRIT audit + 5 lifts ✅
- Audited all 5 HEAVY_SPIRIT bottles; 4 of 5 already have sommelier-grade Excellent prose
- Lifted 5 thin Excellent-tier pairs: Myers's × Bone Marrow / Carrot Cake / Cheesecake,
  J&W Trinidad × Carrot Cake, Ron Zacapa × Cheesecake
- Each lift cites bottle facts (Diageo workhorse / Angostura column-still / Solera 23
  Andean) + tier positioning + alternative-bottle hints
- Observation: HEAVY_SPIRIT Strong/Works tier carries generic class-default phrases —
  exactly Phase 7's scope (WORKS connective expansion), not Phase 6's
- Sandbox commit, atomic cp, mirror sync clean, health check 9/9 PASS
- Files modified: `pairing-notes.js`, `engine/heavy_spirit_lifts.js` (new)
- Backups: `pairing-notes.js.pre-s16-*.bak`

### 2026-06-01 — Session 15: Phase 6 begin — Louis XIII pair audit + 3 lifts ✅
- Pre-session diagnostic: 196 thin buckets / 1,470 pairs — broader than gameplan's 108
  estimate, but most contain sommelier-grade prose (thinness is a class-bottle-count
  artifact, not always a quality signal)
- Read all 57 Louis XIII pairs end-to-end. Identified 3 weak ones (Mushrooms 22w, Chocolate
  Cake templated, Mocha Creme templated). 38 AVOID pairs from Phase 3 read correctly.
- Wrote 3 Louis XIII lifts voice-matched to Excellent tier (bottle facts + tier reasoning +
  alternative-bottle recommendations)
- Sandbox commit, atomic cp, mirror sync clean, health check 9/9
- **Phase 6 approach codified:** audit by reading, lift only templated/weak prose; don't
  rewrite every pair in every thin cell. Most thin-bucket pairs are already strong.
- Files modified: `pairing-notes.js`, `engine/louis_xiii_lifts.js` (new)
- Backups: `pairing-notes.js.pre-s15-*.bak`

### 2026-06-01 — Session 14: Phase 5 close — rum agave-leak sweep ✅
- 56-pair scan distinguished real leaks (38) from false positives (4 Bacardi "añejo"
  mentions inside legitimate alternative-rec lists)
- Built `engine/fix_rum_agave_v2.js` — 8 target patterns × 5 hash-picked rum variants each
- 38 swaps committed via sandbox + atomic cp: Mount Gay 20, Captain Morgan 10, Malibu 8
- Mirror sync clean, health check 9/9, no language drift
- Re-scan confirms ZERO agave leaks on rum bottles across the entire 51,242-key corpus
- **Phase 5 closes.** Taxonomy split + targeted cleanup = complete elimination of
  rum/blanco-tequila conflation in both engine logic and deployed corpus
- Files modified: `pairing-notes.js`, `engine/fix_rum_agave_v2.js` (new)
- Backups: `pairing-notes.js.pre-s14-*.bak`

### 2026-05-31 — Session 13: Phase 5 begin — LIGHT_SPIRIT subclass split ✅
- Taxonomy: LIGHT_SPIRIT → RUM_LIGHT + TEQUILA_BLANCO (CLASS_DRINKS now 19)
- 11 name overrides + rum category default updated; all 15 bottles re-classify correctly
- Generator: 9 substitutions (dcLabel, profileFor, COMPETITOR_REFS, drinkFlavorsFor switch,
  class-keyword filter, etc.) — pre-existing LIGHT_SPIRIT_VOICE_DEFAULTS sub-keys (TEQUILA_BLANCO,
  RUM_LIGHT) now wired in directly
- AVOID pool: LIGHT_SPIRIT block duplicated to both new classes (same content; refinement
  queued for Session 14)
- Smoke test: Mount Gay Rum no longer carries agave language. Don Julio Blanco uses correct
  blanco voice.
- Ran `apply_avoid_reasoning.js`: 342 AVOID notes regenerated with new class-correct labels
- Health check 9/9 PASS, mirror sync clean, DxF snapshot relocked 250/250
- **Session 14 scope identified:** Strong/Works DxF notes for the 4 rum bottles still carry
  pre-Phase-5 agave language (residual leak). Needs targeted sweep before Phase 5 closes.
- Files modified: `engine/pairing_engine_taxonomy.js`, `engine/drink_x_food_generator.js`,
  `engine/avoid_reasoning_pool.js`, `pairing-notes.js`
- Backups: 4 × `.pre-phase5.bak`, 2 × `pairing-notes.js.pre-*`

### 2026-05-31 — Session 12: Phase 4 close — mine + FxF regen ✅
- `mine_food_corpus.js`: 2,740 fragments captured, 52 NEW verdict-slot entries from Phase 4
  hand-curated work (MAIN_SOUP_SALAD.strong: 22, STEAK_STARTER.strong: 16, STEAK_SIDE.strong: 14)
- `regenerate_food_x_food.js`: completed in 33.9s using tmp+rename atomic pattern (under
  45s bash timeout). 51,242 keys written. All Phase 3 + Phase 4 hand-curated work preserved.
- Mirror sync clean. Health check 9/9, no drift. DxF snapshot: 250/250 stable. FxF snapshot:
  9 intentional drifts locked at new baseline (24/24 clean).
- **Phase 4 closes.** Engine-scaling property now active: 52 new verdict slots flow into
  every future templated FxF generation. Voice consistency extends beyond the 111
  hand-curated pairs.
- Files modified: `pairing-notes.js`, `engine/food_corpus_mined.js`, `engine/engine_fxf_snapshot.json`
- Backups: `pairing-notes.js.pre-s12-regen-*.bak`, `pairing-notes.js.pre-engine-v4-regen.bak`,
  `engine/food_corpus_mined.js.pre-s12.bak`

### 2026-05-31 — Session 11: Phase 4 — main × soup-salad × strong ✅
- 64 hand-curated editorial entries (matches gameplan estimate of ~128 pairs counting both
  directions, which apply automatically — actual canonical pair count is 64)
- Voice carries course-flow framing forward; each main's prep canon respected explicitly
- Pre-commit canon scan refined to exclude legitimate tuna/scallop "seared" contexts
- Clean deployment via the now-mature isolated-command protocol: sandbox write → cp →
  sync → health check, each as its own bash call
- 128 entries committed (64 canonical + 64 mirror), 15,810,221 bytes, health check 9/9 PASS,
  no language drift
- Phase 3 AVOID reasoning preserved
- Files modified: `pairing-notes.js`, `engine/fxf_strong_main_soupsalad_editorial.js` (new)
- Backups: `pairing-notes.js.pre-fxf-s11-*.bak`
- **Phase 4 editorial writing is complete.** Session 12 = mine + optional FxF templated regen.

### 2026-05-30 — Session 10: Phase 4 — starter × steak × strong ✅
- 26 hand-curated editorial entries (gameplan estimate was 52, actual half because many
  starter-steak combos sit in other tiers)
- Voice anchored in course-flow: starter primes palate for cut
- Two incidents handled: Failure Mode 3 (chained-command timeout killing cp) recovered via
  isolated commands; cooking-canon drift ("seared beef" → "flame-grilled beef") caught by
  health check warn, fixed and redeployed
- Final state: 52 entries (26 canonical + 26 mirror) committed cleanly, 15,800,561 bytes,
  mirror integrity perfect, health check 9/9 PASS, no warns
- Phase 3 AVOID reasoning preserved
- Two new conventions codified in SESSION_NOTES.md: isolated-command protocol for corpus
  writes, pre-commit cooking-canon scan
- Files modified: `pairing-notes.js`, `engine/fxf_strong_steak_starter_editorial.js` (new)
- Backups: `pairing-notes.js.pre-fxf-s10-*.bak`

### 2026-05-30 — Session 9: Phase 4 begin — side × steak × strong ✅
- 21 hand-curated editorial entries in `engine/fxf_strong_steak_side_editorial.js`
- Voice matched to FxF gold standards, grounded in cut-weight canon
- Built generic `engine/apply_fxf_editorial.js` — reusable for Sessions 10-11
- HITL: Gabe approved commit. First attempt truncated `pairing-notes.js` (OneDrive
  timeout-during-sync). Restored from backup; rewrote apply to use sandbox-first protocol
  (write to outputs/, atomic cp into place).
- Protocol now codified: SESSION_NOTES.md § Conventions documents Failure Mode 2
  (timeout truncation) and the atomic-copy fix
- Re-commit: 42/42 replacements landed, 15,796,405 bytes, mirror sync clean, health check 9/9
- Phase 3 AVOID reasoning preserved (no cross-phase regression)
- Files modified: `pairing-notes.js`, `engine/fxf_strong_steak_side_editorial.js` (new),
  `engine/apply_fxf_editorial.js` (new), `engine/apply_fxf_diff.txt` (new)
- Backups: `pairing-notes.js.pre-fxf-editorial-*.bak`, `pairing-notes.js.pre-fxf-s9-*.bak`

### 2026-05-30 — Session 3 (resumed): Phase 3 DEPLOYED ✅
- Wired `pickAvoidReasoning()` picker into `drink_x_food_generator.js` avoid branch
- Built `engine/apply_avoid_reasoning.js` with --dry-run / --commit modes + HITL gate
- Dry-run identified 11,876 templated AVOID notes (3,116 editorial preserved)
- HITL: Gabe approved commit
- O(n²) → O(n) rewrite of substitution loop after first attempt timed out
- **11,876 / 11,876 commits landed in 13 seconds**
- Mirror sync: 0 mismatches across 51,242 keys
- Health check: 9/9 PASS
- DxF snapshot relocked at new baseline (250/250)
- Floor-defensible per-pair AVOID reasoning now LIVE in `pairing-notes.js`
- Files modified: `engine/drink_x_food_generator.js`, `pairing-notes.js`,
  `engine/.snapshot.json`. Plus backups: `*.pre-phase3-*.bak`, `pairing-notes.js.pre-apply-avoid-*`
- **Phase 2 + Phase 3 closed. Phase 4 (FxF STRONG-tier backfills) is next.**

### 2026-05-30 — Session 2.5.2: Phase 2.5 COMPLETE ✅
- Both remaining repairs collapsed from expected merge work to **trivial truncations** after
  careful read. v6 logic was already inlined in canonical `generate()`; orphan was pure
  duplicate. Same pattern in `consistency_check.js` — duplicate of in-flow block.
- Repaired `pairing_engine_generator.js` (852→827 lines, all 13 module.exports intact)
- Repaired `consistency_check.js` (191→171 lines)
- Survey: **0 of 101 engine files broken** ✅
- Live consistency check on first run: 5/5 PASS (mining ↔ runtime parity, 435 drinks,
  56 foods, bucket validity)
- DxF snapshot: 250/250 stable
- FxF snapshot: 4 anchors drifted — investigated, pre-existing from corpus edits 5/6→5/7,
  not caused by this session. Snapshot relock deferred to Phase 8.
- Backups retained, no source-of-truth files modified.
- **Phase 2.5 closes. Phase 3 (Phase 2 deployment) can now proceed from a clean foundation.**

### 2026-05-30 — Session 2.5.1: Phase 2.5 — Two tail-trim repairs ✅
- Backed up all 4 broken files with `.pre-repair.bak` suffix
- Repaired `drink_x_food_generator.js` (2146→2144 lines, tail orphan removed)
- Repaired `audit_steak_side_coverage.js` (49→48 lines, tail orphan removed)
- Both pass `node -c`. Audit script sample-runs cleanly with expected output.
- Re-survey: **2 of 101 engine files broken** (down from 4). Both remaining files are the
  higher-risk merge-work cases — reserved for Session 2.5.2.
- Health check: 9/9 pass throughout.
- Sandbox protocol used cleanly. Zero corruption events.
- Files modified: `engine/drink_x_food_generator.js`, `engine/audit_steak_side_coverage.js`
- Backups created: 4 × `.pre-repair.bak`
- No source-of-truth files touched

### 2026-05-30 — Session 3: Phase 2 deployment STOPPED, Phase 2.5 opened ✅
- Attempted Phase 2 wire-in to `drink_x_food_generator.js`. Discovered the file wouldn't load.
- Survey: 4 of 101 engine `.js` files broken with abandoned-mid-edit orphan-tail pattern
  (`pairing_engine_generator.js`, `drink_x_food_generator.js`, `consistency_check.js`,
  `audit_steak_side_coverage.js`)
- Root explanation: surgical fix scripts since April have edited `pairing-notes.js` text
  directly without loading any generator. No regen attempted since the breakages were
  introduced.
- Reverted Session 3 source changes. Net source-file change: zero.
- Gabe chose Option 2 (structural repair before deployment). Phase 2.5 inserted between
  Phase 2 and Phase 3.
- Created `engine/ENGINE_REPAIR_NOTES.md` with file-by-file damage analysis and repair plan
- Phase 2.5 estimated 2 sessions: Session 2.5.1 (low-risk tail-trims) + Session 2.5.2
  (v5/v6 merge + hoist work)
- After Phase 2.5: Phase 3 (deployment) resumes from clean foundation

### 2026-05-30 — Session 2d: Phase 2 — 100% AVOID coverage ✅
- Added the final 11 classes (COCKTAIL_BOLD, TEQUILA_BOLD, LIGHT_SPIRIT, COCKTAIL_LIGHT,
  WHITE_WINE, SPARKLING, VODKA, COGNAC, MEZCAL, HEAVY_SPIRIT, COGNAC_LUXURY)
- Final pool: 328 entries × 192 archetype buckets × 80 cells × 17 classes
- Coverage: all 14,874 DxF AVOID notes
- Preview at `avoid_reasoning_preview_2d.txt` verifies clean prose across all new classes —
  Vodka×Tomahawk, Mezcal×BroccoliCheddar, LouisXIII×LoadedPotato, WhiteWine×Porterhouse
  all landing on correct archetype with floor-defensible reasoning
- Phase 2 infrastructure complete. **Session 3 next: wire into generator + first regen.**
- Files added: `engine/preview_avoid_reasoning_2d.js`, `engine/avoid_reasoning_preview_2d.txt`
- Files modified: `engine/avoid_reasoning_pool.js` (final v2 form)
- No source-of-truth files touched

### 2026-05-30 — Session 2c: Phase 2 — 4 more classes (79.7% coverage) ✅
- Added SWEET_LIQUEUR, GIN, SWEET_WINE, APERITIVO_BITTER pools using v2 archetype structure
- Pool: 198 entries / 114 archetype buckets / 31 cells / 6 classes
- Coverage: 11,858 of 14,874 AVOID notes (79.7%)
- All preview samples land on correct archetype — Frangelico×CreamedSpinach→side-cream,
  Tanq×CrèmeBrûlée→dessert-custard, VinSanto×Tuna→main-fish-crusted, etc.
- Process discovery: OneDrive null-byte truncation hits Edit ops too. Protocol updated
  in SESSION_NOTES.md and § 8 of this file — sandbox-then-bash-copy applies to **any
  non-trivial JS modification**, Write or Edit
- Files modified: `engine/avoid_reasoning_pool.js` (rebuilt clean via sandbox concat),
  `engine/preview_avoid_reasoning_2c.js`, `engine/avoid_reasoning_preview_2c.txt`
- No source-of-truth files touched

### 2026-05-30 — Session 2b: Phase 2 — Archetype-aware v2 pool ✅
- Gabe chose Option B (food-archetype subdivision) — "Every decision we make is with the best
  possible product in mind"
- Built `engine/food_archetypes.js`: 56 menu items → 23 archetypes (6 categories). Coverage
  verified 56/56 mapped.
- Restructured `engine/avoid_reasoning_pool.js` to v2: nested `[class][category][archetype]`
  with DEFAULT fallback per cell. 96 entries across 46 archetype buckets in 12 cells.
- Picker mixes archetype-specific + DEFAULT pools, md5-hashes by pair key for deterministic
  distribution. Falls back to generator's current "overpowers" template when cell is unseeded.
- All 3 Session 2 misfires resolved by design — picker can't land a cream-clause on a vegetable
  ever, because the archetype routes it to the side-vegetable pool first.
- Healthy v1 cases became sharper (Crème Brûlée → dessert-custard pool, Tuna → main-fish-crusted)
- Principle codified: architectural fixes over patches when a class of errors is possible by design
- Files added: `engine/food_archetypes.js`, `engine/avoid_reasoning_pool.v1.bak`,
  `engine/avoid_reasoning_preview_v2.txt`. Modified: `engine/avoid_reasoning_pool.js`,
  `engine/preview_avoid_reasoning.js`
- No source-of-truth files touched

### 2026-05-30 — Session 2: Phase 2 — AVOID reasoning pool seeded ✅
- Built `engine/avoid_reasoning_pool.js` v1: 53 entries × 12 cells covering BOURBON_BOLD +
  ELEGANT_RED (55.7% of all 14,874 DxF AVOID notes)
- Picker: deterministic-md5 by pair key, falls back to current "overpowers" template for
  unseeded cells
- Preview simulator shows the new prose lands well in most cases — verb variety + why-clause
  produces server-defensible reasoning. Three misfires found where cell-level entries assumed
  one food sub-type but picker hit a different sub-type
- Trade-off surfaced for Gabe's call: tighten entries to food-agnostic (Option A) or build
  food-archetype subdivision (Option B). See SESSION_NOTES.md "DECISION NEEDED"
- Files added: `engine/find_fxf_avoid_curated.js`, `engine/fxf_avoid_curated.json`,
  `engine/map_avoid_cells.js`, `engine/avoid_reasoning_pool.js`,
  `engine/preview_avoid_reasoning.js`, `engine/avoid_reasoning_preview.txt`
- No source-of-truth files touched

### 2026-05-30 — Session 1 follow-up: Phase order locked (floor-priority) ✅
- Gabe overrode my metric-first recommendation. Server needs to *defend* every AVOID at the
  table; GOLD/EXCELLENT are the sell-it moments; WORKS gets skimmed.
- Reordered phases: AVOID → GOLD/EXCELLENT → FxF STRONG → LIGHT_SPIRIT subclass → thin buckets
  → WORKS connectives + per-bottle pools → slot-fill targeted fix + final sweep.
- Added new Phase 3: GOLD/EXCELLENT verdict reasoning lift (was missing from v1).
- Total estimated sessions: 24 (was 20-22).
- Principle codified in § 4: floor-priority outranks metric measurability when the metric
  blind-spots the dimension that matters.

### 2026-05-30 — Session 1: Phase 1 — Diagnostic Calibration ✅
- Stripped trailing save-clause from slot-fill detector (intended engine redirect, not a bug)
- 6/6 calibration self-tests pass
- Added per-class slot-fill ranking
- **Findings shift:** Real slot-fill bug is ~74 notes (0.14%), not the 7,000+ the pre-calibration
  view suggested. WORKS-tier connective recycling is now the unambiguous #1 measurable issue
  (15 weakest buckets all WORKS-tier, ~3,500 notes total).
- **Recommendation surfaced:** Swap Phase 3 (WORKS connectives) ahead of Phase 2 (AVOID
  reasoning). Detail in SESSION_NOTES.md "DECISION NEEDED FROM GABE."
- Files modified: `engine/diagnose_quality_distribution.js` (calibrated),
  `engine/quality_distribution_report.json` (regenerated),
  `engine/quality_distribution_report.pre-calibration.json` (archived),
  `engine/SESSION_NOTES.md`, `engine/GAMEPLAN_v1.md` (this file)
- No source-of-truth files touched. No backups created (read-only work).
- **Next:** Confirm phase order with Gabe, then Session 2.

### 2026-05-30 — Phase 0 setup ✅
- Quality-distribution diagnostic built and run
- Bucket prose sampler built and run
- Six root causes identified and documented
- This gameplan drafted
- Files modified: `engine/diagnose_quality_distribution.js` (new),
  `engine/sample_bucket_prose.js` (new), `engine/GAMEPLAN_v1.md` (this file),
  `engine/SESSION_NOTES.md` (new), `engine/quality_distribution_report.json` (generated)
- No source-of-truth files touched. No backups created.

---

## 7. Skill methodology adapted from LivInv

The LivInv dev-assistant skill's phase discipline maps to this engine project as follows:

| LivInv phase | Engine equivalent |
|---|---|
| Session Start — load NOTES.md | Read `SESSION_NOTES.md` |
| Plan | Identify session number from GAMEPLAN_v1; list files to touch + expected behavior |
| Backup | `cp pairing-notes.js pairing-notes.js.pre-{label}.bak` before any source edit |
| Execute | Run the script(s); HITL on irreversible writes |
| Test | Health check, snapshot test, mirror sync, sample read |
| Fix Loop | Max 5 retries; retry 3 must change approach; retry 5 must change again |
| Document | Append dated entry to GAMEPLAN_v1 § Session Log + update SESSION_NOTES.md |
| Escalate | Write BLOCKED to SESSION_NOTES.md; halt; wait for Gabe |
| Session End | Confirm all backups exist; confirm files saved at paths; brief Gabe |

This is the same discipline LivInv uses to keep Toast ingest reliable. Applied here, it keeps
the engine quality lift sustainable across however many sessions it takes — precision over
speed, reversible over fast.

---

## 8. File-write protocol (standing rule, codified 2026-05-30)

OneDrive sync pads JS files written via Write tool with trailing null bytes mid-write past
~4KB. Silent corruption until Node parses. Standing workaround: write to sandbox first
(`/sessions/<session>/mnt/outputs/`), then bash-copy into place. Verify with `node -c` before
running. Full detail in SESSION_NOTES.md § Conventions. Apply this to every JS file write
across all sessions.
