import { Box } from '@mui/material';
import styles from './style.module.scss';

interface CarouselIndicatorsProps {
  count: number;
  currentIndex: number;
  onSelect: (index: number) => void;
  autoPlayInterval: number;
}

export const CarouselIndicators = ({
  count,
  currentIndex,
  onSelect,
  autoPlayInterval,
}: CarouselIndicatorsProps) => {
  return (
    <Box className={styles.indicators}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
          onClick={() => {
            onSelect(index);
          }}
        />
      ))}
    </Box>
  );
};
