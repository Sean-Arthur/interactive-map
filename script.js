document.addEventListener('DOMContentLoaded', function () {
  // Map centred on Kävlinge
  const map = L.map('map').setView([55.7919, 13.1102], 11);

    //  example field reports
  const sampleReports = [
    {
      id: 1,
      category: 'Pothole',
      description: 'Pothole reported on a local road.',
      status: 'Open',
      lat: 55.7910,
      lng: 13.1100
    },
    {
      id: 2,
      category: 'Streetlight',
      description: 'Streetlight needs inspection.',
      status: 'In progress',
      lat: 55.7950,
      lng: 13.1020
    },
    {
      id: 3,
      category: 'Park maintenance',
      description: 'Maintenance check requested.',
      status: 'Resolved',
      lat: 55.7870,
      lng: 13.1180
    }
  ];

  // Display example reports on the map
  const reportsLayer = L.layerGroup().addTo(map);

  sampleReports.forEach(report => {
    const marker = L.circleMarker(
      [report.lat, report.lng],
      {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: report.status === 'Open'
          ? '#dc3545'
          : report.status === 'In progress'
            ? '#f0ad00'
            : '#198754',
        fillOpacity: 1
      }
    );

    marker.bindPopup(`
      <strong>${report.category}</strong><br>
      ${report.description}<br>
      <strong>Status:</strong> ${report.status}
    `);

    marker.addTo(reportsLayer);
  });


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
          color: isKavlinge ? '#ffffff' : '#a5a5a5',
          weight: isKavlinge ? 8 : 0.5,

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

   const kavlingeOutline = L.geoJSON(data, {
  filter: feature => feature.properties.KnNamn === 'Kävlinge',
  style: {
    color: '#f06423',
    weight: 4,
    opacity: 1,
    fillOpacity: 0,
    interactive: false
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
