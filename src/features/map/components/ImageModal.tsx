import React from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from '@pages/Map/style.module.scss';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const ImageModal = React.memo(
  ({ isOpen, onClose, imageUrl, title }: ImageModalProps) => (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      className={styles.imageModal}
    >
      <DialogContent className={styles.modalContent}>
        <IconButton
          className={styles.closeButton}
          onClick={onClose}
          size="large"
        >
          <CloseIcon />
        </IconButton>
        <img src={imageUrl} alt={title} className={styles.modalImage} />
      </DialogContent>
    </Dialog>
  ),
);

ImageModal.displayName = 'ImageModal';
