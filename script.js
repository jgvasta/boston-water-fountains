console.log("script loaded");

// Get geojson stream
const GEOJSON_URL = "https://script.google.com/macros/s/AKfycbwaKTk--r3ZhxQBQSvNwGzz3HZRIy2N2HYBb3DN8zhLpX6LTlCdUqfwEtnfSJBy2lt8/exec";

// Initialize the map with a default view (Boston)
const map = L.map('map').setView([42.3601, -71.0589], 13);

// Create a key map that renames columns to make them more manageable
const keyMap = {
  "Give the fountain a short identifying name (e.g. Perkins St & Jamaicaway, or Cassidy Playground)": "name",
  "Was the fountain in working order?": "status",
  "Any other description of the location or fountain that you'd like to include?": "desc",
  "Attach a photo (optional)": "photo",
  "Add your name if you'd like credit (optional)": "submitterName"
};

// Add Stadia_StamenTerrain tiles
L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 18,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map);


// Fetch GeoJSON data
fetch(GEOJSON_URL)
  .then(response => response.json()) // Convert response to json
  .then(data => {
    console.log("GeoJSON data loaded:", data);
    
// Create marker
var waterIcon = new L.Icon({
  iconUrl: 'droplet.png', // relative path to your PNG
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', // optional shadow
  iconSize: [41, 41],    // width, height of your icon
  iconAnchor: [12, 41],  // point of the icon that corresponds to the marker's location
  popupAnchor: [1, -34], // point from which the popup opens relative to iconAnchor
  shadowSize: [41, 41]   // size of the shadow
});

    // Add GeoJSON layer to map
    const geoJsonLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        // Pop-ups
        let popup = "";
        if (feature.properties["Give the fountain a short identifying name (e.g. Perkins St & Jamaicaway, or Cassidy Playground)"]) {
          popup += "<b>" + feature.properties["Give the fountain a short identifying name (e.g. Perkins St & Jamaicaway, or Cassidy Playground)"] + "</b><br>";
          }
        if (feature.properties["Any other description of the location or fountain that you'd like to include?"]) {
          popup += feature.properties["Any other description of the location or fountain that you'd like to include?"] + "<br>";
          }
        // if (feature.properties["Attach a photo (optional)"]) {
        //   popup += "<img src='" + feature.properties["Attach a photo (optional)"] + "' alt='fountain photo' width='200'><br>";
        //   }
        if (feature.properties["Add your name if you'd like credit (optional)"]) {
          popup += "<b>Submitted by: </b> " + feature.properties["Add your name if you'd like credit (optional)"] + "<br>";
          }
        // Markers
        return L.marker(latlng, { icon: waterIcon }).bindPopup(popup);
        
        //L.marker(latlng, { icon: waterIcon })
        //  .bindPopup("<b>" + (feature.properties.name) + "</b>") // Display feature name in popup
      }
    }).addTo(map);

    // Fit map to bounds of all points
    if (geoJsonLayer.getBounds().isValid()) {
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [50, 50] });
    }
  })
  .catch(err => console.error('Error loading GeoJSON:', err)); // Handle errors

    