(function () {
    'use strict';
    var app = angular.module('petzCareSP.DashboardController', []);
    app.controller('DashboardController', ['$scope', '$http', '$location', DashboardController]);

    function DashboardController($scope, $http, $location) {
        $scope.date = new Date();       
        $scope.tomorrow = new Date();
        $scope.tomorrow.setDate($scope.tomorrow.getDate() + 1);    
        angular.element('#dashboardloader').css('display', 'block');
        setTimeout(function () {
            $scope.dashboarddetail = [];
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWS/LogInService.svc/DashBoardInfo',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                $scope.dashboarddetail = response;
               
            })
        .finally(function () {
            angular.element('#dashboardloader').css('display', 'none');
        });
        }, 2000);
    };

})();




