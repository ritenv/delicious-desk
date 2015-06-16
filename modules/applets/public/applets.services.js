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
  .service('appAppletsOpen', [
    function() {
      this.openWindows = [];
      this.addWindow = function(id) {
        if (this.openWindows.indexOf(id) === -1) {
          this.openWindows.push(id);
        }
      }
      this.removeWindow = function(id) {
        if (this.openWindows.indexOf(id) !== -1) {
          this.openWindows.splice(this.openWindows.indexOf(id), 1);
        }
      }

    }
  ])
  ;
  