using Microsoft.AspNetCore.Identity;

namespace HHMS.Api.Models
{
    public class ClsApplicationUser : IdentityUser
    {
        public EnUserType UserType { get; set; }
    }


}