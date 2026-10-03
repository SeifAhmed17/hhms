using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HHMS.Api.Data.Configurations
{
    public class DoctorScheduleConfiguration : IEntityTypeConfiguration<ClsDoctorSchedule>
    {
        public void Configure(EntityTypeBuilder<ClsDoctorSchedule> builder)
        {
            builder.ToTable("DoctorSchedules", t => t.HasCheckConstraint("CK_DoctorSchedules_EndAfterStart", "[EndTime] > [StartTime]"));
            builder.HasKey(ds => ds.Id);

            builder.Property(ds => ds.DayOfWeek).IsRequired();
            builder.Property(ds => ds.StartTime).IsRequired();
            builder.Property(ds => ds.EndTime).IsRequired();
            builder.HasIndex(ds => new { ds.DoctorId, ds.DayOfWeek }).IsUnique();

            builder.HasOne(ds => ds.Doctor)
                   .WithMany(d => d.DoctorSchedules)
                   .HasForeignKey(ds => ds.DoctorId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}