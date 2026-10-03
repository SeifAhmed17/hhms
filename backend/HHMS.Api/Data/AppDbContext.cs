using HHMS.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HHMS.Api.Data
{
    public class AppDbContext : IdentityDbContext<ClsApplicationUser, IdentityRole<Guid>, Guid>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<ClsPerson> People { get; set; }
        public DbSet<ClsPhoneNumber> PhoneNumbers { get; set; }
        public DbSet<ClsDoctor> Doctors { get; set; }
        public DbSet<ClsPatient> Patients { get; set; }
        public DbSet<ClsReceptionist> Receptionists { get; set; }
        public DbSet<ClsPharmacist> Pharmacists { get; set; }
        public DbSet<ClsDepartment> Departments { get; set; }
        public DbSet<ClsDoctorSchedule> DoctorSchedules { get; set; }
        public DbSet<ClsAppointment> Appointments { get; set; }
        public DbSet<ClsPrescription> Prescriptions { get; set; }
        public DbSet<ClsPrescriptionItem> PrescriptionItems { get; set; }
        public DbSet<ClsMedicine> Medicines { get; set; }
        public DbSet<ClsReceipt> Receipts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
