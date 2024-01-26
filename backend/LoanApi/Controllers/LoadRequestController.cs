using LoanApi.Dto;
using LoanApi.Interfaces;
using LoanApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LoanApi.Controllers
{
    [Route("api/loans/requests")]
    [ApiController]
    public class LoadRequestController : Controller
    {
        private readonly ILoanService _loanService;

        public LoadRequestController(ILoanService loanService)
        {
            _loanService = loanService;
        }

        [HttpGet]
        [Authorize]
        public ActionResult<List<LoanRequest>> GetAllLoanRequests()
        {
            var customerUsername = GetUserEmail();
            var role = GetUserRole();
            var requests = _loanService.GetAllLoanRequests();
            switch (role)
            {
                case "Worker":
                    return Ok(requests);
                case "Admin":
                    return Ok(requests);
                case "User":
                    return Ok(_loanService.GetUserLoanRequests(customerUsername));
                default: return BadRequest();
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<LoanRequest>> CreateLoanRequest([FromBody] LoanRequestDto loanRequestDto)
        {
            var customerUsername = GetUserEmail(); // Pretpostavka da imamo metodu za dobijanje korisničkog imena
            var loanRequest = await _loanService.CreateLoanRequest(customerUsername, loanRequestDto);
            return CreatedAtAction(nameof(GetAllLoanRequests), new { id = loanRequest.Id }, loanRequest);
        }

        [HttpPut("{requestId}")]
        [Authorize(Roles = "Worker")]
        public async Task<ActionResult> ReviewLoanRequest(int requestId, [FromBody] bool isApproved)
        {
            var success = await _loanService.ReviewLoanRequest(requestId, isApproved);
            if (!success)
            {
                return NotFound("Zahtev za kredit nije pronađen.");
            }
            return Ok();
        }

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
