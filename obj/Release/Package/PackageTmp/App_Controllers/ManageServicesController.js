(function () {
    'use strict';
    var app = angular.module('petzCareSP.ManageServicesController', []);
    app.controller('ManageServicesController', ['$scope', '$http', '$location', '$rootScope', '$filter', '$timeout', ManageServicesController]);


    function ManageServicesController($scope, $http, $rootScope, $filter, $timeout) {
        $scope.submitted = false;
        angular.element('#manageServicesloader').css('display', 'block');
        $scope.ServiceLists = [];
        $scope.ServiceBoarding = [];
        var ServiceList = [];
        var ServiceBoard = [];
        var timestamp = Number(new Date());
        $scope.srcedate = "\/Date(" + timestamp + ")\/";

        setTimeout(function () {
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/PetServices.svc/GetAllServices',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {
                var roleMapping = [];
                var result = _.each(data, function (object) {
                    object.selects = false;
                    roleMapping.push(object);
                });
                for (var j = 0; j < roleMapping.length; j++) {

                    if (roleMapping[j].service_name == "Grooming") {
                        ServiceList.push(roleMapping[j]);

                    }
                    else if (roleMapping[j].service_name == "Boarding") {
                        ServiceBoard.push(roleMapping[j]);

                    }
                    var pickdates = integertodate(roleMapping[j].effective_date);
                    var Dates = pickdates.split(",");
                    roleMapping[j].effective_date = Dates[0];

                }
                $scope.Correctdata = roleMapping;
                $scope.ServiceLists = ServiceList;
                $scope.ServiceBoarding = ServiceBoard;


            }).finally(function () {
                angular.element('#manageServicesloader').css('display', 'none');
            });
        }, 2000);

        $scope.ReloadServiceDatas = function () {
            ServiceList = [];
            ServiceBoard = [];
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/PetServices.svc/GetAllServices',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {
                var roleMapping = [];
                var result = _.each(data, function (object) {
                    object.selects = false;
                    roleMapping.push(object);
                });
                for (var j = 0; j < roleMapping.length; j++) {

                    if (roleMapping[j].service_name == "Grooming") {
                        ServiceList.push(roleMapping[j]);

                    }
                    else if (roleMapping[j].service_name == "Boarding") {
                        ServiceBoard.push(roleMapping[j]);

                    }
                    var pickdates = integertodate(roleMapping[j].effective_date);
                    var Dates = pickdates.split(",");
                    roleMapping[j].effective_date = Dates[0];

                }
                $scope.Correctdata = roleMapping;
               
                $scope.ServiceLists = ServiceList;
                $scope.ServiceBoarding = ServiceBoard;


            });
        };

        $scope.selin = 'Grooming';
        $scope.Servicvalues = ['Grooming', 'Boarding'];

        function integertodate(effective_date) {

            var res = effective_date.substring(effective_date.indexOf("(") + 1, effective_date.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
        }

        //Sorting
        $scope.ManageproductSort = function (asc, header) {

            if (asc) {
                $scope.ServiceBoarding.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.ServiceBoarding.sort(predicatByDes(header));

            }
            if (asc) {
                $scope.ServiceLists.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.ServiceLists.sort(predicatByDes(header));

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

        //Close modals
        $scope.CloseModal = function () {
            $('#manageServicemodel').modal('hide');
            $('#groomingID').modal('hide');
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

            if ($scope.findservice) {
                var filtereddata = $filter('filter')($scope.ServiceLists, $scope.findservice);
                return Math.ceil(filtereddata.length / $scope.itemsPerPage) - 1;
            }
            else if (!$scope.findservice) {
                return Math.ceil($scope.ServiceLists.length / $scope.itemsPerPage) - 1;
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






        //Get Service

        var servicetype = [];

        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetails',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (data) {
            $scope.servicenamevalue = false;
            var len = data.length;
            for (var i = 0; i < len; i++) {

                if (data[i].lm_name == 'Service Type' && data[i].parent_id == '0') {
                    servicetype.push(data[i]);

                }

            }

            $scope.servicenames = servicetype;



            //Get Service Type
            $scope.servicetypenames = [];
            $scope.modify = function () {
                var sss = [];
                var stype = [];
                var len = data.length;

                $scope.serviceText = $scope.selecservicename.ld_name;
                console.log($scope.serviceText);
                for (var i = 0; i < len; i++) {
                    if (data[i].lm_name == 'Service Type' && data[i].parent_id == $scope.selecservicename.ld_id) {
                        stype.push(data[i]);

                    }

                }
                var s1 = _.pluck(stype, "ld_id");
                var s2 = _.pluck($scope.Correctdata, "service_typeid");
                var Arrays = _.difference(s1, s2);


                for (var i = 0; i < stype.length ; i++) {
                    for (var j = 0; j < Arrays.length; j++) {
                        if (stype[i].ld_id == Arrays[j]) {
                            sss.push(stype[i]);
                        }
                    }
                }
                $scope.servicetypenames = sss;

            };


        });







        var datevalue = Number(new Date());
        $scope.todaydate = "\/Date(" + datevalue + ")\/";
        $scope.Errormessages = function (effDate) {
            $scope.errMessage1 = '';
           
            $scope.effdate = effDate;  
            $scope.effUpdatdate = effDate;

            if (new Date($scope.effdate || $scope.effUpdatdate) < datevalue) {
                $scope.errMessage1 = 'Effective date should not be before today.';
                return false;
            }
           
        };














        $scope.Seradd = function () {
            //$scope.CloseModal();
            $scope.submitted = true;
            var timestamp = Number(new Date($scope.effdate));
            $scope.effective = "\/Date(" + timestamp + ")\/";
           // console.log($scope.serviceTypes.ld_name);
            $scope.data = {
                "created_by": 1,
                "created_date": $scope.srcedate,
                "is_deleted": "n",
                "modified_by": 1,
                "modified_date": $scope.srcedate,
                "service_desc": $scope.desc,
                "service_name": $scope.serviceText,
                "service_typeid": $scope.serviceTypes.ld_id,
                "service_rate": $scope.servrate,
                "effective_date": $scope.effective
            }
            if (!$scope.NewServiceForm.$invalid) {

                $http({
                    method: 'POST',
                    data: $scope.data,
                    url: 'http://166.62.84.37/PetzCareWSQA/PetServices.svc/AddPetService',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {                   
                   
                    if (response == true) {                      
                        $scope.ServiceLists = [];
                        $scope.ServiceBoarding = [];
                        $scope.Correctdata = [];
                        $scope.ReloadServiceDatas();
                       
                        setTimeout(function () { $scope.CloseModal(); }, 1000);                        
                        alert("Service added successfully");
                       
                    }
                });

            }
        };

        $scope.ClearService = function () {
            $scope.submitted = false;
            $scope.desc = "";
            $scope.serviceText = "";
            $scope.selecservicename = "";
            $scope.servrate = "";
            $scope.effdate = "";
            $scope.serviceTypes = "";
            $scope.servicetypenames = "";
        };

        $scope.ClearUpdateService = function () {
            $scope.submitted = false;          
            $scope.effUpdatdate = "";           
            $scope.UPeffective = "";

        };

        $scope.serviceId = function (servcID) {

            $scope.servid = servcID;
            $http({
                method: 'POST',
                data: { "service_id": $scope.servid },
                url: 'http://166.62.84.37/PetzCareWSQA/PetServices.svc/GetServiceById',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {

                $scope.ServiceComp = response[0];
                $scope.Updatdesc = response[0].service_desc;
                $scope.selectedservice = response[0].service_name;
                $scope.servUpdattyp = response[0].service_type_name;
                $scope.servUpdatrate = response[0].service_rate;
                $scope.effUpdatdate = response[0].effective_date;
                $scope.servUpdattypeid = response[0].service_typeid;

            });



        };


        $scope.UpdateGroom = function () {
            $scope.submitted = true;
            var timestamp = Number(new Date($scope.effUpdatdate));
            $scope.UPeffective = "\/Date(" + timestamp + ")\/";

            $scope.data = {
                "is_deleted": "n",
                "modified_by": 1,
                "service_id": $scope.servid,
                "modified_date": $scope.srcedate,
                "service_desc": $scope.Updatdesc,
                "service_name": $scope.selectedservice,
                "service_typeid": $scope.servUpdattypeid,
                "service_rate": $scope.servUpdatrate,
                "effective_date": $scope.UPeffective
            }
            if (!$scope.UpdateServiceForm.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.data,
                    url: 'http://166.62.84.37/PetzCareWSQA/PetServices.svc/UpdatePetService',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {
                        $scope.ServiceLists = [];
                        $scope.ServiceBoarding = [];
                        $scope.Correctdata = [];
                        $scope.ReloadServiceDatas();
                        setTimeout(function () { $scope.CloseModal(); }, 1000);
                        alert("Service updated successfully");
                      
                        //$timeout(function () {   angular.element(document.querySelector('#manageServicemodel').hide()); }, 1000);
                    }
                });
            }

        };


        //Delete Services
        $scope.servicesdelete = function (servcid, indexvalue) {

            $scope.DeltData = {
                "is_deleted": "Y",
                "modified_by": 2,
                "modified_date": $scope.srcedate,
                "service_id": servcid
            }

            var Delete = confirm("Are You sure.You Want to delete?");
            if (Delete == true) {
            $http.post("http://166.62.84.37/PetzCareWSQA/PetServices.svc/DeletePetService", $scope.DeltData).success(function (response) {
                if (response == true) {
                    $scope.ServiceLists = [];
                    $scope.ServiceBoarding = [];
                    $scope.Correctdata = [];
                    $scope.ReloadServiceDatas();
                    $scope.ServiceLists.splice(indexvalue, 1);
                   // alert("Service deleted successfully");
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
