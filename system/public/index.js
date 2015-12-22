'use strict';

angular.module('delicious.system', [
  'ngRoute', 
  'ngMessages', 
  'ngResource', 
  'ngSanitize',
  'ngFileUpload', 
  'delicious.utils',
  'angular-loading-bar', 
  'ngAnimate'
]);

angular.module('delicious.system')
.factory('tokenHttpInterceptor', [
  'appStorage',
  function (appStorage) {
    return {
      request: function (config) {
        config.headers.Authorization = 'Bearer ' + appStorage.get('userToken');
        return config;
      }
    };
  }
])
.factory('appSearch', [
  '$resource',
  function($resource) {
    var search = $resource('search/:keyword', {}, {query: {isArray: false}});
    return function(keyword) {
      //implement search logic here
      var promise = search.query({keyword: keyword}).$promise;
      return promise;
    };
  }
])
.config([
  '$httpProvider',
  '$mdThemingProvider',
  'cfpLoadingBarProvider',
  function ($httpProvider, $mdThemingProvider, cfpLoadingBarProvider) {
    $httpProvider.interceptors.push('tokenHttpInterceptor');
    // $mdThemingProvider.theme('default')
    // .primaryPalette('blue')
    // .accentPalette('blue-grey');

    // $mdThemingProvider.definePalette('primaryPalette', {
    //   '50': 'E4EFF7',
    //   '100': 'D6E0E7',
    //   '200': '77C0F4',
    //   '300': '63B4ED',
    //   '400': '40A8F2',
    //   '500': '36A5F4',
    //   '600': '249DF4',
    //   '700': '1196F4',
    //   '800': '0691F4',
    //   '900': '0A98FD',
    //   'A100': '89BEC8',
    //   'A200': '89BEC8',
    //   'A400': '89BEC8',
    //   'A700': '89BEC8',
    //   'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
    //                                       // on this palette should be dark or light
    //   'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
    //    '200', '300', '400', 'A100'],
    //   'contrastLightColors': undefined    // could also specify this if default was 'dark'
    // });
    
    // $mdThemingProvider.theme('default')
    //   .primaryPalette('primaryPalette')
    //   .accentPalette('primaryPalette')

    $mdThemingProvider.definePalette('amazingPaletteName', {
            '50': 'FFFFFF',
            '100': '8FF4ED',
            '200': 'F0913E',
            '300': 'F0913E',
            '400': 'F0913E',
            '500': 'F0913E',
            '600': 'F0913E',
            '700': 'F0913E',
            '800': 'F0913E',
            '900': 'F0913E',
            'A100': 'F0913E',
            'A200': 'F0913E',
            'A400': 'F0913E',
            'A700': 'F0913E',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
             '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
          });
    $mdThemingProvider.theme('default')
      .primaryPalette('amazingPaletteName')
      .accentPalette('amazingPaletteName')

    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = false;
  }
]);
