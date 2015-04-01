'use strict';

/**
 * @ngdoc function
 * @name AppleWatchUIApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the AppleWatchUIApp
 */
angular.module('AppleWatchUIApp')
  .controller('HomeCtrl', function ($scope, $timeout, TransformFactory) {
    $scope.apps = [];

    $scope.deltaX = 0;
    $scope.deltaY = 0;

    var scrollX = 0;
    var scrollY = 0;

    var scrollMoveX = 0;
    var scrollMoveY = 0;

    var scrollRangeX = 30;
    var scrollRangeY = 10;

    var inertiaX = 0;
    var inertiaY = 0;

    var screenW = 150;
    var screenH = 190;

    var appSize = 37;

    var numApps = 19;

    ///////////////////////////////////
    var transformApps = function (t) {
      for (var i = 0; i < $scope.apps.length; i++) {
        var app = $scope.apps[i];

        app.x = t[i].x + screenW / 2 - appSize / 2;
        app.y = t[i].y + screenH / 2 - appSize / 2;
        app.scale = t[i].scale;
      }
    };

    var init = function () {
      for (var i = 0; i < numApps; i++) {
        $scope.apps.push({'x': 0, 'y': 0, 'z': 0, 'scale': 0});
      }

      var t = TransformFactory.getTransform(150, 190, 100, 31.5, 0, 0);
      transformApps(t);
    };

    ///////////////////////////////////
    $scope.$on('touchmove', function (e, moveX, moveY) {
      $scope.$apply(function () {
        $scope.deltaX = moveX;
        $scope.deltaY = moveY;

        scrollMoveX += moveX;
        scrollMoveY += moveY;

        scrollX = scrollMoveX;
        scrollY = scrollMoveY;

        if (scrollMoveX > scrollRangeX) {
          scrollX = scrollRangeX + (scrollMoveX - scrollRangeX) / 2;
        }
        else if (scrollX < -scrollRangeX) {
          scrollX = -scrollRangeX + (scrollMoveX + scrollRangeX) / 2;
        }

        if (scrollMoveY > scrollRangeY) {
          scrollY = scrollRangeY + (scrollMoveY - scrollRangeY) / 2;
        }
        else if (scrollY < -scrollRangeY) {
          scrollY = -scrollRangeY + (scrollMoveY + scrollRangeY) / 2;
        }

        var t = TransformFactory.getTransform(150, 190, 100, 31.5, scrollX, scrollY);
        transformApps(t);
      });
    });

    ///////////////////////////////////
    var step = 1;
    var steps = 32;
    var timer = null;

    $scope.$on('touchend', function () {
      step = 1;
      steps = 32;
      timer = $timeout(handler, 16);
    });

    var handler = function () {
      $scope.$apply(function () {
        $scope.finishMove(step++, steps, $scope.deltaX * 10, $scope.deltaY * 10);
      });

      if (step < steps) {
        timer = $timeout(handler, 16);
      }
    };

    ///////////////////////////////////
    $scope.finishMove = function (step, steps, distanceX, distanceY) {
      scrollMoveX = scrollX;
      scrollMoveY = scrollY;

      inertiaX = $.easing["easeOutCubic"](null, step, 0, distanceX, steps) - $.easing["easeOutCubic"](null, (step - 1), 0, distanceX, steps);
      inertiaY = $.easing["easeOutCubic"](null, step, 0, distanceY, steps) - $.easing["easeOutCubic"](null, (step - 1), 0, distanceY, steps);

      scrollX += inertiaX;
      scrollY += inertiaY;

      if (scrollX > scrollRangeX) {
        scrollX -= (scrollX - scrollRangeX) / 4;
      }
      else if (scrollX < -scrollRangeX) {
        scrollX -= (scrollX + scrollRangeX) / 4;
      }

      if (scrollY > scrollRangeY) {
        scrollY -= (scrollY - scrollRangeY) / 4;
      }
      else if (scrollY < -scrollRangeY) {
        scrollY -= (scrollY + scrollRangeY) / 4;
      }

      var t = TransformFactory.getTransform(150, 190, 100, 31.5, scrollX, scrollY);
      transformApps(t);
    };

    ///////////////////////////////////
    init();
  });
