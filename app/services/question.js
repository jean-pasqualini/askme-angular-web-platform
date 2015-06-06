'use strict';

angular
    .module('myApp.services', ['ngResource'])
    .factory('questionManager', ['$resource', function($resource)
    {
        return $resource('https://rawgit.com/certificationy/symfony-pack/master/data/architecture.yml', {}, {
            get: {
                transformResponse: function(yamlContent, headers)
                {
                    return jsyaml.load(yamlContent);
                }
            }
        });
    }])
    .factory("packagistManager", ["$resource", function($resource)
    {
        return $resource("https://packagist.org/search.json?tags=locale", {}, {
            search: { method: "get" }
        });
    }])
;