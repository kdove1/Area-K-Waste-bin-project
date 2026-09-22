const search = document.querySelector("#search");
const count = document.querySelector("#count");
const binList = document.querySelector("#binList");
const campusPlot = document.querySelector("#campusPlot");
const selectedBin = document.querySelector("#selectedBin");
const mapStatus = document.querySelector("#mapStatus");

// bins.js supplies the real GPS coordinates from the project spreadsheet.
const binData = Array.isArray(window.bins) ? window.bins : [];

let campusMap = null;
let markerLayer = null;
const markers = new Map();

// Initialize Leaflet only when its CDN script loaded successfully.
if (typeof L !== "undefined" && binData.length > 0) {
  campusMap = L.map("campusPlot").setView([38.5615, -121.4235], 16);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
    }
  ).addTo(campusMap);

  markerLayer = L.layerGroup().addTo(campusMap);
  mapStatus.textContent = "GPS locations from the project data";
} else {
  campusPlot.innerHTML =
    '<div class="map-message">The bin list is available, but the online map could not load. Check your internet connection and refresh the page.</div>';
  mapStatus.textContent = "Map unavailable";
}

function popupText(bin) {
  return `
    <strong>Bin ${bin.id}</strong><br>
    ${bin.location}<br>
    ${bin.latitude}, ${bin.longitude}
  `;
}

function selectBin(bin, marker) {
  markers.forEach((item) => {
    item.setStyle({ color: "#ffffff", fillColor: "#087f5b" });
  });

  if (marker) {
    marker.setStyle({ color: "#8a6500", fillColor: "#c69214" });
    marker.openPopup();
  }

  selectedBin.innerHTML = `
    <strong>Bin ${bin.id}</strong><br>
    ${bin.location}<br>
    ${bin.latitude}, ${bin.longitude}
  `;
}

function showBins() {
  const searchText = search.value.trim().toLowerCase();

  const visibleBins = binData.filter((bin) =>
    `bin ${bin.id} ${bin.location}`.toLowerCase().includes(searchText)
  );

  if (markerLayer) {
    markerLayer.clearLayers();
    markers.clear();
  }

  binList.innerHTML = "";
  selectedBin.textContent = "Select a point or bin";
  count.textContent = `${visibleBins.length} of ${binData.length} bins shown`;

  visibleBins.forEach((bin) => {
    let marker = null;

    if (markerLayer) {
      marker = L.circleMarker([bin.latitude, bin.longitude], {
        radius: 6,
        color: "#ffffff",
        weight: 2,
        fillColor: "#087f5b",
        fillOpacity: 0.95
      }).bindPopup(popupText(bin));

      marker.addTo(markerLayer);
      marker.on("click", () => selectBin(bin, marker));
      markers.set(bin.id, marker);
    }

    const card = document.createElement("button");
    card.className = "bin-card";
    card.innerHTML = `
      <strong>Bin ${bin.id}</strong>
      <span>${bin.location}</span>
    `;

    card.addEventListener("click", () => {
      if (campusMap && marker) {
        campusMap.flyTo([bin.latitude, bin.longitude], 18);
      }

      selectBin(bin, marker);
    });

    binList.append(card);
  });
}

search.addEventListener("input", showBins);
showBins();

if (campusMap && binData.length > 0) {
  const allBinBounds = L.latLngBounds(
    binData.map((bin) => [bin.latitude, bin.longitude])
  );

  campusMap.fitBounds(allBinBounds, { padding: [20, 20] });
}
