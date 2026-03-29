import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';
import { useAuth } from '@hooks';
import {
  IconHome,
  IconMap,
  IconInfoCircle,
  IconUser,
  IconInfoSquare,
} from '@tabler/icons-react';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navLink}>
        <IconHome className={styles.icon} />
        <span>Главная</span>
      </Link>
      <Link to="/map" className={styles.navLink}>
        <IconMap className={styles.icon} />
        <span>Карта</span>
      </Link>
      <Link to="/information" className={styles.navLink}>
        <IconInfoCircle className={styles.icon} />
        <span>Инфо</span>
      </Link>
      <Link to="/about" className={styles.navLink}>
        <IconInfoSquare className={styles.icon} />
        <span>О проекте</span>
      </Link>
      {user && (
        <Link to="/profile" className={styles.navLink}>
          <IconUser className={styles.icon} />
          <span>Профиль</span>
        </Link>
      )}
    </nav>
  );
};
