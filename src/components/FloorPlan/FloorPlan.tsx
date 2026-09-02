import { useMemo, useState } from 'react';
import { Layers, X } from 'lucide-react';
import { BUILDING, FLOORS, getMockPcInfo, type PcInfo, type PcRow } from './floorData';
import styles from './FloorPlan.module.css';

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
          {floor.rooms.map((room) => (
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
              const info = getMockPcInfo(seat.number, seat.index);
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
