import { ReactNode, JSX, CSSProperties } from 'react';
import * as L from 'leaflet';
import { ButtonSize, ButtonColor, ButtonType, CategoryKey, StringCoordinates } from '@utils';

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface IButtonProps {
  onClick: () => void;
  label: string;
  size?: ButtonSize;
  color?: ButtonColor;
  buttonStyle?: string;
  textStyles?: string;
  type?: ButtonType;
  disabled?: boolean;
}

export interface ITypographyProps {
  text: string;
  style?: CSSProperties;
  className?: string;
  limit?: number;
}

export interface IScreenProps {
  children: ReactNode;
  className?: string;
}

export interface IHeaderProps {
  activeCategories: CategoryKey[];
  setActiveCategories: (categories: CategoryKey[]) => void;
  hasRoute?: boolean;
  onClearRoute?: () => void;
}

export interface CategoryInfo {
  name: string;
  icon: JSX.Element;
}

export interface Item {
  name: string;
  location: string;
  description: string;
  image?: string;
  links?: {
    read_more?: string;
    map?: string;
  };
  map_marker?: string;
  coordinates?: MapCoordinates[] | StringCoordinates;
}

export interface Data {
  categories: Record<string, Item[]>;
  famous_people?: Item[];
  streets?: Item[];
}

export interface ContentBlockProps extends Item {
  id?: string;
}

export interface CategoryNames {
  [key: string]: string;
}

export interface IBurgerMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export interface IRoutingControlProps {
  userLocation: [number, number];
  destination: [number, number];
  onRouteCreated?: () => void;
}

export interface IMapEventsProps {
  onMapClick: (e: L.LeafletMouseEvent) => void;
}

export interface Street {
  name: string;
  description: string;
  map_marker: string;
  coordinates: MapCoordinates[];
  center?: MapCoordinates;
  images?: string[] | null;
  link?: string | null;
  links?: {
    read_more?: string;
  };
}

export interface StreetsData {
  regions: string;
  categories: {
    streets: {
      name: string;
      location: string;
      description: string;
      image: string;
      links: {
        read_more: string;
        map: string;
      };
      coordinates: number[][];
      map_marker: string;
    }[];
  };
}

export interface IMapProps {
  ref: React.RefObject<L.Map>;
  center: [number, number];
  zoom: number;
  className: string;
  attributionControl: boolean;
  zoomControl: boolean;
  maxBounds: [[number, number], [number, number]];
  minZoom: number;
}

export interface IMarkerProps {
  position: [number, number];
  icon: L.Icon;
  children: ReactNode;
}

export interface IPolygonProps {
  positions: L.LatLngExpression[] | L.LatLngExpression[][] | L.LatLngExpression[][][];
  pathOptions: {
    color: string;
    weight: number;
    opacity: number;
    fillOpacity: number;
    dashArray?: string;
    className: string;
  };
}

export interface IClusterIconProps {
  cluster: {
    getChildCount: () => number;
  };
  options: {
    iconSize: [number, number];
  };
}

export interface IMapControllerProps {
  selected: string | null;
  data: Data | null;
  streets: Street[];
}

export interface ObjectData {
  name: string;
  description: string;
  image: string;
  coordinates: string;
  id?: number;
  averageRating?: number;
  ratingCount?: number;
  category?: string;
}

export interface CarouselObject extends ObjectData {
  isActive: boolean;
}

export interface CarouselNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  autoPlayInterval: number;
}

export interface CarouselTouchHandlerProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
  autoPlayInterval: number;
  children: React.ReactNode;
}

export interface CarouselAutoPlayProps {
  onNext: () => void;
  isPaused: boolean;
  interval: number;
} 