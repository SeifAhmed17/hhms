using HHMS.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HHMS.Api.Data.Configurations
{
    public class DepartmentConfiguration : IEntityTypeConfiguration<ClsDepartment>
    {
        public void Configure(EntityTypeBuilder<ClsDepartment> builder)
        {
            builder.ToTable("Departments");
            builder.HasKey(d => d.Id);

            builder.Property(d => d.Name).IsRequired().HasMaxLength(100);
            builder.Property(d => d.ConsultationFee).HasPrecision(18, 2);


            builder.HasIndex(d => d.Name).IsUnique();

        }
    }
}