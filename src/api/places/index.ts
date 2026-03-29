import { supabase } from '@api';
import { VisitedPlace, FavoritePlace, CreatePlaceInput, UpdatePlaceInput, PlaceReview } from '@types';

export const visitedPlaces = {
  getAll: async (profileId?: string): Promise<VisitedPlace[]> => {
    let query = supabase
      .from('visited_places')
      .select('*, object:objects(*)')
      .order('visited_at', { ascending: false });

    if (profileId) {
      query = query.eq('profile_id', profileId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  create: async (profileId: string, input: CreatePlaceInput): Promise<VisitedPlace> => {
    const { data, error } = await supabase
      .from('visited_places')
      .insert([{ profile_id: profileId, ...input }])
      .select('*, object:objects(*)')
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id: string, input: UpdatePlaceInput): Promise<VisitedPlace> => {
    const { data, error } = await supabase
      .from('visited_places')
      .update(input)
      .eq('id', id)
      .select('*, object:objects(*)')
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('visited_places')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  getReviewsByObject: async (objectId: number): Promise<PlaceReview[]> => {
    const { data, error } = await supabase
      .from('visited_places')
      .select(
        `
          id,
          profile_id,
          object_id,
          rating,
          comment,
          visited_at,
          created_at,
          updated_at,
          profile:profiles (
            id,
            username,
            avatar_url
          )
        `,
      )
      .eq('object_id', objectId)
      .order('visited_at', { ascending: false });

    if (error) throw error;

    const reviews = (data as PlaceReview[] | null) ?? [];

    return reviews.filter(
      review =>
        (review.comment && review.comment.trim().length > 0) ||
        (review.rating !== null && review.rating > 0),
    );
  },
};

export const favoritePlaces = {
  getAll: async (profileId: string): Promise<FavoritePlace[]> => {
    const { data, error } = await supabase
      .from('favourite_places')
      .select('*, object:objects(*)')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  create: async (profileId: string, input: CreatePlaceInput): Promise<FavoritePlace> => {
    const { data, error } = await supabase
      .from('favourite_places')
      .insert([{ profile_id: profileId, ...input }])
      .select('*, object:objects(*)')
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id: string, input: UpdatePlaceInput): Promise<FavoritePlace> => {
    const { data, error } = await supabase
      .from('favourite_places')
      .update(input)
      .eq('id', id)
      .select('*, object:objects(*)')
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('favourite_places')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 
