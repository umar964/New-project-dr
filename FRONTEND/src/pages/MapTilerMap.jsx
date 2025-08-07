import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

// Fix Leaflet icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const SearchControl = ({ setPosition }) => {
  const map = useMapEvents({});
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      showMarker: true,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: 'Enter address',
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (result) => {
      const { x: lng, y: lat } = result.location;
      setPosition([lat, lng]);
    });

    return () => map.removeControl(searchControl);
  }, [map, setPosition]);

  return null;
};

const MapTilerMap = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([32.58, 74.08]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const coords = [e.latlng.lat, e.latlng.lng];
        setPosition(coords);
      },
    });
    return null;
  };

  const handleSelectLocation = () => {
    onLocationSelect([position[1], position[0]]); // [lng, lat]
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '400px' }}>
        <MapContainer center={position} zoom={13} style={{ height: '100%' }}>
          <TileLayer
            url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=eWWWZZDwAmsZNObY1poi"
            attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>'
          />
          <Marker position={position} />
          <MapClickHandler />
          <SearchControl setPosition={setPosition} />
        </MapContainer>
      </div>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button
          onClick={handleSelectLocation}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Select This Location
        </button>
      </div>
    </div>
  );
};

export default MapTilerMap;



 
