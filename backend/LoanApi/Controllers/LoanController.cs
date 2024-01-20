using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using LoanApi.Dto;
using LoanApi.Infrastructure;
using LoanApi.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using LoanApi.Models;

namespace LoanApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoanController : ControllerBase
    {
        private readonly ILoanService _loanService;

        public LoanController(ILoanService loanService)
        {
            _loanService = loanService;
        }

        [HttpGet("types")]
        public ActionResult<List<LoanType>> GetAllLoanTypes()
        {
            return Ok(_loanService.GetAllLoanTypes());
        }

        [HttpPost("types")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<LoanType>> CreateLoanType([FromBody] LoanTypeDto loanTypeDto)
        {
            var loanType = await _loanService.CreateLoanType(loanTypeDto);
            return CreatedAtAction(nameof(GetAllLoanTypes), new { id = loanType.Id }, loanType);
        }

        [HttpDelete("types/{loanTypeId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteLoanType(int loanTypeId)
        {
            var success = await _loanService.DeleteLoanType(loanTypeId);
            if (!success)
            {
                return NotFound("Tip kredita nije pronađen ili je već obrisan.");
            }
            return Ok();
        }

        [HttpGet("requests")]
        [Authorize(Roles = "Worker")]
        public ActionResult<List<LoanRequest>> GetAllLoanRequests()
        {
            return Ok(_loanService.GetAllLoanRequests());
        }

        [HttpPost("requests")]
        [Authorize]
        public async Task<ActionResult<LoanRequest>> CreateLoanRequest([FromBody] LoanRequestDto loanRequestDto)
        {
            var customerUsername = GetUserEmail(); // Pretpostavka da imamo metodu za dobijanje korisničkog imena
            var loanRequest = await _loanService.CreateLoanRequest(customerUsername, loanRequestDto);
            return CreatedAtAction(nameof(GetAllLoanRequests), new { id = loanRequest.Id }, loanRequest);
        }

        [HttpPut("requests/{requestId}")]
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

        [HttpGet("user/requests")]
        [Authorize]
        public ActionResult<List<LoanRequest>> GetUserLoanRequests()
        {
            var customerUsername = GetUserEmail(); // Pretpostavka da imamo metodu za dobijanje korisničkog imena
            var requests = _loanService.GetUserLoanRequests(customerUsername);
            return Ok(requests);
        }

        // Implementacija GetUserEmail metode...
        private string GetUserEmail()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            return claimsIdentity.FindFirst(ClaimTypes.Name)?.Value;
        }

    }
}
