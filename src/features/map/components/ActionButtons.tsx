import React from 'react';
import { Link } from 'react-router-dom';
import { MapCoordinates } from '@utils';
import { parseCoordinates } from '@features';
import { ExtendedItem, Street } from '@types';
import styles from '@pages/Map/style.module.scss';
import { Typography } from '@components';

interface ActionButtonsProps {
  item: ExtendedItem | Street;
  onGetRoute: (coords: MapCoordinates) => void;
  category: string;
}

export const ActionButtons = React.memo(
  ({ item, onGetRoute, category }: ActionButtonsProps) => {
    const objectParam =
      typeof item.id !== 'undefined' ? String(item.id) : item.map_marker;
    const infoLink = `/information?category=${encodeURIComponent(
      category,
    )}&object=${encodeURIComponent(objectParam)}`;

    return (
      <div className={styles.buttonContainer}>
        <Link className={styles.link} to={infoLink}>
          <Typography className={styles.linkText} text="Читать дальше" />
        </Link>
        <button
          className={styles.routeButton}
          onClick={e => {
            e.preventDefault();
            let coords: MapCoordinates;

            if (category === 'streets' && Array.isArray(item.coordinates)) {
              // Для улиц берем первую точку как начальную
              coords = {
                lat: item.coordinates[0].lat,
                lng: item.coordinates[0].lng,
              };
            } else {
              const rawCoords =
                'center' in item && item.center
                  ? item.center
                  : Array.isArray(item.coordinates)
                    ? item.coordinates[0]
                    : parseCoordinates(item.coordinates as string);

              coords = Array.isArray(rawCoords)
                ? { lat: rawCoords[0], lng: rawCoords[1] }
                : rawCoords;
            }

            onGetRoute(coords);
          }}
        >
          Проложить маршрут
        </button>
      </div>
    );
  },
);

ActionButtons.displayName = 'ActionButtons';
