namespace HHMS.Api.Models
{
    public class ClsPrescription
    {
        public Guid Id { get; set; } = Guid.CreateVersion7();
        public Guid AppointmentId { get; set; }
        public string? AdditionalNotes { get; set; }
        public EnPrescriptionStatus PrescriptionStatus { get; set; } = EnPrescriptionStatus.Pending;
        public DateTime? DispensedAt { get; set; }
        public Guid? PharmacistId { get; set; }
        public byte[] RowVersion { get; set; } = null!;

        public ClsAppointment Appointment { get; set; } = null!;
        public ClsPharmacist? Pharmacist { get; set; }
        public ICollection<ClsPrescriptionItem> Items { get; set; } = new List<ClsPrescriptionItem>();
    }
}