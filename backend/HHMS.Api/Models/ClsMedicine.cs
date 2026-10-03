using System.ComponentModel.DataAnnotations;

namespace HHMS.Api.Models
{
    public class ClsMedicine
    {
        [Key]
        public Guid Id = Guid.NewGuid();
        [Required]
        public string Name { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public DateOnly ExpiryDate { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public int LowStockThreshold { get; set; }
        [Required]
        public byte[] RowVersion { get; set; }
    }
}
