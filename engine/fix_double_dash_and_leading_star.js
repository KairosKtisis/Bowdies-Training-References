// Normalizes punctuation across the whole pairing-notes corpus:
//   1. spaced double dash " -- "  ->  spaced em dash " — "
//   2. leading "* " bullet at the start of a note value  ->  removed
// Formatting-only: applies to templated AND editorial notes (consistency
// beats preservation for pure punctuation; no wording is touched).
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'pairing-notes.js');
let src = fs.readFileSync(file, 'utf8');

const dashes = (src.match(/ -- /g) || []).length;
src = src.replace(/ -- /g, ' — ');

// leading star only at the very start of a string value: «: "* Note...»
const starRe = /(:\s*")\* /g;
const stars = (src.match(starRe) || []).length;
src = src.replace(starRe, '$1');

fs.writeFileSync(file, src);
console.log(`fixed ${dashes} double dashes, removed ${stars} leading stars`);
