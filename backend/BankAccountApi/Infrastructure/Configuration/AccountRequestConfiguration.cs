using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using BankAccountApi.Models;

namespace BankAccountApi.Infrastructure.Configuration
{
    public class AccountRequestConfiguration : IEntityTypeConfiguration<AccountRequest>
    {
        public void Configure(EntityTypeBuilder<AccountRequest> builder)
        {
            builder.HasKey(ar => ar.Id);
            builder.Property(ar => ar.Id).ValueGeneratedOnAdd();
            builder.Property(ar => ar.CustomerUsername).IsRequired();
            builder.Property(ar => ar.AccountTypeId).IsRequired();
            builder.Property(ar => ar.IsReviewed).IsRequired();
            builder.Property(ar => ar.IsApproved).IsRequired();
        }
    }

}
