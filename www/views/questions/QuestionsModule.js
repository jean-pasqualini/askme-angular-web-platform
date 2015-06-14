'use strict';

angular.module('app.question', ['ngRoute', 'myApp.services'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/package/:owner/:repo/:category/show', {
    name: 'show_questions_by_category',
    templateUrl: 'views/questions/list.html',
    controller: 'QuestionsController'
  });
}])

.controller('QuestionsController', ['$scope', '$routeParams', 'questionManager', function($scope, $routeParams, questionManager) {
    $scope.questions = [];

        $scope.responses = [];

     questionManager.getCategoryContent($routeParams.owner + "/" + $routeParams.repo, $routeParams.category).then(function(configuration) {
       $scope.questions = configuration["questions"];
     });

        $scope.validateResponses = function($event)
        {
            $event.preventDefault();

            console.log($scope.responses);
        };
}]);
