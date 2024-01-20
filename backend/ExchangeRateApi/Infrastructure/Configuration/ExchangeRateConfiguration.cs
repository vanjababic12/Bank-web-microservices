using ExchangeRateApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LoanApi.Infrastructure.Configuration
{
    public class ExchangeRateConfiguration : IEntityTypeConfiguration<ExchangeRate>
    {
        public void Configure(EntityTypeBuilder<ExchangeRate> builder)
        {
            builder.HasKey(er => er.Id);
            builder.Property(er => er.Id).ValueGeneratedOnAdd();

            builder.Property(er => er.Currency).IsRequired();
            builder.Property(er => er.Rate).HasColumnType("decimal(18, 4)").IsRequired();
            builder.Property(er => er.Date).IsRequired();
        }
    }

}
