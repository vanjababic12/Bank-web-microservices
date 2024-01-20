using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BankAccountApi.Models;

namespace BankAccountApi.Infrastructure.Configuration
{
    public class AccountConfiguration : IEntityTypeConfiguration<Account>
    {
        public void Configure(EntityTypeBuilder<Account> builder)
        {
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).ValueGeneratedOnAdd();
            builder.Property(a => a.CustomerUsername).IsRequired();
            builder.Property(a => a.Currency).IsRequired();
            builder.Property(a => a.IsClosed).IsRequired();

            builder.HasOne(a => a.AccountType)
                .WithMany()
                .HasForeignKey(a => a.AccountTypeId);
        }
    }

}
