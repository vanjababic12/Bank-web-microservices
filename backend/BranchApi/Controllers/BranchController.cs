using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using BranchApi.Dto;
using BranchApi.Infrastructure;
using BranchApi.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using BranchApi.Models;
using Common.Exceptions;

namespace BranchApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchController : ControllerBase
    {
        private readonly IBranchService _branchService;

        public BranchController(IBranchService branchService)
        {
            _branchService = branchService;
        }

        [HttpGet]
        public ActionResult<List<Branch>> GetAllBranches()
        {
            return Ok(_branchService.GetAllBranches());
        }

        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<Branch> GetBranch(int id)
        {
            try
            {
                var branch = _branchService.GetBranch(id);
                return Ok(branch);
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Branch>> CreateBranch([FromBody] BranchDto branchDto)
        {
            try
            {
                var branch = await _branchService.CreateBranch(branchDto);
                return CreatedAtAction(nameof(GetBranch), new { id = branch.Id }, branch);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateBranch(int id, [FromBody] BranchDto branchDto)
        {
            try
            {
                await _branchService.UpdateBranch(id, branchDto);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public ActionResult DeleteBranch(int id)
        {
            try
            {
                _branchService.DeleteBranch(id);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("appointments")]
        public ActionResult<List<Appointment>> GetAvailableAppointments(int branchId, DateTime date)
        {
            try
            {
                var appointments = _branchService.GetAvailableAppointments(branchId, date);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("appointments")]
        [Authorize] // Samo registrovani korisnici mogu zakazati termin
        public async Task<ActionResult<BookAppointmentResult>> BookAppointment([FromBody] AppointmentDto appointmentDto)
        {
            try
            {
                var customerUsername = GetUserEmail();
                var result = await _branchService.BookAppointment(appointmentDto.AppointmentId, customerUsername);
                return Ok(result);
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("appointments/{appointmentId}")]
        [Authorize(Roles = "Worker")] // Samo radnici mogu otkazati termin
        public async Task<ActionResult> CancelAppointment(int appointmentId)
        {
            try
            {
                var success = await _branchService.CancelAppointment(appointmentId);
                if (!success)
                {
                    return NotFound("Termin nije pronađen ili već otkazan.");
                }
                return Ok("Termin je uspešno otkazan.");
            }
            catch (Exception ex)
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
