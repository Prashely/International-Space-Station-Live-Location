const map = L.map('map').setView([0, 0], 2);

const myIcon = L.icon({
    iconUrl: '1.png',
    iconSize: [50, 32], // Initial size
    iconAnchor: [25, 16]
});

const api_url = `https://api.wheretheiss.at/v1/satellites/25544`;
const positions_url = `https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=`;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10, // Set a max zoom level
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = L.marker([0, 0], {icon: myIcon}).addTo(map);

let issCoordinates = [];
let trail;
let currentLatitude = 0;
let currentLongitude = 0;

async function getISS(){
    const response = await fetch(api_url);
    const data = await response.json();
    const {latitude, longitude, velocity} = data;

    currentLatitude = latitude;
    currentLongitude = longitude;

    marker.setLatLng([latitude, longitude]);
    document.getElementById('lat').textContent = latitude;
    document.getElementById('lon').textContent = longitude;  
    document.getElementById('vel').textContent = velocity;  

    // Add the current position to the coordinates array with a timestamp
    const timestamp = new Date();
    issCoordinates.push({latitude, longitude, timestamp});

    // Filter out positions older than 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    issCoordinates = issCoordinates.filter(coord => coord.timestamp > twentyFourHoursAgo);

    // Extract the coordinates from the filtered array
    const trailCoordinates = issCoordinates.map(coord => [coord.latitude, coord.longitude]);

    // Remove the previous trail if it exists
    if (trail) {
        map.removeLayer(trail);
    }

    // Draw the trail
    trail = L.polyline(trailCoordinates, {
        color: 'blue', // Change the color to something more visible
        weight: 3, // Increase the weight
        opacity: 1, // Increase the opacity
        dashArray: '4, 8' // Dotted line
    }).addTo(map);
}

async function getPastPositions() {
    const now = Math.floor(Date.now() / 1000);
    const timestamps = Array.from({ length: 24 * 60 * 2 }, (_, i) => now - (i * 30)).reverse(); // Get timestamps for every 30 seconds in the last 24 hours
    const response = await fetch(positions_url + timestamps.join(','));
    const data = await response.json();

    issCoordinates = data.map(pos => ({
        latitude: pos.latitude,
        longitude: pos.longitude,
        timestamp: new Date(pos.timestamp * 1000)
    }));

    // Draw the initial trail
    const trailCoordinates = issCoordinates.map(coord => [coord.latitude, coord.longitude]);
    trail = L.polyline(trailCoordinates, {
        color: 'red', // Change the color to something more visible
        weight: 3, // Increase the weight
        opacity: 1, // Increase the opacity
        dashArray: '4, 8' // Dotted line
    }).addTo(map);
}

function updateIconSize() {
    const zoomLevel = map.getZoom();
    const size = 32 + (zoomLevel * 5); // Adjust the factor as needed
    const newIcon = L.icon({
        iconUrl: '1.png',
        iconSize: [size, size], // New size
        iconAnchor: [size / 2, size / 2]
    });
    marker.setIcon(newIcon);
}

function updateView() {
    map.setView([currentLatitude, currentLongitude], map.getZoom());
    updateIconSize();
}

map.on('zoomend', updateView);

getPastPositions();
getISS();
setInterval(getISS, 500);