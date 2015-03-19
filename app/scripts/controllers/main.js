'use strict';

/**
 * @ngdoc function
 * @name AppleWatchUIApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the AppleWatchUIApp
 */
angular.module('AppleWatchUIApp')
  .controller('MainCtrl', function ($scope) {
    
    $scope.apps = [];

    for (var i = 0; i < 25; i++) {
      $scope.apps.push({
        'name': 'app',
        'idx': i
      });
    }

  });
