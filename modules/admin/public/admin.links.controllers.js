'use strict';

angular.module('delicious.admin')
  .controller('AdminLinkCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    'appUsers',
    'appToast',
    'appStorage',
    'appLocation',
    'appLinks',
    'appCollections',
    function($rootScope, $scope, $routeParams, appUsers, appToast, appStorage, appLocation, appLinks, appCollections) {
      appLinks.single.get({}, function(res) {
        if (res.success && res.res.records) {
          $scope.records = res.res.records;
        }
      });

      appCollections.single.get({}, function(res) {
        if (res.success && res.res.records) {
          $scope.collections = res.res.records;
        }
      });

      $scope.attach = function(collection) {
        appCollections.single.attach({links: $scope.selectedIds, collectionId: collection._id}, function(res) {
          if (res.success) {
            appToast('Attached successfully!');
          }
        });
      };

      $scope.selectedIds = [];
      $scope.updateSelection = function() {
        $scope.selectedIds = [];
        _.map($scope.records, function(record) {
          console.log(record.selected);
          if (record.selected) {
            $scope.selectedIds.push(record._id);
          }
        });
      };
    }
  ])
  .controller('AdminLinkAddCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    'appUsers',
    'appToast',
    'appStorage',
    'appLocation',
    'appLinks',
    function($rootScope, $scope, $routeParams, appUsers, appToast, appStorage, appLocation, appLinks) {
      $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
      };

      if ($routeParams.recordId) {
        appLinks.single.get({_id: $routeParams.recordId}, function(res) {
          if (res.success && res.res.records.length) {
            $scope.record = res.res.records[0];
          }
        });
      }

      $scope.delete = function() {
        if (confirm('Are you sure you want to delete this? This cannot be undone.')) {
          appLinks.single.delete({_id: $routeParams.recordId}, function(res) {
            if (res.success) {
              appLocation.url('/admin/links');
            }
          });
        }
      };

      $scope.create = function(isValid) {
        if (!isValid) {
          return true;
        }

        var record = $scope.record;
        var c = new appLinks.single(record);
        c.$save(function(res) {
          if (res.success) {
            appLocation.url('/admin/links');
          }
        });
      };
    }
  ])
;
