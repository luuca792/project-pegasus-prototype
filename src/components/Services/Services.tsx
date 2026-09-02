import { useEffect, useState } from 'react';
import { UtensilsCrossed, CupSoda, X } from 'lucide-react';
import styles from './Services.module.css';

type MenuCategory = 'food' | 'drink';

type MenuItem = {
  name: string;
  price: string;
};

const SERVICES: {
  id: MenuCategory;
  icon: typeof UtensilsCrossed;
  title: string;
  desc: string;
  examples: string;
}[] = [
  {
    id: 'food',
    icon: UtensilsCrossed,
    title: 'Đồ ăn',
    desc: 'Đồ ăn nhanh phục vụ tận bàn, cày game không lo đói.',
    examples: 'Mì gói, snack, xúc xích, cơm chiên...',
  },
  {
    id: 'drink',
    icon: CupSoda,
    title: 'Nước uống',
    desc: 'Menu nước giải khát đa dạng, đủ tỉnh táo cho những trận cày dài.',
    examples: 'Trà sữa, nước ngọt, cà phê, nước tăng lực...',
  },
];

const MENU: Record<MenuCategory, MenuItem[]> = {
  food: [
    { name: 'Mì ly', price: '15.000đ' },
    { name: 'Xúc xích chiên', price: '15.000đ' },
    { name: 'Cơm chiên trứng', price: '25.000đ' },
    { name: 'Snack các loại', price: '10.000đ' },
    { name: 'Bánh mì que', price: '12.000đ' },
  ],
  drink: [
    { name: 'Nước suối', price: '8.000đ' },
    { name: 'Nước ngọt lon (Coca, Pepsi...)', price: '12.000đ' },
    { name: 'Trà sữa', price: '20.000đ' },
    { name: 'Cà phê sữa đá', price: '18.000đ' },
    { name: 'Nước tăng lực (Sting, Warrior...)', price: '15.000đ' },
  ],
};

const MENU_LABEL: Record<MenuCategory, string> = {
  food: 'Đồ ăn',
  drink: 'Nước uống',
};

export function Services() {
  const [activeMenu, setActiveMenu] = useState<MenuCategory | null>(null);

  useEffect(() => {
    if (!activeMenu) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMenu(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeMenu]);

  return (
    <section id="services" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Dịch vụ</span>
          <h2>Hơn cả một phòng net</h2>
        </div>

        <div className={styles.grid}>
          {SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={styles.card}
              onClick={() => setActiveMenu(s.id)}
            >
              <div className={styles.iconWrap}>
                <s.icon size={26} />
              </div>
              <div className={styles.cardBody}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <p className={styles.examples}>{s.examples}</p>
                <span className={styles.viewMenu}>Xem menu đầy đủ →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeMenu && (
        <div className={styles.overlay} onClick={() => setActiveMenu(null)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label={`Menu ${MENU_LABEL[activeMenu]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.toggleRow}>
                {(['food', 'drink'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.toggleButton} ${activeMenu === cat ? styles.toggleActive : ''}`}
                    onClick={() => setActiveMenu(cat)}
                  >
                    {MENU_LABEL[cat]}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setActiveMenu(null)}
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            <ul className={styles.menuList}>
              {MENU[activeMenu].map((item) => (
                <li key={item.name} className={styles.menuItem}>
                  <span>{item.name}</span>
                  <span className={styles.menuPrice}>{item.price}</span>
                </li>
              ))}
            </ul>

            <p className={styles.menuNote}>Giá tham khảo — có thể thay đổi tùy thời điểm.</p>
          </div>
        </div>
      )}
    </section>
  );
}
