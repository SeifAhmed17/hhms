using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HHMS.Api.Data.Configurations
{
    public class MedicineConfiguration : IEntityTypeConfiguration<ClsMedicine>
    {
        public void Configure(EntityTypeBuilder<ClsMedicine> builder)
        {
            builder.ToTable("Medicines");
            builder.HasKey(m => m.Id);

            builder.Property(m => m.Name).IsRequired().HasMaxLength(100);
            builder.Property(m => m.Price).HasPrecision(18, 2);
            builder.Property(m => m.RowVersion).IsRowVersion();

            builder.HasIndex(m => m.Name).IsUnique();
        }
    }
}