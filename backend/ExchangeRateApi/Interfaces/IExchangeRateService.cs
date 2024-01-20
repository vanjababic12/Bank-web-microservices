using ExchangeRateApi.Dto;
using ExchangeRateApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExchangeRateApi.Interfaces
{
    public interface IExchangeRateService
    {
        Task CreateExchangeRateList(ExchangeRateListDto exchangeRateListDto);
        List<ExchangeRate> GetLatestExchangeRates();
        List<ExchangeRate> GetExchangeRatesByDate(string date);
    }

}
