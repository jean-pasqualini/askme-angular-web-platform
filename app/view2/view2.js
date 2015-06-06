'use strict';

angular.module('myApp.view2', ['ngRoute', 'myApp.services'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/find-packagists', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', 'packagistManager', function($scope, packagistManager) {
      $scope.packages = [];

        packagistManager.search().$promise.then(function(configuration) {
            $scope.packages = configuration["results"];
        });
}]);