import { FC } from 'react';
import styles from './styles.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'medium',
}) => {
  return (
    <div className={`${styles.spinner} ${styles[size]}`}>
      <div className={styles.inner} />
    </div>
  );
};
