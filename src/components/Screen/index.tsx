import { IScreenProps } from '@types';
import styles from './style.module.scss';

export const Screen: React.FC<IScreenProps> = ({ children, className }) => {
  return (
    <div className={className ? styles[className] : styles.main}>
      {children}
    </div>
  );
};
