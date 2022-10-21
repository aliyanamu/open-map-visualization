import {
  cartoATR,
  cartoURL,
  openStreetATR,
  openStreetURL,
} from "./constants.js";

export const createMapLayers = function ({ map }) {
  // add CartoDB map layer
  const carto = L.tileLayer(cartoURL, {
    maxZoom: 18,
    attribution: cartoATR,
  }).addTo(map);

  // add OpenStreetMaps map layer
  const osm = L.tileLayer(openStreetURL, {
    maxZoom: 18,
    attribution: openStreetATR,
    id: "mapbox.streets",
  }).addTo(map);

  const esri = L.esri.basemapLayer("Imagery");
  const baseLayers = {
    "Carto Map": carto,
    "Satellite Map": esri,
    "Street Map": osm,
  };

  L.control
    .layers(
      baseLayers,
      {},
      {
        position: "topright",
        collapsed: false,
      }
    )
    .addTo(map);
};

export const drawMarker = function ({ layerGroup, map, mapData }) {
  mapData.map(function (point) {
    point.data.map(function (coord) {
      const markerStyle = {
        title: coord.name,
      };
      layerGroup.addLayer(L.marker([coord.lat, coord.lng], markerStyle));
    });
  });

  layerGroup.addTo(map);
  return layerGroup;
};

export const drawPath = function ({ layerGroup, map, mapData }) {
  mapData.map(function (path) {
    const coords = path.data.map((coord) => [coord.lat, coord.lng]);
    layerGroup.addLayer(L.polyline(coords, { color: "red" }));
  });

  layerGroup.addTo(map);
  return layerGroup;
};

export const logPoint = function (e) {
  console.log(`lat: ${e.latlng.lat}, lng: ${e.latlng.lng}`);
};