import React from 'react';
import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

type MenuType = 'left' | 'top';

interface IMenuProps {
  type: MenuType;
  activeCategories: string[];
  setActiveCategories: (categories: string[]) => void;
}

export const NavMenu: React.FC<IMenuProps> = ({
  type,
  activeCategories,
  setActiveCategories,
}) => {
  const categories = [
    'museums',
    'monuments',
    'cultural_values',
    'ancient_cities',
    'industry',
    'reserve',
    'lakes',
    'rivers',
  ];

  const Buttons = [
    'Музеи',
    'Монументы',
    'Культурные ценности',
    'Древние города',
    'Промышленность',
    'Заповедники',
    'Озера',
    'Реки',
  ];

  const handleButtonClick = (category: string) => {
    setActiveCategories(
      activeCategories.includes(category)
        ? activeCategories.filter((cat: string) => cat !== category)
        : [...activeCategories, category],
    );
  };

  const handleClearClick = () => {
    setActiveCategories([]);
  };

  return (
    <div
      style={{
        ...styles.navMenu,
        ...(type === 'left' ? styles.leftMenu : styles.topMenu),
      }}
    >
      <Link to="/" style={styles.backButton}>
        Назад
      </Link>
      {Buttons.map((buttonName, index) => (
        <button
          key={categories[index]}
          onClick={() => handleButtonClick(categories[index])}
          style={{
            ...styles.button,
            backgroundColor: activeCategories.includes(categories[index])
              ? '#007bff'
              : '#ccc',
            color: activeCategories.includes(categories[index])
              ? '#fff'
              : '#000',
          }}
        >
          {buttonName}
        </button>
      ))}
      {activeCategories.length > 0 && (
        <button onClick={handleClearClick} style={styles.clearButton}>
          X
        </button>
      )}
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  navMenu: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: '100%',
    zIndex: 1000,
  },
  leftMenu: {
    width: '10%',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '10px',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  topMenu: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    margin: '5px',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  backButton: {
    margin: '5px',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    textDecoration: 'none',
    color: '#000',
    backgroundColor: '#ccc',
    transition: 'background-color 0.3s',
    width: 'auto',
  },
  clearButton: {
    margin: '5px',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    backgroundColor: '#ff0000',
    color: '#fff',
    transition: 'background-color 0.3s',
  },
};
