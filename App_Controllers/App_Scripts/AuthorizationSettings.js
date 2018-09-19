function ApplyAuthorization(AuthSettings) {
    for (var iterateAuth = 0; iterateAuth < AuthSettings.length; iterateAuth++) {

        if (AuthSettings[iterateAuth].authorization_name == "ManageUsers") {

            var sctualValue = document.getElementById("manageUser").style.pointerEvents;

            if (sctualValue != "visible") {

                document.getElementById("manageUser").style.pointerEvents = "visible";
                $('#manageUser').css('color', '');
            }
        }
        else if (AuthSettings[iterateAuth].authorization_name == "ManageCustomers") {

            var sctualValue = document.getElementById("manangeCustomer").style.pointerEvents;

            if (sctualValue != "visible") {

                document.getElementById("manangeCustomer").style.pointerEvents = "visible";
                $('#manangeCustomer').css('color', '');
            }
       }
        else if (AuthSettings[iterateAuth].authorization_name == "Appointments") {

            var sctualValue = document.getElementById("appointments").style.pointerEvents;

           if (sctualValue != "visible") {

               document.getElementById("appointments").style.pointerEvents = "visible";
               $('#appointments').css('color', '');
           }
       }
        else if (AuthSettings[iterateAuth].authorization_name == "ManageServices") {

            var sctualValue = document.getElementById("manangeService").style.pointerEvents;

           if (sctualValue != "visible") {

               document.getElementById("manangeService").style.pointerEvents = "visible";
               $('#manangeService').css('color', '');
           }
       }
        else if (AuthSettings[iterateAuth].authorization_name == "ManageProducts") {

            var sctualValue = document.getElementById("manangeProduct").style.pointerEvents;

           if (sctualValue != "visible") {

               document.getElementById("manangeProduct").style.pointerEvents = "visible";
               $('#manangeProduct').css('color', '');
           }
        }
        else if (AuthSettings[iterateAuth].authorization_name == "ManageCompany") {

            var sctualValue = document.getElementById("manangeCompany").style.pointerEvents;

            if (sctualValue != "visible") {

                document.getElementById("manangeCompany").style.pointerEvents = "visible";
                $('#manangeCompany').css('color', '');
            }
        }
        else if (AuthSettings[iterateAuth].authorization_name == "ServiceInvoice") {

            var sctualValue = document.getElementById("serviceInvoice").style.pointerEvents;

           if (sctualValue != "visible") {

               document.getElementById("serviceInvoice").style.pointerEvents = "visible";
               $('#serviceInvoice').css('color', '');
           }
       }
        else if (AuthSettings[iterateAuth].authorization_name == "ProductInvoice") {

            var sctualValue = document.getElementById("productInvoice").style.pointerEvents;

           if (sctualValue != "visible") {

               document.getElementById("productInvoice").style.pointerEvents = "visible";
               $('#productInvoice').css('color', '');
           }
       }
        else if (AuthSettings[iterateAuth].authorization_name == "Settings") {

            var sctualValue = document.getElementById("settings").style.pointerEvents;

           if (sctualValue != "visible") {

               document.getElementById("settings").style.pointerEvents = "visible";
               $('#settings').css('color', '');
           }
       }
        else if (AuthSettings[iterateAuth].authorization_name == "RoleAuthorizationMapping") {

            var sctualValue = document.getElementById("roleAuth").style.pointerEvents;

           if (sctualValue != "visible") {

               document.getElementById("roleAuth").style.pointerEvents = "visible";
               $('#roleAuth').css('color', '');
           }
        }
        else if (AuthSettings[iterateAuth].authorization_name == "UserAuthorizationMapping") {

            var sctualValue = document.getElementById("userAuth").style.pointerEvents;

            if (sctualValue != "visible") {

                document.getElementById("userAuth").style.pointerEvents = "visible";
                $('#userAuth').css('color', '');
            }
        }
        else if (AuthSettings[iterateAuth].authorization_name == "UserRoleMapping") {

            var sctualValue = document.getElementById("userRole").style.pointerEvents;

            if (sctualValue != "visible") {

                document.getElementById("userRole").style.pointerEvents = "visible";
                $('#userRole').css('color', '');
            }
        }

    }
}