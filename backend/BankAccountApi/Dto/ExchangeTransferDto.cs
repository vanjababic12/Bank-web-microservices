namespace BankAccountApi.Dto
{
    public class ExchangeTransferDto
    {
        public int AccountFromId { get; set; }
        public int AccountToId { get; set; }
        public double Amount { get; set; }
    }
}
