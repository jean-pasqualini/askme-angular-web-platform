'use strict';

angular
    .module('myApp.services', ['ngResource', 'ngRoute'])
    .factory('questionManager', ['$resource', 'githubManager', function($resource, githubManager)
    {
        /**
        githubManager.getFile({
            repo: "certificationy/symfony-pack",
            file: "data/architecture.yml"
        }, function(content)
        {
            alert(content);
        });
*/
        return $resource('https://rawgit.com/certificationy/symfony-pack/master/data/architecture.yml', {}, {
            get: {
                transformResponse: function(yamlContent, headers)
                {
                    return jsyaml.load(yamlContent);
                }
            }
        });
    }])
    .factory('githubManager', ['$resource', function($resource)
    {
        return $resource('https://rawgit.com/:repo/master/:file', {
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
    .factory("packagistManager", ["$resource", function($resource)
    {
        //https://packagist.org/search.json?tags=locale
        return $resource("json/packagist.json", {}, {
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