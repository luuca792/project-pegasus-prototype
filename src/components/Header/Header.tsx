import { useEffect, useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import styles from './Header.module.css';

const NAV_LINKS = [
  { label: 'Trang chủ', href: '#home' },
  { label: 'Không gian', href: '#gallery' },
  { label: 'Dịch vụ', href: '#services' },
  { label: 'Bảng giá', href: '#pricing' },
  { label: 'Liên hệ', href: '#contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#home" className={styles.brand}>
          <img src={logo} alt="NTN Gaming" className={styles.logo} />
          <span className={styles.brandText}>
            NTN<span className={styles.brandAccent}>GAMING</span>
          </span>
        </a>

        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a
            href="https://maps.google.com/?q=42+Duong+Quang+Dong,+Khom+4,+Phuong+Hoa+Thuan,+Tra+Vinh"
            target="_blank"
            rel="noreferrer"
            className={styles.locationPill}
          >
            <MapPin size={14} />
            <span>Trà Vinh</span>
          </a>
          <a href="#contact" className={styles.ctaButton}>
            Liên hệ ngay
          </a>
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Mở menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav className={styles.mobileNav}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className={styles.mobileCta} onClick={() => setMenuOpen(false)}>
            Liên hệ ngay
          </a>
        </nav>
      )}
    </header>
  );
}
