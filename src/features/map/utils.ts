import { CategoryKey } from '@utils';
import { categoryColors } from './map';

export const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  const markers = cluster.getAllChildMarkers();
  const categories = new Set(markers.map((marker: any) => {
    const icon = marker.options.icon;
    if (icon && icon.options && icon.options.className) {
      return icon.options.className.split(' ')[0];
    }
    return null;
  }).filter(Boolean));

  let size = 'small';
  if (count > 50) size = 'large';
  else if (count > 20) size = 'medium';

  const colors = Array.from(categories).map(category => categoryColors[category as CategoryKey] || '#666');
  const dominantColor = colors[0];

  const html = `
    <div class="custom-marker-cluster">
      <div class="cluster-${size}" style="background-color: ${dominantColor}">
        <div class="cluster-content">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
          </svg>
          <span class="cluster-count">${count}</span>
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-cluster-icon',
    iconSize: L.point(40, 40),
  });
}; 