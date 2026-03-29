import { FC } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Box,
  Button,
  // Remove unused imports if any
} from '@mui/material';
import { VisitedPlace, FavoritePlace } from '../../types/places';
import { PlaceCard } from '../../components/PlaceCard';
import styles from './styles.module.scss';
import ImageIcon from '@mui/icons-material/Image';
import { IconMap } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export interface IPlacesListProps {
  title: string;
  places: VisitedPlace[] | FavoritePlace[];
  type: 'visited' | 'favorite';
  emptyMessage?: string;
  onUpdateVisitedPlace?: (id: string, rating: number, comment: string) => void;
  onDelete?: () => void;
  canEdit?: boolean;
}

export const PlacesList: FC<IPlacesListProps> = ({
  title,
  places,
  type,
  emptyMessage = 'Список пуст',
  onUpdateVisitedPlace,
  onDelete,
  canEdit = true,
}) => {
  const navigate = useNavigate();

  if (places.length === 0) {
    return (
      <Box className={styles.emptyState}>
        <Typography variant="h6" color="text.secondary" align="center">
          {emptyMessage}
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<IconMap size={20} />}
            onClick={() => navigate('/map')}
            className={styles.exploreButton}
          >
            {type === 'visited'
              ? 'Исследовать места'
              : 'Найти интересные места'}
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h5" component="h2" className={styles.title}>
        {title}
      </Typography>
      <Box className={styles.grid}>
        {places.map(place => (
          <Box key={place.id} className={styles.gridItem}>
            <PlaceCard
              place={place}
              type={type}
              onUpdateVisitedPlace={onUpdateVisitedPlace}
              onDelete={onDelete}
              canEdit={canEdit}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
