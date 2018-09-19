(function () {
    'use strict';
    var app = angular.module('petzCareSP.ManageUserRoleController', ['app.directives']);
    app.controller('ManageUserRoleController', ['$scope', '$http', '$location', '$rootScope', '$filter', '$timeout', ManageUserRoleController]);

    function ManageUserRoleController($scope, $http, $location, $rootScope, $filter, $timeout) {
        $scope.submitted = false;
        angular.element('#manageuserloader').css('display', 'block');
        $rootScope.test = [];
        var timestamp = Number(new Date());
        $scope.m = "\/Date(" + timestamp + ")\/";

        var obj = [];

        $scope.multivalue = 1;
        $scope.Onehide = function (value) {


            if (value) {
                obj.push(value);

            }
            else {
                obj.splice(0, 1);

            }

            if (obj.length == 1) {

                $scope.multivalue = 0;
            }
            else {

                $scope.multivalue = 1;

            }


        }

       
        /// error Message 

        $scope.errormessage = function () {
            alert("Please select any one Check Box !");
        }
        $scope.errormessage1 = function () {
            alert("Please dont select any Check Box !");
        }

        //Display Users
        var users = [];
                 
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetAllUsers',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    users[i] = _.pick(JSON.parse(JSON.stringify(data[i])), 'user_name', 'user_id');
                }
                $scope.urole = users;
               


            });


            $scope.clearuserRoleMap = function () {
            $scope.submitted = false;
            $scope.selectedurole = "";
            $rootScope.test = [];
            $scope.read1 = "";
            $scope.write1 = "";
            $scope.print1 = "";
            $scope.download1 = "";
            $scope.share1 = "";
            $scope.schedule1 = "";
            $scope.selected_items3 = "";
        }

        var amids = [];
        var arr = [];
        var i;

        //add user
        $scope.uadd = function () {
            $scope.submitted = true;
            $rootScope.test = [];
            amids = $scope.selected_items3;
           
            for (i = 0; i < amids.length; i++) {
              
                $scope.data = {
                    "user_id": $scope.selectedurole,
                    "am_id": amids[i],
                    "can_read": $scope.read1 || "N",
                    "can_write": $scope.write1 || "N",
                    "can_print": $scope.print1 || "N",
                    "can_download": $scope.download1 || "N",
                    "can_share": $scope.share1 || "N",
                    "can_schedule": $scope.schedule1 || "N",
                    "created_by": 1,
                    "created_date": $scope.m,
                    "is_deleted": "n",
                    "modified_by": 2,
                    "modified_date": $scope.m

                }

                
                arr[i] = $scope.data;
                
            }
            $scope.data1 = arr;
            if (!$scope.userForm.$invalid) {

                $http({
                    method: 'POST',
                    data: $scope.data1,
                    url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/AddUserAuthorization',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {
                        $scope.UserAuthorization();
                        //$rootScope.test = [];
                        //$scope.selectedurole = "";
                        //$scope.selected_items3 = "";
                        //$scope.read1 = "";
                        //$scope.write1 = "";
                        //$scope.print1 = "";
                        //$scope.download1 = "";
                        //$scope.share1 = "";
                        //$scope.schedule1 = "";
                        alert("User added successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                    }

                }).error(function (response) {
                    $scope.error = response.message;
                });

            }
        };

        $scope.userdatas = [];
      
        //show user
       
        setTimeout(function () {
        $http({
            method: 'GET',
            data:$scope.data1,
            url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetAllUserAuthorizationMappings',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {
            var roleMapping = [];
            var result = _.each(response, function (object) {
                object.selects = false;
                roleMapping.push(object);
            });

            $scope.userdatas = roleMapping;
           

        }).finally(function () {
            angular.element('#manageuserloader').css('display', 'none');
        });
        }, 2000);

        $scope.UserAuthorization = function () {
            $http({
                method: 'GET',
                data: $scope.data1,
                url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetAllUserAuthorizationMappings',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                var roleMapping = [];
                var result = _.each(response, function (object) {
                    object.selects = false;
                    roleMapping.push(object);
                });

                $scope.userdatas = roleMapping;
            });

        };

        //Close modals
        $scope.CloseModal = function () {
            $('#myModal3').modal('hide');
            $('#myModal').modal('hide');
        }

        //Sorting
        $scope.UserSort = function (asc, header) {

            if (asc) {
                $scope.userdatas.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.userdatas.sort(predicatByDes(header));

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


        $scope.itemsPerPage =10;
        $scope.currentPage = 0;

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
            
            if ($scope.findroleauthval) {
                var fi = $filter('filter')($scope.userdatas, $scope.findroleauthval);
                return Math.ceil(fi.length / $scope.itemsPerPage) - 1;
            }
            else if (!$scope.findroleauthval) {
                return Math.ceil($scope.userdatas.length / $scope.itemsPerPage) - 1;
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



        $scope.viewdatas = [];
        var len = [];
        //edit role
        $scope.edit = function (id_no, checks) {
            if (checks) {
                len.push(id_no);
            }
            else if (!checks) {
                len = _.without(len, id_no);
            }
            $scope.Editid = len;
            var editUser = $scope.Editid.length;


            if (editUser == 1)  {

                var id = { "mapping_id": $scope.Editid[0] };
                var getusers =
                     $http({
                         method: 'POST',
                         data:id,
                         url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetUserAuthorizationMappingById',
                         headers: {
                             "Content-Type": 'application/json',
                         }
                     }).success(function (response) {

                         $scope.viewdatas = response[0];


                    $scope.mapping_id = response[0].mapping_id;
                    $scope.selecteduser = response[0].user_id;                  
                    $rootScope.test.push(response[0].am_id);
                    $scope.read3 = response[0].can_read;
                    $scope.write3 = response[0].can_write;
                    $scope.print3 = response[0].can_print;
                    $scope.download3 = response[0].can_download;
                    $scope.share3 = response[0].can_share;
                    $scope.schedule3 = response[0].can_schedule;
                    $scope.created_by = response[0].created_by;
                    $scope.created_date = response[0].created_date;
                    $scope.is_deleted = response[0].is_deleted;
                    $scope.modified_by = response[0].modified_by;
                    $scope.modified_date = response[0].modified_date;
                });


                getusers.error(function (names1) {
                    console.log(error);
                });
            }
            else {

                $rootScope.test = [];
                $scope.selecteduser = "";
                $scope.selected_items3 = "";
                $scope.read = "";
                $scope.write = "";
                $scope.print = "";
                $scope.download = "";
                $scope.share = "";
                $scope.schedule = "";
            }
          
        };
        var midat = [];
        var array = [];
        console.log($scope.read3);
        $scope.useradd1 = function () {
           
            midat = $rootScope.test;
            console.log(midat);
            for (i = 0; i < midat.length; i++) {
                $scope.usersrole = {
                    'mapping_id': $scope.mapping_id,
                    "user_id": $scope.selecteduser,
                    "am_id": midat[i],
                    "can_read": $scope.read3 || "N",
                    "can_write": $scope.write3 || "N",
                    "can_print": $scope.print3 || "N",
                    "can_download": $scope.download3 || "N",
                    "can_share": $scope.share3 || "N",
                    "can_schedule": $scope.schedule3 || "N",
                    "is_deleted": $scope.is_deleted,
                    "modified_by": $scope.modified_by,
                    "modified_date": $scope.modified_date
                }
                array[i] = $scope.usersrole;
            }
            $scope.usersrole2 = array;

            console.log($scope.usersrole2);
            if (!$scope.euserForm.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.usersrole2,
                    url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/UpdateUserAuthorization',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {
                        $scope.UserAuthorization();
                        //$rootScope.test = [];
                        //$scope.selecteduser = "";
                        //$scope.read3 = "";
                        //$scope.write3 = "";
                        //$scope.print3 = "";
                        //$scope.download3 = "";
                        //$scope.share3 = "";
                        //$scope.schedule3 = "";
                        alert("User updated successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                    }

                }).error(function (response) {
                    $scope.error = response.message;
                });

            }
        };









        //rolemap


        var value = [];

        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/getAllAuthorizations',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {
                  
            var len = response.length;
            for (var i = 0; i < len; i++) {
                value[i] = _.pick(JSON.parse(JSON.stringify(response[i])), 'am_name', 'am_id');
            }

            $scope.nam4 = value;
        });



      


        $scope.member = { nam4: [] };
        $scope.selected_items3 = [];

       

    };


    // Multiselect Dropdown        
    var app_directives = angular.module('app.directives', []);

    app_directives.directive('dropdownMultiselect', function () {
        return {
            restrict: 'E',
            scope: {
                model: '=',
                options: '=',
                pre_selected: '=preSelected'
            },
            template: "<div class='btn-group' data-ng-class='{open: open}'>" +
                            "<button class='btn btn-small dropdown-toggle' selected_items data-ng-click='open=!open;openDropdown()'>Select<span class='caret'></span></button>" +
                     "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
                         "<li><a data-ng-click='isChecked(selectAll(1))'> Select All</a></li>" +
                         "<li class='divider'></li>" +
                         "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem()'>{{option.am_name}}      <span data-ng-class='isChecked(option.am_id)'></span></a></li>" +
                     "</ul>" +
                 "</div>",
            controller: function ($scope, $rootScope) {
                var count = 0;


                $scope.openDropdown = function () {
                    $scope.selected_items3 = [];
                    if ($scope.pre_selected) {
                        for (var i = 0; i < $scope.pre_selected.length; i++) {
                            $scope.selected_items3.push($scope.pre_selected[i].am_id);
                            $scope.count = i;
                            console.log($scope.count);
                        }
                    }
                };

                $scope.selectAll = function (inc) {
                    count += inc;
                    if (count % 2 == 0) {
                        $rootScope.test = [];
                           

                    }
                    else {

                        $rootScope.test = _.pluck($scope.options, 'am_id');
                       

                    }
                    $scope.model = $rootScope.test;

                };

                $scope.setSelectedItem = function () {
                    console.log("options");
                    console.log($scope.options);
                    var am_id = this.option.am_id;
                    console.log("setSelectedItem");

                    if (_.contains($rootScope.test, am_id)) {
                        $rootScope.test = _.without($rootScope.test, am_id);
                    } else {
                        $rootScope.test.push(am_id);
                    }
                    $scope.model = $rootScope.test;
                    console.log($rootScope.test);
                    return false;

                };

                $scope.isChecked = function (am_id) {

                    if (_.contains($rootScope.test, am_id)) {
                        return 'fa fa-check';
                    }
                    return false;
                };


            }
        }
        console.log(selected_items3);
    });






    // Pagination filter
    app.filter('pagination', function () {
        return function (input, start) {
            start = parseInt(start, 10);
            return input.slice(start);
        };
    });


    //app.filter('startsWithLetter1', function () {
    //    return function (x, letter) {
    //        var filtered = [];
    //        var letterMatch = new RegExp(letter, 'i');
    //        for (var i = 0; i < x.length; i++) {
    //            var item = x[i];
    //            if (letterMatch.test(item.user_name.substring(0, 20))) {
    //                filtered.push(item);
    //            }
    //            else if (letterMatch.test(item.authorization_name.substring(0, 20))) {
    //                filtered.push(item);
    //            }
    //        }
    //        return filtered;
    //    };
    //});



})();