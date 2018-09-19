(function () {
    'use strict';
    var app = angular.module('petzCareSP.ProductInvoiceController', []);
    app.controller('ProductInvoiceController', ['$scope', '$http', '$location', '$filter','$rootScope', '$timeout', ProductInvoiceController]);

    function ProductInvoiceController($scope, $http, $location, $filter, $rootScope, $timeout) {
        $scope.submitted = false;
        angular.element('#productInvoiceloader').css('display', 'block');
        var timestamp = Number(new Date());
        $scope.prcedate = "\/Date(" + timestamp + ")\/";
        $scope.f2 = {};
        $rootScope.subTotal = 0;
        //ProductInvoice lists
        $scope.prdctinvicdetl = [];
        setTimeout(function(){

        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/ProductInvoice.svc/GetAllProductInvoiceList',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {

            $scope.prdctinvicdetl = response;
            console.log($scope.prdctinvicdetl);

        })
            .finally(function () {
                angular.element('#productInvoiceloader').css('display', 'none');
            });
        }, 2000);

        $scope.reloadProductInvoice = function () {
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/ProductInvoice.svc/GetAllProductInvoiceList',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {

                $scope.prdctinvicdetl = response;


            });
        };

        //Close modals
        $scope.CloseModal = function () {
            $('#generateID').modal('hide');
           
        }

        //Sorting
        $scope.ProductinvoiceSort = function (asc, header) {

            if (asc) {
                $scope.prdctinvicdetl.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.prdctinvicdetl.sort(predicatByDes(header));

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
        $scope.svalues = [10, 25, 50];
       
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
                
                if ($scope.qury) {
                   
                    var searched = $filter('filter')($scope.prdctinvicdetl, $scope.qury);
                    return Math.ceil(searched.length / $scope.itemsPerPage) - 1;
                }
                else if (!$scope.qury) {
                    return Math.ceil($scope.prdctinvicdetl.length / $scope.itemsPerPage) - 1;
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


       


        var tax2 = [];
        var Paytype2 = [];
        var Paystatus2 = [];

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
                    tax2.push(data[i]);

                }
                if (data[i].lm_name == 'Payment Type') {
                    Paytype2.push(data[i]);

                }
                if (data[i].lm_name == 'Payment Status') {
                    Paystatus2.push(data[i]);

                }



            }

            $scope.taxAmount = tax2;
            console.log($scope.taxAmount);
            $scope.Paytype11 = Paytype2;
            $scope.Paystatus11 = Paystatus2;
            console.log($scope.Paystatus11);



        });


     

        //All Customers
           

        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/Customer.svc/GetAllCustomers',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (response) {

            $scope.custprcinvcs = response;
              
                
        });
      

        function integertodate(invoice_date) {

            var res = invoice_date.substring(invoice_date.indexOf("(") + 1, invoice_date.lastIndexOf(")"));

            var myDate = new Date(parseInt(res));
            return myDate.toLocaleString();
        }

        //Productinvoicegeneratedatas

        $scope.getprcinvoice = function (pinvno) {
           
           
            $http({
                method: 'POST',
                data: { "invoice_number": pinvno },
                url: 'http://166.62.84.37/PetzCareWSQA/ProductInvoice.svc/GetProductInvoiceReport',
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
                    var pickdates = integertodate(roleMapping[j].invoice_date);
                    var Dates = pickdates.split(",");
                    roleMapping[j].invoice_date = Dates[0];

                }
                $scope.pcinvdaTA = response;
               
              

            });

        };

        //Add product
        
        $scope.pRoducts = [];
        var subTotal1 = 0;
        

        $scope.adProduct = function () {           
            $rootScope.subTotal = 0;            
            var timestamp = Number(new Date());
            $scope.prcedate = "\/Date(" + timestamp + ")\/";
           
            
            $scope.pRoducts.push({
                "created_by": 2,
                "created_date":$scope.prcedate,
                "invoice_amount": ($scope.pRorate * $scope.pquants),
                "is_deleted": "n",
                "modified_by": 2,
                "modified_date":$scope.prcedate,
                "notes": $scope.descrip,
                "product_id": $scope.selectedpdatas.product_id,
                "quantity": $scope.pquants,
                "rate" : $scope.pRorate
              
               
            });
            $scope.selectedpdatas = $scope.viewprdctdatas;
            var ratesvalue = $scope.pRorate * $scope.pquants;          
            subTotal1 = subTotal1 + ratesvalue;
            $rootScope.subTotal = subTotal1;
            $scope.NetAmount = subTotal1;

        $scope.selectedpdatas.product_name = "";
        $scope.pquants = "";
        $scope.pRorate = "";
        $scope.descrip = "";
       
      
    };
        $scope.NetAmount = subTotal1;
        $scope.TaxCalculater = function () {          
            $scope.taxvalue = ($scope.prcttax.ld_name / 100) * $rootScope.subTotal;         
            $scope.grosstotal = $scope.taxvalue + $rootScope.subTotal;          
            $scope.NetAmount = $scope.grosstotal;
        }

        $scope.propercent = function () {
            var valu = $scope.prtdis;
            if (!$scope.prtdis) {
                $scope.prodisperst = 0;
                $scope.discountCalculater();
            }

        };
        $scope.discountCalculater = function () {
            if ($scope.prodisperst != 0) {             
                $scope.discuntval = ($scope.prodisperst / 100) * $scope.grosstotal;
                $scope.NetAmount = $scope.grosstotal - $scope.discuntval;               
            }
            else {
                $scope.discuntval = 0;
                $scope.NetAmount = $scope.taxvalue + $rootScope.subTotal;
            }

        }


        $scope.refresProductInvoice = function () {                    
            $scope.submitted = false;
            $scope.NetAmount = 0;
            $rootScope.subTotal = 0;
            subTotal1 = 0;
            $scope.prodisperst = "";
            $scope.f2.selectedPays = "";
            $scope.selectedcunampdtinc = "";
            $scope.discuntval = "";
            $scope.prodisperst = "";
            $rootScope.subTotal = "";
            $scope.prcedate = "";
            $scope.descrip = "";
            $scope.grosstotal = "";
            $scope.pays = "";
            $scope.selectedPaypdtintype = "";
            $scope.taxvalue = "";
            $scope.prcttax = "";
            $scope.prcttax = "";
            $scope.prtdis = "";
            $scope.pRorate = "";
            $scope.selectedpdatas = "";
            $scope.pRoducts = [];
        };

       
        //Add service Invoice
        var pRESult = [];
     
        $scope.newProductinvce = function () {
            var timestamp = Number(new Date());
            $scope.prcedate = "\/Date(" + timestamp + ")\/";
            $scope.submitted = true;
            $scope.pays = Number($scope.f2.selectedPays);      
            
            $scope.prodisperst1 = Number($scope.prodisperst);

            for (var iterate = 0; iterate < $scope.pRoducts.length; iterate++) {

                pRESult.push(_.omit($scope.pRoducts[iterate], 'rate'));

            }
            $scope.poductS = pRESult;

            $scope.appoindata =
            {
                "ProductInEntity": {
                    "created_by": 2,
                    "created_date": $scope.prcedate,
                    "customer_id": $scope.selectedcunampdtinc,
                    "discount_amount": $scope.discuntval,
                    "discount_percent": $scope.prodisperst1,
                    "gross_amount": $rootScope.subTotal,
                    "invoice_date": $scope.prcedate,
                    "is_deleted": "n",
                    "is_printed": "n",
                    "modified_by": 2,
                    "modified_date": $scope.prcedate,
                    "notes": $scope.descrip,
                    "outstanding_amount": 0,
                    "paid_amount": $scope.NetAmount,
                    "payment_statusid": $scope.pays,
                    "payment_typeid": $scope.selectedPaypdtintype,
                    "tax_amount": $scope.taxvalue,
                    "tax_percentid": $scope.prcttax.ld_id,
                    "total_amount": $scope.NetAmount
                },
                "ProductInDetailEntity": $scope.poductS

            }
            


            if (!$scope.ProductInvoiceForm.$invalid && !$scope.ProdtInvoiceform.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.appoindata,
                    url: 'http://166.62.84.37/PetzCareWSQA/ProductInvoice.svc/AddProductInvoice',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {

                    if (response.AddResult == true) {
                        $scope.reloadProductInvoice();
                        //$scope.pRoducts = [];
                        //$scope.f2.selectedPays = "";
                        //$scope.selectedcunampdtinc = "";
                        //$scope.prtdis = "";
                        //$scope.discuntval = "";
                        //$scope.prodisperst = "";
                        //$scope.subTotal = "";
                        //$scope.prcedate = "";
                        //$scope.Mainval = "";
                        //$scope.pays = "";
                        //$scope.selectedPaypdtintype = "";
                        //$scope.taxvalue = "";
                        //$scope.prcttax.ld_name = "";
                        //$scope.grosstotal = "";

                        alert("Productinvoice created successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                    }
                }).error(function (response) {
                    $scope.error = response.message;
                });

            }

        };



             
      


        





        //Get view details

        var responseprdt = [];

        $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/Product.svc/GetAllProducts',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {

              
                $scope.viewprdctdatas = response;
             
                $scope.viewprdctdats = function () {
                    var responseprdt = _.findWhere($scope.viewprdctdatas, { product_id: $scope.selectedpdatas.product_id });
                    $scope.descrip = responseprdt.product_desc;
                    $scope.pRorate = responseprdt.retail_cost;
               
                };
            });


 





    };

    // Pagination filter
    app.filter('pagination', function () {
        return function (input, start) {
            start = parseInt(start, 10);
            return input.slice(start);
        };
    });
})();