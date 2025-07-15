import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';

// You must import the Leaflet CSS for it to work correctly
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue with webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// This part is needed to fix the default icon path issues with React
// @ts-ignore
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// --- Data for the Academies ---
const locations = [
  { name: "Cyclone Sports", position: { lat: 17.4020, lng: 78.4090 } },
  { name: "Leo 11", position: { lat: 17.4025, lng: 78.4095 } },
  { name: "Korner Kick", position: { lat: 17.3850, lng: 78.4200 } },
  { name: "One More Game", position: { lat: 17.4100, lng: 78.3800 } },
  { name: "Inplay", position: { lat: 17.4300, lng: 78.3900 } },
  { name: "HOS", position: { lat: 17.4320, lng: 78.3920 } },
  { name: "Infinity Sports Arena", position: { lat: 17.3700, lng: 78.4300 } },
  { name: "Mag Arena", position: { lat: 17.3720, lng: 78.4320 } },
  { name: "GR Arena", position: { lat: 17.3500, lng: 78.4500 } },
  { name: "Knockout Arena", position: { lat: 17.5000, lng: 78.4900 } },
  { name: "Olympians Arena", position: { lat: 17.4000, lng: 78.4400 } },
];

const AcademyMap: React.FC = () => {
  // Center of the map
  const mapCenter: LatLngExpression = [17.415, 78.43]; // Adjusted center for better view

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      padding: '2rem',
      boxSizing: 'border-box',
      background: '#f0f2f5'
    }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#333' }}>HLSSA Academies in the Area 🗺️</h1>
      <div style={{ height: '80%', width: '90%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
        <MapContainer
          center={mapCenter}
          zoom={12}
          scrollWheelZoom={false} // Recommended for better user experience on pages
          style={{ height: '100%', width: '100%' }}
        >
          {/* TileLayer provides the map imagery. OpenStreetMap is a free alternative. */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Map through the locations to create a Marker and a Popup for each one */}
          {locations.map((loc) => (
            <Marker key={loc.name} position={[loc.position.lat, loc.position.lng] as LatLngExpression}>
              <Popup>
                <strong style={{ fontSize: '1.1em' }}>{loc.name}</strong>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default AcademyMap;