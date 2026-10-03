using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using HHMS.Api.Models;

namespace HHMS.Api.Data.Configurations
{
    public class ReceiptConfiguration : IEntityTypeConfiguration<ClsReceipt>
    {
        public void Configure(EntityTypeBuilder<ClsReceipt> builder)
        {
            builder.ToTable("Receipts");
            builder.HasKey(r => r.Id);

            builder.Property(r => r.Amount).HasPrecision(18, 2)
                .IsRequired();
            builder.Property(r => r.PaidAt).IsRequired();
            builder.Property(r => r.PaymentMethod).IsRequired();

            builder.HasOne(r => r.Appointment)
                .WithOne()
                .HasForeignKey<ClsReceipt>(r => r.AppointmentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.Receptionist)
                .WithMany(rc => rc.Receipts)
                .HasForeignKey(r => r.ReceptionistId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
