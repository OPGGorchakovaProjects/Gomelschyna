import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RateReviewIcon from '@mui/icons-material/RateReview';
import styles from '@pages/Map/style.module.scss';

interface ObjectActionsProps {
  onAuthAction: () => void;
  isVisited?: boolean;
  isFavorite?: boolean;
  onToggleVisited?: () => void;
  onToggleFavorite?: () => void;
  onReviewClick?: () => void;
  hasExistingReview?: boolean;
  isAuthenticated: boolean;
}

export const ObjectActions = React.memo(
  ({
    onAuthAction,
    isVisited = false,
    isFavorite = false,
    onToggleVisited,
    onToggleFavorite,
    onReviewClick,
    hasExistingReview = false,
    isAuthenticated,
  }: ObjectActionsProps) => {
    const handleVisitedClick = () => {
      if (!isAuthenticated) {
        onAuthAction();
        return;
      }
      onToggleVisited?.();
    };

    const handleFavoriteClick = () => {
      if (!isAuthenticated) {
        onAuthAction();
        return;
      }
      onToggleFavorite?.();
    };

    const handleReviewClick = () => {
      if (!isAuthenticated) {
        onAuthAction();
        return;
      }
      onReviewClick?.();
    };

    return (
      <div className={styles.objectActions}>
        <Tooltip
          title={isVisited ? 'Убрать из посещенных' : 'Отметить как посещенное'}
        >
          <IconButton
            size="small"
            className={styles.actionIconButton}
            onClick={handleVisitedClick}
            color={isVisited ? 'primary' : 'default'}
          >
            {isVisited ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
          </IconButton>
        </Tooltip>
        {isVisited && (
          <Tooltip title={hasExistingReview ? 'Редактировать отзыв' : 'Оставить отзыв'}>
            <IconButton
              size="small"
              className={styles.actionIconButton}
              onClick={handleReviewClick}
              color="warning"
            >
              <RateReviewIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip
          title={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
        >
          <IconButton
            size="small"
            className={styles.actionIconButton}
            onClick={handleFavoriteClick}
            color={isFavorite ? 'error' : 'default'}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
      </div>
    );
  },
);

ObjectActions.displayName = 'ObjectActions';
