import { ReactNode, JSX, CSSProperties } from 'react';
import { ButtonSize, ButtonColor, ButtonType } from '@utils';
import * as L from 'leaflet';
import { CategoryKey } from './types';

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
  coordinates?: [number, number][];
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
  map_marker: string;
  name: string;
  location: string;
  description: string;
  image: string;
  links: {
    read_more: string;
    map: string;
  };
  coordinates: number[][];
}

export interface StreetsData {
  regions: string;
  categories: {
    streets: Street[];
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