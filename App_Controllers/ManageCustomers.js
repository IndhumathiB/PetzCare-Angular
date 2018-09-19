(function () {
    'use strict';
    var app = angular.module('petzCareSP.ManageCustomerController', []);
    app.controller('ManageCustomerController', ['$scope', '$http', '$location', '$filter', '$timeout', ManageCustomerController]);

    function ManageCustomerController($scope, $http, $location, $filter, $timeout) {
        $scope.submitted = false;
        $scope.oneAtATime = true;
        $scope.$watch('UpdateCustcontrytyp', function (newVal) {            
            GetState1(newVal);
        });

        $scope.$watch('UpdateCuststateTyp', function (newVal) {           
            GetCity1(newVal);
        });
        angular.element('#managecustomerloader').css('display', 'Block');
        var timestamp = Number(new Date());
        $scope.CUSTdelete = "\/Date(" + timestamp + ")\/";

        $scope.custdetails = [];
        $scope.tiTlename = true;
        $scope.Countryname = true;
        $scope.Statename = true;
        $scope.Cityname = true;
        setTimeout(function () {
        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWS/Customer.svc/GetAllCustomers',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {
            var roleMapping = [];
            var result = _.each(response, function (object) {
                object.selects = false;
                roleMapping.push(object);
            });
            $scope.custdetails = roleMapping;

        })
             .finally(function () {
                 angular.element('#managecustomerloader').css('display', 'none');
             });
        }, 2000);

        $scope.refreshCustomers = function () {
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWS/Customer.svc/GetAllCustomers',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                
                $scope.custdetails = response;
            });
        }

        //Close modals
        $scope.CloseModal = function () {
            $('#newCustomer').modal('hide');
            $('#addnewpetID').modal('hide');
            $('#updateCutomdetail').modal('hide');
        }


        $scope.Cutomerfilter=function()
        {
            $scope.email1 = "";
            $scope.phone1 = "";
            $scope.firstname = "";
            $scope.selection = "";

        }

        //Sorting
        $scope.customerSort = function (asc, header) {
            if (asc) {
                $scope.custdetails.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.custdetails.sort(predicatByDes(header));

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




        var mat = [];
        $scope.custmrfltr = function (idno,communiid) {
            $scope.comid=communiid;
            $scope.customerid=idno;
            var id1 = { "customer_id": idno };


            $http({
                method: 'POST',
                data: id1,
                url: 'http://166.62.84.37/PetzCareWS/Customer.svc/GetCustomerById',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                for (var j = 0; j < response.length; j++) {
                    mat[j] = JSON.parse(JSON.stringify(response[j]));
                }
                $scope.cust = mat[0];
                $scope.UpdtCustadrstypeid1=mat[0].address_typeid;
                $scope.UpdtCustaddress=mat[0].address_1;
                $scope.UpdateCustcityTyp=mat[0].city_id;
                $scope.UpdateCuststateTyp=mat[0].state_id;
                $scope.UpdateCustcontrytyp=mat[0].country_id;
                $scope.UpdtCustzip=mat[0].zip_code;
                $scope.UpdtCustmobile=mat[0].phone_1;
                $scope.UpdtCustlandline=mat[0].phone_2;
                $scope.UpdtCustfax=mat[0].fax_1;
                $scope.UpdtCustemail=mat[0].email_1;              
                $scope.UpdtCustselectedtitlename=mat[0].title_id;
                $scope.UpdtCustfirstName=mat[0].first_name;
                $scope.UpdtCustlastName=mat[0].last_name;
                $scope.UpdtCustpremium=mat[0].is_premium;
                $scope.UpdtCustreferrer=mat[0].referred_by;
                $scope.UpdtCustreminder=mat[0].is_reminder;
            });



        };

        $scope.pets = [];
        var petarray = [];
        $scope.petfltr = function (petids) {
            var petid = { "customer_id": petids };
            $http({
                method: 'POST',
                data: petid,
                url: 'http://166.62.84.37/PetzCareWS/Pets.svc/GetPetsByCustomer',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {               
                var roleMapping = [];
                var result = _.each(response, function (object) {
                    object.selects = false;
                    roleMapping.push(object);
                });
                for (var j = 0; j < roleMapping.length; j++) {
                    var pickdates1 = integertodate(roleMapping[j].dob);
                    var Dates = pickdates1.split(",");
                    roleMapping[j].dob = Dates[0];
                   

                }
                $scope.pets = response;


            });



        };

        function integertodate(dob) {

            var res = dob.substring(dob.indexOf("(") + 1, dob.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
        }

        function integertodate(pickup_date) {

            var res = pickup_date.substring(pickup_date.indexOf("(") + 1, pickup_date.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
        }
        function integertodate(delivery_date) {

            var res = delivery_date.substring(delivery_date.indexOf("(") + 1, delivery_date.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
        }


        $scope.petimgs = [];
        var petimgid = "";
        $scope.petimage = function (petimgids) {
            $scope.NoneImages = true;
            $scope.PetImages = true;
                $scope.petimgs = [];     
          
                petimgid = { "pet_id": petimgids };
            $http({
                method: 'POST',
                data: petimgid,
                url: 'http://166.62.84.37/PetzCareWS/Pets.svc/GetPhotosByPets',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                $scope.PetImages = false;
                $scope.petimgs = response;
                console.log($scope.petimgs);

                });
             
        };

        //Pagination 
        $scope.itemsPerPage = 10;
        $scope.currentPage = 0;
        $scope.range = function () {
            var rangeSize = $scope.pageCount();
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
            
            if ($scope.finduser) {
                var filtereddata = $filter('filter')($scope.custdetails, $scope.finduser);
                return Math.ceil(filtereddata.length / $scope.itemsPerPage) - 1;
            }
            else if (!$scope.finduser) {
                return Math.ceil($scope.custdetails.length / $scope.itemsPerPage) - 1;
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

        //Appointments Pagination

        $scope.itemsPerPage1 = 5;
        $scope.currentPage1 = 0;
        $scope.range1 = function () {
            var rangeSize1 = $scope.pageCount1();
            var ps1 = [];
            var start1;
            start1 = $scope.currentPage1;
            if (start1 > $scope.pageCount1() - rangeSize1) {
                start1 = $scope.pageCount1() - rangeSize1 + 1;
            }
            for (var i = start1; i < start1 + rangeSize1; i++) {
                ps1.push(i);
            }
            return ps1;
        };
        $scope.prevPage1 = function () {
            if ($scope.currentPage1 > 0) {
                $scope.currentPage1--;
            }
        };
        $scope.DisablePrevPage1 = function () {
            return $scope.currentPage1 === 0 ? "disabled" : "";
        };
        $scope.pageCount1 = function () {
            return Math.ceil($scope.appoints.length / $scope.itemsPerPage1) - 1;
        };
        $scope.nextPage1 = function () {
            if ($scope.currentPage1 < $scope.pageCount1()) {
                $scope.currentPage1++;
            }
        };
        $scope.DisableNextPage1 = function () {
            return $scope.currentPage1 === $scope.pageCount1() ? "disabled" : "";
        };
        $scope.setPage1 = function (n1) {
            $scope.currentPage1 = n1;
        };

        //Petlist Pagination

        $scope.itemsPerPage2 = 5;
        $scope.currentPage2 = 0;
        $scope.range2 = function () {
            var rangeSize2 = $scope.pageCount2();
            var ps2 = [];
            var start2;
            start2 = $scope.currentPage2;
            if (start2 > $scope.pageCount2() - rangeSize2) {
                start2 = $scope.pageCount2() - rangeSize2 + 1;
            }
            for (var i = start2; i < start2 + rangeSize2; i++) {
                ps2.push(i);
            }
            return ps2;

        };
        $scope.prevPage2 = function () {
            if ($scope.currentPage2 > 0) {
                $scope.currentPage2--;
            }
        };
        $scope.DisablePrevPage2 = function () {
            return $scope.currentPage2 === 0 ? "disabled" : "";
        };
        $scope.pageCount2 = function () {
            return Math.ceil($scope.pets.length / $scope.itemsPerPage2) - 1;
        };
        $scope.nextPage2 = function () {
            if ($scope.currentPage2 < $scope.pageCount2()) {
                $scope.currentPage2++;
            }
        };
        $scope.DisableNextPage2 = function () {
            return $scope.currentPage2 === $scope.pageCount2() ? "disabled" : "";
        };
        $scope.setPage2 = function (n2) {
            $scope.currentPage2 = n2;
        };

      
       
       



        var appoint = [];
        $scope.appoints = [];
        $scope.appointfltr = function (appointids) {
            var appointid = { "customer_id": appointids };


            $http({
                method: 'POST',
                data: appointid,
                url: 'http://166.62.84.37/PetzCareWS/Appointments.svc/GetAppointmentsByCustomer',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {

                for (var j = 0; j < response.length; j++) {

                    response[j].pickup_date = integertodate(response[j].pickup_date);
                }
                for (var j = 0; j < response.length; j++) {

                    response[j].delivery_date = integertodate(response[j].delivery_date);
                }

                $scope.appoints = response;


            });


           

        };

        var entity = [];
        var adrs = [];
        var title1 = [];
        var country1 = [];


        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWS/Lookup.svc/GetAllLookupDetails',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (data) {
            $scope.tiTlename = false;
            $scope.Countryname = false;
           
            var len = data.length;
            for (var i = 0; i < len; i++) {

                if (data[i].lm_name == 'Title') {
                    title1.push(data[i]);

                }
                if (data[i].lm_name == 'Country') {
                    country1.push(data[i]);

                }
                if (data[i].ld_name == 'Permanent') {
                    adrs.push(data[i]);

                }
                if (data[i].ld_name == 'Customer') {
                    entity.push(data[i]);

                }

            }

            $scope.titleValues = title1;
            $scope.countrynames = country1;
            $scope.adrstypeid1 = adrs[0].ld_id;
            $scope.etypeid1 = entity[0].ld_id;

        });


        $scope.findstate = function () {

            var stateid = { "ld_id": $scope.selectedcountryValue };

            var state1 = [];

            $http({
                method: 'POST',
                data: stateid,
                url: 'http://166.62.84.37/PetzCareWS/Lookup.svc/GetAllLookupDetailByParentId',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {
                $scope.Statename = false;
               
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    state1[i] = _.pick(JSON.parse(JSON.stringify(data[i])), 'ld_name', 'ld_id');
                }
                $scope.stateval = state1;
                console.log($scope.stateval);


            });

        };
        $scope.findcity = function () {
            var cityid = { "ld_id": $scope.selectedstateValue };
            var city1 = [];

            $http({
                method: 'POST',
                data: cityid,
                url: 'http://166.62.84.37/PetzCareWS/Lookup.svc/GetAllLookupDetailByParentId',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {
                $scope.Cityname = false;
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    city1[i] = _.pick(JSON.parse(JSON.stringify(data[i])), 'ld_name', 'ld_id');
                }
                $scope.cityval = city1;

                console.log($scope.cityval);

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

        //user Profile
        var pettype = [];
        var breed = [];
        var petsize = [];
        var color = [];
        var gender = [];
        var tempertype = [];
        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWS/Lookup.svc/GetAllLookupDetails',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (data) {

            var len = data.length;
            for (var i = 0; i < len; i++) {

                if (data[i].lm_name == 'Pet Type') {
                    pettype.push(data[i]);

                }
                if (data[i].lm_name == 'Breed') {
                    breed.push(data[i]);

                }
                if (data[i].lm_name == 'Pet Size') {
                    petsize.push(data[i]);

                }
                if (data[i].lm_name == 'Color') {
                    color.push(data[i]);

                }
                if (data[i].lm_name == 'Gender') {
                    gender.push(data[i]);

                }
                if (data[i].lm_name == 'Temper Type') {
                    tempertype.push(data[i]);

                }

            }
            $scope.ptype = pettype;
            $scope.pbreed = breed;
            $scope.psize = petsize;
            $scope.pcolor = color;
            $scope.pgender = gender;
            $scope.ptempertype = tempertype;


        });

        $scope.clearUpdatcustfield = function () {
            $scope.submitted = false;
        };

        $scope.clearPetsfield = function () {
            $scope.submitted = false;
            $scope.pname = "";
            $scope.petage = "";
            $scope.regno = "";
            $scope.collarsize = "";
            $scope.petdob = "";
            $scope.petchip = "";
            $scope.petweight = "";
            $scope.notes = "";
            $scope.petsgender = "";
            $scope.petsbreed = "";
            $scope.petstype = "";
            $scope.petscolor = "";
            $scope.petstempertype = "";
            $scope.petssize = "";
            $scope.decreased = "";
            $scope.mixbreed = "";
            $scope.data = [];
            document.getElementById('file').value = '';
        };



       

        //$scope.addphoto = function () {


          
        //}

        $scope.clearFields = function () {
            $scope.submitted = false;
            $scope.selectedtitlename = "";
            $scope.mobile = "";
            $scope.firstName = "";
            $scope.lastName = "";
            $scope.address = "";
            $scope.zip = "";
            $scope.selectedcountryValue = "";
            $scope.selectedstateValue = "";
            $scope.selectedcity = "";           
            $scope.fax = "";
            $scope.email = "";
            $scope.referrer = "";
            $scope.reminder = "";
            $scope.landline = "";
            $scope.premium = "";
        };


         
       
        $scope.petsnew = function (idno) {
            var f, r;
            var data1 = [];
            $scope.petadd = function () {                 
                var f = document.getElementById('file').files[0];
                  r = new FileReader();                
                  r.onloadend = function (e) {                 
                    console.log(e.length);
                    for (var i = 0; i < 5; i++) {
                        data1.push(e.target.result);
                         }
                    $scope.data = data1;
                    console.log($scope.data);
                   
                }
              
                r.readAsDataURL(f);


                $scope.submitted = true;
                var timestamp = Number(new Date($scope.petdob));
                $scope.date = "\/Date(" + timestamp + ")\/";
               
                $scope.data1 = {
                    "age": $scope.petage,
                    "breed_id": $scope.petsbreed,
                    "chip_no": $scope.petchip,
                    "collar_size": $scope.collarsize,
                    "color_id": $scope.petscolor,
                    "created_by": 1,
                    "created_date": "/Date(1439836200000+0530)/",
                    "customer_id": idno,
                    "dob": $scope.date,
                    "gender_id": $scope.petsgender,
                    "is_deceased": $scope.decreased || "N",
                    "is_deleted": "n",
                    "is_mixed_breed": $scope.mixbreed || "N",
                    "modified_by": 1,
                    "modified_date": "/Date(1439836200000+0530)/",
                    "notes": $scope.notes,
                    "pet_name": $scope.pname,
                    "registration_no": $scope.regno,
                    "size_id": $scope.petssize,
                    "temper_typeid": $scope.petstempertype,
                    "type_id": $scope.petstype,
                    "weight": $scope.petweight
                }
                var res;
                if (!$scope.petAddForm.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.data1,
                    url: 'http://166.62.84.37/PetzCareWS/Pets.svc/AddPet',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                  
                    if (response) {

                        var photos = {

                            "created_by": 1,
                            "created_date": "\/Date(928129800000+0530)\/",
                            "is_deleted": "n",
                            "modified_by": 1,
                            "modified_date": "\/Date(928129800000+0530)\/",
                            "notes": "example",
                            "pet_id": response,
                            "photo_caption": "pet",
                            "file_data": $scope.data
                        }
                       
                        $http({
                            method: 'POST',
                            data: photos,
                            url: 'http://166.62.84.37/PetzCareWS/Pets.svc/AddPhoto',
                            headers: {
                                "Content-Type": 'application/json',
                        }
                        }).success(function (response) {
                            if (response == true) {

                                alert("Pet added successfully");
                                $timeout(function () { $scope.CloseModal(); }, 1000);
                        }
                        }).error(function (response) {
                            $scope.error = response.message;
                        });

                    }
                }).error(function (response) {
                    $scope.error = response.message;
                });
            }
                //console.log(res);
                //$scope.photos = {

                //    "created_by": 1,
                //    "created_date": "\/Date(928129800000+0530)\/",
                //    "is_deleted": "n",
                //    "modified_by": 1,
                //    "modified_date": "\/Date(928129800000+0530)\/",
                //    "notes": "example",
                //    "pet_id": res,
                //    "photo_caption": "pet",
                //    "file_data": $scope.data
                //}
                //console.log($scope.photos);
                //$http({
                //    method: 'POST',
                //    data: $scope.photos,
                //    url: 'http://166.62.84.37/PetzCareWS/Pets.svc/AddPhoto',
                //    headers: {
                //        "Content-Type": 'application/json',
                //    }
                //}).success(function (response) {


                //    $location.path('/');
                //}).error(function (response) {
                //    $scope.error = response.message;
                //});






            };

        };

        //Delete Customer

       

        $scope.CUSTOMERdelete = function (custId1, comid,inDeXvalue) {

                $scope.DeltData = {
                    "CommEntity":
                    {
                        "is_deleted": "Y",
                        "modified_by": 1,
                        "modified_date": $scope.CUSTdelete,
                        "communication_id":comid
                    },
                    "CustEntity":
                         {
                             "customer_id": custId1,
                             "is_deleted": "Y",
                             "modified_by": 1,
                             "modified_date": $scope.CUSTdelete
                         }
                }

                var Delete = confirm("Are You sure.You Want to delete?");
                if (Delete == true) {

                $http.post("http://166.62.84.37/PetzCareWS/Customer.svc/DeleteCustomer", $scope.DeltData).success(function (response) {
                    if (response.DeleteResult == true) {
                        $scope.refreshCustomers();
                        //alert("Customer deleted successfully");
                    }
               });
                }
               

        };



        $scope.RESvalue = true;

        //add customer
        $scope.custadd = function () {
            $scope.submitted = true;
           
               
          
            var timestamp = Number(new Date());
            $scope.date = "\/Date(" + timestamp + ")\/";

            $scope.data = {
                "CommEntity":
            {
                "entity_typeid": $scope.etypeid1,
                "address_typeid": $scope.adrstypeid1,
                "address_1": $scope.address,
                "address_2": '',
                "city_id": $scope.selectedcity,
                "state_id": $scope.selectedstateValue,
                "country_id": $scope.selectedcountryValue,
                "zip_code": $scope.zip || "",
                "phone_1": $scope.mobile,
                "phone_2": $scope.landline || "",
                "fax_1": $scope.fax || "",
                "fax_2": '',
                "email_1": $scope.email,
                "email_2": '',
                "is_deleted": "n",
                "created_by": 1,
                "created_date": $scope.date,
                "modified_by": 1,
                "modified_date": $scope.date
            },
                "CustEntity":
               {
                   "created_by": 1,
                   "created_date": $scope.date,
                   "is_deleted": "n",
                   "modified_by": 1,
                   "modified_date": $scope.date,
                   "title_id": $scope.selectedtitlename,
                   "first_name": $scope.firstName,
                   "middle_name": '',
                   "last_name": $scope.lastName || "",
                   "is_premium": $scope.premium || "N",
                   "referred_by": $scope.referrer,
                   "notes": '',
                   "is_reminder": $scope.reminder || "N"
               }

            }
            if (!$scope.customerForm.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.data,
                    url: 'http://166.62.84.37/PetzCareWS/Customer.svc/AddCustomer',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    console.log(response.AddResult);
                    if (response.AddResult == true) {
                        $scope.refreshCustomers();
                        //$scope.etypeid1 = "";
                        //$scope.adrstypeid1 = "";
                        //$scope.address = "";
                        //$scope.selectedcity = "";
                        //$scope.selectedstateValue = "";
                        //$scope.selectedcountryValue = "";
                        //$scope.zip = "";
                        //$scope.mobile = "";
                        //$scope.landline = "";
                        //$scope.fax = "";
                        //$scope.email = "";
                        //$scope.selectedtitlename = "";
                        //$scope.firstName = "";
                        //$scope.lastName = "";
                        //$scope.premium = "";
                        //$scope.referrer = "";
                        //$scope.reminder = "";
                        alert("Customer added successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                    }
                }).error(function (response) {
                    $scope.error = response.message;
                });
            }

        };


        //Update Customer

        $scope.UpdateCustomer = function () {
            $scope.submitted = true;
           
            var timestamp = Number(new Date());
            $scope.date = "\/Date(" + timestamp + ")\/";

            $scope.data = {
      
            "CommEntity":
            {   					
                "address_typeid":$scope.UpdtCustadrstypeid1,
                "address_1":$scope.UpdtCustaddress,
				"address_2":"",	
				"city_id":$scope.UpdateCustcityTyp,
				"state_id":$scope.UpdateCuststateTyp,
				"country_id":$scope.UpdateCustcontrytyp,
				"zip_code": $scope.UpdtCustzip || "",
				"phone_1": $scope.UpdtCustmobile,
				"phone_2": $scope.UpdtCustlandline || "",
				"fax_1": $scope.UpdtCustfax || "",
				"fax_2":" ",
				"email_1":$scope.UpdtCustemail,
				"email_2":"",
				"is_deleted":"n",
				"modified_by":1,
				"modified_date": $scope.date,
				"communication_id":$scope.comid
            },
				"CustEntity":
                {	
                    "is_deleted":"n",
                    "modified_by":1,
                    "modified_date": $scope.date,
                    "title_id":$scope.UpdtCustselectedtitlename,
                    "first_name": $scope.UpdtCustfirstName,
                    "middle_name":"",
                    "last_name":$scope.UpdtCustlastName || "",                    
                    "is_premium": $scope.UpdtCustpremium || "N",
                    "referred_by":$scope.UpdtCustreferrer,
                    "notes": '',
                    "is_reminder": $scope.UpdtCustreminder || "N",
                    "customer_id": $scope.customerid
                }
        }

      
            if (!$scope.UpdateCustomerForm.$invalid) {
            $http({
                method: 'POST',
                data: $scope.data,
                url: 'http://166.62.84.37/PetzCareWS/Customer.svc/UpdateCustomer',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                console.log(response.AddResult);
                if (response.UpdateResult == true) {
                    $scope.refreshCustomers();
                    //$scope.etypeid1 = "";
                    //$scope.adrstypeid1 = "";
                    //$scope.address = "";
                    //$scope.selectedcity = "";
                    //$scope.selectedstateValue = "";
                    //$scope.selectedcountryValue = "";
                    //$scope.zip = "";
                    //$scope.mobile = "";
                    //$scope.landline = "";
                    //$scope.fax = "";
                    //$scope.email = "";
                    //$scope.selectedtitlename = "";
                    //$scope.firstName = "";
                    //$scope.lastName = "";
                    //$scope.premium = "";
                    //$scope.referrer = "";
                    //$scope.reminder = "";
                    alert("Customer Updated successfully");
                    $timeout(function () { $scope.CloseModal(); }, 1000);
                }
            }).error(function (response) {
                $scope.error = response.message;
            });
        }

    };




    };


//Pagination
    app.filter('pagination', function () {
        return function (input, start) {
            start = parseInt(start, 10);
            return input.slice(start);
        };
    });
    app.filter('pagination1', function () {
        return function (input, start1) {
            start1 = parseInt(start1, 10);
            return input.slice(start1);
        };
    });
    app.filter('pagination2', function () {
        return function (input, start2) {
            start2 = parseInt(start2, 10);
            return input.slice(start2);
        };
    });


    
   
   

    


})();