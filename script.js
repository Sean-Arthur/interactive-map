document.addEventListener('DOMContentLoaded', function () {
  // Map centred on Kävlinge
  const map = L.map('map').setView([55.7919, 13.1102], 11);

  // Set cursor to crosshair
  map.getContainer().style.cursor = 'crosshair';

  // Add OpenStreetMap base layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo
