using Microsoft.AspNetCore.Identity;

namespace HHMS.Api.Models
{
    public class ClsApplicationUser : IdentityUser<Guid>
    {
        public EnUserType UserType { get; set; }
    }
}