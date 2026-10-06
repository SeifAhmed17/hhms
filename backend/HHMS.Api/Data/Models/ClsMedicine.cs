
namespace HHMS.Api.Models
{
    public class ClsMedicine
    {
  
        public Guid Id {get;set;} = Guid.NewGuid();
        public string Name { get; set; } = "";
        public decimal Price { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public int Quantity { get; set; }
        public int LowStockThreshold { get; set; }
        public byte[] RowVersion { get; set; } = null!;
    }
}
