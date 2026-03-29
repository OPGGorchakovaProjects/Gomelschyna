import { Object } from "@types";

export interface IVisitedPlace {
  id: string;
  profile_id: string;
  object_id: number;
  created_at: string;
  rating: number | null;
  comment: string | null;
  visited_at: string;
  updated_at: string;
  object: Object;
}

export interface IFavoritePlace {
  id: string;
  profile_id: string;
  object_id: number;
  created_at: string;
  updated_at: string;
  object: Object;
}

export interface IProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
} 