namespace HHMS.Api.Models
{
    public class ClsDepartment
    {
        public Guid Id {get;set;}= Guid.CreateVersion7();
        public string Name { get; set; } = "";
        public decimal ConsultationFee {get; set;}
        public ICollection<ClsDoctor> Doctors { get; set; } = new List<ClsDoctor>();
    }
}
