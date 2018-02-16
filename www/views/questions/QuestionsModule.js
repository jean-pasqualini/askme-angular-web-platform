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

        // Méthodes d'accès

        // On vérifie si la réponse est valide
        var isResponseValid = function(myResponse, question)
        {
            var responsesValids = [];

            _.each(question.answers, function(v, k, l)
            {
                if(v.correct)
                {
                    responsesValids.push(k);
                }
            });

            return (JSON.stringify(responsesValids) == JSON.stringify([myResponse]));
        };

        // On retrouves la solution à la question
        var getValidsResponses = function(question)
        {
            var responsesValids = [];

            _.each(question.answers, function(v, k, l)
            {
                if(v.correct)
                {
                    responsesValids.push(v.value);
                }
            });

            return responsesValids;
        };

        // On retrouve la version litéraire de la réponse à partir de son id
        var getLiteralResponse = function(myResponse, question)
        {
            var literalResponse = null;

            _.each(question.answers, function(v, k, l)
            {

                if(k == myResponse)
                {

                    literalResponse = v.value;
                }
            });

            return literalResponse;
        };

        // On initiliaze le contexte

        $scope.questions = [];

        $scope.responses = [];

        $scope.typeview = "question";

        var questions = [];
        var resultats = [];

        // On récupere la liste des questions
        questionManager.getCategoryContent($routeParams.owner + "/" + $routeParams.repo, $routeParams.category).then(function(configuration) {
           $scope.questions = configuration["questions"];
           questions = configuration["questions"];
         });

        // Action quand on clique sur le bouton "valides les réponses"
        $scope.validateResponses = function($event)
        {
            $event.preventDefault();

            console.log($scope.responses);

            _.each(questions, function(question, questionId, quetionsCollection)
            {
                var myResponse = (typeof $scope.responses[questionId] != "undefined") ? $scope.responses[questionId] : null;

                resultats[questionId] = {
                    question : question.question,
                    myResponse : getLiteralResponse(myResponse, question),
                    isResponseValid : isResponseValid(myResponse, question),
                    responsesValids : getValidsResponses(question)
                };
            });

            console.log(resultats);

            $scope.resultats = resultats;

            $scope.typeview = "response";
        };
}]);
