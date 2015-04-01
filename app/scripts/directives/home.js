'use strict';

/**
 * Created by su on 3/23/15.
 */

angular
  .module('AppleWatchUIApp')
  .directive('home', function ($timeout) {
    return {
      restrict: 'E',

      link: function (scope, element) {
        element.addClass('screen home');

        var step = 1;
        var steps = 32;
        var veloX = 0;
        var veloY = 0;
        var distanceX = 0;
        var distanceY = 0;
        var timer = null;

        var handler = function () {
          scope.$apply(function () {
            scope.finishMove(step, steps, distanceX, distanceY);
          });

          step++;

          if (step < steps) {
            timer = $timeout(handler, 16);
          }
        };

        /////////////////////////////////
        scope.$on('touchend', function (e) {
          step = 1;
          steps = 32;
          veloX = scope.deltaX;
          veloY = scope.deltaY;
          distanceX = veloX * 10;
          distanceY = veloY * 10;

          timer = $timeout(handler, 16);
        });
      }
    };
  });
