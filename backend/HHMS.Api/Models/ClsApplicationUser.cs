using System;
using Microsoft.AspNetCore.Identity;

namespace HHMS.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public UserType userType { get; init; }
    }


}