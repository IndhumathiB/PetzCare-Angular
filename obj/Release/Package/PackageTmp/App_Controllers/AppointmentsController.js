
(function () {
    'use strict';
    var app = angular.module('petzCareSP.AppointmentsController', []);
    app.controller('AppointmentsController', ['$scope', '$http', '$location', '$window', '$timeout', AppointmentsController]);

    function AppointmentsController($scope, $http, $location, $window, $timeout) {
       
        $scope.submitted = false;

        angular.element('#appointmentloader').css('display','block');
        var timestamp = Number(new Date());
        $scope.date = "\/Date(" + timestamp + ")\/";
        $scope.serviceTypeName = true;
        $scope.servicenamevalue = true;
       
        console.log($scope.datevalue);

        //Get All Appointments
        $scope.appointdetails = [];

        $scope.refreshAppointments = function () {
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/GetAllAppointments',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                for (var j = 0; j < response.length; j++) {

                    response[j].pickup_date = integertodate(response[j].pickup_date);
                }
                $scope.appointdetails = response;
            });
        }
        setTimeout(function () {
        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/GetAllAppointments',
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
                var pickdates = integertodate(roleMapping[j].pickup_date);
                var Dates = pickdates.split(",");
                roleMapping[j].pickup_date = Dates[0];
               
            }
           
            $scope.appointdetails = roleMapping;
      
            //Clear Advanced Search

            $scope.filtrclearappoints = function () {
                $scope.fdate = "";
                $scope.fcustname = "";
                $scope.fpetname = "";
                $scope.factive = "";
                $scope.statufilt = "";
                $scope.servetype = "";
                $scope.appointdetails = response;
            };

          
            //Advanced Search
          
            $scope.filtrappoints = function () {                                         
                var timestamp = Number(new Date($scope.fdate));
                $scope.f1date = "\/Date(" + timestamp + ")\/";               
                $scope.filtdata = {
                    "customer_name": $scope.fcustname || "",
                    "pet_name": $scope.fpetname || "",
                    "status_name": $scope.factive || "",
                    "appointment_name": $scope.servfilt || "",
                    "service_name": $scope.statufilt || ""                    
                }
               
                $http({
                    method: 'POST',
                    data: $scope.filtdata,
                    url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/GetAppointmentsHistoryByFilter',
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
                        var pickdates = integertodate(roleMapping[j].pickup_date);
                        var Dates = pickdates.split(",");
                        roleMapping[j].pickup_date = Dates[0];

                    }

                    $scope.appointdetails = response;

                });
                $scope.servfilt = $scope.servetype.ld_name;
            };
        }) 
            .finally(function(){
                angular.element('#appointmentloader').css('display','none');
            });
        }, 2000);


        //Sorting
        $scope.AppointmentSort = function (asc, header) {

            if (asc) {
                $scope.appointdetails.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.appointdetails.sort(predicatByDes(header));

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


        $scope.ClearAdditionalService = function () {
            $scope.submitted = false;
            $scope.sernotes = "";
            $scope.serstatus = "";
            $scope.serdeldate = "";
            $scope.serpickdate = "";
            $scope.serdelivery = "";
            $scope.serpickup = "";
            $scope.serremin = "";
            $scope.serrecurr = "";
            $scope.serestimate = "";
            $scope.serappindate = "";
            $scope.sergroomstyl = "";
            $scope.sergroomer = "";
            $scope.serremin = "";
            $scope.serbookrun = "";
            $scope.serchargeday = "";
            $scope.serenddate = "";
            $scope.serstartdate = "";
            $scope.serstatustype4 = "";
            $scope.serpetnm = "";
        }


        $scope.clearAppointment = function () {
            $scope.submitted = false;
            $scope.errMessage1 = "";
            $scope.errMessage2 = "";
            $scope.date = "";
            $scope.custnam = "";
            $scope.petnm = "";
            $scope.statustype1 = "";
            $scope.remin = "";
            $scope.stttdt = "";
            $scope.sttdat = "";
            $scope.enndt = "";
            $scope.nndate = "";
            $scope.pick = "";
            $scope.recurr = "";
            $scope.pickdate = "";
            $scope.delvry = "";
            $scope.delrydate = "";
            $scope.estimat = "";
            $scope.appnt = "";
            $scope.gromeval = "";
            $scope.gromstyl1 = "";
            $scope.chrgdas = ""; 
            $scope.bokwhlrun = "";
            $scope.stus1 = "";
            $scope.adnotes = ""; 
            $scope.servetype = "";
        };
      


        function integertodate(pickup_date) {

            var res = pickup_date.substring(pickup_date.indexOf("(") + 1, pickup_date.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
        }
        function integertodate(appointment_date) {

            var res = appointment_date.substring(appointment_date.indexOf("(") + 1, appointment_date.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
        }
        function integertodate(delivery_date) {

            var res = delivery_date.substring(delivery_date.indexOf("(") + 1, delivery_date.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
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
            return Math.ceil($scope.appointdetails.length / $scope.itemsPerPage) - 1;
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

        //Get Groomers

        var groome = [];

        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/Employee.svc/GetAllEmployees',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {
           
            for (var j = 0; j < response.length; j++) {
                groome[j] = _.pick(JSON.parse(JSON.stringify(response[j])), 'first_name', 'employee_id');
            }
            $scope.groomers = groome;

        });



        //Get Customers

        var custdetails = [];

        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/Customer.svc/GetAllCustomers',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {
            for (var j = 0; j < response.length; j++) {
                custdetails[j] = _.pick(JSON.parse(JSON.stringify(response[j])), 'first_name', 'customer_id');
            }
            $scope.customrids = custdetails;

            
        });


        // Get Pets By Customer

        var petcustomer = [];
        $scope.pets = function (id) {
            $scope.custmid = id;
            $http({
                method: 'POST',
                data: { "customer_id": id },
                url: 'http://166.62.84.37/PetzCareWSQA/Pets.svc/GetPetsByCustomer',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
               
                for (var j = 0; j < response.length; j++) {
                    petcustomer[j] = _.pick(JSON.parse(JSON.stringify(response[j])), 'pet_name', 'pet_id');
                }
                $scope.petcustomers = petcustomer;

            });

        };

      

        


        
        //Get Service, Groom Style and Status

        var groomstl = [];
        var servicetype = [];
        var status = [];
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
                if (data[i].lm_name == 'Status') {
                    status.push(data[i]);
                    
                }
                if (data[i].lm_name == 'Groom Style') {
                    groomstl.push(data[i]);

                }
              }
            $scope.groomstyle = groomstl;
            $scope.statusval = status;
            $scope.svctype = servicetype;
           



            //Get Service Type

            $scope.modify = function () {

                var ser1type = [];
                var stype = [];
                var len = data.length;

                $scope.serviceText = $scope.servetype.ld_name;
                for (var i = 0; i < len; i++) {
                    if (data[i].lm_name == 'Service Type' && data[i].parent_id == $scope.servetype.ld_id) {
                        stype.push(data[i]);
                      
                    }
                }
                
                var lenth = stype.length;
               
                for (var i = 0; i < lenth; i++) {
                   

                    $http({
                        method: 'POST',
                        data: { "service_typeid": stype[i].ld_id },
                        url: 'http://166.62.84.37/PetzCareWSQA/PetServices.svc/GetServiceByType',
                        headers: {
                            "Content-Type": 'application/json',
                        }
                    }).success(function (data1) {
                       
                        $scope.serviceTypeName = false;
                        var len = data1.length;
                        for (var i = 0; i < len; i++) {
                            ser1type.push(_.pick(JSON.parse(JSON.stringify(data1[i])), 'service_name', 'service_id'));
                        }
                        $scope.sertype = ser1type;
                       
                    });
                }
            };


        });
      


        // Appointment Filter

        $scope.appoinfltr = function (aptname, idno, custmrid, apids,invoiceNo) {
            var ser11type = [];
            var servtyp = [];
            var ser1type2 = [];
            var mat = [];
            $scope.pets(custmrid);
            $scope.serstatustype3 = apids;
            $scope.sesids = idno;
            $scope.invoiceno = invoiceNo;
           $scope.Confrmid1 = { "appointment_name": aptname, "appointment_id": idno };
            var seids = { "service_id": apids };
            $scope.sername = aptname;
            var id1 = { "appointment_name": aptname, "appointment_id": idno };

            $http({
                method: 'POST',
                data: { "ld_name": $scope.sername },
                url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetailByName',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data1) {

                var len = data1.length;
                for (var i = 0; i < len; i++) {
                    ser1type2[i] = _.pick(JSON.parse(JSON.stringify(data1[i])), 'ld_id');
                }

                $scope.sertype2 = ser1type2;
              
            });


            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetails',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {
               
                var leth = data.length;
               
                for (var i = 0; i < leth; i++) {
                   
                if (data[i].lm_name == 'Service Type' && data[i].parent_id == $scope.sertype2[0].ld_id) {
                    servtyp.push(data[i]);
                   
                }
                 }
               
      
            var lenth = servtyp.length;
            for (var i = 0; i < lenth; i++) {
              
                $http({
                    method: 'POST',
                    data: { "service_typeid": servtyp[i].ld_id },
                    url: 'http://166.62.84.37/PetzCareWSQA/PetServices.svc/GetServiceByType',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (data1) {
                   

                    var len = data1.length;
                    for (var i = 0; i < len; i++) {
                        ser11type.push(_.pick(JSON.parse(JSON.stringify(data1[i])), 'service_name', 'service_id'));
                    }
                    $scope.sertype11 = ser11type;
                   
                });
            }
            });
      

            //Get Service Report

            $http({
                method: 'POST',
                data: { "invoice_number": $scope.invoiceno },
                url: 'http://166.62.84.37/PetzCareWSQA/ServiceInvoice.svc/GetServiceInvoiceReport',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                for (var j = 0; j < response.length; j++) {                    
                    response[j].ServiceList[j].appointment_date = integertodate(response[j].ServiceList[j].appointment_date);
                }
                var roleMapping = [];
                var result = _.each(response, function (object) {
                    object.selects = false;
                    roleMapping.push(object);
                });
                for (var j = 0; j < roleMapping.length; j++) {
                    var pickdates = integertodate(roleMapping[j].invoice_date);
                    var Dates = pickdates.split(",");
                    roleMapping[j].invoice_date = Dates[0];

                }

                $scope.invoice = response;

            });




            $http({
                method: 'POST',
                data: id1,
                url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/GetAppointmentsDetails',
                headers: {
                    "Content-Type": 'application/json',

                }
            }).success(function (response) {
                for (var j = 0; j < response.length; j++) {
                    if (response[j].is_pickup = "No") {
                        response[j].pickup_date = "-";
                    }
                    else {
                        response[j].pickup_date = integertodate(response[j].pickup_date);
                    }
                }
                for (var j = 0; j < response.length; j++) {
                    if (response[j].is_delivery = "No") {
                        response[j].delivery_date = "-";
                    }
                    else {
                        response[j].delivery_date = integertodate(response[j].delivery_date);
                    }
                }
                for (var j = 0; j < response.length; j++) {
                    mat[j] = JSON.parse(JSON.stringify(response[j]));
                }
                $scope.appointment = mat[0];

            });


            //Appointments Details
           
            $http({
                method: 'POST',
                data: { "br_appid": idno },
                url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/GetBoardingAppointmentServicesById',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                for (var j = 0; j < response.length; j++) {
                    if (response[j].is_pickup == "Y" || response[j].is_pickup == "y") {
                        response[j].is_pickup = "Yes";
                    }
                    else {
                        response[j].is_pickup = "No";
                       
                    }
                }
                for (var j = 0; j < response.length; j++) {
                    if (response[j].is_delivery == "Y" || response[j].is_delivery == "y") {
                        response[j].is_delivery = "Yes";
                    }
                    else {
                        response[j].is_delivery = "No";
                      
                    }
                }
               
                for (var j = 0; j < response.length; j++) {
                    if (response[j].is_pickup == "No") {
                        response[j].pickup_date = "-";
                    }
                    else {
                        response[j].pickup_date = integertodate(response[j].pickup_date);
                    }
                }
                for (var j = 0; j < response.length; j++) {
                    if (response[j].is_delivery == "No") {
                        response[j].delivery_date = "-";
                    }
                    else {
                        response[j].delivery_date = integertodate(response[j].delivery_date);
                    }
                }
               
                var roleMapping = [];
                var result = _.each(response, function (object) {
                    object.selects = false;
                    roleMapping.push(object);
                });
                for (var j = 0; j < roleMapping.length; j++) {
                    var pickdates1 = integertodate(roleMapping[j].appointment_date);
                    var Dates = pickdates1.split(",");
                    roleMapping[j].appointment_date = Dates[0];                   

                }


                            $scope.brdappsedetails = response;
               
            }).error(function (response) {
                $scope.error = response.message;
            });


            $http({
                method: 'POST',
                data: { "gr_appid": idno },
                url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/GetGroomingAppointmentServicesById',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                for (var j = 0; j < response.length; j++) {
                    if (response[j].is_pickup == "Y" || response[j].is_pickup == "y") {
                        response[j].is_pickup = "Yes";
                    }
                    else
                    {
                        response[j].is_pickup = "No";
                    }
                }
                for (var j = 0; j < response.length; j++) {
                    if (response[j].is_delivery == "Y" || response[j].is_delivery == "y") {
                        response[j].is_delivery = "Yes";
                    }
                    else {
                        response[j].is_delivery = "No";
                    }
                }
                for (var j = 0; j < response.length; j++) {
                    if (response[j].is_pickup == "No") {
                        response[j].pickup_date = "-";
                    }
                    else {
                        response[j].pickup_date = integertodate(response[j].pickup_date);
                    }
                }
                for (var j = 0; j < response.length; j++) {
                    if (response[j].is_delivery == "No") {
                        response[j].delivery_date = "-";
                    }
                    else {
                        response[j].delivery_date = integertodate(response[j].delivery_date);
                    }
                }
                var roleMapping = [];
                var result = _.each(response, function (object) {
                    object.selects = false;
                    roleMapping.push(object);
                });
                for (var j = 0; j < roleMapping.length; j++) {
                    var pickdates1 = integertodate(roleMapping[j].appointment_date);
                    var Dates = pickdates1.split(",");
                    roleMapping[j].appointment_date = Dates[0];

                }
                for (var j = 0; j < response.length; j++) {
                    if (response[j].asGr_appid == 0)

                    response[j].asGr_appid = 1;
                }
                $scope.grmappsedetails = response;
                console.log($scope.grmappsedetails);

            }).error(function (response) {
                $scope.error = response.message;
            });

        };

            
        // Date picker Solution 

        // angular.element('#myModals').modal('hide');
        $scope.datePicker = "";
        $('#daterange').unbind().on('apply.daterangepicker', function (ev, picker) {


            console.log(picker.startDate.format('MM/DD/YYYY'));
            console.log(picker.endDate.format('MM/DD/YYYY'));

            var startDate = new Date(picker.startDate.format('MM/DD/YYYY')),
            endDate = new Date(picker.endDate.format('MM/DD/YYYY'));
            console.log(startDate)
            console.log(endDate)
            var res = $scope.last_good_configuration.filter(function (item) {
                var date = new Date(item.pickup_date);
                return date >= startDate && date <= endDate;
            });

            $scope.$apply()

            $scope.appointdetails = res;
            console.log($scope.appointdetails);
            $scope.$apply()
        });




        $scope.filters = function (ev, picker) {

            console.log($scope.datePicker)
            // console.log("hhhhhhhhhhhhhhhhhhhhh",$scope.datePicker.startDate);
            console.log($scope.datePicker.endDate);

            if ($scope.datePicker.startDate != null || $scope.datePicker.endDate != null) {
                $scope.datePicker.startDate._i = moment($scope.datePicker.startDate._i).format('MM/DD/YYYY');
                $scope.datePicker.endDate._i = moment($scope.datePicker.endDate._i).format('MM/DD/YYYY');
                console.log($scope.datePicker.startDate._i);
                console.log($scope.datePicker.endDate._i);

                var startDate = new Date($scope.datePicker.startDate._i),
                endDate = new Date($scope.datePicker.endDate._i);

                var res = $scope.last_good_configuration.filter(function (item) {
                    var date = new Date(item.pickup_date);
                    return date >= startDate && date <= endDate;
                });

                console.log(res);

                setTimeout(function () {
                    $scope.$apply()
                    $scope.appointdetails = res;
                    console.log($scope.appointdetails);
                    $scope.$apply()
                }, 100)

            }
            else {

                $scope.appointdetails = $scope.last_good_configuration;
                //  console.log("hhhhhhhhhhhhhhhhhhhhh", $scope.datePicker.startDate);
                console.log($scope.datePicker.endDate);
                setTimeout(function () {
                    $scope.datePicker = "";


                }, 100)

            }
        }

        //Appointment Confirm

        $scope.COnfrmAppoint=function()
        {
            console.log($scope.Confrmid1);
            $http({
                method: 'POST',
                data: $scope.Confrmid1,
                url: ' http://166.62.84.37/PetzCareWSQA/Appointments.svc/AppointmentConfirmations',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                if (response == true) {                   
                    alert("Successfuly sent Appointment to your Email Id");
                    $timeout(function () { $scope.CloseModal(); }, 1000);
                }

            });


        };
              
          
        
        //Delete Appointment

        $scope.deltdATA = function (IDno, idNO,serViceName,Index) {
          
            if (IDno && serViceName == 'AdditionalBoarding') {
               
                $scope.delDATA = {
                    "is_deleted": "y",
                    "modified_by": 1,
                    "modified_date": $scope.date,
                    "br_appid": $scope.sesids,
                    "asBr_appid": IDno
                }
                var Delete = confirm("Are You sure.You Want to delete?");
                if (Delete == true) {
                $http({
                    method: 'POST',
                    data: $scope.delDATA,
                    url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/DeleteAdditionalBoardingService',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {
                        $scope.brdappsedetails.splice(Index, 1);
                     //   alert("Additional Boarding Service deleted successfully");
                    }

                }).error(function (response) {
                    $scope.error = response.message;
                });
            }
          
            }
            else if (idNO && serViceName == 'AdditionalGrooming') {
                
                $scope.delDATA = {
                    "is_deleted": "y",
                    "modified_by": 1,
                    "modified_date": $scope.date,
                    "gr_appid": $scope.sesids,
                    "asGr_appid": idNO
                }
                var Delete = confirm("Are You sure.You Want to delete?");
                if (Delete == true) {
                $http({
                    method: 'POST',
                    data: $scope.delDATA,
                    url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/DeleteAdditionalGroomingService',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {
                        $scope.grmappsedetails.splice(Index, 1);
                       // alert("Additional Grooming Service deleted successfully");
                    }

                }).error(function (response) {
                    $scope.error = response.message;
                });
                }
             
              
            }
        };
          

    //Delete Appointments

            
        $scope.APPOINTdelete = function (appId1, chec, index) {
        
        if (chec == 'Boarding') {
             
                $scope.Data = {
                    "is_deleted": "y",
                    "modified_by": 1,
                    "modified_date": $scope.date,
                    "br_appid": appId1
                }
                var Delete1 = confirm("Are You sure.You Want to delete?");
                if (Delete1 == true) {
                  $http.post("http://166.62.84.37/PetzCareWSQA/Appointments.svc/DeleteBoardingAppointment", $scope.Data).success(function (response) {
                    
                      if (response == true) {
                          $scope.refreshAppointments();
                          //alert("Appointment deleted successfully");
                      }

                  });
                }
               
            }
        else if (chec == 'Grooming') {
            
                $scope.Data = {
                    "is_deleted": "y",
                    "modified_by": 1,
                    "modified_date": $scope.date,
                    "gr_appid": appId1
                }
                var Delete2 = confirm("Are You sure.You Want to delete?");
                if (Delete2 == true) {
                $http.post("http://166.62.84.37/PetzCareWSQA/Appointments.svc/DeleteGroomingAppointment", $scope.Data).success(function (response) {

                       if (response == true) {
                           $scope.refreshAppointments();
                          // alert("Appointment deleted successfully");
                       }

                });
                }
               
            }


        
           
        };


      
        var datevalue = Number(new Date());        
        console.log(datevalue);
        datevalue.setHours(0, 0, 0, 0);
        $scope.todaydate = "\/Date(" + datevalue + ")\/";
        $scope.checkErr = function (startDate, endDate, pickDate, deliveryDate, appointDate) {
            $scope.errMessage1 = '';
            $scope.errMessage2 = '';
            $scope.errMessage3 = '';
            $scope.errMessage4 = '';
            $scope.errMessage5 = '';
            $scope.sttdat = startDate;
            $scope.enndt = endDate;
            $scope.pickdate = pickDate;
            $scope.dedate = deliveryDate;
            $scope.appointdat = appointDate;
            $scope.serstartdate = startDate;
            $scope.serenddate = endDate;
            $scope.serpickdate = pickDate;
            $scope.serdeldate = deliveryDate;
            $scope.serappindate = appointDate;
          
            if (new Date($scope.sttdat || $scope.serstartdate) > new Date($scope.enndt || $scope.serenddate)) {
                $scope.errMessage2 = 'End Date should be greater than start date';
                return false;
            }
            if (new Date($scope.sttdat || $scope.serstartdate) < datevalue) {
                console.log(datevalue);
                $scope.errMessage1 = 'Start date should not be before today.';
                return false;
            }
            if (new Date($scope.pickupdat || $scope.serpickdate) > new Date($scope.dedate || $scope.serdeldate)) {
                $scope.errMessage3 = 'Delivery Date should be greater than Pickup date';
                return false;
            }
            if (new Date($scope.pickupdat || $scope.serpickdate) < datevalue) {
                $scope.errMessage4 = 'Pickup date should not be before today.';
                return false;
            }
            if (new Date($scope.appointdat || $scope.serappindate) < datevalue) {
                $scope.errMessage5 = 'Appointment date should not be before today.';
                return false;
            }
        };
        var timestamp = Number(new Date());
        $scope.date = "\/Date(" + timestamp + ")\/";
       
        $scope.newAppoint = function () {
        
            $scope.submitted = true;  
            var timestamp = Number(new Date());
            $scope.date = "\/Date(" + timestamp + ")\/";
            var Serviceid = $scope.servetype.ld_name;
          
            var timestamp = Number(($scope.sttdat));
            $scope.stttdt = "\/Date(" + timestamp + ")\/";

            var timestamp = Number(($scope.enndt));
            $scope.nndate = "\/Date(" + timestamp + ")\/";
            var timestamp = Number(($scope.appnt));
            $scope.appointdat = "\/Date(" + timestamp + ")\/";

            var timestamp = Number(($scope.pickupdat));
            $scope.pickdate = "\/Date(" + timestamp + ")\/";

          
            var timestamp = Number(($scope.dedate));
            $scope.delrydate = "\/Date(" + timestamp + ")\/";

            if (Serviceid == 'Boarding') {
                
                $scope.data = {
                    "created_by": 1,
                    "created_date": $scope.date,
                    "is_deleted": "n",
                    "modified_by": 1,
                    "modified_date": $scope.date,
                    "customer_id": $scope.custnam,
                    "pet_id": $scope.petnm,
                    "service_id": $scope.statustype1,
                    "is_reminder": $scope.remin || "N",
                    "start_date": $scope.stttdt,
                    "end_date": $scope.nndate,
                    "is_pickup": $scope.pick || "N",                   
                    "is_delivery": $scope.delvry || "N",                  
                    "chargaeble_days": $scope.chrgdas,
                    "is_bookwholerun": $scope.bokwhlrun || "N",
                    "status_id": $scope.stus1,
                    "notes": $scope.adnotes
                }
               
                if ($scope.pick == "Y" || $scope.pick == "y") {
                    $scope.data.pickup_date = $scope.pickdate;
                }
                if ($scope.delvry == "Y" || $scope.delvry == "y") {
                    $scope.data.delivery_date = $scope.delrydate;
                }
                if ($scope.petnm && $scope.statustype1 && $scope.stttdt && $scope.nndate && $scope.chrgdas && $scope.stus1 && $scope.custnam && $scope.servetype) {
                    $http({
                        method: 'POST',
                        data: $scope.data,
                        url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/AddBoardingAppointment',
                        headers: {
                            "Content-Type": 'application/json',
                        }
                    }).success(function (response) {
                        if (response == true) {
                            $scope.refreshAppointments();

                            alert("Appointment added successfully");
                            $timeout(function () { $scope.CloseModal(); }, 1000);
                        }

                    }).error(function (response) {
                        $scope.error = response.message;
                    });
                }
                }
           
            else if (Serviceid != 'Boarding') {
              
                $scope.data = {
                    "created_by": 1,
                    "created_date": $scope.date,
                    "is_deleted": "n",
                    "modified_by": 1,
                    "modified_date": $scope.date,
                    "service_id": $scope.statustype1,
                    "customer_id": $scope.custnam,
                    "pet_id": $scope.petnm,
                    "groomer_Id": $scope.gromeval,
                    "is_reminder": $scope.remin || "N",
                    "appointment_date": $scope.appointdat,
                    "estimated_duration": $scope.estimat,
                    "is_pickup": $scope.pick || "N",                   
                    "is_delivery": $scope.delvry || "N",                  
                    "style_id": $scope.gromstyl1,
                    "is_recurring": $scope.recurr || "N",
                    "status_id": $scope.stus1,
                    "notes": $scope.adnotes
                }

                if ($scope.pick == "Y" || $scope.pick == "y") {
                    $scope.data.pickup_date = $scope.pickdate;
                }
                if ($scope.delvry == "Y" || $scope.delvry == "y") {
                    $scope.data.delivery_date = $scope.delrydate;
                }
                if ($scope.petnm && $scope.statustype1 && $scope.gromeval && $scope.gromstyl1 && $scope.estimat && $scope.stus1 && $scope.custnam && $scope.servetype && $scope.appointdat) {
                    $http({
                        method: 'POST',
                        data: $scope.data,
                        url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/AddGroomingAppointment',
                        headers: {
                            "Content-Type": 'application/json',
                        }
                    }).success(function (response) {
                        if (response == true) {
                            $scope.refreshAppointments();
                            //$scope.servetype = "";
                            //$scope.custnam = "";
                            //$scope.petnm = "";
                            //$scope.statustype1 = "";
                            //$scope.remin = "";
                            //$scope.sttdat = "";
                            //$scope.enndt = "";
                            //$scope.pick = "";
                            //$scope.pickupdat = "";
                            //$scope.delvry = "";
                            //$scope.dedate = "";
                            //$scope.chrgdas = "";
                            //$scope.bokwhlrun = "";
                            //$scope.stus1 = "";
                            //$scope.gromeval = "";
                            //$scope.appnt = "";
                            //$scope.estimat = "";
                            //$scope.gromstyl1 = "";
                            //$scope.recurr = "";
                            //$scope.adnotes = "";

                            alert("Appointment added successfully");
                            $timeout(function () { $scope.CloseModal(); }, 1000);
                        }

                    }).error(function (response) {
                        $scope.error = response.message;
                    });

                }
            }

        };
        
        
        
        //Close modals
        $scope.CloseModal = function () {
            $('#myModal').modal('hide');
            $('#addtionalappdetail').modal('hide');
            $('#appointmentdetail').modal('hide');
           
        }

        $scope.additionalAppService = function () {

            $scope.submitted = true;
            var timestamp = Number(new Date($scope.serstartdate));
            $scope.serstrt = "\/Date(" + timestamp + ")\/";

            var timestamp = Number(new Date($scope.serenddate));
            $scope.serndat = "\/Date(" + timestamp + ")\/";
            var timestamp = Number(new Date($scope.serappindate));
            $scope.serapdat = "\/Date(" + timestamp + ")\/";

            var timestamp = Number(new Date($scope.serpickdate));
            $scope.serpikdt = "\/Date(" + timestamp + ")\/";

            var timestamp = Number(new Date($scope.serdeldate));
            $scope.serdedat = "\/Date(" + timestamp + ")\/";




            if ($scope.sername == 'Boarding') {

                $scope.addservboarddata = {
                    "created_by": 1,
                    "created_date": $scope.date,
                    "is_deleted": "n",
                    "modified_by": 1,
                    "modified_date": $scope.date,
                    "customer_id": $scope.custmid,
                    "pet_id": $scope.serpetnm,
                    "service_id": $scope.serstatustype4,
                    "is_reminder": $scope.serremin || "N",
                    "start_date": $scope.serstrt,
                    "end_date": $scope.serndat,
                    "is_pickup": $scope.serpickup || "N",                   
                    "is_delivery": $scope.serdelivery || "N",                   
                    "chargaeble_days": $scope.serchargeday,
                    "is_bookwholerun": $scope.serbookrun || "N",
                    "status_id": $scope.serstatus,
                    "notes": $scope.sernotes,
                    "br_appid": $scope.sesids
                }

                if ($scope.serpickup == "Y") {
                    $scope.addservboarddata.pickup_date = $scope.serpikdt;
                }
                if ($scope.serdelivery == "Y") {
                    $scope.addservboarddata.delivery_date = $scope.serdedat;
                }
                $http({
                    method: 'POST',
                    data: $scope.addservboarddata,
                    url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/AddAdditionalBoardingService',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {
                        //$scope.custmid = "";
                        //$scope.serpetnm = "";
                        //$scope.serstatustype4 = "";
                        //$scope.serremin = "";
                        //$scope.serstartdate = "";
                        //$scope.serenddate = "";
                        //$scope.serpickup = "";
                        //$scope.serpickdate = "";
                        //$scope.serdelivery = "";
                        //$scope.serdeldate = "";
                        //$scope.serchargeday = "";
                        //$scope.serbookrun = "";
                        //$scope.serstatus = "";
                        //$scope.sernotes = "";
                        //$scope.sesids = "";
                        alert("Additional service added successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                    }
                }).error(function (response) {
                    $scope.error = response.message;
                });


            }
            else if ($scope.sername != 'Boarding') {

                $scope.addservgroomddata = {
                    "created_by": 1,
                    "created_date": $scope.date,
                    "is_deleted": "n",
                    "modified_by": 1,
                    "modified_date": $scope.date,
                    "customer_id": $scope.custmid,
                    "pet_id": $scope.serpetnm,
                    "groomer_Id": $scope.sergroomer,
                    "is_reminder": $scope.serremin || "N",
                    "appointment_date": $scope.serapdat,
                    "estimated_duration": $scope.serestimate,
                    "is_pickup": $scope.serpickup || "N",                  
                    "is_delivery": $scope.serdelivery || "N",                  
                    "style_id": $scope.sergroomstyl,
                    "is_recurring": $scope.serrecurr || "N",
                    "status_id": $scope.serstatus,
                    "notes": $scope.sernotes,
                    "gr_appid": $scope.sesids,
                    "service_id": $scope.serstatustype4
                }
                if ($scope.serpickup == "Y") {
                    $scope.addservgroomddata.pickup_date = $scope.serpikdt;
                }
                if ($scope.serdelivery == "Y") {
                    $scope.addservgroomddata.delivery_date = $scope.serdedat;
                }

               
                $http({
                    method: 'POST',
                    data: $scope.addservgroomddata,
                    url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/AddAdditionalGroomingService',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {
                        //$scope.custmid = "";
                        //$scope.serpetnm = "";
                        //$scope.sergroomer = "";
                        //$scope.serremin = "";
                        //$scope.serappindate = "";
                        //$scope.serestimate = "";
                        //$scope.serpickup = "";
                        //$scope.serpickdate = "";
                        //$scope.serdelivery = "";
                        //$scope.serdeldate = "";
                        //$scope.sergroomstyl = "";
                        //$scope.serrecurr = "";
                        //$scope.serstatus = "";
                        //$scope.sernotes = "";
                        //$scope.sesids = "";
                        //$scope.serstatustype4 = "";
                        alert("Additional service added successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                    }
                }).error(function (response) {
                    $scope.error = response.message;
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