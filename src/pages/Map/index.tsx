import { useEffect, useState, JSX, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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

  return L.divIcon({
    html: `<div class="cluster-icon ${className}">${count}</div>`,
    className: 'custom-marker-cluster',
    iconSize: L.point(40, 40, true),
  });
};

export const Map = () => {
  const [data, setData] = useState<Data | null>(null);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const markerFromUrl = searchParams.get('marker');
    setSelectedPoint(markerFromUrl);
  }, [searchParams]);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);

        if (selectedPoint) {
          for (const [category, items] of Object.entries(
            jsonData.categories as Record<string, Item[]>,
          )) {
            if (items.some(item => item.map_marker === selectedPoint)) {
              setActiveCategories([category]);

              const item = items.find(i => i.map_marker === selectedPoint);
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
  }, [selectedPoint]);

  const renderMarkers = (category: string): JSX.Element[] | null => {
    if (!data?.categories[category] || !activeCategories.includes(category)) {
      return null;
    }

    return data.categories[category]
      .filter((item: Item) => {
        if (selectedPoint) {
          return item.map_marker === selectedPoint;
        }
        return true;
      })
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
              <Link
                className={styles.link}
                to={`/information?category=${category}&item=${item.map_marker}#${item.map_marker}`}
              >
                Читать дальше
              </Link>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.image}
                />
              )}
              {item.links?.read_more && (
                <a
                  href={item.links.read_more}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  Больше информации
                </a>
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
