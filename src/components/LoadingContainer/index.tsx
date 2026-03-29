import { FC, ReactNode } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';
import styles from './styles.module.css';

interface LoadingContainerProps {
  children: ReactNode;
  isLoading: boolean;
}

export const LoadingContainer: FC<LoadingContainerProps> = ({
  children,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return <>{children}</>;
};
