var app = angular.module('petzCareSP',
  ['ngRoute','daterangepicker', 'petzCareSP.MainController', 'petzCareSP.DashboardController', 'petzCareSP.ManageUsersController', 'petzCareSP.ManageRoleAuthController', 'petzCareSP.ManageUserRoleController', 'petzCareSP.ManageCustomerController', 'petzCareSP.AppointmentsController', 'petzCareSP.ServiceInvoiceController', 'petzCareSP.ProductInvoiceController', 'petzCareSP.UserRoleMapController', 'petzCareSP.ManageServicesController', 'petzCareSP.ManageProductsController', 'petzCareSP.ManageCompanyController']);

app.config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
   .when('/', {
       templateUrl: '/PetzCareSPQA/LogIn/SignIn',
       controller: 'SignInController'
   })
     .when('/Dashboard', {
         templateUrl: '/PetzCareSPQA/Home/Dashboard',
         controller: 'DashboardController'
     })
    .when('/ManageUsers', {
        templateUrl: '/PetzCareSPQA/Home/ManageUsers',
           controller: 'ManageUsersController'
    })
    .when('/Home', {
        templateUrl: '/PetzCareSPQA/Home/Index',
        controller: 'MainController'
    })
    .when('/RoleAuth', {
        templateUrl: '/PetzCareSPQA/Home/RoleAuthorization',
        controller: 'ManageRoleAuthController'
    })
    .when('/UserRole', {
        templateUrl: '/PetzCareSPQA/Home/UserRoleAuthorization',
        controller: 'ManageUserRoleController'
    })
     .when('/UserRoleMap', {
         templateUrl: '/PetzCareSPQA/Home/UserRoleMap',
         controller: 'UserRoleMapController'
     })
    .when('/Customers', {
        templateUrl: '/PetzCareSPQA/Home/Customers',
        controller: 'ManageCustomerController'
    })
    .when('/Settings', {
        templateUrl: '/PetzCareSPQA/Home/Settings',
        controller: 'MainController'
    })
     .when('/Appointments', {
         templateUrl: '/PetzCareSPQA/Home/Appointments',
         controller: 'AppointmentsController'
     })
     .when('/ProductInvoice', {
         templateUrl: '/PetzCareSPQA/Home/ProductInvoice',
         controller: 'ProductInvoiceController'
     })
      .when('/ServiceInvoice', {
          templateUrl: '/PetzCareSPQA/Home/ServiceInvoice',
        controller: 'ServiceInvoiceController'
      })
       .when('/ManageServices', {
           templateUrl: '/PetzCareSPQA/Home/ManageServices',
           controller: 'ManageServicesController'
      })
       .when('/ManageProducts', {
           templateUrl: '/PetzCareSPQA/Home/ManageProducts',
           controller: 'ManageProductsController'
      })
       .when('/ManageCompany', {
           templateUrl: '/PetzCareSPQA/Home/ManageCompany',
           controller: 'ManageCompanyController'
         })
        .when('/Logout', {
            templateUrl: '/PetzCareSPQA/Home/LogOut',
        })

        .otherwise({
        redirectTo: '/',
    });

    //$locationProvider.html5Mode({
    //    enabled: true,
    //    requireBase: false
    //});

}]);
