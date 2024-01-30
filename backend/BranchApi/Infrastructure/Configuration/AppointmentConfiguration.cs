using BranchApi.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace BranchApi.Infrastructure.Configuration
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).ValueGeneratedOnAdd();

            builder.Property(a => a.BranchId).IsRequired();
            builder.Property(a => a.IsCanceled).IsRequired().HasDefaultValue(false);
            builder.Property(a => a.AppointmentDate).IsRequired();
            builder.Property(a => a.CustomerUsername).IsRequired(false); // Ovo polje može biti null

            // Relationship configuration
            builder.HasOne(a => a.Branch)
                   .WithMany(b => b.Appointments)
                   .HasForeignKey(a => a.BranchId);
        }
    }
}
