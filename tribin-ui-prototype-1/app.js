const search = document.querySelector("#search");
const count = document.querySelector("#count");
const binList = document.querySelector("#binList");
const campusPlot = document.querySelector("#campusPlot");
const selectedBin = document.querySelector("#selectedBin");

// Find the outer limits of the real PDF coordinates.
const minimumLongitude = Math.min(...bins.map((bin) => bin.longitude));
const maximumLongitude = Math.max(...bins.map((bin) => bin.longitude));
const minimumLatitude = Math.min(...bins.map((bin) => bin.latitude));
const maximumLatitude = Math.max(...bins.map((bin) => bin.latitude));

// Convert longitude into a horizontal percentage.
function getLeftPosition(longitude) {
  return ((longitude - minimumLongitude) / (maximumLongitude - minimumLongitude)) * 90 + 5;
}

// Convert latitude into a vertical percentage. Higher latitude is farther north.
function getTopPosition(latitude) {
  return 95 - ((latitude - minimumLatitude) / (maximumLatitude - minimumLatitude)) * 90;
}

function selectBin(bin, point) {
  document.querySelectorAll(".bin-point").forEach((item) => item.classList.remove("selected"));
  point.classList.add("selected");
  selectedBin.innerHTML = `
    <strong>Bin ${bin.id}</strong><br>
    ${bin.location}<br>
    ${bin.latitude}, ${bin.longitude}
  `;
}

function showBins() {
  const searchText = search.value.trim().toLowerCase();
  const visibleBins = bins.filter((bin) =>
    `bin ${bin.id} ${bin.location}`.toLowerCase().includes(searchText)
  );

  campusPlot.innerHTML = "";
  binList.innerHTML = "";
  selectedBin.textContent = "Select a point or bin";
  count.textContent = `${visibleBins.length} of ${bins.length} bins shown`;

  visibleBins.forEach((bin) => {
    const point = document.createElement("button");
    point.className = "bin-point";
    point.style.left = `${getLeftPosition(bin.longitude)}%`;
    point.style.top = `${getTopPosition(bin.latitude)}%`;
    point.title = `Bin ${bin.id}: ${bin.location}`;
    point.addEventListener("click", () => selectBin(bin, point));
    campusPlot.append(point);

    const card = document.createElement("button");
    card.className = "bin-card";
    card.innerHTML = `<strong>Bin ${bin.id}</strong><span>${bin.location}</span>`;
    card.addEventListener("click", () => selectBin(bin, point));
    binList.append(card);
  });
}

search.addEventListener("input", showBins);
showBins();
