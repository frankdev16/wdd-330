import MapController from './MapController.mjs';

const myMap = new MapController('map');
const routeInputsContainer = document.querySelector('.route-inputs');
const locationBtn = document.getElementById('find-location-btn');

// variables to hold coordinates for routing
let currentStartCoords = null;
let currentDestCoords = null;

const planRouteBtn = document.createElement('button');
planRouteBtn.id = 'plan-route-btn';
planRouteBtn.textContent = 'Plan Route';
routeInputsContainer.insertBefore(planRouteBtn, locationBtn);

// To handle "Use My Current Location"
locationBtn.addEventListener('click', async () => {
    try {
        currentStartCoords = await myMap.locateUser();
    } catch (error) {
        console.error("Geolocation failed:", error);
    }
});

// To handle "Plan Route"
planRouteBtn.addEventListener('click', () => {
    if (currentStartCoords && currentDestCoords) {
        myMap.calculateRoute(currentStartCoords, currentDestCoords);
    } else {
        alert("Please ensure you have selected both a valid Start and Destination location.");
    }
});

function setupAutocomplete(inputId, suggestionsBoxId) {
    const inputElement = document.getElementById(inputId);
    const suggestionsBox = document.getElementById(suggestionsBoxId);
    let typingTimer;

    inputElement.addEventListener('input', (event) => {
        clearTimeout(typingTimer);
        const query = event.target.value.trim();

        if (query.length < 3) {
            suggestionsBox.innerHTML = '';
            return;
        }

        typingTimer = setTimeout(async () => {
            const results = await myMap.searchLocation(query);
            suggestionsBox.innerHTML = '';

            results.forEach(result => {
                const option = document.createElement('div');
                option.classList.add('suggestion-item'); 
                option.textContent = result.display_name;

                option.addEventListener('click', () => {
                    inputElement.value = result.display_name;
                    suggestionsBox.innerHTML = '';

                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);

                    if (!isNaN(lat) && !isNaN(lon)) {
                        myMap.map.setView([lat, lon], 15);
                        
                        // Save the coordinates to our state variables so the route planner can use them
                        if (inputId === 'start') {
                            currentStartCoords = [lat, lon];
                        } else if (inputId === 'stop') {
                            currentDestCoords = [lat, lon];
                        }
                    }
                });
                suggestionsBox.appendChild(option);
            });
        }, 500); 
    });
}

setupAutocomplete('start', 'start-suggestions');
setupAutocomplete('stop', 'stop-suggestions');