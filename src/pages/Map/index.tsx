import React, { useEffect, useState, JSX } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import L from 'leaflet';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
});

L.Marker.prototype.options.icon = DefaultIcon;

// Map Component
const MapComponent = () => {
  const [data, setData] = useState<Data | null>(null);
  const position: [number, number] = [52.4242, 31.014]; // Gomel coordinates

  // Fetch data from data.json
  useEffect(() => {
    fetch('/data.json') // Correct the path
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Function to render markers for a specific category
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

  const renderMarkers = (category: string): JSX.Element[] | null => {
    if (!data || !data.categories[category]) return null;

    return data.categories[category].map((item: Item, index: number) => {
      const coordinates: [number, number] = item.coordinates
        ? (item.coordinates
            .split(',')
            .map(coord => parseFloat(coord.trim())) as [number, number])
        : [52.4242, 31.014]; // Default coordinates if none provided

      return (
        <Marker key={index} position={coordinates}>
          {/* Add Tooltip to show the name above the marker */}
          <Popup>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '100%', height: 'auto' }}
              />
            )}
            {item.links?.read_more && (
              <a
                href={item.links.read_more}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read More
              </a>
            )}
          </Popup>

          {/* Tooltip will display the name above the marker */}
          <Tooltip>{item.name}</Tooltip>
        </Marker>
      );
    });
  };

  return (
    <MapContainer
      center={position}
      zoom={7}
      style={{ height: '100vh', width: '100%' }}
    >
      {/* Add a tile layer (map background) */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render markers for each category */}
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
// Left Menu Component
const LeftMenu = () => {
  return (
    <div style={styles.leftMenu}>
      <h2>Menu</h2>
      <nav>
        <ul style={styles.navList}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/museums">Museums</Link>
          </li>
          <li>
            <Link to="/cultural-values">Cultural Values</Link>
          </li>
          <li>
            <Link to="/ancient-cities">Ancient Cities</Link>
          </li>
          <li>
            <Link to="/famous-people">Famous People</Link>
          </li>
          <li>
            <Link to="/industry">Industry</Link>
          </li>
          <li>
            <Link to="/lakes">Lakes</Link>
          </li>
          <li>
            <Link to="/rivers">Rivers</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

// Main Layout Component
export const Map = () => {
  return (
    <div style={styles.container}>
      <LeftMenu />
      <div style={styles.mapContainer}>
        <MapComponent />
      </div>
    </div>
  );
};

// App Component with Routing
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/museums" element={<Map />} />
        <Route path="/cultural-values" element={<Map />} />
        <Route path="/ancient-cities" element={<Map />} />
        <Route path="/famous-people" element={<Map />} />
        <Route path="/industry" element={<Map />} />
        <Route path="/lakes" element={<Map />} />
        <Route path="/rivers" element={<Map />} />
      </Routes>
    </Router>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  leftMenu: {
    width: '10%',
    backgroundColor: '#f4f4f4',
    padding: '10px',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
  },
  mapContainer: {
    width: '90%',
    height: '100vh',
  },
};
