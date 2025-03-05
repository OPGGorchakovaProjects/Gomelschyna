import React, { useEffect, useState, JSX } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { Typography } from '@components';
import { NavMenu, Navigation } from '@modules';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Link } from 'react-router-dom';

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

const MapComponent = ({ activeCategories }: { activeCategories: string[] }) => {
  const [data, setData] = useState<Data | null>(null);

  const position: [number, number] = [52.4242, 31.014];

  useEffect(() => {
    fetch('/data.json')
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
    if (
      !data ||
      !data.categories[category] ||
      !activeCategories.includes(category)
    )
      return null;

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
          <Tooltip>{item.name}</Tooltip>
        </Marker>
      );
    });
  };

  return (
    <MapContainer
      center={position}
      style={styles.mapContainer}
      attributionControl={false}
      maxBounds={[
        [50.5, 26.5],
        [54.0, 32.0],
      ]}
      minZoom={5}
      zoom={8}
      zoomAnimation={true}
      fadeAnimation={true}
      zoomSnap={0.1}
      zoomDelta={0.1}
      trackResize={true}
      preferCanvas={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {data && (
        <>
          {renderMarkers('reserve')}
          {renderMarkers('monuments')}
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

const BackButton = () => {
  return (
    <Link
      style={{
        zIndex: 999,
        position: 'absolute',
        bottom: 20,
        left: 20,
        color: 'white',
        padding: 20,
        backgroundColor: 'blue',
      }}
      to="/"
    >
      Назад
    </Link>
  );
};

export const Map = () => {
  type menuType = 'left' | 'top';
  const menuType: menuType = 'top';
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  return (
    <div style={styles.container}>
      <NavMenu
        type={menuType}
        activeCategories={activeCategories}
        setActiveCategories={setActiveCategories}
      />
      <div style={styles.mapWrapper}>
        <MapComponent activeCategories={activeCategories} />
      </div>
      {/* <Navigation /> */}
      {/* <BackButton /> */}
    </div>
  );
};

import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    overflowX: 'hidden',
    overflowY: 'hidden',
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
