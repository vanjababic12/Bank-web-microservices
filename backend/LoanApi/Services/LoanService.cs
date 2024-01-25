using LoanApi.Dto;
using LoanApi.Infrastructure;
using LoanApi.Interfaces;
using LoanApi.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LoanApi.Services
{
    public class LoanService : ILoanService
    {
        private readonly LoanDbContext _dbContext;

        public LoanService(LoanDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public List<LoanType> SearchAndSortLoanTypes(string searchTerm, string sortField, bool ascending)
        {
            var query = _dbContext.LoanTypes.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(lt => lt.Name.Contains(searchTerm) || lt.Description.Contains(searchTerm));
            }

            query = sortField switch
            {
                "name" => ascending ? query.OrderBy(lt => lt.Name) : query.OrderByDescending(lt => lt.Name),
                "description" => ascending ? query.OrderBy(lt => lt.Description) : query.OrderByDescending(lt => lt.Description),
                "interestRate" => ascending ? query.OrderBy(lt => lt.InterestRate) : query.OrderByDescending(lt => lt.InterestRate),
                _ => query
            };

            return query.ToList();
        }
        public List<LoanType> GetAllLoanTypes()
        {
            return _dbContext.LoanTypes.Where(lt => !lt.IsDeleted).ToList();
        }

        public async Task<LoanType> CreateLoanType(LoanTypeDto loanTypeDto)
        {
            var loanType = new LoanType
            {
                Name = loanTypeDto.Name,
                InterestRate = loanTypeDto.InterestRate,
                Description = loanTypeDto.Description,
                IsDeleted = false
            };
            _dbContext.LoanTypes.Add(loanType);
            await _dbContext.SaveChangesAsync();
            return loanType;
        }

        public async Task<bool> DeleteLoanType(int loanTypeId)
        {
            var loanType = _dbContext.LoanTypes.Find(loanTypeId);
            if (loanType == null || loanType.IsDeleted) return false;

            loanType.IsDeleted = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public List<LoanRequest> GetAllLoanRequests()
        {
            return _dbContext.LoanRequests.ToList();
        }

        public async Task<LoanRequest> CreateLoanRequest(string customerUsername, LoanRequestDto loanRequestDto)
        {
            var loanRequest = new LoanRequest
            {
                CustomerUsername = customerUsername,
                LoanTypeId = loanRequestDto.LoanTypeId,
                Amount = loanRequestDto.Amount,
                NumberOfInstallments = loanRequestDto.NumberOfInstallments,
                IsReviewed = false,
                IsApproved = false
            };
            _dbContext.LoanRequests.Add(loanRequest);
            await _dbContext.SaveChangesAsync();
            return loanRequest;
        }

        public async Task<bool> ReviewLoanRequest(int requestId, bool isApproved)
        {
            var loanRequest = _dbContext.LoanRequests.Find(requestId);
            if (loanRequest == null) return false;

            loanRequest.IsReviewed = true;
            loanRequest.IsApproved = isApproved;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public List<LoanRequest> GetUserLoanRequests(string customerUsername)
        {
            return _dbContext.LoanRequests
                .Where(lr => lr.CustomerUsername == customerUsername)
                .ToList();
        }
    }

}
