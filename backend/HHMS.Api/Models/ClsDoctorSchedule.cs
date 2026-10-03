namespace HHMS.Api.Models
{
    public class ClsDoctorSchedule
    {
        public Guid Id { get; set; } = Guid.CreateVersion7();
        public Guid DoctorId { get; set; }
        public EnDayOfWeek DayOfWeek { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public ClsDoctor Doctor { get; set; }
    }
}