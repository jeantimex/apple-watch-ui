'use strict';

/**
 * @ngdoc function
 * @name AppleWatchUIApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the AppleWatchUIApp
 */
angular.module('AppleWatchUIApp')
  .controller('HomeCtrl', function ($scope, TransformFactory) {
    $scope.apps = [];

    $scope.deltaX = 0;
    $scope.deltaY = 0;

    $scope.scrollX = 0;
    $scope.scrollY = 0;

    $scope.scrollMoveX = 0;
    $scope.scrollMoveY = 0;

    $scope.scrollRangeX = 30;
    $scope.scrollRangeY = 10;

    $scope.inertia = null;
    $scope.inertiaX = 0;
    $scope.inertiaY = 0;

    $scope.screenW = 150;
    $scope.screenH = 190;

    $scope.appSize = 37;

    ///////////////////////////////////
    $scope.$on('touchmove', function (e, moveX, moveY) {
      $scope.$apply(function () {
        $scope.deltaX = moveX;
        $scope.deltaY = moveY;

        $scope.scrollMoveX += moveX;
        $scope.scrollMoveY += moveY;

        $scope.scrollX = $scope.scrollMoveX;
        $scope.scrollY = $scope.scrollMoveY;

        if ($scope.scrollMoveX > $scope.scrollRangeX) {
          $scope.scrollX = $scope.scrollRangeX + ($scope.scrollMoveX - $scope.scrollRangeX) / 2;
        }
        else if ($scope.scrollX < -$scope.scrollRangeX) {
          $scope.scrollX = -$scope.scrollRangeX + ($scope.scrollMoveX + $scope.scrollRangeX) / 2;
        }

        if ($scope.scrollMoveY > $scope.scrollRangeY) {
          $scope.scrollY = $scope.scrollRangeY + ($scope.scrollMoveY - $scope.scrollRangeY) / 2;
        }
        else if ($scope.scrollY < -$scope.scrollRangeY) {
          $scope.scrollY = -$scope.scrollRangeY + ($scope.scrollMoveY + $scope.scrollRangeY) / 2;
        }

        var t = TransformFactory.getTransform(150, 190, 100, 31.5, $scope.scrollX, $scope.scrollY);

        for (var i = 0; i < 19; i++) {
          var app = $scope.apps[i];
          app.x = t[i].x + $scope.screenW / 2 - $scope.appSize / 2;
          app.y = t[i].y + $scope.screenH / 2 - $scope.appSize / 2;
          app.scale = t[i].scale;
        }
      });
    });

    ///////////////////////////////////
    $scope.finishMove = function (step, steps, distanceX, distanceY) {
      $scope.scrollMoveX = $scope.scrollX;
      $scope.scrollMoveY = $scope.scrollY;

      $scope.inertiaX = $.easing["easeOutCubic"](null, step, 0, distanceX, steps) - $.easing["easeOutCubic"](null, (step - 1), 0, distanceX, steps);
      $scope.inertiaY = $.easing["easeOutCubic"](null, step, 0, distanceY, steps) - $.easing["easeOutCubic"](null, (step - 1), 0, distanceY, steps);

      $scope.scrollX += $scope.inertiaX;
      $scope.scrollY += $scope.inertiaY;

      if ($scope.scrollX > $scope.scrollRangeX) {
        $scope.scrollX -= ($scope.scrollX - $scope.scrollRangeX) / 4;
      }
      else if ($scope.scrollX < -$scope.scrollRangeX) {
        $scope.scrollX -= ($scope.scrollX + $scope.scrollRangeX) / 4;
      }

      if ($scope.scrollY > $scope.scrollRangeY) {
        $scope.scrollY -= ($scope.scrollY - $scope.scrollRangeY) / 4;
      }
      else if ($scope.scrollY < -$scope.scrollRangeY) {
        $scope.scrollY -= ($scope.scrollY + $scope.scrollRangeY) / 4;
      }

      var t = TransformFactory.getTransform(150, 190, 100, 31.5, $scope.scrollX, $scope.scrollY);

      for (var i = 0; i < 19; i++) {
        var app = $scope.apps[i];

        app.x = t[i].x + $scope.screenW / 2 - $scope.appSize / 2;
        app.y = t[i].y + $scope.screenH / 2 - $scope.appSize / 2;
        app.scale = t[i].scale;
      }
    };

    ///////////////////////////////////
    var t = TransformFactory.getTransform(150, 190, 100, 31.5, 0, 0);

    for (var i = 0; i < 19; i++) {
      $scope.apps.push({
        'x': t[i].x + $scope.screenW / 2 - $scope.appSize / 2,
        'y': t[i].y + $scope.screenH / 2 - $scope.appSize / 2,
        'z': 0,
        'scale': t[i].scale
      });
    }


  });
