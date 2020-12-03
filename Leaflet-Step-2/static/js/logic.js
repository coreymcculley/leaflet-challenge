// URL for the earthquake geojson data
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//URL for the tectonic plate geojson data
var platesUrl =
  "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  let quakeData = data.features;
  d3.json(platesUrl, function (data) {
    let platesData = data.features;
    // Send json data to quakeMap function
    quakeMap(quakeData, platesData);
  });
});

// Function to create Map
function quakeMap(earthquakeData, platesData) {
  // Loop through locations and markers elements, add popups
  let earthquakeMarkers = earthquakeData.map((feature) =>
    L.circleMarker(
      [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
      {
        radius: magAdjust(feature.properties.mag),
        stroke: true,
        color: "black",
        opacity: 1,
        weight: 0.2,
        fill: true,
        fillColor: magColor(feature.properties.mag),
        fillOpacity: 0.9,
      }
    ).bindPopup(
      "<h1> Magnitude : " +
        feature.properties.mag +
        "</h1><hr><h3>" +
        feature.properties.place +
        "</h3><hr><p>" +
        new Date(feature.properties.time) +
        "</p>"
    )
  );

  // Layer group creation for the earthquake data
  let earthquakes = L.layerGroup(earthquakeMarkers);

  // Create Lines for the tectonic plate data
  function makePolyline(feature, layer) {
    L.polyline(feature.geometry.coordinates);
  }

  let plates = L.geoJSON(platesData, {
    onEachFeature: makePolyline,
    style: {
      color: "red",
      opacity: 0.8,
    },
  });

  // Define streetmap, darkmap, and satellite layers
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

  var darkmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY,
    }
  );

  var satellite = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "satellite-v9",
      accessToken: API_KEY,
    }
  );

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map": satellite,
  };

  // create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Plates: plates,
  };

  // create the map, giving it the streetmap and earthquake layers to display on load
  var myMap = L.map("map", {
    center: [7.559, -95.62],
    zoom: 3.0,
    layers: [streetmap, earthquakes],
  });

  // add a legend to the map
  var legend = L.control({ position: "bottomleft" });

  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML = [
      "<k class='mag2'></k><span><2</span><br>",
      "<k class='mag3'></k><span>2-3</span><br>",
      "<k class='mag4'></k><span>3-4</span><br>",
      "<k class='mag5'></k><span>4-5</span><br>",
      "<k class='mag5up'></k><span>5+</span><br>",
    ].join("");
    return div;
  };

  legend.addTo(myMap);
  //Create a layer control
  //pass in the base maps and layer control
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);
}

//Define the color scheme for the circles
function magColor(mag) {
  var color = "";
  if (mag <= 2) {
    color = "#788ef5";
  } else if (mag <= 3) {
    color = "#9dceef";
  } else if (mag <= 4) {
    color = "#ffffe0";
  } else if (mag <= 5) {
    color = "#f4777f";
  } else {
    color = "#93003a";
  }

  return color;
}

//Scale the circle size to the magnitude (X^2) and define minimum size for <2 magnitude
function magAdjust(mag) {
  if (mag <= 1) {
    return 2;
  }
  return mag * mag;
}
