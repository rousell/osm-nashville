app.controller('MapCtrl', [ '$scope', function($scope) {
  angular.extend($scope, {
    center: {
      lat: 36.16666,
      lng: -86.78333,
      zoom: 13
    },
    // markers: {
    //   taipei: {
    //     lat: 25.0391667,
    //     lng: 121.525,
    //   }
    // },
    layers: {
      baselayers: {
        mapbox_light: {
          name: 'Mapbox Streets',
          url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
          type: 'xyz',
          layerOptions: {
            apikey: 'pk.eyJ1IjoibHJvdXNlIiwiYSI6ImNpaHBnYmkxaDA0NGJ0c20yMG5sMmZlenIifQ.NVpXXlzfBCtK00m36zp68Q',
            mapid: 'mapbox.streets'
          }
        },
        osm: {
            name: 'OpenStreetMap',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            type: 'xyz'
        }
      }
    }
  });
}]);

