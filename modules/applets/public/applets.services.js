'use strict';

angular.module('delicious.applets')
  .factory('appApplets', ['$resource',
    function($resource) {
      return {
        single: $resource('applets/:appletId/:action', {
          appletId: '@_id'
        })
      }
    }
  ])
  ;
  