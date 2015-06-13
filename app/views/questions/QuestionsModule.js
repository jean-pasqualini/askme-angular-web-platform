'use strict';

angular.module('app.question', ['ngRoute', 'myApp.services'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:owner/:repo/:category/show', {
    name: 'show_questions_by_category',
    templateUrl: 'views/questions/list.html',
    controller: 'QuestionsController'
  });
}])

.controller('QuestionsController', ['$scope', 'questionManager', function($scope, questionManager) {
    $scope.questions = [];

     questionManager.getCategoryContent().then(function(configuration) {
       $scope.questions = configuration["questions"];
      });
}]);
