'use strict';

angular
    .module('myApp.services', ['ngResource', 'ngRoute'])
    .config(['$resourceProvider', function($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        //$resourceProvider.defaults.stripTrailingSlashes = false;
    }])
    .service('questionManager', ['$resource', '$q', 'githubContentManager', function($resource, $q, githubContentManager)
    {
        this.getCategoryContent = function()
        {
            var deferred = $q.defer();

            githubContentManager.getFile({
                repo: "certificationy/symfony-pack",
                file: "data/architecture.yml"
            }).then(function(content)
            {
                deferred.resolve(jsyaml.load(content.data));
            });

            return deferred.promise;
        };

        this.getCategoryList = function()
        {
            var deferred = $q.defer();

            deferred.resolve({
                film : {
                    description: "une description",
                    file: ""
                }
            });

            /**
            githubContentManager.getFile({
                repo: "certificationy/symfony-pack",
                file: "data/architecture.yml"
            }).then(function(content)
            {
                deferred.resolve(jsyaml.load(content.data));
            });
             */

            return deferred.promise;
        };
    }])
    .factory('githubApiManager', ['$resource', function($resource)
    {
        return $resource('https://api.github.com/repos/:repo/contents/:file', {
            repo: "repo",
            file: "file"
        }, {
            getFile: {
                transformResponse: function(rawContent, headers)
                {
                    return rawContent;
                }
            }
        });
    }])
    .service('githubContentManager', ['$http', function($http)
    {
       this.getFile = function(repo, path)
       {
           return $http.get('https://raw.githubusercontent.com/certificationy/symfony-pack/master/data/architecture.yml');
       };
    }])
    .factory("packagistManager", ["$resource", function($resource)
    {
        //https://packagist.org/search.json?tags=locale
        return $resource("https://packagist.org/search.json?tags=askme-compose", {}, {
            search: { method: "get" }
        });
    }])
    .service("urlGenerator", ['$route', function($route)
    {
        this.$route = $route;

        this.generate = function(name, params)
        {
             var routeMatch = _.findWhere($route.routes, {name: name});

             if(routeMatch === undefined)
             {
                 throw "undefined " + name + " route match ";
             }

             return "/#" + routeMatch.originalPath;
        };
    }])
    .filter("path", ["urlGenerator", function(urlGenerator)
    {
        return function(name)
        {
            return urlGenerator.generate(name, {});
        };
    }])
;