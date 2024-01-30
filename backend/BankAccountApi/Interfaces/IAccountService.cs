using BankAccountApi.Dto;
using BankAccountApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankAccountApi.Interfaces
{
    public interface IAccountService
    {
        List<AccountType> SearchAndSortAccountTypes(string searchTerm, string sortField, bool ascending);
        Task<bool> DeleteAccountType(int accountTypeId);
        Task<AccountType> CreateAccountType(CreateAccountTypeDto accountTypeDto);
        List<AccountRequest> GetAllAccountRequests();
        Task<AccountRequest> CreateAccountRequest(string customerUsername, AccountRequestDto accountRequestDto);
        Task<bool> ReviewAccountRequest(int requestId, bool isApproved);
        Task<Account> CreateAccount(string customerUsername, int accountTypeId);
        Task<bool> CloseAccount(int accountId);
        List<Account> GetCustomerAccounts(string customerUsername);
        void ExchangeTransfer(string customerUsername, int accountFromId, int accountToId, double amount, List<ExchangeRate> exchangeRates);
    }
}
