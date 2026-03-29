import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Modal,
  Paper,
  useTheme,
  useMediaQuery,
  ImageList,
  ImageListItem,
  Tooltip,
  Fade,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { IconUpload, IconX } from '@tabler/icons-react';
import { objects } from '@api';

const MAX_IMAGES = 3;

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  type: string;
}

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ open, onClose, imageUrl }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: isMobile ? 1 : 2,
      }}
    >
      <Paper
        sx={{
          position: 'relative',
          maxWidth: '95vw',
          maxHeight: '95vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: isMobile ? 1 : 2,
          borderRadius: 2,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': { transform: 'scale(1.5)' },
            cursor: 'zoom-in',
          }}
        >
          <img
            src={imageUrl}
            alt="Full size"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 8,
            }}
          />
        </Box>
      </Paper>
    </Modal>
  );
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  type,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileUpload = async (files: FileList | File[]) => {
    if (images.length + files.length > MAX_IMAGES) {
      alert(`Можно загрузить максимум ${MAX_IMAGES} изображений`);
      return;
    }

    setIsUploading(true);
    try {
      const folderName =
        type === 'ancient_cities'
          ? 'AncientCity'
          : type === 'cultural_values'
            ? 'CulturalValue'
            : type === 'industry'
              ? 'Industry'
              : type === 'lakes'
                ? 'Lake'
                : type === 'monuments'
                  ? 'Monument'
                  : type === 'museums'
                    ? 'Museum'
                    : type === 'reserve'
                      ? 'Reserve'
                      : type === 'rivers'
                        ? 'River'
                        : type === 'streets'
                          ? 'Street'
                          : type;

      const uploadPromises = Array.from(files).map(file =>
        objects.uploadImage(file, folderName),
      );

      const newUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...newUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Ошибка при загрузке изображений');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = async (index: number) => {
    try {
      const imageToDelete = images[index];
      await objects.deleteImage(imageToDelete);
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Ошибка при удалении изображения');
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [images],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {images.length < MAX_IMAGES && (
        <Typography variant="subtitle1" gutterBottom>
          Изображения
        </Typography>
      )}

      {images.length < MAX_IMAGES && (
        <Box
          sx={{
            border: isDragging ? '2px dashed' : '1px solid',
            borderColor: isDragging ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 2,
            mb: 2,
            backgroundColor: isDragging ? 'action.hover' : 'background.paper',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            textAlign: 'center',
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            onChange={e => e.target.files && handleFileUpload(e.target.files)}
          />
          <label htmlFor="image-upload">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <IconUpload size={32} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Перетащите изображения сюда или кликните для выбора
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Максимум {MAX_IMAGES} изображений
              </Typography>
            </Box>
          </label>

          {isUploading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      )}

      {images.length > 0 && (
        <Box sx={{ mt: 1, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Загруженные изображения
          </Typography>
          <ImageList
            sx={{
              width: '100%',
              height: 'auto',
              gap: '12px !important',
              mt: 1,
            }}
            cols={isMobile ? 2 : 3}
            rowHeight={180}
          >
            {images.map((image, index) => (
              <ImageListItem
                key={index}
                sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 1,
                  transition: 'box-shadow 0.2s ease-in-out',
                  '&:hover': { boxShadow: 2 },
                  '&:hover .image-actions': {
                    opacity: 1,
                  },
                  cursor: 'pointer',
                  border: '1px solid #e0e0e0',
                }}
              >
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  loading="lazy"
                  style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                  }}
                  onClick={() => setSelectedImage(image)}
                />
                <Box
                  className="image-actions"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <Tooltip title="Увеличить" TransitionComponent={Fade}>
                    <IconButton
                      onClick={() => setSelectedImage(image)}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                        },
                      }}
                    >
                      <ZoomInIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить" TransitionComponent={Fade}>
                    <IconButton
                      onClick={() => handleImageDelete(index)}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.7)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}

      <ImageModal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
      />
    </Box>
  );
};
