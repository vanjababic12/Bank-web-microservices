using IdentityApi.Dto;
using IdentityApi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IdentityApi.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IBranchService _branchService;
        private readonly IConfiguration _config;

        public UsersController(IUserService userService, IBranchService branchService, IConfiguration configuration)
        {
            _userService = userService;
            _config = configuration;
            _branchService = branchService;
        }

        [HttpGet]
        [Authorize]
        public ActionResult GetUser()
        {
            var userEmail = GetUserEmail();
            try
            {
                return Ok(_userService.GetUserByEmail(userEmail));
            }
            catch (Exception ex)
            {
                return BadRequest(new {message = ex.Message});
            }
        }
        [HttpPost("login")]
        public ActionResult Login(LoginDto dto)
        {
            var retVal = _userService.LoginUser(dto);
            if (retVal == null) return BadRequest(new { message = "Wrong password/email" });
            return Ok(retVal);
        }

        [HttpPost]
        public ActionResult AddUser([FromBody] RegisterDto dto)
        {
            try
            {
                _userService.AddUser(dto);
            }
            catch (Exception ex)
            {
                return BadRequest(new {message = ex.Message});
            }

            return Ok();
        }

        [HttpPut]
        [Authorize]
        public ActionResult UpdateUser([FromBody] UpdateUserDto dto)
        {
            var userEmail = GetUserEmail();
            try
            {
                _userService.UpdateUser(userEmail, dto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            return Ok();
        }

        [HttpGet("workers")]
        [Authorize(Roles = "Admin")]
        public ActionResult<List<UserDto>> GetAllWorkers()
        {
            try
            {
                var workers = _userService.GetAllWorkers();
                return Ok(workers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("searchAndSort")]
        [Authorize(Roles = "Admin")]
        public ActionResult<List<UserDisplayDTO>> SearchLoanTypes(string searchTerm, string sortField = "name", bool ascending = true)
        {
            var workers = _userService.SearchAndSortWorkers(searchTerm, sortField, ascending);
            return Ok(workers);
        }

        [HttpPost("workers")]
        [Authorize(Roles = "Admin")]
            
        public async Task<ActionResult> AddWorker([FromBody] RegisterWorkerDto dto)
        {
            try
            {
                // Get branch if it exists
                var branch = await _branchService.GetBranchAsync(dto.BranchId);
                _userService.AddWorker(dto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            return Ok();
        }

        [HttpDelete("worker/{username}")]
        [Authorize(Roles = "Admin")]
        public ActionResult DeleteWorker(string username)
        {
            try
            {
                _userService.DeleteWorker(username);
                return Ok();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
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
