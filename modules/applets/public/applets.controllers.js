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
      $scope.showWindow = false;
      $scope.collectionPassword = '';

      if ($routeParams.identifier) {
        appCollections.single.get({identifier: $routeParams.identifier}, function(res) {
          if (res.success && res.res.records.length) {
            var record = res.res.records[0];
            $scope.record = record;
            
            if (record.password) {
              /**
               * Check if pwd is in storage
               */
              var storedPwd = appStorage.get($scope.record.identifier);
              if ($scope.record.password === storedPwd) {
                $scope.appData = $scope.record;
                $scope.showWindow = true;
              }

            } else {
              $scope.appData = $scope.record;
              $scope.showWindow = true;
            }
          }
        });
      }

      $scope.logout = function() {
        appStorage.remove($scope.record.identifier);
        $scope.showWindow = false;
        $scope.collectionPassword = null;
      };

      $scope.login = function(isValid) {
        if ($scope.record.password === $scope.collectionPassword) {
          appStorage.set($scope.record.identifier, $scope.collectionPassword);
          $scope.appData = $scope.record;
          $scope.showWindow = true;
        } else {
          appLocation.url('/?incorrect=true');
        }
      }

      // $timeout(function() {
        
      // }, 2000);
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
  .controller('SoonCtrl', [
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
      $scope.introText = $sce.trustAsHtml('<p>Coming soon.</p>');
      $scope.openWindow = function(params) {
        $rootScope.globalUrl = params.url;
        $rootScope.$broadcast('os.openBrowser');
      };
    }
  ])

  ;
