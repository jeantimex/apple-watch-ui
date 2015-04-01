'use strict';

/**
 * Created by su on 3/23/15.
 */

angular
  .module('AppleWatchUIApp')
  .directive('home', function () {
    return {
      restrict: 'E',

      link: function (scope, element) {
        element.addClass('screen home');
      }
    };
  });
