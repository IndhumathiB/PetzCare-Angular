using PetzCareEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;

namespace PetzCareSP.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            if (Session["UserName"] == null)
            {
                return RedirectToAction("SignIn", "LogIn");
            }
            else
            {
                ViewBag.UserName = Session["UserName"].ToString();
                UserAuthorizationEntity userAuthInfo = (UserAuthorizationEntity)Session["UserRoleInfo"];
               // ViewBag.Role = Session["Role"].ToString();
                ViewBag.EmployeeId = userAuthInfo.employee_id;
                ViewBag.UserId = userAuthInfo.user_id;
                ViewBag.AuthPermissions = userAuthInfo.RoleAuthorization;
                return View();
            }
        }

        public ActionResult Dashboard()
        {
            return View();
        }

        public ActionResult ManageUsers()
        {
            return PartialView();
        }

        public ActionResult RoleAuthorization()
        {
            return PartialView();
        }

        public ActionResult UserRoleAuthorization()
        {
            return PartialView();
        }
        public ActionResult UserRoleMap()
        {
            return PartialView();
        }
        public ActionResult Customers()
        {
            return PartialView();
        }

        public ActionResult Settings()
        {
            return PartialView();
        }
        public ActionResult Appointments()
        {
            return PartialView();
        }
        public ActionResult ProductInvoice()
        {
            return PartialView();
        }
        public ActionResult ServiceInvoice()
        {
            return PartialView();
        }
        public ActionResult ManageServices()
        {
            return PartialView();
        }
        public ActionResult ManageProducts()
        {
            return PartialView();
        }
        public ActionResult ManageCompany()
        {
            return PartialView();
        }

        public ActionResult LogOut()
        {
             Session.RemoveAll();

            if (Session["UserName"] == null)
            {
              //  Page.ClientScript.RegisterStartupScript(this.GetType(), "cle", "windows.history.clear", true); 

                return RedirectToAction("SignIn", "LogIn");
            }
            else
            {
               // ViewBag.UserName = Session["UserName"].ToString();
               // ViewBag.Role = Session["Role"].ToString();
               // ViewBag.EmployeeId = Convert.ToInt16(Session["UserId"]);
                return RedirectToAction("Index", "Home");
            }    
        }
    }
}
