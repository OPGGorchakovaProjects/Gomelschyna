import L from 'leaflet';
import { ExtendedItem, Street } from '@types';

export const getMarkerIcon = (item: ExtendedItem | Street): L.Icon => {
  const isStreet = 'coordinates' in item && Array.isArray(item.coordinates);
  
  return L.icon({
    iconUrl: isStreet ? '/markers/street.png' : '/markers/point.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}; 