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

    var deltaX   = 0,
        deltaY   = 0,
        scrollX  = 0,
        scrollY  = 0,
        moveX    = 0,
        moveY    = 0,
        inertiaX = 0,
        inertiaY = 0,
        rangeX   = 30,
        rangeY   = 10,
        screenW  = 150,
        screenH  = 190,
        appSize  = 35,
        sphereR  = 100,
        hexR     = 32,
        numApps  = 19;

    // ---------------------------------------
    //  update apps
    // ---------------------------------------
    function transformApps() {
      var t = TransformFactory.getTransform(screenW, screenH, sphereR, hexR, scrollX, scrollY);

      for (var i = 0; i < $scope.apps.length; i++) {
        var app = $scope.apps[i];
        app.x = t[i].x + screenW / 2 - appSize / 2;
        app.y = t[i].y + screenH / 2 - appSize / 2;
        app.scale = t[i].scale;
      }
    }

    // ---------------------------------------
    //  adjust scrollX, scrollY
    // ---------------------------------------
    function adjustScrollXY(v) {
      if (scrollX > rangeX) {
        scrollX = rangeX + (scrollX - rangeX) / v;
      } else if (scrollX < -rangeX) {
        scrollX = -rangeX + (scrollX + rangeX) / v;
      }

      if (scrollY > rangeY) {
        scrollY = rangeY + (scrollY - rangeY) / v;
      } else if (scrollY < -rangeY) {
        scrollY = -rangeY + (scrollY + rangeY) / v;
      }
    }

    // ---------------------------------------
    //  touch move
    // ---------------------------------------
    $scope.$on('touchmove', function (e, dx, dy) {
      deltaX = dx;
      deltaY = dy;

      moveX += deltaX;
      moveY += deltaY;

      scrollX = moveX;
      scrollY = moveY;

      adjustScrollXY(2);

      $scope.$apply(function () {
        transformApps();
      });
    });

    // ---------------------------------------
    //  touch end
    // ---------------------------------------
    var step = 1;
    var steps = 32;
    var timer = null;

    $scope.$on('touchend', function () {
      step = 1;
      steps = 32;
      timer = $timeout(timeoutHandler, 16);
    });

    function timeoutHandler() {
      $scope.$apply(function () {
        $scope.finishMove(step++, steps, deltaX * 10, deltaY * 10);
      });

      if (step < steps) {
        timer = $timeout(timeoutHandler, 16);
      }
    }

    // ---------------------------------------
    //  finish move
    // ---------------------------------------
    $scope.finishMove = function (step, steps, dx, dy) {
      moveX = scrollX;
      moveY = scrollY;

      // add some inertia
      inertiaX = $.easing.easeOutCubic(null, step, 0, dx, steps) - $.easing.easeOutCubic(null, (step - 1), 0, dx, steps);
      inertiaY = $.easing.easeOutCubic(null, step, 0, dy, steps) - $.easing.easeOutCubic(null, (step - 1), 0, dy, steps);

      scrollX += inertiaX;
      scrollY += inertiaY;

      adjustScrollXY(4);

      transformApps();
    };

    // ---------------------------------------
    //  initialize
    // ---------------------------------------
    function init() {
      for (var i = 0; i < numApps; i++) {
        $scope.apps.push({'x': 0, 'y': 0, 'z': 0, 'scale': 0});
      }

      transformApps();
    }

    init();
  });
