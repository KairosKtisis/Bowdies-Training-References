// ── BOWDIE'S CHOPHOUSE — TABLE DEFINITIONS ──
// Spatial positions are normalized (0–100) within each section's coordinate space.
// Used by Set The Stage for selection UI and overview spatial rendering.

// ── GROUP COLORS (for bar seat grouping) ──
const GROUP_COLORS = [
  '#7BA8C4', // blue
  '#A87CC4', // purple
  '#7CC48A', // mint
  '#C47C8A', // rose
  '#C4A07C', // amber
  '#7CC4C4', // teal
];

// ── SECTION DEFINITIONS ──
// viewBox is always "0 0 100 [svgH]" — svgH controls the aspect ratio of each section's canvas.
const SECTION_DEFS = [
  { id: 'main',  label: 'Main Dining Room', svgH: 60 },
  { id: 'patio', label: 'Patio',            svgH: 60 },
  { id: 'event', label: 'Event Room',       svgH: 64 },
];

// ── TABLE DEFINITIONS ──
// shape values:
//   'round-lg'   — large round  (24, 52, 55)
//   'round-md'   — medium round (51)
//   'round-sm'   — small round  (70–73)
//   'square'     — 4-top square (most dining tables)
//   'square-tall'— 4-top taller rectangle, 2× height of square (64–67)
//   'rect-h'     — landscape rectangle, 6-top (43, 44)
//   'rect-v'     — portrait rectangle, 6-top (40) — rect-h rotated 90°
//   'rect-xl'    — extra-wide rectangle, 10+ guests
//   'rect-sm'    — small 2-top rectangle (53, 54, 57)
//   'rect-thin'  — square-width, square-sm height (42)
//   'square-sm'  — small 2-top square (50, 56)
//   'booth-left' — wall booth with bench on LEFT (20–23). Seats: 2 on bench + 1 above + 1 below (default 4);
//                 at 5–6 guests, 2 above + 2 below. Max 6.
//   'booth-bottom' — bottom-edge booth (60–63). Seats: 1 left + 1 right + up to 2 below. Max 4.
//
// pos: { x, y } — center of table in section's 0–100 coordinate space

const TABLE_DEFS = [

  // ── MAIN DINING ROOM ─────────────────────────────────────────────────────────
  // y coords scaled ×0.7 from original; svgH reduced from 92 → 60.
  // T43/T44/T24 top edges align with T23. T43/T42/T40 share right edge at x≈92.8.
  // Booths 20-23 hug the left wall — bench on the left, chairs above/below.

  { id: 20, label: '20', section: 'main', shape: 'booth-left', defaultSeats: 4, pos: { x:  8, y: 54 } },
  { id: 21, label: '21', section: 'main', shape: 'booth-left', defaultSeats: 4, pos: { x:  8, y: 40 } },
  { id: 22, label: '22', section: 'main', shape: 'booth-left', defaultSeats: 4, pos: { x:  8, y: 26 } },
  { id: 23, label: '23', section: 'main', shape: 'booth-left', defaultSeats: 4, pos: { x:  8, y: 12 } },
  { id: 24, label: '24', section: 'main', shape: 'round-lg',  defaultSeats: 8, pos: { x: 30, y: 13 } },

  { id: 30, label: '30', section: 'main', shape: 'square',    defaultSeats: 4, pos: { x: 33, y: 48 } },
  { id: 31, label: '31', section: 'main', shape: 'square',    defaultSeats: 4, pos: { x: 48, y: 48 } },
  { id: 32, label: '32', section: 'main', shape: 'square',    defaultSeats: 4, pos: { x: 63, y: 48 } },
  { id: 33, label: '33', section: 'main', shape: 'square',    defaultSeats: 4, pos: { x: 63, y: 31 } },
  { id: 34, label: '34', section: 'main', shape: 'square',    defaultSeats: 4, pos: { x: 48, y: 31 } },
  { id: 35, label: '35', section: 'main', shape: 'square',    defaultSeats: 4, pos: { x: 33, y: 31 } },

  { id: 40, label: '40', section: 'main', shape: 'rect-v',    defaultSeats: 6, pos: { x: 88, y: 48 } },
  { id: 42, label: '42', section: 'main', shape: 'rect-thin', defaultSeats: 2, pos: { x: 88, y: 25 } },
  { id: 43, label: '43', section: 'main', shape: 'rect-h',    defaultSeats: 6, pos: { x: 86, y: 12 } },
  { id: 44, label: '44', section: 'main', shape: 'rect-h',    defaultSeats: 6, pos: { x: 62, y: 12 } },

  // ── PATIO — y coords scaled ×0.7 from original; svgH reduced from 85 → 60 ────

  { id: 50, label: '50', section: 'patio', shape: 'square-sm', defaultSeats: 2, pos: { x: 71,  y: 49 } },
  { id: 51, label: '51', section: 'patio', shape: 'round-md',  defaultSeats: 4, pos: { x: 88,  y: 25 } },
  { id: 52, label: '52', section: 'patio', shape: 'round-lg',  defaultSeats: 6, pos: { x: 72,  y: 17 } },
  { id: 53, label: '53', section: 'patio', shape: 'rect-sm',   defaultSeats: 2, pos: { x: 52,  y: 14 } },
  { id: 54, label: '54', section: 'patio', shape: 'rect-sm',   defaultSeats: 2, pos: { x: 36,  y:  6 } },
  { id: 55, label: '55', section: 'patio', shape: 'round-lg',  defaultSeats: 6, pos: { x:  9.3, y: 12 } },
  { id: 56, label: '56', section: 'patio', shape: 'square-sm', defaultSeats: 2, pos: { x:  6.2, y: 34 } },
  { id: 57, label: '57', section: 'patio', shape: 'rect-sm',   defaultSeats: 4, pos: { x: 34,  y: 48 } },

  // ── EVENT ROOM ────────────────────────────────────────────────────────────────

  // Booths 60-63 sit along the bottom wall — chairs on left/right, bench below. Max 4.
  { id: 60, label: '60', section: 'event', shape: 'booth-bottom', defaultSeats: 4, pos: { x: 86.2,  y: 53 } },
  { id: 61, label: '61', section: 'event', shape: 'booth-bottom', defaultSeats: 4, pos: { x: 60.73, y: 53 } },
  { id: 62, label: '62', section: 'event', shape: 'booth-bottom', defaultSeats: 4, pos: { x: 35.27, y: 53 } },
  { id: 63, label: '63', section: 'event', shape: 'booth-bottom', defaultSeats: 4, pos: { x:  9.8,  y: 53 } },

  { id: 64, label: '64', section: 'event', shape: 'square-tall', defaultSeats: 4, pos: { x:  7.0,  y: 30 } },
  { id: 65, label: '65', section: 'event', shape: 'square-tall', defaultSeats: 4, pos: { x: 34.33, y: 30 } },
  { id: 66, label: '66', section: 'event', shape: 'square-tall', defaultSeats: 4, pos: { x: 61.67, y: 30 } },
  { id: 67, label: '67', section: 'event', shape: 'square-tall', defaultSeats: 4, pos: { x: 89.0,  y: 30 } },

  { id: 70, label: '70', section: 'event', shape: 'round-sm',    defaultSeats: 2, pos: { x: 89.4,  y: 11 } },
  { id: 71, label: '71', section: 'event', shape: 'round-sm',    defaultSeats: 2, pos: { x: 61.8,  y: 11 } },
  { id: 72, label: '72', section: 'event', shape: 'round-sm',    defaultSeats: 2, pos: { x: 34.2,  y: 11 } },
  { id: 73, label: '73', section: 'event', shape: 'round-sm',    defaultSeats: 2, pos: { x:  6.6,  y: 11 } },

];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function getTableDef(id) {
  return TABLE_DEFS.find(t => t.id === id) || null;
}

