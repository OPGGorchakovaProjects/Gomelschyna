import L from 'leaflet';
import styles from '@pages/Map/style.module.scss';
import {
  IconRoad,
  IconTree,
  IconBuildingMonument,
  IconBuildings,
  IconBuildingChurch,
  IconBuildingCastle,
  IconBuildingFactory,
  IconDroplet,
  IconRipple,
  IconMapPin,
  IconBuildingCottage,
} from '@tabler/icons-react';
import { renderToString } from 'react-dom/server';
import React from 'react';

export const categoryColors: { [key: string]: string } = {
  streets: '#FF6B6B',
  reserve: '#4CAF50',
  monuments: '#2196F3',
  museums: '#9C27B0',
  cultural_values: '#FF9800',
  ancient_cities: '#795548',
  industry: '#607D8B',
  lakes: '#00BCD4',
  rivers: '#1A237E',
  КПХ: '#4eb30b',
};

const categoryIcons = {
  streets: IconRoad,
  reserve: IconTree,
  monuments: IconBuildingMonument,
  museums: IconBuildings,
  cultural_values: IconBuildingChurch,
  ancient_cities: IconBuildingCastle,
  industry: IconBuildingFactory,
  lakes: IconDroplet,
  rivers: IconRipple,
  КПХ: IconBuildingCottage,
};

export const getIcon = (category: string, markerId?: string) => {
  const Icon = categoryIcons[category as keyof typeof categoryIcons];
  const color = categoryColors[category];
  
  const iconHtml = Icon 
    ? renderToString(
        React.createElement('div', 
          { 
            className: styles.markerIcon, 
            style: { backgroundColor: color },
            'data-marker-id': markerId
          },
          React.createElement(Icon, { 
            size: 16, 
            color: 'white',
            style: { transform: 'rotate(45deg)' },
            stroke: 2
          })
        )
      ) 
    : `<div class="${styles.markerIcon}" style="background-color: ${color};" data-marker-id="${markerId || ''}">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg)">
           <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
           <circle cx="12" cy="10" r="3"></circle>
         </svg>
       </div>`;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    tooltipAnchor: [16, -16],
  });
};

// export const createCustomIcon = (category: string) => {
//   return L.divIcon({
//     html: `<div class="${styles.markerIcon}" style="background-color: ${categoryColors[category]};"></div>`,
//     className: '',
//     iconSize: [20, 20],
//     iconAnchor: [10, 10],
//     popupAnchor: [0, -10],
//     tooltipAnchor: [10, -10],
//   });
// };

export const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let className = 'cluster-small';
  let size = 40;

  if (count > 50) {
    className = 'cluster-large';
    size = 60;
  } else if (count > 20) {
    className = 'cluster-medium';
    size = 50;
  }

  // Определяем наиболее часто встречающуюся категорию в кластере
  const markers = cluster.getAllChildMarkers();
  const categories = markers.map((marker: any) => {
    const icon = marker.options.icon;
    const element = document.createElement('div');
    element.innerHTML = icon.options.html;
    const markerDiv = element.firstChild as HTMLElement;
    const color = markerDiv.style.backgroundColor;
    
    // Находим категорию по цвету
    return Object.entries(categoryColors).find(([, value]) => {
      return value.toLowerCase() === color.toLowerCase();
    })?.[0] || 'default';
  });

  const categoryCount: { [key: string]: number } = {};
  categories.forEach((category: string) => {
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  const dominantCategory = Object.entries(categoryCount).reduce((a, b) => 
    (a[1] > b[1] ? a : b)
  )[0];

  const Icon = categoryIcons[dominantCategory as keyof typeof categoryIcons] || IconMapPin;
  const iconHtml = renderToString(
    React.createElement('div', 
      { className },
      React.createElement('div', 
        { className: 'cluster-content' },
        React.createElement(Icon, { 
          size: size / 3,
          color: 'white',
        }),
        React.createElement('div', 
          { className: 'cluster-count' },
          count
        )
      )
    )
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker-cluster',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};