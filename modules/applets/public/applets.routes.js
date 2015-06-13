'use strict';

angular.module('delicious.applets')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/modules/applets/views/list.html',
        controller: 'AppletsCtrl'
      })
      ;
    $locationProvider.html5Mode(true);
  }]);