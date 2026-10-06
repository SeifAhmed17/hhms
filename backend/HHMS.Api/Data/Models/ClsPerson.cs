namespace HHMS.Api.Models
{
    public class ClsPerson
    {
        public Guid Id { get; set; } = Guid.CreateVersion7();

        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string? NationalId { get; set; }
        public string? PassportNumber { get; set; }
        public EnGender Gender { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public EnCountry Country { get; set; }
        public EnGovernorate? Governorate { get; set; }

        public ICollection<ClsPhoneNumber> PhoneNumbers { get; set; } = new List<ClsPhoneNumber>();


    }
}
