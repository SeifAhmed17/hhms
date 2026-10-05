using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HHMS.Api.Data.Configurations
{
    public class PatientConfiguration:IEntityTypeConfiguration<ClsPatient>
    {
        public void Configure(EntityTypeBuilder<ClsPatient> builder)
        {
            builder.ToTable("Patients");
            builder.HasKey(p => p.Id);

            builder.HasOne(x => x.Person)
                .WithOne()
                .HasForeignKey<ClsPatient>(x => x.PersonId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.User)
               .WithOne()
               .HasForeignKey<ClsPatient>(x => x.UserId)
               .OnDelete(DeleteBehavior.Restrict);

            builder.Property(p => p.Allergies)
                .HasMaxLength(500);
            builder.Property(p => p.ChronicDiseases)
                .HasMaxLength(500);
            builder.Property(p => p.PastSurgeries)
                .HasMaxLength(500);

            builder.Property(p => p.FamilyHistory)
               .HasMaxLength(500);

            builder.Property(p => p.RowVersion)
                .IsRowVersion()
                .IsRequired();


        }
    }
}
