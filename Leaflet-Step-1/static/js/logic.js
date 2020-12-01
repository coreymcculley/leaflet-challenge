var myMap = L.map("mapid", {
  center: [29.76, -95.37],
  zoom: 11
});

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// // Store our API endpoint inside queryUrl
// var queryUrl =
//   "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// console.log(queryUrl);

// //
// d3.json(queryUrl, function (data) {
//   // Creating a GeoJSON layer with the retrieved data
//   createMap(data.features);
// });

// //Write function to take input json data and output a leaflet map with buttons
// function createMap(geoData) {
//   //Loop and create markers for the earthquake geo data
//   geoMarkers = geoData.map((feature) =>
//     L.circleMarker(
//       [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
//       {
//         radius: feature.properties.mag, //set circle size to magnitude from geo data
//         stroke: true,
//         color: "black",
//         opacity: 0.5,
//         weight: 0.5,
//         fill: true,
//         fillColor: "blue", //magColor(feature.properties.mag),
//         fillOpacity: 0.9,
//       }
//       // ).bindPopup(
//       //   "<h1> Magnitude : " +
//       //     feature.properties.mag +
//       //     "</h1><hr><h3>" +
//       //     feature.properties.place +
//       //     "</h3><hr><p>" +
//       //     new Date(feature.properties.time) +
//       //     "</p>"
//       // )
//     )
//   );


//   // Creating map object
  
// }