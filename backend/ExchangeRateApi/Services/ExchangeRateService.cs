using ExchangeRateApi.Dto;
using ExchangeRateApi.Infrastructure;
using ExchangeRateApi.Interfaces;
using ExchangeRateApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExchangeRateApi.Services
{
    public class ExchangeRateService : IExchangeRateService
    {
        private readonly ExchangeRateDbContext _dbContext;

        public ExchangeRateService(ExchangeRateDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateExchangeRateList(ExchangeRateListDto exchangeRateListDto)
        {
            foreach (var rateDto in exchangeRateListDto.Rates)
            {
                var exchangeRate = new ExchangeRate
                {
                    Currency = rateDto.Currency,
                    Rate = rateDto.Rate,
                    Date = exchangeRateListDto.Date
                };
                _dbContext.ExchangeRates.Add(exchangeRate);
            }
            await _dbContext.SaveChangesAsync();
        }

        public List<ExchangeRate> GetLatestExchangeRates()
        {
            var latestDate = _dbContext.ExchangeRates.Max(er => er.Date);
            return _dbContext.ExchangeRates.Where(er => er.Date == latestDate).ToList();
        }

        public List<ExchangeRate> GetExchangeRatesByDate(string date)
        {
            return _dbContext.ExchangeRates.Where(er => er.Date == date).ToList();
        }
    }

}
