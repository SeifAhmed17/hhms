namespace HHMS.Api.Models
{
    public enum Gender
    {
        Male = 1 ,
        Female = 2
    }
    public enum UserType
    {
        Admin = 1, 
        Doctor = 2, 
        Receptionist = 3, 
        Pharmacist = 4 , 
        Patient = 5
    }
    public enum BloodType
    {
        APositive = 1, ANegative = 2 , BPositive = 3 , BNegative = 4, ABPositive = 5, ABNegative = 6, OPositive = 7, ONegative = 8
    }
    public enum AppointmentStatus
    {
        Booked = 1, CheckedIn = 2, Completed = 3, Cancelled = 4
    }
    public enum PrescriptionStatus
    {
        Pending = 1, Dispensed = 2
    }
    public enum PaymentMethod
    {
        Cash = 1, Card = 2
    }
    public enum Country
    {
        Egypt = 1,
        Iraq = 2,
        Jordan = 3,
        Kuwait = 4,
        Lebanon = 5,
        Libya = 6,
        Mauritania = 7,
        Morocco = 8,
        Oman = 9,
        Palestine = 10,
        Qatar = 11,
        SaudiArabia = 12,
        France = 13,
        Germany = 14,
        UnitedKingdom = 15,
        Italy = 16,
        UnitedStates = 17,
        Canada = 18,
        Brazil = 19,
        Mexico = 20,
        Japan = 21,
        China = 22,
        India = 23,
        Pakistan = 24
    }
    public enum City
    {
        Monufia = 1,
        Giza = 2,
        Alexandria = 3,
        Qalyubia = 4,
        PortSaid = 5,
        Suez = 6,
        Damietta = 7,
        Dakahlia = 8,
        Sharqia = 9,
        KafrElSheikh = 10,
        Gharbia = 11,
        Cairo = 12,
        Beheira = 13,
        Ismailia = 14,
        Fayoum = 15,
        BeniSuef = 16,
        Minya = 17,
        Assiut = 18,
        Sohag = 19,
        Qena = 20,
        Luxor = 21,
        Aswan = 22,
        RedSea = 23,
        NewValley = 24,
        Matrouh = 25,
        NorthSinai = 26,
        SouthSinai = 27
    }
    public enum DayOfWeek
    {
        Saturday = 1,
        Sunday = 2,
        Monday = 3,
        Tuesday = 4,
        Wednesday = 5,
        Thursday = 6,
        Friday = 7
    }
}
