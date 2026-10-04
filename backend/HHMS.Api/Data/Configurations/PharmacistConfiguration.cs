using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace HHMS.Api.Data.Configurations
{
    public class PharmacistConfiguration:IEntityTypeConfiguration<ClsPharmacist>
    {
        public void Configure(EntityTypeBuilder<ClsPharmacist> builder)
        {
            builder.ToTable("Pharmacists");
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Person)
                .WithOne()
                .HasForeignKey<ClsPharmacist>(x => x.PersonId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x=>x.User)
                .WithOne()
                .HasForeignKey<ClsPharmacist>(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.Property(x => x.Salary)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

        }
    }
}
