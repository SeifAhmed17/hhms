using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HHMS.Api.Data.Configurations
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<ClsAppointment>
    {
        public void Configure(EntityTypeBuilder<ClsAppointment> builder)
        {
            builder.ToTable("Appointments");
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Complaint).HasMaxLength(500);
            builder.Property(a => a.Diagnosis).HasMaxLength(500);
            builder.Property(a => a.Notes).HasMaxLength(500);
            builder.Property(a => a.RowVersion).IsRowVersion();

            builder.HasOne(a => a.Doctor).WithMany(d => d.Appointments).HasForeignKey(a => a.DoctorId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(a => a.Patient).WithMany(p => p.Appointments).HasForeignKey(a => a.PatientId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}