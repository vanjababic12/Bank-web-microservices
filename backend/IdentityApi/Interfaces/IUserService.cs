﻿using IdentityApi.Dto;
using IdentityApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace IdentityApi.Interfaces
{
    public interface IUserService
    {
        UserDto GetUserByEmail(string email);
        UserDto GetUserByUsername(string username);
        List<UserDto> GetAllWorkers();
        void DeleteWorker(string username);
        UserDto AddUser(RegisterDto registerDto, bool isWorker);
        UserDto UpdateUser(string email, UpdateUserDto dto);
        SuccessLoginDto LoginUser(LoginDto loginDto);

    }
}
