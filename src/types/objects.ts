export interface MapObject {
  id: number;
  created_at: string;
  created_by: string;
  category: string;
  name: string;
  location: string;
  description: string;
  images: string[] | null;
  link: string | null;
  coordinates: string[];
  map_marker: string;
  path?: { lat: number; lng: number }[];
}

export interface CreateObjectInput {
  created_by: string;
  category: string;
  name: string;
  location: string;
  description: string;
  images: string[] | null;
  link: string | null;
  coordinates: string[];
  map_marker: string;
  path?: { lat: number; lng: number }[];
}

export interface UpdateObjectInput {
  category?: string;
  name?: string;
  location?: string;
  description?: string;
  images?: string[] | null;
  link?: string | null;
  coordinates?: string[];
  map_marker?: string;
  path?: { lat: number; lng: number }[];
}
