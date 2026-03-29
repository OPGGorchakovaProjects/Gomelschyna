import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '@hooks';
import styles from './ReviewModal.module.scss';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  objectId: string;
  objectName: string;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  objectId,
  objectName,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Загрузка существующего отзыва при открытии модального окна
  useEffect(() => {
    const loadExistingReview = async () => {
      if (!open || !user) {
        setInitialLoading(false);
        return;
      }

      setInitialLoading(true);
      setError('');

      try {
        const { supabase } = await import('@api');
        
        const { data: existingVisit, error: fetchError } = await supabase
          .from('visited_places')
          .select('id, rating, comment')
          .eq('profile_id', user.id)
          .eq('object_id', Number(objectId))
          .single();

        if (!fetchError && existingVisit) {
          // Найден существующий отзыв
          if (existingVisit.rating !== null && existingVisit.comment) {
            setIsEditing(true);
            setExistingReviewId(existingVisit.id);
            setRating(existingVisit.rating);
            setComment(existingVisit.comment);
          } else {
            // Есть запись о посещении, но без отзыва
            setIsEditing(false);
            setExistingReviewId(existingVisit.id);
            setRating(null);
            setComment('');
          }
        } else {
          // Нет записи о посещении - не должно произойти, так как кнопка доступна только для посещенных мест
          setIsEditing(false);
          setExistingReviewId(null);
          setRating(null);
          setComment('');
        }
      } catch (err) {
        console.error('Error loading existing review:', err);
        setError('Не удалось загрузить данные отзыва');
      } finally {
        setInitialLoading(false);
      }
    };

    loadExistingReview();
  }, [open, user, objectId]);

  const handleSubmit = async () => {
    if (!user) {
      setError('Необходимо войти в систему');
      return;
    }

    if (rating === null || rating === 0) {
      setError('Пожалуйста, поставьте оценку');
      return;
    }

    if (!comment.trim()) {
      setError('Пожалуйста, напишите отзыв');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { visitedPlaces, supabase } = await import('@api');
      
      let visitId = existingReviewId;

      // Если нет существующей записи, создаем новую
      if (!visitId) {
        const { data: existingVisit, error: fetchError } = await supabase
          .from('visited_places')
          .select('id')
          .eq('profile_id', user.id)
          .eq('object_id', Number(objectId))
          .single();

        if (fetchError) {
          throw new Error('Не удалось найти запись о посещении');
        }

        visitId = existingVisit?.id;
      }

      if (visitId) {
        await visitedPlaces.update(visitId, {
          rating,
          comment: comment.trim(),
          visited_at: new Date().toISOString(),
        });
      }

      setSuccess(true);
      
      // Сброс формы через небольшую задержку
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        
        onClose();
        
        // Сброс состояния после закрытия
        setTimeout(() => {
          setRating(null);
          setComment('');
          setSuccess(false);
          setIsEditing(false);
          setExistingReviewId(null);
        }, 300);
      }, 1500);
    } catch (err) {
      console.error('Error saving review:', err);
      setError('Не удалось сохранить отзыв. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setRating(null);
      setComment('');
      setError('');
      setSuccess(false);
      setIsEditing(false);
      setExistingReviewId(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      className={styles.reviewModal}
      PaperProps={{
        className: styles.reviewModalPaper,
      }}
    >
      <DialogTitle className={styles.reviewModalTitle}>
        {isEditing ? <EditIcon className={styles.titleIcon} /> : <StarIcon className={styles.titleIcon} />}
        {isEditing ? `Редактировать отзыв о "${objectName}"` : `Отзыв о "${objectName}"`}
      </DialogTitle>

      <DialogContent className={styles.reviewModalContent}>
        {initialLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        )}
        
        {!initialLoading && (
          <>
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {isEditing ? 'Отзыв успешно обновлен!' : 'Отзыв успешно добавлен!'}
              </Alert>
            )}

            <Box sx={{ mb: 3, mt: 1 }}>
              <Typography component="legend" sx={{ mb: 1, fontWeight: 500 }}>
                Ваша оценка *
              </Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={(_, newValue) => {
                  setRating(newValue);
                  setError('');
                }}
                size="large"
                disabled={loading || success}
                emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
              />
            </Box>

            <TextField
              label="Ваш отзыв"
              multiline
              rows={4}
              fullWidth
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError('');
              }}
              placeholder="Поделитесь своими впечатлениями об этом месте..."
              required
              disabled={loading || success}
              error={!!error}
              helperText={error || `${comment.length}/500 символов`}
              inputProps={{ maxLength: 500 }}
            />
          </>
        )}
      </DialogContent>

      <DialogActions className={styles.reviewModalActions}>
        <Button onClick={handleClose} disabled={loading || success || initialLoading}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || success || initialLoading || rating === null || !comment.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : isEditing ? <EditIcon /> : <StarIcon />}
        >
          {loading ? (isEditing ? 'Сохранение...' : 'Отправка...') : (isEditing ? 'Сохранить изменения' : 'Отправить отзыв')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
