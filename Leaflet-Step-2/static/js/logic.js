// URL for the earthquake geojson data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Send json data to quakeMap function 
  quakeMap(data.features);
});

function quakeMap(d) {
  // Loop through locations and markers elements, add popups
  EarthquakeMarkers = d.map((feature) =>
    L.circleMarker(
      [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
      {
        radius: magAdjust(feature.properties.mag),
        stroke: true,
        color: "black",
        opacity: 1,
        weight: 0.5,
        fill: true,
        fillColor: magColor(feature.properties.mag),
        fillOpacity: 0.9,
      }
    ).bindPopup(
      "<h2> Magnitude: " +
        feature.properties.mag +
        "</h1><hr><h2>" +
        feature.properties.place +
        "</h2><hr><p>" +
        new Date(feature.properties.time) +
        "</p>"
    )
  );

  // Add the earthquakes layer to a marker cluster group.
  var earthquakes = L.layerGroup(EarthquakeMarkers);

  var mags = d.map((d) => magAdjust(+d.properties.mag));

  // Define streetmap layer
  var streetmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "streets-v11",
      accessToken: API_KEY,
    }
  );

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [29.76, -95.37],
    zoom: 5.0,
    layers: [streetmap, earthquakes],
  });

  // Create and Add Legend
  var legend = L.control({ position: "bottomleft" });
  (labels = ["<strong>Magnitude</strong>"]),
    (legend.onAdd = function (myMap) {
      var div = L.DomUtil.create("div", "legend");

      div.innerHTML = [
        "<k class='mag2'></k><span><2</span><br>",
        "<k class='mag3'></k><span>2-3</span><br>",
        "<k class='mag4'></k><span>3-4</span><br>",
        "<k class='mag5'></k><span>4-5</span><br>",
        "<k class='mag5up'></k><span>5+</span><br>",
      ].join("");
      return div;
    });

  legend.addTo(myMap);
}

//Define the color scheme for the circles
function magColor(mag) {
  var color = "";
  if (mag <= 2) {
    color = "#788ef5";
  } 
  else if (mag <= 3) {
    color = "#9dceef";
  } 
  else if (mag <= 4) {
    color = "#ffffe0";
  } 
  else if (mag <= 5) {
    color = "#f4777f";
  } 
  else {
    color = "#93003a";
  }

  return color;
}

//Scale the circle size to the magnitude (X^2) and define minimum size for <2 magnitude
function magAdjust(mag) {
  if (mag <= 1) {
    return 2;
  }
  return (mag * mag );
}
