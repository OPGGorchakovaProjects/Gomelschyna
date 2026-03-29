import React, { useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import { ExtendedItem, Street, MapCoordinates } from '@types';
import { PopupContent } from './PopupContent';
import styles from '@pages/Map/style.module.scss';
import { calculateStreetCenter, getMarkerIcon } from '@utils';

interface MapProps {
  items: (ExtendedItem | Street)[];
  selectedItem: ExtendedItem | Street | null;
  onItemSelect: (item: ExtendedItem | Street) => void;
  onAuthAction: () => void;
  onGetRoute: (coordinates: { lat: number; lng: number }) => void;
  data: any;
}

export const Map: React.FC<MapProps> = ({
  items,
  selectedItem,
  onItemSelect,
  onAuthAction,
  onGetRoute,
  data,
}) => {
  const mapRef = useRef(null);

  const createMarker = (item: ExtendedItem | Street) => {
    if ('coordinates' in item && Array.isArray(item.coordinates)) {
      const center = calculateStreetCenter(item.coordinates);
      return (
        <React.Fragment key={item.name}>
          <Marker
            position={[center.lat, center.lng]}
            icon={getMarkerIcon(item)}
            eventHandlers={{
              click: () => onItemSelect(item),
            }}
          >
            <Popup>
              <PopupContent
                item={item}
                onAuthAction={onAuthAction}
                onGetRoute={onGetRoute}
                data={data}
              />
            </Popup>
          </Marker>
          <Polyline
            positions={item.coordinates.map((coord: MapCoordinates) => [
              coord.lat,
              coord.lng,
            ])}
            color="#3388ff"
            weight={3}
            opacity={0.7}
          />
        </React.Fragment>
      );
    }
    return null;
  };

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        ref={mapRef}
        center={[52.4242, 30.9873]}
        zoom={13}
        className={styles.map}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {items.map(createMarker)}
      </MapContainer>
    </div>
  );
};
