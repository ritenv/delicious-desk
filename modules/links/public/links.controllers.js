'use strict';

angular.module('delicious.links')
  .controller('LinksCtrl', [
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
  ;
