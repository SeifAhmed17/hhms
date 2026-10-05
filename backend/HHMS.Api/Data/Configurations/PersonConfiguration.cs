using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HHMS.Api.Data.Configurations
{
    public class PersonConfiguration:IEntityTypeConfiguration<ClsPerson>
    {
        public void Configure(EntityTypeBuilder<ClsPerson> builder)
        {
            builder.ToTable("Persons");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.FirstName)
                   .IsRequired()
                   .HasMaxLength(50);
            builder.Property(x => x.LastName)
                     .IsRequired()
                     .HasMaxLength(50);

            builder.Property(x => x.NationalId)
                     .HasMaxLength(15);

            builder.Property(x => x.PassportNumber)
                     .HasMaxLength(20);
            builder.Property(x => x.Gender)
                .IsRequired();
            builder.Property(x => x.DateOfBirth)
                .IsRequired();
            builder.Property(x => x.Country)
                .IsRequired();
            builder.Property(x => x.Governorate)
                .IsRequired(false);



            builder.HasIndex(p => p.NationalId).IsUnique();
            builder.HasIndex(p => p.PassportNumber).IsUnique();
        }
    }
}
