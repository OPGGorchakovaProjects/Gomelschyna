import { ReactNode } from 'react';
import styles from './style.module.scss';
import { IScreenProps } from '@utils';

export const Screen: React.FC<IScreenProps> = ({ children, className }) => {
  return (
    <div className={className ? styles[className] : styles.main}>
      {children}
    </div>
  );
};
