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
      var inited = false;

      element.addClass('app');

      // Transform
      scope.$watch(attrs.app, function (app) {
        if (!inited) {
          element.css({
            'background-image': 'url(images/apps/' + app.id + '.png)'
          });
          inited = true;
        }

        var transformCSS = 'translate3d(' + app.x + 'px,' + app.y + 'px,' + app.z + 'px) scale(' + app.scale + ')';
        element.css({
          'transform': transformCSS
        });
      }, true);
    }
  };
});
