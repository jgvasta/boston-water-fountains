console.log("script loaded");

// Get geojson stream
const GEOJSON_URL = "https://script.google.com/macros/s/AKfycbwaKTk--r3ZhxQBQSvNwGzz3HZRIy2N2HYBb3DN8zhLpX6LTlCdUqfwEtnfSJBy2lt8/exec";

// Initialize the map with a default view (Boston)
const map = L.map('map').setView([42.3601, -71.0589], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Fetch GeoJSON data
fetch(GEOJSON_URL)
  .then(response => response.json()) // Convert response to json
  .then(data => {
    console.log("GeoJSON data loaded:", data);
    
    // Add GeoJSON layer to map
    const geoJsonLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 5,
          fillColor: "pink",
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup("<b>" + (feature.properties.name || "No name") + "</b>") // Display feature name in popup
      }).addTo(map);

    // Fit map to bounds of all points
    if (geoJsonLayer.getBounds().isValid()) {
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });
    }
  })
  .catch(err => console.error('Error loading GeoJSON:', err)); // Handle errors

    