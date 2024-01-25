using BranchApi.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BranchApi.Infrastructure.Configuration
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).ValueGeneratedOnAdd();

            builder.Property(a => a.BranchId).IsRequired();
            builder.Property(a => a.AppointmentDate).IsRequired();
            builder.Property(a => a.CustomerUsername).IsRequired(false); // Ovo polje može biti null

            builder.HasOne<Branch>() // Ako postoji veza sa Branch entitetom
                .WithMany() // Pretpostavljajući da Branch ima mnogo Appointment-a
                .HasForeignKey(a => a.BranchId);
        }
    }
}
