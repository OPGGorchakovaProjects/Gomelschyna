import { MapObject } from "./objects";

export interface BasePlace {
  id: string;
  profile_id: string;
  object_id: number;
  created_at: string;
  updated_at: string;
  object: MapObject;
}

export interface VisitedPlace extends BasePlace {
  rating: number | null;
  comment: string | null;
  visited_at: string;
}

export interface FavoritePlace extends BasePlace {}

export interface CreatePlaceInput {
  object_id: number;
  rating: number;
  comment: string;
  visited_at?: string;
}

export interface UpdatePlaceInput {
  rating?: number;
  comment?: string;
  visited_at?: string;
}

export interface PlaceReview {
  id: string;
  profile_id: string;
  object_id: number;
  rating: number | null;
  comment: string | null;
  visited_at: string;
  created_at: string;
  updated_at: string;
  profile: {
    id: string;
    username: string;
    avatar_url: string | null;
  } | null;
}
