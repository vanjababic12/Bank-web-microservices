using Microsoft.EntityFrameworkCore;
using ExchangeRateApi.Models;

namespace ExchangeRateApi.Infrastructure
{
    public class ExchangeRateDbContext : DbContext
    {
        public ExchangeRateDbContext(DbContextOptions options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //Kazemo mu da pronadje sve konfiguracije u Assembliju i da ih primeni nad bazom
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ExchangeRateDbContext).Assembly);
        }
        public virtual DbSet<ExchangeRate> ExchangeRates { get; set; }
    }
}
