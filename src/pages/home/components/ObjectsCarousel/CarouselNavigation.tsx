import { IconButton } from '@mui/material';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CarouselNavigationProps } from '@utils';
import styles from './style.module.scss';

export const CarouselNavigation = ({
  onPrev,
  onNext,
  isPaused,
  setIsPaused,
  autoPlayInterval,
}: CarouselNavigationProps) => {
  const handleClick = (handler: () => void) => {
    handler();
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), autoPlayInterval);
  };

  return (
    <>
      <div className={styles.leftButton}>
        <IconButton
          onClick={() => handleClick(onPrev)}
          className={styles.slideButton}
          aria-label="Предыдущий слайд"
        >
          <FaChevronLeft />
        </IconButton>
      </div>
      <div className={styles.rightButton}>
        <IconButton
          onClick={() => handleClick(onNext)}
          className={styles.slideButton}
          aria-label="Следующий слайд"
        >
          <FaChevronRight />
        </IconButton>
      </div>
    </>
  );
};
