using BankAccountApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BankAccountApi.Infrastructure
{
    public class BankAccountDbContext : DbContext
    {
        public BankAccountDbContext(DbContextOptions options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //Kazemo mu da pronadje sve konfiguracije u Assembliju i da ih primeni nad bazom
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(BankAccountDbContext).Assembly);
        }
        public virtual DbSet<Account> Accounts { get; set; }
        public virtual DbSet<AccountType> AccountTypes { get; set; }
        public virtual DbSet<AccountRequest> AccountRequests { get; set; }
    }
}
