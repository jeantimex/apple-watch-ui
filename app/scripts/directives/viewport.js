'use strict';

/**
 * Created by su on 3/24/15.
 */

angular
  .module('AppleWatchUIApp')
  .directive('viewport', function ($window) {
    return {
      restrict: 'E',

      // -----------------------------
      //  Controller
      // -----------------------------
      controller: function () {

      },

      // -----------------------------
      //  Link
      // -----------------------------
      link: function (scope, element) {
        // add css class
        element.addClass('viewport');

        // touch
        element.on('touchstart mousedown', function(e) {
          var window = angular.element($window);

          var lastX = e.originalEvent.pageX,
              lastY = e.originalEvent.pageY;

          // stop moving
          window.off('touchmove mousemove');

          // move
          window.on('touchmove mousemove', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var moveX = e.originalEvent.pageX - lastX;
            var moveY = e.originalEvent.pageY - lastY;

            scope.$broadcast('move', moveX, moveY);

            lastX = e.originalEvent.pageX;
            lastY = e.originalEvent.pageY;
          });

          // up
          window.on('touchend mouseup' ,function() {
            window.off('touchmove mousemove touchend mouseup');
          });

        });

      }
    };
  });
