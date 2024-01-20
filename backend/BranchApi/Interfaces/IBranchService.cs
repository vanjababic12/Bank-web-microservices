using BranchApi.Dto;
using BranchApi.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BranchApi.Interfaces
{
    public interface IBranchService
    {
        List<Branch> GetAllBranches();
        Branch GetBranch(int id);
        List<Branch> SearchAndSortBranches(string searchTerm, string sortField, bool ascending);
        Task<Branch> CreateBranch(BranchDto branchDto);
        Task<Branch> UpdateBranch(int id, BranchDto branchDto);
        void DeleteBranch(int id);
        List<Appointment> GetAvailableAppointments(int branchId, DateTime date);
        Task<BookAppointmentResult> BookAppointment(int appointmentId, String clientUsername);
        Task<bool> CancelAppointment(int appointmentId);
        List<Appointment> GetUserAppointments(string username);

    }
}
