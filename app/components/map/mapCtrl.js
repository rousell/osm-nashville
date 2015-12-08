// app.controller("MapCtrl",
//   [
//     "$location",
//     function($location) {

//       var map = L.map('map').setView([55.676, 12.568], 13);
//       L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//         attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//         maxZoom: 18,
//         id: 'mapbox.streets',
//         accessToken: 'pk.eyJ1IjoibHJvdXNlIiwiYSI6ImNpaHBnYmkxaDA0NGJ0c20yMG5sMmZlenIifQ.NVpXXlzfBCtK00m36zp68Q'
//       }).addTo(map);


app.controller('MapCtrl', [ '$scope', function($scope) {
    angular.extend($scope, {
        london: {
            lat: 51.505,
            lng: -0.09,
            zoom: 4
        }
    });
}]);


      // var popup = L.popup();

      // function onMapClick(e) {
      //     popup
      //         .setLatLng(e.latlng)
      //         .setContent("You clicked the map at " + e.latlng.toString())
      //         .openOn(map);
      // }

      // map.on('click', onMapClick);



      // L.mapbox.accessToken = 'pk.eyJ1IjoibHJvdXNlIiwiYSI6ImNpaHBnYmkxaDA0NGJ0c20yMG5sMmZlenIifQ.NVpXXlzfBCtK00m36zp68Q';
      // var geolocate = document.getElementById('geolocate');
      // var map = L.mapbox.map('map', 'mapbox.streets');

      // var myLayer = L.mapbox.featureLayer().addTo(map);




  // // This uses the HTML5 geolocation API, which is available on
  // // most mobile browsers and modern browsers, but not in Internet Explorer
  // //
  // // See this chart of compatibility for details:
  // // http://caniuse.com/#feat=geolocation

  //     // this.Geolocate = function(e){
  //     //   e.preventDefault();
  //     //   e.stopPropagation();
  //     //   map.locate();
  //     // };

  //     if (!navigator.geolocation) {
  //       geolocate.innerHTML = 'Geolocation is not available';
  //     } else {
  //       geolocate.onclick = function (e) {
  //         e.preventDefault();
  //         e.stopPropagation();
  //         map.locate();
  //       };
  //     }

  // // Once we've got a position, zoom and center the map
  // // on it, and add a single marker.
  //     map.on('locationfound', function(e) {
  //       map.fitBounds(e.bounds);

  //       console.log("Latitude || Longitude: " , e.latlng.lat, " || ", e.latlng.lng);

  //       myLayer.setGeoJSON({
  //         type: 'Feature',
  //         geometry: {
  //           type: 'Point',
  //           coordinates: [e.latlng.lng, e.latlng.lat]
  //         },
  //         properties: {
  //           'title': 'Here I am!',
  //           'marker-color': '#ff8888',
  //           // 'marker-symbol': 'star'
  //         }
  //       });
  //     // And hide the geolocation button
  //       geolocate.parentNode.removeChild(geolocate);
  //     });

  // // If the user chooses not to allow their location
  // // to be shared, display an error message.
  //     map.on('locationerror', function() {
  //       geolocate.innerHTML = 'Position could not be found';
  //     });





  //   }
  // ]);
