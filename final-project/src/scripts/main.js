const map = L.map('map').setView([4.8156, 7.0498], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker([4.8156, 7.0498]).addTo(map)
    .bindPopup('Welcome to Port Harcourt!<br> Let\'s plan a route.')
    .openPopup();

// function locateUser() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition((position) => {
//             const lat = position.coords.latitude;
//             const lng = position.coords.longitude;

//             map.setView([lat, lng], 15);

//             L.marker([lat, lng]).addTo(map)
//                 .bindPopup("You are here!")
//                 .openPopup();
//         }, () => {
//             alert("Could not get your location.");
//         });
//     } else {
//         alert("Geolocation is not supported by your browser.");
//     }
// }

function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Automatically fill the start input box
            document.getElementById('start').value = "My Current Location";

            map.setView([lat, lng], 15);

            L.marker([lat, lng]).addTo(map)
                .bindPopup("You are here!")
                .openPopup();
        }, () => {
            alert("Could not get your location.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

document.getElementById('find-location-btn').addEventListener('click', locateUser);