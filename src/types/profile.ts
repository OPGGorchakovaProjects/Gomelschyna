export interface IProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface IVisitedPlace {
  id: string;
  name: string;
  date: string;
  review?: string;
  rating?: number;
  image?: string;
}

export interface IFavoritePlace {
  id: string;
  name: string;
  addedDate: string;
  review?: string;
  rating?: number;
  image?: string;
}

export interface IReview {
  id: string;
  placeId: string;
  text: string;
  rating: number;
  date: string;
} 