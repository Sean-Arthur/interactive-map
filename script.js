document.addEventListener('DOMContentLoaded', function () {
  // Map centred on Kävlinge
  const map = L.map('map').setView([55.7919, 13.1102], 11);

  // Set cursor to crosshair
  map.getContainer().style.cursor = 'crosshair';

  // Add OpenStreetMap base layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // Check that the GeoJSON file loaded successfully
  fetch('data/kommun.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error('Could not load kommun boundary file');
    }
    return response.json();
  })

  // Create and style the kommun layer
  .then(data => {
    const kommun = L.geoJSON(data, {

      // Apply styling to each kommun polygon
      style: feature => {
        const name = feature.properties.KnNamn;
        const isKavlinge = name === 'Kävlinge';

        return {
          // Orange outline for Kävlinge, grey outlines for other areas
          color: isKavlinge ? '#e4572e' : '#a5a5a5',
          weight: isKavlinge ? 3 : 0.5,

          // Grey fill for other kommun
          fillColor: '#b8b8b8',

          // Keep Kävlinge transparent so the basemap shows through
          fillOpacity: isKavlinge ? 0 : 0.75,
          opacity: 1
        };
      },

      // Add a popup when Kävlinge is clicked
      onEachFeature: (feature, layer) => {
        if (feature.properties.KnNamn === 'Kävlinge') {
          layer.bindPopup('Kävlinge kommun');
        }
      }

    }).addTo(map);

    // Find Kävlinge's polygon
    const kavlinge = kommun.getLayers().find(
      layer => layer.feature.properties.KnNamn === 'Kävlinge'
    );

    // Zoom to Kävlinge if it was found
    if (kavlinge) {
      map.fitBounds(kavlinge.getBounds(), {
        padding: [20, 20]
      });
    }
  })

  // Report errors in the browser console
  .catch(error => {
    console.error('Boundary loading error:', error);
  });
                          
  });
