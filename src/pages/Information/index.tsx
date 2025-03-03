import React, { FC, useState } from 'react';
import style from './style.module.scss';
import { Link } from 'react-router-dom';

interface IContentBlockProps {
  title: string;
  subtitle: string;
  content: string;
  image: string;
  link: string;
  mapLink: string;
}

interface IBurgerMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav id="header">
        <div className={style.navContainer}>
          <button
            className={style.burgerMenu}
            id="burger-menu"
            onClick={toggleMenu}
          >
            <div className={style.line}></div>
            <div className={style.line}></div>
            <div className={style.line}></div>
          </button>
          <h1 className={style.headerTitle}>Гомельщина</h1>
        </div>
      </nav>
      <BurgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </header>
  );
};

const BurgerMenu: FC<IBurgerMenuProps> = ({ isOpen, toggleMenu }) => {
  return (
    <div
      className={`${style.blockBurger} ${isOpen ? style.active2 : ''}`}
      id="block-burger"
    >
      <div className={style.burgerContent}>
        <button className={style.button} id="button1">
          Достопримечательности
        </button>
        <button className={style.button} id="button2">
          Культурные ценности
        </button>
        <button className={style.button} id="button3">
          Старейшие города
        </button>
        <button className={style.button} id="button4">
          Известные люди
        </button>
        <button className={style.button} id="button5">
          Промышленность
        </button>
        <button className={style.button} id="button6">
          Озёра
        </button>
        <button className={style.button} id="button7">
          Реки
        </button>
        <Link to="/">
          <button className={`${style.button} ${style.back}`} id="button8">
            На главную
          </button>
        </Link>
      </div>
    </div>
  );
};

const Banner: FC = () => {
  return (
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
          <Link to="/Map" className={style.mapBtn} style={{ height: '60px' }}>
            <img
              src="./img/image-PhotoRoom 1.png"
              alt="Карта"
              className={style.mapImg}
            />
            Открыть карту
          </Link>
          <a
            className={style.mapBtn}
            id="interes-fact"
            style={{ height: '60px', flexDirection: 'column' }}
          >
            Знаете ли вы?
            <p style={{ fontSize: '12px', color: 'black' }}>
              ( интересный факт )
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};

const Modal: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div
        className={style.modalBack}
        id="modal-back"
        style={{ display: isModalOpen ? 'block' : 'none' }}
      >
        <div className={style.blockModal} id="block-modal">
          <div className={style.content}>
            <p className={style.contentModal}>
              Единственный в Беларуси фарфоровый завод работает в Добруше
            </p>
            <iframe
              width="356"
              height="238"
              src="https://www.youtube.com/embed/ZaIaknnPD1U"
              title="Знаете ли вы?  Единственный в Беларуси фарфоровый завод работает в Добруше"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
      <button className={style.mapBtn} id="interes-fact" onClick={toggleModal}>
        Знаете ли вы?
        <p style={{ fontSize: '12px', color: 'black' }}>( интересный факт )</p>
      </button>
    </>
  );
};

export const ContentBlock: FC<IContentBlockProps> = ({
  title,
  subtitle,
  content,
  image,
  link,
  mapLink,
}) => {
  return (
    <div className={style.blockDost}>
      <p className={style.textDost}>{title}</p>
      <h2 className={style.textName}>{subtitle}</h2>
      <p className={style.gorod}>{content}</p>
      <img
        src="./img/Line 14.png"
        alt="divider decoration"
        className={style.divider}
      />
      <div className={style.content}>
        <p className={style.textContent}>{content}</p>
        <img src={image} alt="city image" className={style.imgCity} />
      </div>
      <div className={style.buttonContainer}>
        <div className={style.btn1}>
          <a href={link} className={style.textBtn}>
            Читать ещё
          </a>
        </div>
        <a href={mapLink} className={style.btn2} style={{ height: '60px' }}>
          <p className={style.textBtn}>Показать на карте</p>
        </a>
      </div>
    </div>
  );
};

export const Information: FC = () => {
  return (
    <>
      <Header />
      <Banner />
      <ContentBlock
        key="1"
        title="Достопримечательности"
        subtitle="Гомель"
        content="Гомель — город областного подчинения в Беларуси, административный центр Гомельской области и Гомельского района. Основан в 1142 году. Гомель — важный транспортный узел, крупный промышленный центр, культурный и образовательный центр Беларуси. Гомель — город воинской славы."
        image="./img/Gomel.jpg"
        link="https://ru.wikipedia.org/wiki/%D0%93%D0%BE%D0%BC%D0%B5%D0%BB%D1%8C"
        mapLink="../Map/index.html"
      />
      <ContentBlock
        key="2"
        title="Культурные ценности"
        subtitle="Мозырь"
        content="Мозырь — город областного подчинения в Беларуси, административный центр Мозырского района Гомельской области. Основан в 1097 году. Мозырь — крупный промышленный центр, культурный и образовательный центр Беларуси. Мозырь — город воинской славы."
        image="./img/Mozyr.jpg"
        link="https://ru.wikipedia.org/wiki/%D0%9C%D0%BE%D0%B7%D1%8B%D1%80%D1%8C"
        mapLink="../Map/index.html"
      />
    </>
  );
};
