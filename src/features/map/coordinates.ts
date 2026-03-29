import { MapCoordinates } from '@utils';

export const parseCoordinates = (coord: string | MapCoordinates): MapCoordinates => {
  if (Array.isArray(coord) && coord.length === 2) {
    return { lat: coord[0], lng: coord[1] };
  }
  if (typeof coord === 'string') {
    const parts = coord.split(',');
    if (parts.length === 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
  }
  return { lat: 52.4242, lng: 31.014 };
}; 