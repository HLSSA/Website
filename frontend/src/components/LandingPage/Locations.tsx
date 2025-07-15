import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon, Popup as LeafletPopup } from 'leaflet';

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
interface Location {
  id: number;
  name: string;
  address: string;
  area: string;
  position: { lat: number; lng: number };
  mapsUrl: string;
}

const locations: Location[] = [
  { id: 1, name: "Cyclone Sports", address: "Tolichowki", area: "Tolichowki", position: { lat: 17.4020, lng: 78.4090 }, mapsUrl: "https://maps.app.goo.gl/oFM8qN3g4tG8N8pm7" },
  { id: 2, name: "Leo 11", address: "7 Tombs Road, Tolichowki", area: "Tolichowki", position: { lat: 17.4025, lng: 78.4095 }, mapsUrl: "https://maps.app.goo.gl/2LMtiz7EwqP2v2CP7" },
  { id: 3, name: "Korner Kick", address: "Alkhapur", area: "Alkhapur", position: { lat: 17.3850, lng: 78.4200 }, mapsUrl: "https://maps.app.goo.gl/VsuD29v43RF28UZQ7" },
  { id: 4, name: "One More Game", address: "Freedom Park, Manikonda", area: "Manikonda", position: { lat: 17.4100, lng: 78.3800 }, mapsUrl: "https://maps.app.goo.gl/MAPWXv6cx23GSGd6A" },
  { id: 5, name: "Inplay", address: "Bangla gudda Gagir, SunCity", area: "SunCity", position: { lat: 17.4300, lng: 78.3900 }, mapsUrl: "https://maps.app.goo.gl/ucrJ9ETc6f9QKzwL8" },
  { id: 6, name: "HOS", address: "SunCity", area: "SunCity", position: { lat: 17.4320, lng: 78.3920 }, mapsUrl: "https://maps.app.goo.gl/uhToaju6RZ7uPRn98" },
  { id: 7, name: "Infinity Sports Arena", address: "Attapur, Piller no 177", area: "Attapur", position: { lat: 17.3700, lng: 78.4300 }, mapsUrl: "https://maps.app.goo.gl/CrgJwRhkuGRYweoc9" },
  { id: 8, name: "Mag Arena", address: "Attapur, Piller no 210", area: "Attapur", position: { lat: 17.3720, lng: 78.4320 }, mapsUrl: "https://maps.app.goo.gl/QZMXfmLrUnrZnpf39" },
  { id: 9, name: "GR Arena", address: "Khilwat, Old City", area: "Old City", position: { lat: 17.3500, lng: 78.4500 }, mapsUrl: "https://maps.app.goo.gl/WumPqfrHVTzFDNRr8" },
  { id: 10, name: "Knockout Arena", address: "Alwal, Secunderabad", area: "Secunderabad", position: { lat: 17.5000, lng: 78.4900 }, mapsUrl: "https://maps.app.goo.gl/yV6kNcTJyoE69uru5" },
  { id: 11, name: "Olympians Arena", address: "Location TBD", area: "Hyderabad", position: { lat: 17.4000, lng: 78.4400 }, mapsUrl: "https://maps.app.goo.gl/MWz7N2oxbRfbMeFdA" },
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
            <Marker 
              key={loc.id} 
              position={[loc.position.lat, loc.position.lng] as LatLngExpression}
              eventHandlers={{
                mouseover: (e: any) => {
                  e.target.openPopup();
                },
                mouseout: (e: any) => {
                  e.target.closePopup();
                },
                click: () => {
                  window.open(loc.mapsUrl, '_blank');
                }
              }}
            >
              <Popup>
                <div style={{ padding: '1rem', maxWidth: '250px' }}>
                  <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{loc.name}</h3>
                  <p style={{ margin: '0.25rem 0' }}><strong>Address:</strong> {loc.address}</p>
                  <p style={{ margin: '0.25rem 0' }}><strong>Area:</strong> {loc.area}</p>
                  <button
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#facc15',
                      color: '#1e3a8a',
                      border: 'none',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(loc.mapsUrl, '_blank');
                    }}
                  >
                    View on Google Maps
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default AcademyMap;