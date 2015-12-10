app.controller('MapCtrl', [ '$scope', 'leafletData', '$firebaseArray', 'AuthService', '$location', function($scope, leafletData, $firebaseArray, AuthService, $location) {

    var ref = new Firebase("https://osm-nashville.firebaseio.com/Marks");
    var firebaseMarks = $firebaseArray(ref);
    $scope.btn = false;

    // console.log($scope.marks);
    $scope.marks = [];

    $scope.userAuth = AuthService.$getAuth();

    firebaseMarks.$loaded()
      .then(function(){
        angular.forEach(firebaseMarks, function(mark) {
        // console.log(mark);
        $scope.marks.push(mark);
        });
      });

    angular.extend($scope, {
      center: {
        lat: 36.16666,
        lng: -86.78333,
        zoom: 4,
      },
      defaults: {
        scrollWheelZoom: false
      },
      events: {
        map: {
          enable: ['click'],
          logic: 'emit'
        }
      },
      layers: {
        baselayers: {
          mapbox_streets: {
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
      },
      userMarks: $scope.marks
    });

    $scope.addMarkers = function(args){
      $scope.marks.push({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
      });
      firebaseMarks.$add({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
        uid: $scope.userAuth.uid,
        dateAdded: Date.now(),
      });
    };

    $scope.$on('leafletDirectiveMap.click', function(e, args){
      console.log("you clicked the map at: ", args.leafletEvent.latlng);
      $scope.addMarkers(args);
      e.stopPropagation();
    });

    $scope.geolocate = function(e) {
      if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(success);
      }else{
        console.log("Geolocation wasn't possible :(");
      }
      function success(pos){
        var latitude = pos.coords.latitude.toFixed(5);
        var longitude = pos.coords.longitude.toFixed(5);
        console.log("geolocation is done! : ", latitude, longitude);

        $location.search({ c: latitude+':'+longitude+':'+16});

        $scope.$on("centerUrlHash", function(event, centerHash) {
          console.log("url", centerHash);
          $location.search({ c: centerHash });
        });

        $scope.marks.push({
          lat: pos.coords.latitude.toFixed(3),
          lng: pos.coords.longitude.toFixed(3),
        });
        firebaseMarks.$add({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          uid: $scope.userAuth.uid,
          dateAdded: Date.now(),
      });
      }
      $scope.btn = true;
    };


    // leafletData.getMap('map1').then(function(map){
    //     map.locate({setView: true, maxZoom: 16});
    // });
}]);

