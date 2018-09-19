(function () {
    'use strict';
    var app = angular.module('petzCareSP.MainController', []);
    
    app.controller('MainController', ['$scope', '$http', '$location', '$filter', '$timeout', MainController
    ]);

    function MainController($scope, $http, $location, $filter, $timeout) {
        $scope.submitted = false;
        var timestamp = Number(new Date());
        $scope.modifiddat = "\/Date(" + timestamp + ")\/";       
                               
        $scope.$watch('selectedcountry', function (newVal) {
            GetState1(newVal);
        });

        $scope.$watch('selectedstate', function (newVal) {
            GetCity1(newVal);
        });

        $scope.refreshPasswordsettings = function ()
        {
            $scope.confimpass = "";
            $scope.changpass = "";
            $scope.pass = "";

        }
        $scope.settings = function () {
            
            $scope.credentials = {
                "user_id": loggedInUserId,
                "answer": $scope.answer,
                "employee_id": loggedInEmpId,
                "is_deleted": "n",
                "modified_by": 1,
                "modified_date": $scope.modifiddat,
                "password": $scope.changpass,
                "question": $scope.secure,
                "user_name": $scope.uname,
                "old_password": $scope.pass
            }

            $http({
                method: 'POST',
                data: $scope.credentials,
                url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/UpdateUser',
                headers: {
                    "Content-Type": 'application/json',
                }
            })

            .success(function (response) {                              
                if (response == "Updated Successfully") {
                    //$scope.confimpass = "";
                    //$scope.changpass = "";
                    //$scope.pass = "";
                    alert("Password changed successfully");
                    $timeout(function () { $scope.CloseModal(); }, 1000);
                }
                else
                {
                    $scope.errormessage = response;
                }

            }).error(function (status, headers) {
              
                console.log("Error");

            });
        };

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
                if (data[i].employee_id == loggedInEmpId) {
                    users = _.pick(JSON.parse(JSON.stringify(data[i])), 'user_name', 'answer', 'question');
                }
            }
                 $scope.user = users;
               
                $scope.answer = users.answer;
                $scope.secure = users.question;
                $scope.uname = users.user_name;
              
            

        });
        $scope.secquestions = [

            "In what city did you meet your spouse/significant other?",
            "What was your childhood nickname?",
            "What is the name of your favorite childhood friend?",
            "What street did you live on in third grade?",
            "What is your oldest sibling’s birthday month and year? (e.g., January 1900)",
            "What is the middle name of your oldest child?",
            "What is your oldest sibling’s middle name?",
            "What school did you attend for sixth grade?",
            "What was your childhood phone number including area code? (e.g., 000-000-0000)",
            "What was the name of your first stuffed animal?",
            "In what city or town did your mother and father meet?",
            "Are you engineer?",
            "What was the last name of your third grade teacher?"
        ];


        
        //Close modals
        $scope.CloseModal = function () {
            $('#authorizationID').modal('hide');
            $('#lookupID').modal('hide');            
            $('#userIDsetting').modal('hide');
            $('#userprofile').modal('hide');
            
        }

        //RefreshLookup
        $scope.Clearlookup = function () {
            $scope.submitted = false;
            $scope.lmdescs = "";
            $scope.lookup = "";
            $scope.lmnames = "";
        };

        //RefreshLookup
        $scope.ClearAuthorize = function () {
            $scope.submitted = false;
            $scope.authdescs = "";
            $scope.authnames = "";
            $scope.authids = "";

        };
       
        //Lm Name list
          $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupMasters',
            headers: {
                "Content-Type": 'application/json',
            }
          }).success(function (data) {
              
              $scope.lookupmaster = data;

          });

          $scope.LookupValues = function () {
              $http({
                  method: 'GET',
                  url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupMasters',
                  headers: {
                      "Content-Type": 'application/json',
                  }
              }).success(function (data) {

                  $scope.lookupmaster = data;

              });
          };

        //Authorization list
        var authorize = [];
        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetAllAuthorizations',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (data) {
            
            $scope.authorize = data;

        });

        $scope.Authorizations = function () {
            var authorize = [];
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/GetAllAuthorizations',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {

                $scope.authorize = data;

            });
        };



        //Pagination 

        
        $scope.itemsPerPage =10;
        $scope.currentPage = 0;
     
        $scope.range = function() {
            var rangeSize = $scope.pageCount();
            if (rangeSize >= 6) {
                rangeSize = 5;
            }
            var ps = [];
            var start;

            start = $scope.currentPage;
            if ( start > $scope.pageCount()-rangeSize ) {
                start = $scope.pageCount()-rangeSize+1;
            }

            for (var i=start; i<start+rangeSize; i++) {
                ps.push(i);
            }
            return ps;
        };

        $scope.prevPage = function() {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.DisablePrevPage = function() {
            return $scope.currentPage === 0 ? "disabled" : "";
        };

        $scope.pageCount = function () {
         
            if ($scope.authorizeval) {
                var filtereddata = $filter('filter')($scope.authorize, $scope.authorizeval);
                return Math.ceil(filtereddata.length / $scope.itemsPerPage) - 1;
            }
            else if (!$scope.authorizeval) {
                return Math.ceil($scope.authorize.length / $scope.itemsPerPage) - 1;
            }
           
        };

        $scope.nextPage = function() {
            if ($scope.currentPage < $scope.pageCount()) {
                $scope.currentPage++;
            }
        };

        $scope.DisableNextPage = function() {
            return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
        };

        $scope.setPage = function(n) {
            $scope.currentPage = n;
        };
         
    
       
        //Get Ld Names
        
        $scope.getldname = function (lmnam) {
            var lookups = [];
            $scope.selectedlmname = lmnam;
            
            var getprofile = $http({
                method: 'POST',
                data: $scope.selectedlmname,
                url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetailByMasterName',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                for (var i = 0; i < response.length; i++) {
                    lookups.push(_.pick(JSON.parse(JSON.stringify(response[i])), 'ld_name', 'ld_id'));
                }
                $scope.lookupvalues = lookups;
            });
        };

        //Add New Lookup Master

        $scope.lookupAdd = function () {
            $scope.submitted = true;
            $scope.datas = {
                "created_by": 1,
                "created_date": $scope.modifiddat,
                "is_deleted": "N",
                "ld_desc": $scope.lmdescs,
                "ld_name": $scope.lookup,
                "lm_id": $scope.lmnames,
                "modified_by": 1,
                "modified_date": $scope.modifiddat,
                "parent_id": 0
            }

            $http({
                method: 'POST',
                data: $scope.datas,
                url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/AddLookupDetail',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {
                if (data == true) {
                    $scope.LookupValues();
                   
                    alert("Lookup added successfully");
                    $timeout(function () { $scope.CloseModal(); }, 1000);
                }

            });
        };


        //Add New Authorization

        $scope.authorizepAdd = function () {
            $scope.submitted = true;
            $scope.datas = {
                "created_by": 1,
                "created_date": $scope.modifiddat,
                "is_deleted": "n",
                "am_desc": $scope.authdescs,
                "am_name":$scope.authnames,
                "am_typeid":$scope.authids,
                "modified_by": 1,
                "modified_date": $scope.modifiddat,
                "parent_id": 1
            }

            $http({
                method: 'POST',
                data: $scope.datas,
                url: 'http://166.62.84.37/PetzCareWSQA/AppSecurity.svc/AddAuthorization',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {
                if (data == true) {
                    $scope.Authorizations();                    
                    alert("Authorization added successfully");
                    $timeout(function () { $scope.CloseModal(); }, 1000);
                }

            });
        };

    
        //user Profile
        var etype1 = [];
        var design1 = [];
        var depart1 = [];
        var gender = [];
        var country1 = [];
        var ctype1 = [];
        var authType = [];
        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetails',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (data) {

            var len = data.length;
            for (var i = 0; i < len; i++) {

                if (data[i].lm_name == 'Title') {
                    gender.push(data[i]);

                }
                if (data[i].lm_name == 'Country') {
                    country1.push(data[i]);

                }
                if (data[i].lm_name == 'Company Type') {
                    ctype1.push(data[i]);

                }
                if (data[i].lm_name == 'Employment Type') {
                    etype1.push(data[i]);

                }
                if (data[i].lm_name == 'Department') {
                    depart1.push(data[i]);

                }
                if (data[i].lm_name == 'Designation') {
                    design1.push(data[i]);

                }
                if (data[i].lm_name == 'Authorization Type') {
                    authType.push(data[i]);

                }

            }
            $scope.design = design1;
            $scope.utitle = gender;
            $scope.etype = etype1;
            $scope.depart = depart1;
            $scope.country = country1;
            $scope.authtype = authType;
          
           

        });

        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/Company.svc/GetAllCompanies',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (data) {           
            var len = data.length;
            $scope.ctype = data;           
          
        });


        function GetState1(ldIdState) {
            var state1 = [];
            var stateid = { "ld_id": ldIdState };

            $http.post('http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetailByParentId', stateid).success(function (data) {
                // If successful we assign the response to the global user model

                var len = data.length;
                for (var i = 0; i < len; i++) {
                    state1.push(_.pick(JSON.parse(JSON.stringify(data[i])), 'ld_name', 'ld_id'));
                }

            });
            $scope.state = state1;
        }


        function GetCity1(ldIdCity) {
            var city1 = [];
            var cityid = { "ld_id": ldIdCity };

            $http.post('http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetailByParentId', cityid).success(function (data) {
                // If successful we assign the response to the global user model

                var lengh1 = data.length;

                for (var iterate = 0; iterate < lengh1; iterate++) {
                    city1.push(_.pick(JSON.parse(JSON.stringify(data[iterate])), 'ld_name', 'ld_id'));
                }

            });
            $scope.city = city1;           
        }




     


       
        $scope.employeeEntity = {

            "employee_id": loggedInEmpId
        }       
        /*Get logged in user profile*/
        $scope.GettingUser = function () {
            var getprofile = $http({
                method: 'POST',
                data: $scope.employeeEntity,
                url: 'http://166.62.84.37/PetzCareWSQA/Employee.svc/GetUserProfile',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (profile) {

              
                for (var j = 0; j < profile.length; j++) {

                    profile[j].Joining_date = integertodate(profile[j].Joining_date);
                }

                $scope.petuserdob = profile;
                $scope.entitytypeid = profile.EntityType_id;
                $scope.addresstype = profile.AddressType_id;
                $scope.paddr = profile.Address_1;
                $scope.taddr = profile.Address_2;
                $scope.selectedcountry = profile.Country_id;
                $scope.selectedstate = profile.State_id;
                $scope.selectedcity = profile.City_id;
                $scope.zip = profile.Zip_code;
                $scope.phno = profile.Phone_1;
                $scope.fax = profile.Fax_1;
                $scope.email = profile.Email_1;
                $scope.selectedutitle = profile.Title_id;
                $scope.fname = profile.First_name;
                $scope.lname = profile.Last_name;
                $scope.ecode = profile.Employee_code;
                $scope.selecteddesign = profile.Designation_id;
                $scope.selecteddepart = profile.Department_id;
                $scope.dob = new Date(parseInt(profile.Birth_date.replace("/Date(", "").replace(")/", ""), 10)); //profile.Birth_date;
                $scope.selectedcname = profile.Company_id;
                $scope.entityid = profile.Entity_id;
                $scope.idcardno = profile.IdCard_no;
                $scope.doj = new Date(parseInt(profile.Joining_date.replace("/Date(", "").replace(")/", ""), 10));//profile.petuserdob;
                $scope.communication_id = profile.Communication_id;
                $scope.emptypeid = profile.EmpType_id;
                $scope.employeeid = loggedInEmpId;




            });

            getprofile.error(function (names) {
                console.log("error");
            });

        };
        $scope.headerName = $scope.fname;



        $scope.UpdateEmployee = function () {
            var timestamp = Number(new Date());
            $scope.modifiddat = "\/Date(" + timestamp + ")\/";
            //alert("hai");
            $scope.submitted = true;
            var timestamp = Number(new Date($scope.dob));
            $scope.dates = "\/Date(" + timestamp + ")\/";
            var timestamp = Number(new Date($scope.doj));
            $scope.joins = "\/Date(" + timestamp + ")\/";
           

            $scope.credentials = {
                'CommEntity':
               {
                   'entity_typeid': $scope.entitytypeid,
                   'entity_id': $scope.entityid,
                   'address_typeid': $scope.addresstype,
                   'address_1': $scope.paddr,
                   'address_2': $scope.taddr || "",
                   'city_id': $scope.selectedcity,
                   'state_id': $scope.selectedstate,
                   'country_id': $scope.selectedcountry,
                   'zip_code': $scope.zip,
                   'phone_1': $scope.phno,
                   'phone_2':"",
                   'fax_1': $scope.fax || "",
                   'fax_2': "",
                   'email_1': $scope.email,
                   'email_2': "",
                   'is_deleted': "n",
                   'modified_by': 1,
                   'modified_date': $scope.modifiddat,
                   'communication_id': $scope.communication_id
               },
                'EmpEntity':
                {
                    'is_deleted': "n",
                    'modified_by': 1,
                    'modified_date': $scope.modifiddat,
                    'title_id': $scope.selectedutitle,
                    'first_name': $scope.fname,
                    'middle_name': $scope.mname || "",
                    'last_name': $scope.lname || "",
                    'employee_code': $scope.ecode,
                    'designation_id': $scope.selecteddesign,
                    'department_id': $scope.selecteddepart,
                    'emptype_id': $scope.emptypeid,
                    'joining_date': $scope.joins,
                    'birth_date': $scope.dates,
                    'idcard_no': $scope.idcardno,
                    'company_id': $scope.selectedcname,
                    'employee_id': loggedInEmpId
                    
                }
            }


            $http.post('http://166.62.84.37/PetzCareWSQA/Employee.svc/UpdateEmployee', $scope.credentials).success(function (response) {
                // If successful we assign the response to the global user model
                if (response.UpdateResult == true) {                   
                    alert("Profile updated successfully");
                    $timeout(function () { $scope.CloseModal(); }, 1000);
                }
            }).error(function (response) {
                console.log("Throw the Error message");
            });
        };







        $scope.RedirectSection = function () {

           // window.location.href = window.location.href + "#/ManageUsers";
            $location.path("#/ManageUsers");
        };
      

  };

    app.filter('pagination', function () {
        return function (input, start) {
            start = parseInt(start, 10);
            return input.slice(start);
        };
    });

})();