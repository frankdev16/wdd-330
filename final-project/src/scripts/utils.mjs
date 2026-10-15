export function getSavedRoutes() {
    const savedRoutesJSON = localStorage.getItem('practiceRoutes');
    
    if (savedRoutesJSON) {
        return JSON.parse(savedRoutesJSON);
    } else {
        return [];
    }
}

export function saveRouteToStorage(startName, destName, startCoords, destCoords) {
    
    const routesArray = getSavedRoutes();

    const newRoute = {
        id: Date.now(), 
        startLocationName: startName,
        destinationName: destName,
        startCoordinates: startCoords,
        destinationCoordinates: destCoords
    };

    routesArray.push(newRoute);

    localStorage.setItem('practiceRoutes', JSON.stringify(routesArray));
}