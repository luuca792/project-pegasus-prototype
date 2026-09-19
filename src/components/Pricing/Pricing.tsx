import { Check, Star } from 'lucide-react';
import styles from './Pricing.module.css';

const ROOMS = [
  {
    name: 'Phòng thường',
    highlight: false,
    tiers: [
      { label: 'Khách', price: '13.000đ' },
      { label: 'Hội viên', price: '7.000đ' },
    ],
    perks: ['Cấu hình tiêu chuẩn', 'Màn hình phổ thông', 'Mạng cáp quang tốc độ cao'],
  },
  {
    name: 'Phòng VIP',
    highlight: true,
    tiers: [
      { label: 'Khách', price: '15.000đ' },
      { label: 'Hội viên', price: '10.000đ' },
    ],
    perks: ['Cấu hình mạnh', 'Màn hình cao cấp', 'Mạng cáp quang tốc độ cao'],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Bảng giá</span>
          <h2>Giá tốt, chơi thả ga</h2>
          <p className={styles.lead}>Giá tham khảo — ghé quán hoặc liên hệ để cập nhật khuyến mãi mới nhất.</p>
        </div>

        <div className={styles.grid}>
          {ROOMS.map((room) => (
            <div key={room.name} className={`${styles.card} ${room.highlight ? styles.highlight : ''}`}>
              {room.highlight && (
                <span className={styles.badge}>
                  <Star size={12} fill="currentColor" />
                  Phổ biến nhất
                </span>
              )}
              <h3 className={styles.planName}>{room.name}</h3>
              <div className={styles.tiers}>
                {room.tiers.map((tier) => (
                  <div key={tier.label} className={styles.tierRow}>
                    <span className={styles.tierLabel}>{tier.label}</span>
                    <span className={styles.priceRow}>
                      <span className={styles.price}>{tier.price}</span>
                      <span className={styles.unit}>/ giờ</span>
                    </span>
                  </div>
                ))}
              </div>
              <ul className={styles.perks}>
                {room.perks.map((perk) => (
                  <li key={perk}>
                    <Check size={16} className={styles.checkIcon} />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
