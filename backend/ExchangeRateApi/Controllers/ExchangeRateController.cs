using ExchangeRateApi.Dto;
using ExchangeRateApi.Interfaces;
using ExchangeRateApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExchangeRateApi.Controllers
{
    [Route("api/exchange-rates")]
    [ApiController]
    public class ExchangeRateController : ControllerBase
    {
        private readonly IExchangeRateService _exchangeRateService;

        public ExchangeRateController(IExchangeRateService exchangeRateService)
        {
            _exchangeRateService = exchangeRateService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CreateExchangeRateList([FromBody] ExchangeRateListDto exchangeRateListDto)
        {
            return Ok(await _exchangeRateService.CreateExchangeRateList(exchangeRateListDto));
        }

        [HttpGet("latest")]
        public ActionResult<List<ExchangeRate>> GetLatestExchangeRates()
        {
            var latestRates = _exchangeRateService.GetLatestExchangeRates();
            return Ok(latestRates);
        }

        [HttpGet]
        public ActionResult<List<ExchangeRate>> GetExchangeRatesByDate(string date)
        {
            var rates = _exchangeRateService.GetExchangeRatesByDate(date);
            return Ok(rates);
        }

    }
}
