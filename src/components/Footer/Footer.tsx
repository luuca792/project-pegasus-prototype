import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>
            <img src={logo} alt="NTN Gaming" className={styles.logo} />
            <span className={styles.brandText}>
              NTN<span className={styles.brandAccent}>GAMING</span>
            </span>
          </div>
          <p className={styles.tagline}>Phòng net chuẩn esports giữa lòng Trà Vinh.</p>
          <a
            href="https://www.facebook.com/profile.php?id=61579351685897"
            target="_blank"
            rel="noreferrer"
            className={styles.socialLink}
          >
            <MessageCircle size={18} />
            Theo dõi trên Facebook
          </a>
        </div>

        <div className={styles.infoCol}>
          <h3 className={styles.colTitle}>Ghé thăm chúng tôi</h3>
          <div className={styles.infoRow}>
            <MapPin size={18} className={styles.infoIcon} />
            <span>Số 42, Dương Quang Đông, Khóm 4, Phường Hòa Thuận, Trà Vinh</span>
          </div>
          <div className={styles.infoRow}>
            <Phone size={18} className={styles.infoIcon} />
            <a href="tel:0988585801">0988 585 801 (SĐT / Zalo)</a>
          </div>
          <div className={styles.infoRow}>
            <Clock size={18} className={styles.infoIcon} />
            <span>Mở cửa 7:00 – 23:00 mỗi ngày, kể cả lễ, Tết</span>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>© 2026 NTN Gaming.</span>
      </div>
    </footer>
  );
}
