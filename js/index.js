import { defaultBoundaries } from "./constants.js";
import { createMapLayers, drawMarker, drawPath, logPoint } from "./maps.js";
import { transformMapData } from "./utils.js";

const map = L.map("js_map");
let isMapLayerReady = false,
  isMapDataLoading = false,
  currLayerGroup,
  animatedMapData,
  animatedMapBoundaries;

const init = function () {
  document.getElementById("path_on").checked = true;
  initMap();
};

const initMap = async function (mapData = [], boundaries = defaultBoundaries) {
  const isPathActive = document.getElementById("path_on").checked;

  // fit map between min and max boundaries
  map.fitBounds(
    L.latLngBounds(L.latLng(boundaries.min), L.latLng(boundaries.max))
  );

  if (!isMapLayerReady) {
    await createMapLayers({ map });
    isMapLayerReady = true;
  }

  if (isMapDataLoading) {
    if (currLayerGroup) {
      currLayerGroup.removeFrom(map);
    }

    if (mapData.length) {
      let currMarker, currPath;
      const layerGroup = L.layerGroup();

      currMarker = await drawMarker({ layerGroup, map, mapData });
      if (isPathActive) {
        currPath = await drawPath({ layerGroup, map, mapData });
      }
      currLayerGroup = Object.assign(currMarker, currPath);
    }
    isMapDataLoading = false;
  }
};

const loadFile = function () {
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

const readFile = async function (e) {
  isMapDataLoading = true;
  const rawData = e.target.result;
  const parseData = JSON.parse(rawData);
  const { boundaries, mapData: mapDataByDate } = parseData;

  if (!(boundaries && mapDataByDate)) {
    alert("Well, no data found. Please fill out the data first");
  }

  const { initData, sortedMapData } = await transformMapData(mapDataByDate);

  await initMap(initData, boundaries);
  animatedMapData = sortedMapData;
  animatedMapBoundaries = boundaries;
};

export const renderMapOnDateChange = async function (dateKey) {
  if (!animatedMapData) {
    return;
  }
  isMapDataLoading = true;
  const mapData = animatedMapData[dateKey] || [];
  await initMap(mapData, animatedMapBoundaries);
};

window.onload = init;
window.loadFile = loadFile;
map.on("click", logPoint);
