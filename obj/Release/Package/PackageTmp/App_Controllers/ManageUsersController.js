(function () {
    'use strict';
    var app = angular.module('petzCareSP.ManageUsersController', []);
    app.controller('ManageUsersController', ['$scope', '$http', '$location','$filter', ManageUsersController]);

    function ManageUsersController($scope, $http, $location,$filter) {
        angular.element('#mainloader').css('display', 'block');

        var timestamp = Number(new Date());
        $scope.emdeldate = "\/Date(" + timestamp + ")\/";

        $scope.employees = [];
       setTimeout(function () {
        $http.get("http://166.62.84.37/PetzCareWSQA/Employee.svc/GetAllEmployees")
            .success(function (response) {               
                $scope.employees = response;
            }).finally(function () {
            angular.element('#mainloader').css('display', 'none');
        });
    }, 2000);

       
       $scope.refreshEmployees = function () {
         $http.get("http://166.62.84.37/PetzCareWSQA/Employee.svc/GetAllEmployees")
           .success(function (response) {
               $scope.employees = response;
           })
               };

        //Sorting
       $scope.EmployeeSort = function (asc, header) {

    if (asc) {
        $scope.employees.sort(predicatByAsc(header));

    }
    if (!asc) {
        $scope.employees.sort(predicatByDes(header));

    }
     };
   function predicatByAsc(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
  }

   function predicatByDes(prop) {
    return function (a, b) {
        if (a[prop] < b[prop]) {
            return 1;
        } else if (a[prop] > b[prop]) {
            return -1;
        }
        return 0;
    }
  }


        //Pagination 
                     
        $scope.currentPage = 0;
        $scope.itemsPerPage =10;
        $scope.dropvalues = [10, 25, 50];
                 
       
        $scope.range = function () {
            var rangeSize = $scope.pageCount();
            if (rangeSize >= 6) {
                rangeSize = 5;
            }
            var ps = [];
            var start;

            start = $scope.currentPage;
            if (start > $scope.pageCount() - rangeSize) {
                start = $scope.pageCount() - rangeSize + 1;
            }

            for (var i = start; i < start + rangeSize; i++) {
                ps.push(i);
            }
            return ps;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.DisablePrevPage = function () {
            return $scope.currentPage === 0 ? "disabled" : "";
        };

        $scope.pageCount = function () {
            if ($scope.query) {
                var filtereddata = $filter('filter')($scope.employees, $scope.query);
                return Math.ceil(filtereddata.length / $scope.itemsPerPage) - 1;
            }
            else if (!$scope.query) {
                return Math.ceil($scope.employees.length / $scope.itemsPerPage) - 1;
            }
            
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.pageCount()) {
                $scope.currentPage++;
            }
        };

        $scope.DisableNextPage = function () {
            
            return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
        };

        $scope.setPage = function (n) {
            $scope.currentPage = n;
        };

       

        









        function integertodate(birth_date) {

            var res = birth_date.substring(birth_date.indexOf("(") + 1, birth_date.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
        }

        function integertodate(joining_date) {

            var res = joining_date.substring(joining_date.indexOf("(") + 1, joining_date.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
        }


        var emp = [];
        $scope.employeefltr = function (idno) {

            var id1 = { "employee_id": idno };

            $http.post("http://166.62.84.37/PetzCareWSQA/Employee.svc/GetEmployeeById", id1).success(function (response) {              
               
                var roleMapping = [];
                var result = _.each(response, function (object) {
                    object.selects = false;
                    roleMapping.push(object);
                });
                for (var j = 0; j < roleMapping.length; j++) {
                    var pickdates1 = integertodate(roleMapping[j].joining_date);
                    var Dates = pickdates1.split(",");
                    roleMapping[j].joining_date = Dates[0];
                    var pickdates = integertodate(roleMapping[j].birth_date);
                    var Dates = pickdates.split(",");
                    roleMapping[j].birth_date = Dates[0];

                }
                 $scope.employees = response[0];
               
            });



        };

        //Delete Employee/ ManageUsers
        $scope.empdelete = function (emid,comid,ind) {
          
            $scope.DeltData = {
                "CommEntity":
                {
                    "is_deleted": "Y",
                    "modified_by": 1,
                    "modified_date": $scope.emdeldate,
                    "communication_id": comid
                },
                "UsersEntity":
                 {
                     "is_deleted": "Y",
                     "modified_by": 1,
                     "modified_date": $scope.emdeldate
                 },
                "EmpEntity":
                 {
                     "employee_id": emid,
                     "is_deleted": "Y",
                     "modified_by": 1,
                     "modified_date": $scope.emdeldate
                 }
            }

            var Delete = confirm("Are you sure. You want to delete the user?");
            if (Delete == true) {
            $http.post("http://166.62.84.37/PetzCareWSQA/Employee.svc/DeleteEmployee", $scope.DeltData).success(function (response) {
                if (response.DeleteResult == true) {
                   //alert("User deleted successfully");
                   $scope.refreshEmployees();
                }
               

            });

            }
           

        };




    };
    // Pagination filter
    app.filter('pagination', function () {
        return function (input, start) {
            start = parseInt(start, 10);
            return input.slice(start);
        };
    });

})();