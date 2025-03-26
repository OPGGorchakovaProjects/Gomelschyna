import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import style from './style.module.scss';
import { Link } from 'react-router-dom';
import { IBurgerMenuProps } from '@utils';
import { Button } from '@components';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header>
      <nav id="header">
        <div className={style.navContainer}>
          <button className={style.burgerMenu} onClick={toggleMenu}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={style.line}></div>
            ))}
          </button>
          <h1 className={style.headerTitle}>Гомельщина</h1>
        </div>
      </nav>
      <BurgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </header>
  );
};

const BurgerMenu: FC<IBurgerMenuProps> = ({ isOpen }) => (
  <div className={`${style.blockBurger} ${isOpen ? style.active2 : ''}`}>
    <div className={style.burgerContent}>
      {[
        'Достопримечательности',
        'Культурные ценности',
        'Старейшие города',
        'Известные люди',
        'Промышленность',
        'Озёра',
        'Реки',
      ].map((text, i) => (
        <button key={i} className={style.button}>
          {text}
        </button>
      ))}
      <Link to="/">
        <button className={`${style.button} ${style.back}`}>На главную</button>
      </Link>
    </div>
  </div>
);

const Banner: FC = () => (
  <section className={style.banner}>
    <div className={style.bannerContent}>
      <h1>Добро пожаловать в Гомельскую область</h1>
      <p>
        Откройте для себя уникальные достопримечательности и культурные ценности
        региона
      </p>
      <div className={style.boxWithButtons}>
        <Link to="/Map" className={style.mapBtn}>
          Открыть карту
        </Link>
        <button className={style.mapBtn} id="interes-fact">
          Знаете ли вы?
          <span className={style.factText}>(интересный факт)</span>
        </button>
      </div>
    </div>
  </section>
);

const Modal: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(prev => !prev);

  useEffect(() => {
    const button = document.getElementById('interes-fact');
    button?.addEventListener('click', toggleModal);
    return () => button?.removeEventListener('click', toggleModal);
  }, []);

  return (
    isModalOpen && (
      <div className={style.modalBack}>
        <div className={style.blockModal}>
          <div className={style.content}>
            <p className={style.contentModal}>
              Единственный в Беларуси фарфоровый завод работает в Добруше
            </p>
            <iframe
              width="356"
              height="238"
              src="https://www.youtube.com/embed/ZaIaknnPD1U"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    )
  );
};

interface Item {
  name: string;
  location: string;
  description: string;
  image?: string;
  links?: {
    read_more?: string;
    map?: string;
  };
  map_marker?: string;
}

interface Data {
  categories: Record<string, Item[]>;
}

const ContentBlock: FC<Item & { id?: string }> = ({
  id,
  name,
  location,
  description,
  image,
  links,
  map_marker,
}) => (
  <div id={id} className={style.blockDost}>
    <p className={style.textDost}>{name}</p>
    <h2 className={style.gorod}>{location}</h2>
    <div className={style.divider}></div>
    <div className={style.content}>
      <p className={style.textContent}>{description}</p>
      <img
        src={image || './img/default.jpg'}
        alt="city"
        className={style.imgCity}
      />
    </div>
    <div className={style.buttonContainer}>
      {links?.read_more && (
        <Button href={links.read_more} variant="primary">
          Читать ещё
        </Button>
      )}
      <Button to={`/map?selected=${map_marker}`} variant="secondary">
        Показать на карте
      </Button>
    </div>
  </div>
);

export const Information: FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const itemId = searchParams.get('item');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  // Словарь названий категорий
  const categoryNames: { [key: string]: string } = {
    museums: 'Музеи',
    monuments: 'Монументы',
    cultural_values: 'Культурные ценности',
    ancient_cities: 'Древние города',
    industry: 'Промышленность',
    reserve: 'Заповедники',
    lakes: 'Озёра',
    rivers: 'Реки',
  };

  // Функция для переключения категории
  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryKey)) {
        newSet.delete(categoryKey);
      } else {
        newSet.add(categoryKey);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setData(data);
        if (category && itemId && data.categories[category]) {
          const item = data.categories[category].find(
            (item: Item) => item.map_marker === itemId,
          );
          if (item) {
            // Сначала раскрываем категорию
            setExpandedCategories(prev => new Set([...prev, category]));

            // Увеличиваем задержку для гарантии, что DOM обновился
            setTimeout(() => {
              const element = document.getElementById(itemId);
              if (element) {
                // Добавляем отступ сверху для учета фиксированного хедера
                const headerHeight = 80; // Примерная высота хедера
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition =
                  elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth',
                });
              }
            }, 300);
          }
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [category, itemId]);

  // Удаляем наблюдатель IntersectionObserver, так как он автоматически раскрывает категории
  // и мешает правильной работе сворачивания/разворачивания

  return (
    <>
      <Header />
      <Banner />
      <div className={style.main}>
        {data?.categories &&
          Object.entries(data.categories).map(([categoryKey, items]) => {
            const isExpanded = expandedCategories.has(categoryKey);
            // Отображаем все элементы, если категория развернута, или только первые 5, если свернута
            const displayedItems = isExpanded ? items : items.slice(0, 5);

            return (
              <div
                key={categoryKey}
                className={style.categorySection}
                data-category={categoryKey}
              >
                <h2 className={style.categoryTitle}>
                  {categoryNames[categoryKey] || categoryKey}
                </h2>
                {displayedItems.map((item, index) => (
                  <ContentBlock key={index} {...item} id={item.map_marker} />
                ))}
                {items.length > 5 && (
                  <button
                    className={style.showMoreButton}
                    onClick={() => toggleCategory(categoryKey)}
                  >
                    {isExpanded ? 'Показать меньше' : 'Показать больше'}
                  </button>
                )}
              </div>
            );
          })}
        <Modal />
      </div>
    </>
  );
};
