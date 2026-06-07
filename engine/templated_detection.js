// engine/templated_detection.js
//
// SINGLE SOURCE OF TRUTH for "is this note engine-templated?"

'use strict';

const SIGS = [
  // === Avoid-tier templated marker — RE-ENABLED 2026-06-02 ===
  // The 2026-05-06 removal assumed "the engine still generates AVOIDs
  // identically", but that broke once Phase 3 added avoid_reasoning_pool and
  // Phase 7 added the 12-closer + 6-save-phrase variant pools. Without
  // detection, the regen pipeline never picked up AVOIDs, so the new
  // generator logic never reached the corpus. 14,992 corpus AVOIDs were
  // locked at their pre-Phase-3 state, with closer phrases repeating 30-40
  // times each.
  //
  // Detection rule: presence of "Avoid;" closer-token. Notes that begin
  // with "Never pair" are hand-curated editorial gold-AVOIDs (preserved
  // by the isTemplatedNote() head-check below).
  /\bAvoid;\s/,

  // === Universal verdict-template tells ===
  /Gold standard;.*lock that sells itself/,
  /runs straight into [^—]+— the/,
  /meets at register with/,
  / that defines /,
  /the call you don't second-guess/,
  /the call servers pour without second-guessing/,
  /reads cleanly at the table/,
  /elegance meets the plate/,
  /sits in the pocket on/,
  /earns a regular/,
  /dials in cleanly/,
  /workhorse pairing/,
  /keeps pace with/,
  /that's the play/,
  /(?:--|—) textbook\./,
  /the answer is /,
  /pour it and step back/,
  /if a guest asks what to drink with/,
  /is fine on .+ (?:--|—) fine, not memorable/,
  /doesn't fight .+, but doesn't lift it either/,
  /pulls neither way against/,
  /backup when the strong calls/,
  /save the storytelling/,
  /spoken for/,
  /without asking for attention/,
  /is the answer, full stop/,
  /when a guest asks what works/,
  /(?:--|—) the kind of pour that earns a regular/,
  /carries .+ without overshooting/,

  // === Recycled body skeletons (2026-05-06 audit additions) ===
  /the bourbon depth settles on the plate/,
  /vanilla layers into the cream/,
  /pairing sits at neutral register without/,
  /call lands as a measured alongside/,
  /call holds neither soars nor fights/,
  /pairing reads as a quiet alongside/,
  /the side carries its register/,
  /Works alongside; nothing fights in this/,
  /the bourbon-on-light-soup call/,
  /the bourbon-on-light-side call/,
  /the bourbon-on-dessert pairing/,
  /the bourbon character meets the dessert at digestif register/,

  // === Compound bridge-verb skeletons (DxF body) ===
  /character (?:sits alongside|leans against|reads alongside|stays alongside|holds with|finds neutral with|plays cleanly against|sits beside) the .+ — the/,
];

function isTemplatedNote(note) {
  if (!note) return true;
  // Hand-curated editorial AVOIDs begin with "Never pair" — preserve them
  // even if they otherwise match a templated signature.
  if (/^Never pair /.test(note)) return false;
  return SIGS.some(rx => rx.test(note));
}

module.exports = { isTemplatedNote, SIGS };
