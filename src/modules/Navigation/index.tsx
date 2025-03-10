import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Extend leaflet module to include Routing
declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
  }
}

let DefaultIcon = L.icon({
  iconUrl: L.Icon.Default.prototype.options.iconUrl || 'default-icon-url.png',
  shadowUrl:
    L.Icon.Default.prototype.options.shadowUrl || 'default-shadow-url.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
});
L.Marker.prototype.options.icon = DefaultIcon;

export const Navigation = () => {
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (map && start && end) {
      const routingControl = L.Routing.control({
        waypoints: [L.latLng(start), L.latLng(end)],
        routeWhileDragging: true,
      }).addTo(map);
      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [map, start, end]);

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setStart([position.coords.latitude, position.coords.longitude]);
      },
      error => console.error(error),
    );
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
          background: 'white',
          padding: 10,
        }}
      >
        <button onClick={handleUseCurrentLocation}>Use My Location</button>
        <button onClick={() => setStart([52.4242, 31.014])}>
          Set Start (Default)
        </button>
        <button onClick={() => setEnd([52.5242, 31.114])}>
          Set End (Example)
        </button>
      </div>
      <MapContainer
        center={[52.4242, 31.014]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => setMap(map)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {start && (
          <Marker position={start}>
            <Popup>Start Point</Popup>
          </Marker>
        )}
        {end && (
          <Marker position={end}>
            <Popup>End Point</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
