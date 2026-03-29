import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Screen } from '@modules';
import { FaMapMarkedAlt, FaHeart, FaStar, FaRoute } from 'react-icons/fa';
import styles from './style.module.scss';

export const AboutPage: React.FC = () => {
  const siteUrl = window.location.origin;
  const [isLoaded, setIsLoaded] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <Screen>
      <div ref={bgRef} className={styles.aboutBg} />
      <div className={styles.aboutOverlay} />
      <div className={styles.aboutWrapper}>
        <div className={styles.aboutContainer}>
          {/* Левая часть */}
          <div className={styles.leftSection}>
            <h1 className={styles.aboutTitle}>О проекте</h1>
            <h2 className={styles.aboutSubtitle}>Золотое кольцо Гомельщины</h2>
            
            <p className={styles.descriptionText}>
              Проект направлен на развитие <strong>внутреннего туризма</strong> и популяризацию{' '}
              <strong>культурного наследия Гомельской области</strong> через создание{' '}
              <strong>единого цифрового ресурса</strong>.
            </p>

            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <FaMapMarkedAlt className={styles.featureIcon} />
                <span>Интерактивная карта</span>
              </div>
              <div className={styles.featureItem}>
                <FaRoute className={styles.featureIcon} />
                <span>Построение маршрутов</span>
              </div>
              <div className={styles.featureItem}>
                <FaHeart className={styles.featureIcon} />
                <span>Избранное</span>
              </div>
              <div className={styles.featureItem}>
                <FaStar className={styles.featureIcon} />
                <span>Отзывы</span>
              </div>
            </div>

            <div className={styles.missionBox}>
              <p>
                Воспитание любви к родному краю и <strong>патриотическое воспитание молодежи</strong>{' '}
                через современные цифровые технологии.
              </p>
            </div>
          </div>

          {/* Правая часть */}
          <div className={styles.rightSection}>
            <div className={styles.qrContainer}>
              <h3 className={styles.qrTitle}>Поделитесь проектом</h3>
              <div className={styles.qrCodeBox}>
                <QRCodeSVG
                  value={siteUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className={styles.qrUrl}>{siteUrl}</p>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
};
