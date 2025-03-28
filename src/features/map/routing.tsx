import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { IconMapPinFilled, IconUserCircle } from '@tabler/icons-react';
import { IRoutingControlProps, MapCoordinates } from '@utils';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import styles from '../../pages/Map/style.module.scss';

declare module 'leaflet' {
  namespace Routing {
    interface Control extends L.Control {
      addTo(map: L.Map): this;
      remove(): this;
      getContainer(): HTMLElement;
      onAdd(map: L.Map): HTMLElement;
      onRemove(map: L.Map): void;
      getPosition(): L.ControlPosition;
      setPosition(position: L.ControlPosition): this;
      options: any;
    }
    function control(options?: any): Control;
  }
}

export const createCustomIcon = (isUser: boolean = false) => {
  return L.divIcon({
    html: `<div class="${styles.customIcon}" style="background-color: ${isUser ? '#007bff' : '#dc3545'}">
            ${isUser ? IconUserCircle : IconMapPinFilled}
          </div>`,
    className: styles.iconWrapper,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

export const createRoute = (
  map: L.Map,
  from: MapCoordinates,
  to: MapCoordinates,
  existingControl?: L.Routing.Control,
) => {
  if (existingControl) {
    map.removeControl(existingControl);
  }

  const control = L.Routing.control({
    waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
    routeWhileDragging: false,
    lineOptions: {
      styles: [{ color: '#007bff', weight: 4 }],
      extendToWaypoints: true,
      missingRouteTolerance: 0,
    },
    show: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    showAlternatives: false,
    createMarker: function (i: number, waypoint: any, n: number) {
      const marker = L.marker(waypoint.latLng, {
        icon: L.divIcon({
          className:
            i === 0 ? 'leaflet-routing-icon-start' : 'leaflet-routing-icon-end',
          iconSize: [20, 20],
        }),
      });
      return marker;
    },
  }).addTo(map);

  return control;
};

export const getUserLocation = (
  destinationCoords: MapCoordinates,
  setUserLocation: (location: MapCoordinates) => void,
  createRouteCallback: (from: MapCoordinates, to: MapCoordinates) => void,
) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        createRouteCallback([latitude, longitude], destinationCoords);
      },
      error => {
        console.error('Error getting user location:', error);
        alert('Не удалось получить ваше местоположение');
      },
    );
  } else {
    alert('Геолокация не поддерживается вашим браузером');
  }
};

export const clearRoute = (
  map: L.Map,
  routingControl: L.Routing.Control | null,
  setRoutingControl: (control: L.Routing.Control | null) => void,
  setUserLocation: (location: MapCoordinates | null) => void,
) => {
  if (routingControl) {
    map.removeControl(routingControl);
    setRoutingControl(null);
    setUserLocation(null);
  }
};

export const RoutingControl = ({
  userLocation,
  destination,
  onRouteCreated,
}: IRoutingControlProps) => {
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
      routeWhileDragging: false,
      lineOptions: {
        styles: [{ color: '#007bff', weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: (i: number, waypoint: any) => {
        return L.marker(waypoint.latLng, {
          icon: createCustomIcon(i === 0),
        });
      },
    }).addTo(map);

    if (onRouteCreated) {
      onRouteCreated();
    }

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, userLocation, destination, onRouteCreated]);

  return null;
};
