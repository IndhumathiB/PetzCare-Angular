(function () {
    'use strict';
    var app = angular.module('petzCareSP.UserRoleMapController',['app.directives5']);
    app.controller('UserRoleMapController', ['$scope', '$http', '$location', '$rootScope', '$filter', '$timeout', UserRoleMapController]);

    function UserRoleMapController($scope, $http, $location, $rootScope, $filter, $timeout) {
        $scope.submitted = false;
        angular.element('#userRoleloader').css('display', 'block');
        $rootScope.urmap = [];
        var timestamp = Number(new Date());
        $scope.m = "\/Date(" + timestamp + ")\/";
        $scope.userroledatas = [];
        //$scope.userroledatas1 = [];

        //show user
        setTimeout(function () {

        $http({
            method: 'GET',
            data: $scope.data1,
            url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetAllRoleUserMappings',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {
            var roleMapping = [];
            var result = _.each(response, function (object) {
                object.selects = false;
                roleMapping.push(object);
            });
            $scope.userroledatas = roleMapping;
            //for (var m = 0; m < $scope.userroledatas1.length; m = m + 10) {
            //    $scope.userroledatas = $scope.userroledatas1.slice(0, 10);
            //}
           


        }).finally(function () {
            angular.element('#userRoleloader').css('display', 'none');
        });
}, 2000);


        $scope.UserRoleAuthorization = function () {
            $http({
                method: 'GET',
                data: $scope.data1,
                url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetAllRoleUserMappings',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                var roleMapping = [];
                var result = _.each(response, function (object) {
                    object.selects = false;
                    roleMapping.push(object);
                });

                $scope.userroledatas = roleMapping;

            });
        };


        //Clear
        $scope.clearUserRoleMapping = function ()
        {
            $scope.submitted = false;
            $rootScope.urmap = [];
            $scope.selecteduruser = "";
            $scope.selected_items5 = "";
        }
        //Sorting
        $scope.UserRolesSort = function (asc, header) {

            if (asc) {
                $scope.userroledatas.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.userroledatas.sort(predicatByDes(header));

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

        $scope.itemsPerPage = 10;
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
            if ($scope.val) {
                var filt = $filter('filter')($scope.userroledatas, $scope.val);
                return Math.ceil(filt.length / $scope.itemsPerPage) - 1;
            }
            else if (!$scope.val) {
                return Math.ceil($scope.userroledatas.length / $scope.itemsPerPage) - 1;
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
            //var count = n * 10;
            //$scope.userroledatas = $scope.userroledatas1.slice(count, count + 10);
            $scope.currentPage = n;
        };




        //Hide Dropdown
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
            $scope.uruser = users;

            

        });

       
        var amids = [];
        var arr = [];
        var i;

        //add user
        $scope.urmadd = function () {
            $scope.submitted = true;
            $rootScope.urmap = [];
            amids = $scope.selected_items5;

            for (i = 0; i < amids.length; i++) {


                
                $scope.data = {
                    "user_id": $scope.selecteduruser,
                    "role_id": amids[i],
                    "created_by": 1,
                    "created_date": $scope.m,
                    "is_deleted": "n",
                    "modified_by": 1,
                    "modified_date": $scope.m

                }


                arr[i] = $scope.data;

            }
            $scope.data1 = arr;
            if (!$scope.AddUserRoleForm.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.data1,
                    url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/AddRoleUserAuthorization',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response = true) {
                        $scope.UserRoleAuthorization();

                        alert("UserRole added successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                    }

                }).error(function (response) {
                    $scope.error = response.message;
                });
            }

        };



        //edit role
        var len = [];        
        $scope.edit = function (idno, checking) {

           
            if(checking) {
                len.push(idno);
            }
            else if (!checking) {
               len = _.without(len, idno);
           }            
            $scope.Editid = len;
            var editLength = $scope.Editid.length;
           
           
            if (editLength == 1) {

                var id = { "mapping_id": $scope.Editid[0] };
                var getusers =
                     $http({
                         method: 'POST',
                         data: id,
                         url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetRoleAUserMappingById',
                         headers: {
                             "Content-Type": 'application/json',
                         }
                     }).success(function (response) {

                         $scope.urolempdatas = response[0];
                         $scope.mapping_id = response[0].mapping_id;
                         $scope.selectedupduser = response[0].user_id;
                         console.log($scope.selectedupduser);
                         $rootScope.urmap.push(response[0].role_id);
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

                $rootScope.urmap = [];
                $scope.selectedupduser = "";
                $scope.selected_items5 = "";
              
            }

        };
        var midat = [];
        var array = [];
        $scope.urmadd1 = function () {
            $scope.submitted = true;
            midat = $rootScope.urmap;
           
            for (i = 0; i < midat.length; i++) {
                               
                $scope.usersrolemap = {
                    'mapping_id': $scope.mapping_id,
                    "user_id": $scope.selectedupduser,
                    "role_id": midat[i],
                    "is_deleted": $scope.is_deleted,
                    "modified_by": $scope.modified_by,
                    "modified_date": $scope.m
                }
                array[i] = $scope.usersrolemap;
            }
            $scope.usersrolemap2 = array;

            if (!$scope.UpdateUserForm.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.usersrolemap2,
                    url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/UpdateRoleUserAuthorization',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {
                        $scope.UserRoleAuthorization();
                        //$rootScope.urmap = [];
                        //$scope.selectedupduser = "";
                        alert("UserRole updated successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                    }

                }).error(function (response) {
                    $scope.error = response.message;
                });
            }

        };

        //Close modals
        $scope.CloseModal = function () {
            $('#myModal3').modal('hide');
            $('#myModal').modal('hide');
        }

        //Delete Userrole
       
        $scope.userroledelete = function (userroleid, ind) {

            $scope.DeltData = {
               
                    "is_deleted":"Y",
                    "mapping_id": userroleid,
                    "modified_by":2,
                    "modified_date": $scope.m
                }
         
            var Delete = confirm("Are You Sure. You Want to delete?");
            if (Delete == true) {

                $http.post("http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/DeleteRoleUserAuthorization", $scope.DeltData).success(function (response) {
                    $scope.UserRoleAuthorization();
                   // alert("Userrole deleted successfully");
                    $scope.userroledatas.splice(ind, 1);



                });

            }
           
        };


    



    //rolemap


    var value = [];

    $http({
        method: 'POST',
        data:{"lm_name": "Role"},
        url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetailByMasterName',
        headers: {
            "Content-Type": 'application/json',
        }
    }).success(function (response) {
                  
        var len = response.length;
        for (var i = 0; i < len; i++) {
            value[i] = _.pick(JSON.parse(JSON.stringify(response[i])), 'ld_name', 'ld_id');
        }

        $scope.nam5 = value;
    });



      


    $scope.members = { nam5: [] };
    $scope.selected_items5 = [];

       

};

    // Pagination filter
    app.filter('pagination', function () {
        return function (input, start) {
            start = parseInt(start, 10);
            return input.slice(start);
        };
    });

// Multiselect Dropdown        
var app_directives5 = angular.module('app.directives5', []);

app_directives5.directive('dropdownMultiselect2', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            options: '=',
            pre_selected: '=preSelected'
        },
        template: "<div class='btn-group' data-ng-class='{open: open}'>" +
                        "<button class='btn btn-small dropdown-toggle' selected_items5 data-ng-click='open=!open;openDropdown5()'>Select<span class='caret'></span></button>" +
                 "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
                     "<li><a data-ng-click='isChecked5(selectAll5(1))'> Select All</a></li>" +
                     "<li class='divider'></li>" +
                     "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem5()'>{{option.ld_name}}      <span data-ng-class='isChecked5(option.ld_id)'></span></a></li>" +
                 "</ul>" +
             "</div>",
        controller: function ($scope, $rootScope) {
            var count = 0;


            $scope.openDropdown5 = function () {
                $scope.selected_items5 = [];
                if ($scope.pre_selected) {
                    for (var i = 0; i < $scope.pre_selected.length; i++) {
                        $scope.selected_items5.push($scope.pre_selected[i].ld_id);
                        $scope.count = i;
                        console.log($scope.count);
                    }
                }
            };

            $scope.selectAll5 = function (inc) {
                count += inc;
                if (count % 2 == 0) {
                    $rootScope.urmap = [];
                           

                }
                else {

                    $rootScope.urmap = _.pluck($scope.options, 'ld_id');
                       

                }
                $scope.model = $rootScope.urmap;

            };

            $scope.setSelectedItem5 = function () {
                console.log("options");
                console.log($scope.options);
                var ld_id = this.option.ld_id;
                console.log("setSelectedItem");

                if (_.contains($rootScope.urmap, ld_id)) {
                    $rootScope.urmap = _.without($rootScope.urmap, ld_id);
                } else {
                    $rootScope.urmap.push(ld_id);
                }
                $scope.model = $rootScope.urmap;
                console.log($rootScope.urmap);
                return false;

            };

            $scope.isChecked5 = function (ld_id) {

                if (_.contains($rootScope.urmap, ld_id)) {
                    return 'fa fa-check';
                }
                return false;
            };


        }
    }
    console.log(selected_items5);
});


app.filter('startsWithLettr', function () {
    return function (x, letter) {
        var filtered = [];
        var letterMatch = new RegExp(letter, 'i');
        for (var i = 0; i < x.length; i++) {
            var item = x[i];
            if (letterMatch.test(item.user_name.substring(0, 20))) {
                filtered.push(item);
            }
            else if (letterMatch.test(item.role_name.substring(0, 20))) {
                filtered.push(item);
            }
        }
        return filtered;
    };
});






})();
