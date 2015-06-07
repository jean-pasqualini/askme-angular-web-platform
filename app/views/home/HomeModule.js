angular.module('app.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider)
    {
        $routeProvider.when('/', {
            templateUrl: '/views/home/home.html',
            name: 'show_category_by_packages'
        });
    }])
;