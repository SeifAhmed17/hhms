namespace HHMS.Api.Models
{
    public class ClsPhoneNumber
    {
        public Guid Id { get; set; }
        public string Number { get; set; }

        public Guid PersonId { get; set; }
        public ClsPerson Person { get; set; } = null!;


    }
}
