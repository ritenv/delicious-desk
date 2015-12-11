'use strict';

angular.module('delicious.settings')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/settings', {
        templateUrl: '/system/settings/views/settings.html',
        controller: 'SettingsCtrl',
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