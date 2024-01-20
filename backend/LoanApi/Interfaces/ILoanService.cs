using LoanApi.Dto;
using LoanApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LoanApi.Interfaces
{
    public interface ILoanService
    {
        List<LoanType> GetAllLoanTypes();
        List<LoanType> SearchAndSortLoanTypes(string searchTerm, string sortField, bool ascending);
        Task<LoanType> CreateLoanType(LoanTypeDto loanTypeDto);
        Task<bool> DeleteLoanType(int loanTypeId);
        List<LoanRequest> GetAllLoanRequests();
        List<LoanRequest> GetUserLoanRequests(string customerUsername);
        Task<LoanRequest> CreateLoanRequest(string customerUsername, LoanRequestDto loanRequestDto);
        Task<bool> ReviewLoanRequest(int requestId, bool isApproved);
    }

}
