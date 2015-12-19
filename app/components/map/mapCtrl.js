app.controller('MapCtrl', [ '$scope', 'leafletData', '$firebaseArray', 'AuthService', '$location', 'leafletMarkerEvents', function($scope, leafletData, $firebaseArray, AuthService, $location, leafletMarkerEvents) {

    var ref = new Firebase("https://osm-nashville.firebaseio.com/Marks");
    var firebaseMarks = $firebaseArray(ref);
    $scope.btn = false;
    $scope.clickMark = false;
    $scope.markInFocus = "";
    $scope.markDataInFocus = {};
    $scope.marks = [];
    $scope.userAuth = AuthService.$getAuth();

    var local_icons = {
        default_icon: {},
        leaf_icon: {
            iconUrl: 'assets/img/green-circle-md.png',
            iconSize:     [20, 20], // size of the icon
            iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, 0], // point from which the popup should open relative to the iconAnchor
        }
    };

    angular.extend($scope, {
      center: {
        lat: 36.16666,
        lng: -86.78333,
        zoom: 12,
      },
      defaults: {
        scrollWheelZoom: false
      },
      controls: {
        scale: true
      },
      events: {
        map: {
          enable: ['click'],
          logic: 'emit'
        },
        markers: {
          enable: leafletMarkerEvents.getAvailableEvents(),
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

      return firebaseMarks.$add({
        lat: args.leafletEvent.latlng.lat,
        lng: args.leafletEvent.latlng.lng,
        uid: $scope.userAuth.uid,
        dateAdded: Date.now(),
        icon: local_icons.leaf_icon,
        opacity: 0.6,
        test: "test",
        name: "name",
      });
      // return added id;
    };
    firebaseMarks.$loaded()
      .then(function(){
        angular.forEach(firebaseMarks, function(mark) {
        $scope.marks.push(mark);
        });
      });

    this.saveBtn = function(){
      console.log("add mark button clicked");
      firebaseMarks.$save($scope.markDataInFocus)
        .then(function(ref){
          console.log(ref);
        });
    };

    this.clickMark = function(){
      $scope.clickMark = true;
      console.log("here is the change in clickMark ", $scope.clickMark);
    };

    $scope.$on('leafletDirectiveMap.click', function(e, args){
      if ($scope.clickMark === false) {
        $scope.markInFocus = "";
        $scope.markDataInFocus = {};
      } else {
        console.log("you clicked the map at: ", args.leafletEvent.latlng);
        $scope.addMarkers(args)
          .then(function(ref) {
            var $id = ref.key();
            $scope.markInFocus = $id;
            $scope.markDataInFocus = firebaseMarks.$getRecord($id);
            console.log($scope.markDataInFocus);
            console.log("added record with $id " + $id);

            $scope.marks.push({
              lat: $scope.markDataInFocus.lat,
              lng: $scope.markDataInFocus.lng,
              icon: $scope.markDataInFocus.icon,
              opacity: $scope.markDataInFocus.opacity,
              id: $scope.markDataInFocus.$id,
            });
          });
        $scope.clickMark = false;
        console.log($scope.clickMark);
      }
    });

    $scope.$on('leafletDirectiveMarker.click', function(e, args){
      console.log(args);
      if (args.model.id === undefined){
        var $id = args.model.$id;
        console.log($id);
        $scope.markInFocus = $id;
        $scope.markDataInFocus = firebaseMarks.$getRecord($id);
        // console.log($scope.markDataInFocus.uid);
      } else if (args.model.$id === undefined){
        var id = args.model.id;
        console.log(id);
        $scope.markInFocus = id;
        $scope.markDataInFocus = firebaseMarks.$getRecord(id);
        // console.log($scope.markDataInFocus.uid);
      }
    });





    this.geolocate = function(e) {
      if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(success);
        console.log("first bit done...");
      } else {
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

        firebaseMarks.$add({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          uid: $scope.userAuth.uid,
          dateAdded: Date.now(),
          icon: local_icons.leaf_icon,
          opacity: 0.6,
        }).then(function(ref) {
          var id = ref.key();
          console.log(ref);
          $scope.marks.push({
            lat: latitude,
            lng: longitude,
            icon: local_icons.leaf_icon,
            opacity: 0.6,
            id: id,
          });
        });
      }
      $scope.btn = true;
    };
}]);

