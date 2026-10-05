using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace HHMS.Api.Data.Configurations
{
    public class ReceptionistConfiguration:IEntityTypeConfiguration<ClsReceptionist>
    {
        public void Configure(EntityTypeBuilder<ClsReceptionist> builder)
        {
            builder.ToTable("Receptionists");
            builder.HasKey(x => x.Id);

           builder.HasOne(x => x.Person)
                .WithOne()
                .HasForeignKey<ClsReceptionist>(x => x.PersonId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.User)
               .WithOne()
               .HasForeignKey<ClsReceptionist>(x => x.UserId)
               .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x=>x.Salary)
                .HasColumnType("decimal(18,2)");

        }
    }
}
