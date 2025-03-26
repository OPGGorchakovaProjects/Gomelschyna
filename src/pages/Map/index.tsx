import { useEffect, useState, JSX, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';

declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
  }
}

import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import { useSearchParams } from 'react-router-dom';
import { Typography } from '@components';
import { Header } from '@modules';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';
import { Data, Item } from '@utils';

const categoryColors: { [key: string]: string } = {
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

const getIcon = (category: string) => {
  return L.divIcon({
    html: `<div class="${styles.markerIcon}" style="background-color: ${categoryColors[category]};"></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
    tooltipAnchor: [10, -10],
  });
};

const createClusterCustomIcon = function (cluster: any) {
  const count = cluster.getChildCount();
  let className = 'cluster-small';

  if (count > 50) {
    className = 'cluster-large';
  } else if (count > 20) {
    className = 'cluster-medium';
  }
};

export const Map = () => {
  const [data, setData] = useState<Data | null>(null);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const [routingControl, setRoutingControl] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );

  const getUserLocation = (destinationCoords: [number, number]) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          createRoute([latitude, longitude], destinationCoords);
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

  const createRoute = (from: [number, number], to: [number, number]) => {
    if (mapRef.current) {
      if (routingControl) {
        mapRef.current.removeControl(routingControl);
      }

      const control = L.Routing.control({
        waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
        routeWhileDragging: false,
        lineOptions: {
          styles: [{ color: '#007bff', weight: 4 }],
        },
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
      }).addTo(mapRef.current);

      setRoutingControl(control);
    }
  };

  const clearRoute = () => {
    if (routingControl && mapRef.current) {
      mapRef.current.removeControl(routingControl);
      setRoutingControl(null);
      setUserLocation(null);
    }
  };

  useEffect(() => {
    const selected = searchParams.get('selected');
    if (selected) {
      setSelectedMarker(selected);
      setTimeout(() => {
        setSelectedMarker(null);
      }, 1500);
    }
  }, [searchParams]);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);

        if (selectedMarker) {
          for (const [category, items] of Object.entries(
            jsonData.categories as Record<string, Item[]>,
          )) {
            if (items.some(item => item.map_marker === selectedMarker)) {
              setActiveCategories([category]);

              const item = items.find(i => i.map_marker === selectedMarker);
              if (item?.coordinates && mapRef.current) {
                const [lat, lng] = item.coordinates
                  .split(',')
                  .map(coord => parseFloat(coord.trim()));
                mapRef.current.setView([lat, lng], 13);
              }
              break;
            }
          }
        }
      })
      .catch(error => console.error('Error:', error));
  }, [selectedMarker]);

  const renderMarkers = (category: string): JSX.Element[] | null => {
    if (!data?.categories[category] || !activeCategories.includes(category)) {
      return null;
    }

    return data.categories[category]
      .filter((item: Item) =>
        selectedMarker ? item.map_marker === selectedMarker : true,
      )
      .map((item: Item, index: number) => {
        const coordinates: [number, number] = item.coordinates
          ? (item.coordinates
              .split(',')
              .map(coord => parseFloat(coord.trim())) as [number, number])
          : [52.4242, 31.014];

        return (
          <Marker key={index} position={coordinates} icon={getIcon(category)}>
            <Popup>
              <h3 className={styles.title}>{item.name}</h3>
              <Typography
                className={styles.description}
                text={item.description}
                limit={400}
              />
              <div className={styles.buttonContainer}>
                <Link
                  className={styles.link}
                  to={`/information?category=${category}&item=${item.map_marker}`}
                >
                  Читать дальше
                </Link>
                <button
                  className={styles.routeButton}
                  onClick={e => {
                    e.preventDefault();
                    getUserLocation(coordinates);
                  }}
                >
                  Проложить маршрут
                </button>
              </div>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.image}
                />
              )}
              {item.links?.read_more && (
                <a href={item.links?.read_more}>Больше информации</a>
              )}
            </Popup>
            <Tooltip>{item.name}</Tooltip>
          </Marker>
        );
      });
  };

  return (
    <div className={styles.container}>
      <Header
        activeCategories={activeCategories}
        setActiveCategories={setActiveCategories}
        hasRoute={!!routingControl}
        onClearRoute={clearRoute}
      />
      <div className={styles.mapWrapper}>
        <MapContainer
          ref={mapRef}
          center={[52.4242, 31.014]}
          zoom={8}
          className={styles.mapContainer}
          attributionControl={false}
          zoomControl={false}
          maxBounds={[
            [50.5, 26.5],
            [54.0, 32.0],
          ]}
          minZoom={5}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            showCoverageOnHover={false}
            maxClusterRadius={100}
            animate={true}
            animateAddingMarkers={true}
            disableClusteringAtZoom={13}
            spiderLegPolylineOptions={{ opacity: 0 }}
            spiderfyOnMaxZoom={false}
            zoomToBoundsOnClick={true}
          >
            {data &&
              Object.keys(categoryColors).map(category =>
                renderMarkers(category),
              )}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};
