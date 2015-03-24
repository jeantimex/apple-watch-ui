'use strict';

/**
 * Created by su on 3/23/15.
 */

angular
  .module('AppleWatchUIApp')
  .directive('home', function ($window) {
    return {
      restrict: 'E',
      link: function (scope, element) {

        element.addClass('home');

        // touch
        element.on('touchstart mousedown', function(e) {
          var window = angular.element($window);

          var lastX = e.originalEvent.pageX,
              lastY = e.originalEvent.pageY;

          var top = element.position().top,
              left = element.position().left;

          // stop moving
          window.off('touchmove mousemove');

          // move
          window.on('touchmove mousemove', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var deltaX = e.originalEvent.pageX - lastX,
                deltaY = e.originalEvent.pageY - lastY;

            lastX = e.originalEvent.pageX;
            lastY = e.originalEvent.pageY;

            top += deltaY;
            left += deltaX;

            element.css({
              'top'  : top,
              'left' : left
            });
          });

          // up
          window.on('touchend mouseup' ,function(e) {
            window.off('touchmove mousemove touchend mouseup');
          });

        });

      }
    };
  });
