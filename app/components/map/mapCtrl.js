app.controller('MapCtrl', [ '$scope', 'leafletData', '$firebaseArray', 'AuthService', '$location', 'leafletMarkerEvents', function($scope, leafletData, $firebaseArray, AuthService, $location, leafletMarkerEvents) {

    var ref = new Firebase("https://osm-nashville.firebaseio.com/Marks");
    var firebaseMarks = $firebaseArray(ref);
    $scope.btn = false;
    $scope.clickMark = false;
    $scope.markInFocus = "";
    $scope.markDataInFocus = {};
    $scope.marks = [];
    $scope.userAuth = AuthService.$getAuth();
    $scope.srcData = "";

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
        name: "name",
        description: "",
        votes: 0,
        images: "",
        editable: true,
      });
    };
    firebaseMarks.$loaded()
      .then(function(){
        angular.forEach(firebaseMarks, function(mark) {
          if (mark.uid === $scope.userAuth.uid ){
            mark.editable = true;
            mark.voting = false;
          } else {
            mark.editable = false;
            mark.voting = true;
          }
          $scope.marks.push(mark);
          // console.log("these are the marks on the map, ", mark);
          });
      });

    this.encodeImageFileAsURL = function(){
      var filesSelected = document.getElementById("inputFileToLoad").files;
      if (filesSelected.length > 0){
        var fileToLoad = filesSelected[0];

        var fileReader = new FileReader();

        fileReader.onload = function(fileLoadedEvent) {
            $scope.srcData = fileLoadedEvent.target.result; // <--- data: base64
            // $scope.srcData = files[0].getAsDataURL();

            var newImage = document.createElement('img');
            newImage.src = $scope.srcData;
// newImage.outerHTML
            $scope.markDataInFocus.images = $scope.srcData;
            firebaseMarks.$save($scope.markDataInFocus)
              .then(function(ref){
                console.log(ref);
                $scope.markDataInFocus.images = "";
                $scope.srcData = "";
            });
        };
        fileReader.readAsDataURL(fileToLoad);
      }
    };

    // this.add = function(e1) {
    //   console.log('e1', e1);
    //   var f = e1.target.files[0],
    //       r = new FileReader();
    //   r.onload = function(e) {
    //     this.data = e.target.result;
    //     ImgObj.data = e.target.result;
    //     Img.$save().then(function(val){

    //     }, function (error) {
    //       console.log("ERROR", error);
    //     });
    //   };
    //   r.readAsDataURL(f);
    // };

    this.saveBtn = function(){
      // console.log("add mark button clicked");
      firebaseMarks.$save($scope.markDataInFocus)
        .then(function(ref){
          console.log(ref);
        });
    };

    this.clickMark = function(){
      $scope.clickMark = true;
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
            // console.log($scope.markDataInFocus);
            // console.log("added record with $id " + $id);

            $scope.marks.push({
              lat: $scope.markDataInFocus.lat,
              lng: $scope.markDataInFocus.lng,
              icon: $scope.markDataInFocus.icon,
              opacity: $scope.markDataInFocus.opacity,
              id: $scope.markDataInFocus.$id,
              editable: true,
            });
          });
        $scope.clickMark = false;
        // console.log($scope.clickMark);
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
        console.log($scope.markDataInFocus);
        // console.log($scope.markDataInFocus.uid);
      }
    });

    this.deleteMark = function($id) {
      console.log("clicked");
      var index = firebaseMarks.$indexFor($id);
      var mark = firebaseMarks[index];
      firebaseMarks.$remove(mark).then(function(ref){
        console.log("item was removed, here's some reference ", ref);
        $scope.marks.splice(index,1);
      });
      $scope.markDataInFocus = {};
      $scope.markInFocus = "";
    };

    this.upVote = function($id) {
      var index = firebaseMarks.$indexFor($id);
      var mark = firebaseMarks[index];
      if ($scope.markDataInFocus.voting === true) {
        $scope.markDataInFocus.votes += 1;
        console.log("vote num ", $scope.markDataInFocus.votes);
      }
      firebaseMarks.$save(mark).then(function(ref){
        console.log("item was removed, here's some reference ", ref);
      });
      console.log($scope.markDataInFocus);
    };

    this.geolocate = function(e) {
      if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(success);
        // console.log("first bit done...");
      } else {
        console.log("Geolocation wasn't possible :(");
      }
      function success(pos){
        var latitude = pos.coords.latitude.toFixed(5);
        var longitude = pos.coords.longitude.toFixed(5);
        // console.log("geolocation is done! : ", latitude, longitude);

        $location.search({ c: latitude+':'+longitude+':'+16});

        $scope.$on("centerUrlHash", function(event, centerHash) {
          // console.log("url", centerHash);
          $location.search({ c: centerHash });
        });

        firebaseMarks.$add({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          uid: $scope.userAuth.uid,
          dateAdded: Date.now(),
          icon: local_icons.leaf_icon,
          opacity: 0.6,
          name: "name",
          description: "",
          votes: 0,
          images: "",
          editable: true,
        }).then(function(ref) {
          var $id = ref.key();
          $scope.markInFocus = $id;
          $scope.markDataInFocus = firebaseMarks.$getRecord($scope.markInFocus);
          console.log("markDataInFocus", $scope.markDataInFocus);
        });
      }
      $scope.btn = true;
    };
}]);

