namespace HHMS.Api.Models
{
    public class ClsDepartment
    {
        public Guid Id {get;set;}= Guid.NewGuid();
        public string Name {get; set;}
        public decimal ConsultationFee {get; set;}
    }
}
