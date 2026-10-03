using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HHMS.Api.Data.Configurations
{
    public class DoctorConfiguration : IEntityTypeConfiguration<ClsDoctor>
    {
        public void Configure(EntityTypeBuilder<ClsDoctor> builder)
        {
           builder.ToTable("Doctors");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.ApplicationUserId).IsRequired();
            builder.Property(x => x.PersonId).IsRequired();
            builder.Property(x => x.DepartmentId).IsRequired();
            builder.Property(x => x.AppointmentDurationMinutes).IsRequired();
            builder.Property(x => x.Salary).HasPrecision(18, 2).IsRequired();


            builder.HasOne(x => x.Department)
                .WithMany()
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.ApplicationUser)
                .WithOne()
                .HasForeignKey<ClsDoctor>(x => x.ApplicationUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Person)
                .WithOne()
                .HasForeignKey<ClsDoctor>(x => x.PersonId)
                .OnDelete(DeleteBehavior.Restrict);


        }
    }
}