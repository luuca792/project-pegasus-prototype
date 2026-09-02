import { useMemo, useState } from 'react';
import { Layers, X } from 'lucide-react';
import { BUILDING, FLOORS, getMockPcInfo, type PcInfo, type PcRow, type Room } from './floorData';
import styles from './FloorPlan.module.css';

/** Rooms that share a `group` render as one bordered strip: a single outer
 *  rect spanning the group's bounds, plus thin divider lines at each internal
 *  seam, instead of each room drawing its own border. Ungrouped rooms (and
 *  each group as a whole) keep their individual fills for kind-based styling. */
function groupRooms(rooms: Room[]) {
  const groups = new Map<string, Room[]>();
  const solo: Room[] = [];
  for (const room of rooms) {
    if (!room.group) {
      solo.push(room);
      continue;
    }
    const members = groups.get(room.group) ?? [];
    members.push(room);
    groups.set(room.group, members);
  }
  return { groups: [...groups.values()], solo };
}

const STATUS_LABEL: Record<PcInfo['status'], string> = {
  available: 'Trống',
  occupied: 'Đang sử dụng',
  maintenance: 'Bảo trì',
};

function seatPositions(row: PcRow) {
  return Array.from({ length: row.count }, (_, i) => {
    const x = row.x + i * (row.seatSize + row.gap);
    return { number: `${row.prefix}${i + 1}`, x, y: row.y, index: i };
  });
}

export function FloorPlan() {
  const [floorId, setFloorId] = useState(FLOORS[0].id);
  const [selected, setSelected] = useState<PcInfo | null>(null);

  const floor = useMemo(() => FLOORS.find((f) => f.id === floorId) ?? FLOORS[0], [floorId]);
  const { groups: roomGroups, solo: soloRooms } = useMemo(() => groupRooms(floor.rooms), [floor]);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarTitle}>
          <Layers size={16} />
          <span>Chọn tầng</span>
        </div>
        <div className={styles.floorSwitch}>
          {FLOORS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`${styles.floorButton} ${f.id === floorId ? styles.floorButtonActive : ''}`}
              onClick={() => {
                setFloorId(f.id);
                setSelected(null);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.mapArea}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${BUILDING.w} ${BUILDING.h}`}
          role="img"
          aria-label={`Sơ đồ mặt bằng ${floor.label}`}
        >
          <rect
            x={1}
            y={1}
            width={BUILDING.w - 2}
            height={BUILDING.h - 2}
            rx={2}
            className={styles.buildingOutline}
          />
          {roomGroups.map((members) => {
            const x = Math.min(...members.map((r) => r.x));
            const y = Math.min(...members.map((r) => r.y));
            const right = Math.max(...members.map((r) => r.x + r.w));
            const bottom = Math.max(...members.map((r) => r.y + r.h));
            const sorted = [...members].sort((a, b) => a.x - b.x);
            const clipId = `room-group-clip-${sorted[0].group}`;
            return (
              <g key={sorted[0].group}>
                <clipPath id={clipId}>
                  <rect x={x} y={y} width={right - x} height={bottom - y} rx={0.6} />
                </clipPath>
                <g clipPath={`url(#${clipId})`}>
                  {sorted.map((room) => (
                    <rect
                      key={room.id}
                      x={room.x}
                      y={room.y}
                      width={room.w}
                      height={room.h}
                      className={`${styles.roomFill} ${styles[`room-${room.kind}`]}`}
                    />
                  ))}
                </g>
                <rect
                  x={x}
                  y={y}
                  width={right - x}
                  height={bottom - y}
                  rx={0.6}
                  className={styles.roomGroupOutline}
                />
                {sorted.slice(1).map((room) => (
                  <line
                    key={`${room.id}-divider`}
                    x1={room.x}
                    y1={y}
                    x2={room.x}
                    y2={bottom}
                    className={styles.roomDivider}
                  />
                ))}
                {sorted.map((room) => (
                  <foreignObject key={`${room.id}-label`} x={room.x} y={room.y} width={room.w} height={room.h}>
                    <div className={styles.roomLabel}>{room.label}</div>
                  </foreignObject>
                ))}
              </g>
            );
          })}
          {soloRooms.map((room) => (
            <g key={room.id}>
              <rect
                x={room.x}
                y={room.y}
                width={room.w}
                height={room.h}
                rx={0.6}
                className={`${styles.room} ${styles[`room-${room.kind}`]}`}
              />
              {(room.kind !== 'door' || room.h >= 4) && (
                <foreignObject x={room.x} y={room.y} width={room.w} height={room.h}>
                  <div className={styles.roomLabel}>{room.label}</div>
                </foreignObject>
              )}
              {room.kind === 'door' && room.h < 4 && (
                <foreignObject
                  x={room.x + room.w + 0.5}
                  y={room.y + room.h / 2 - 1.2}
                  width={16}
                  height={2.4}
                >
                  <div className={styles.doorLabelInline}>{room.label}</div>
                </foreignObject>
              )}
            </g>
          ))}

          {floor.pcRows.map((row) =>
            seatPositions(row).map((seat) => {
              const info = getMockPcInfo(seat.number);
              const isSelected = selected?.number === seat.number;
              return (
                <g
                  key={seat.number}
                  className={styles.seatGroup}
                  onClick={() => setSelected(info)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Máy ${seat.number} — ${STATUS_LABEL[info.status]}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelected(info);
                  }}
                >
                  <rect
                    x={seat.x}
                    y={seat.y}
                    width={row.seatSize}
                    height={row.seatSize}
                    rx={0.5}
                    className={`${styles.seat} ${styles[`seat-${info.status}`]} ${
                      isSelected ? styles.seatSelected : ''
                    }`}
                  />
                  <text
                    x={seat.x + row.seatSize / 2}
                    y={seat.y + row.seatSize / 2}
                    className={styles.seatLabel}
                  >
                    {seat.number}
                  </text>
                </g>
              );
            }),
          )}
        </svg>

        {selected && (
          <div className={styles.popover} role="dialog" aria-label={`Thông tin máy ${selected.number}`}>
            <button type="button" className={styles.popoverClose} onClick={() => setSelected(null)} aria-label="Đóng">
              <X size={16} />
            </button>
            <div className={styles.popoverHeader}>
              <span className={styles.popoverNumber}>Máy {selected.number}</span>
              <span className={`${styles.statusPill} ${styles[`status-${selected.status}`]}`}>
                {STATUS_LABEL[selected.status]}
              </span>
            </div>
            <dl className={styles.specList}>
              <div>
                <dt>CPU</dt>
                <dd>{selected.cpu}</dd>
              </div>
              <div>
                <dt>GPU</dt>
                <dd>{selected.gpu}</dd>
              </div>
              <div>
                <dt>RAM</dt>
                <dd>{selected.ram}</dd>
              </div>
              <div>
                <dt>Màn hình</dt>
                <dd>{selected.monitor}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <i className={`${styles.legendDot} ${styles['seat-available']}`} /> Trống
        </span>
        <span className={styles.legendItem}>
          <i className={`${styles.legendDot} ${styles['seat-occupied']}`} /> Đang sử dụng
        </span>
        <span className={styles.legendItem}>
          <i className={`${styles.legendDot} ${styles['seat-maintenance']}`} /> Bảo trì
        </span>
      </div>
    </div>
  );
}
