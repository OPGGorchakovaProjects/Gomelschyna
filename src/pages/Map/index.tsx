import { useEffect, useState, JSX, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSearchParams } from 'react-router-dom';

import { Typography } from '@components';
import { NavMenu } from '@modules';
import { Link } from 'react-router-dom';

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
    html: `<div style="background-color: ${categoryColors[category]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
    tooltipAnchor: [10, -10],
  });
};

interface Item {
  name: string;
  description: string;
  coordinates?: string;
  image?: string;
  links?: {
    read_more?: string;
  };
  map_marker: string;
}

interface Data {
  categories: {
    [key: string]: Item[];
  };
}

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
              <h3 style={styles.title}>{item.name}</h3>
              <Typography
                style={styles.description}
                text={item.description}
                limit={400}
              />
              <Link
                style={styles.link}
                to={`/information?category=${category}&item=${item.map_marker}#${item.map_marker}`}
              >
                Читать дальше
              </Link>
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
    <div style={styles.container}>
      <NavMenu
        activeCategories={activeCategories}
        setActiveCategories={setActiveCategories}
        onCategorySelect={() => setSelectedPoint(null)}
      />
      <div style={styles.mapWrapper}>
        <MapContainer
          ref={mapRef}
          center={[52.4242, 31.014]}
          zoom={8}
          style={styles.mapContainer}
          attributionControl={false}
          zoomControl={false}
          maxBounds={[
            [50.5, 26.5],
            [54.0, 32.0],
          ]}
          minZoom={5}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {data &&
            Object.keys(categoryColors).map(category =>
              renderMarkers(category),
            )}
        </MapContainer>
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
    fontSize: 20,
    marginBottom: '10px',
    color: '#333',
  },
  description: {
    textAlign: 'justify',
    fontSize: 15,
    color: '#555',
    marginBottom: '10px',
    hyphens: 'auto',
    wordWrap: 'normal',
    textJustify: 'auto',
    textIndent: '1.5em',
    lineHeight: 1.4,
    textAlignLast: 'left',
    maxWidth: '100%',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  popup: {
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  link: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};
