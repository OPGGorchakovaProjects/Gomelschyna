import { ReactNode, JSX, CSSProperties } from 'react';
import { ButtonSize, ButtonColor, ButtonType } from '@utils';

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
  activeCategories: string[];
  setActiveCategories: (categories: string[]) => void;
  hasRoute?: boolean;
  onClearRoute?: () => void;
}

export interface CategoryInfo {
  name: string;
  icon: JSX.Element;
}

export interface Item {
  name: string;
  description: string;
  coordinates?: string;
  image?: string;
  links?: {
    read_more?: string;
  };
  map_marker: string;
}

export interface Data {
  categories: {
    [key: string]: Item[];
  };
} 

export interface IBurgerMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}