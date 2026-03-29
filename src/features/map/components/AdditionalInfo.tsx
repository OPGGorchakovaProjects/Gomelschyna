import React, { useState } from 'react';
import { ExtendedItem, Street } from '@types';
import { ImageModal } from './ImageModal';
import styles from '@pages/Map/style.module.scss';

interface AdditionalInfoProps {
  item: ExtendedItem | Street;
}

export const AdditionalInfo = React.memo(({ item }: AdditionalInfoProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      {item.images && item.images.length > 0 && (
        <div className={styles.imagesContainer}>
          <img
            src={item.images[0]}
            alt={`${item.name} - изображение`}
            className={styles.image}
            onClick={() => handleImageClick(item.images![0])}
          />
        </div>
      )}
      {item.link && (
        <a
          href={item.link}
          className={styles.readMoreLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Больше информации
        </a>
      )}
      {selectedImage && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          imageUrl={selectedImage}
          title={item.name}
        />
      )}
    </>
  );
});

AdditionalInfo.displayName = 'AdditionalInfo';
