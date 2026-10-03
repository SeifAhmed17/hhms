namespace HHMS.Api.Models
{
    public class ClsPharmacist
    {
        public Guid Id { get; set; }

        public Guid PersonId { get; set; }
        public ClsPerson Person { get; set; } = null!;

        public Guid UserId { get; set; }
        public ClsApplicationUser User { get; set; } = null!;

        public decimal Salary { get; set; }

        public ICollection<ClsPrescription> Prescriptions { get; set; } = new List<ClsPrescription>();
    }
}