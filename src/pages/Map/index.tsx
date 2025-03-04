import React, { useEffect, useState, JSX } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { NavMenu, Typography } from '@components';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { example } from '@assets';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [20, 33],
  iconAnchor: [10, 33],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Item {
  name: string;
  description: string;
  coordinates?: string;
  image?: string;
  links?: {
    read_more?: string;
  };
}

interface Data {
  categories: {
    [key: string]: Item[];
  };
}

const MapComponent = () => {
  const [data, setData] = useState<Data | null>(null);

  const position: [number, number] = [52.4242, 31.014];

  useEffect(() => {
    fetch('/data.json') // Убедись, что путь правильный
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setData(json);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, []);

  const renderMarkers = (category: string): JSX.Element[] | null => {
    if (!data || !data.categories[category]) return null;

    return data.categories[category].map((item: Item, index: number) => {
      const coordinates: [number, number] = item.coordinates
        ? (item.coordinates
            .split(',')
            .map(coord => parseFloat(coord.trim())) as [number, number])
        : [52.4242, 31.014];

      return (
        <Marker key={index} position={coordinates}>
          <Popup>
            <h3 style={styles.title}>{item.name}</h3>
            <Typography
              style={styles.description}
              text={item.description}
              limit={400}
            />
            <Typography style={styles.link} text="Читать дальше " />
            {item.image && (
              <img src={example} alt={item.name} style={styles.image} />
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
          <Tooltip>{item.name}</Tooltip>
        </Marker>
      );
    });
  };

  return (
    <MapContainer
      center={position}
      zoom={8}
      style={styles.mapContainer}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {data && (
        <>
          {renderMarkers('museums')}
          {renderMarkers('cultural_values')}
          {renderMarkers('ancient_cities')}
          {renderMarkers('famous_people')}
          {renderMarkers('industry')}
          {renderMarkers('lakes')}
          {renderMarkers('rivers')}
        </>
      )}
    </MapContainer>
  );
};

export const Map = () => {
  type menuType = 'left' | 'top';
  const menuType: menuType = 'top';

  return (
    <div style={styles.container}>
      <NavMenu type={menuType} />
      <div style={styles.mapWrapper}>
        <MapComponent />
      </div>
    </div>
  );
};

import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
  },
  mapWrapper: {
    height: '100%',
    width: '100%',
  },
  mapContainer: {
    height: '100%',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  description: {
    textAlign: 'justify',
    textIndent: '1.5em',
    fontSize: 15,
  },
  link: {
    color: 'blue',
    fontSize: 14,
    textDecoration: 'underline',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
};
