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
      element.addClass('app');

      // Transform
      scope.$watch(attrs.app, function (app) {
        var transformCSS = 'translate3d(' + app.x + 'px,' + app.y + 'px,' + app.z + 'px) scale(' + app.scale + ')';
        element.css('transform', transformCSS);
      }, true);
    }
  };
});
