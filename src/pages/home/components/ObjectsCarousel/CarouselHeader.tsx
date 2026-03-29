import { Typography } from '@mui/material';
import { FaKeyboard } from 'react-icons/fa';
import styles from './style.module.scss';

interface CarouselHeaderProps {
  title: string;
}

export const CarouselHeader = ({ title }: CarouselHeaderProps) => {
  return (
    <div className={styles.headerContainer}>
      <Typography variant="h2" className={styles.sectionTitle}>
        {title}
      </Typography>
      <div className={styles.keyboardHint}>
        <FaKeyboard />
        <span>Используйте ← → для навигации</span>
      </div>
    </div>
  );
};
