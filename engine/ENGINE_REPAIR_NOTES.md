# Engine Repair Notes — Phase 2.5 work intake

**Opened:** 2026-05-30 (Saturday), Session 3 (stopped/escalated)
**Why this file exists:** When Session 3 of GAMEPLAN_v1 (Phase 2 deployment) attempted to wire
the AVOID reasoning picker into `drink_x_food_generator.js`, the generator failed `node -c`
syntax check. Investigation found four engine files in a broken state since at least
2026-04-27. The Phase 2 surgical fix scripts that ran since (`break_recycled_phrases.js`,
`fix_steak_weights_in_editorial.js`, etc.) edit `pairing-notes.js` text directly without
loading any generator, which is why nobody noticed — no full regen has been attempted.

The four broken files must be repaired before Phase 3 deployment can proceed. This becomes
**Phase 2.5 — Engine File Repair** in the gameplan.

---

## The pattern

All four failures share a common cause: **abandoned mid-edit, duplicate content appended after
the file's logical end instead of replacing the old content.** Each file has:
- A logically complete program ending at its proper close
- Followed by an orphan fragment (function-call remainder, partial loop body, extra `module.exports`)
- Sometimes followed by a final spurious `};`

This looks like an editor session where text was pasted into the wrong location, then partial
saves locked the broken state without manual review.

---

## The four files

### 1. `engine/pairing_engine_generator.js` (852 lines, FxF generator, load-bearing)

**Damage**: lines 822-827 carry a "v5" `module.exports`. Lines 828-844 are an orphan v6 code
fragment (mined-verdict substitution) that was intended to update the body of `generate()` but
landed after its close brace instead. Lines 846-850 are a duplicate v6 `module.exports`
missing `pickMinedVerdict`. Lines 851-852 are tail orphan: `S, FOOD_FLAVORS,\n};`.

**Risk**: highest. Required by `drink_x_food_generator.js`. The v5 vs v6 logic split means the
repair has to decide which `generate()` body is canonical. The orphan v6 fragment is clearly
the **intended** update; the question is whether to merge it into the v5 function body or
treat the v5 body as already up-to-date and discard the orphan.

**Investigation needed before repair**:
- Read the full v5 `generate()` body (lines 776-820) and compare to the orphan v6 fragment
- Cross-reference against `AUDIT_v7_2026-05-06.md` which mentions v6.2 — confirms v6 logic is
  intended canon
- If v5 body lacks the mined-verdict substitution, merge it in; otherwise drop the orphan
- Then drop the duplicate `module.exports` and the tail orphan

### 2. `engine/drink_x_food_generator.js` (2,146 lines, DxF generator, load-bearing)

**Damage**: tail orphan only. The proper `module.exports` ends at the first `};`. Lines 2145-2146
carry `VOICE_DEFAULTS,\n};` — an orphan key + spurious second close.

**Risk**: low. The file body itself is intact; only the tail needs trimming. This is the
simplest of the four repairs.

**Repair**: truncate after the first `};` that follows the `module.exports = { ... }` block.

### 3. `engine/consistency_check.js` (191 lines, regen pipeline)

**Damage**: file logically ends around line 170 with `process.exit(0/1)`. Lines 172-191
contain a duplicate set of corpus-checks and console.logs — looks like a v2 audit block that
was appended after the v1 file ended instead of replacing it.

**Risk**: medium. This script is documented in `CLAUDE.md` § Regen Pipeline as a mandatory
pre-regen check. The orphan section adds **new** corpus-bucket validation that probably should
be preserved — needs to be hoisted up into the main flow before the `process.exit()` calls.

**Repair**: more delicate than truncation. Probably needs the new corpus-bucket checks moved
inside the main `try {…}` block, then the orphan tail removed.

### 4. `engine/audit_steak_side_coverage.js` (49 lines, audit script)

**Damage**: line 49 contains an orphan ` + k));` — fragment of a `console.log` from a duplicate
block appended after the file's proper end (~line 42).

**Risk**: lowest. Audit script only — not load-bearing for any pipeline step. Could be repaired
or deleted without engine impact.

**Repair**: truncate after the proper end at line 42 (or wherever the logical close is).

---

## Repair strategy

**Phase 2.5 estimated scope:** 2 sessions.

### Session 2.5.1 — Audit + low-risk repairs
1. Backup every broken file
2. Read each file end-to-end to identify the precise logical close
3. Repair `audit_steak_side_coverage.js` and `drink_x_food_generator.js` (the two pure tail-trim
   cases) — both are unambiguous truncations
4. Verify with `node -c` after each
5. Sample-run the repaired audit script to confirm behavior

### Session 2.5.2 — Higher-risk repairs (v5/v6 merge work)
1. `pairing_engine_generator.js` — the v5/v6 merge. Compare bodies side-by-side, merge the
   mined-verdict substitution into the canonical `generate()`, drop the orphan and duplicate
   exports. Verify all three FxF snapshot anchors still hash-match (the v6 logic was already in
   the file at audit time — repairing it should produce zero behavior change since the orphan
   v6 code wasn't reachable anyway).
2. `consistency_check.js` — hoist the new corpus-bucket checks into the main flow, drop the
   orphan. Run the repaired script and confirm output matches what regen pipeline expects.
3. Re-run the full survey to confirm 0/101 broken.
4. Run health check + FxF/DxF snapshot tests — should pass unchanged.

### After Phase 2.5 — Phase 3 resumes
Session 3 (deployment) of Phase 2 picks back up: backup `pairing-notes.js`, wire the picker
into `drink_x_food_generator.js`, run small chunked regen, HITL gate, full AVOID regen.

---

## What is OK and what to NOT touch

- All 97 other engine `.js` files passed `node -c` cleanly. The 17 root-level `.js` files
  (`main.js`, `admin.js`, etc.) are not in scope here.
- `pairing-notes.js` and `pairing-map-v2.js` are data files, not source — they're fine.
- The Phase 2 work (`avoid_reasoning_pool.js`, `food_archetypes.js`, preview scripts) is clean
  — no repair needed.

---

## Risk to existing surgical fix scripts

The surgical fix scripts (`break_recycled_phrases.js`, `fix_*_in_editorial.js`,
`break_class_character_recycling.js`, etc.) edit `pairing-notes.js` text directly via regex
substitution. None of them load the broken generators. They will continue to work fine while
Phase 2.5 runs. The repair doesn't require any of them to be re-run.

---

## Backups in place

Before Session 3 attempted the wire-in, two backups were created:
- `engine/drink_x_food_generator.js.pre-avoid-reasoning.bak` — the original broken state
- `pairing-notes.js.pre-avoid-reasoning.bak` — the corpus at session start (15MB)

Session 3 modifications were reverted before this file was written. The engine is in the same
state today as when Session 2d closed, minus the discovery of these four files. Nothing was
deployed.
