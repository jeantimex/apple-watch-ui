'use strict';

/**
 * @ngdoc function
 * @name AppleWatchUIApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the AppleWatchUIApp
 */
angular.module('AppleWatchUIApp')
  .constant('RANGE_X',          30)
  .constant('RANGE_Y',          10)
  .constant('APP_SIZE',         37)
  .constant('TIMEOUT_STEPS',    30)
  .constant('TIMEOUT_INTERVAL', 15)
  .controller('HomeCtrl', function ($scope, $timeout, $log, AppService, TransformFactory,
                                    TIMEOUT_INTERVAL, TIMEOUT_STEPS, RANGE_X, RANGE_Y, APP_SIZE) {
    var screenW  = 135,
        screenH  = 170,
        scrollX  = 0,
        scrollY  = 0,
        sphereR  = 100,
        hexR     = 32,
        maxApp   = null;

    // All apps
    $scope.apps = [];

    // ---------------------------------------
    //  update apps
    // ---------------------------------------
    function transformApps() {
      var maxScale = 0;

      for (var i = 0; i < $scope.apps.length; i++) {
        var app = $scope.apps[i],
            tf = TransformFactory.getTransform(i, screenW, screenH, sphereR, hexR, scrollX, scrollY);

        app.x = tf.x + screenW / 2 - APP_SIZE / 2;
        app.y = tf.y + screenH / 2 - APP_SIZE / 2;
        app.scale = tf.scale;

        // Get the current app that has max size
        if (app.scale > maxScale) {
          maxScale = app.scale;
          maxApp = app;
        }
      }
    }

    // ---------------------------------------
    //  touch move
    // ---------------------------------------
    $scope.$on('touchmove', function (e, dx, dy) {
      // Based on the current max size app
      // we adjust the scroll speed
      var v = angular.isObject(maxApp) ? maxApp.scale : 1;

      scrollX += dx * v;
      scrollY += dy * v;

      $scope.$apply(function () {
        transformApps();
      });
    });

    // ---------------------------------------
    //  touch end
    // ---------------------------------------
    $scope.$on('touchend', function () {
      if (angular.isObject(maxApp) && maxApp.scale < 0.6) {
        var distX = screenW / 2 - APP_SIZE / 2 - maxApp.x,
            distY = screenH / 2 - APP_SIZE / 2 - maxApp.y;

        $timeout(function () {
          timeoutHandler(1, distX, distY);
        }, TIMEOUT_INTERVAL);
      }
    });

    /**
     *
     */
    function timeoutHandler(step, distX, distY) {
      // Apply some inertia
      scrollX += $.easing.easeOutCubic(null, step, 0, distX, TIMEOUT_STEPS) - $.easing.easeOutCubic(null, (step - 1), 0, distX, TIMEOUT_STEPS);
      scrollY += $.easing.easeOutCubic(null, step, 0, distY, TIMEOUT_STEPS) - $.easing.easeOutCubic(null, (step - 1), 0, distY, TIMEOUT_STEPS);

      $scope.$apply(function () {
        transformApps();
      });

      if (step < TIMEOUT_STEPS) {
        $timeout(function () {
          timeoutHandler(++step, distX, distY);
        }, TIMEOUT_INTERVAL);
      }
    }

    // ---------------------------------------
    //  initialize
    // ---------------------------------------
    function init() {
      // Load apps
      AppService.loadApps()
        .then(function (data) {
          $scope.apps = data;
          transformApps();
        }, function (err) {
          $log.error(err);
        });
    }

    init();
  });
