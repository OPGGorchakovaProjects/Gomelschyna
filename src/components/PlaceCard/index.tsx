import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Box,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  VisitedPlace,
  FavoritePlace,
  PlaceReview,
} from '../../types/places';
import styles from './styles.module.scss';
import ImageIcon from '@mui/icons-material/Image';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { visitedPlaces, favoritePlaces } from '@api';
import { useAuth } from '@hooks';

interface IPlaceCardProps {
  place: VisitedPlace | FavoritePlace;
  type: 'visited' | 'favorite';
  onUpdateVisitedPlace?: (id: string, rating: number, comment: string) => void;
  onDelete?: () => void;
  canEdit?: boolean;
}

export const PlaceCard: FC<IPlaceCardProps> = ({
  place,
  type,
  onUpdateVisitedPlace,
  onDelete,
  canEdit = true,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const date =
    type === 'visited'
      ? (place as VisitedPlace).visited_at
      : (place as FavoritePlace).created_at;

  const formattedDate = new Date(date).toLocaleDateString();

  const visitedPlace = place as VisitedPlace;

  const [isEditing, setIsEditing] = useState(false);
  const [editingRating, setEditingRating] = useState<number>(
    visitedPlace?.rating || 0,
  );
  const [editingComment, setEditingComment] = useState<string>(
    visitedPlace?.comment || '',
  );
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<PlaceReview[]>([]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) return;

    try {
      if (type === 'visited') {
        await visitedPlaces.delete(place.id);
      } else {
        await favoritePlaces.delete(place.id);
      }
      onDelete?.();
    } catch (error) {
      console.error('Error deleting place:', error);
    }
  };

  const handleSave = () => {
    if (onUpdateVisitedPlace && type === 'visited') {
      onUpdateVisitedPlace(place.id, editingRating, editingComment);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingRating(visitedPlace?.rating || 0);
    setEditingComment(visitedPlace?.comment || '');
  };

  const handleEdit = () => {
    setEditingRating(visitedPlace?.rating || 0);
    setEditingComment(visitedPlace?.comment || '');
    setIsEditing(true);
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const data = await visitedPlaces.getReviewsByObject(place.object.id);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviewsError('Не удалось загрузить отзывы');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleToggleReviews = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();

    if (!reviewsVisible && reviews.length === 0) {
      await fetchReviews();
    }

    setReviewsVisible(prev => !prev);
  };

  const handleReviewClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    review: PlaceReview,
  ) => {
    e.stopPropagation();
    if (review.profile?.id) {
      navigate(`/profile/${review.profile.id}`);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('form') ||
      (e.target as HTMLElement).closest('input') ||
      (e.target as HTMLElement).closest('textarea') ||
      (e.target as HTMLElement).closest('.MuiRating-root') ||
      (e.target as HTMLElement).closest('.MuiTextField-root')
    ) {
      e.stopPropagation();
      return;
    }
    navigate(
      `/information?category=${place.object.category}&object=${place.object.id}`,
    );
  };

  const showForm = type === 'visited' && isEditing;

  useEffect(() => {
    setReviewsVisible(false);
    setReviews([]);
    setReviewsError(null);
    setReviewsLoading(false);
  }, [place.id]);

  return (
    <Card className={styles.card} onClick={handleCardClick}>
      {place.object.images ? (
        <CardMedia
          component="img"
          height="180"
          image={place.object.images[0]}
          alt={place.object.name}
          className={styles.media}
        />
      ) : (
        <Box className={styles.noImage}>
          <ImageIcon sx={{ fontSize: 48, color: 'rgba(0, 0, 0, 0.2)' }} />
        </Box>
      )}
      <CardContent className={styles.content}>
        <Box className={styles.header}>
          <Typography variant="h6" component="div" className={styles.title}>
            {place.object.name}
          </Typography>
          {canEdit && (
            <IconButton
              size="small"
              onClick={handleDelete}
              className={styles.deleteButton}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        {place.object.description && (
          <Typography variant="body2" className={styles.description}>
            {place.object.description}
          </Typography>
        )}
        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.date}
        >
          {type === 'visited' ? 'День посещения: ' : 'Добавлено: '}
          {formattedDate}
        </Typography>

        {showForm ? (
          <Box className={styles.reviewForm} onClick={e => e.stopPropagation()}>
            <Typography variant="body2" className={styles.formLabel}>
              {visitedPlace?.rating
                ? 'Измените вашу оценку:'
                : 'Оставьте вашу оценку:'}
            </Typography>
            <Rating
              name="place-rating"
              value={editingRating}
              onChange={(_, newValue) => setEditingRating(newValue || 0)}
              onClick={e => e.stopPropagation()}
            />
            <TextField
              label="Ваш отзыв"
              multiline
              rows={3}
              value={editingComment}
              onChange={e => setEditingComment(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              size="small"
              onClick={e => e.stopPropagation()}
            />
            <Box className={styles.formActions}>
              <Button
                variant="contained"
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  handleSave();
                }}
                disabled={editingRating === 0}
              >
                Сохранить
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  handleCancel();
                }}
              >
                Отмена
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            {visitedPlace?.rating !== null &&
              visitedPlace?.rating !== undefined &&
              visitedPlace.rating > 0 && (
                <Box className={styles.rating}>
                  <Rating value={visitedPlace.rating} readOnly size="small" />
                </Box>
              )}
            {visitedPlace?.comment && (
              <Box className={styles.reviewContainer}>
                <Typography variant="body2" className={styles.review}>
                  Отзыв: {visitedPlace.comment}
                </Typography>
              </Box>
            )}
            <Box className={styles.actionsContainer}>
              {canEdit && (
                <Button
                  variant="text"
                  size="small"
                  onClick={handleToggleReviews}
                  className={styles.reviewsToggle}
                  disabled={reviewsLoading}
                >
                  {reviewsVisible
                    ? 'Скрыть отзывы посетителей'
                    : 'Отзывы посетителей'}
                </Button>
              )}

              {reviewsVisible && (
                <Box
                  className={styles.reviewsSection}
                  onClick={e => e.stopPropagation()}
                >
                  {reviewsLoading && (
                    <Box className={styles.reviewsLoader}>
                      <CircularProgress size={20} />
                    </Box>
                  )}
                  {!reviewsLoading && reviewsError && (
                    <Typography variant="body2" className={styles.reviewsError}>
                      {reviewsError}
                    </Typography>
                  )}
                  {!reviewsLoading &&
                    !reviewsError &&
                    reviews.length === 0 && (
                      <Typography variant="body2" className={styles.reviewsEmpty}>
                        Для этого места пока нет отзывов
                      </Typography>
                    )}
                  {!reviewsLoading &&
                    !reviewsError &&
                    reviews.map(review => {
                      const username = review.profile?.username ?? 'Пользователь';
                      const avatarUrl = review.profile?.avatar_url ?? undefined;
                      const initial =
                        username && username.length > 0
                          ? username.charAt(0).toUpperCase()
                          : 'П';
                      const reviewDate = review.visited_at
                        ? new Date(review.visited_at).toLocaleDateString()
                        : new Date(review.created_at).toLocaleDateString();

                      return (
                        <Box
                          key={review.id}
                          component="button"
                          type="button"
                          className={styles.reviewItem}
                          onClick={event => handleReviewClick(event, review)}
                        >
                          <Avatar
                            src={avatarUrl}
                            alt={username}
                            className={styles.reviewAvatar}
                          >
                            {initial}
                          </Avatar>
                          <Box className={styles.reviewBody}>
                            <Typography
                              variant="subtitle2"
                              className={styles.reviewAuthor}
                            >
                              {username}
                            </Typography>
                            {review.rating !== null && review.rating > 0 && (
                              <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                              />
                            )}
                            {review.comment && (
                              <Typography className={styles.reviewText}>
                                {review.comment}
                              </Typography>
                            )}
                            <Typography
                              variant="caption"
                              className={styles.reviewDate}
                            >
                              {reviewDate}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              )}

              {canEdit &&
                type === 'visited' &&
                (visitedPlace?.rating === undefined ||
                visitedPlace?.rating === null ||
                visitedPlace?.rating === 0 ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className={styles.addReviewButton}
                  >
                    Добавить отзыв
                  </Button>
                ) : visitedPlace?.comment || visitedPlace.rating > 0 ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    className={styles.addReviewButton}
                    startIcon={<EditIcon />}
                  >
                    Редактировать отзыв
                  </Button>
                ) : null)}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};
