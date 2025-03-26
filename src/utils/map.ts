import L from 'leaflet';
import styles from '@pages/Map/style.module.scss';

export const categoryColors: { [key: string]: string } = {
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

export const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let className = 'cluster-small';

  if (count > 50) {
    className = 'cluster-large';
  } else if (count > 20) {
    className = 'cluster-medium';
  }

  return L.divIcon({
    html: `<div class="cluster-icon ${className}">${count}</div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};