namespace LoanApi.Dto
{
    public class LoanRequestDto
    {
        public int LoanTypeId { get; set; }
        public decimal Amount { get; set; }
        public int NumberOfInstallments { get; set; }
    }

}
