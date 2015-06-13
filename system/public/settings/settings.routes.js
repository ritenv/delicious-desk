'use strict';

angular.module('delicious.settings')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/settings', {
        templateUrl: '/system/settings/views/settings.html',
        controller: 'SettingsCtrl'
      })
      ;
    $locationProvider.html5Mode(true);
  }]);