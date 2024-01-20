namespace BankAccountApi.Models
{
    public class AccountRequest
    {
        public int Id { get; set; }
        public string CustomerUsername { get; set; }
        public int AccountTypeId { get; set; }
        public bool IsReviewed { get; set; }
        public bool IsApproved { get; set; }
    }

}
