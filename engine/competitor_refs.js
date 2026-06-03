// engine/competitor_refs.js
// Disabled 2026-06-03: the "Fernet Branca still cuts it harder" tagging was
// appending unrelated bottle references to 310+ whiskey × hearty-starter
// pairs, leaking foreign-bottle text into hand-curated editorial. The
// floor-guidance value was small compared to the noise.
const COMPETITOR_REFS = {};
module.exports = { COMPETITOR_REFS };
