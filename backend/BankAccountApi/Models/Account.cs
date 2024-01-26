using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BankAccountApi.Models
{
    public class Account
    {
        public int Id { get; set; }
        public int AccountTypeId { get; set; }
        public string CustomerUsername { get; set; }
        public string Currency { get; set; }
        public bool IsClosed { get; set; }

        // Veza sa AccountType
        public virtual AccountType AccountType { get; set; }
    }

}
