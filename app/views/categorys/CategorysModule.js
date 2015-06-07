angular.module('app.category', ['ngRoute'])

.config(['$routeProvider', function($routeProvider)
    {
        $routeProvider.when('/package/:package/category/list', {
            templateUrl: '/views/categorys/list.html',
            name: 'show_category_by_packages'
        });
    }])

.controller('CategorysController', ['$scope', 'questionManager', function(questionsManager)
    {
         $scope.categorys = {
              film : {
                  description: "une description",
                  file: ""
              }
         };
    }])
;