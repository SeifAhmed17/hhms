using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HHMS.Api.Data.Configurations
{
    public class PrescriptionItemConfiguration : IEntityTypeConfiguration<ClsPrescriptionItem>
    {
        public void Configure(EntityTypeBuilder<ClsPrescriptionItem> builder)
        {
            builder.ToTable("PrescriptionItems");
            builder.HasKey(pi => pi.Id);

            builder.Property(pi => pi.Dosage).IsRequired().HasMaxLength(200);
            builder.Property(pi => pi.Quantity).IsRequired();

            builder.HasOne(p => p.Prescription).WithMany()
                   .HasForeignKey(p => p.PrescriptionId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(p => p.Medicine).WithMany()
                   .HasForeignKey(p => p.MedicineId)
                   .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
