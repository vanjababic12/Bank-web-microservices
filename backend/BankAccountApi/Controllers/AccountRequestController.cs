using BankAccountApi.Dto;
using BankAccountApi.Interfaces;
using BankAccountApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BankAccountApi.Controllers
{
    [Route("api/accounts/requests")]
    [ApiController]
    public class AccountRequestController : Controller
    {
        private readonly IAccountService _accountService;

        public AccountRequestController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        [HttpGet]
        [Authorize]
        public ActionResult<List<AccountRequest>> GetAllAccountRequests()
        {
            var role = GetUserRole();
            var accounts = _accountService.GetAllAccountRequests();
            switch (role)
            {
                case "Worker":
                    return Ok(accounts);
                case "Admin":
                    return Ok(accounts);
                case "User":
                    return Ok(accounts.Where(i => i.CustomerUsername == GetUserEmail()).ToList());
                default: return BadRequest();
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AccountRequest>> CreateAccountRequest([FromBody] AccountRequestDto accountRequestDto)
        {
            var customerUsername = GetUserEmail(); // Implementirajte metodu za dobijanje korisničkog imena iz tokena
            var accountRequest = await _accountService.CreateAccountRequest(customerUsername, accountRequestDto);
            return CreatedAtAction(nameof(GetAllAccountRequests), new { id = accountRequest.Id }, accountRequest);
        }

        [HttpPut("{requestId}")]
        [Authorize(Roles = "Worker")]
        public async Task<ActionResult> ReviewAccountRequest(int requestId, [FromBody] bool isApproved)
        {
            var success = await _accountService.ReviewAccountRequest(requestId, isApproved);
            if (!success) return NotFound("Zahtev za račun nije pronađen.");
            return Ok();
        }

        [NonAction]
        private string GetUserEmail()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            return claimsIdentity.FindFirst(ClaimTypes.Name)?.Value;
        }

        [NonAction]
        private string GetUserRole()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            return claimsIdentity.FindFirst(ClaimTypes.Role)?.Value;
        }
    }
}
