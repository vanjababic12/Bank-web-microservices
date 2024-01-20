using System.Collections.Generic;

namespace ExchangeRateApi.Dto
{
    public class ExchangeRateListDto
    {
        public string Date { get; set; } // Datum u ISO 8601 formatu
        public List<ExchangeRateDto> Rates { get; set; }
    }

    public class ExchangeRateDto
    {
        public string Currency { get; set; }
        public decimal Rate { get; set; }
    }
}
