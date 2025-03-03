import { ReactNode } from 'react';

import styles from './style.module.scss';

interface IScreenProps {
  children: ReactNode;
  className?: string;
}

export const Screen: React.FC<IScreenProps> = ({ children, className }) => {
  return (
    <div className={className ? styles[className] : styles.main}>
      {children}
    </div>
  );
};
