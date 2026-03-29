import { atom } from 'jotai';
import { VisitedPlace, FavoritePlace } from '@types';
import { favoritePlaces, visitedPlaces } from '@api';

export interface ObjectRating {
  objectId: number;
  averageRating: number;
  ratingCount: number;
}

export const favoritePlacesAtom = atom<FavoritePlace[]>([]);
export const visitedPlacesAtom = atom<VisitedPlace[]>([]);
export const objectRatingsAtom = atom<ObjectRating[]>([]);

export const loadFavoritePlacesAtom = atom(
  null,
  async (_, set, profileId: string) => {
    try {
      const places = await favoritePlaces.getAll(profileId);
      set(favoritePlacesAtom, places);
    } catch (error) {
      console.error('Error loading favorite places:', error);
    }
  }
);

export const loadVisitedPlacesAtom = atom(
  null,
  async (_, set, profileId: string) => {
    try {
      const places = await visitedPlaces.getAll(profileId);
      set(visitedPlacesAtom, places);
    } catch (error) {
      console.error('Error loading visited places:', error);
    }
  }
);

export const loadAllRatingsAtom = atom(
  null,
  async (_, set) => {
    try {
      const allPlaces = await visitedPlaces.getAll();

      // Calculate average ratings for all places
      const ratings = new Map<number, { sum: number; count: number }>();
      
      allPlaces.forEach((place: VisitedPlace) => {
        if (place.rating !== null && place.rating > 0) {
          const current = ratings.get(place.object_id) || { sum: 0, count: 0 };
          ratings.set(place.object_id, {
            sum: current.sum + place.rating,
            count: current.count + 1,
          });
        }
      });

      const objectRatings: ObjectRating[] = Array.from(ratings.entries()).map(
        ([objectId, { sum, count }]) => ({
          objectId,
          averageRating: sum / count,
          ratingCount: count,
        })
      );

      set(objectRatingsAtom, objectRatings);
    } catch (error) {
      console.error('Error loading all ratings:', error);
    }
  }
); 
