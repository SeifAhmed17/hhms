using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HHMS.Api.Data.Configurations
{
    public class PrescriptionConfiguration : IEntityTypeConfiguration<ClsPrescription>
    {
        public void Configure(EntityTypeBuilder<ClsPrescription> builder)
        {
            builder.ToTable("Prescriptions");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.AdditionalNotes).HasMaxLength(500);
            builder.Property(p => p.RowVersion).IsRowVersion();


            builder.HasOne(p => p.Appointment)
                   .WithOne()
                   .HasForeignKey<ClsPrescription>(p => p.AppointmentId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Pharmacist)
                   .WithMany(ph => ph.Prescriptions)
                   .HasForeignKey(p => p.PharmacistId)
                   .IsRequired(false)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
