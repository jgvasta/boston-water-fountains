// Replace with your Apps Script URL
const GEOJSON_URL = "https://script.google.com/macros/s/AKfycbwaKTk--r3ZhxQBQSvNwGzz3HZRIy2N2HYBb3DN8zhLpX6LTlCdUqfwEtnfSJBy2lt8/exec";

// Initialize the map (center will be updated automatically)
const map = L.map('map');

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fetch GeoJSON data
fetch(GEOJSON_URL)
  .then(response => response.json())
  .then(data => {
    // Create a GeoJSON layer with styled circle markers
    const geoJsonLayer = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "#1f78b4",  // blue for fountains
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function(feature, layer) {
        // Create popup content from all properties
        let popupContent = "";
        for (let key in feature.properties) {
          popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
        }
        layer.bindPopup(popupContent);
      }
    }).addTo(map);

    // Fit map to bounds of all points
    map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });
  })
  .catch(error => {
    console.error("Error loading GeoJSON:", error);
    // Optional: set a default view if fetch fails
    map.setView([42.3601, -71.0589], 13); // Boston
  });
