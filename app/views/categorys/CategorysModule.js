angular.module('app.category', ['ngRoute'])

.config(['$routeProvider', function($routeProvider)
    {
        $routeProvider.when('/package/:owner/:repo/category/list', {
            templateUrl: '/views/categorys/list.html',
            name: 'show_category_by_packages',
            controller: 'CategorysController'
        });
    }])

.controller('CategorysController', ['$scope', '$routeParams', 'questionManager', function($scope, $routeParams, questionsManager)
    {
         questionsManager.getCategoryList($routeParams.owner + "/" + $routeParams.repo).then(function(categorys)
         {
             $scope.categorys = categorys;

             $scope.owner = $routeParams.owner;

             $scope.repo = $routeParams.repo;
         });
    }])
;