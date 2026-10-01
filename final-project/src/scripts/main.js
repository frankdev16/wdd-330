const map = L.map('map').setView([4.8156, 7.0498], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker([4.8156, 7.0498]).addTo(map)
    .bindPopup('Welcome to Port Harcourt!<br> Let\'s plan a route.')
    .openPopup();