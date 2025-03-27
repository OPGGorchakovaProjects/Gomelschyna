import React, { useEffect, useState, JSX, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polygon,
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
} from '@utils';
import streetsData from '../../../public/streets.json';

declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
  }
}

import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

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

  useEffect(() => {
    console.log('Raw streets data:', streetsData);
    if (streetsData?.categories?.streets) {
      console.log('Streets array:', streetsData.categories.streets);
      const formattedStreets = (
        streetsData as StreetsData
      ).categories.streets.map(street => {
        console.log('Street before formatting:', street);
        const formattedStreet = {
          ...street,
          coordinates: street.coordinates.map(coord => {
            console.log('Coordinate before formatting:', coord);
            if (Array.isArray(coord) && coord.length === 2) {
              return coord as MapCoordinates;
            }
            return [52.4242, 31.014] as MapCoordinates;
          }),
        };
        console.log('Street after formatting:', formattedStreet);
        return formattedStreet;
      });
      console.log('All formatted streets:', formattedStreets);
      setStreets(formattedStreets);
    } else {
      console.log('No streets data found in streetsData:', streetsData);
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
        const markerPosition: MapCoordinates = street
          .coordinates[0] as MapCoordinates;
        const linePositions: MapCoordinates[] =
          street.coordinates as MapCoordinates[];

        return (
          <React.Fragment key={street.map_marker}>
            <Marker
              position={markerPosition}
              icon={createCustomIcon('streets')}
            >
              <Popup>
                <div className={styles.popupContent}>
                  <h3>{street.name}</h3>
                  <p>{street.description}</p>
                  <button
                    onClick={() =>
                      navigate(`/information?marker=${street.map_marker}`)
                    }
                    className={styles.readMoreButton}
                  >
                    Подробнее
                  </button>
                </div>
              </Popup>
            </Marker>
            <Polygon
              positions={linePositions}
              pathOptions={{
                color: categoryColors.streets,
                weight: 2,
                opacity: 0.3,
                fillOpacity: 0.2,
                className: styles.streetLine,
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
                    getUserLocation(coordinates as MapCoordinates);
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
                console.log('Rendering street:', street);
                const streetMarkerProps: IMarkerProps = {
                  ...markerProps,
                  position: street.coordinates[0] as MapCoordinates,
                  children: (
                    <Popup>
                      <div className={styles.popupContent}>
                        <h3>{street.name}</h3>
                        <p>{street.description}</p>
                        <button
                          onClick={() =>
                            navigate(`/information?marker=${street.map_marker}`)
                          }
                          className={styles.readMoreButton}
                        >
                          Подробнее
                        </button>
                      </div>
                    </Popup>
                  ),
                };

                const streetPolygonProps: IPolygonProps = {
                  ...polygonProps,
                  positions: street.coordinates as L.LatLngExpression[],
                };

                return (
                  <React.Fragment key={street.map_marker}>
                    <Marker {...streetMarkerProps} />
                    <Polygon {...streetPolygonProps} />
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
