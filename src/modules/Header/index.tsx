import { FC, JSX } from 'react';
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
} from '@tabler/icons-react';
import styles from './style.module.scss';

interface HeaderProps {
  activeCategories: string[];
  setActiveCategories: (categories: string[]) => void;
}

interface CategoryInfo {
  name: string;
  icon: JSX.Element;
}

const categoryInfo: { [key: string]: CategoryInfo } = {
  museums: {
    name: 'Музеи',
    icon: <IconBuildings size={24} stroke={2} />,
  },
  monuments: {
    name: 'Монументы',
    icon: <IconBuildingMonument size={24} stroke={2} />,
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
  reserve: {
    name: 'Заповедники',
    icon: <IconTree size={24} stroke={2} />,
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

export const Header: FC<HeaderProps> = ({
  activeCategories,
  setActiveCategories,
}) => {
  const toggleCategory = (category: string) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter(c => c !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };

  const handleClearClick = () => {
    setActiveCategories([]);
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftContainer}>
        <Link to="/" className={styles.backButton}>
          <IconArrowLeft size={20} />
          <span>Назад</span>
        </Link>
      </div>

      <div className={styles.midContaienr}>
        <div className={styles.categories}>
          {Object.entries(categoryInfo).map(([key, info]) => (
            <button
              key={key}
              className={`${styles.categoryButton} ${
                activeCategories.includes(key) ? styles.active : ''
              }`}
              onClick={() => toggleCategory(key)}
            >
              <span className={styles.icon}>{info.icon}</span>
              <span className={styles.text}>{info.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.rightContainer}>
        {activeCategories.length > 0 && (
          <button onClick={handleClearClick} className={styles.clearButton}>
            Очистить
          </button>
        )}
      </div>
    </header>
  );
};
