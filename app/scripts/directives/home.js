'use strict';

/**
 * Created by su on 3/23/15.
 */

angular
  .module('AppleWatchUIApp')
  .directive('home', function () {
    return {
      restrict: 'E',

      controller: function ($scope) {
        $scope.originX = 0;
        $scope.originY = 0;

        // Load apps
        $scope.apps = [];

        var base = 40;

        for (var i = 0; i < 20; i++) {
          var row = parseInt(i / 4),
              col = parseInt(i % 4);

          var offset = row % 2 === 0 ? 0 : 22.5;

          var x = offset + col * (base + 5),
              y = row * base;

          $scope.apps.push({
            'x'     : x,
            'y'     : y,
            'z'     : 0,
            'scale' : 1
          });
        }

      },

      link: function (scope, element) {

        element.addClass('screen home');

        scope.$on('move', function (e, moveX, moveY) {
          // apply changes to scope
          scope.$apply(function () {
            scope.originX += moveX;
            scope.originY += moveY;

            for (var i = 0; i < scope.apps.length; i++) {
              var app = scope.apps[i];
              app.x += moveX;
              app.y += moveY;
            }
          });

        });
      }
    };
  });
