# FloorPlan layout guidelines

Floor 1 (`floor-1` in `floorData.ts`) is the baseline for layout quality on
this map. Floor 2 (`floor-2`) predates these fixes and has not been brought
up to the same standard yet — use this doc as the checklist when it is.

All values below are in the SVG grid units used by `floorData.ts`
(`viewBox="0 0 ${BUILDING.w} ${BUILDING.h}"`), not pixels.

## The pattern, in words

The floor is three horizontal bands, top to bottom:

1. **Room strip** — spans the *entire* building width (flush with the
   left/right walls, i.e. flush with the entrance and stairwell columns
   below it). Multiple rooms in this strip share a `group` id so they render
   as one unified bordered box with thin divider lines between sections,
   instead of each room drawing its own separate border.
2. **Seating block** — the PC rows, sandwiched between two side columns:
   - **Entrance** on the left wall, **stairwell** on the right wall.
   - Both columns sit *below* the room strip (not beside it) and match the
     seating block's height exactly — they do not span the full building
     height.
   - All PC rows share the same left/right span (`CONTENT_X` to `STAIR_X`),
     so every row's last seat lines up flush against the stairwell and every
     row's first seat lines up flush against the entrance.
3. Generous padding above row A (below the room strip) and below the last
   row (above the building's rounded bottom corner) — see "Padding budget"
   below for why the building height was grown to make room for this rather
   than shrinking it out of the row gaps.

## Row spacing rhythm

Within the seating block, rows read as two pairs sharing a center aisle:

- Row A → Row B: full walkway gap (`1.0` units)
- Row B → Row C: **hairline seam only** (`0.3` units) — these two sit
  back-to-back against a shared aisle, not a walkway
- Row C → Row D: full walkway gap (`1.0` units), matching A→B

Keep this 1.0 / 0.3 / 1.0 rhythm whenever rows are added or resized — it's
what reads as "two rows sharing a walkway" vs. "back-to-back pair" rather
than four evenly-spaced rows.

## Padding budget

Floor 1 originally packed the seating block edge-to-edge against the room
strip above and the building's rounded bottom corner below — both hugged
their neighbor with under 1 unit of clearance, which reads as cramped.

The fix was **not** to steal space from the row gaps above. Instead the
building envelope itself was grown (`BUILDING.h` went from `24` to `26`) to
create real room, then that room was spent on:

- `ROOMS` bottom → row A top: `1.5` units of clearance
- Row D bottom → building's inner bottom edge (`BUILDING.h - 1`): `~1.6`
  units of clearance

Do this for floor 2 too if its top/bottom padding looks tight: grow
`BUILDING.h` (shared by both floors) rather than compressing row gaps to
find space.

## Current floor 1 values (reference)

```
BUILDING            = { w: 64, h: 26 }

STAIR_X = 58, STAIR_W = 4      // stairwell column, right wall
DOOR_X  = 2,  DOOR_W  = 4      // entrance column, left wall
CONTENT_X = 7                  // left edge every PC row shares
CONTENT_W = 51                 // = STAIR_X - CONTENT_X

ROOMS_Y = 4, ROOMS_H = 5.2     // room strip
ROOMS_X = DOOR_X                          // flush with entrance's left edge
ROOMS_W = STAIR_X + STAIR_W - DOOR_X      // flush with stairwell's right edge

SEATS_Y      = 10.7            // top of row A; top of entrance/stairs columns
SEATS_BOTTOM = 23.4            // bottom of row D; bottom of entrance/stairs columns

SEAT = 2.6, GAP = 0.5          // seat size and within-row gap

Row A: y = 10.7   (SEATS_Y)
Row B: y = 14.3   (A bottom 13.3 + 1.0 walkway gap)
Row C: y = 17.2   (B bottom 16.9 + 0.3 hairline)
Row D: y = 20.8   (C bottom 19.8 + 1.0 walkway gap; D bottom 23.4 = SEATS_BOTTOM)
```

Entrance and stairwell columns: `y: SEATS_Y`, `h: SEATS_BOTTOM - SEATS_Y`.

## Other conventions established on floor 1

- **Seat count matches across rows.** All four PC rows have the same seat
  count (16) so every row's last seat lines up on the same vertical line
  against the stairwell — a shorter row (e.g. the old 8-seat row D) reads as
  visibly "off" even when its gaps are mathematically correct, because its
  edge doesn't match its neighbors'.
- **Grouped rooms need a real border, not per-room borders.** See
  `groupRooms()` in `FloorPlan.tsx` — rooms sharing a `group` id get one
  rounded outer `rect` (via an SVG `clipPath` so the fills don't poke past
  the rounded corners) plus thin `<line>` dividers at each internal seam,
  drawn *after* the fills so the border sits on top.
- **Door/entrance markers need real fill/stroke, not `fill: none`.** A
  "door" `Room` with `h >= 4` renders its label centered inside the shape
  (like a room), not as inline text beside it — that inline-label path is
  only for small door gaps (e.g. floor 2's `Cửa`, `h: 2`).
- **Legend swatches need HTML color rules, not just the SVG seat classes.**
  `.seat-available` / `.seat-occupied` / `.seat-maintenance` only set SVG
  `fill`/`stroke` for the `<rect>` seats. The legend's `<i>` dot needs its
  own `background`/`border-color` rules (see `.legendDot.seat-*` in
  `FloorPlan.module.css`) — reusing the same class name is not enough since
  `fill`/`stroke` do nothing on an HTML element.
