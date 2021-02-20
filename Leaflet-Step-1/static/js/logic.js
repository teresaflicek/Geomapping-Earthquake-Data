// store our api endpoint inside queryurl
var queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// perform a GET request to the query URL
d3.json(queryurl, function (data) {
    // once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }


    // create a GeoJSON layer containing the features array on the earthquakeData object
    // run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // sending our earthquakes layer to the createMap function
    createMap(earthquakes);
};


// define arrays to hold marker information for each feature
var magnitudeMarkers = [];
var depthMarkers = [];

// loop through earthquake data and create depth and magnitude markers
for (var i = 0; i < earthquakedata.features.length; i++) {
  // setting the marker radius for the depth of the earthquake by passing coordinates into the markerSize function
  depthMarkers.push(
    L.circle(earthquakedata[i].geometry.coordinates[2], {
      stroke: false,
      fillOpacity: 0.75,
      color: "white",
      fillColor: "white",
      radius: markerSize(earthquakedata[i].geometry.coordinates[2])
    })
  );

  // setting the marker radius for the magnitude by passing magnitude property into the markerSize function
  magnitudeMarkers.push(
    L.circle(earthquakedata[i].geometry.coordinates[2], {
      stroke: false,
      fillOpacity: 0.75,
      color: "purple",
      fillColor: "purple",
      radius: markerSize(earthquakedata[i].features.properties.mag)
    })
  );
}







function createMap(earthquakes) {

    // define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create two separate layer groups: one for cities and one for states
    var depth = L.layerGroup(depthMarkers);
    var magnitude = L.layerGroup(magnitudeMarkers);


    // create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        Depth: depth,
        Magnitude: magnitude
    };

    // create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // create a layer control
    // pass in our baseMaps and overlayMaps
    // add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
};
