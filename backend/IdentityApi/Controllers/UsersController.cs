using IdentityApi.Dto;
using IdentityApi.Interfaces;
using IdentityApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace IdentityApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _config;

        public UsersController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _config = configuration;
        }

        [HttpGet]
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
                
                _userService.AddUser(dto, isWorker: false);
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

        [HttpPost("workers")]
        [Authorize(Roles = "Admin")]

        public ActionResult AddWorker([FromBody] RegisterDto dto)
        {
            try
            {

                _userService.AddUser(dto, isWorker: true);
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
                return Ok("Worker successfully deleted.");
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
