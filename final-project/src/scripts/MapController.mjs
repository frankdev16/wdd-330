export default class MapController {
    constructor(mapId) {
        this.map = L.map(mapId).setView([4.8156, 7.0498], 13);
        this.routingControl = null; 

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);
    }

    locateUser() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    document.getElementById('start').value = "My Current Location";
                    this.map.setView([lat, lng], 15);
                    
                    L.marker([lat, lng]).addTo(this.map)
                        .bindPopup("You are here!")
                        .openPopup();
                        
                    resolve([lat, lng]); // Send coordinates back to main.js
                }, () => {
                    alert("Could not get your location.");
                    reject("Location denied");
                });
            } else {
                alert("Geolocation is not supported by your browser.");
                reject("No geolocation support");
            }
        });
    }

    async searchLocation(query) {
        const bounds = this.map.getBounds();
        const viewbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&viewbox=${viewbox}&bounded=0&limit=5`;
        
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error("Error fetching location:", error);
            return [];
        }
    }

    calculateRoute(startCoords, endCoords) {
        // If a route already exists on the map, remove it first
        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
        }

        // 1. Immediately adjust the camera to fit both start and end points
        const bounds = L.latLngBounds([startCoords, endCoords]);
        this.map.fitBounds(bounds, { padding: [50, 50] }); 

        // 2. Draw the new route using Leaflet Routing Machine
        this.routingControl = L.Routing.control({
            waypoints: [
                L.latLng(startCoords[0], startCoords[1]),
                L.latLng(endCoords[0], endCoords[1])
            ],
            routeWhileDragging: true,
            addWaypoints: false, 
            show: false, 
            fitSelectedRoutes: true
        }).addTo(this.map);
    }
}