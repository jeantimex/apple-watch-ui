'use strict';

/**
 * @ngdoc function
 * @name AppleWatchUIApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the AppleWatchUIApp
 */
angular.module('AppleWatchUIApp')
  .controller('HomeCtrl', function ($scope, TransformService) {
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

    ///////////////////////////////
    $scope.getTransform = function (sphereR, hexR, scroll) {
      var screenW = 150;
      var screenH = 190;

      // Hex cube
      var hexCube = [];

      for (var i = 0; i < 4; i++) {
        for (var j = -i; j <= i; j++) {
          for (var k = -i; k <= i; k++) {
            for (var l = -i; l <= i; l++) {
              if (Math.abs(j) + Math.abs(k) + Math.abs(l) === i * 2 && j + k + l === 0) {
                hexCube.push([j, k, l]);
              }
            }
          }
        }
      }

      var hexCubeOrtho = [],
        hexCubePolar = [],
        hexCubeSphere = [];

      var scrollX = scroll.x,
        scrollY = scroll.y;

      function polar2ortho(r, rad) {
        var x = r * Math.cos(rad);
        var y = r * Math.sin(rad);
        return {
          "x"	: x,
          "y"	: y
        }
      }

      function ortho2polar(x, y) {
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        var rad = Math.atan2(y, x);
        return {
          "r"		: r,
          "rad"	: rad
        }
      }

      for (var i in hexCube) {
        hexCubeOrtho[i] = {
          "x": (hexCube[i][1] + hexCube[i][0] / 2) * hexR + scrollX,
          "y": Math.sqrt(3) / 2 * hexCube[i][0] * hexR + scrollY
        }
      }

      for (var i in hexCubeOrtho) {
        hexCubePolar[i] = ortho2polar(hexCubeOrtho[i].x, hexCubeOrtho[i].y);
      }


      for (var i in hexCubePolar) {
        var rad = hexCubePolar[i].r / sphereR;

        if (rad < Math.PI/2)
        {
          var r = hexCubePolar[i].r * $.easing["swing"](null, rad / (Math.PI/2), 1.5, -0.5, 1);
          var deepth = $.easing["easeInOutCubic"](null, rad / (Math.PI/2), 1, -0.5, 1);
        }
        else
        {
          var r = hexCubePolar[i].r;
          var deepth = $.easing["easeInOutCubic"](null, 1, 1, -0.5, 1);
        }

        hexCubeSphere[i] = {
          "r" : r,
          "deepth" : deepth,
          "rad" : hexCubePolar[i].rad
        }
      }


      for (var i in hexCubeSphere) {
        hexCubeOrtho[i] = polar2ortho(hexCubeSphere[i].r, hexCubeSphere[i].rad);
      }

      for (var i in hexCubeOrtho) {
        hexCubeOrtho[i].x = Math.round(hexCubeOrtho[i].x * 10) / 10;
        hexCubeOrtho[i].y = Math.round(hexCubeOrtho[i].y * 10) / 10 *1.14;
      }

      var edge = 17;


      for (var i in hexCubeOrtho) {
        if (Math.abs(hexCubeOrtho[i].x) > screenW/2 - edge || Math.abs(hexCubeOrtho[i].y) > screenH/2 - edge) {
          hexCubeOrtho[i].scale = hexCubeSphere[i].deepth * 0.4;
        }
        else if (Math.abs(hexCubeOrtho[i].x) > screenW/2 - 2 * edge && Math.abs(hexCubeOrtho[i].y) > screenH/2 - 2 * edge) {
          hexCubeOrtho[i].scale = Math.min(hexCubeSphere[i].deepth * $.easing["easeInOutSine"](null, screenW/2 - Math.abs(hexCubeOrtho[i].x) - edge, 0.4, 0.6, edge), hexCubeSphere[i].deepth * $.easing["easeInOutSine"](null, screenH/2 - Math.abs(hexCubeOrtho[i].y) - edge, 0.3, 0.7, edge) );
        }
        else if (Math.abs(hexCubeOrtho[i].x) > screenW/2 - 2 * edge) {
          hexCubeOrtho[i].scale = hexCubeSphere[i].deepth * $.easing["easeOutSine"](null, screenW/2 - Math.abs(hexCubeOrtho[i].x) - edge, 0.4, 0.6, edge);
        }
        else if(Math.abs(hexCubeOrtho[i].y) > screenH/2 - 2 * edge) {
          hexCubeOrtho[i].scale = hexCubeSphere[i].deepth * $.easing["easeOutSine"](null, screenH/2 - Math.abs(hexCubeOrtho[i].y) - edge, 0.4, 0.6, edge);
        }
        else {
          hexCubeOrtho[i].scale = hexCubeSphere[i].deepth;
        }
      }

      for (var i in hexCubeOrtho){
        if (hexCubeOrtho[i].x < -screenW/2 + 2 * edge) {
          hexCubeOrtho[i].x += $.easing["easeInSine"](null, screenW/2 - Math.abs(hexCubeOrtho[i].x) - 2 * edge, 0, 6, 2 * edge);
        }
        else if (hexCubeOrtho[i].x > screenW/2 - 2 * edge) {
          hexCubeOrtho[i].x += $.easing["easeInSine"](null, screenW/2 - Math.abs(hexCubeOrtho[i].x) - 2 * edge, 0, -6, 2 * edge);
        }

        if (hexCubeOrtho[i].y < -screenH/2 + 2 * edge) {
          hexCubeOrtho[i].y += $.easing["easeInSine"](null, screenH/2 - Math.abs(hexCubeOrtho[i].y) - 2 * edge, 0, 8, 2 * edge);
        }
        else if(hexCubeOrtho[i].y > screenH/2 - 2 * edge) {
          hexCubeOrtho[i].y += $.easing["easeInSine"](null, screenH/2 - Math.abs(hexCubeOrtho[i].y) - 2 * edge, 0, -8, 2 * edge);
        }
      }

      return hexCubeOrtho;
    };

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

      var t = $scope.getTransform(100, 31.5, {'x': $scope.scrollX, 'y': $scope.scrollY});

      for (var i = 0; i < 19; i++) {
        var app = $scope.apps[i];

        app.x = t[i].x + $scope.screenW / 2 - $scope.appSize / 2;
        app.y = t[i].y + $scope.screenH / 2 - $scope.appSize / 2;
        app.scale = t[i].scale;
      }
    };

    ///////////////////////////////////
    var t = $scope.getTransform(100, 31.5, {'x': 0, 'y': 0});

    for (var i = 0; i < 19; i++) {
      $scope.apps.push({
        'x': t[i].x + $scope.screenW / 2 - $scope.appSize / 2,
        'y': t[i].y + $scope.screenH / 2 - $scope.appSize / 2,
        'z': 0,
        'scale': t[i].scale
      });
    }

  });
