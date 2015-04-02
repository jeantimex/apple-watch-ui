'use strict';

/**
 * @ngdoc function
 * @name AppleWatchUIApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the AppleWatchUIApp
 */
angular.module('AppleWatchUIApp')
  .constant('TIMEOUT_INTERVAL', 15)
  .constant('RANGE_X',          30)
  .constant('RANGE_Y',          10)
  .constant('APP_SIZE',         35)
  .controller('HomeCtrl', function ($scope, $timeout, TransformFactory,
                                    TIMEOUT_INTERVAL, RANGE_X, RANGE_Y, APP_SIZE) {
    var screenW  = 150,
        screenH  = 190,
        scrollX  = 0,
        scrollY  = 0,
        moveX    = 0,
        moveY    = 0,
        sphereR  = 100,
        hexR     = 32,
        numApps  = 19;

    // All apps
    $scope.apps = [];

    // ---------------------------------------
    //  update apps
    // ---------------------------------------
    function transformApps() {
      for (var i = 0; i < $scope.apps.length; i++) {
        var app = $scope.apps[i],
            tf = TransformFactory.getTransform(i, screenW, screenH, sphereR, hexR, scrollX, scrollY);

        app.x = tf.x + screenW / 2 - APP_SIZE / 2;
        app.y = tf.y + screenH / 2 - APP_SIZE / 2;
        app.scale = tf.scale;
      }
    }

    // ---------------------------------------
    //  adjust scrollX, scrollY
    // ---------------------------------------
    function adjustScrollXY(v) {
      if (scrollX > RANGE_X) {
        scrollX = RANGE_X + (scrollX - RANGE_X) / v;
      } else if (scrollX < -RANGE_X) {
        scrollX = -RANGE_X + (scrollX + RANGE_X) / v;
      }

      if (scrollY > RANGE_Y) {
        scrollY = RANGE_Y + (scrollY - RANGE_Y) / v;
      } else if (scrollY < -RANGE_Y) {
        scrollY = -RANGE_Y + (scrollY + RANGE_Y) / v;
      }
    }

    // ---------------------------------------
    //  touch move
    // ---------------------------------------
    $scope.$on('touchmove', function (e, dx, dy) {
      moveX += dx;
      moveY += dy;

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
    var timer = null;

    $scope.$on('touchend', function () {
      timer = $timeout(timeoutHandler, TIMEOUT_INTERVAL);
    });

    function timeoutHandler() {
      // TODO...

      if (step < steps) {
        timer = $timeout(timeoutHandler, TIMEOUT_INTERVAL);
      }
    }

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
