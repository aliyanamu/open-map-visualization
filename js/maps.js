import {
  cartoATR,
  cartoURL,
  openStreetATR,
  openStreetURL,
} from "./constants.js";
import { customIcon } from "./utils.js";

export const createMapLayers = ({ map }) => {
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

export const drawMarker = ({ featureGroup, properties, currDate }) => {
  properties.map((data) => {
    const loc = data.locations.find((loc) => loc.date === currDate);
    if (loc) {
      const markerStyle = {
        title: `${data.name} at ${loc.name || "Unknown"}`,
      };
      if (data.icon) {
        markerStyle.icon = L.icon(customIcon(data.icon));
      }
      featureGroup.addLayer(L.marker([loc.lat, loc.lng], markerStyle));
    }
  });
};

export const drawPath = ({ featureGroup, properties, currDate }) => {
  properties.map((data) => {
    const lastLoc = data.locations[data.locations.length - 1];
    if (lastLoc.date >= currDate) {
      const coords = data.locations.reduce((coords, loc) => {
        if (loc.date <= currDate) coords.push([loc.lat, loc.lng]);
        return coords;
      }, []);
      featureGroup.addLayer(L.polyline(coords, { color: "#0075ff" }));
    }
  });
};

export const logPoint = (e) => {
  console.log(`lat: ${e.latlng.lat}, lng: ${e.latlng.lng}`);
};
