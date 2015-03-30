'use strict';

/**
 * Created by su on 3/23/15.
 */

angular
  .module('AppleWatchUIApp')
  .directive('home', function ($timeout, $interval) {
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

        /////////////////////////////////////////////////
        scope.$on('touchmove', function (e, moveX, moveY) {
          // apply changes to scope
          scope.$apply(function () {
            scope.deltaX = moveX;
            scope.deltaY = moveY;

            scope.scrollMoveX += moveX;
            scope.scrollMoveY += moveY;

            scope.scrollX = scope.scrollMoveX;
            scope.scrollY = scope.scrollMoveY;

            if (scope.scrollMoveX > scope.scrollRangeX) {
              scope.scrollX = scope.scrollRangeX + (scope.scrollMoveX - scope.scrollRangeX) / 2;
            }
            else if (scope.scrollX < -scope.scrollRangeX) {
              scope.scrollX = -scope.scrollRangeX + (scope.scrollMoveX + scope.scrollRangeX) / 2;
            }

            if (scope.scrollMoveY > scope.scrollRangeY) {
              scope.scrollY = scope.scrollRangeY + (scope.scrollMoveY - scope.scrollRangeY) / 2;
            }
            else if (scope.scrollY < -scope.scrollRangeY) {
              scope.scrollY = -scope.scrollRangeY + (scope.scrollMoveY + scope.scrollRangeY) / 2;
            }

            var t = scope.getTransform(100, 31.5, {'x': scope.scrollX, 'y': scope.scrollY});

            for (var i = 0; i < 19; i++) {
              var app = scope.apps[i];

              app.x = t[i].x + scope.screenW / 2 - scope.appSize / 2;
              app.y = t[i].y + scope.screenH / 2 - scope.appSize / 2;
              app.scale = t[i].scale;
            }

          });

        });

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
