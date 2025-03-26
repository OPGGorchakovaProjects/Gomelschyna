import { Link } from 'react-router-dom';
import styles from './style.module.scss';
import { logo, emblem, background, mapImage, searchIcon } from '@assets';

export const Home = () => {
  return (
    <div className={styles.heroSection}>
      <div className={styles.leftSection}>
        <img src={logo} alt="Логотип" className={styles.logo} />
        <p className={styles.logoText}>
          Гомельский государственный аграрно-экономический колледж
        </p>
        <img src={emblem} alt="Герб" className={styles.emblem} />
        <img src={background} alt="Фон" className={styles.background} />
        <p className={styles.title}>Я здесь родился и этим горжусь</p>
        <p className={styles.subtitle}>Гомельская область</p>
      </div>
      <div className={styles.rightSection}>
        <div className={`${styles.card} ${styles.mapCard}`}>
          <Link to="/Map">
            <img src={mapImage} alt="Карта" className={styles.cardImage} />
            <p className={styles.cardTitle}>Интерактивная карта</p>
            <p className={styles.cardSubtitle}>Гомельской области</p>
            <p className={styles.cardHint}>Нажмите на карточку для перехода</p>
          </Link>
        </div>
        <div className={`${styles.card} ${styles.infoCard}`}>
          <Link to="/Information">
            <img src={searchIcon} alt="Поиск" className={styles.cardIcon} />
            <p className={styles.cardTitle}>Больше информации</p>
            <p
              className={styles.cardHint}
              style={{ color: 'rgba(255, 255, 255, 0.28)' }}
            >
              Нажмите на карточку для перехода
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
