using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using BankAccountApi.Dto;
using BankAccountApi.Infrastructure;
using BankAccountApi.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using BankAccountApi.Models;
using System.Data;
using System.Linq;

namespace BankAccountApi.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly IExchangeService _exchangeService;

        public AccountController(IAccountService accountService, IExchangeService exchangeService)
        {
            _accountService = accountService;
            _exchangeService = exchangeService;
        }

        [HttpGet("my")]
        [Authorize(Roles = "User")] // Samo registrovani korisnici mogu pregledati svoje račune
        public ActionResult<List<Account>> GetCustomerAccounts()
        {
            var customerUsername = GetUserEmail();
            var accounts = _accountService.GetCustomerAccounts(customerUsername);
            return Ok(accounts);
        }

        [HttpPut("{accountId}/close")]
        [Authorize] // Samo registrovani korisnici mogu zatvoriti račun
        public async Task<ActionResult> CloseAccount(int accountId)
        {
            var customerUsername = GetUserEmail();
            if (_accountService.GetCustomerAccounts(customerUsername).Find(i => i.Id == accountId) == null) {
                return NotFound("Account with given id doesn't exist");
            }
            var success = await _accountService.CloseAccount(accountId);
            if (!success) return NotFound("Račun nije pronađen ili je već zatvoren.");
            return Ok();
        }

        [HttpPost("exchange")]
        [Authorize]
        public async Task<ActionResult> ExchangeTrasnfer([FromBody] ExchangeTransferDto dto)
        {
            try
            {
                List<ExchangeRate> exchangeRates = await _exchangeService.GetExchangeRatesAsync();
                _accountService.ExchangeTransfer(GetUserEmail(), dto.AccountFromId, dto.AccountToId, dto.Amount, exchangeRates);
                return Ok();
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [NonAction]
        private string GetUserEmail()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            return claimsIdentity.FindFirst(ClaimTypes.Name)?.Value;
        }

    }
}
