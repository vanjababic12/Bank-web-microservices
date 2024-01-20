namespace BankAccountApi.Models
{
    public class AccountType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Currency { get; set; }
        public bool IsDeleted { get; set; }
    }

}
