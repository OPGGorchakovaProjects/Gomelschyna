import React, { useState, useEffect, FC } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './style.module.scss';
import { Button } from '@components';
import { Screen } from '@modules';
import {
  IconMapPin,
  IconTree,
  IconBuilding,
  IconBuildingMonument,
  IconBuildingCastle,
  IconBuildingFactory,
  IconDroplet,
  IconRipple,
  IconUsers,
  IconRoad,
  IconX,
  IconZoomIn,
  IconZoomOut,
  IconChevronLeft,
  IconChevronRight,
  IconBuildingCottage,
} from '@tabler/icons-react';
import { objects } from '@api';

interface ContentBlockProps {
  id: string;
  name: string;
  location?: string;
  description: string;
  images?: string[];
  links?: {
    read_more?: string;
  };
  link?: string | null;
  map_marker?: string;
  onImageClick: (url: string, alt: string, images: string[]) => void;
}

const categoryNames: { [key: string]: string } = {
  museums: 'Музеи',
  monuments: 'Монументы',
  cultural_values: 'Культурные ценности',
  ancient_cities: 'Старейшие города',
  industry: 'Промышленность',
  reserve: 'Заповедники',
  lakes: 'Озёра',
  rivers: 'Реки',
  streets: 'Улицы',
  КПХ: "C/Х Предприятия"
};

interface ImageModalProps {
  images: string[];
  currentImageIndex: number;
  alt: string;
  onClose: () => void;
  onImageChange: (index: number) => void;
}

const ImageModal: FC<ImageModalProps> = ({
  images,
  currentImageIndex,
  alt,
  onClose,
  onImageChange,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleArrowKeys = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        const prevIndex =
          currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        onImageChange(prevIndex);
      } else if (event.key === 'ArrowRight') {
        const nextIndex =
          currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        onImageChange(nextIndex);
      }
    };

    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleArrowKeys);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, [onClose, onImageChange, currentImageIndex, images.length]);

  const handleZoomToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    onImageChange(prevIndex);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex =
      currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    onImageChange(nextIndex);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.imageModalContent}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          <IconX />
        </button>
        <button className={styles.zoomButton} onClick={handleZoomToggle}>
          {isZoomed ? <IconZoomOut /> : <IconZoomIn />}
        </button>

        {images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrevImage}
              aria-label="Предыдущее изображение"
            >
              <IconChevronLeft />
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNextImage}
              aria-label="Следующее изображение"
            >
              <IconChevronRight />
            </button>
            <div className={styles.imageCounter}>
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}

        <img
          src={images[currentImageIndex]}
          alt={`${alt} (${currentImageIndex + 1} из ${images.length})`}
          className={`${styles.modalImage} ${isZoomed ? styles.zoomed : ''}`}
        />
      </div>
    </div>
  );
};

