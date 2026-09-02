import { Cpu, Sofa, Wifi, Snowflake } from 'lucide-react';
import img1 from '../../assets/images/store-1.jpg';
import img2 from '../../assets/images/store-2.jpg';
import img3 from '../../assets/images/store-3.jpg';
import img4 from '../../assets/images/store-4.jpg';
import { FloorPlan } from '../FloorPlan/FloorPlan';
import styles from './Gallery.module.css';

const PHOTOS = [
  { src: img1, alt: 'Dàn máy hàng dài với màn hình cờ đỏ sao vàng', caption: 'Dàn PC hàng dài, tai nghe treo sẵn' },
  { src: img2, alt: 'Toàn cảnh khu vực chơi game', caption: 'Không gian rộng, ánh đèn neon' },
  { src: img4, alt: 'Góc phòng máy với ánh đèn tím', caption: 'Setup RGB đồng bộ từng dãy' },
  { src: img3, alt: 'Hành lang dãy máy NTN Gaming', caption: 'Lối đi rộng rãi, thoải mái di chuyển' },
];

const FEATURES = [
  { icon: Cpu, title: 'Cấu hình mạnh', desc: 'CPU/GPU đời mới, màn hình 144Hz mượt mà cho mọi tựa game.' },
  { icon: Wifi, title: 'Mạng cáp quang', desc: 'Đường truyền tốc độ cao, ping thấp, ổn định suốt giờ mở cửa.' },
  { icon: Sofa, title: 'Ghế gaming êm ái', desc: 'Ghế da bọc đệm dày, ngồi cày game hàng giờ không mỏi.' },
  { icon: Snowflake, title: 'Mát lạnh cả ngày', desc: 'Điều hòa phủ khắp phòng, không gian luôn dễ chịu.' },
];

export function Gallery() {
  return (
    <section id="gallery" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Không gian thực tế</span>
          <h2>Bên trong NTN Gaming</h2>
          <p className={styles.lead}>
            Từng góc máy, từng dãy ghế đều được setup để anh em có trải nghiệm chơi tốt nhất —
            đúng chuẩn phòng net esports.
          </p>
        </div>

        <div className={styles.photoGrid}>
          {PHOTOS.map((photo, i) => (
            <figure key={photo.src} className={`${styles.photoCard} ${styles[`span${i}`]}`}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>

        <div className={styles.features}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <f.icon size={22} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.mapHeading}>
          <span className={styles.eyebrow}>Sơ đồ mặt bằng</span>
          <h3>Chọn máy theo sơ đồ</h3>
          <p className={styles.lead}>
            Bấm vào từng máy để xem thông tin cấu hình và tình trạng còn trống — chuyển tầng bằng nút bên trên.
          </p>
        </div>
        <FloorPlan />
      </div>
    </section>
  );
}
