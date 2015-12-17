app.controller('ModalCtrl',
  [
  "$uibModal",
  function($uibModal) {

    this.showUploadModal = function(){
      $uibModal.open({
        templateUrl: "app/shared/upload/uploadView.html",
        controller: "UploadCtrl as uploadCtrl"
      });
    };

}]);

