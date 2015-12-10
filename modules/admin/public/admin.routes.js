'use strict';

angular.module('delicious.admin')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: '/modules/admin/views/collections.html',
        controller: 'AdminCollectionCtrl',
        resolve: {
        	ensureLogin: ['appAuth', 'appLocation', ensureLogin]
        }
      })
      .when('/admin/collections/add', {
        templateUrl: '/modules/admin/views/collections-add.html',
        controller: 'AdminCollectionAddCtrl',
        resolve: {
        	ensureLogin: ['appAuth', 'appLocation', ensureLogin]
        }
      })
      .when('/admin/collections/edit/:recordId', {
        templateUrl: '/modules/admin/views/collections-add.html',
        controller: 'AdminCollectionAddCtrl',
        resolve: {
        	ensureLogin: ['appAuth', 'appLocation', ensureLogin]
        }
      })

      .when('/admin/links', {
        templateUrl: '/modules/admin/views/links.html',
        controller: 'AdminLinkCtrl',
        resolve: {
        	ensureLogin: ['appAuth', 'appLocation', ensureLogin]
        }
      })
      .when('/admin/links/add', {
        templateUrl: '/modules/admin/views/links-add.html',
        controller: 'AdminLinkAddCtrl',
        resolve: {
        	ensureLogin: ['appAuth', 'appLocation', ensureLogin]
        }
      })
      .when('/admin/links/edit/:recordId', {
        templateUrl: '/modules/admin/views/links-add.html',
        controller: 'AdminLinkAddCtrl',
        resolve: {
        	ensureLogin: ['appAuth', 'appLocation', ensureLogin]
        }
      })
      ;
    $locationProvider.html5Mode(true);
  }]);

function ensureLogin(appAuth, appLocation) {
  if (!appAuth.isLoggedIn()) {
    if (window.location.href.indexOf('/activate/') == -1 && window.location.href.indexOf('/changePassword/') == -1) {
      appLocation.url('/login');
      return false;
    }
  } else {
    return true;
  }	  
}