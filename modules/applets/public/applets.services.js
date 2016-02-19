'use strict';

angular.module('delicious.applets')
  .factory('appApplets', ['$resource',
    function($resource) {
      return {
        single: $resource('applets/resources/:resourceType', {
          appletId: '@_id'
        })
      }
    }
  ])
  .constant('appExternals', {
    citeULike: function(id) {
      return 'http://www.citeulike.org/user/acecentre/article/' + id;
    },
    libraryThing: function(isbn) {
      return 'http://www.librarything.com/isbn/' + isbn;
    }
  })
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
  