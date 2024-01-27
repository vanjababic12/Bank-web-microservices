using BranchApi.Dto;
using BranchApi.Interfaces;
using BranchApi.Models;
using Common.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BranchApi.Controllers
{
    [Route("api/branches")]
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

        [HttpGet("search")]
        public ActionResult<List<Branch>> SearchBranches(string searchTerm, string sortField = "name", bool ascending = true)
        {
            var branches = _branchService.SearchAndSortBranches(searchTerm, sortField, ascending);
            return Ok(branches);
        }

        [HttpPost("create")]
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
        [HttpGet("appointments/available")]
        [Authorize]
        public ActionResult<List<DateTime>> GetAvailableAppointmentDates(int branchId)
        {
            try
            {
                var dates = _branchService.GetAvailableAppointmentDates(branchId);
                return Ok(dates);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("appointments")]
        [Authorize]
        public ActionResult<List<Appointment>> GetAvailableAppointments([FromQuery] int branchId, [FromQuery] String date)
        {
            try
            {
                var dateTime = DateTime.Parse(date, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal).Date;
                var appointments = _branchService.GetAvailableAppointments(branchId, dateTime);
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("appointments")]
        [Authorize(Roles = "Admin")] // Pretpostavljamo da samo admin može da doda termin
        public async Task<ActionResult<Appointment>> AddAppointment([FromBody] CreateAppointmentDto appointment)
        {
            try
            {
                var createdAppointment = await _branchService.AddAppointment(appointment);
                return CreatedAtAction(nameof(GetAvailableAppointments), new { id = createdAppointment.Id }, createdAppointment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("appointments")]
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
        [Authorize(Roles = "Worker")] // Only workers can cancel appointments
        public async Task<ActionResult> CancelAppointment(int appointmentId)
        {
            try
            {
                var success = await _branchService.CancelAppointment(appointmentId);
                if (!success)
                {
                    return NotFound("Appointment not found or already canceled.");
                }
                return Ok("Appointment has been successfully canceled.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("myappointments")]
        [Authorize(Roles = "Worker")] // Only workers can cancel appointments
        public ActionResult<List<Appointment>> GetUserAppointments()
        {
            var username = GetUserEmail();
            var appointments = _branchService.GetUserAppointments(username);
            return Ok(appointments);
        }

        [NonAction]
        private string GetUserEmail()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            return claimsIdentity.FindFirst(ClaimTypes.Name)?.Value;
        }
    }
}