const ContentBlock: FC<ContentBlockProps> = ({
  id,
  name,
  location,
  description,
  images,
  links,
  link,
  map_marker,
  onImageClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : (images?.length || 1) - 1;
    setCurrentImageIndex(prevIndex);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex =
      currentImageIndex < (images?.length || 1) - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(nextIndex);
  };

  return (
    <div
      id={id}
      data-object-id={id}
      data-map-marker={map_marker || ''}
      className={styles.blockDost}
    >
      <h2 className={styles.textDost}>{name}</h2>
      {location && <p className={styles.gorod}>{location}</p>}
      <div className={styles.divider} />
      <div className={styles.content}>
        {images && images.length > 0 && (
          <div className={styles.imageContainer}>
            <img
              src={images[currentImageIndex]}
              alt={name}
              className={styles.imgCity}
              onClick={() =>
                onImageClick(images[currentImageIndex], name, images)
              }
            />
            {images.length > 1 && (
              <>
                <button
                  className={`${styles.imageNavButton} ${styles.imagePrevButton}`}
                  onClick={handlePrevImage}
                  aria-label="Предыдущее изображение"
                >
                  <IconChevronLeft />
                </button>
                <button
                  className={`${styles.imageNavButton} ${styles.imageNextButton}`}
                  onClick={handleNextImage}
                  aria-label="Следующее изображение"
                >
                  <IconChevronRight />
                </button>
                <div className={styles.imageCounter}>
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        )}
        <div className={styles.textContent}>
          {description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        {links?.read_more && (
          <Button href={links.read_more} variant="primary">
            Читать ещё
          </Button>
        )}
        {link && (
          <Button href={link} variant="primary">
            Подробная информация
          </Button>
        )}
        {map_marker && (
          <Button to={`/map?selected=${map_marker}`} variant="secondary">
            Показать на карте
          </Button>
        )}
      </div>
    </div>
  );
};

const Sidebar: FC<{
  activeCategory: string;
  onCategoryClick: (category: string) => void;
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}> = ({
  activeCategory,
  onCategoryClick,
  isMobileMenuOpen,
  onMobileMenuClose,
}) => {
  const categories = [
    { id: 'monuments', icon: IconBuildingMonument, label: 'Монументы' },
    { id: 'reserve', icon: IconTree, label: 'Заповедники' },
    { id: 'museums', icon: IconBuilding, label: 'Музеи' },
    {
      id: 'cultural_values',
      icon: IconBuildingCastle,
      label: 'Культурные ценности',
    },
    { id: 'ancient_cities', icon: IconMapPin, label: 'Старейшие города' },
    { id: 'industry', icon: IconBuildingFactory, label: 'Промышленность' },
    { id: 'lakes', icon: IconDroplet, label: 'Озёра' },
    { id: 'rivers', icon: IconRipple, label: 'Реки' },
    { id: 'streets', icon: IconRoad, label: 'Улицы' },
    {id: 'КПХ', icon: IconBuildingCottage, label: "C/Х Предприятия"}
  ];

  const navigate = useNavigate();

  const handleBackClick = () => {
    onMobileMenuClose();
    navigate('/');
  };

  return (
    <>
      <aside
        className={`${styles.sidebar} ${isMobileMenuOpen ? styles.active : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Категории</h2>
          <button
            className={styles.closeMobileMenu}
            onClick={onMobileMenuClose}
          >
            <IconX size={24} />
          </button>
        </div>
        <div className={styles.mobileBackButton} onClick={handleBackClick}>
          <span>Золотое кольцо Гомельщины</span>
        </div>
        <ul className={styles.sidebarList}>
          {categories.map(({ id, icon: Icon, label }) => (
            <li key={id} className={styles.sidebarItem}>
              <button
                className={`${styles.categoryButton} ${activeCategory === id ? styles.active : ''}`}
                onClick={() => {
                  onCategoryClick(id);
                  onMobileMenuClose();
                }}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={onMobileMenuClose} />
      )}
    </>
  );
};

const CATEGORY_MAPPING: Record<string, string> = {
  monuments: 'Монументы',
  reserve: 'Заповедники',
  museums: 'Музеи',
  cultural_values: 'Культурные ценности',
  ancient_cities: 'Древние города',
  industry: 'Промышленность',
  lakes: 'Озёра',
  rivers: 'Реки',
  streets: 'Улицы',
  КПХ: "КПХ",
};

export const Information: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<Object[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('monuments');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [modalImage, setModalImage] = useState<{
    images: string[];
    currentIndex: number;
    alt: string;
  } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryName = CATEGORY_MAPPING[activeCategory] || activeCategory;
        const objectsData = await objects.getByType(categoryName);
        setData(objectsData);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [activeCategory]);

  useEffect(() => {
    const handleObjectSearch = async () => {
      const objectId = searchParams.get('object');

      if (objectId && !isDataLoaded) {
        try {
          // Сначала пытаемся найти объект по ID среди всех объектов
          const allObjects = await objects.getAll();
          const targetObject = allObjects.find(
            (obj: any) =>
              obj.id.toString() === objectId ||
              obj.name === objectId ||
              obj.map_marker === objectId,
          ) as any;

          if (targetObject) {
            // Определяем категорию объекта
            const categoryName = targetObject.category;
            // Ищем категорию в маппинге (обратный поиск)
            const mappedCategory = Object.entries(CATEGORY_MAPPING).find(
              ([key, value]) => value === categoryName,
            );

            if (mappedCategory) {
              setActiveCategory(mappedCategory[0]);
            }
          }
        } catch (error) {
          console.error('Error searching for object:', error);
        }
      }
    };

    handleObjectSearch();
  }, [searchParams, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      const category = searchParams.get('category');
      const objectId = searchParams.get('object');

      if (category) {
        setActiveCategory(category);
      }

      if (objectId) {
        setTimeout(() => {
          const targetElement =
            (document.querySelector(
              `[data-object-id="${objectId}"]`,
            ) as HTMLElement | null) ||
            (document.querySelector(
              `[data-map-marker="${objectId}"]`,
            ) as HTMLElement | null);

          if (targetElement) {
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          } else {
            console.warn(
              `Element matching id or marker "${objectId}" not found.`,
            );
          }
        }, 500);
      }
    }
  }, [searchParams, isDataLoaded, activeCategory]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    navigate(`/information?category=${category}`);
  };

  const handleImageClick = (url: string, alt: string, images: string[]) => {
    const currentIndex = images.indexOf(url);
    setModalImage({
      images,
      currentIndex: currentIndex >= 0 ? currentIndex : 0,
      alt,
    });
  };

  const handleModalImageChange = (index: number) => {
    if (modalImage) {
      setModalImage({
        ...modalImage,
        currentIndex: index,
      });
    }
  };

  const renderCategoryContent = () => {
    if (!data?.length) {
      return <div className={styles.loading}>Загрузка...</div>;
    }

    return (
      <div className={styles.categoryContent}>
        <h1 className={styles.categoryTitle}>
          {categoryNames[activeCategory] || activeCategory}
        </h1>
        <div className={styles.infoBlocks}>
          {data.map((item: any, index: number) => (
            <ContentBlock
              key={index}
              id={item.id}
              name={item.name}
              location={item.location}
              description={item.description}
              images={item.images}
              links={item.links}
              link={item.link}
              map_marker={item.map_marker}
              onImageClick={handleImageClick}
            />
          ))}
        </div>
      </div>
    );
  };

  if (!data) {
    return (
      <Screen>
        <div className={styles.contentContainer}>
          <h1 className={styles.title}>Объект не найден</h1>
          <p className={styles.description}>
            К сожалению, запрашиваемый объект не найден. Попробуйте вернуться на
            главную страницу или карту.
          </p>
          <button className={styles.button} onClick={() => navigate('/')}>
            Вернуться на главную
          </button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen
      isMobileMenuOpen={isMobileMenuOpen}
      onMobileMenuToggle={handleMobileMenuToggle}
    >
      <div className={styles.main}>
        <Sidebar
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
        />
        <div className={styles.content}>{renderCategoryContent()}</div>
        {modalImage && (
          <ImageModal
            images={modalImage.images}
            currentImageIndex={modalImage.currentIndex}
            alt={modalImage.alt}
            onClose={() => setModalImage(null)}
            onImageChange={handleModalImageChange}
          />
        )}
      </div>
    </Screen>
  );
};
