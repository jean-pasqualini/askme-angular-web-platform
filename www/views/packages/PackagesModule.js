'use strict';

angular.module('app.package', ['ngRoute', 'myApp.services'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/find-packagists', {
    templateUrl: 'views/packages/list.html',
    name: 'list_packages',
    controller: 'PackagesController'
  });
}])

.controller('PackagesController', ['$scope', 'packagistManager', 'urlGenerator', function($scope, packagistManager, urlGenerator) {
      $scope.packages = [];

        var searchMethod = function(q)
        {
            packagistManager.search({q: q}).then(function(configuration) {
                _.each(configuration["results"], function(item)
                {
                    var packagename = item.name.split("/");

                    item.action = urlGenerator.generate("show_category_by_packages", {
                        owner: packagename[0],
                        repo: packagename[1]
                    });
                });

                $scope.packages = configuration["results"];

                $scope.favorites = packagistManager.getFavoriteList();

            });
        };

        $scope.addFavorite = function($event, packageConfig)
        {
            $event.preventDefault();

            packagistManager.addFavorite(packageConfig.name, packageConfig);

            $scope.favorites = packagistManager.getFavoriteList();
        };

        $scope.removeFavorite = function($event, packageConfig)
        {
            $event.preventDefault();

            packagistManager.removeFavorite(packageConfig.name);

            $scope.favorites = packagistManager.getFavoriteList();
        };

        $scope.query = "";

        $scope.search = function()
        {
            searchMethod($scope.query);
        };

        searchMethod();
}]);