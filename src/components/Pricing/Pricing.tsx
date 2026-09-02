import { Check, Star } from 'lucide-react';
import styles from './Pricing.module.css';

const PLANS = [
  {
    name: 'Giờ lẻ',
    price: '8.000đ',
    unit: '/ giờ',
    highlight: false,
    perks: ['Cấu hình mạnh chuẩn esports', 'Mạng cáp quang tốc độ cao', 'Ghế gaming êm ái'],
  },
  {
    name: 'Hội viên',
    price: '6.000đ',
    unit: '/ giờ',
    highlight: true,
    perks: ['Đăng ký thẻ hội viên miễn phí', 'Tặng thêm % giờ chơi khi nạp thẻ', 'Ưu tiên giữ chỗ cuối tuần', 'Tích điểm đổi quà'],
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
          {PLANS.map((plan) => (
            <div key={plan.name} className={`${styles.card} ${plan.highlight ? styles.highlight : ''}`}>
              {plan.highlight && (
                <span className={styles.badge}>
                  <Star size={12} fill="currentColor" />
                  Phổ biến nhất
                </span>
              )}
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.priceRow}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.unit}>{plan.unit}</span>
              </div>
              <ul className={styles.perks}>
                {plan.perks.map((perk) => (
                  <li key={perk}>
                    <Check size={16} className={styles.checkIcon} />
                    {perk}
                  </li>
                ))}
              </ul>
              <a href="#contact" className={plan.highlight ? styles.ctaPrimary : styles.ctaSecondary}>
                Chọn gói này
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
