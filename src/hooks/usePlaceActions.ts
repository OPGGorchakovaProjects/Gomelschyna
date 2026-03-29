import { useCallback } from 'react';
import { visitedPlaces, favoritePlaces } from '@api';
import { CreatePlaceInput } from '@types';
import { useAuth } from '@hooks';
import { useAtomValue, useSetAtom } from 'jotai';
import { 
  favoritePlacesAtom, 
  visitedPlacesAtom, 
  loadFavoritePlacesAtom, 
  loadVisitedPlacesAtom,
  loadAllRatingsAtom,
} from '@store';

export const usePlaceActions = (placeId: string) => {
  const { user } = useAuth();
  const favoritePlacesList = useAtomValue(favoritePlacesAtom);
  const visitedPlacesList = useAtomValue(visitedPlacesAtom);
  const loadFavoritePlaces = useSetAtom(loadFavoritePlacesAtom);
  const loadVisitedPlaces = useSetAtom(loadVisitedPlacesAtom);
  const loadAllRatings = useSetAtom(loadAllRatingsAtom);

  const isVisited = visitedPlacesList.some(place => String(place.object_id) === placeId);
  const isFavorite = favoritePlacesList.some(place => String(place.object_id) === placeId);

  const checkPlaceStatus = useCallback(async () => {
    if (!user?.id) return;
    await Promise.all([
      loadFavoritePlaces(user.id),
      loadVisitedPlaces(user.id)
    ]);
  }, [user?.id, loadFavoritePlaces, loadVisitedPlaces]);

  const toggleVisited = useCallback(async () => {
    if (!user?.id || !placeId) return;

    try {
      if (isVisited) {
        const place = visitedPlacesList.find(p => String(p.object_id) === placeId);
        if (place) {
          await visitedPlaces.delete(place.id);
          await Promise.all([
            loadVisitedPlaces(user.id),
            loadAllRatings()
          ]);
        }
      } else {
        const objectId = parseInt(placeId, 10);
        if (isNaN(objectId)) {
          throw new Error('Invalid object_id');
        }

        const input: CreatePlaceInput = {
          object_id: objectId,
          rating: 0,
          comment: '',
          visited_at: new Date().toISOString(),
        };
        await visitedPlaces.create(user.id, input);
        await Promise.all([
          loadVisitedPlaces(user.id),
          loadAllRatings()
        ]);
      }
    } catch (error) {
      console.error('Error toggling visited status:', error);
    }
  }, [user?.id, placeId, isVisited, visitedPlacesList, loadVisitedPlaces, loadAllRatings]);

  const toggleFavorite = useCallback(async () => {
    if (!user?.id || !placeId) return;

    try {
      if (isFavorite) {
        const place = favoritePlacesList.find(p => String(p.object_id) === placeId);
        if (place) {
          await favoritePlaces.delete(place.id);
          await loadFavoritePlaces(user.id);
        }
      } else {
        const objectId = parseInt(placeId, 10);
        if (isNaN(objectId)) {
          throw new Error('Invalid object_id');
        }

        const input: CreatePlaceInput = {
          object_id: objectId,
          rating: 0,
          comment: '',
        };
        await favoritePlaces.create(user.id, input);
        await loadFavoritePlaces(user.id);
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  }, [user?.id, placeId, isFavorite, favoritePlacesList, loadFavoritePlaces]);

  return {
    isVisited,
    isFavorite,
    isLoading: false,
    checkPlaceStatus,
    toggleVisited,
    toggleFavorite,
  };
}; 