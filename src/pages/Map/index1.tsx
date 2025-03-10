import React, { CSSProperties, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { NavMenu, Typography } from '@components';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
});
L.Marker.prototype.options.icon = DefaultIcon;

const position: [number, number] = [52.4242, 31.014];

const fetchData = async () => {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(
      err instanceof Error ? err.message : 'An unknown error occurred',
    );
    return null;
  }
};

interface Data {
  categories: {
    [key: string]: {
      coordinates: string;
      name: string;
      description: string;
      image?: string;
      links?: {
        read_more?: string;
      };
    }[];
  };
}

const MapComponent = ({ data }: { data: Data | null }) => {
  if (!data || !data.categories) return null;

  const renderMarkers = () => {
    return Object.values(data.categories)
      .flat()
      .map((item, index) => {
        const coordinates = item.coordinates
          ? (item.coordinates
              .split(',')
              .map(coord => parseFloat(coord.trim())) as [number, number])
          : position;

        if (
          !Array.isArray(coordinates) ||
          coordinates.length !== 2 ||
          coordinates.some(isNaN)
        ) {
          return null;
        }

        return (
          <Marker key={index} position={coordinates}>
            <Popup>
              <h3 style={styles.title}>{item.name}</h3>
              <Typography
                style={styles.description}
                text={item.description}
                limit={400}
              />
              {item.image && (
                <img src={item.image} alt={item.name} style={styles.image} />
              )}
              {item.links?.read_more && (
                <a
                  href={item.links.read_more}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  Больше информации
                </a>
              )}
            </Popup>
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
              {item.name}
            </Tooltip>
          </Marker>
        );
      })
      .filter(Boolean);
  };

  return (
    <MapContainer
      center={position}
      style={styles.mapContainer}
      zoom={8}
      minZoom={5}
      maxZoom={18}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={(cluster: any) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div style="background: rgba(0, 123, 255, 0.8); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">${count}</div>`,
            className: '',
            iconSize: [30, 30],
          });
        }}
      >
        {renderMarkers()}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export const Map = () => {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return (
    <div style={styles.container}>
      <NavMenu type="top" />
      <div style={styles.mapWrapper}>
        <MapComponent data={data} />
      </div>
      <Link style={styles.backButton} to="/">
        Назад
      </Link>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
  mapWrapper: { height: '100%', width: '100%' },
  mapContainer: { height: '100%', width: '100%' },
  title: { textAlign: 'center', fontWeight: 'bold', fontSize: 18 },
  description: { textAlign: 'justify', textIndent: '1.5em', fontSize: 15 },
  link: { color: 'blue', fontSize: 14, textDecoration: 'underline' },
  image: { width: '100%', height: 'auto' },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: 'white',
    padding: 10,
    backgroundColor: 'blue',
    zIndex: 999,
  },
};