function getTablesBySection(sectionId) {
  return TABLE_DEFS.filter(t => t.section === sectionId);
}

// SVG half-dimensions for each shape — sized for the 0–100 overview coordinate space.
// No external scaling factor needed; these values produce proportionate display sizes
// that match the actual floor plan images.
const SHAPE_DIMS = {
  'round-lg':    { type: 'circle', r: 6.3  },
  'round-md':    { type: 'circle', r: 5.0  },
  'round-sm':    { type: 'circle', r: 3.6  },
  'square':      { type: 'rect',   w: 5.0, h:  5.0 },
  'square-tall': { type: 'rect',   w: 4.0, h:  8.0 },
  'rect-h':      { type: 'rect',   w: 6.8, h:  5.0 },
  'rect-v':      { type: 'rect',   w: 5.0, h:  6.8 },
  'rect-xl':     { type: 'rect',   w: 9.9, h:  5.0 },
  'rect-sm':     { type: 'rect',   w: 4.5, h:  3.2 },
  'rect-thin':   { type: 'rect',   w: 5.0, h:  3.2 },
  'square-sm':   { type: 'rect',   w: 3.2, h:  3.2 },
  // Booths — sized to sit flush against the wall they hug.
  'booth-left':   { type: 'rect',  w: 4.0, h:  6.0 },
  'booth-bottom': { type: 'rect',  w: 7.35, h: 4.2 },
};

// Max guests for booth shapes. Any count beyond these MUST use the combine flow.
const BOOTH_CAPS = {
  'booth-left':   6,  // 2 bench + 2 above + 2 below
  'booth-bottom': 4,  // 1 left + 1 right + 2 below
};

// Given a table id, returns the max guests the table alone can physically hold.
// Non-booth tables default to defaultSeats (the combine prompt fires for ANY count above it).
function getTableCapacity(id) {
  const def = getTableDef(id);
  if (!def) return 0;
  if (BOOTH_CAPS[def.shape] != null) return BOOTH_CAPS[def.shape];
  return def.defaultSeats;
}

// Spatially adjacent tables in the SAME section, within a distance threshold
// on the normalized 0–100 coordinate grid. Excludes the source table itself.
// Default threshold 28 catches booth neighbors (20↔21, 60↔61) without false positives
// between interior tables. Tunable if adjacencies feel off in the UI.
function getAdjacentTables(id, threshold) {
  const t = getTableDef(id);
  if (!t) return [];
  const thr = (typeof threshold === 'number') ? threshold : 28;
  return TABLE_DEFS.filter(other => {
    if (other.id === id) return false;
    if (other.section !== t.section) return false;
    const dx = other.pos.x - t.pos.x;
    const dy = other.pos.y - t.pos.y;
    return Math.sqrt(dx*dx + dy*dy) <= thr;
  });
}
 