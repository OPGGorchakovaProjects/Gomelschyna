import React from 'react';
import { Marker, Popup, Polyline } from 'react-leaflet';
import { MapCoordinates, CategoryKey } from '@utils';
import { getIcon, categoryColors, parseCoordinates } from '@features';
import { ExtendedItem, ExtendedData, Item, Street } from '@types';
import { PopupContent } from './PopupContent';

interface MarkerWithPopupProps {
  item: ExtendedItem;
  category: CategoryKey;
  onAuthAction: () => void;
  onGetRoute: (coords: MapCoordinates) => void;
  onPopupOpen: (item: Item | Street) => void;
  data: ExtendedData | null;
}

export const MarkerWithPopup = React.memo(
  ({
    item,
    category,
    onAuthAction,
    onGetRoute,
    onPopupOpen,
    data,
  }: MarkerWithPopupProps) => {
    const coordinates =
      'center' in item && item.center
        ? item.center
        : Array.isArray(item.coordinates)
          ? item.coordinates[0]
          : parseCoordinates(item.coordinates as string);

    if (!coordinates) {
      return null;
    }

    const position = Array.isArray(coordinates)
      ? (coordinates as [number, number])
      : ([coordinates.lat, coordinates.lng] as [number, number]);

    return (
      <>
        {category === 'streets' && Array.isArray(item.coordinates) && (
          <Polyline
            key={`line-${item.map_marker}`}
            positions={item.coordinates}
            pathOptions={{
              color: categoryColors.streets,
              weight: 4,
              opacity: 0.7,
              className: 'street-line',
            }}
          />
        )}
        <Marker
          key={`marker-${item.map_marker}`}
          position={position}
          icon={getIcon(category)}
          data-marker-id={item.map_marker}
          eventHandlers={{
            click: () => onPopupOpen(item),
          }}
        >
          <Popup
            eventHandlers={{
              add: () => onPopupOpen(item),
            }}
          >
            <PopupContent
              item={item}
              onAuthAction={onAuthAction}
              onGetRoute={onGetRoute}
              data={data}
            />
          </Popup>
        </Marker>
      </>
    );
  },
);

MarkerWithPopup.displayName = 'MarkerWithPopup';
