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
        public ClsDepartment Department { get; set; }
        public ClsApplicationUser User { get; set; }
        public ClsPerson Person { get; set; }
        public List<ClsDoctorSchedule> DoctorSchedules { get; set; } = new List<ClsDoctorSchedule>();
        public List<ClsAppointment> Appointments { get; set; } = new List<ClsAppointment>();
    }
}