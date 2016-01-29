'use strict';

angular.module('delicious.applets')
  .controller('AppletsCtrl', [
    '$scope',
    '$route',
    '$rootScope',
    '$routeParams',
    '$timeout',
    'appApplets',
    'appAuth',
    'appToast',
    'appStorage',
    'appLocation',
    'appWebSocket',
    'appUsersSearch',
    'appCollections',
    function($scope, $route, $rootScope, $routeParams, $timeout, appApplets, appAuth, appToast, appStorage, appLocation, appWebSocket, appUsersSearch, appCollections) {
      $scope.params = $routeParams;
      $scope.data = {};
      $scope.data.fields = {};
      $scope.keyword = '';

      $scope.setSearchType = function(searchType) {
        $rootScope.searchCriteria.type = searchType;
      }

      $scope.$watch('data.keyword', function(newVal, oldVal) {
        $rootScope.searchCriteria.keyword = newVal;
      });

      $scope.$watch('data.fields', function(newVal, oldVal) {
        $rootScope.searchCriteria.fields = [];
        if (newVal.tags) {
          $rootScope.searchCriteria.fields.push('tags');
        }
        if (newVal.title) {
          $rootScope.searchCriteria.fields.push('title');
          $rootScope.searchCriteria.fields.push('description');
          $rootScope.searchCriteria.fields.push('abstract');
        }
        if (newVal.authors) {
          $rootScope.searchCriteria.fields.push('authors');
        }

      }, true);
    }
  ])
  .controller('IntroCtrl', [
    '$sce',
    '$scope',
    '$route',
    '$rootScope',
    '$routeParams',
    '$timeout',
    'appApplets',
    'appAuth',
    'appToast',
    'appStorage',
    'appLocation',
    'appWebSocket',
    'appUsersSearch',
    function($sce, $scope, $route, $rootScope, $routeParams, $timeout, appApplets, appAuth, appToast, appStorage, appLocation, appWebSocket, appUsersSearch) {
      $scope.introText = $sce.trustAsHtml('<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</p> <p>Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>');
    }
  ])
  .controller('CriticalCtrl', [
    '$sce',
    '$scope',
    '$route',
    '$rootScope',
    '$routeParams',
    '$timeout',
    'appApplets',
    'appAuth',
    'appToast',
    'appStorage',
    'appLocation',
    'appWebSocket',
    'appUsersSearch',
    function($sce, $scope, $route, $rootScope, $routeParams, $timeout, appApplets, appAuth, appToast, appStorage, appLocation, appWebSocket, appUsersSearch) {
      $scope.introText = $sce.trustAsHtml('<p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</p> <p>Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.</p>');
    }
  ])
  .controller('IconCtrl', [
    '$sce',
    '$scope',
    '$route',
    '$rootScope',
    '$routeParams',
    '$timeout',
    'appApplets',
    'appAuth',
    'appToast',
    'appStorage',
    'appLocation',
    'appWebSocket',
    'appUsersSearch',
    'appCollections',
    'appLinks',
    function($sce, $scope, $route, $rootScope, $routeParams, $timeout, appApplets, appAuth, appToast, appStorage, appLocation, appWebSocket, appUsersSearch, appCollections, appLinks) {
      $scope.introText = $sce.trustAsHtml('<p>Coming soon.</p>');
      
      $scope.onIconOpen = function() {
        appLinks.single.get({linkType: $scope.linkType, collectionIdentifier: $routeParams.identifier}, function(res) {
          if (res.success) {
            $scope.linkRecords = res.res.records;
          }
        });
      };

      $scope.openWindow = function(params) {
        $rootScope.globalUrl = params.url;
        $rootScope.$broadcast('os.openBrowser');
      };
    }
  ])

  ;
