'use strict';

angular.module('myApp.view1', ['ngRoute', 'myApp.services'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', 'questionManager', function($scope, questionManager) {
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
