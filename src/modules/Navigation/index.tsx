import { JSX, useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import styles from './style.module.scss';
import { IconManFilled, IconFlag } from '@tabler/icons-react';
import { renderToStaticMarkup } from 'react-dom/server';

const createCustomIcon = (icon: JSX.Element, size: number = 40) => {
  return L.divIcon({
    className: 'custom-icon',
    html: renderToStaticMarkup(icon),
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
};

const RoutingControl = ({
  userLocation,
  destination,
}: {
  userLocation: [number, number];
  destination: [number, number];
}) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!userLocation || !destination) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1]),
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: '#007bff', weight: 4 }],
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);
  }, [userLocation, destination, map]);

  return null;
};

// Создаем новый компонент для обработки событий карты
const MapEvents = ({
  onMapClick,
}: {
  onMapClick: (e: L.LeafletMouseEvent) => void;
}) => {
  useMapEvents({
    click: onMapClick,
  });
  return null;
};

export const Navigation = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [destination, setDestination] = useState<[number, number] | null>(null);

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      error => console.error('Error getting location:', error),
      { enableHighAccuracy: true },
    );
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    setDestination([e.latlng.lat, e.latlng.lng]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button className={styles.locationButton} onClick={handleGetLocation}>
          Моё местоположение
        </button>
      </div>

      <MapContainer center={[52.4242, 31.014]} zoom={8} className={styles.map}>
        <MapEvents onMapClick={handleMapClick} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && (
          <Marker
            position={userLocation}
            icon={createCustomIcon(<IconManFilled size={24} color="blue" />)}
          >
            <Popup>Вы здесь</Popup>
            <Tooltip>Вы здесь</Tooltip>
          </Marker>
        )}

        {destination && (
          <Marker
            position={destination}
            icon={createCustomIcon(<IconFlag size={24} color="red" />)}
          >
            <Popup>Пункт назначения</Popup>
            <Tooltip>Пункт назначения</Tooltip>
          </Marker>
        )}

        {userLocation && destination && (
          <RoutingControl
            userLocation={userLocation}
            destination={destination}
          />
        )}
      </MapContainer>
    </div>
  );
};
