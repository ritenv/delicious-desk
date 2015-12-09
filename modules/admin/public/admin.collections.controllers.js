'use strict';

angular.module('delicious.admin')
  .controller('AdminCollectionCtrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    'appUsers',
    'appToast',
    'appStorage',
    'appLocation',
    'appCollections',
    function($rootScope, $scope, $routeParams, appUsers, appToast, appStorage, appLocation, appCollections) {
      appCollections.single.get({}, function(res) {
        if (res.success && res.res.records) {
          $scope.records = res.res.records;
        }
      });

    }
  ])
  .controller('AdminCollectionAddCtrl', [
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
        appCollections.single.get({_id: $routeParams.recordId}, function(res) {
          if (res.success && res.res.records.length) {
            $scope.record = res.res.records[0];
          }
        });
      }

      $scope.removeAttachment = function(attachmentToDelete) {
        $scope.record.attachments = _.filter($scope.record.attachments, function(attachment) {
          return attachment._id !== attachmentToDelete._id;
        });
      };

      $scope.delete = function() {
        if (confirm('Are you sure you want to delete this? This cannot be undone.')) {
          appCollections.single.delete({_id: $routeParams.recordId}, function(res) {
            if (res.success) {
              appLocation.url('/admin');
            }
          });
        }
      };

      $scope.create = function(isValid) {
        if (!isValid) {
          return true;
        }

        var record = $scope.record;
        var c = new appCollections.single(record);
        c.$save(function(res) {
          if (res.success) {
            appLocation.url('/admin');
          }
        });
      };
    }
  ])
;
