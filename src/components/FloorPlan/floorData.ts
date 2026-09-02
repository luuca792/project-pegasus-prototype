// Layout is expressed on an abstract grid (SVG viewBox units) so it can be
// redrawn to scale. Change PC_ROWS counts/positions here to update the map —
// PC numbering, popover targets, etc. all derive from this data.
//
// The source sketch is portrait (narrow building, long PC rows running top to
// bottom). The map here is rotated 90° from that sketch so it displays
// landscape and fits a desktop viewport without scrolling: each PC "row" is a
// horizontal band of seats running left-to-right, and the bands stack top to
// bottom (in the sketch's reading, that stack was the building's short axis).
// Both floors share one building footprint (BUILDING.w x BUILDING.h) and the
// same stairwell position (STAIR_X/STAIR_W), since it's the same stairwell.

export type RoomKind = 'restroom' | 'admin' | 'stairs' | 'blocked' | 'smoking' | 'door';

export interface Room {
  id: string;
  label: string;
  kind: RoomKind;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Rooms sharing a group id render as one unified bordered strip with thin
   *  divider lines between them, instead of each getting its own border. */
  group?: string;
}

export interface PcRow {
  id: string;
  /** left edge of the first seat, in grid units — the row runs left to right */
  x: number;
  y: number;
  count: number;
  seatSize: number;
  gap: number;
  /** prefix used for PC numbering, e.g. "A" -> A1, A2, ... */
  prefix: string;
}

export interface FloorPlanData {
  id: string;
  label: string;
  rooms: Room[];
  pcRows: PcRow[];
}

// Shared building envelope — both floors occupy the same rectangular shell.
// Taller than the source sketch's proportions would strictly need, to leave
// real breathing room above/below the PC block instead of packing it edge to
// edge with the room strip and the outline's rounded bottom corner.
export const BUILDING = { w: 64, h: 26 };

// Floor 1's middle "column" in the source sketch is actually two rows of PCs
// standing back-to-back against a shared center aisle — rows B and C below,
// placed almost flush against each other. Row D (the short row) sits flush
// against the stairwell, which occupies the same spot on both floors (it's
// the same physical stairwell) — rotated 90° along with everything else, so
// it's now a tall/narrow box instead of the sketch's short/wide one.
const STAIR_X = 58;
const STAIR_W = 4;
const SEAT = 2.6;
const GAP = 0.5;

// Floor 1's PC seating block runs between two side columns: the entrance on
// the left wall, the stairwell on the right wall. Both columns sit BELOW the
// room strip (which spans the building's full width above them, not just the
// content width) and match the seating block's height, not the full building
// height — the room strip is the one thing that spans corner to corner.
const CONTENT_X = 7;
const CONTENT_W = 51; // STAIR_X - CONTENT_X
const DOOR_X = 2;
const DOOR_W = 4;
const ROOMS_Y = 4;
const ROOMS_H = 5.2;
const ROOMS_X = DOOR_X; // flush with the entrance column's left edge
const ROOMS_W = STAIR_X + STAIR_W - DOOR_X; // flush with the stairwell's right edge
const SEATS_Y = 10.7; // top of row A — also top of the entrance/stairs columns; leaves clearance below the room strip
const SEATS_BOTTOM = 23.4; // bottom of row D — also bottom of the entrance/stairs columns; leaves clearance above the building's rounded bottom corner

