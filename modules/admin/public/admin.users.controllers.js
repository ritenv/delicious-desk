'use strict';

angular.module('delicious.admin')
  .controller('AdminUserCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    'appUsers',
    'appToast',
    'appStorage',
    'appLocation',
    'appCollections',
    function($rootScope, $scope, $routeParams, appUsers, appToast, appStorage, appLocation, appCollections) {
      appUsers.single.get({}, function(res) {
        if (res.success && res.res.records) {
          $scope.records = res.res.records;
        }
      });

    }
  ])
  .controller('AdminUserAddCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    'appUsers',
    'appToast',
    'appStorage',
    'appLocation',
    'appCollections',
    function($rootScope, $scope, $routeParams, appUsers, appToast, appStorage, appLocation, appCollections) {
      $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
      };

      if ($routeParams.recordId) {
        appUsers.single.get({_id: $routeParams.recordId}, function(res) {
          if (res.success && res.res.records.length) {
            $scope.record = res.res.records[0];
          }
        });
      }

      $scope.delete = function() {
        if (confirm('Are you sure you want to delete this? This cannot be undone.')) {
          appUsers.single.delete({_id: $routeParams.recordId}, function(res) {
            if (res.success) {
              appLocation.url('/admin/users');
            }
          });
        }
      };

      $scope.create = function(isValid) {
        if (!isValid) {
          return true;
        }

        var record = $scope.record;
        var c = new appUsers.single(record);
        c.$save(function(res) {
          if (res.success) {
            appLocation.url('/admin/users');
          }
        });
      };
    }
  ])
;
