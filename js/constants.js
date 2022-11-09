export const cartoURL =
  "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png";
export const cartoATR =
  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>';
export const openStreetURL =
  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
export const openStreetATR =
  'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
export const defaultBoundaries = {
  max: {
    lat: -1.92182,
    lng: 138.77438,
  },
  min: {
    lat: -3.36388,
    lng: 104.86881,
  },
};
// source custom markers https://github.com/pointhi/leaflet-color-markers
export const customIconURL =
  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-xxx.png";
export const iconProps = {
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
};
