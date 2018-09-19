using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization;
using System.Text;
using System.Web;
using System.Web.Mvc;
using PetzCareEntities;
using System.Web.Script.Serialization;
using PetzCareSP.Models;
using System.Web.Security;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

namespace PetzCareSP.Controllers
{
    public class LogInController : Controller
    {
        //
        // GET: /LogIn/

        public ActionResult SignIn()       
        {
            SignIn defaultmodelbinding=new SignIn();
            ViewBag.error = TempData["error"] ;
            return View(defaultmodelbinding);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult LoggedIn(SignIn model)
        {            
            bool validateUser = SignInPost(model);

           if (validateUser)
           {
               return RedirectToAction("Index", "Home");
           }
           else
           {
               //return View();
               return RedirectToAction("SignIn", "LogIn");
               //ModelState.AddModelError()
           }
        }
        /// <summary>
        ///Rest loggin method evalution by sign In the user 
        /// </summary>
        bool SignInPost(SignIn model)
        
        
{
            Session["UserCookie"] = null;
            bool result = false;
            string URL = "http://166.62.84.37/PetzCareWS/LogInService.svc/LoginWebAuthorization";

             UserEntity userENT = new UserEntity()
             {                 
                 user_name = model.UserName,                 
                 password = model.Password
             };

            var data1 = new JavaScriptSerializer().Serialize(userENT);

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(URL);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.ContentLength = data1.Length;
            
            StreamWriter requestWriter = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.ASCII);
            requestWriter.Write(data1);
            requestWriter.Close();

            try
            {
                WebResponse webResponse = request.GetResponse();
                Stream webStream = webResponse.GetResponseStream();
                StreamReader responseReader = new StreamReader(webStream);
                //getResult = (List<UserAuthorizationEntity>)responseReader.ReadToEnd();
                string response =Convert.ToString(responseReader.ReadToEnd());

                UserAuthorizationEntity deserializedUserInfo = JsonConvert.DeserializeObject<UserAuthorizationEntity>(response);
                responseReader.Close();

               // string userCookie = string.Empty;
                if (deserializedUserInfo !=null)
                {
                    if (!string.IsNullOrEmpty(deserializedUserInfo.user_name))
                    {
                        string displayName = deserializedUserInfo.user_name;

                        if (deserializedUserInfo.RoleAuthorization.Count > 0)
                        {
                            displayName += " (" + deserializedUserInfo.RoleAuthorization[0].rolename + ")";
                        }
                        Session["UserName"] = string.Format("{0}", displayName);
                        Session["UserRoleInfo"] = deserializedUserInfo;
                        result = true;
                    }
                    else
                    {
                        TempData["error"] = "The email and password you entered don't match.";
                    }
                }
                
                                              
            }
            catch (Exception e)
            {
                Console.Out.WriteLine("-----------------");
                Console.Out.WriteLine(e.Message);
            }
            return result;
        }
        
         /// 
        ///SignUp--------------------------------------
        /// 
        
        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult SignUp(SignIn signUpModel)
        {
            bool validateUser = SignUpPost(signUpModel);

            return RedirectToAction("SignIn", "Login");         
        }

        private bool SignUpPost(SignIn signUpModel)
        {
            bool result = false;
            string URL = "http://166.62.84.37/PetzCareWS/LogInService.svc/SignUpByProvider";

            SignUpEntity signEnt = new SignUpEntity()
            {
                Title_id = signUpModel.Title,
                Company_id = 1,
                First_name = signUpModel.FirstName,
                Middle_name = signUpModel.MiddleName,
                Last_name = signUpModel.LastName,
                Employee_code = signUpModel.EmployeeCode,
                Designation_id = signUpModel.SelectDesignation,
                Department_id = signUpModel.SelectDepartment,
                Birth_date = signUpModel.DateOfBirth,
                Address_1 = signUpModel.PermanentAddress,
                Address_2 = signUpModel.TemporaryAddress,
                Country_id = signUpModel.Country,
                State_id = signUpModel.State,
                City_id = signUpModel.City,
                Zip_code = signUpModel.Zipcode.ToString(),
                Email_1 = signUpModel.EmailID,
                Fax_1 = signUpModel.Fax.ToString(),
                User_name=signUpModel.UserName,
                Password =signUpModel.Password,
                Sec_question = signUpModel.SecurityQuestions,
                Sec_answer = signUpModel.Answer,
              
            };
            
            var data1 = new JavaScriptSerializer().Serialize(signEnt); 
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(URL);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.ContentLength = data1.Length;
            StreamWriter requestWriter = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.ASCII);
            requestWriter.Write(data1);
            requestWriter.Close();

            try
            {
                WebResponse webResponse = request.GetResponse();
                Stream webStream = webResponse.GetResponseStream();
                StreamReader responseReader = new StreamReader(webStream);
                result = Convert.ToBoolean(responseReader.ReadToEnd());
                responseReader.Close();                                                          
            }
            catch (Exception e)
            {
                Console.Out.WriteLine("-----------------");
                Console.Out.WriteLine(e.Message);
            }
            return result;
        }             
                
        // ForgotPassword---------------------------------------------------------

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult ForgotPassword(SignIn ForgotModel)
        {        

            bool validateUser = ForgotPost(ForgotModel);

            return View();
        }

        bool ForgotPost(SignIn ForgotModel)
        {
            bool result = false;
            string URL = "http://166.62.84.37/PetzCareWS/LogInService.svc/ForgotPassword";

            UserEntity Users = new UserEntity()
            {
                user_name =ForgotModel.UserName,
                question =ForgotModel.SecurityQuestions,
                answer = ForgotModel.Answer,
            };           

            var data1 = new JavaScriptSerializer().Serialize(Users);           
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(URL);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.ContentLength = data1.Length;
            StreamWriter requestWriter = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.ASCII);
            requestWriter.Write(data1);
            requestWriter.Close();
            try
            {
                WebResponse webResponse = request.GetResponse();
                Stream webStream = webResponse.GetResponseStream();
                StreamReader responseReader = new StreamReader(webStream);
                result = Convert.ToBoolean(responseReader.ReadToEnd());
                responseReader.Close();

            }
            catch (Exception e)
            {
                Console.Out.WriteLine("-----------------");
                Console.Out.WriteLine(e.Message);
            }
            return result;
        }
    }
}
