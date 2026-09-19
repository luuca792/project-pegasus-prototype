import { ArrowRight, Play } from 'lucide-react';
import heroImage from '../../assets/images/store-3.jpg';
import styles from './Hero.module.css';

const STATS = [
  { value: '50+', label: 'Máy cấu hình cao' },
  { value: '7h–23h', label: 'Mở cửa mỗi ngày' },
  { value: '2K/144Hz', label: 'Màn hình tốc độ cao' },
];

export function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.backdrop}>
        <img src={heroImage} alt="Không gian NTN Gaming" className={styles.backdropImage} />
        <div className={styles.backdropOverlay} />
      </div>

      <div className={styles.content}>
        <span className={styles.eyebrow}>Trà Vinh · Phòng net chuẩn Esports</span>
        <h1 className={styles.headline}>
          Chiến hết mình <span className={styles.headlineAccent}>tại NTN Gaming</span>
        </h1>
        <p className={styles.subtext}>
          Trải nghiệm dàn PC cấu hình khủng, ghế gaming êm ái, mạng cáp quang siêu tốc kèm với không gian
          chill hết cỡ và dịch vụ ăn uống tiện nghi.  Ghé NTN Gaming, phòng net được anh em game thủ Trà Vinh
          tin chọn.
        </p>

        <div className={styles.ctaRow}>
          <a href="#contact" className={styles.primaryCta}>
            Liên hệ ngay
            <ArrowRight size={18} />
          </a>
          <a href="#gallery" className={styles.secondaryCta}>
            <Play size={16} />
            Xem không gian
          </a>
        </div>

        <div className={styles.stats}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
