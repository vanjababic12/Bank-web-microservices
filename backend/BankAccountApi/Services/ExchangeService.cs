using BankAccountApi.Dto;
using BankAccountApi.Interfaces;
using BankAccountApi.Models;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace BankAccountApi.Services
{
    public class ExchangeService : IExchangeService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _baseUrl;

        public ExchangeService(IOptions<MicroserviceSettings> settings, IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _baseUrl = settings.Value.ExchangeRateServiceUrl;
        }
        public async Task<List<ExchangeRate>> GetExchangeRatesAsync()
        {
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync(_baseUrl + "/exchange-rates/latest");

            if (!response.IsSuccessStatusCode)
            {
                // Handle error or throw an exception
                throw new Exception("Could not retrieve rates");
            }

            var content = await response.Content.ReadAsStringAsync();
            var exchangeRates = JsonConvert.DeserializeObject<List<ExchangeRate>>(content);
            return exchangeRates;
        }

    }
}
