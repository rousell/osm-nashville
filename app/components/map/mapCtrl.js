app.controller('MapCtrl', [ '$scope', 'leafletData', '$firebaseArray', 'AuthService', function($scope, leafletData, $firebaseArray, AuthService) {

    var ref = new Firebase("https://osm-nashville.firebaseio.com/Marks");
    var firebaseMarks = $firebaseArray(ref);

    // console.log($scope.marks);
    $scope.marks = [];

    $scope.userAuth = AuthService.$getAuth();

    firebaseMarks.$loaded()
      .then(function(){
        angular.forEach(firebaseMarks, function(mark) {
        console.log(mark);
        $scope.marks.push(mark);
        });
      });


    // var userMarks = $scope.marks;
    // userMarks.push({
    //     lat: 36.161278,
    //     lng: -86.7785,
    //     draggable: false
    // });
    // userMarks.push({
    //     lat: 52.219081,
    //     lng: 21.025386,
    //     draggable: false
    // });

    angular.extend($scope, {
      center: {
        lat: 36.16666,
        lng: -86.78333,
        zoom: 13
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

    // $scope.eventDetected = "No events yet...";

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
    });


    // leafletData.getMap('map1').then(function(map){
    //     map.locate({setView: true, maxZoom: 16});
    // });
}]);

