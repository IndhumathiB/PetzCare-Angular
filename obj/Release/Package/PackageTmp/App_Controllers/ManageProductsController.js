(function () {
    'use strict';
    var app = angular.module('petzCareSP.ManageProductsController', []);
    app.controller('ManageProductsController', ['$scope', '$http', '$location', '$rootScope', '$filter', '$timeout', ManageProductsController]);

    function ManageProductsController($scope, $http, $location, $rootScope, $filter, $timeout) {
        $scope.submitted = false;
        angular.element('#manageProductsloader').css('display', 'Block');
        $scope.ProductsLists = [];
        setTimeout(function () { 
      
        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/Product.svc/GetAllProducts',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (data) {

            $scope.ProductsLists = data;           

            })
                .finally(function(){
                    angular.element('#manageProductsloader').css('display','none');
                });
        },2000);


        $scope.ProductDatas = function () {
            $http({
                method: 'GET',
                url: 'http://166.62.84.37/PetzCareWSQA/Product.svc/GetAllProducts',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (data) {

                $scope.ProductsLists = data;

            });
        };


        //Close modals
        $scope.CloseModal = function () {
            $('#myModal').modal('hide');
            $('#productID').modal('hide');
           }

        //Sorting
        $scope.ManageproductSort = function (asc, header) {

            if (asc) {
                $scope.ProductsLists.sort(predicatByAsc(header));

            }
            if (!asc) {
                $scope.ProductsLists.sort(predicatByDes(header));

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


        //Refresh
        $scope.ClearProductdatas = function () {
            $scope.submitted = false;
            $scope.batchno = "";
            $scope.pronotes = "";
            $scope.producid = "";
            $scope.producost = "";
            $scope.prdudesc = "";
            $scope.prname = "";
            $scope.prduqty = "";
            $scope.reordrqty = "";
            $scope.retilcost = "";
            $scope.prducseno = "";
            $scope.selectedcompany = "";
            $scope.imagedata = {};
            $scope.imk = {};
            $scope.imagename = {};
            f = {};
            r = {};
            document.getElementById('file').value = '';
          
        };

        $scope.ClearUpdateProductdatas = function () {
            $scope.submitted = false;
        };


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
                
                if ($scope.findproduct) {
                    var filtereddata = $filter('filter')($scope.ProductsLists, $scope.findproduct);
                    return Math.ceil(filtereddata.length / $scope.itemsPerPage) - 1;
                }
                else if (!$scope.findproduct) {
                    return Math.ceil($scope.ProductsLists.length / $scope.itemsPerPage) - 1;
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

       
       
         
               


        $scope.CompanyFilter = function (productID) {
            $scope.Upproductid = productID;
            $rootScope.Products = true;
            $rootScope.Upproductid11 = productID;
          
            $http({
                method: 'POST',
                data: { "product_id": $rootScope.Upproductid11 },
                url: 'http://166.62.84.37/PetzCareWSQA/Product.svc/GetProductById',
                headers: {
                    "Content-Type": 'application/json',
                }
            }).success(function (response) {
                $rootScope.Products = false;
                $rootScope.uPbatchno = response[0].batch_no;             
                $rootScope.uPpronotes = response[0].notes;
                $rootScope.uPproducid = response[0].product_code;
                $rootScope.uPproducost = response[0].product_cost;
                $rootScope.uPprdudesc = response[0].product_desc;
                $rootScope.uPprname = response[0].product_name;
                $rootScope.uPprduqty = response[0].quantity;
                $rootScope.uPreordrqty = response[0].reorder_quantity;
                $rootScope.uPretilcost = response[0].retail_cost;
                $rootScope.uPprducseno = response[0].serial_no;
                $rootScope.uPselectedcompany = response[0].vendor_id;
                $scope.productValues = response[0];
               

            });
        };

      

        $http({
            method: 'GET',
            url: 'http://166.62.84.37/PetzCareWSQA/Company.svc/GetAllCompanies',
            headers: {
                "Content-Type": 'application/json',
            }
        }).success(function (data) {
          
            $scope.vendorlist = data;
         

        });




        var timestamp = Number(new Date());
        $scope.prducdate = "\/Date(" + timestamp + ")\/";
       
        //Add product photo

      
        //$scope.addproducphoto = function () {

           
        //}

        var f, r;
        $scope.AddProduct = function () {
            $scope.submitted = true;
            var f = document.getElementById('file').files[0],
           r = new FileReader();
            r.onloadend = function (e) {
                $scope.imagedata = e.target.result;
            }
            r.readAsDataURL(f);
            $scope.retilcost11 = Number($scope.retilcost);
            $scope.reordrqty11 = Number($scope.reordrqty);
            $scope.producost11 = Number($scope.producost);
            $scope.prduqty11 = Number($scope.prduqty);
           
          
            $scope.datas = {
                "created_by": 2,
                "created_date":$scope.prducdate,
                "batch_no":$scope.batchno,
                "is_deleted": "n",
                "modified_by": 2,
                "modified_date": $scope.prducdate,
                "notes":$scope.pronotes,
                "product_code":$scope.producid,
                "product_cost":$scope.producost11,
                "product_desc":$scope.prdudesc,
                "product_name":$scope.prname,
                "quantity":$scope.prduqty11,
                "reorder_quantity":$scope.reordrqty11,
                "retail_cost":$scope.retilcost11,
                "serial_no":$scope.prducseno,
                "vendor_id": $scope.selectedcompany,
                "file_data": $scope.imagedata || ""
            }
            if (!$scope.NewManageProductsForm.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.datas,
                    url: 'http://166.62.84.37/PetzCareWSQA/Product.svc/AddProduct',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {
                        $scope.ProductDatas();
                        //$scope.batchno = "";
                        //$scope.pronotes = "";
                        //$scope.producid = "";
                        //$scope.producost = "";
                        //$scope.prdudesc = "";
                        //$scope.prname = "";
                        //$scope.prduqty = "";
                        //$scope.reordrqty = "";
                        //$scope.retilcost = "";
                        //$scope.prducseno = "";
                        //$scope.selectedcompany = "";
                        alert("Product added successfully");
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                    }
                });
            }
        };

        
        $scope.UpdateProduct = function () {
            $scope.submitted = true;
            $scope.prducseno22 = Number($scope.uPprducseno);
            $scope.retilcost22 = Number($scope.uPretilcost);
            $scope.reordrqty22 = Number($scope.uPreordrqty);
            $scope.producost22 = Number($scope.uPproducost);
            $scope.prduqty22 = Number($scope.uPprduqty);
            $scope.producid22 = Number($scope.uPproducid);
            $scope.batchno22 = Number($scope.uPbatchno);
            $scope.datas = {
                "batch_no": $scope.batchno22,
                "is_deleted": "n",
                "modified_by": 2,
                "modified_date": $scope.prducdate,
                "notes": $scope.uPpronotes,
                "product_code": $scope.producid22,
                "product_cost": $scope.producost22,
                "product_desc": $scope.uPprdudesc,
                "product_name": $scope.uPprname,
                "quantity": $scope.prduqty22,
                "reorder_quantity": $scope.reordrqty22,
                "retail_cost": $scope.retilcost22,
                "serial_no": $scope.prducseno22,
                "vendor_id": $scope.uPselectedcompany,
                "product_id": $rootScope.Upproductid11
            }
            if (!$scope.ManageProductForm.$invalid) {
                $http({
                    method: 'POST',
                    data: $scope.datas,
                    url: 'http://166.62.84.37/PetzCareWSQA/Product.svc/UpdateProduct',
                    headers: {
                        "Content-Type": 'application/json',
                    }
                }).success(function (response) {
                    if (response == true) {

                        //$scope.uPbatchno = "";
                        //$scope.uPpronotes = "";
                        //$scope.uPproducid = "";
                        //$scope.uPproducost = "";
                        //$scope.uPprdudesc = "";
                        //$scope.uPprname = "";
                        //$scope.uPprduqty = "";
                        //$scope.uPreordrqty = "";
                        //$scope.uPretilcost = "";
                        //$scope.uPprducseno = "";
                        //$scope.uPselectedcompany = "";
                        //$rootScope.Upproductid11 = "";
                        alert("Product updated successfully");
                        $scope.ProductDatas();
                        $timeout(function () { $scope.CloseModal(); }, 1000);
                    }
                });

            };

        }
        //Delete Products
        $scope.productsdelete = function (proid, Prindexvalue) {
            console.log(proid);
           
            $scope.DeltData = {
                "is_deleted": "Y",
                "modified_by":2,
                "modified_date":$scope.prducdate,
                "product_id": proid
            }

            var Delete = confirm("Are You Sure.You Want to delete?");
            if (Delete == true) {
            $http.post("http://166.62.84.37/PetzCareWSQA/Product.svc/DeleteProduct", $scope.DeltData).success(function (response) {
                if (response == true) {
                    $scope.ProductDatas();
                    $scope.ProductsLists.splice(Prindexvalue, 1);
                   // alert("Product deleted successfully");
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