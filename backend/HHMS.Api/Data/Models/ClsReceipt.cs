namespace HHMS.Api.Models
{
    public class ClsReceipt
    {
        public Guid Id { get;} = Guid.CreateVersion7();

        public Guid AppointmentId { get; set; }
        public ClsAppointment Appointment { get; set; } = null!;

        public EnPaymentMethod PaymentMethod { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaidAt { get; set; }

        public Guid ReceptionistId { get; set; }
        public ClsReceptionist Receptionist { get; set; } = null!;

    }
}
