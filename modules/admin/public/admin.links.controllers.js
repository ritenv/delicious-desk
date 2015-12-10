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
    'Upload',
    'appUsers',
    'appToast',
    'appStorage',
    'appLocation',
    'appLinks',
    function($rootScope, $scope, $routeParams, Upload, appUsers, appToast, appStorage, appLocation, appLinks) {
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

      $scope.deleteDocument = function(url) {
        $scope.record.url = null;
        // alert('For now, the file is not deleted from AWS, but the attachment is removed. AWS deletion coming soon. You can now upload another file.');
      };

      $scope.uploadDocument = function(file) {
        Upload.upload({
          url: '/links/upload-document',
          data: {file: file}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            if (resp.data && resp.data.success) {
              $scope.record.url = resp.data.res.url;
            }
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
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
