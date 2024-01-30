using BankAccountApi.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankAccountApi.Interfaces
{
    public interface IExchangeService
    {
        Task<List<ExchangeRate>> GetExchangeRatesAsync();
    }
}
