var app = angular.module("osm-nashville", ['ngRoute', 'firebase', 'ui-leaflet', 'ngMaterial'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('yellow')
    .accentPalette('brown');
});
