using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.ComponentModel.DataAnnotations;


namespace PetzCareSP.Models
{
    public class SignIn
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    //}
    //public class SignUp
    //{
        public int Title { get; set; }
        public int CompanyName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string EmployeeCode { get; set; }
        public int SelectDesignation { get; set; }
        public int SelectDepartment { get; set; }
        public int EmployeeType { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string PermanentAddress { get; set; }
        public string TemporaryAddress { get; set; }
        public int Country { get; set; }
        public int State { get; set; }
        public int City { get; set; }
        public int Zipcode { get; set; }
        public string EmailID { get; set; }
        public int Fax { get; set; }
        public string SecurityQuestions { get; set; }
        public string Answer { get; set; }

    //}
    //public class ForgotPassword
    //{
        //public string Email { get; set; }
        //public string SecurityQuestions { get; set; }
        //public string Answer { get; set; }
    }
}