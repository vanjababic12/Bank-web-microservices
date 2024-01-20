using AutoMapper;
using IdentityApi.Dto;
using IdentityApi.Infrastructure;
using IdentityApi.Interfaces;
using IdentityApi.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace IdentityApi.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly IdentityDbContext _dbContext;

        private readonly IConfigurationSection _secretKey;
        private readonly IConfigurationSection _imagePath;

        public UserService(IConfiguration config, IMapper mapper, IdentityDbContext dbContext)
        {
            _secretKey = config.GetSection("SecretKey");
            _imagePath = config.GetSection("StoredFilesPath");
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public UserDto AddUser(RegisterDto registerDto, bool isWorker)
        {
            User user = _dbContext.Users.ToList().Find(x => x.Username.ToLower() == registerDto.Username.ToLower() || x.Email == registerDto.Email);
            if (user != null) throw new Exception("User with same username-email already exists.");

            user = _mapper.Map<User>(registerDto);
            user.Role = (isWorker) ? EUserRole.WORKER : EUserRole.USER;
            user.Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
            user.Username = user.Username;

            _dbContext.Add(user);
            _dbContext.SaveChanges();

            var retVal = _mapper.Map<UserDto>(_dbContext.Users.ToList().Find(x => x.Username.ToLower() == registerDto.Username.ToLower()));

            return retVal;
        }
        public List<UserDto> GetAllWorkers()
        {
            var workers = _dbContext.Users
                .Where(u => u.Role == EUserRole.WORKER)
                .ToList();
            return _mapper.Map<List<UserDto>>(workers);
        }
        public void DeleteWorker(string username)
        {
            var worker = _dbContext.Users.FirstOrDefault(u => u.Username == username && u.Role == EUserRole.WORKER);
            if (worker == null)
            {
                throw new Exception("Worker not found");
            }

            _dbContext.Users.Remove(worker);
            _dbContext.SaveChanges();
        }
        public UserDto GetUserByEmail(string email)
        {
            return _mapper.Map<UserDto>(_dbContext.Users.Find(email));
        }

        public UserDto GetUserByUsername(string username)
        {
            return _mapper.Map<UserDto>(_dbContext.Users.ToList().Find(i => i.Username.ToLower() == username.ToLower()));
        }

        public SuccessLoginDto LoginUser(LoginDto loginDto)
        {
            User user = _dbContext.Users.ToList().Find(x => x.Username.ToLower() == loginDto.Username.ToLower());

            if (user == null)
                return null;

            if (BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))//Uporedjujemo hes pasvorda iz baze i unetog pasvorda
            {
                return new SuccessLoginDto()
                {
                    Token = GenerateToken(user),
                    Role = user.Role.ToString()
                };
            }
            else
            {
                return null;
            }
        }

        private string GenerateToken(User user)
        {
            List<Claim> claims = new List<Claim>();
            var userRole = "User";
            if (user.Role == EUserRole.ADMIN) userRole = "Admin";
            if (user.Role == EUserRole.WORKER) userRole = "Seller";

            claims.Add(new Claim(ClaimTypes.Role, userRole)); //Add user type to claim
            claims.Add(new Claim(ClaimTypes.Name, user.Email));
            //Kreiramo kredencijale za potpisivanje tokena. Token mora biti potpisan privatnim kljucem
            //kako bi se sprecile njegove neovlascene izmene
            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(
                issuer: "http://localhost:5001", //url servera koji je izdao token
                claims: claims, //claimovi
                expires: DateTime.Now.AddMinutes(60), //vazenje tokena u minutama
                signingCredentials: signinCredentials //kredencijali za potpis
            );
            string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            return tokenString;
        }

        public UserDto UpdateUser(string email, UpdateUserDto dto)
        {
            var user = _dbContext.Users.Find(email);
            if (user == null)
                throw new Exception("User not found");
            _mapper.Map<UpdateUserDto, User>(dto, user);
            _dbContext.SaveChanges();
            return _mapper.Map<UserDto>(user);
        }
    }
}
