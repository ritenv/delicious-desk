'use strict';

angular.module('delicious.admin')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: '/modules/admin/views/collections.html',
        controller: 'AdminCollectionCtrl'
      })
      .when('/admin/collections/add', {
        templateUrl: '/modules/admin/views/collections-add.html',
        controller: 'AdminCollectionAddCtrl'
      })
      .when('/admin/collections/edit/:recordId', {
        templateUrl: '/modules/admin/views/collections-add.html',
        controller: 'AdminCollectionAddCtrl'
      })

      .when('/admin/links', {
        templateUrl: '/modules/admin/views/links.html',
        controller: 'AdminLinkCtrl'
      })
      .when('/admin/links/add', {
        templateUrl: '/modules/admin/views/links-add.html',
        controller: 'AdminLinkAddCtrl'
      })
      .when('/admin/links/edit/:recordId', {
        templateUrl: '/modules/admin/views/links-add.html',
        controller: 'AdminLinkAddCtrl'
      })
      ;
    $locationProvider.html5Mode(true);
  }]);