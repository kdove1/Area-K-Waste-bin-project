const search = document.querySelector("#search");
const count = document.querySelector("#count");
const binList = document.querySelector("#binList");
const campusPlot = document.querySelector("#campusPlot");
const selectedBin = document.querySelector("#selectedBin");
const mapStatus = document.querySelector("#mapStatus");
const fullnessFilter = document.querySelector("#fullnessFilter");

// bins.js supplies the real GPS coordinates from the project spreadsheet.
const binData = Array.isArray(window.bins) ? window.bins : [];

let campusMap = null;
let markerLayer = null;
const markers = new Map();

// Initialize Leaflet only when its CDN script loaded successfully.
if (typeof L !== "undefined" && binData.length > 0) {
  // Sacramento State campus boundaries
  const sacramentoStateBounds = L.latLngBounds(
    [38.552, -121.431], // Southwest corner
    [38.569, -121.416]  // Northeast corner
  );

  campusMap = L.map("campusPlot", {
    minZoom: 15,
    maxBounds: sacramentoStateBounds,
    maxBoundsViscosity: 1.0
  }).setView([38.5615, -121.4235], 16);

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
    <strong>Fullness:</strong> ${bin.fullness}%<br>
    <strong>Status:</strong> ${getFullnessStat(bin.fullness)}<br>
    ${bin.latitude}, ${bin.longitude}
  `;
}

function selectBin(bin, marker) {
  markers.forEach((item) => {
    item.setStyle({ color: "#ffffff", fillColor:getBinColor(bin.fullness) });
  });

  if (marker) {
    marker.setStyle({ color: "#8a6500", fillColor: "#c69214" });
    marker.openPopup();
  }

  selectedBin.innerHTML = `
    <strong>Bin ${bin.id}</strong><br>
    ${bin.location}<br>
    <strong>Fullness:</strong> ${bin.fullness}%<br>
    <strong>Status:</strong> ${getFullnessStat(bin.fullness)}<br>
    ${bin.latitude}, ${bin.longitude}
  `;
}

function getFullnessStat(fullness) {
  if (fullness >= 80) {
    return "red";
  } else if (fullness >= 50) {
    return "yellow";
  } else {
    return "green";
  }
}

function getBinColor(fullness) {
  const status = getFullnessStat(fullness);
  if (status === "red") {
    return "#b42318"; //red
  } else if (status === "yellow"){
    return "#c69214"; //yellow
  }
  else {
    return "#087f5b"; //green
  }
}

function showBins() {
  const searchText = search.value.trim().toLowerCase();
  const selectedStat = fullnessFilter.value;
  
  
  const visibleBins = binData.filter((bin) => {
   const matchesSearch =
    `bin ${bin.id} ${bin.location}`
    .toLowerCase()
    .includes(searchText)

 const matchesFullness =  // checks if bins fullness matches the selected status
    selectedStat === "all" ||
    getFullnessStat(bin.fullness) === selectedStat;
   
   
    return matchesSearch && matchesFullness;
  });

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
        fillColor: getBinColor(bin.fullness),
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
fullnessFilter.addEventListener("change", showBins);
showBins();

if (campusMap && binData.length > 0) {
  const allBinBounds = L.latLngBounds(
    binData.map((bin) => [bin.latitude, bin.longitude])
  );

  campusMap.fitBounds(allBinBounds, { padding: [20, 20] });
}
