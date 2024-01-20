using IdentityApi.Dto;
using IdentityApi.Models;
using System.Collections.Generic;

namespace IdentityApi.Interfaces
{
    public interface IUserService
    {
        UserDto GetUserByEmail(string email);
        UserDto GetUserByUsername(string username);
        UserDto AddUser(RegisterDto registerDto, bool isWorker);
        UserDto UpdateUser(string email, UpdateUserDto dto);
        SuccessLoginDto LoginUser(LoginDto loginDto);
        SuccessLoginDto LoginGoogle(GoogleLoginDto user);

    }
}
