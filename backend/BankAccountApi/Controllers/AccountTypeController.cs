using BankAccountApi.Dto;
using BankAccountApi.Interfaces;
using BankAccountApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BankAccountApi.Controllers
{
    [Route("api/accountType")]
    [ApiController]
    public class AccountTypeController : Controller
    {
        private readonly IAccountService _accountService;

        public AccountTypeController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet("search")]
        public ActionResult<List<AccountType>> SearchAccountTypes(string searchTerm, string sortField = "name", bool ascending = true)
        {
            var accountTypes = _accountService.SearchAndSortAccountTypes(searchTerm, sortField, ascending);
            return Ok(accountTypes);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AccountType>> CreateAccountType([FromBody] CreateAccountTypeDto accountTypeDto)
        {
            var accountType = await _accountService.CreateAccountType(accountTypeDto);
            return CreatedAtAction(nameof(SearchAccountTypes), new { id = accountType.Id }, accountType);
        }

        [HttpDelete("{accountTypeId}")]
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

        [NonAction]
        private string GetUserEmail()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            return claimsIdentity.FindFirst(ClaimTypes.Name)?.Value;
        }
    }
}
