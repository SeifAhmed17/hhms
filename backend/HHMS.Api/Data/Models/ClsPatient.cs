namespace HHMS.Api.Models
{
    public class ClsPatient 
    {
        public Guid Id { get; set; } = Guid.CreateVersion7();

        public Guid? UserId { get; set; }
        public ClsApplicationUser? User { get; set; }

        public Guid PersonId { get; set; }
        public ClsPerson Person { get; set; } = null!;

        public string? Allergies { get; set; }
        public string? ChronicDiseases { get; set; }
        public EnBloodType? BloodType { get; set; }
        public string? PastSurgeries { get; set; }
        public string? FamilyHistory { get; set; }
        public byte[] RowVersion { get; set; } = null!;

        public ICollection<ClsAppointment> Appointments { get; set; } = new List<ClsAppointment>();


    }
}
