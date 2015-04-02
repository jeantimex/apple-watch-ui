'use strict';

/**
 * Created by su on 3/31/15.
 */

angular
  .module('AppleWatchUIApp')
  .constant('MAX_HEX_LAYER', 5)
  .factory('TransformFactory', function (MAX_HEX_LAYER) {

    var service = {};

    var hexCoordinates = null;

    /**
     * Get absolute value
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

      return hexCoordinates;
    };

    /**
     * Calculate the transform objects
     *
     * @param idx
     * @param screenW
     * @param screenH
     * @param sphereR
     * @param hexR
     * @param scrollX
     * @param scrollY
     * @returns {{x: number, y: number, scale: number}}
     */
    service.getTransform = function (idx, screenW, screenH, sphereR, hexR, scrollX, scrollY) {
      // Step 1. Calculate the hexagonal layout in cartesian system
      var coordinates = getHexagonalCoordinates(MAX_HEX_LAYER);
      var coor = coordinates[idx];

      var hexCartesian = {
        'x': (coor.x / 2 + coor.y) * hexR + scrollX,
        'y': Math.sqrt(3) / 2 * coor.x * hexR + scrollY
      };

      // Step 2. Convert the cartesian system to polar system
      var hexPolar = cartesian2polar(hexCartesian.x, hexCartesian.y);

      // Step 3. Convert the polar system to sphere system
      var angle = hexPolar.radius / sphereR;
      var radius, depth;

      if (angle < Math.PI / 2) {
        radius = hexPolar.radius * $.easing.swing(null, angle / (Math.PI / 2), 1.5, -0.5, 1);
        depth = $.easing.easeInOutCubic(null, angle / (Math.PI / 2), 1, -0.5, 1);
      } else {
        radius = hexPolar.radius;
        depth = $.easing.easeInOutCubic(null, 1, 1, -0.5, 1);
      }

      var hexSphere = {
        'radius' : radius,
        'depth'  : depth,
        'angle'  : hexPolar.angle
      };

      // Step 4. Convert sphere system to catesian
      hexCartesian = polar2cartesian(hexSphere.radius, hexSphere.angle);

      //
      hexCartesian.x = Math.round(hexCartesian.x * 10) / 10;
      hexCartesian.y = Math.round(hexCartesian.y * 10) / 10 * 1.14;

      // Step 5.
      var x = hexCartesian.x,
          y = hexCartesian.y,
          scale = 0,
          edge = 17;

      depth = hexSphere.depth;

      // Calculate the scale
      if (abs(x) > screenW / 2 - edge || abs(y) > screenH / 2 - edge) {
        scale = depth * 0.4;
      }
      else if (abs(x) > screenW / 2 - 2 * edge && abs(y) > screenH / 2 - 2 * edge) {
        scale = Math.min(depth * $.easing.easeInOutSine(null, screenW / 2 - abs(x) - edge, 0.4, 0.6, edge),
                         depth * $.easing.easeInOutSine(null, screenH / 2 - abs(y) - edge, 0.3, 0.7, edge));
      }
      else if (abs(x) > screenW / 2 - 2 * edge) {
        scale = depth * $.easing.easeOutSine(null, screenW / 2 - abs(x) - edge, 0.4, 0.6, edge);
      }
      else if (abs(y) > screenH / 2 - 2 * edge) {
        scale = depth * $.easing.easeOutSine(null, screenH / 2 - abs(y) - edge, 0.4, 0.6, edge);
      }
      else {
        scale = depth;
      }

      // Adjust the x y position
      if (x < -screenW / 2 + 2 * edge) {
        x += $.easing.easeInSine(null, screenW / 2 - abs(x) - 2 * edge, 0, 6, 2 * edge);
      }
      else if (x > screenW / 2 - 2 * edge) {
        x += $.easing.easeInSine(null, screenW / 2 - abs(x) - 2 * edge, 0, -6, 2 * edge);
      }

      if (y < -screenH / 2 + 2 * edge) {
        y += $.easing.easeInSine(null, screenH / 2 - abs(y) - 2 * edge, 0, 8, 2 * edge);
      }
      else if (y > screenH / 2 - 2 * edge) {
        y += $.easing.easeInSine(null, screenH / 2 - abs(y) - 2 * edge, 0, -8, 2 * edge);
      }

      return {'x': x, 'y': y, 'scale': scale};
    };

    return service;

  });
