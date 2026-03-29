import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import styles from '@pages/Map/style.module.scss';

interface RatingDisplayProps {
  rating: number;
  count: number;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

export const RatingDisplay = React.memo(
  ({ rating, count, onClick, active = false, disabled = false }: RatingDisplayProps) => {
    const isInteractive = Boolean(onClick) && !disabled;

    const handleClick = () => {
      if (!isInteractive || !onClick) return;
      onClick();
    };

    return (
      <button
        type="button"
        className={`${styles.ratingContainer} ${isInteractive ? styles.ratingInteractive : ''} ${
          active ? styles.ratingActive : ''
        }`}
        onClick={handleClick}
        disabled={!isInteractive}
      >
        <StarIcon sx={{ color: '#ffb400', fontSize: 18 }} />
        <span className={styles.ratingText}>
          {rating.toFixed(1)} ({count})
        </span>
      </button>
    );
  },
);

RatingDisplay.displayName = 'RatingDisplay';
