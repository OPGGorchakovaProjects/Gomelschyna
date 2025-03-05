import React, { useState } from 'react';
import { CSSProperties } from 'react';

type MenuType = 'left' | 'top';

interface IMenuProps {
  type: MenuType;
}

export const NavMenu: React.FC<IMenuProps> = ({ type }) => {
  const categories = [
    'museums',
    'cultural_values',
    'ancient_cities',
    'famous_people',
    'industry',
    'reserve',
    'lakes',
    'rivers',
  ];

  const Buttons = [
    'Музеи',
    'Культурные ценности',
    'Древние города',
    'Известные личности',
    'Промышленность',
    'Заповедники',
    'Озера',
    'Реки',
  ];

  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  const handleButtonClick = (category: string) => {
    setActiveCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category],
    );
  };

  return (
    <div
      style={{
        ...styles.navMenu,
        ...(type === 'left' ? styles.leftMenu : styles.topMenu),
      }}
    >
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
    // border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
};
