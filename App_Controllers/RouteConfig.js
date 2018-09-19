var app = angular.module('petzCareSP',
  ['ngRoute','daterangepicker', 'petzCareSP.MainController', 'petzCareSP.DashboardController', 'petzCareSP.ManageUsersController', 'petzCareSP.ManageRoleAuthController', 'petzCareSP.ManageUserRoleController', 'petzCareSP.ManageCustomerController', 'petzCareSP.AppointmentsController', 'petzCareSP.ServiceInvoiceController', 'petzCareSP.ProductInvoiceController', 'petzCareSP.UserRoleMapController', 'petzCareSP.ManageServicesController', 'petzCareSP.ManageProductsController', 'petzCareSP.ManageCompanyController']);

app.config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
   .when('/', {
       templateUrl: '/LogIn/SignIn',
       controller: 'SignInController'
   })
     .when('/Dashboard', {
         templateUrl: '/Home/Dashboard',
         controller: 'DashboardController'
     })
    .when('/ManageUsers', {
        templateUrl: '/Home/ManageUsers',
           controller: 'ManageUsersController'
    })
    .when('/Home', {
        templateUrl: '/Home/Index',
        controller: 'MainController'
    })
    .when('/RoleAuth', {
        templateUrl: '/Home/RoleAuthorization',
        controller: 'ManageRoleAuthController'
    })
    .when('/UserRole', {
        templateUrl: '/Home/UserRoleAuthorization',
        controller: 'ManageUserRoleController'
    })
     .when('/UserRoleMap', {
         templateUrl: '/Home/UserRoleMap',
         controller: 'UserRoleMapController'
     })
    .when('/Customers', {
        templateUrl: '/Home/Customers',
        controller: 'ManageCustomerController'
    })
    .when('/Settings', {
        templateUrl: '/Home/Settings',
        controller: 'MainController'
    })
     .when('/Appointments', {
         templateUrl: '/Home/Appointments',
         controller: 'AppointmentsController'
     })
     .when('/ProductInvoice', {
         templateUrl: '/Home/ProductInvoice',
         controller: 'ProductInvoiceController'
     })
      .when('/ServiceInvoice', {
          templateUrl: '/Home/ServiceInvoice',
        controller: 'ServiceInvoiceController'
      })
       .when('/ManageServices', {
           templateUrl: '/Home/ManageServices',
           controller: 'ManageServicesController'
      })
       .when('/ManageProducts', {
           templateUrl: '/Home/ManageProducts',
           controller: 'ManageProductsController'
      })
       .when('/ManageCompany', {
           templateUrl: '/Home/ManageCompany',
           controller: 'ManageCompanyController'
         })
        .when('/Logout', {
            templateUrl: '/Home/LogOut',
        })

        .otherwise({
        redirectTo: '/',
    });

    //$locationProvider.html5Mode({
    //    enabled: true,
    //    requireBase: false
    //});

}]);
