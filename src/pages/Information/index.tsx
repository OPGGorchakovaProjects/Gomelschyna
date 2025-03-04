import { FC, useEffect, useState } from 'react';
import style from './style.module.scss';
import { Link } from 'react-router-dom';

interface IBurgerMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const Header: FC = () => {
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

const BurgerMenu: FC<IBurgerMenuProps> = ({ isOpen, toggleMenu }) => (
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
      <div>
        <h1>Добро пожаловать в Гомельскую область</h1>
        <p>
          Откройте для себя уникальные достопримечательности и культурные
          ценности региона
        </p>
      </div>
      <div className={style.boxWithButtons}>
        <Link to="/Map" className={style.mapBtn}>
          <img
            src="./img/image-PhotoRoom 1.png"
            alt="Карта"
            className={style.mapImg}
          />
          Открыть карту
        </Link>
        <button className={style.mapBtn} id="interes-fact">
          Знаете ли вы?
          <p className={style.factText}>( интересный факт )</p>
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
}

interface Data {
  categories: Record<string, Item[]>;
}

const ContentBlock: FC<Item> = ({
  name,
  location,
  description,
  image,
  links,
}) => (
  <div className={style.blockDost}>
    <p className={style.textDost}>{name}</p>
    <h2 className={style.textName}>{location}</h2>
    <p className={style.gorod}>{description}</p>
    <img
      src="./img/Line 14.png"
      alt="divider decoration"
      className={style.divider}
    />
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
        <a href={links.read_more} className={style.btn1}>
          Читать ещё
        </a>
      )}
      {links?.map && (
        <a href={links.map} className={style.btn2}>
          Показать на карте
        </a>
      )}
    </div>
  </div>
);

export const Information: FC = () => {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(setData)
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <Header />
      <Banner />
      {data?.categories &&
        Object.values(data.categories)
          .flat()
          .map((item, index) => <ContentBlock key={index} {...item} />)}
      <Modal />
    </>
  );
};
