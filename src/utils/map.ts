import L from 'leaflet';
import styles from '@pages/Map/style.module.scss';

export const categoryColors: { [key: string]: string } = {
  streets: '#FF6B6B',
  reserve: 'green',
  monuments: 'blue',
  museums: 'purple',
  cultural_values: 'orange',
  ancient_cities: 'brown',
  famous_people: 'pink',
  industry: 'gray',
  lakes: 'cyan',
  rivers: 'navy',
};

export const getIcon = (category: string) => {
  return L.divIcon({
    html: `<div class="${styles.markerIcon}" style="background-color: ${categoryColors[category]};"></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
    tooltipAnchor: [10, -10],
  });
};

export const createCustomIcon = (category: string) => {
  return L.divIcon({
    html: `<div class="${styles.markerIcon}" style="background-color: ${categoryColors[category]};"></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
    tooltipAnchor: [10, -10],
  });
};

export const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let className = 'cluster-small';
  let size = 30;

  if (count > 50) {
    className = 'cluster-large';
    size = 50;
  } else if (count > 20) {
    className = 'cluster-medium';
    size = 40;
  }

  return L.divIcon({
    html: `<div class="${className}">${count}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};