import React, { useEffect, useState, JSX, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polygon,
  Polyline,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Typography } from '@components';
import { Header } from '@modules';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';
import {
  Data,
  Item,
  categoryColors,
  getIcon,
  createCustomIcon,
  createClusterCustomIcon,
  Street,
  StreetsData,
  IMapProps,
  IMarkerProps,
  IPolygonProps,
  IClusterIconProps,
  MapCoordinates,
  MapBounds,
  CategoryKey,
  IconSize,
  parseCoordinates,
} from '@utils';
import streetsData from '../../../public/streets.json';

declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
  }
}

import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Добавляем функцию для вычисления центра улицы
const calculateStreetCenter = (
  coordinates: MapCoordinates[],
): MapCoordinates => {
  if (coordinates.length === 0) return [52.4242, 31.014];

  // Находим среднюю точку между всеми координатами
  const sum = coordinates.reduce(
    (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
    [0, 0],
  );

  return [
    sum[0] / coordinates.length,
    sum[1] / coordinates.length,
  ] as MapCoordinates;
};

export const Map = () => {
  const [data, setData] = useState<Data | null>(null);
  const [activeCategories, setActiveCategories] = useState<CategoryKey[]>([]);
  const [searchParams] = useSearchParams();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const mapRef = useRef<L.Map>(null);
  const [routingControl, setRoutingControl] = useState<any>(null);
  const [, setUserLocation] = useState<MapCoordinates | null>(null);
  const navigate = useNavigate();
  const [streets, setStreets] = useState<Street[]>([]);

  const getUserLocation = (destinationCoords: MapCoordinates) => {
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

  const createRoute = (from: MapCoordinates, to: MapCoordinates) => {
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
              setActiveCategories([category as CategoryKey]);

              const item = items.find(i => i.map_marker === selectedMarker);
              if (item?.coordinates && mapRef.current) {
                const coordinates = Array.isArray(item.coordinates)
                  ? (item.coordinates[0] as MapCoordinates)
                  : ([52.4242, 31.014] as MapCoordinates);
                mapRef.current.setView(coordinates, 13);
              }
              break;
            }
          }
        }
      })
      .catch(error => console.error('Error:', error));
  }, [selectedMarker]);

  useEffect(() => {
    if (streetsData?.categories?.streets) {
      const formattedStreets = (
        streetsData as unknown as StreetsData
      ).categories.streets.map(street => {
        const formattedStreet = {
          ...street,
          coordinates: street.coordinates.map(coord => {
            // Меняем порядок координат с [longitude, latitude] на [latitude, longitude]
            return [coord[1], coord[0]] as MapCoordinates;
          }),
          center: calculateStreetCenter(
            street.coordinates.map(
              coord => [coord[1], coord[0]] as MapCoordinates,
            ),
          ),
        };
        return formattedStreet;
      });
      setStreets(formattedStreets);
    }
  }, []);

  useEffect(() => {
    console.log('Active categories:', activeCategories);
    console.log('Current streets state:', streets);
    console.log(
      'Is streets category active:',
      activeCategories.includes('streets'),
    );
    console.log('Number of streets:', streets.length);
  }, [activeCategories, streets]);

  const renderMarkers = (category: CategoryKey): JSX.Element[] | null => {
    if (category === 'streets') {
      if (!activeCategories.includes('streets') || streets.length === 0) {
        return null;
      }
      return streets.map((street, index) => {
        const markerPosition = street.center;
        const linePositions = street.coordinates;

        return (
          <React.Fragment key={street.map_marker}>
            <Marker
              position={markerPosition}
              icon={createCustomIcon('streets')}
            >
              <Popup>
                <h3 className={styles.title}>{street.name}</h3>
                <Typography
                  className={styles.description}
                  text={street.description}
                  limit={400}
                />
                <div className={styles.buttonContainer}>
                  <Link
                    className={styles.link}
                    to={`/information?marker=${street.map_marker}`}
                  >
                    Читать дальше
                  </Link>
                  <button
                    className={styles.routeButton}
                    onClick={e => {
                      e.preventDefault();
                      getUserLocation(markerPosition);
                    }}
                  >
                    Проложить маршрут
                  </button>
                </div>
                {street.image && (
                  <img
                    src={street.image}
                    alt={street.name}
                    className={styles.image}
                  />
                )}
                {street.links?.read_more && (
                  <a href={street.links?.read_more}>Больше информации</a>
                )}
                <Tooltip>{street.name}</Tooltip>
              </Popup>
            </Marker>
            <Polyline
              positions={linePositions}
              pathOptions={{
                color: '#FF0000',
                weight: 5,
                opacity: 1,
                className: styles.streetLine,
              }}
              eventHandlers={{
                click: () => {
                  if (mapRef.current) {
                    const bounds = L.latLngBounds(linePositions);
                    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
                  }
                },
              }}
            />
          </React.Fragment>
        );
      });
    }

    if (
      !data?.categories[category] ||
      !activeCategories.includes(category as CategoryKey)
    ) {
      return null;
    }

    return data.categories[category]
      .filter((item: Item) =>
        selectedMarker ? item.map_marker === selectedMarker : true,
      )
      .map((item: Item, index: number) => {
        let coordinates: MapCoordinates;
        if (item.coordinates) {
          if (typeof item.coordinates === 'string') {
            coordinates = parseCoordinates(item.coordinates);
          } else if (
            Array.isArray(item.coordinates) &&
            item.coordinates.length > 0
          ) {
            coordinates = parseCoordinates(item.coordinates[0]);
          } else {
            coordinates = [52.4242, 31.014];
          }
        } else {
          coordinates = [52.4242, 31.014];
        }

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

  const mapProps: IMapProps = {
    ref: mapRef as React.RefObject<L.Map>,
    center: [52.4242, 31.014] as MapCoordinates,
    zoom: 8,
    className: styles.mapContainer,
    attributionControl: false,
    zoomControl: false,
    maxBounds: [
      [50.5, 26.5],
      [54.0, 32.0],
    ] as MapBounds,
    minZoom: 5,
  };

  const markerProps: IMarkerProps = {
    position: [52.4242, 31.014] as MapCoordinates,
    icon: createCustomIcon('streets') as L.Icon,
    children: null,
  };

  const polygonProps: IPolygonProps = {
    positions: [] as L.LatLngExpression[],
    pathOptions: {
      color: categoryColors.streets,
      weight: 3,
      opacity: 0.8,
      fillOpacity: 0.2,
      dashArray: '5, 5',
      className: styles.streetLine,
    },
  };

  const clusterIconProps: IClusterIconProps = {
    cluster: {
      getChildCount: () => 0,
    },
    options: {
      iconSize: [40, 40] as IconSize,
    },
  };

  return (
    <div className={styles.container}>
      <Header
        activeCategories={activeCategories}
        setActiveCategories={(categories: CategoryKey[]) => {
          console.log('Setting active categories:', categories);
          setActiveCategories(categories);
        }}
        hasRoute={!!routingControl}
        onClearRoute={clearRoute}
      />
      <div className={styles.mapWrapper}>
        <MapContainer {...mapProps}>
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
              Object.keys(categoryColors)
                .filter(category => category !== 'streets')
                .map(category => renderMarkers(category as CategoryKey))}
          </MarkerClusterGroup>
          {activeCategories.includes('streets') && streets.length > 0 && (
            <>
              {streets.map((street, index) => {
                console.log(
                  'Rendering street:',
                  street.name,
                  street.coordinates,
                );
                const markerPosition = street.center;
                const linePositions = street.coordinates;

                return (
                  <React.Fragment key={street.map_marker}>
                    <Marker
                      position={markerPosition}
                      icon={createCustomIcon('streets')}
                    >
                      <Popup>
                        <h3 className={styles.title}>{street.name}</h3>
                        <Typography
                          className={styles.description}
                          text={street.description}
                          limit={400}
                        />
                        <div className={styles.buttonContainer}>
                          <Link
                            className={styles.link}
                            to={`/information?marker=${street.map_marker}`}
                          >
                            Читать дальше
                          </Link>
                          <button
                            className={styles.routeButton}
                            onClick={e => {
                              e.preventDefault();
                              getUserLocation(markerPosition);
                            }}
                          >
                            Проложить маршрут
                          </button>
                        </div>
                        {street.image && (
                          <img
                            src={street.image}
                            alt={street.name}
                            className={styles.image}
                          />
                        )}
                        {street.links?.read_more && (
                          <a href={street.links?.read_more}>
                            Больше информации
                          </a>
                        )}
                        <Tooltip>{street.name}</Tooltip>
                      </Popup>
                    </Marker>
                    <Polyline
                      positions={linePositions}
                      pathOptions={{
                        color: '#FF0000',
                        weight: 5,
                        opacity: 1,
                        className: styles.streetLine,
                      }}
                      eventHandlers={{
                        click: () => {
                          if (mapRef.current) {
                            const bounds = L.latLngBounds(linePositions);
                            mapRef.current.fitBounds(bounds, {
                              padding: [50, 50],
                            });
                          }
                        },
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};
