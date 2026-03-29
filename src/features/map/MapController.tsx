import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { IMapControllerProps, MapCoordinates } from '@utils';
import { parseCoordinates } from './coordinates';

export const MapController = ({
  selected,
  data,
  streets,
}: IMapControllerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!selected || !map) return;

    // Проверяем основные категории
    if (data?.categories) {
      for (const [, items] of Object.entries(data.categories)) {
        const item = items.find(i => i.map_marker === selected);
        if (item?.coordinates) {
          const coordinates = Array.isArray(item.coordinates)
            ? (item.coordinates[0] as MapCoordinates)
            : parseCoordinates(item.coordinates as string);
          map.setView(coordinates, 13);
          return;
        }
      }
    }

    // Проверяем улицы
    const street = streets.find(s => s.map_marker === selected);
    if (street?.center) {
      map.setView(street.center, 13);
    }
  }, [selected, data, streets, map]);

  return null;
};
