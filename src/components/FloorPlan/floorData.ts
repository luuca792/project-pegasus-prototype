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
export const BUILDING = { w: 64, h: 24 };

// Floor 1's middle "column" in the source sketch is actually two rows of PCs
// standing back-to-back against a shared center aisle — rows B and C below,
// placed almost flush against each other. Row D (the short row) sits flush
// against the stairwell, which occupies the same spot on both floors (it's
// the same physical stairwell) — rotated 90° along with everything else, so
// it's now a tall/narrow box instead of the sketch's short/wide one.
const STAIR_X = 58;
const STAIR_W = 4;
const STAIR_Y = 4;
const STAIR_H = 18.7;
const SEAT = 2.6;
const GAP = 0.5;

// Floor 1's content column runs between two full-height side columns: the
// entrance on the left wall, the stairwell on the right wall. Everything else
// (the 3-way room strip, the PC seating block) spans the same width between
// them, so they all read as one aligned layout instead of independently sized
// pieces floating in the middle.
const CONTENT_X = 7;
const CONTENT_W = 51; // STAIR_X - CONTENT_X
const DOOR_X = 2;
const DOOR_W = 4;

export const FLOORS: FloorPlanData[] = [
  {
    id: 'floor-1',
    label: 'Tầng 1',
    rooms: [
      // Admin/blocked/restroom were stacked vertically in the source sketch, each
      // spanning the building's full (short) width. Rotated 90°, that stack becomes
      // a single horizontal strip above the PC rows (mirroring floor 2's smoking
      // strip). The three sections abut with no gap so their shared borders read
      // as one unified strip with division lines, rather than three separate boxes.
      // The strip spans the same width as the PC block below it (CONTENT_X to
      // STAIR_X), matching the entrance column on the left and stairwell on the right.
      { id: 'f1-admin', label: 'Quản lý', kind: 'admin', x: CONTENT_X, y: 4, w: CONTENT_W / 3, h: 5.2 },
      { id: 'f1-blocked', label: 'Khu vực nội bộ', kind: 'blocked', x: CONTENT_X + CONTENT_W / 3, y: 4, w: CONTENT_W / 3, h: 5.2 },
      { id: 'f1-restroom', label: 'Nhà vệ sinh', kind: 'restroom', x: CONTENT_X + (2 * CONTENT_W) / 3, y: 4, w: CONTENT_W / 3, h: 5.2 },
      { id: 'f1-stairs', label: 'Cầu thang', kind: 'stairs', x: STAIR_X, y: STAIR_Y, w: STAIR_W, h: STAIR_H },
      // Entrance is a full-height column on the left wall, mirroring the stairwell
      // on the right — both span the full height of the room strip + PC block.
      { id: 'f1-door', label: 'Lối vào', kind: 'door', x: DOOR_X, y: STAIR_Y, w: DOOR_W, h: STAIR_H },
    ],
    pcRows: [
      // A-B and C-D each have a full walkway gap; B-C sit back-to-back with only
      // a hairline seam (no walkway). Rows span the same CONTENT_X-to-STAIR_X
      // width as the room strip above; D (fewer seats, same seat size) is
      // right-aligned so A11/B11/C11/D-last all line up flush against the stairwell.
      { id: 'f1-row-a', x: CONTENT_X, y: 10, count: 16, seatSize: SEAT, gap: GAP, prefix: 'A' },
      { id: 'f1-row-b', x: CONTENT_X, y: 13.6, count: 16, seatSize: SEAT, gap: GAP, prefix: 'B' },
      { id: 'f1-row-c', x: CONTENT_X, y: 16.5, count: 16, seatSize: SEAT, gap: GAP, prefix: 'C' },
      { id: 'f1-row-d', x: 21.3, y: 20.1, count: 12, seatSize: SEAT, gap: GAP, prefix: 'D' },
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
      { id: 'f2-stairs', label: 'Cầu thang', kind: 'stairs', x: STAIR_X, y: STAIR_Y, w: STAIR_W, h: STAIR_H },
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

const STATUS_CYCLE: PcStatus[] = ['available', 'occupied', 'occupied', 'maintenance'];

// Placeholder spec/status generator — will be replaced by real occupancy data later.
export function getMockPcInfo(number: string, index: number): PcInfo {
  const isVip = number.startsWith('V') || number.startsWith('W');
  return {
    number,
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
    cpu: isVip ? 'Intel Core i7' : 'Intel Core i5',
    gpu: isVip ? 'RTX 4070' : 'RTX 3060',
    ram: isVip ? '32GB' : '16GB',
    monitor: isVip ? '27" 165Hz' : '24" 144Hz',
  };
}
