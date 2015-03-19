'use strict';

/**
 *
 */

angular
.module('AppleWatchUIApp')
.directive('app', function () {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      var app = scope[attrs.app];

      element.addClass('app');

      // X & Y
      scope.$watch(attrs.app, function (app) {
        var base = 40;

        // Position
        var row = parseInt(app.idx / 5),
            col = parseInt(app.idx % 5);
            
        var offset = row % 2 == 0 ? 0 : 22.5;

        var x = offset + col * (base + 5),
            y = row * base;

        element.css('top', y + 'px');
        element.css('left', x + 'px');

      }, true);
    }
  };
});
