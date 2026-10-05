namespace HHMS.Api.Models
{
    public class ClsDoctor
    {
        public Guid Id { get; set; } = Guid.CreateVersion7();
        public Guid UserId { get; init; }
        public Guid PersonId { get; init; }
        public Guid DepartmentId { get; set; }
        public int AppointmentDurationMinutes { get; set; }
        public decimal Salary { get; set; }
        public ClsDepartment Department { get; set; } = null!;
        public ClsApplicationUser User { get; set; } = null!;
        public ClsPerson Person { get; set; } = null!;
        public List<ClsDoctorSchedule> DoctorSchedules { get; set; } = new List<ClsDoctorSchedule>();
        public List<ClsAppointment> Appointments { get; set; } = new List<ClsAppointment>();
    }
}