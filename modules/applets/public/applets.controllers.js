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
    function($scope, $route, $rootScope, $routeParams, $timeout, appApplets, appAuth, appToast, appStorage, appLocation, appWebSocket, appUsersSearch) {
      $scope.showWindow = false;

      $timeout(function() {
        $scope.showWindow = true;
      }, 2000);
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
  ;
