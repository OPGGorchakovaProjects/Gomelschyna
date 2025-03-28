import React, { useEffect, useState, JSX, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Polyline,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import * as L from 'leaflet';
import { Typography } from '@components';
import { Header } from '@modules';
import * as utils from '@utils';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import streetsData from '../../../public/streets.json';
import styles from './style.module.scss';

declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
  }
}

const calculateStreetCenter = (
  coordinates: utils.MapCoordinates[],
): utils.MapCoordinates => {
  if (coordinates.length === 0) return [52.4242, 31.014];

  const sum = coordinates.reduce(
    (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
    [0, 0],
  );

  return [
    sum[0] / coordinates.length,
    sum[1] / coordinates.length,
  ] as utils.MapCoordinates;
};

export const Map = () => {
  const [data, setData] = useState<utils.Data | null>(null);
  const [activeCategories, setActiveCategories] = useState<utils.CategoryKey[]>(
    [],
  );
  const [searchParams] = useSearchParams();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const mapRef = useRef<L.Map>(null);
  const [routingControl, setRoutingControl] = useState<any>(null);
  const [, setUserLocation] = useState<utils.MapCoordinates | null>(null);
  const [streets, setStreets] = useState<utils.Street[]>([]);

  const getUserLocation = (destinationCoords: utils.MapCoordinates) => {
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

  const createRoute = (
    from: utils.MapCoordinates,
    to: utils.MapCoordinates,
  ) => {
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

    fetch('/data.json')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);

        if (selected) {
          for (const [category, items] of Object.entries(
            jsonData.categories as Record<string, utils.Item[]>,
          )) {
            if (items.some(item => item.map_marker === selected)) {
              setActiveCategories([category as utils.CategoryKey]);

              const item = items.find(i => i.map_marker === selected);
              if (item?.coordinates && mapRef.current) {
                const coordinates = Array.isArray(item.coordinates)
                  ? (item.coordinates[0] as utils.MapCoordinates)
                  : ([52.4242, 31.014] as utils.MapCoordinates);
                mapRef.current.setView(coordinates, 13);
              }
              break;
            }
          }
        }
      })
      .catch(error => console.error('Error:', error));
  }, [searchParams]);

  useEffect(() => {
    if (streetsData?.categories?.streets) {
      const formattedStreets = (
        streetsData as utils.StreetsData
      ).categories.streets.map(street => {
        const formattedCoordinates = street.coordinates.map(
          coord => [coord[1], coord[0]] as utils.MapCoordinates,
        );
        return {
          ...street,
          coordinates: formattedCoordinates,
          center: calculateStreetCenter(formattedCoordinates),
        };
      });
      setStreets(formattedStreets);
    }
  }, []);

  const renderPopup = (item: utils.Item | utils.Street) => (
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
          to={`/information?object=${item.map_marker}`}
        >
          Читать дальше
        </Link>
        <button
          className={styles.routeButton}
          onClick={e => {
            e.preventDefault();
            const coords =
              'center' in item && item.center
                ? item.center
                : Array.isArray(item.coordinates)
                  ? item.coordinates[0]
                  : utils.parseCoordinates(item.coordinates as string);
            getUserLocation(coords);
          }}
        >
          Проложить маршрут
        </button>
      </div>
      {item.image && (
        <img src={item.image} alt={item.name} className={styles.image} />
      )}
      {item.links?.read_more && (
        <a href={item.links?.read_more}>Больше информации</a>
      )}
      <Tooltip>{item.name}</Tooltip>
    </Popup>
  );

  const renderMarkers = (category: utils.CategoryKey): JSX.Element[] | null => {
    if (category === 'streets') {
      if (!activeCategories.includes('streets') || streets.length === 0) {
        return null;
      }
      return streets.map(street => {
        const markerPosition = (street.center || street.coordinates[0]) as [
          number,
          number,
        ];
        const linePositions = street.coordinates.map(
          coord => coord as [number, number],
        );

        return (
          <React.Fragment key={street.map_marker}>
            <Marker
              position={markerPosition}
              icon={utils.createCustomIcon('streets')}
            >
              {renderPopup(street)}
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
      !activeCategories.includes(category as utils.CategoryKey)
    ) {
      return null;
    }

    return data.categories[category]
      .filter((item: utils.Item) =>
        selectedMarker ? item.map_marker === selectedMarker : true,
      )
      .map((item: utils.Item, index: number) => {
        const coordinates = item.coordinates
          ? typeof item.coordinates === 'string'
            ? utils.parseCoordinates(item.coordinates)
            : Array.isArray(item.coordinates) && item.coordinates.length > 0
              ? utils.parseCoordinates(item.coordinates[0])
              : [52.4242, 31.014]
          : [52.4242, 31.014];

        return (
          <Marker
            key={index}
            position={coordinates as [number, number]}
            icon={utils.getIcon(category)}
          >
            {renderPopup(item)}
          </Marker>
        );
      });
  };

  const mapProps: utils.IMapProps = {
    ref: mapRef as React.RefObject<L.Map>,
    center: [52.4242, 31.014] as utils.MapCoordinates,
    zoom: 8,
    className: styles.mapContainer,
    attributionControl: false,
    zoomControl: false,
    maxBounds: [
      [50.5, 26.5],
      [54.0, 32.0],
    ] as utils.MapBounds,
    minZoom: 5,
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
        <MapContainer {...mapProps}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={utils.createClusterCustomIcon}
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
              Object.keys(utils.categoryColors)
                .filter(category => category !== 'streets')
                .map(category => renderMarkers(category as utils.CategoryKey))}
          </MarkerClusterGroup>
          {activeCategories.includes('streets') && streets.length > 0 && (
            <>
              {streets.map(street => {
                const markerPosition = street.center;
                const linePositions = street.coordinates;

                return (
                  <React.Fragment key={street.map_marker}>
                    {markerPosition && (
                      <Marker
                        position={markerPosition}
                        icon={utils.createCustomIcon('streets')}
                      >
                        {renderPopup(street)}
                      </Marker>
                    )}
                    <Polyline
                      positions={linePositions as L.LatLngExpression[]}
                      pathOptions={{
                        color: '#FF0000',
                        weight: 5,
                        opacity: 1,
                        className: styles.streetLine,
                      }}
                      eventHandlers={{
                        click: () => {
                          if (mapRef.current) {
                            const bounds = L.latLngBounds(
                              linePositions as L.LatLngExpression[],
                            );
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
