import { MapCoordinates } from '../../utils/types/types';

export const parseCoordinates = (coord: string | MapCoordinates): MapCoordinates => {
  if (Array.isArray(coord) && coord.length === 2) {
    return coord as MapCoordinates;
  }
  if (typeof coord === 'string') {
    const parts = coord.split(',');
    if (parts.length === 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng] as MapCoordinates;
      }
    }
  }
  return [52.4242, 31.014] as MapCoordinates;
}; 