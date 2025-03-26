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
import { man, mapPin } from '@assets';

// Создание кастомных иконок через <i>
const createCustomIcon = (className: string, size: number = 40) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<i class="${className}" style="font-size:${size}px;"></i>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
};

const RoutingControl = ({ userLocation, destination, onRouteCreated }: any) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!userLocation || !destination) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    if (!L.Routing) {
      console.error('Leaflet Routing Machine не загружен.');
      return;
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(userLocation), L.latLng(destination)],
      routeWhileDragging: true,
      lineOptions: { styles: [{ color: '#007bff', weight: 4 }] },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    onRouteCreated();

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [userLocation, destination, map, onRouteCreated]);

  return null;
};

const MapEvents = ({
  onMapClick,
}: {
  onMapClick: (e: L.LeafletMouseEvent) => void;
}) => {
  useMapEvents({ click: onMapClick });
  return null;
};

export const Navigation = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [hasRoute, setHasRoute] = useState(false);

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position =>
        setUserLocation([position.coords.latitude, position.coords.longitude]),
      error => {
        console.error('Ошибка получения местоположения:', error);
        alert('Не удалось получить ваше местоположение');
      },
      { enableHighAccuracy: true },
    );
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    setDestination([e.latlng.lat, e.latlng.lng]);
  };

  const handleClearRoute = () => {
    setUserLocation(null);
    setDestination(null);
    setHasRoute(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button className={styles.locationButton} onClick={handleGetLocation}>
          Моё местоположение
        </button>
        {hasRoute && (
          <button className={styles.clearButton} onClick={handleClearRoute}>
            Очистить маршрут
          </button>
        )}
      </div>

      <MapContainer center={[52.4242, 31.014]} zoom={8} className={styles.map}>
        <MapEvents onMapClick={handleMapClick} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && (
          <Marker
            position={userLocation}
            icon={createCustomIcon('ti ti-man', 40)}
          >
            <Popup>Вы здесь</Popup>
            <Tooltip>Вы здесь</Tooltip>
          </Marker>
        )}

        {destination && (
          <Marker
            position={destination}
            icon={createCustomIcon('ti ti-map-pin-down', 40)}
          >
            <Popup>Пункт назначения</Popup>
            <Tooltip>Пункт назначения</Tooltip>
          </Marker>
        )}

        {userLocation && destination && (
          <RoutingControl
            userLocation={userLocation}
            destination={destination}
            onRouteCreated={() => setHasRoute(true)}
          />
        )}
      </MapContainer>
    </div>
  );
};
