(function () {
    'use strict';
    var app = angular.module('petzCareSP.ManageRoleAuthController', ['app.directives']);
    app.controller('ManageRoleAuthController', ['$scope', '$http', '$location', '$rootScope', '$filter', '$timeout', ManageRoleAuthController]);

    function ManageRoleAuthController($scope, $http, $location, $rootScope, $filter, $timeout) {
        $scope.submitted = false;
        angular.element('#roleAuthloader').css('display','block');
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

        // clear the fields fo role authorization.

        $scope.clearRoleMap = function () {
            $scope.submitted = false;
            $scope.selectederole1 = "";
            $scope.selected_items1 = "";
            $scope.read1 = "";
            $scope.write1 = "";
            $scope.print1 = "";
            $scope.download1 = "";
            $scope.share1 = "";
            $scope.schedule1 = "";
            $scope.selects = "";
            $scope.Roleid = "";
            $scope.checkboxvalues = false;
            alert($scope.checkboxvalues)
        };
      

        var mi = [];
        var arr = [];
        var i;

        //add role
        $scope.add = function () {
            $scope.submitted = true;
            $rootScope.test = [];
          
            mi = $scope.selected_items1;
            for (i = 0; i < mi.length; i++) {
               
                $scope.data = {
                    "role_id": $scope.selectederole1,
                    "am_id": mi[i],
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
            console.log($scope.data1);
            if (!$scope.roleForm.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.data1,
                    url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/AddRoleAuthorization',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {
                        $scope.RoleAuthorizations();
                        //$rootScope.test = [];
                        //$scope.selectederole1 = "";
                        //$scope.selected_items1 = "";
                        //$scope.read1 = "";
                        //$scope.write1 = "";
                        //$scope.print1 = "";
                        //$scope.download1 = "";
                        //$scope.share1 = "";
                        //$scope.schedule1 = "";
                        alert("Role added successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                        $scope.clearRoleMap();
                    }

                }).error(function (response) {
                    $scope.error = response.message;
                });

            }
        };

        $scope.names = [];       
        //$scope.names1 = [];
        setTimeout(function () {
        //show role
       
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetAllRoleAuthorizationMappings',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                var roleMapping = [];              
                var result =  _.each(response, function (object) {
                   object.selects = false;
                   roleMapping.push(object);
               });
                $scope.names = roleMapping;
                //for (var m = 0; m < $scope.names1.length; m=m+10) {                   
                //    $scope.names = $scope.names1.slice(0, 10);
                //}
                             
                console.log($scope.names);
            })
            .finally(function () {
                angular.element('#roleAuthloader').css('display', 'none');
            });
        }, 2000);
         

        $scope.RoleAuthorizations = function () {
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetAllRoleAuthorizationMappings',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                var roleMapping = [];
                var result = _.each(response, function (object) {
                    object.selects = false;
                    roleMapping.push(object);
                });
                $scope.names = roleMapping;
                //for (var m = 0; m < $scope.names1.length; m = m + 10) {
                //    $scope.names = $scope.names1.slice(0, 10);
                //}

            });

        };

        //Sorting
        $scope.RolesSort = function (asc, header) {

            if (asc) {
                $scope.names.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.names.sort(predicatByDes(header));

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
            if (rangeSize >= 6)
            {
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
            
            if ($scope.searchingvalue) {
                var filtereddata = $filter('filter')($scope.names, $scope.searchingvalue);
                return Math.ceil(filtereddata.length / $scope.itemsPerPage) - 1;
            }
            else if (!$scope.searchingvalue) {
                return Math.ceil($scope.names.length / $scope.itemsPerPage) - 1;
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
            //$scope.names = $scope.names1.slice(count, count + 10);            
            $scope.currentPage = n;
        };




        //Close modals
        $scope.CloseModal = function () {
            $('#myModal3').modal('hide');
            $('#myModal').modal('hide');
        }
        
       
        //edit role
      
        var len = [];
       
       
        $scope.edit = function (id_no, selects) {
            $scope.checkboxvalues = selects;
            console.log($scope.checkboxvalues);
            if ($scope.checkboxvalues) {
                len.push(id_no);
              
            }
            else if (!$scope.checkboxvalues) {
                len = _.without(len, id_no);
             
            }
          
            alert($scope.checkboxvalues);
            $scope.Editid = len;
            var editRole = $scope.Editid.length;
            console.log(editRole);
            if (editRole == 1) {
                $scope.Roleid = { "mapping_id": $scope.Editid[0] };
                console.log( $scope.Roleid);
                var getdata = $http({
                    method: 'POST',
                    data: $scope.Roleid,
                    url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetRoleAuthorizationMappingById',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (names1) {

                    $scope.viewroles = names1[0];

                    $scope.mapping_id = names1[0].mapping_id;
                    $scope.selectederole = names1[0].role_id;
                    $rootScope.test.push(names1[0].am_id);
                    $scope.read = names1[0].can_read;
                    $scope.write = names1[0].can_write;
                    $scope.print = names1[0].can_print;
                    $scope.download = names1[0].can_download;
                    $scope.share = names1[0].can_share;
                    $scope.schedule = names1[0].can_schedule;
                    $scope.created_by = names1[0].created_by;
                    $scope.created_date = names1[0].created_date;
                    $scope.is_deleted = names1[0].is_deleted;
                    $scope.modified_by = names1[0].modified_by;
                    $scope.modified_date = names1[0].modified_date;
                });


                getdata.error(function (names1) {
                    console.log(error);
                });
            }

            else {

                $rootScope.test = [];
                $scope.selectederole = "";
                $scope.selected_items1 = "";
                $scope.read = "";
                $scope.write = "";
                $scope.print = "";
                $scope.download = "";
                $scope.share = "";
                $scope.schedule = "";
                $scope.selects = "";
                $scope.Roleid = "";
                $scope.checkboxvalues = false;
            }

        };
        
        var midat = [];
        var array = [];

            $scope.add1 = function () {
                
            midat = $rootScope.test;
            for (i = 0; i < midat.length; i++) {
                $scope.data = {
                    'mapping_id': $scope.mapping_id,
                    "role_id": $scope.selectederole,
                    "am_id": midat[i],
                    "can_read": $scope.read || "N",
                    "can_write": $scope.write || "N",
                    "can_print": $scope.print || "N",
                    "can_download": $scope.download || "N",
                    "can_share": $scope.share || "N",
                    "can_schedule": $scope.schedule || "N",
                    "is_deleted": $scope.is_deleted,
                    "modified_by": $scope.modified_by,
                    "modified_date": $scope.modified_date
                }
                array[i] = $scope.data;

            }
            $scope.data2 = array;

            if (!$scope.editForm.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.data2,
                    url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/UpdateRoleAuthorization',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {
                        $scope.RoleAuthorizations();
                        $scope.selects = false;
                        $rootScope.test = [];
                        $scope.selectederole = "";
                        $scope.read = "";
                        $scope.write = "";
                        $scope.print = "";
                        $scope.download = "";
                        $scope.share = "";
                        $scope.schedule = "";
                        $scope.checkboxvalues = false;
                        alert($scope.checkboxvalues);
                        alert("Role updated successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                        $scope.clearRoleMap();
                        $scope.Roleid = "";
                        $scope.x.selects = false;
                        alert(x.selects);
                    }

                }).error(function (response) {
                    $scope.error = response.message;
                });
            }

        };

        $scope.credent = {
            "lm_name": "Role"
        }
        var val = [];
        var mine = [];

        $http({
            method: 'POST',
            data:$scope.credent,
            url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetailByMasterName',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (data) {
                            
            var len = data.length;
            for (var i = 0; i < len; i++) {
                mine[i] = _.pick(JSON.parse(JSON.stringify(data[i])), 'ld_name', 'ld_id');
            }

            $scope.erole = mine;



        });


        //rolemap

        var array1 = [];

        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/getAllAuthorizations',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {
            var len = response.length;
            for (var i = 0; i < len; i++) {
                array1[i] = _.pick(JSON.parse(JSON.stringify(response[i])), 'am_name', 'am_id');
            }
            $scope.nam2 = array1;
            
        });

      
        $scope.member = { nam2: [] };
        $scope.selected_items1 = [];

        
       
        
    };

    



    // Multiselect Dropdown        
    var app_directives = angular.module('app.directives', []);

    app_directives.directive('dropdownMultiselect', function(){
        return {
            restrict: 'E',
            scope:{           
                model: '=',
                options: '=',
                pre_selected: '=preSelected'
            },
            template: "<div class='btn-group' data-ng-class='{open: open}'>"+
                            "<button class='btn btn-small dropdown-toggle' selected_items data-ng-click='open=!open;openDropdown()'>Select<span class='caret'></span></button>"+
                     "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" + 
                           "<li><a data-ng-click='isChecked(selectAll(1))'> Select All</a></li>" +
                         "<li class='divider'></li>" +
                         "<li data-ng-repeat='option in options' ng-readonly='true'> <a data-ng-click='setSelectedItem()'>{{option.am_name}}      <span data-ng-class='isChecked(option.am_id)' id='removecheck1'></span><span data-ng-class='isChecked(selected_items1)'></span></a></li>" +
                     "</ul>" +
                 "</div>" ,
            controller: function ($scope, $rootScope) {
                var count=0;
               

                $scope.openDropdown = function(){        
                    $scope.selected_items1 = [];
                    if ($scope.pre_selected) {
                        for (var i = 0; i < $scope.pre_selected.length; i++) {
                            $scope.selected_items1.push($scope.pre_selected[i].am_id);
                            $scope.count = i;
                           
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
                    
                    var am_id = this.option.am_id;
                   
              
                    if (_.contains($rootScope.test, am_id)) {
                        $rootScope.test = _.without($rootScope.test, am_id);
                    } else {
                        $rootScope.test.push(am_id);
                    }
                    $scope.model = $rootScope.test;
                  
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
        console.log(selected_items1);
    });


    



    // Pagination filter
    app.filter('pagination', function () {
        return function (input, start) {
            start = parseInt(start, 10);
            return input.slice(start);
        };
    });


    //search
    //app.filter('startsWithLettera', function () {
    //    return function (x, letter) {
    //        var filtered = [];
    //        var letterMatch = new RegExp(letter, 'i');
    //        for (var i = 0; i < x.length; i++) {
    //            var item = x[i];
    //            if (letterMatch.test(item.role_name.substring(0, 20))) {
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