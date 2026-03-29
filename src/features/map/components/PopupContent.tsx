import React, { useCallback, useEffect, useState } from 'react';
import { Typography } from '@components';
import { MapCoordinates } from '@utils';
import {
  ExtendedItem,
  ExtendedData,
  Street,
  FavoritePlace,
  VisitedPlace,
  PlaceReview,
} from '@types';
import { RatingDisplay } from './RatingDisplay';
import { ObjectActions } from './ObjectActions';
import { ActionButtons } from './ActionButtons';
import { AdditionalInfo } from './AdditionalInfo';
import { ReviewModal } from './ReviewModal';
import { useAuth, usePlaceActions } from '@hooks';
import { useAtomValue, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import {
  favoritePlacesAtom,
  visitedPlacesAtom,
  loadFavoritePlacesAtom,
  loadVisitedPlacesAtom,
  objectRatingsAtom,
  loadAllRatingsAtom,
} from '@store';
import { visitedPlaces as visitedPlacesApi } from '@api';
import { Avatar, CircularProgress, Rating } from '@mui/material';
import styles from '@pages/Map/style.module.scss';

interface PopupContentProps {
  item: ExtendedItem | Street;
  onAuthAction: () => void;
  onGetRoute: (coordinates: MapCoordinates) => void;
  data: ExtendedData | null;
}

export const PopupContent = React.memo(
  ({ item, onAuthAction, onGetRoute, data }: PopupContentProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const favoritePlaces = useAtomValue(favoritePlacesAtom);
    const visitedPlaces = useAtomValue(visitedPlacesAtom);
    const objectRatings = useAtomValue(objectRatingsAtom);
    const loadFavoritePlaces = useSetAtom(loadFavoritePlacesAtom);
    const loadVisitedPlaces = useSetAtom(loadVisitedPlacesAtom);
    const loadAllRatings = useSetAtom(loadAllRatingsAtom);
    const [reviewsVisible, setReviewsVisible] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsError, setReviewsError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<PlaceReview[]>([]);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [hasExistingReview, setHasExistingReview] = useState(false);

    const placeId =
      'id' in item
        ? String(item.id)
        : typeof item.map_marker === 'string'
          ? item.map_marker
          : '';

    const isFavorite = favoritePlaces.some(
      (place: FavoritePlace) => String(place.object_id) === placeId,
    );
    const isVisited = visitedPlaces.some(
      (place: VisitedPlace) => String(place.object_id) === placeId,
    );

    // Проверяем наличие отзыва у текущего пользователя
    useEffect(() => {
      const checkExistingReview = async () => {
        if (!user?.id || !isVisited) {
          setHasExistingReview(false);
          return;
        }

        try {
          const { supabase } = await import('@api');
          const { data, error } = await supabase
            .from('visited_places')
            .select('rating, comment')
            .eq('profile_id', user.id)
            .eq('object_id', Number(placeId))
            .single();

          if (!error && data && data.rating !== null && data.comment) {
            setHasExistingReview(true);
          } else {
            setHasExistingReview(false);
          }
        } catch (err) {
          console.error('Error checking existing review:', err);
          setHasExistingReview(false);
        }
      };

      checkExistingReview();
    }, [user?.id, isVisited, placeId]);

    const { isLoading, checkPlaceStatus, toggleVisited, toggleFavorite } =
      usePlaceActions(placeId);

    const numericPlaceId = Number(placeId);
    const canFetchReviews = !Number.isNaN(numericPlaceId);

    useEffect(() => {
      loadAllRatings();
    }, [loadAllRatings]);

    useEffect(() => {
      if (user?.id) {
        loadFavoritePlaces(user.id);
        loadVisitedPlaces(user.id);
        checkPlaceStatus();
      }
    }, [user?.id, checkPlaceStatus, loadFavoritePlaces, loadVisitedPlaces]);

    useEffect(() => {
      setReviewsVisible(false);
      setReviews([]);
      setReviewsError(null);
      setReviewsLoading(false);
    }, [numericPlaceId]);

    const getItemCategory = (item: ExtendedItem | Street): string => {
      if ('type' in item && typeof item.type === 'string') {
        return item.type;
      }
      return 'streets';
    };

    const fetchReviews = useCallback(async () => {
      if (!canFetchReviews) {
        setReviewsError('Невозможно загрузить отзывы для этого объекта');
        return;
      }

      try {
        setReviewsLoading(true);
        setReviewsError(null);
        const result = await visitedPlacesApi.getReviewsByObject(
          numericPlaceId,
        );
        setReviews(result);
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviewsError('Не удалось загрузить отзывы. Попробуйте позже.');
      } finally {
        setReviewsLoading(false);
      }
    }, [canFetchReviews, numericPlaceId]);

    const handleRatingClick = useCallback(() => {
      if (!canFetchReviews) {
        setReviewsError('Отзывы недоступны для этого объекта');
        setReviewsVisible(true);
        return;
      }

      if (!reviewsVisible) {
        if (reviewsLoading) {
          return;
        }

        setReviewsVisible(true);

        if (reviews.length === 0) {
          fetchReviews();
        }
      } else {
        setReviewsVisible(false);
      }
    }, [canFetchReviews, reviewsVisible, reviews.length, fetchReviews, reviewsLoading]);

    const handleReviewClick = useCallback(
      (review: PlaceReview) => {
        if (review.profile?.id) {
          navigate(`/profile/${review.profile.id}`);
        }
      },
      [navigate],
    );

    const handleReviewModalOpen = useCallback(() => {
      setReviewModalOpen(true);
    }, []);

    const handleReviewModalClose = useCallback(() => {
      setReviewModalOpen(false);
    }, []);

    const handleReviewSuccess = useCallback(() => {
      // Перезагрузить отзывы и рейтинги
      fetchReviews();
      loadAllRatings();
      // Обновить статус наличия отзыва
      setHasExistingReview(true);
    }, [fetchReviews, loadAllRatings]);

    const category = getItemCategory(item);
    const objectRating = objectRatings.find(
      rating => rating.objectId === Number(placeId),
    );
    const averageRating = objectRating?.averageRating || 0;
    const ratingCount = objectRating?.ratingCount || 0;

    return (
      <div className={styles.popupContent}>
        <Typography
          text={item.name}
          className={`${styles.title} ${styles.noMargin}`}
        />
        <div className={styles.objectActions}>
          <RatingDisplay
            rating={averageRating}
            count={ratingCount}
            onClick={handleRatingClick}
            active={reviewsVisible}
          />
          <ObjectActions
            onAuthAction={onAuthAction}
            isAuthenticated={!!user}
            isVisited={isVisited}
            isFavorite={isFavorite}
            onToggleVisited={toggleVisited}
            onToggleFavorite={toggleFavorite}
            onReviewClick={handleReviewModalOpen}
            hasExistingReview={hasExistingReview}
          />
        </div>
        {item.description && (
          <Typography
            text={item.description}
            className={styles.description}
            limit={100}
          />
        )}
        <ActionButtons
          item={item}
          onGetRoute={onGetRoute}
          category={category}
        />
        {reviewsVisible && (
          <div className={styles.reviewsWrapper}>
            {reviewsLoading && (
              <div className={styles.reviewsLoader}>
                <CircularProgress size={20} />
              </div>
            )}
            {!reviewsLoading && reviewsError && (
              <div className={styles.reviewsMessage}>{reviewsError}</div>
            )}
            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <div className={styles.reviewsMessage}>
                Для этого места пока нет отзывов
              </div>
            )}
            {!reviewsLoading &&
              !reviewsError &&
              reviews.map(review => {
                const username = review.profile?.username || 'Пользователь';
                const MAX_USERNAME_LENGTH = 12;
                const displayName =
                  username.length > MAX_USERNAME_LENGTH
                    ? `${username.slice(0, MAX_USERNAME_LENGTH - 3)}...`
                    : username;
                const avatarUrl = review.profile?.avatar_url || undefined;
                const initial =
                  username && username.length > 0
                    ? username.charAt(0).toUpperCase()
                    : 'П';
                const reviewDate = review.visited_at
                  ? new Date(review.visited_at).toLocaleDateString()
                  : new Date(review.created_at).toLocaleDateString();

                return (
                  <button
                    type="button"
                    key={review.id}
                    className={styles.reviewTile}
                    onClick={() => handleReviewClick(review)}
                  >
                    <Avatar
                      src={avatarUrl}
                      alt={username}
                      className={styles.reviewAvatar}
                    >
                      {initial}
                    </Avatar>
                    <div className={styles.reviewContent}>
                      <div className={styles.reviewHeader}>
                        <span
                          className={styles.reviewName}
                          title={username}
                        >
                          {displayName}
                        </span>
                        <span className={styles.reviewDate}>{reviewDate}</span>
                      </div>
                      {review.rating !== null && review.rating > 0 && (
                        <Rating
                          value={review.rating}
                          readOnly
                          size="small"
                          className={styles.reviewRating}
                        />
                      )}
                      {review.comment && (
                        <p className={styles.reviewText}>{review.comment}</p>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        )}
        <AdditionalInfo item={item} />
        
        <ReviewModal
          open={reviewModalOpen}
          onClose={handleReviewModalClose}
          objectId={placeId}
          objectName={item.name}
          onSuccess={handleReviewSuccess}
        />
      </div>
    );
  },
);

PopupContent.displayName = 'PopupContent';
