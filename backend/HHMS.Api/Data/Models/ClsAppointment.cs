
namespace HHMS.Api.Models
{
    public class ClsAppointment
    {
        public Guid Id { get; set; }
        public Guid DoctorId { get; set; }
        public Guid PatientId { get; set; }
        public DateTime AppointmentDateTime { get; set; }
        public EnAppointmentStatus AppointmentStatus { get; set; }
        public string? Complaint { get; set; }
        public string? Diagnosis { get; set; }
        public string? Notes { get; set; }
        public byte[] RowVersion { get; set; } = null!;

        public ClsDoctor Doctor { get; set; } = null!;
        public ClsPatient Patient { get; set; } = null!;
    }
}
