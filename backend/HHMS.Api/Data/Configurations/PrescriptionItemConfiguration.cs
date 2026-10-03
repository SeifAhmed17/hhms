using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HHMS.Api.Data.Configurations
{
    public class PrescriptionItemConfiguration : IEntityTypeConfiguration<ClsPrescriptionItem>
    {
        public void Configure(EntityTypeBuilder<ClsPrescriptionItem> builder)
        {
            builder.ToTable("PrescriptionItems", t => t.HasCheckConstraint("CK_PrescriptionItems_Quantity", "[Quantity] > 0"));
            builder.HasKey(pi => pi.Id);

            builder.Property(pi => pi.Dosage).IsRequired().HasMaxLength(200);

            builder.HasOne(pi => pi.Prescription).WithMany()
                   .HasForeignKey(pi => pi.PrescriptionId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(pi => pi.Medicine).WithMany()
                   .HasForeignKey(pi => pi.MedicineId)
                   .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
