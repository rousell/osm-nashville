app.factory("AuthService", [
  "$firebaseAuth",
  function($firebaseAuth) {

    var ref = new Firebase("https://osm-nashville.firebaseio.com/");
    return $firebaseAuth(ref);

  }
]);
