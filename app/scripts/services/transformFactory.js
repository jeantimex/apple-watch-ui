'use strict';

/**
 * Created by su on 3/31/15.
 */

angular
  .module('AppleWatchUIApp')
  .factory('TransformFactory', function () {

    var service = {};

    var hexCoordinates = null;

    /**
     *
     * @param num
     * @returns {number}
     */
    var abs = function (num) {
      return Math.abs(num);
    };

    /**
     * Convert polar system to cartesian system
     *
     * @param radius
     * @param angle
     * @returns {{x: number, y: number}}
     */
    var polar2cartesian = function (radius, angle) {
      var x = radius * Math.cos(angle),
          y = radius * Math.sin(angle);

      return {'x': x, 'y': y};
    };

    /**
     * Convert cartesian system to polar system
     *
     * @param x
     * @param y
     * @returns {{radius: number, angle: number}}
     */
    var cartesian2polar = function (x, y) {
      var radius = Math.sqrt(x * x + y * y),
          angle = Math.atan2(y, x);

      return {'radius': radius, 'angle': angle};
    };

    /**
     * Get hexagonal layout coordinates
     * http://stackoverflow.com/questions/2049196/generating-triangular-hexagonal-coordinates-xyz
     *
     * @param layer
     */
    var getHexagonalCoordinates = function (layer) {
      var res = [];

      if (!angular.isArray(hexCoordinates)) {
        hexCoordinates = [];

        for (var i = 0; i < layer; i++) {
          for (var j = -i; j <= i; j++) {
            for (var k = -i; k <= i; k++) {
              for (var l = -i; l <= i; l++) {
                if (Math.abs(j) + Math.abs(k) + Math.abs(l) === i * 2 && j + k + l === 0) {
                  hexCoordinates.push({'x': j, 'y': k, 'z': l});
                }
              }
            }
          }
        }
      }

      angular.copy(hexCoordinates, res);

      return res;
    };

    /**
     *
     *
     * @param screenW
     * @param screenH
     * @param sphereR
     * @param hexR
     * @param scrollX
     * @param scrollY
     * @returns {Array}
     */
    service.getTransform = function (screenW, screenH, sphereR, hexR, scrollX, scrollY) {
      // Step 1. Calculate the hexagonal layout in cartesian system
      var hexCartesian = [];
      var coordinates = getHexagonalCoordinates(4);
      var len = coordinates.length;

      for (i = 0; i < len; i++) {
        var coor = coordinates[i];

        hexCartesian.push({
          'x': (coor.x / 2 + coor.y) * hexR + scrollX,
          'y': Math.sqrt(3) / 2 * coor.x * hexR + scrollY
        });
      }

      // Step 2. Convert the cartesian system to polar system
      var hexPolar = [];

      for (var i = 0; i < len; i++) {
        hexPolar[i] = cartesian2polar(hexCartesian[i].x, hexCartesian[i].y);
      }

      // Step 3. Convert the polar system to sphere system
      var hexSphere = [];

      for (i = 0; i < len; i++) {
        var angle = hexPolar[i].radius / sphereR;
        var radius, depth;

        if (angle < Math.PI / 2) {
          radius = hexPolar[i].radius * $.easing["swing"](null, angle / (Math.PI / 2), 1.5, -0.5, 1);
          depth = $.easing["easeInOutCubic"](null, angle / (Math.PI / 2), 1, -0.5, 1);
        } else {
          radius = hexPolar[i].radius;
          depth = $.easing["easeInOutCubic"](null, 1, 1, -0.5, 1);
        }

        hexSphere[i] = {
          'radius' : radius,
          'depth'  : depth,
          'angle'  : hexPolar[i].angle
        }
      }

      // Step 4. Convert sphere system to catesian
      for (i = 0; i < len; i++) {
        hexCartesian[i] = polar2cartesian(hexSphere[i].radius, hexSphere[i].angle);

        //
        hexCartesian[i].x = Math.round(hexCartesian[i].x * 10) / 10;
        hexCartesian[i].y = Math.round(hexCartesian[i].y * 10) / 10 * 1.14;
      }

      // Step 5.
      var edge = 17;

      for (i = 0; i < len; i++) {
        var obj = hexCartesian[i],
            x = obj.x,
            y = obj.y;

        depth = hexSphere[i].depth;

        // Calculate the scale
        if (abs(x) > screenW / 2 - edge || abs(y) > screenH / 2 - edge) {
          obj.scale = depth * 0.4;
        }
        else if (abs(x) > screenW / 2 - 2 * edge && abs(y) > screenH / 2 - 2 * edge) {
          obj.scale = Math.min(depth * $.easing["easeInOutSine"](null, screenW / 2 - abs(x) - edge, 0.4, 0.6, edge),
                               depth * $.easing["easeInOutSine"](null, screenH / 2 - abs(y) - edge, 0.3, 0.7, edge) );
        }
        else if (abs(x) > screenW / 2 - 2 * edge) {
          obj.scale = depth * $.easing["easeOutSine"](null, screenW / 2 - abs(x) - edge, 0.4, 0.6, edge);
        }
        else if (abs(y) > screenH / 2 - 2 * edge) {
          obj.scale = depth * $.easing["easeOutSine"](null, screenH / 2 - abs(y) - edge, 0.4, 0.6, edge);
        }
        else {
          obj.scale = depth;
        }

        // Adjust the x y position
        if (x < -screenW / 2 + 2 * edge) {
          obj.x += $.easing["easeInSine"](null, screenW / 2 - abs(x) - 2 * edge, 0, 6, 2 * edge);
        }
        else if (x > screenW / 2 - 2 * edge) {
          obj.x += $.easing["easeInSine"](null, screenW / 2 - abs(x) - 2 * edge, 0, -6, 2 * edge);
        }

        if (y < -screenH / 2 + 2 * edge) {
          obj.y += $.easing["easeInSine"](null, screenH / 2 - abs(y) - 2 * edge, 0, 8, 2 * edge);
        }
        else if(y > screenH / 2 - 2 * edge) {
          obj.y += $.easing["easeInSine"](null, screenH / 2 - abs(y) - 2 * edge, 0, -8, 2 * edge);
        }
      }

      return hexCartesian;
    };

    return service;

  });
