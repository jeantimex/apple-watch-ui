'use strict';

/**
 *
 */

angular.module('AppleWatchUIApp')
  .service('AppService', function ($http, $q) {

    var dataUrl = 'data/apps.json';

    /**
     *
     */
    this.loadApps = function () {
      var deferred = $q.defer();

      var self = this;

      $http.get(dataUrl)
        .success(function (data) {
          var res = self.processData(data);
          deferred.resolve(res);
        })
        .error(function () {
          deferred.reject('There was an error');
        });

      return deferred.promise;
    };

    /**
     *
     */
    this.processData = function (data) {
      if (angular.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          var app = data[i];
          app.x = 0;
          app.y = 0;
          app.z = 0;
          app.scale = 1;
        }
      }
      return data;
    };

  });
