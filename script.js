// Get geojson stream
const GEOJSON_URL = "https://script.google.com/macros/s/AKfycbwaKTk--r3ZhxQBQSvNwGzz3HZRIy2N2HYBb3DN8zhLpX6LTlCdUqfwEtnfSJBy2lt8/exec";

// Initialize the map with a default view (Boston)
const map = L.map('map').setView([42.3601, -71.0589], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fetch GeoJSON data
fetch(GEOJSON_URL)
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then(data => {
    // Ensure GeoJSON has features
    if (!data.features || data.features.length === 0) {
      console.warn("GeoJSON data is empty");
      return;
    }

    // Create a GeoJSON layer
    const geoJsonLayer = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        // Only style points; leave polygons unstyled
        if (feature.geometry.type === "Point") {
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: "#1f78b4",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
          });
        }
        // For polygons/lines, just draw the outline with no fill
        return L.geoJSON(feature, {
          style: {
            color: "#000",
            weight: 1,
            fillOpacity: 0
          }
        });
      },
      onEachFeature: function(feature, layer) {
        // Only bind popup for points
        if (feature.geometry.type === "Point") {
          let popupContent = "";
          for (let key in feature.properties) {
            popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
          }
          layer.bindPopup(popupContent);
        }
      }
    }).addTo(map);

    // Fit map to bounds of all points, if valid
    if (geoJsonLayer.getBounds().isValid()) {
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });
    }
  }) // <-- Close the .then(data => { ... }) function
  .catch(error => {
    console.error("Error loading GeoJSON:", error);
    // Default view already set at initialization
  }); // <-- Close fetch() chain