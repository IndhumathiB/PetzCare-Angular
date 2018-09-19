(function () {
    'use strict';
    var app = angular.module('petzCareSP.ManageCompanyController', []);
    app.controller('ManageCompanyController', ['$scope', '$http', '$location', '$rootScope', '$filter', '$timeout', ManageCompanyController]);

    function ManageCompanyController($scope, $http, $location, $rootScope, $filter, $timeout) {
        $scope.submitted = false;
        $scope.$watch('Updateselectedcontrytyp', function (newVal) {           
            GetState1(newVal);
        });

        $scope.$watch('UpdateselectedstateTyp', function (newVal) {           
            GetCity1(newVal);
        });

        angular.element('#companyloader').css('display', 'block');
        var timestamp = Number(new Date());
        $scope.companydate = "\/Date(" + timestamp + ")\/";
        $scope.Companies = [];
        setTimeout(function () {      
        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWS/Company.svc/GetAllCompanies',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (data) {

            $scope.Companies = data;          

        }).finally(function () {
            angular.element('#companyloader').css('display', 'none');
        });
        }, 2000);
            
        $scope.CompanyDatas = function () {
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWS/Company.svc/GetAllCompanies',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {

                $scope.Companies = data;


            });
        };
        //Close modals
        $scope.CloseModal = function () {
            $('#edit-detail').modal('hide');
            $('#myModal').modal('hide');
        }
       
        //Refresh
        $scope.ClearCompany = function () {
            $scope.submitted = false;
            $scope.comname = "";
            $scope.selectedcompnTyp = "";
            $scope.compurl = "";
            $scope.selectedsddres = "";
            $scope.comppaddr = "";
            $scope.comptaddr = "";
            $scope.compphno = "";
            $scope.conperson = "";
            $scope.selectedcontrytyp = "";
            $scope.selectedstateTyp = "";
            $scope.selectedcityTyp = "";
            $scope.compzip = "";
            $scope.compemail = "";
            $scope.compfax = "";
            $scope.compdesc = "";
            };
        $scope.ClearUpdateCompany = function () {
            $scope.submitted = false;
        };
        //Sorting
        $scope.ManagecompanySort = function (asc, header) {

            if (asc) {
                $scope.Companies.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.Companies.sort(predicatByDes(header));

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
        $scope.itemsPerPage = 10;

        $scope.Vaalues = [10, 25, 50];
      
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
                
                if ($scope.findcompany) {
                    var filtereddata = $filter('filter')($scope.Companies, $scope.findcompany);
                    return Math.ceil(filtereddata.length / $scope.itemsPerPage) - 1;
                }
                else if (!$scope.findcompany) {
                    return Math.ceil($scope.Companies.length / $scope.itemsPerPage) - 1;
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
       
      
        $scope.GetCompany = function (companyid,communiID) {
            $rootScope.companyId=companyid;
            $rootScope.communicatnID=communiID;
            $http({
                method: 'POST',
                data: { "company_id":   $rootScope.companyId },
                url: 'http://166.62.84.37/PetzCareWS/Company.svc/GetCompanyById',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                $rootScope.Updatecomname = response[0].company_name;
                $rootScope.Updatecompdesc = response[0].company_desc;
                $rootScope.UpdateselectedcompnTyp = response[0].company_typeid;
                $rootScope.Updateconperson = response[0].contact_person;
                $rootScope.Updatecompurl = response[0].url;
               
                $rootScope.company = response[0];

            });
              };
        $scope.Editcompany = function (compan) {
            console.log(compan);
            $http({
                method: 'POST',
                data: { "entity_id": compan, "entity_typename": "Company" },
                url: 'http://166.62.84.37/PetzCareWS/Communications.svc/GetCommunicationsByEntityId',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {

                console.log(response[0]);


                $rootScope.Updateselectedsddres = response[0].address_typeid;
                $rootScope.Updatecomppaddr = response[0].address_1;
                $rootScope.Updatecomptaddr = response[0].address_2;
                $rootScope.UpdateselectedcityTyp = response[0].city_id;
                $rootScope.UpdateselectedstateTyp = response[0].state_id;
                $rootScope.Updateselectedcontrytyp = response[0].country_id;
                $rootScope.Updatecompzip = response[0].zip_code;
                $rootScope.Updatecompphno = response[0].phone_1;
                $rootScope.Updatecompfax = response[0].fax_1;
                $rootScope.Updatecompemail = response[0].email_1;
                $rootScope.communicationid = response[0].communication_id;
               
            });



            

        };

        //Add Company

        var countrytype = [];
        var companytype = [];
        var addrestype = [];
        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWS/Lookup.svc/GetAllLookupDetails',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (data) {

            var len = data.length;
            for (var i = 0; i < len; i++) {

               
                if (data[i].lm_name == 'Country') {
                    countrytype.push(data[i]);

                }
                if (data[i].lm_name == 'Address Type') {
                    addrestype.push(data[i]);

                }
                if (data[i].lm_name == 'Company Type') {
                    companytype.push(data[i]);

                }
                

            }
            $scope.contryTyp = countrytype;
            $scope.comPany = companytype;
            $scope.addRess = addrestype;
           

        });

        $scope.state = function () {
            //console.log(selectedcontrytyp);
            var stateid = { "ld_id": $scope.selectedcontrytyp};

            var statetyp = [];
            $http.post('http://166.62.84.37/PetzCareWS/Lookup.svc/GetAllLookupDetailByParentId', stateid).success(function (data) {
                // If successful we assign the response to the global user model


                var len = data.length;
                for (var i = 0; i < len; i++) {
                    statetyp[i] = _.pick(JSON.parse(JSON.stringify(data[i])), 'ld_name', 'ld_id');
                }
                $scope.stateTyp = statetyp;
                console.log($scope.stateTyp);


            });

        };
        $scope.city = function () {
            //console.log(selectedstateTyp);
            var cityid = { "ld_id": $scope.selectedstateTyp};
            var cityytyp = [];
            $http.post('http://166.62.84.37/PetzCareWS/Lookup.svc/GetAllLookupDetailByParentId', cityid).success(function (data) {
                // If successful we assign the response to the global user model


                var len = data.length;
                for (var i = 0; i < len; i++) {
                    cityytyp[i] = _.pick(JSON.parse(JSON.stringify(data[i])), 'ld_name', 'ld_id');
                }
                $scope.cityTyp = cityytyp;

                console.log($scope.cityTyp);

            });

        };



    function GetState1(ldIdState) {
        var state1 = [];
        var stateid = { "ld_id": ldIdState };

        $http.post('http://166.62.84.37/PetzCareWS/Lookup.svc/GetAllLookupDetailByParentId', stateid).success(function (data) {
            // If successful we assign the response to the global user model

            var len = data.length;
            for (var i = 0; i < len; i++) {
                state1.push(_.pick(JSON.parse(JSON.stringify(data[i])), 'ld_name', 'ld_id'));
            }

        });
        $scope.stateTyp = state1;
    }


    function GetCity1(ldIdCity) {
        var city1 = [];
        var cityid = { "ld_id": ldIdCity };

        $http.post('http://166.62.84.37/PetzCareWS/Lookup.svc/GetAllLookupDetailByParentId', cityid).success(function (data) {
            // If successful we assign the response to the global user model

            var lengh1 = data.length;

            for (var iterate = 0; iterate < lengh1; iterate++) {
                city1.push(_.pick(JSON.parse(JSON.stringify(data[iterate])), 'ld_name', 'ld_id'));
            }

        });
        $scope.cityTyp = city1;
    }





        $scope.AddCompany = function () {
            $scope.submitted = true;
            $scope.data= {
            "CommEntity":
            {
                "address_1":$scope.comppaddr,
                "address_2":$scope.comptaddr || "",
                "city_id":$scope.selectedcityTyp,
                "state_id":$scope.selectedstateTyp,
                "country_id": $scope.selectedcontrytyp,
                "zip_code":$scope.compzip || "",
                "phone_1":$scope.compphno,
                "phone_2":"",
                "fax_1":$scope.compfax || "",
                "fax_2":"",
                "email_1":$scope.compemail,
                "email_2":"",
                "is_deleted":"n",
                "created_by":1,
                "created_date":$scope.companydate,
                "modified_by":1,
                "modified_date":$scope.companydate
            },
           "CompEntity":
                {   
                    "created_by":1,
                    "created_date":$scope.companydate,
                    "is_deleted":"n",
                    "modified_by":1,
                    "modified_date":$scope.companydate,
                    "company_name":$scope.comname,
                    "company_desc":$scope.compdesc || "",
                    "company_typeid":$scope.selectedcompnTyp,
                    "contact_person":$scope.conperson,
                    "url":$scope.compurl,
                    "parent_id":0
                }
      }
      if (!$scope.companyForm.$invalid) {
          $http({
              method: 'POST',
              data: $scope.data,
              url: 'http://166.62.84.37/PetzCareWS/Company.svc/AddCompany',
              headers: {
                  "Content-Type": 'application/json',
              }
          }).success(function (response) {

              if (response.AddResult == true) {
                  $scope.CompanyDatas();
                  //$scope.selectedsddres = "";
                  //$scope.comppaddr = "";
                  //$scope.comptaddr = "";
                  //$scope.selectedcityTyp = "";
                  //$scope.selectedstateTyp = "";
                  //$scope.selectedcontrytyp = "";
                  //$scope.compzip = "";
                  //$scope.compphno = "";
                  //$scope.compfax = "";
                  //$scope.compemail = "";
                  //$scope.comname = "";
                  //$scope.compdesc = "";
                  //$scope.selectedcompnTyp = "";
                  //$scope.conperson = "";
                  //$scope.compurl = "";
                  alert("Company added successfully");
                  $timeout(function () { $scope.CloseModal(); }, 1000);
              }
          });
      }
    };

        $scope.UpdateCompany = function () {
            $scope.submitted = true;
            $scope.data = {
                "CommEntity":
                {
                   
                    "address_1": $scope.Updatecomppaddr,
                    "address_2": $scope.Updatecomptaddr || "",
                    "city_id": $scope.UpdateselectedcityTyp,
                    "state_id": $scope.UpdateselectedstateTyp,
                    "country_id": $scope.Updateselectedcontrytyp,
                    "zip_code": $scope.Updatecompzip || "",
                    "phone_1": $scope.Updatecompphno,
                    "phone_2": "",
                    "fax_1": $scope.Updatecompfax || "",
                    "fax_2": "",
                    "email_1": $scope.Updatecompemail,
                    "email_2": "",
                    "is_deleted": "n",
                    "modified_by": 1,
                    "modified_date": $scope.companydate,
                    "communication_id": $rootScope.communicationid
                },
                "CompEntity":
                     {

                         "is_deleted": "n",
                         "modified_by": 1,
                         "modified_date": $scope.companydate,
                         "company_name": $scope.Updatecomname,
                         "company_desc": $scope.Updatecompdesc,
                         "company_typeid": $scope.UpdateselectedcompnTyp,
                         "contact_person": $scope.Updateconperson || "",
                         "url": $scope.Updatecompurl,
                         "parent_id": 0,
                         "company_id": $rootScope.companyId
                     }
            }
            if (!$scope.companyUpdateForm.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.data,
                    url: 'http://166.62.84.37/PetzCareWS/Company.svc/UpdateCompany',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response.UpdateResult == true) {
                        $scope.CompanyDatas();
                        alert("Company updated successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                    }
                });
            }

        };

   
        //Delete Company
        $scope.companydelete = function (cmpnyid,commnid,compnyindex) {          
            $scope.DeltData = {
                "CommEntity":
                {
                    "is_deleted": "Y",
                    "modified_by": 2,
                    "modified_date": $scope.companydate,
                    "communication_id": commnid
                },
                "CompEntity":
                {
                    "company_id": cmpnyid,
                    "is_deleted": "Y",
                    "modified_by": 2,
                    "modified_date": $scope.companydate
                }
            }
            var Delete = confirm("Are You sure.You Want to delete?");
            if (Delete == true) {
                $http.post("http://166.62.84.37/PetzCareWS/Company.svc/DeleteCompany", $scope.DeltData).success(function (response) {
                    if (response.DeleteResult == true) {
                        $scope.Companies.splice(compnyindex, 1);
                        //alert("Company deleted successfully");
                    }
                });
            }

        };
       

       
    };
    //pagination
    app.filter('pagination', function () {
        return function (input, start) {
            start = parseInt(start, 10);
            return input.slice(start);
        };
    });
})();