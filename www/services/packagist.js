'use strict';

angular.module('myApp.services', ['ngResource']).factory("packagistManager", ["$resource", function($resource)
    {
        return $resource("https://packagist.org/search.json?tags=locale", {}, {
            search: { method: "get" }
        });
    }]);