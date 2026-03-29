import styles from './style.module.scss';
import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className={styles.footer}>
    <nav className={styles.footerNav}>
      <Link to="/" className={styles.footerLink}>
        Главная
      </Link>
      <Link to="/map" className={styles.footerLink}>
        Карта
      </Link>
      <Link to="/information" className={styles.footerLink}>
        Больше информации
      </Link>
      <Link to="/profile" className={styles.footerLink}>
        Профиль
      </Link>
    </nav>
    <div className={styles.copyright}>
      © {new Date().getFullYear()} Золотое Кольцо Гомельщины
    </div>
  </footer>
);
