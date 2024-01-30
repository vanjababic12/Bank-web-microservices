using IdentityApi.Dto;
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
        UserDto AddUser(RegisterDto registerDto);
        UserDto AddWorker(RegisterWorkerDto dto);
        UserDto UpdateUser(string email, UpdateUserDto dto);
        SuccessLoginDto LoginUser(LoginDto loginDto);
        List<UserDisplayDTO> SearchAndSortWorkers(string searchTerm, string sortField, bool ascending);

    }
}
