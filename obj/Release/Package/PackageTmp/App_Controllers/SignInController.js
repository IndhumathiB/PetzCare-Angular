(function () {
    'use strict';
    var app = angular.module('petzCareSP.SignInController', []);
    app.controller('SignInController', ['$scope', '$http', '$location', '$rootScope', SignInController]);

    function SignInController($scope, $http, $location, $rootScope) {



       
////Signin
        //$scope.signin = function () {
          

        //    $scope.credentials = {
        //        'user_name': $scope.uname,
        //        'password': $scope.password
        //    }
        //    var LogInAuth = $http({
        //        method: 'POST',
        //        data: $scope.credentials,
        //        url: 'http://166.62.84.37/PetzCareWSQA/LogInService.svc/LogInServiceAuth',
        //        headers: {
        //            "Content-Type": 'application/json',
        //        }
        //    })

        //    LogInAuth.success(function (response, status, headers) {
                
        //        // var cookies = headers('Set-Cookie');
        //        //       console.log(cookies);
        //        // console.log(response);
        //        //console.log(headers);

        //        //$cookies.put('auth1', ResponseHeaders());
        //        //// $cookies.put('auth',Set-Cookie);
        //        //alert($cookies.get('auth1'));
        //        // alert($cookies.get('auth'));

        //        // And redirect to the index page
        //        if (response) {
        //            var headers1 = response;
        //            console.log(headers('Set-Cookie'));
        //            $rootScope.globalInstance = "hai";
        //            $location.path('/Home/Index');
        //        }

        //    }).error(function (status, headers) {
        //        $location.path('/signin');
        //        // $cookieStore.remove('auth');
        //        console.log("Error");
        //        // $scope.error = response.message;
        //    });
        //};








//Sign up

        $scope.credent = {
            "lm_name": "Country"
        }

        var country1 = [];
        var getprofile = $http({
            method: 'POST',
            data : $scope.credent,
            url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetailByMasterName',
            headers: {
                "Content-Type": 'application/json',
            }
        })
        getprofile.success(function (data) {

             var len = data.length;
             for (var i = 0; i < len; i++) {
                 country1[i] = _.pick(JSON.parse(JSON.stringify(data[i])), 'ld_name', 'ld_id');
             }
             $scope.country = country1;
        })
        getprofile.error(function (data) {
            console.log("error");

        });

        
        

        $scope.state = function () {

            var stateid = { "ld_id": $scope.selectedcountry };

            var state1 = [];
            $http.post('http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetailByParentId', stateid).success(function (data) {
                // If successful we assign the response to the global user model


                var len = data.length;
                for (var i = 0; i < len; i++) {
                    state1[i] = _.pick(JSON.parse(JSON.stringify(data[i])), 'ld_name', 'ld_id');
                }
                $scope.state = state1;



            });

        };
        $scope.city = function () {
            var cityid = { "ld_id": $scope.selectedstate };
            var city1 = [];
            $http.post('http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetailByParentId', cityid).success(function (data) {
                // If successful we assign the response to the global user model


                var len = data.length;
                for (var i = 0; i < len; i++) {
                    city1[i] = _.pick(JSON.parse(JSON.stringify(data[i])), 'ld_name', 'ld_id');
                }
                $scope.city = city1;



            });

        };






    };
})();