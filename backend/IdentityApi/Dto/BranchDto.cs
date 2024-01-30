namespace IdentityApi.Dto
{
    public class BranchDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string OpeningTime { get; set; } // ISO 8601 format "HH:mm:ss"
        public string ClosingTime { get; set; } // ISO 8601 format "HH:mm:ss"
    }
}
