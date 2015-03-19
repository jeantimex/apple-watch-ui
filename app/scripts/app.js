'use strict';

/**
 * @ngdoc overview
 * @name appleWatchUiApp
 * @description
 * # appleWatchUiApp
 *
 * Main module of the application.
 */
angular
  .module('AppleWatchUIApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .controller('AppCtrl', function ($scope, $location) {
    $scope.isActive = function (loc) {
      var pattern = new RegExp(loc);
      return pattern.test($location.path());
    };
});
