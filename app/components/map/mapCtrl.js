app.controller("MapCtrl",
  [
    "$location",
    function($location) {

      L.mapbox.accessToken = 'pk.eyJ1IjoibHJvdXNlIiwiYSI6ImNpaHBnYmkxaDA0NGJ0c20yMG5sMmZlenIifQ.NVpXXlzfBCtK00m36zp68Q';
      var geolocate = document.getElementById('geolocate');
      var map = L.mapbox.map('map', 'mapbox.streets');

      var myLayer = L.mapbox.featureLayer().addTo(map);

  // This uses the HTML5 geolocation API, which is available on
  // most mobile browsers and modern browsers, but not in Internet Explorer
  //
  // See this chart of compatibility for details:
  // http://caniuse.com/#feat=geolocation

      if (!navigator.geolocation) {
        geolocate.innerHTML = 'Geolocation is not available';
      } else {
        geolocate.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          map.locate();
        };
      }

  // Once we've got a position, zoom and center the map
  // on it, and add a single marker.
      map.on('locationfound', function(e) {
        map.fitBounds(e.bounds);

        console.log("Latitude || Longitude: " , e.latlng.lat, " || ", e.latlng.lng);

        myLayer.setGeoJSON({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
          },
          properties: {
            'title': 'Here I am!',
            'marker-color': '#ff8888',
            // 'marker-symbol': 'star'
          }
        });
      // And hide the geolocation button
        geolocate.parentNode.removeChild(geolocate);
      });

  // If the user chooses not to allow their location
  // to be shared, display an error message.
      map.on('locationerror', function() {
        geolocate.innerHTML = 'Position could not be found';
      });

    }
  ]);
