using IdentityApi.Dto;
using IdentityApi.Interfaces;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System;
using BankAccountApi.Models;
using Newtonsoft.Json;

namespace IdentityApi.Services
{
    public class BranchService : IBranchService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _baseUrl;

        public BranchService(IOptions<MicroserviceSettings> settings, IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _baseUrl = settings.Value.BranchServiceUrl;
        }
        public async Task<BranchDto> GetBranchAsync(int branchId)
        {

            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync(_baseUrl + $"/branches/{branchId}");

            if (!response.IsSuccessStatusCode)
            {
                // Handle error or throw an exception
                throw new Exception("Could not retrieve rates");
            }

            var content = await response.Content.ReadAsStringAsync();
            var branch = JsonConvert.DeserializeObject<BranchDto>(content);
            return branch;
        }
    }
}
