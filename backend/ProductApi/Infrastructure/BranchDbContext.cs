using BranchApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BranchApi.Infrastructure
{
    public class BranchDbContext : DbContext
    {
        public BranchDbContext(DbContextOptions options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //Kazemo mu da pronadje sve konfiguracije u Assembliju i da ih primeni nad bazom
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(BranchDbContext).Assembly);
        }
        public virtual DbSet<Branch> Branches { get; set; }
        public virtual DbSet<Appointment> Appointments { get; set; }
    }
}
