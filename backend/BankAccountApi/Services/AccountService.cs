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

        public List<AccountType> GetAllAccountTypes()
        {
            return _dbContext.AccountTypes
                .Where(at => !at.IsDeleted)
                .ToList();
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
                _ => query
            };

            return query.ToList();
        }

        public async Task<AccountType> CreateAccountType(AccountTypeDto accountTypeDto)
        {
            var accountType = new AccountType
            {
                Name = accountTypeDto.Name,
                Description = accountTypeDto.Description
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

            request.IsReviewed = true;
            request.IsApproved = isApproved;
            await _dbContext.SaveChangesAsync();
            return true;
        }
        public async Task<Account> CreateAccount(string customerUsername, AccountDto accountDto)
        {
            var accountType = _dbContext.AccountTypes.FirstOrDefault(at => at.Id == accountDto.AccountTypeId);
            if (accountType == null)
            {
                throw new NotFoundException("Tip računa nije pronađen.");
            }

            var account = new Account
            {
                AccountTypeId = accountDto.AccountTypeId,
                CustomerUsername = customerUsername,
                Currency = accountType.Currency, // Dohvata valutu iz AccountType
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
                .Where(a => a.CustomerUsername == customerUsername && !a.IsClosed)
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
