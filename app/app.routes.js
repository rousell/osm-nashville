app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'app/components/auth/authView.html',
        controller: 'AuthCtrl as authCtrl'
      })
      .when('/map', {
        templateUrl: 'app/components/map/mapView.html',
        controller: ''
      })

      .otherwise({redirectTo: '/'});
  }]);
