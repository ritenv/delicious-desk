'use strict';

angular.module('delicious.collections')
  .factory('appCollections', ['$resource',
    function($resource) {
      return {
        single: $resource('collections/:collectionId/:action', {
          appletId: '@_id'
        }, {
          attach: {
            method: 'POST',
            params: {action: 'attach'}
          }
        })
      }
    }
  ])
  ;
  