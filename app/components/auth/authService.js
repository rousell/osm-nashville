app.factory("AuthService", [
  "$firebaseAuth",
  "$firebaseArray",
  function($firebaseAuth, $firebaseArray) {

    var ref = new Firebase("https://osm-nashville.firebaseio.com/");
    return $firebaseAuth(ref);


  }
]);
