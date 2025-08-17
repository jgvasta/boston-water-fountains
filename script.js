// Replace with your Apps Script URL
const GEOJSON_URL = "https://script.google.com/macros/s/AKfycbwaKTk--r3ZhxQBQSvNwGzz3HZRIy2N2HYBb3DN8zhLpX6LTlCdUqfwEtnfSJBy2lt8/exec";

const map = L.map('map').setView([40, -95], 4); // Center USA

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

fetch(GEOJSON_URL)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: function(feature, layer) {
        let popupContent = "";
        for (let key in feature.properties) {
          popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br>`;
        }
        layer.bindPopup(popupContent);
      }
    }).addTo(map);
  });
