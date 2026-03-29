import { useAuth } from '@hooks';
import styles from './style.module.scss';
import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaInfoCircle, FaChevronDown } from 'react-icons/fa';
import { Screen } from '@modules';
import { useEffect, useRef, useMemo, memo, useState } from 'react';
import { ObjectsCarousel } from './components/ObjectsCarousel';
import { BottomObjectsCarousel } from './components/BottomObjectsCarousel';
import { objects as objectsApi } from '@api';
import { MapObject } from '@types';
import { useAtomValue, useSetAtom } from 'jotai';
import { objectRatingsAtom, loadAllRatingsAtom } from '@store';

interface ObjectData {
  name: string;
  description: string;
  image: string;
  coordinates: string;
  id?: number;
  averageRating?: number;
  ratingCount?: number;
  category: string;
}

const preloadBackgroundImage = () => {
  const img = new Image();
  img.src = '/img/background.png';
};

// Функция для преобразования MapObject в ObjectData
const transformMapObjectToObjectData = (mapObject: MapObject): ObjectData => {
  return {
    name: mapObject.name,
    description: mapObject.description,
    image:
      mapObject.images && mapObject.images.length > 0
        ? mapObject.images[0]
        : '/img/default-placeholder.jpg',
    coordinates: mapObject.coordinates.join(','),
    id: mapObject.id,
    category: mapObject.category,
  };
};

// Функция для получения топовых объектов по рейтингу
const getTopRatedObjects = (
  objects: ObjectData[],
  objectRatings: any[],
): ObjectData[] => {
  return objects
    .map(obj => {
      const rating = objectRatings.find(r => r.objectId === obj.id);
      return {
        ...obj,
        averageRating: rating?.averageRating || 0,
        ratingCount: rating?.ratingCount || 0,
      };
    })
    .filter(obj => obj.averageRating > 0) // Только объекты с рейтингом
    .sort((a, b) => {
      // Сначала по среднему рейтингу, затем по количеству оценок
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      return b.ratingCount - a.ratingCount;
    })
    .slice(0, 10); // Топ 10 объектов
};

// Функция для получения случайных объектов (для нижней карусели)
const getRandomObjects = (objects: ObjectData[]): ObjectData[] => {
  return [...objects].sort(() => 0.5 - Math.random()).slice(0, 10);
};

const HomeTitle = memo(
  ({ userName, loading }: { userName?: string; loading: boolean }) => {
    const title = useMemo(() => {
      if (loading) {
        return '«Золотое кольцо Гомельщины»';
      }
      if (!userName) {
        return '«Золотое кольцо Гомельщины»';
      }
      return `Добро пожаловать, ${userName}!\n«Золотое кольцо Гомельщины»`;
    }, [userName, loading]);

    return (
      <h1 className={`${styles.homeTitle} ${loading ? styles.loading : ''}`}>
        {title}
      </h1>
    );
  },
);

const HomeSubtitle = memo(() => (
  <p className={styles.homeSubtitle}>
    Откройте для себя «Золотое кольцо Гомельщины»: интерактивная карта, полезная
    информация и многое другое.
  </p>
));

export const Home = () => {
  const { profile, profileLoading } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [objects, setObjects] = useState<ObjectData[]>([]);
  const [objectsLoading, setObjectsLoading] = useState(true);
  const [objectsError, setObjectsError] = useState<string | null>(null);

  // Jotai atoms для рейтингов
  const objectRatings = useAtomValue(objectRatingsAtom);
  const loadAllRatings = useSetAtom(loadAllRatingsAtom);

  // Вычисляем топовые и случайные объекты
  const topRatedObjects = useMemo(() => {
    return getTopRatedObjects(objects, objectRatings);
  }, [objects, objectRatings]);

  const randomObjects = useMemo(() => {
    return getRandomObjects(objects);
  }, [objects]);

  useEffect(() => {
    preloadBackgroundImage();
    setIsLoaded(true);

    // Загружаем данные об объектах через API
    const loadObjects = async () => {
      try {
        setObjectsLoading(true);
        setObjectsError(null);

        const mapObjects = (await objectsApi.getAll()) as MapObject[];
        const transformedObjects = mapObjects.map(
          transformMapObjectToObjectData,
        );
        setObjects(transformedObjects);

        // Загружаем рейтинги
        await loadAllRatings();
      } catch (error) {
        console.error('Error loading objects:', error);
        setObjectsError('Ошибка загрузки данных');
      } finally {
        setObjectsLoading(false);
      }
    };

    loadObjects();
  }, [loadAllRatings]);

  useEffect(() => {
    if (!isLoaded) return;

    let ticking = false;
    let rafId: number;

    const handleScroll = () => {
      if (!ticking && bgRef.current && contentRef.current) {
        rafId = window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const maxScroll =
            contentRef.current!.offsetHeight - window.innerHeight;
          const scrollProgress = Math.min(scrolled / maxScroll, 1);

          bgRef.current!.style.transform = `translateY(${scrollProgress * 30}px) scale(1.1)`;
          contentRef.current!.style.transform = `translateY(${scrollProgress * -20}px)`;

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isLoaded]);

  const scrollToActions = () => {
    if (scrollRef.current) {
      const offset = scrollRef.current.offsetTop - 100;
      window.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
  };

  const userName = useMemo(() => {
    return profile?.username || '';
  }, [profile?.username]);

  if (!isLoaded) {
    return null;
  }

  return (
    <Screen>
      <div ref={bgRef} className={styles.homeBg} />
      <div className={styles.homeOverlay} />
      <div ref={contentRef} className={styles.homeWrapper}>
        <section className={styles.homeHeader}>
          <HomeTitle userName={userName} loading={profileLoading} />
          <HomeSubtitle />
          <button onClick={scrollToActions} className={styles.scrollButton}>
            <FaChevronDown />
          </button>
        </section>

        {!objectsLoading && !objectsError && topRatedObjects.length > 0 && (
          <ObjectsCarousel objects={topRatedObjects} />
        )}

        <section ref={scrollRef} className={styles.quickActions}>
          <Link to="/map" className={styles.actionCard}>
            <div className={styles.actionOverlay} />
            <div className={styles.actionContent}>
              <FaMapMarkedAlt className={styles.actionIcon} />
              <h2 className={styles.actionTitle}>Интерактивная карта</h2>
              <p className={styles.actionDescription}>
                Исследуйте достопримечательности на интерактивной карте
              </p>
            </div>
          </Link>
          <Link to="/information" className={styles.actionCard}>
            <div className={styles.actionOverlay} />
            <div className={styles.actionContent}>
              <FaInfoCircle className={styles.actionIcon} />
              <h2 className={styles.actionTitle}>
                Больше информации об объектах
              </h2>
              <p className={styles.actionDescription}>
                Узнайте подробности и интересные факты о достопримечательностях
              </p>
            </div>
          </Link>
        </section>

        {!objectsLoading && !objectsError && randomObjects.length > 0 && (
          <BottomObjectsCarousel objects={randomObjects} />
        )}
      </div>
    </Screen>
  );
};
