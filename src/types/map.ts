import { MapCoordinates, StringCoordinates } from '@utils';
import { Data, Item } from './interfaces';

export interface ExtendedItem extends Omit<Item, 'coordinates'> {
  name: string;
  center?: [number, number];
  coordinates: MapCoordinates[];
  type?: string;
  images?: string[] | null;
  link?: string | null;
  id?: number;
  created_at?: string;
  created_by?: string;
  category?: string;
  averageRating?: number;
  ratingCount?: number;
}

export interface ExtendedData extends Omit<Data, 'categories'> {
  categories: {
    [key: string]: ExtendedItem[];
  };
} 