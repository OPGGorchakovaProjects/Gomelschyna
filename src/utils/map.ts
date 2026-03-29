import * as L from 'leaflet';
import { MapCoordinates } from '@types';

// ... existing code ...

export const calculateStreetCenter = (coordinates: MapCoordinates[]): MapCoordinates => {
  // Находим центр масс всех точек
  const centerOfMass: MapCoordinates = coordinates.reduce(
    (acc, coord) => ({
      lat: acc.lat + coord.lat,
      lng: acc.lng + coord.lng,
    }),
    { lat: 0, lng: 0 } as MapCoordinates
  );
  
  centerOfMass.lat /= coordinates.length;
  centerOfMass.lng /= coordinates.length;

  // Находим ближайшую точку на линии к центру масс
  let minDistance = Infinity;
  let closestPoint: MapCoordinates = coordinates[0];

  for (let i = 0; i < coordinates.length - 1; i++) {
    const start = coordinates[i];
    const end = coordinates[i + 1];
    
    // Находим ближайшую точку на отрезке к центру масс
    const point = findClosestPointOnLine(centerOfMass, start, end);
    const distance = calculateDistance(centerOfMass, point);

    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  }

  return closestPoint;
};

const findClosestPointOnLine = (
  point: MapCoordinates,
  lineStart: MapCoordinates,
  lineEnd: MapCoordinates
): MapCoordinates => {
  const x = point.lat;
  const y = point.lng;
  const x1 = lineStart.lat;
  const y1 = lineStart.lng;
  const x2 = lineEnd.lat;
  const y2 = lineEnd.lng;

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  return { lat: xx, lng: yy } as MapCoordinates;
};

const calculateDistance = (point1: MapCoordinates, point2: MapCoordinates): number => {
  const dx = point2.lat - point1.lat;
  const dy = point2.lng - point1.lng;
  return Math.sqrt(dx * dx + dy * dy);
}; 