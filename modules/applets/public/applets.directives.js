'use strict';

angular.module('delicious.applets')
  .directive('appIcon', [
    '$sce',
    '$controller',
    '$document',
    '$timeout',
    'appAppletsOpen',
    function($sce, $controller, $document, $timeout, appAppletsOpen) {
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

                if (!$scope.windowId) {
                  $scope.windowId = 'WIN' + Math.round(Math.random() * 100000);
                  appAppletsOpen.addWindow($scope.windowId);
                }
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
              $rootScope.$emit('osWindow.deactivate'); //deactivate all

              //activate self
              $timeout(function() {
                $scope.active = true;
                $scope.minimized = false;
                console.log('called')
              }, 100);
            };

            /**
             * Close the window
             * @return {Void}
             */
            $scope.close = function() {
              $scope.ready = false;
              $rootScope.$emit('osWindow.close');
              ($scope.onclose || angular.noop)();
              $scope.almostReady = false;
              appAppletsOpen.removeWindow($scope.windowId);
            };

            /**
             * Maximize the window
             * @return {Void}
             */
            $scope.maximize = function() {
              $scope.maximized = !$scope.maximized;
              $scope.minimized = false;
              $rootScope.$emit('osWindow.maximize');
            };

            /**
             * Minimize the window
             * @return {Void}
             */
            $scope.minimize = $scope.unminimize = function() {
              $scope.minimized = !$scope.minimized;
              $scope.maximized = false;
              $scope.active = false;
              $rootScope.$emit('osWindow.minimize');
              updateTaskbarPositions();
            };

            /**
             * Listen to the deactive event
             */
            $rootScope.$on('osWindow.deactivate', function() {
              $scope.active = false;
            });

            function updateTaskbarPositions() {
              var minimizedCount = $('.os-window.minimized').length;
              //get width of all minimized windows
              var left = 0;

              var indexOfMe = appAppletsOpen.openWindows.indexOf($scope.windowId);
              _.each(appAppletsOpen.openWindows, function(openWindow, i) {
                if (i < indexOfMe) {
                  left += $('#' + openWindow).outerWidth() + 2;
                }
              });

              $scope.data.cssLeft = left;
            }

            function createDraggable() {
              /**
               * Get the window element
               * @type {Object}
               */
              var osWindow = angular.element('.os-window', $scope.element);

              /**
               * Ensure this runs only once
               */
              if ($scope.draggableCreated) {
                return;
              } else {
                $scope.draggableCreated = true;
              }

              /**
               * Get the dragger element
               * @type {[type]}
               */
              var dragger = angular.element('md-toolbar', osWindow);

              var startX = 0, startY = 0, x = 0, y = 0;
              
              osWindow.on('mousedown', function(event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
              });

              function mousemove(event) {
                $timeout(function() {
                  $scope.dragging = true;
                });
                y = event.pageY - startY;
                x = event.pageX - startX;
                osWindow.css({
                  top: parseInt(y+64) + 'px',
                  left:  x + 'px'
                });
              }

              function mouseup() {
                $timeout(function() {
                  $scope.dragging = false;
                });
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
           * Check default states
           * @type {Boolean}
           */
          $scope.maximized = $attrs.maximized !== undefined ? true : false;

          /**
           * Ensure URL is trusted
           * @type {Object}
           */
          $scope.data.url = $sce.trustAsResourceUrl($scope.data.url);

          /**
           * If there is a controller, inherit from it
           */
          if ($attrs.templateController) {
            $controller($attrs.templateController, {$scope: $scope});
          }

          /**
           * Save the element to scope
           * @type {Object}
           */
          $scope.element = $element;

          if ($attrs.autoOpen === 'true') {
            $timeout(function() {
              $scope.open();
            }, 1200);
          }
        }
      }
    }
  ])
  ;
  