export const FLOORS: FloorPlanData[] = [
  {
    id: 'floor-1',
    label: 'Tầng 1',
    rooms: [
      // Admin/blocked/restroom were stacked vertically in the source sketch, each
      // spanning the building's full (short) width. Rotated 90°, that stack becomes
      // a single horizontal strip above the PC rows (mirroring floor 2's smoking
      // strip), running the full width between the entrance and stairwell columns
      // below it (flush with both). All three share a `group`, so FloorPlan
      // renders one unified bordered strip with thin dividers instead of three
      // separately-bordered boxes.
      { id: 'f1-admin', label: 'Quản lý', kind: 'admin', x: ROOMS_X, y: ROOMS_Y, w: ROOMS_W / 3, h: ROOMS_H, group: 'f1-rooms' },
      { id: 'f1-blocked', label: 'Khu vực nội bộ', kind: 'blocked', x: ROOMS_X + ROOMS_W / 3, y: ROOMS_Y, w: ROOMS_W / 3, h: ROOMS_H, group: 'f1-rooms' },
      { id: 'f1-restroom', label: 'Nhà vệ sinh', kind: 'restroom', x: ROOMS_X + (2 * ROOMS_W) / 3, y: ROOMS_Y, w: ROOMS_W / 3, h: ROOMS_H, group: 'f1-rooms' },
      // Stairwell and entrance are columns below the room strip, matching the
      // PC seating block's height (top of row A to bottom of row D) rather than
      // the full building height.
      { id: 'f1-stairs', label: 'Cầu thang', kind: 'stairs', x: STAIR_X, y: SEATS_Y, w: STAIR_W, h: SEATS_BOTTOM - SEATS_Y },
      { id: 'f1-door', label: 'Lối vào', kind: 'door', x: DOOR_X, y: SEATS_Y, w: DOOR_W, h: SEATS_BOTTOM - SEATS_Y },
    ],
    pcRows: [
      // A-B and C-D each have a full walkway gap; B-C sit back-to-back with only
      // a hairline seam (no walkway). All four rows span CONTENT_X to STAIR_X,
      // between the entrance and stairwell columns, so A16/B16/C16/D16 all line
      // up flush against the stairwell on the right and the entrance on the left.
      { id: 'f1-row-a', x: CONTENT_X, y: SEATS_Y, count: 16, seatSize: SEAT, gap: GAP, prefix: 'A' },
      { id: 'f1-row-b', x: CONTENT_X, y: 14.3, count: 16, seatSize: SEAT, gap: GAP, prefix: 'B' },
      { id: 'f1-row-c', x: CONTENT_X, y: 17.2, count: 16, seatSize: SEAT, gap: GAP, prefix: 'C' },
      { id: 'f1-row-d', x: CONTENT_X, y: 20.8, count: 16, seatSize: SEAT, gap: GAP, prefix: 'D' },
    ],
  },
  {
    id: 'floor-2',
    label: 'Tầng 2 (VIP)',
    rooms: [
      // Smoking area was one continuous strip spanning the building's full (short)
      // width in the sketch. Rotated 90°, it becomes a strip spanning the full
      // (short) height along the top, above the PC rows.
      { id: 'f2-smoking', label: 'Khu vực hút thuốc', kind: 'smoking', x: 3, y: 4, w: 58, h: 7 },
      { id: 'f2-stairs', label: 'Cầu thang', kind: 'stairs', x: STAIR_X, y: 14, w: STAIR_W, h: 8 },
      { id: 'f2-door', label: 'Cửa', kind: 'door', x: 21, y: 11, w: 3, h: 2 },
    ],
    pcRows: [
      { id: 'f2-row-v', x: 21, y: 13, count: 9, seatSize: SEAT, gap: GAP, prefix: 'V' },
      { id: 'f2-row-w', x: 21, y: 17.8, count: 7, seatSize: SEAT, gap: GAP, prefix: 'W' },
    ],
  },
];

export type PcStatus = 'available' | 'occupied' | 'maintenance';

export interface PcInfo {
  number: string;
  status: PcStatus;
  cpu: string;
  gpu: string;
  ram: string;
  monitor: string;
}

// All seat numbers across both floors, in a fixed order — used to build a
// stable (not re-shuffled on every render) but scattered-looking status
// assignment: a handful under maintenance, a chunk occupied, the rest free.
const ALL_SEAT_NUMBERS = FLOORS.flatMap((floor) =>
  floor.pcRows.flatMap((row) => Array.from({ length: row.count }, (_, i) => `${row.prefix}${i + 1}`)),
);

const MAINTENANCE_COUNT = 2;
const OCCUPIED_COUNT = 10;

// Simple seeded PRNG (mulberry32) so the shuffle — and therefore the mock
// status layout — is the same on every load instead of changing on refresh.
function seededShuffle<T>(items: T[], seed: number): T[] {
  let state = seed;
  const rand = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const shuffledSeats = seededShuffle(ALL_SEAT_NUMBERS, 1337);
const STATUS_BY_SEAT = new Map<string, PcStatus>();
shuffledSeats.forEach((number, i) => {
  const status: PcStatus =
    i < MAINTENANCE_COUNT ? 'maintenance' : i < MAINTENANCE_COUNT + OCCUPIED_COUNT ? 'occupied' : 'available';
  STATUS_BY_SEAT.set(number, status);
});

// Placeholder spec/status generator — will be replaced by real occupancy data later.
export function getMockPcInfo(number: string): PcInfo {
  const isVip = number.startsWith('V') || number.startsWith('W');
  return {
    number,
    status: STATUS_BY_SEAT.get(number) ?? 'available',
    cpu: isVip ? 'Intel Core i7' : 'Intel Core i5',
    gpu: isVip ? 'RTX 4070' : 'RTX 3060',
    ram: isVip ? '32GB' : '16GB',
    monitor: isVip ? '27" 165Hz' : '24" 144Hz',
  };
}
