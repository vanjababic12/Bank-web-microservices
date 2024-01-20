using BankAccountApi.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BankAccountApi.Infrastructure.Configuration
{
    public class AccountTypeConfiguration : IEntityTypeConfiguration<AccountType>
    {
        public void Configure(EntityTypeBuilder<AccountType> builder)
        {
            builder.HasKey(at => at.Id);
            builder.Property(at => at.Id).ValueGeneratedOnAdd();
            builder.Property(at => at.Name).IsRequired();
            builder.Property(at => at.Description).IsRequired();
            builder.Property(at => at.Currency).IsRequired();
            builder.Property(at => at.IsDeleted).HasDefaultValue(false);
        }
    }

}
