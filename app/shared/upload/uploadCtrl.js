app.controller("UploadCtrl",
  [
  "$uibModal",
  "AuthService",
  "$firebaseObject",
  "$uibModalInstance",
  function($uibModal, AuthService, $firebaseObject, $uibModalInstance) {

    this.userAuth = AuthService.$getAuth();
    this.ref = new Firebase("https://osm-nashville.firebaseio.com/Marks/");
    this.data = "none";
    var ImgObj = $firebaseObject(this.ref.child("Images"));

    // this.profile = {};
    // this.userPic = $firebaseObject(this.ref.child("url"));
    // this.userName = $firebaseObject(this.ref.child("name"));

    this.cancel = function() {
      console.log("cancel");
      $uibModalInstance.dismiss('dismiss');
    };

    this.add = function(e1) {
      console.log('e1', e1);
      var f = e1.target.files[0],
          r = new FileReader();
      r.onload = function(e) {
        this.data = e.target.result;
        ImgObj.data = e.target.result;
        Img.$save().then(function(val){

        }, function (error) {
          console.log("ERROR", error);
        });
      };
      r.readAsDataURL(f);
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
