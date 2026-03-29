import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks';
import { UserAvatar } from './components/UserAvatar';
import { usePwaDetection } from '@hooks';
import styles from './style.module.scss';
import { useEffect, useState } from 'react';

interface HeaderProps {
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileMenuOpen,
  onMobileMenuToggle,
}) => {
  const { user, profile, isAdmin } = useAuth();
  const { isMobilePwa } = usePwaDetection();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  const isInformationPage = location.pathname === '/information';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <header className={styles.headerContainer}>
      {isInformationPage && isMobile ? (
        <button
          className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.active : ''}`}
          onClick={onMobileMenuToggle}
        >
          <div className={styles.burgerMenu}>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
            <span className={styles.line}></span>
          </div>
        </button>
      ) : (
        <a href="#" onClick={handleLogoClick} className={styles.logo}>
          Золотое кольцо Гомельщины
        </a>
      )}
      <nav className={styles.nav}>
        <Link to="/about" className={styles.navLink}>
          О проекте
        </Link>
        {user ? (
          <div className={styles.userBlock}>
            {!isMobilePwa && (
              <UserAvatar
                avatarUrl={profile?.avatar_url}
                username={profile?.username}
                email={user.email || ''}
              />
            )}
            {isAdmin && (
              <Link to="/admin" className={styles.navLink}>
                Админ-панель
              </Link>
            )}
          </div>
        ) : (
          <Link to="/auth" className={styles.button}>
            Войти
          </Link>
        )}
      </nav>
    </header>
  );
};
