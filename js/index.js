import { defaultBoundaries } from "./constants.js";
import { createMapLayers, drawMarker, drawPath, logPoint } from "./maps.js";
import { getAnimationDateLabel, setInitDateRange } from "./utils.js";

const map = L.map("js_map");
let isMapLayerReady = false,
  isMapDataLoading = false,
  featureGroup,
  animatedMapProperties,
  animatedMapBoundaries;

const init = () => {
  document.getElementById("path_on").checked = true;
  setInitDateRange();
  initMap();
};

const initMap = async (properties = [], boundaries = defaultBoundaries) => {
  // fit map between min and max boundaries
  map.fitBounds(
    L.latLngBounds(L.latLng(boundaries.min), L.latLng(boundaries.max))
  );

  if (!isMapLayerReady) {
    await createMapLayers({ map });
    isMapLayerReady = true;
  }

  if (!featureGroup) {
    featureGroup = L.featureGroup();
    featureGroup.addTo(map);
  } else {
    featureGroup.clearLayers();
  }

  if (isMapDataLoading && properties.length) {
    // Get date rendered from ongoing animation
    const currDate = getAnimationDateLabel();
    await drawMarker({ featureGroup, properties, currDate });
    await renderPath({ featureGroup, properties, currDate });
  }
  isMapDataLoading = false;
};

const loadFile = () => {
  let input, file, fr;
  if (typeof window.FileReader !== "function") {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById("json_file_input");
  if (!input) {
    alert("Um, couldn't find the file input element.");
  } else if (!input.files) {
    alert(
      "This browser doesn't seem to support the `files` property of file inputs."
    );
  } else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  } else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = readFile;
    fr.readAsText(file);
  }
};

const readFile = async (e) => {
  isMapDataLoading = true;
  const rawData = e.target.result;
  const parseData = JSON.parse(rawData);
  const { boundaries, properties } = parseData;

  if (!(boundaries && properties)) {
    alert("Well, no data found. Please fill out the data first");
  }

  await initMap(properties, boundaries);
  animatedMapProperties = properties;
  animatedMapBoundaries = boundaries;
};

export const renderMapOnDateChange = async () => {
  if (!animatedMapProperties) {
    return;
  }
  isMapDataLoading = true;
  await initMap(animatedMapProperties, animatedMapBoundaries);
};

const renderPath = async ({ featureGroup, properties, currDate }) => {
  const isPathActive = document.getElementById("path_on").checked;

  if (isPathActive && properties.length) {
    await drawPath({
      featureGroup,
      properties,
      currDate,
    });
  } else {
    const currPathLayer = featureGroup
      .getLayers()
      .filter((layer) => layer._path);
    currPathLayer.map((pathLayer) => featureGroup.removeLayer(pathLayer));
  }
};

export const togglePath = async () => {
  const currDate = getAnimationDateLabel();
  await renderPath({
    featureGroup,
    properties: animatedMapProperties,
    currDate,
  });
};

window.onload = init;
window.loadFile = loadFile;
map.on("click", logPoint);
