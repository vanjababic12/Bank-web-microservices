using LoanApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LoanApi.Infrastructure
{
    public class LoanDbContext : DbContext
    {
        public LoanDbContext(DbContextOptions options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //Kazemo mu da pronadje sve konfiguracije u Assembliju i da ih primeni nad bazom
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(LoanDbContext).Assembly);
        }
        public virtual DbSet<LoanType> LoanTypes { get; set; }
        public virtual DbSet<LoanRequest> LoanRequests { get; set; }
    }
}
