'use strict';

angular.module('delicious.links')
  .factory('appLinks', ['$resource',
    function($resource) {
      return {
        single: $resource('links/:linkId/:action', {
          appletId: '@_id'
        })
      }
    }
  ])
  ;
  