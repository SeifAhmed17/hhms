namespace HHMS.Api.Models
{
    public class ClsReceptionist 
    {
        public Guid Id { get; set; } = Guid.CreateVersion7();

        public Guid PersonId { get; set; }
        public ClsPerson Person { get; set; } = null!;

        public Guid UserId { get; set; }
        public ClsApplicationUser User { get; set; } = null!;

        public decimal Salary { get; set; }

        public ICollection<ClsReceipt> Receipts { get; set; } = new List<ClsReceipt>();


    }
}
