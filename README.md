# International Space Station Live Location

A web application that tracks and displays the live location of the International Space Station (ISS) on a map, along with its past 24-hour trail.

## Introduction

The International Space Station Live Location project provides real-time tracking of the ISS, displaying its current latitude, longitude, and velocity. The application uses the Leaflet.js library for mapping and fetches data from the `wheretheiss.at` API to show the current position of the ISS and its trail for the past 24 hours.

## Live Page

You can view the live page [here](https://prashely.github.io/International-Space-Station-Live-Location/).

## Features

- Real-time ISS position tracking
- Display of current latitude, longitude, and velocity
- Interactive map with zoom and pan functionality
- 24-hour trail of the ISS

## Technologies Used

- **HTML**: The structure of the web page.
- **CSS**: Styling for the page, including media queries for responsiveness.
- **JavaScript**: Logic for fetching ISS data and updating the map.
- **Leaflet.js**: A JavaScript library for interactive maps.
- **wheretheiss.at API**: Provides real-time and historical data for the ISS location.

## Algorithm Explanation

1. **Initialization**: The map is initialized using Leaflet.js and centered at coordinates `[0, 0]` with a zoom level of 2.
    ```js
    const map = L.map('map').setView([0, 0], 2);
    ```

2. **Custom Icon**: A custom icon for the ISS is created and added to the map.
    ```js
    const myIcon = L.icon({
        iconUrl: '1.png',
        iconSize: [50, 32],
        iconAnchor: [25, 16]
    });
    ```

3. **Tile Layer**: An OpenStreetMap tile layer is added to the map.
    ```js
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 10,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    ```

4. **Marker**: A marker with the custom icon is added to the map at the ISS's initial position.
    ```js
    const marker = L.marker([0, 0], {icon: myIcon}).addTo(map);
    ```

5. **Fetching Current ISS Data**: The `getISS` function fetches the current ISS data from the API every 500 milliseconds, updates the marker position, and appends the current position to the `issCoordinates` array. Positions older than 24 hours are filtered out.
    ```js
    async function getISS() {
        const response = await fetch(api_url);
        const data = await response.json();
        // Update marker and coordinates...
    }
    ```

6. **Fetching Past Positions**: The `getPastPositions` function fetches the ISS positions for the past 24 hours and draws the initial trail on the map.
    ```js
    async function getPastPositions() {
        // Fetch past positions and draw the trail...
    }
    ```

7. **Trail Drawing**: The trail of the ISS is drawn using a polyline on the map. The polyline is updated whenever new positions are fetched.
    ```js
    trail = L.polyline(trailCoordinates, {
        color: 'red',
        weight: 3,
        opacity: 1,
        dashArray: '4, 8'
    }).addTo(map);
    ```

8. **Icon Size Update**: The size of the ISS icon is updated based on the zoom level of the map.
    ```js
    function updateIconSize() {
        const zoomLevel = map.getZoom();
        const size = 32 + (zoomLevel * 5);
        const newIcon = L.icon({
            iconUrl: '1.png',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
        });
        marker.setIcon(newIcon);
    }
    ```

9. **View Update**: The map view is updated to center on the current ISS position whenever the zoom level changes.
    ```js
    function updateView() {
        map.setView([currentLatitude, currentLongitude], map.getZoom());
        updateIconSize();
    }
    map.on('zoomend', updateView);
    ```

## Known Issues

- The trail for the past 24 hours is not showing correctly.

## Links

Reach me at https://prashely.com

