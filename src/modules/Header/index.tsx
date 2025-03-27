import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IconTree,
  IconBuildingMonument,
  IconBuildings,
  IconBuildingChurch,
  IconBuildingCastle,
  IconBuildingFactory,
  IconDroplet,
  IconRipple,
  IconArrowLeft,
  IconX,
  IconLayoutGrid,
  IconRoad,
} from '@tabler/icons-react';
import styles from './style.module.scss';
import { CategoryInfo, IHeaderProps } from '@utils';
import { CategoryKey } from '../../utils/types/types';

const categoryInfo: { [key in CategoryKey]: CategoryInfo } = {
  streets: {
    name: 'Улицы',
    icon: <IconRoad size={24} stroke={2} />,
  },
  monuments: {
    name: 'Монументы',
    icon: <IconBuildingMonument size={24} stroke={2} />,
  },
  museums: {
    name: 'Музеи',
    icon: <IconBuildings size={24} stroke={2} />,
  },
  reserve: {
    name: 'Заповедники',
    icon: <IconTree size={24} stroke={2} />,
  },
  cultural_values: {
    name: 'Культурные ценности',
    icon: <IconBuildingChurch size={24} stroke={2} />,
  },
  ancient_cities: {
    name: 'Древние города',
    icon: <IconBuildingCastle size={24} stroke={2} />,
  },
  industry: {
    name: 'Промышленность',
    icon: <IconBuildingFactory size={24} stroke={2} />,
  },
  lakes: {
    name: 'Озёра',
    icon: <IconDroplet size={24} stroke={2} />,
  },
  rivers: {
    name: 'Реки',
    icon: <IconRipple size={24} stroke={2} />,
  },
};

export const Header: FC<IHeaderProps> = ({
  activeCategories,
  setActiveCategories,
  hasRoute,
  onClearRoute,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.querySelector(`.${styles.categoryMenu}`);
      const button = document.querySelector(`.${styles.categoryToggle}`);

      if (
        menu &&
        button &&
        !menu.contains(event.target as Node) &&
        !button.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCategory = (category: CategoryKey) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter(c => c !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
    setIsMenuOpen(false);
  };

  const handleClearClick = () => {
    if (hasRoute && onClearRoute) {
      onClearRoute();
    } else {
      setActiveCategories([]);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftContainer}>
          <Link to="/" className={styles.backButton}>
            <IconArrowLeft size={20} />
            <span>Назад</span>
          </Link>
        </div>
        <div className={styles.middleContainer}>
          <div className={styles.categories}>
            {Object.entries(categoryInfo).map(([key, info]) => (
              <button
                key={key}
                className={`${styles.categoryButton} ${
                  activeCategories.includes(key as CategoryKey)
                    ? styles.active
                    : ''
                }`}
                onClick={() => toggleCategory(key as CategoryKey)}
              >
                <span className={styles.icon}>{info.icon}</span>
                <span className={styles.text}>{info.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.rightContainer}>
          {(activeCategories.length > 0 || hasRoute) && (
            <button onClick={handleClearClick} className={styles.clearButton}>
              {hasRoute ? 'Очистить маршрут' : 'Очистить'}
              {activeCategories.length > 0 && (
                <span className={styles.counter}>
                  {activeCategories.length}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      <div className={styles.bottomNav}>
        {(activeCategories.length > 0 || hasRoute) && (
          <button
            onClick={handleClearClick}
            className={styles.clearButtonMobile}
            aria-label="Очистить"
          >
            <IconX size={40} stroke={1.5} color="white" />
            {activeCategories.length > 0 && (
              <span className={styles.counter}>{activeCategories.length}</span>
            )}
          </button>
        )}

        <button
          className={`${styles.categoryToggle} ${isMenuOpen ? styles.active : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Открыть категории"
        >
          <IconLayoutGrid size={40} stroke={1.5} color="white" />
        </button>

        <div
          className={`${styles.categoryMenu} ${isMenuOpen ? styles.active : ''}`}
        >
          {Object.entries(categoryInfo).map(([key, info]) => (
            <button
              key={key}
              className={`${styles.categoryButton} ${
                activeCategories.includes(key as CategoryKey)
                  ? styles.active
                  : ''
              }`}
              onClick={() => {
                toggleCategory(key as CategoryKey);
              }}
            >
              <span className={styles.icon}>{info.icon}</span>
              <span className={styles.text}>{info.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
