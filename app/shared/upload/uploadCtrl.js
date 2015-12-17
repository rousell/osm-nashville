app.controller("UploadCtrl",
  [
  "$uibModal",
  "AuthService",
  "$firebaseObject",
  function($uibModal, AuthService, $firebaseObject) {

    this.userAuth = AuthService.$getAuth();
    this.ref = new Firebase("https://osm-nashville.firebaseio.com/Marks/");


    // this.profile = {};
    // this.userPic = $firebaseObject(this.ref.child("url"));
    // this.userName = $firebaseObject(this.ref.child("name"));

    this.cancel = function() {
      console.log("cancel");
      $uibModalInstance.dismiss('dismiss');
    };

    this.submit = function() {
      console.log(this);
      // this.ref.set({
      //   name: this.profile.name,
      //   url: this.profile.url
      // });
      // this.profile = {};
      $uibModalInstance.close('close');
    };

}]);
