using BankAccountApi.Dto;
using BankAccountApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankAccountApi.Interfaces
{
    public interface IAccountService
    {
        List<AccountType> GetAllAccountTypes();
        Task<AccountType> CreateAccountType(AccountTypeDto accountTypeDto);
        List<AccountRequest> GetAllAccountRequests();
        Task<AccountRequest> CreateAccountRequest(string customerUsername, AccountRequestDto accountRequestDto);
        Task<bool> ReviewAccountRequest(int requestId, bool isApproved);
        Task<Account> CreateAccount(string customerUsername, AccountDto accountDto);
        Task<bool> CloseAccount(int accountId);
        List<Account> GetCustomerAccounts(string customerUsername);
    }
}
