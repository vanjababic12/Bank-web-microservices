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

namespace BankAccountApi.Controllers
{
    [Route("api/types")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet("search")]
        public ActionResult<List<AccountType>> SearchAccountTypes(string searchTerm, string sortField = "name", bool ascending = true)
        {
            var accountTypes = _accountService.SearchAndSortAccountTypes(searchTerm, sortField, ascending);
            return Ok(accountTypes);
        }

        [HttpPost()]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AccountType>> CreateAccountType([FromBody] CreateAccountTypeDto accountTypeDto)
        {
            var accountType = await _accountService.CreateAccountType(accountTypeDto);
            return CreatedAtAction(nameof(SearchAccountTypes), new { id = accountType.Id }, accountType);
        }

        [HttpGet("requests")]
        [Authorize(Roles = "Worker")]
        public ActionResult<List<AccountRequest>> GetAllAccountRequests()
        {
            return Ok(_accountService.GetAllAccountRequests());
        }

        [HttpDelete("types/{accountTypeId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteAccountType(int accountTypeId)
        {
            var success = await _accountService.DeleteAccountType(accountTypeId);
            if (!success)
            {
                return NotFound("Tip računa nije pronađen ili je već obrisan.");
            }
            return Ok();
        }

        [HttpPost("requests")]
        [Authorize]
        public async Task<ActionResult<AccountRequest>> CreateAccountRequest([FromBody] AccountRequestDto accountRequestDto)
        {
            var customerUsername = GetUserEmail(); // Implementirajte metodu za dobijanje korisničkog imena iz tokena
            var accountRequest = await _accountService.CreateAccountRequest(customerUsername, accountRequestDto);
            return CreatedAtAction(nameof(GetAllAccountRequests), new { id = accountRequest.Id }, accountRequest);
        }

        [HttpPut("requests/{requestId}")]
        [Authorize(Roles = "Worker")]
        public async Task<ActionResult> ReviewAccountRequest(int requestId, [FromBody] bool isApproved)
        {
            var success = await _accountService.ReviewAccountRequest(requestId, isApproved);
            if (!success) return NotFound("Zahtev za račun nije pronađen.");
            return Ok();
        }

        [HttpGet("customer/accounts")]
        [Authorize] // Samo registrovani korisnici mogu pregledati svoje račune
        public ActionResult<List<Account>> GetCustomerAccounts()
        {
            var customerUsername = GetUserEmail();
            var accounts = _accountService.GetCustomerAccounts(customerUsername);
            return Ok(accounts);
        }

        [HttpPost("create")]
        [Authorize] // Samo registrovani korisnici mogu kreirati račun
        public async Task<ActionResult<Account>> CreateAccount([FromBody] AccountDto accountDto)
        {
            var customerUsername = GetUserEmail();
            var account = await _accountService.CreateAccount(customerUsername, accountDto);
            return CreatedAtAction(nameof(GetCustomerAccounts), new { id = account.Id }, account);
        }

        [HttpPut("close/{accountId}")]
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

        [NonAction]
        private string GetUserEmail()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            return claimsIdentity.FindFirst(ClaimTypes.Name)?.Value;
        }

    }
}
