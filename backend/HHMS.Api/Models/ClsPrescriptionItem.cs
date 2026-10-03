using System.ComponentModel.DataAnnotations.Schema;

namespace HHMS.Api.Models
{
    public class ClsPrescriptionItem
    {
        public Guid Id { get; } = Guid.NewGuid();

        public Guid PrescriptionId { get; set; }
        public ClsPrescription Prescription { get; set; } = null!;

        public Guid MedicineId { get; set; }
        public ClsMedicine Medicine { get; set; } = null!;

        public string Dosage { get; set; }
        public int Quantity { get; set; }

    }
}
