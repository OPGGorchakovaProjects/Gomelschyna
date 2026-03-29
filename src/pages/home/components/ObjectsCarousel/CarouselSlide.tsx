import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { CarouselObject } from '@types';
import { FaStar } from 'react-icons/fa';
import styles from './style.module.scss';

interface CarouselSlideProps {
  object: CarouselObject;
  index: number;
  onSlideClick?: () => void;
}

export const CarouselSlide = ({
  object,
  index,
  onSlideClick,
}: CarouselSlideProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!object.isActive && onSlideClick) {
      e.preventDefault();
      onSlideClick();
    }
  };

  const getObjectLink = () => {
    if (object.id && object.category) {
      return `/information?category=${object.category}&object=${object.id}`;
    } else if (object.id) {
      return `/information?object=${object.id}`;
    } else {
      return `/information?object=${encodeURIComponent(object.name)}`;
    }
  };

  return (
    <Link
      to={getObjectLink()}
      className={`${styles.carouselItem} ${object.isActive ? styles.active : ''}`}
      style={{
        transform: `translateX(${(index - 1) * 5}%)`,
        zIndex: object.isActive ? 5 : 1,
      }}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        <img
          src={object.image}
          alt={object.name}
          className={styles.objectImage}
        />
        {/* {object.averageRating && object.averageRating > 0 && (
          <div className={styles.ratingBadge}>
            <FaStar className={styles.starIcon} />
            <span className={styles.ratingText}>
              {object.averageRating.toFixed(1)}
            </span>
          </div>
        )} */}
      </div>
      <div className={styles.contentContainer}>
        <Typography variant="h3" className={styles.objectTitle}>
          {object.name}
        </Typography>
        <Typography className={styles.objectDescription}>
          {object.description.length > 100
            ? `${object.description.slice(0, 100)}...`
            : object.description}
        </Typography>
      </div>
    </Link>
  );
};
