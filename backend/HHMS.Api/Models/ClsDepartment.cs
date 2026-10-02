using System.ComponentModel.DataAnnotations;

namespace HHMS.Api.Models
{
    public class ClsDepartment
    {
        public Guid Id = Guid.NewGuid();
        public string Name {get; set;}
        public decimal ConsultationFee {get; set;}
    }
}
