import { ReactNode } from 'react';

export interface ScreenProps {
  children: ReactNode;
}

export const Screen: React.FC<ScreenProps>;
export * from './Header';
export * from './Footer'; 