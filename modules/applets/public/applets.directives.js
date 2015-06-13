'use strict';

angular.module('delicious.applets')
  .directive('appIcon', [
    '$sce',
    '$document',
    function($sce, $document) {
      return {
        /**
         * The template path
         * @type {String}
         */
        templateUrl: '/modules/applets/views/applet-single.html',

        /**
         * Create an isolated scope
         * @type {Object}
         */
        scope: {},

        /**
         * The main controller
         * @type {Array}
         */
        controller: [
          '$scope',
          '$rootScope',
          function($scope, $rootScope) {
            /**
             * Open the window
             * @return {Void}
             */
            $scope.open = function() {
              /**
               * Fire the window
               * @type {Boolean}
               */
              setTimeout(function() {
                $scope.almostReady = true;
                /**
                 * Fire the iframe
                 * @type {Boolean}
                 */
                $scope.ready = true;

                /**
                 * Bring to front
                 */
                $scope.activate();
                
                /**
                 * Update the isolated scope
                 */
                $scope.$digest();

                createDraggable();
              }, 1);
            };

            /**
             * Activate current window
             * @return {Void}
             */
            $scope.activate = function() {
              $rootScope.$emit('osWindow.deactivate');
              $scope.active = true;
            };

            /**
             * Close the window
             * @return {Void}
             */
            $scope.close = function() {
              $scope.ready = false;
              ($scope.onclose || angular.noop)();
              $scope.almostReady = false;
              $scope.maximized = $scope.minimized = false;
            };

            /**
             * Maximize the window
             * @return {Void}
             */
            $scope.maximize = function() {
              $scope.maximized = !$scope.maximized;
              $scope.minimized = false;
            };

            /**
             * Minimize the window
             * @return {Void}
             */
            $scope.minimize = $scope.unminimize = function() {
              $scope.minimized = !$scope.minimized;
            };

            /**
             * Listen to the deactive event
             */
            $rootScope.$on('osWindow.deactivate', function() {
              $scope.active = false;
            });

            function createDraggable() {
              /**
               * Get the window element
               * @type {Object}
               */
              var osWindow = angular.element('.os-window', $scope.element);

              /**
               * Get the dragger element
               * @type {[type]}
               */
              var dragger = angular.element('md-toolbar', osWindow);

              var startX = 0, startY = 0, x = 0, y = 0;
              
              osWindow.on('mousedown', function(event) {
                console.log('dragging');
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
              });

              function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                osWindow.css({
                  top: parseInt(y+64) + 'px',
                  left:  x + 'px'
                });
              }

              function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
              }
            }
          }
        ],
        link: function($scope, $element, $attrs) {
          /**
           * Pass attributes to the $scope
           * @type {Object}
           */
          $scope.data = $attrs;

          /**
           * Ensure URL is trusted
           * @type {Object}
           */
          $scope.data.url = $sce.trustAsResourceUrl($scope.data.url);

          /**
           * Save the element to scope
           * @type {Object}
           */
          $scope.element = $element;
        }
      }
    }
  ])
  ;
  