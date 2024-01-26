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
    [Route("api/loans/types")]
    [ApiController]
    public class LoanController : ControllerBase
    {
        private readonly ILoanService _loanService;

        public LoanController(ILoanService loanService)
        {
            _loanService = loanService;
        }

        [HttpGet("search")]
        public ActionResult<List<LoanType>> SearchLoanTypes(string searchTerm, string sortField = "name", bool ascending = true)
        {
            var loanTypes = _loanService.SearchAndSortLoanTypes(searchTerm, sortField, ascending);
            return Ok(loanTypes);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<LoanType>> CreateLoanType([FromBody] LoanTypeDto loanTypeDto)
        {
            var loanType = await _loanService.CreateLoanType(loanTypeDto);
            return CreatedAtAction(nameof(SearchLoanTypes), new { id = loanType.Id }, loanType);
        }

        [HttpDelete("{loanTypeId}")]
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

        private string GetUserEmail()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            return claimsIdentity.FindFirst(ClaimTypes.Name)?.Value;
        }

    }
}
