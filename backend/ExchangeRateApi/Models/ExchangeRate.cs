namespace ExchangeRateApi.Models
{
    public class ExchangeRate
    {
        public int Id { get; set; }
        public string Currency { get; set; }
        public decimal Rate { get; set; }
        public string Date { get; set; } // Datum u ISO 8601 formatu ("yyyy-MM-dd")
    }

}
