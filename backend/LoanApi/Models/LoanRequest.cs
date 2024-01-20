namespace LoanApi.Models
{
    public class LoanRequest
    {
        public int Id { get; set; }
        public int LoanTypeId { get; set; }
        public string CustomerUsername { get; set; }
        public decimal Amount { get; set; }
        public int NumberOfInstallments { get; set; }
        public bool IsReviewed { get; set; }
        public bool IsApproved { get; set; }

        public LoanType LoanType { get; set; }
    }

}
