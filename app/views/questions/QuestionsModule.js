'use strict';

angular.module('app.question', ['ngRoute', 'myApp.services'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/category/truc/question/show', {
    name: 'show_questions_by_category',
    templateUrl: 'views/questions/list.html',
    controller: 'QuestionsController'
  });
}])

.controller('QuestionsController', ['$scope', 'questionManager', function($scope, questionManager) {
    $scope.questions = [
      {
        "question" : "Quel est ton nom ?",
        "answers": [
          {
            "value": "john",
            "correct": false
          },
          {
            "value": "jean",
            "correct": false
          }
        ]
      }
    ];

     questionManager.get().$promise.then(function(configuration) {
       $scope.questions = configuration["questions"];
      });
}]);
