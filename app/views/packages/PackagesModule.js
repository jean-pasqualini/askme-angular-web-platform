'use strict';

angular.module('app.package', ['ngRoute', 'myApp.services'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/find-packagists', {
    templateUrl: '/views/packages/list.html',
    name: 'list_packages',
    controller: 'PackagesController'
  });
}])

.controller('PackagesController', ['$scope', 'packagistManager', 'urlGenerator', function($scope, packagistManager, urlGenerator) {
      $scope.packages = [];

        packagistManager.search().$promise.then(function(configuration) {
            _.each(configuration["results"], function(item)
            {
                item.action = urlGenerator.generate("show_category_by_packages", {});
            });

            $scope.packages = configuration["results"];

            $scope.query = "";
        });
}]);