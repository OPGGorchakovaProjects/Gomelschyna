import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface ZoomControllerProps {
  onZoomChange: (zoom: number) => void;
}

export const ZoomController: React.FC<ZoomControllerProps> = ({
  onZoomChange,
}) => {
  const map = useMap();

  useEffect(() => {
    const handleZoomChange = () => {
      onZoomChange(map.getZoom());
    };

    map.on('zoomend', handleZoomChange);
    // Устанавливаем начальный зум
    onZoomChange(map.getZoom());

    return () => {
      map.off('zoomend', handleZoomChange);
    };
  }, [map, onZoomChange]);

  return null;
};
