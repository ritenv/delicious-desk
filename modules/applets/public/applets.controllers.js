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
    'appExternals',
    function($scope, $route, $rootScope, $routeParams, $timeout, appApplets, appAuth, appToast, appStorage, appLocation, appWebSocket, appUsersSearch, appCollections, appExternals) {
      var params = $scope.params = $routeParams;
      var searchParams = {
        type: params.type || '',
        q: '',
        fields: params.fields ? params.fields.split(',') : []
      };

      $rootScope.searchCriteria.type = searchParams.type;

      $scope.data = {};
      var selectedFields = $scope.data.fields = {
        tags: params.fields ? params.fields.indexOf('tags') !== -1 : false,
        title: params.fields ? params.fields.indexOf('title') !== -1 : false,
        authors: params.fields ? params.fields.indexOf('authors') !== -1 : false,
        attachment: params.fields ? params.fields.indexOf('attachment') !== -1 : false,
      };

      if (!(selectedFields.tags || selectedFields.title || selectedFields.authors || selectedFields.attachment)) {
        selectedFields.tags = selectedFields.title = selectedFields.authors = true;
      }

      $scope.data.keyword = params.q || '';

      $scope.setSearchType = function(searchType) {
        $rootScope.searchCriteria.type = searchType;
      }

      $scope.selectAll = function() {
        $scope.data.fields = {};
        $timeout(function() {
          $scope.data.isAll = true;
        });
      }

      $scope.getDescription = function(record) {
        var returnString = '';
        switch (record._type) {
          case 'articles':
            returnString = record._source.abstract || '//No abstract present.';
            break;
          case 'books':
            returnString = record._source.location + ', ' + record._source.created + ' (' + record._source.authors + ')';
            break;
        }
        return returnString.substr(0, 200);
      }

      $scope.getLink = function(record) {
        var returnString = '';
        switch (record._type) {
          case 'articles':
            returnString = record._source.citeulike;
            break;
          case 'books':
            returnString = appExternals.libraryThing(record._source.isbn);
            break;
        }
        return returnString.substr(0, 200);
      }

      $scope.$watch('data.keyword', function(newVal, oldVal) {
        $rootScope.searchCriteria.keyword = newVal;
        searchParams.q = newVal;
      });

      $scope.$watch('data.fields', function(newVal, oldVal) {
        $rootScope.searchCriteria.fields = [];
        searchParams.fields = [];

        if (newVal.tags) {
          $rootScope.searchCriteria.fields.push('tags');
          searchParams.fields.push('tags');
        }
        if (newVal.title) {
          $rootScope.searchCriteria.fields.push('title');
          $rootScope.searchCriteria.fields.push('description');
          $rootScope.searchCriteria.fields.push('abstract');
          searchParams.fields.push('title');
        }
        if (newVal.authors) {
          $rootScope.searchCriteria.fields.push('authors');
          searchParams.fields.push('authors');
        }
        if (newVal.attachment) {
          $rootScope.searchCriteria.fields.push('attachment');
          searchParams.fields.push('attachment');
        }
      }, true);

      $rootScope.$watch('searchCriteria', function(newVal, oldVal) {
        searchParams.type = newVal.type;
        var fieldsCsv = newVal.fields.join(',');
        if (!searchParams.type) {
          delete searchParams.type;
        }

        if (newVal.keyword) {
          appApplets.single.get({
            resourceType: newVal.type,
            fields: fieldsCsv,
            q: newVal.keyword
          }).$promise.then(function(res) {
            searchParams.fields = typeof searchParams.fields !== 'string' ? searchParams.fields.join(',') : searchParams.fields;
            appLocation.search(searchParams);
            if (res.res.data) {
              var records = res.res.data.hits.hits;
              $scope.records = records;
            }
          });
        }
      }, true);
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
  .controller('IconCtrl', [
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
    'appCollections',
    'appLinks',
    function($sce, $scope, $route, $rootScope, $routeParams, $timeout, appApplets, appAuth, appToast, appStorage, appLocation, appWebSocket, appUsersSearch, appCollections, appLinks) {
      $scope.introText = $sce.trustAsHtml('<p>Coming soon.</p>');
      
      $scope.onIconOpen = function() {
        appLinks.single.get({linkType: $scope.linkType, collectionIdentifier: $routeParams.identifier}, function(res) {
          if (res.success) {
            $scope.linkRecords = res.res.records;
          }
        });
      };

      $scope.openWindow = function(params) {
        $rootScope.globalUrl = params.url;
        $rootScope.$broadcast('os.openBrowser');
      };
    }
  ])

  ;
