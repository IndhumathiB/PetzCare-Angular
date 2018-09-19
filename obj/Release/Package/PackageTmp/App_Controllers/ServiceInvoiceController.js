(function () {
    'use strict';
    var app = angular.module('petzCareSP.ServiceInvoiceController', []);
    app.controller('ServiceInvoiceController', ['$scope', '$http', '$location', '$filter', '$timeout','$rootScope', ServiceInvoiceController]);

    function ServiceInvoiceController($scope, $http, $location, $filter, $timeout, $rootScope) {
        $scope.submitted = false;
        angular.element('#serviceInvoiceloader').css('display', 'block');
        $scope.f1 = {};
        var timestamp = Number(new Date());
        $scope.srcedate = "\/Date(" + timestamp + ")\/";
        $scope.selin = 'Invoicelist';
        $scope.LISTvalues = ['Invoicelist', 'Appointmentlist'];
        var tax1 = [];
        var Paytype1 = [];
        var Paystatus1 = [];
        setTimeout(function(){

            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/Lookup.svc/GetAllLookupDetails',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {
       
                var len = data.length;
                for (var i = 0; i < len; i++) {

                    if (data[i].lm_name == 'Tax Percentage') {
                        tax1.push(data[i]);

                    }
                    if (data[i].lm_name == 'Payment Type') {
                        Paytype1.push(data[i]);

                    }
                    if (data[i].lm_name == 'Payment Status') {
                        Paystatus1.push(data[i]);

                    }

               

                }

                $scope.tax = tax1;
                $scope.Paytype = Paytype1;
                $scope.Paystatus = Paystatus1;
           
          

            })
               .finally(function () {
                   angular.element('#serviceInvoiceloader').css('display', 'none');
               });
        }, 2000);


        //Close modals
        $scope.CloseModal = function () {
            $('#createInvoice').modal('hide');
            
        }



        //All Customers
        $scope.custinvcs = [];

        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/Customer.svc/GetAllCustomers',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {
            $scope.custinvcs = response;
          
        });

       
        $scope.petinvcfltr = function () {
           
            var petid = { "customer_id": $scope.selectedcunaminc };
            
            $http({
                method: 'POST',
                data:petid,
                url: 'http://166.62.84.37/PetzCareWSQA/Pets.svc/GetPetsByCustomer',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                          
                $scope.petinvs = response;
                $http({
                    method: 'POST',
                    data: petid,
                    url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/GetAppointmentsByCustomer',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                  
                    $scope.m = response;
                    $scope.appt2 = response;
                  

                });
            });

        };
        var response4 = [];
        $scope.aptinvcfltr = function () {
           
            for (var j = 0; j < $scope.m.length; j++) {
               
                if ($scope.m[j].pet_id == $scope.selectedpetinvoice) {
                   
                    response4.push($scope.m[j]);

                }
            }
           
            $scope.appt1 = response4;
           
        };


        //Get view details
        var mine = [];
        var totamount = [];
        var mine1 = [];
        $scope.viewdats = function () {
            $scope.totalAmout = 0;
            if ($scope.selectedaptinvoice.appointment_name == "Boarding") {
                var dtlid = { "br_appid": $scope.selectedaptinvoice.appointment_id }
                $http({
                    method: 'POST',
                    data: dtlid,
                    url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/GetBoardingAppointmentServicesById',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    var len = response.length;
                    for (var i = 0; i < len; i++) {
                        mine[i] = _.pick(JSON.parse(JSON.stringify(response[i])), 'service_type_name', 'chargaeble_days', 'service_rate', 'pet_name', 'pet_id');
                    }

                    $scope.viein = mine;
                   
                    var amount = _.pluck(mine, 'service_rate');
                    
                    for (var i = 0; i <  $scope.viein.length; i++) {
                        $scope.totalAmout += amount[i];
                    }
                    $scope.NetAmount = $scope.totalAmout;

                    $scope.adtnlser = function () {
                        $scope.viein.push({
                            "pet_name": "",
                            "chargaeble_days": $scope.duratin,
                            "service_rate": $scope.rates,
                            "service_type_name": $scope.selectedpservc.service_name
                        });
                    };

                });


            }
            else if ($scope.selectedaptinvoice.appointment_name == "Grooming") {

                var dtlid = { "gr_appid": $scope.selectedaptinvoice.appointment_id }
                $http({
                    method: 'POST',
                    data: dtlid,
                    url: 'http://166.62.84.37/PetzCareWSQA/Appointments.svc/GetGroomingAppointmentServicesById',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {

                    var len = response.length;
                    for (var i = 0; i < len; i++) {
                        mine1[i] = _.pick(JSON.parse(JSON.stringify(response[i])), 'service_type_name', 'chargaeble_days', 'service_rate', 'pet_name','pet_id');
                    }

                    $scope.viein = mine1;
                    var amount1 = _.pluck(mine1, 'service_rate');
                    for (var i = 0; i < $scope.viein.length; i++) {
                        $scope.totalAmout += amount1[i];
                    }
                    
                    $scope.NetAmount = $scope.totalAmout;
                    $scope.adtnlser = function () {
                        $scope.viein.push({
                            "pet_name": "",
                            "chargaeble_days": $scope.duratin,
                            "service_rate": $scope.rates,
                            "service_type_name": $scope.selectedpservc.service_name
                        });
                    };

                });

            }
           
        };
        $scope.NetAmount = $scope.totalAmout;
        $scope.sTaxCalculater = function () {           
            $scope.taxamt = ($scope.selectedtax.ld_name / 100) * $scope.totalAmout;               
            $scope.maintotal = $scope.taxamt + $scope.totalAmout;       
            $scope.NetAmount = $scope.maintotal;
        }

        $scope.percent = function () {
            var valu = $scope.disamt1;
            if (!$scope.disamt1) {
                $scope.disperst = 0;
                $scope.sdiscountCalculater();
            }                        
              
        };
     
       
        $scope.sdiscountCalculater = function () {
          
            if ($scope.disperst != 0) {
               
                $scope.disamt = (($scope.disperst / 100) * $scope.maintotal);                  
                $scope.NetAmount = $scope.maintotal - $scope.disamt;              
            }
            else if ($scope.disperst == 0) {
              
                $scope.disamt = 0;
                $scope.NetAmount = $scope.taxamt + $scope.totalAmout;
            }
        }
        var response44 = [];

        //Get All Pet Services

        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/PetServices.svc/GetAllServices',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {
            $scope.petservcs = response;
              
            $scope.petrates = function (){ 
                var rate = _.findWhere($scope.petservcs, { service_id: $scope.selectedpservc.service_id });
                $scope.rates = rate.service_rate;
                $scope.descs = rate.service_desc;
                $scope.petid = rate.pet_id;

                   
            };
        });

        function integertodate(invoice_date) {

            var res = invoice_date.substring(invoice_date.indexOf("(") + 1, invoice_date.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
        }
        function integertodate(appointment_date) {

            var res = appointment_date.substring(appointment_date.indexOf("(") + 1, appointment_date.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
        }


        //Service invoice generate datas
        $scope.getserinvoice = function (invno) {
            $scope.INVCno=invno;
            $http({
                method: 'POST',
                data: { "invoice_number": invno },
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
                $scope.seinvdainvc = response;
                console.log($scope.seinvdainvc);

            });

        };
           



        //ServiceInvoice Lists
        $scope.servcinvicdetl = [];
        $scope.appservcinvicdetl = [];
        var response1 = [];
        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/ServiceInvoice.svc/GetAllServiceInvoiceLists',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {
            $scope.servcinvicdetl = response;
           
            for (var j = 0; j < $scope.servcinvicdetl.length; j++) {
                if ($scope.servcinvicdetl[j].status_name == "Completed") {
                    response1.push($scope.servcinvicdetl[j]);

                }
            }
           
            $scope.appservcinvicdetl = response1;         
           

        });

        $scope.ServiceInvoice = function () {
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/ServiceInvoice.svc/GetAllServiceInvoiceLists',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                $scope.servcinvicdetl = response;

                for (var j = 0; j < $scope.servcinvicdetl.length; j++) {
                    if ($scope.servcinvicdetl[j].status_name == "Completed") {
                        response1.push($scope.servcinvicdetl[j]);

                    }
                }

                $scope.appservcinvicdetl = response1;

            });
        };

        //Sorting
        $scope.ServiceinvoiceSort = function (asc, header) {

            if (asc) {
                $scope.servcinvicdetl.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.servcinvicdetl.sort(predicatByDes(header));

            }
            if (asc) {
                $scope.appservcinvicdetl.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.appservcinvicdetl.sort(predicatByDes(header));

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
        console.log($scope.selin);
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
          
            if ($scope.selin == 'Invoicelist') {
                if ($scope.find) {
                    var sevicefilters = $filter('filter')($scope.servcinvicdetl, $scope.find);
                    return Math.ceil(sevicefilters.length / $scope.itemsPerPage) - 1;
                }
                else if (!$scope.find) {
                    return Math.ceil($scope.servcinvicdetl.length / $scope.itemsPerPage) - 1;
                }
            }
            else if ($scope.selin == 'Appointmentlist')
            if ($scope.find) {
                var filtereddata1 = $filter('filter')($scope.appservcinvicdetl, $scope.find);
                return Math.ceil(filtereddata1.length / $scope.itemsPerPage) - 1;
            }
            else if (!$scope.find) {

                return Math.ceil($scope.appservcinvicdetl.length / $scope.itemsPerPage) - 1;
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


       
        //PDF Email
        $scope.ConfrmEmail = function () {
            console.log($scope.INVCno);
            $http({
                method: 'POST',
                data: { "invoice_number": $scope.INVCno },
                url: ' http://166.62.84.37/PetzCareWSQA/ServiceInvoice.svc/ServiceInvoiceReportSendPDFEmail',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                if (response == true) {                   
                    alert("Invoice mail sent successfully");
                }

            });



        };


        $scope.refresserviceInvoice = function ()
        {
            $scope.submitted = false;
        $scope.viein = [];
        $scope.f1.selectedPaysts1 = "";
        $scope.disperst = "";
        $scope.selectedcunaminc = "";
        $scope.disamt = "";
        $scope.discoUNTperst = "";
        $scope.totalAmout = "";
        $scope.srcedate = "";
        $scope.maintotal = "";
        $scope.disamt1 = "";
        $scope.selectedpetinvoice = "";
        $scope.says = "";
        $scope.selectedPaytype = "";
        $scope.taxamt = "";
        $scope.selectedtax = "";
        $scope.maintotal = "";
        $scope.NetAmount = 0;
        $scope.selectedaptinvoice = "";
        $scope.selectedPaytype = "";
      
    }
        //Add service Invoice
     
        $scope.newservcinvce = function () {
            $scope.submitted = true;
            var timestamp = Number(new Date());
            $scope.srcedate = "\/Date(" + timestamp + ")\/";
            $scope.says = Number($scope.f1.selectedPaysts1);
            $scope.discoUNTperst = Number($scope.disperst);
           
            $scope.appoindata = {
             
    "ServiceInHeaderEntity": {
        "created_by": 1,
        "created_date":$scope.srcedate,
        "customer_id":$scope.selectedcunaminc,
        "discount_amount": $scope.disamt,
        "discount_percent": $scope.discoUNTperst,
        "gross_amount":$scope.totalAmout,
        "invoice_date":$scope.srcedate ,
        "is_deleted": "n",
        "is_printed": "n",
        "modified_by":1,
        "modified_date":$scope.srcedate,
        "notes":"welcome",
        "outstanding_amount":0,
        "paid_amount": $scope.NetAmount,
        "payment_statusid": $scope.says,
        "payment_typeid":$scope.selectedPaytype,
        "tax_amount": $scope.taxamt,
        "tax_percentid":$scope.selectedtax.ld_id,
        "total_amount": $scope.NetAmount,
        "pet_id": $scope.viein[0].pet_id,
        "appointment_id":$scope.selectedaptinvoice.appointment_id,
        "appointment_name":$scope.selectedaptinvoice.appointment_name
    },
                    "ServiceInDetailEntity": [
                            {
                                "created_by": 1,
                                "created_date":$scope.srcedate,
                                "is_deleted": "n",
                                "modified_by":1,
                                "modified_date":$scope.srcedate,
                                "notes":"welcome",
                                "service_id":0
                            }
                    ]
                }
                  
            if (!$scope.invoiceForm.$invalid) {

                $http({
                    method: 'POST',
                    data: $scope.appoindata,
                    url: 'http://166.62.84.37/PetzCareWSQA/ServiceInvoice.svc/AddServiceInvoice',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response.AddResult == true) {
                        $scope.ServiceInvoice();
                        //$scope.selectedcunaminc = "";
                        //$scope.disamt = "";
                        //$scope.discoUNTperst = "";
                        //$scope.totalAmout = "";
                        //$scope.srcedate = "";
                        //$scope.maintotal = "";
                        //$scope.says = "";
                        //$scope.selectedPaytype = "";
                        //$scope.taxamt = "";
                        //$scope.selectedtax.ld_id = "";
                        //$scope.maintotal = "";
                        //$scope.viein[0].pet_id = "";
                        //$scope.selectedaptinvoice.appointment_id = "";
                        //$scope.selectedaptinvoice.appointment_name = "";
                        alert("Service invoice created successfully");
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