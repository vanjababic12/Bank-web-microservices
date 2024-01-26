using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using BankAccountApi.Dto;
using BankAccountApi.Infrastructure;
using BankAccountApi.Interfaces;
using BankAccountApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Common.Exceptions;

namespace BankAccountApi.Services
{
    public class AccountService : IAccountService
    {
        private readonly BankAccountDbContext _dbContext;

        public AccountService(BankAccountDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<AccountType> SearchAndSortAccountTypes(string searchTerm, string sortField, bool ascending)
        {
            var query = _dbContext.AccountTypes.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(at => at.Name.Contains(searchTerm) || at.Description.Contains(searchTerm));
            }

            query = sortField switch
            {
                "name" => ascending ? query.OrderBy(at => at.Name) : query.OrderByDescending(at => at.Name),
                "description" => ascending ? query.OrderBy(at => at.Description) : query.OrderByDescending(at => at.Description),
                "currency" => ascending ? query.OrderBy(at => at.Currency) : query.OrderByDescending(at => at.Currency),
                _ => query
            };

            return query.Where(i => !i.IsDeleted).ToList();
        }

        public async Task<AccountType> CreateAccountType(CreateAccountTypeDto accountTypeDto)
        {
            var accountType = new AccountType
            {
                Name = accountTypeDto.Name,
                Description = accountTypeDto.Description,
                Currency = accountTypeDto.Currency,
                IsDeleted = false
            };
            _dbContext.AccountTypes.Add(accountType);
            await _dbContext.SaveChangesAsync();
            return accountType;
        }

        public List<AccountRequest> GetAllAccountRequests()
        {
            return _dbContext.AccountRequests.ToList();
        }

        public async Task<AccountRequest> CreateAccountRequest(string customerUsername, AccountRequestDto accountRequestDto)
        {
            if (_dbContext.AccountRequests.Where(i => i.CustomerUsername == customerUsername && !i.IsReviewed).ToList().Count >= 2)
            {
                throw new InvalidOperationException("Vec imate dva zahteva koja jos uvek nisu obrađena. Pokušajte opet nakon što se obrade.");
            }
            var accountRequest = new AccountRequest
            {
                CustomerUsername = customerUsername,
                AccountTypeId = accountRequestDto.AccountTypeId,
                IsReviewed = false,
                IsApproved = false
            };
            _dbContext.AccountRequests.Add(accountRequest);
            await _dbContext.SaveChangesAsync();
            return accountRequest;
        }

        public async Task<bool> ReviewAccountRequest(int requestId, bool isApproved)
        {
            var request = _dbContext.AccountRequests.Find(requestId);
            if (request == null) return false;
            if (request.IsReviewed)
            {
                throw new InvalidOperationException("Ovaj zahtev je vec obrađen.");
            }

            request.IsReviewed = true;
            request.IsApproved = isApproved;
            if (isApproved)
            {
                await CreateAccount(request.CustomerUsername, request.AccountTypeId);
            }
            await _dbContext.SaveChangesAsync();
            return true;
        }
        public async Task<Account> CreateAccount(string customerUsername, int accountTypeId)
        {
            var accountType = _dbContext.AccountTypes.FirstOrDefault(at => at.Id == accountTypeId);
            if (accountType == null)
            {
                throw new NotFoundException("Tip računa nije pronađen.");
            }

            var account = new Account
            {
                AccountTypeId = accountType.Id,
                CustomerUsername = customerUsername,
                Currency = accountType.Currency,
                IsClosed = false
            };
            _dbContext.Accounts.Add(account);
            await _dbContext.SaveChangesAsync();
            return account;
        }

        public async Task<bool> CloseAccount(int accountId)
        {
            var account = _dbContext.Accounts.Find(accountId);
            if (account == null || account.IsClosed) return false;

            account.IsClosed = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public List<Account> GetCustomerAccounts(string customerUsername)
        {
            return _dbContext.Accounts
                .Where(a => a.CustomerUsername == customerUsername)
                .ToList()
                .Select(i =>
                {
                    i.AccountType = _dbContext.AccountTypes.Find(i.AccountTypeId);
                    return i;
                })
                .ToList();
        }

        public async Task<bool> DeleteAccountType(int accountTypeId)
        {
            var accountType = _dbContext.AccountTypes.Find(accountTypeId);
            if (accountType == null || accountType.IsDeleted)
            {
                return false;
            }

            accountType.IsDeleted = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }

    }

}
