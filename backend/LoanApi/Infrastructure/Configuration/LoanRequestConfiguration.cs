using LoanApi.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace LoanApi.Infrastructure.Configuration
{
    public class LoanRequestConfiguration : IEntityTypeConfiguration<LoanRequest>
    {
        public void Configure(EntityTypeBuilder<LoanRequest> builder)
        {
            builder.HasKey(lr => lr.Id);
            builder.Property(lr => lr.CustomerUsername).IsRequired();
            builder.Property(lr => lr.Amount).HasColumnType("decimal(18, 2)");
            builder.Property(lr => lr.NumberOfInstallments).IsRequired();
            builder.Property(lr => lr.IsReviewed).IsRequired();
            builder.Property(lr => lr.IsApproved).IsRequired();

            builder.HasOne(lr => lr.LoanType)
                .WithMany()
                .HasForeignKey(lr => lr.LoanTypeId);
        }
    }

}
