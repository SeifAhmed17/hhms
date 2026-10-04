using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HHMS.Api.Data.Configurations
{
    public class PhoneNumberConfiguration:IEntityTypeConfiguration<ClsPhoneNumber>
    {
        public void Configure(EntityTypeBuilder<ClsPhoneNumber> builder)
        {
            builder.ToTable("PhoneNumbers");
            builder.HasKey(p => p.Id);

            builder.Property(x => x.Number)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasOne(x => x.Person)
                .WithMany(x => x.PhoneNumbers)
                .HasForeignKey(x => x.PersonId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
