'use strict';

angular
    .module('myApp.services', ['ngResource', 'ngRoute'])
    .config(['$resourceProvider', function($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        //$resourceProvider.defaults.stripTrailingSlashes = false;
    }])
    .service('cache', function()
    {
        var cache = {};

        this.set = function(key, value)
        {
            localStorage.setItem(key, JSON.stringify(value));
        };

        this.get = function(key)
        {
           return JSON.parse(localStorage.getItem(key));
        };

        this.has = function(key)
        {
            return localStorage.getItem(key) !== null;
        };

        this.del = function(key)
        {
            localStorage.removeItem(key);
        };
    })
    .service('questionManager', ['$resource', '$q', 'githubContentManager', 'cache', function($resource, $q, githubContentManager, cache)
    {
        var cacheAskmeCompose = {};

        this.getCategoryContent = function(repo, category)
        {
            var deferred = $q.defer();

            this.getCategoryList(repo).then(function(categorys)
            {
                var file = categorys[category].file;

                if(!cache.has('askme/questions/' + repo + '/' + category))
                {
                    githubContentManager.getFile(repo, file).then(function(content)
                    {
                        cache.set('askme/questions/' + repo + '/' + category, jsyaml.load(content.data));

                        deferred.resolve(jsyaml.load(content.data));
                    });
                }
                else
                {
                    deferred.resolve(cache.get('askme/questions/' + repo + '/' + category));
                }
            });

            return deferred.promise;
        };

        this.getCategoryList = function(repo)
        {
            var deferred = $q.defer();
/**
            deferred.resolve({
                film : {
                    description: "une description",
                    file: ""
                }
            });
*/
            if(!cache.has('askmecompose/' + repo))
            {
                githubContentManager.getFile(repo, "askme-compose.json").then(function(content)
                {
                    cache.set('askmecompose/' + repo, content.data);

                    deferred.resolve(content.data.category);
                });
            }
            else
            {
                deferred.resolve(cache.get('askmecompose/' + repo).category);
            }

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
           return $http.get('https://raw.githubusercontent.com/'+repo+'/master/'+path);
       };
    }])
    .service("packagistManager", ["$resource", "$q", 'cache', function($resource, $q, cache)
    {
        this.addFavorite = function(repo, packageConfig)
        {
            if(!cache.has("askme/favorite")) cache.set("askme/favorite", []);

            if(this.isFavorite(repo)) return;

            var favorites = cache.get("askme/favorite");

            favorites.push(repo);

            cache.set("askme/favorite", favorites);

            this.addFavoritePackage(repo, packageConfig);
        };

        this.removeFavorite = function(repo)
        {
            var favorites = cache.get("askme/favorite");

            favorites = _.without(favorites, repo);

            cache.set("askme/favorite", favorites);

            this.removeFavoritePackage(repo);
        };

        this.getFavoriteList = function () {
            if(!cache.has("askme/favorite")) cache.set("askme/favorite", []);

            return cache.get("askme/favorite");
        };

        this.isFavorite = function(repo)
        {
            if(!cache.has("askme/favorite")) cache.set("askme/favorite", []);

            return _.contains(cache.get("askme/favorite"), repo);
        };

        this.addFavoritePackage = function(repo, packageConfig)
        {
            if(this.hasFavoritePackage(repo)) return;

            cache.set("askme/favorite/package/" + repo, packageConfig);
        };

        this.hasFavoritePackage = function(repo)
        {
           return cache.has("askme/favorite/package/" + repo);
        };

        this.removeFavoritePackage = function(repo)
        {
           cache.del("askme/favorite/package/" + repo);
        };

        this.getPackageByFavorite = function(repo)
        {
            return cache.get("askme/favorite/package/" + repo);
        };

        this.$resource = $resource("https://packagist.org/search.json?tags=askme-compose", {}, {
            search: { method: "get" }
        });

        this.search = function(params)
        {
            var deferred = $q.defer();

            this.$resource.search(params).$promise.then(function(result)
            {
                deferred.resolve(result);
            }).catch(_.bind(function()
            {
                var favoritesList = this.getFavoriteList();

                var result = {
                    results: []
                };

                _.each(favoritesList, function(favoriteName)
                {
                    result.results.push(this.getPackageByFavorite(favoriteName));
                }, this);

                deferred.resolve(result);
            }, this));

            return deferred.promise;
        };
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

            var url = "/#" + routeMatch.originalPath;

            _.each(params, function(val, key, l)
            {
                url = url.replace(new RegExp(":" + key + "(\\W|$)", "g"), function(match, p1) {
                    return val + p1;
                });
            });

            return url;
        };
    }])
    .filter("path", ["urlGenerator", function(urlGenerator)
    {
        return function(name, params)
        {
            if(typeof params == "undefined") params = {};

            return urlGenerator.generate(name, params);
        };
    }])
;