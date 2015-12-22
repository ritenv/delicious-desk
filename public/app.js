var app = angular.module('delicious.main', [
  'delicious.system',
  'delicious.users',
  'delicious.applets',
  'delicious.settings',
  'delicious.collections',
  'delicious.links',
  'delicious.admin',
  'ckeditor',
  'ngMaterial'
]);

app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http**'
  ]);
});

app.factory('$myElementInkRipple', function($mdInkRipple) {
  return {
    attach: function (scope, element, options) {
      return $mdInkRipple.attach(scope, element, angular.extend({
        center: false,
        dimBackground: true
      }, options));
    }
  };
});

app.controller('AppCtrl', [
  '$scope', 
  '$route',
  '$rootScope', 
  '$mdBottomSheet',
  '$location',
  '$timeout',
  '$myElementInkRipple',
  'appLocation',
  'appAuth',
  'appWebSocket',
  'appSettings',
  'appSettingsValid',
  'appToast',
  function($scope, $route, $rootScope, $mdBottomSheet, $location, $timeout, $myElementInkRipple, appLocation, appAuth, appWebSocket, appSettings, appSettingsValid, appToast) {
    $scope.barTitle = '';
    $scope.search = '';

    $rootScope.doRipple = function(ev) {
      $myElementInkRipple.attach($scope, $('.intro-head'), { center: false, fitRipple: false, colorElement: $($rootScope.rippleColorElement) });
    };

    $rootScope.setRippleColor = function(str) {
      $rootScope.headerBgClass = str;
    };

    $rootScope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    $rootScope.isAdmin = function() {
      return $route.current && $route.current.loadedTemplateUrl.indexOf('/admin') !== -1;
    };

    $rootScope.goBack = function() {
      history.go(-1);
    };

    $rootScope.setModifierClass = function(clsName) {
      $rootScope.modifierClass = clsName;
    };

    $scope.updateLoginStatus = function() {
      $scope.isLoggedIn = appAuth.isLoggedIn();
      $scope.user = appAuth.getUser();
    };

    $scope.goHome = function() {
      appLocation.url('/');
    };

    $scope.showUserActions = function($event) {
      $mdBottomSheet.show({
        templateUrl: '/modules/users/views/user-list.html',
        controller: 'UserSheet',
        targetEvent: $event
      }).then(function(clickedItem) {
        $scope.alert = clickedItem.name + ' clicked!';
      });
    };

    var initiateSettings = function(cb) {
      appSettings.fetch(function(settings) {
        $rootScope.systemSettings = settings;
        if (cb) {
          cb();
        }
      });
    };

    /**
     * Scroll the view to top on route change
     */
    $scope.$on('$routeChangeSuccess', function() {
      angular.element('*[md-scroll-y]').animate({scrollTop: 0}, 300);
    });

    $scope.$on('loggedIn', function() {
      $scope.updateLoginStatus();
      $scope.barTitle = '';
      $scope.$broadcast('updateNotifications');
      appWebSocket.conn.emit('online', {token: appAuth.getToken()});
      appAuth.refreshUser(function(user) {
        $scope.user = user;
      });
      /**
       * Fetch settings and get the app ready
       */
      initiateSettings(function() {
        $scope.$on('$routeChangeStart', function (event, toState) {
          var valid = appSettingsValid();
          if (!valid) {
            appToast('Please complete the setup first.');
          }
        });
        $scope.appReady = true;
        $scope.barTitle = $rootScope.systemSettings.tagline;
        $timeout(appSettingsValid);
      });
      
    });

    $scope.$on('loggedOut', function() {
      $scope.updateLoginStatus();
      appWebSocket.conn.emit('logout', {token: appAuth.getToken()});
    });

    appWebSocket.conn.on('connect', function() {
      if (appAuth.isLoggedIn()) {
        appWebSocket.conn.emit('online', {token: appAuth.getToken()});
      }
    });

    $scope.updateLoginStatus();
    $timeout(function() {
      if (!appAuth.isLoggedIn()) {
        // if (window.location.href.indexOf('/activate/') == -1 && window.location.href.indexOf('/changePassword/') == -1) {
        //   appLocation.url('/login');
        // }
        initiateSettings();
        $scope.appReady = true;
      } else {
        $scope.barTitle = '';
        $scope.$broadcast('loggedIn');
      }
      
    });

    $timeout(function() {
      $rootScope.setRippleColor('regular');
      $rootScope.doRipple();
    }, 1000);
  }
]);