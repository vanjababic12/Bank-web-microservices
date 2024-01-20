namespace LoanApi.Models
{
    public class LoanType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal InterestRate { get; set; }
        public string Description { get; set; }
        public bool IsDeleted { get; set; }
    }

}
