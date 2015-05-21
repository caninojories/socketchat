"use strict";
var map;
var markers = []

function initialize() {
  var mapOptions = {
    zoom: 16
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  
  google.maps.event.addDomListener(window, 'load', initialize);
  google.maps.event.addDomListener(window, "resize", function() {
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
  });

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'You are here'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);


// listen for Marker event
google.maps.event.addListener(map, 'load', function(event) {

    var marker = addMarker(event.latLng);

    
    socket.emit('marker', {
        'lat': marker.position.k,
        'lng': marker.position.D
    });
});

// Add a marker to the map 
function addMarker(location) {

    var marker = new google.maps.Marker({
        position: location,
        map: map
    });

    markers.push(marker);

    console.log(location);
    console.log("marker: " + marker.position.k + " " + marker.position.D);

    return marker;
}

//Listen for other users markers
socket.on('show-marker', addMarker);
