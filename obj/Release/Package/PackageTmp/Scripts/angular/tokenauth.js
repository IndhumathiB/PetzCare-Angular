var app = angular.module('petzApp', ['ngCookies']);
var baseUrl = 'http://localhost:8081/Petzcare25/'

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q, $cookies) {
            return {
                'request': function (config) {
                    var authToken = $cookies.get('authToken');
                    if (authToken) {
                        config.headers['ASPXAUTH'] = authToken;
                    }
                    return config || $q.when(config);
                }
            };
        });

    $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
            return {
                'responseError': function (rejection) {
                    var status = rejection.status;
                    var config = rejection.config;
                    if (config) {
                            method = config.method;
                            url = config.url;
                        }

                    if (status == 401) {
                        $location.path("/signin");
                    } else {
                        $rootScope.error = method + " on " + url + " failed with status " + status;
                    }

                    return $q.reject(rejection);
                }
            };
        });

}]);
