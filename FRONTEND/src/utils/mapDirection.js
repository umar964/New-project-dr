import L from 'leaflet';
import 'leaflet-routing-machine';

let routingControl = null;
let animatedMarker = null;
let routeCoords = [];

// This function updates the moving marker based on live GPS
export const updateAnimatedMarkerPosition = (lat, lng) => {
  if (animatedMarker) {
    animatedMarker.setLatLng([lat, lng]);
  }
};

// This function renders the route on the map
export const showRouteOnMap = (map, startCoords, endCoords) => {
  if (routingControl) {
    map.removeControl(routingControl);
  }

  if (animatedMarker) {
    map.removeLayer(animatedMarker);
  }

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(startCoords.lat, startCoords.lng),
      L.latLng(endCoords.lat, endCoords.lng),
    ],
    routeWhileDragging: false,
    show: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    lineOptions: {
      styles: [{ color: '#007BFF', opacity: 1, weight: 5 }],
    },
    createMarker: (i, wp, n) => {
      return L.marker(wp.latLng, {
        icon: L.icon({
          iconUrl: i === 0
            ? 'https://cdn-icons-png.flaticon.com/512/684/684908.png'
            : 'https://cdn-icons-png.flaticon.com/512/535/535239.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      });
    },
  })
  .on('routesfound', function (e) {
    const route = e.routes[0];
    routeCoords = route.coordinates;

    // Place the animated marker initially
    animatedMarker = L.marker(routeCoords[0], {
      icon: L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }),
    }).addTo(map);
  })
  .addTo(map);
};

// This is your real-time GPS tracker — place this in the main file where map is initialized
export const startLiveTracking = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateAnimatedMarkerPosition(latitude, longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );
  } else {
    alert('Geolocation is not supported by your browser');
  }
};




