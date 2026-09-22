# Tribin UI - Prototype 1

It runs locally with only HTML, CSS, and JavaScript. The position panel converts
the real longitude and latitude values from `bins.js` into relative screen
positions. 

The project contains:

- 203 actual bin records from the supplied PDF
- Search by bin number or location
- Clickable coordinate points
- A sidebar containing every bin
- A map boundary that keeps the view around Sacramento State

Files
- index.html - Page structure
- styles.css - Page and map styling
- app.js - Map, search, and bin-list behavior
- bins.js - Bin location data

Open `index.html` directly or use VS Code Live Server extension to launch `index.html` with Live Server.

To show roads and buildings later without connecting to a map service, add a
static campus map image as the background of `#campusPlot` in `styles.css`.

An internet connection is needed for the Leaflet library and Esri map tiles. The bin list can still be loaded if the online map is unavailable.
